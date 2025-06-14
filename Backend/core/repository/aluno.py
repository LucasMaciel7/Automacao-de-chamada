from core.models.models import Aluno



class AlunoRepository:
    
    @staticmethod
    def create_aluno(nome, email, ra, foto_uri, embeddings):
        """
        Cria um novo aluno no banco de dados.
        """
        aluno = Aluno.objects.create (
            nome=nome,
            email=email,
            ra=ra,
            foto_uri=foto_uri,
            embeddings=embeddings
        )
        aluno.save()
        return aluno

    @staticmethod
    def get_aluno_by_email(email):
        """
        Busca um aluno pelo e-mail.
        """
        return Aluno.objects.filter(email=email).first()

    @staticmethod
    def get_aluno_by_ra(ra):
        """
        Busca um aluno pelo RA.
        """
        return Aluno.objects.filter(ra=ra).first()
