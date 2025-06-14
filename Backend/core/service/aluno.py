from core.repository.aluno import AlunoRepository

import face_recognition

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
        
        
        
            
        



    
    