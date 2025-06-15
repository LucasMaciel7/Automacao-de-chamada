from core.models.models import Presenca, Aula
from datetime import date

class PresencaRepository:
    
    @staticmethod
    def criar_presenca(aluno, hora_entrada, reconhecido_por="tablet"):
        return Presenca.objects.create(
            aluno=aluno,
            data=date.today(),
            hora_entrada=hora_entrada,
            reconhecido_por=reconhecido_por
        )
    
    @staticmethod
    def atualizar_saida(presenca, hora_saida):
        presenca.hora_saida = hora_saida
        presenca.save()
        return presenca

    @staticmethod
    def get_presenca_do_dia(aluno):
        return Presenca.objects.filter(aluno=aluno, data=date.today()).first()
    
    @staticmethod
    def get_aulas_do_dia():
        """
        Retorna as aulas do dia.
        """
        DIAS_EM_PORTUGUES = {
        'Monday': 'segunda',
        'Tuesday': 'terca',
        'Wednesday': 'quarta',
        'Thursday': 'quinta',
        'Friday': 'sexta',
        'Saturday': 'sabado',
        'Sunday': 'domingo',
        }

        dia_semana_ingles = date.today().strftime('%A')
        dia_semana_pt = DIAS_EM_PORTUGUES[dia_semana_ingles]
        return Aula.objects.filter(dia_semana__iexact=dia_semana_pt).order_by('horario_inicio')
    
    