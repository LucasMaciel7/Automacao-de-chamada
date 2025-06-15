import base64
import face_recognition
from io import BytesIO
from core.repository.aluno import AlunoRepository

class AlunoService:
    def __init__(self):
        self.aluno_repository = AlunoRepository()

    def criar_aluno(self, nome, email, ra, foto_uri):
        """
        Cria um novo aluno no banco de dados.
        """
        # Valida se o usuario já existe
        if self.aluno_repository.get_aluno_by_email(email):
            raise ValueError("Já existe um aluno com este e-mail.")

        if self.aluno_repository.get_aluno_by_ra(ra):
            raise ValueError("Já existe um aluno com este RA.")
        
        # Verifica se a imagem foi processada corretamente
        if foto_uri is None:
            raise ValueError ({'erro': 'Imagem não pôde ser processada.'}, status=400)
        
        # Gera encodings da imagem
        try:
            image = face_recognition.load_image_file(foto_uri)
            face_encodings = face_recognition.face_encodings(image)
            
            # Verifica se algum rosto foi encontrado
            if not face_encodings:
                raise ValueError("Nenhum rosto encontrado na imagem.")
            
            embeddings = face_encodings[0].tolist()
            
            # Cria o aluno
            return self.aluno_repository.create_aluno(nome, email, ra, foto_uri, embeddings)

        except Exception as e:
            raise ValueError(f"Erro ao processar a imagem: {str(e)}")



    def compara_alunos(self, ra, base64_image):
        """
        Compara a imagem recebida com o aluno pelo RA.
        """
        
        # Busca o aluno pelo RA no banco de dados
        aluno = self.aluno_repository.get_aluno_by_ra(ra)
        if not aluno:
            raise ValueError("Aluno não encontrado.")

        # Extrai o encoding salvo do banco
        try:
            
            aluno_encoding = aluno.embeddings
        except Exception:
            raise ValueError("Erro ao carregar encoding do aluno.")

        try:
            # Remove prefixo base64 se necessário
            if ',' in base64_image:
                base64_image = base64_image.split(',')[1]

            # Decodifica e processa a imagem recebida
            image_data = base64.b64decode(base64_image)
            imagem_aluno = face_recognition.load_image_file(BytesIO(image_data))
            encoding_list = face_recognition.face_encodings(imagem_aluno)

            if not encoding_list:
                raise ValueError("Nenhum rosto detectado na imagem enviada.")

            encoding_aluno = encoding_list[0]

            # Compara os embeddings
            resultado_comparacao = face_recognition.compare_faces([aluno_encoding], encoding_aluno, tolerance=0.6)

            return resultado_comparacao[0]  # True ou False

        except Exception as e:
            raise ValueError(f"Erro ao processar a imagem: {str(e)}")
        
        
            
        



    
    