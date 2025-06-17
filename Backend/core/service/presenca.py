from core.repository.presenca import PresencaRepository
from core.repository.aluno import AlunoRepository
from core.service.aluno import AlunoService
from datetime import datetime, date, timedelta, time
from django.utils import timezone

from datetime import datetime, date, timedelta

from core.models import Aula
from core.repository.presenca import Presenca
from collections import defaultdict



class PresencaService:
    def __init__(self):
        self.presenca_repository = PresencaRepository()
        self.aluno_repository = AlunoRepository()
        self.aluno_service = AlunoService()
        
        
    def presencas_do_dia(self):
        presencas = self.presenca_repository.get_todas_presencas_do_dia()
        relatorio = []
        for presenca in presencas:
            relatorio.append({
                "nome": presenca.aluno.nome,
                "ra": presenca.aluno.ra,
                "entrada": presenca.hora_entrada.strftime("%H:%M") if presenca.hora_entrada else None,
                "saida": presenca.hora_saida.strftime("%H:%M") if presenca.hora_saida else None,
            })
        return relatorio
    
        

    def registrar_presenca(self, aluno_ra, reconhecido_por="tablet"):
        """
        Registra a presença de um aluno. Se for a primeira do dia, marca entrada.
        Se já houver entrada e não houver saída, marca a saída.
        """
        aluno =  self.aluno_repository.get_aluno_by_ra(aluno_ra)
        if not aluno:
            raise ValueError("Aluno não encontrado")
        
        # Hora atual e aulas da semana 
        agora = timezone.localtime()
        hoje = agora.date()
        presenca = self.presenca_repository.get_presenca_do_dia(aluno)
        aulas_do_dia = self.presenca_repository.get_aulas_do_dia()
        
        if not aulas_do_dia:
            return {
                "status": "erro",
                "mensagem": "Nenhuma aula registrada para hoje.",
                "ra": aluno.ra,
                "nome": aluno.nome
            }
        
        # Busca qual primeira e ultima aula do usuario     
        primeira_aula = aulas_do_dia[0]
        ultima_aula = aulas_do_dia.last() or aulas_do_dia[len(aulas_do_dia) - 1]
        
        
        # Verifica se a hora atual está dentro do intervalo de aulas
        entrada_liberada = timezone.make_aware(datetime.combine(hoje, primeira_aula.horario_inicio) - timedelta(minutes=30))
        saida_liberada = timezone.make_aware(datetime.combine(hoje, ultima_aula.horario_fim)) + timedelta(minutes=30)



        # Verifica se a hora atual é pelo menos 30 minutos antes da pimeira aula 
        if agora < entrada_liberada:

            return {
                "status": "erro",
                "mensagem": "O Ponto de entrada é liberado apenas 30 minutos antes da primeira aula.",
                "ra": aluno.ra,
                "nome": aluno.nome
            }
        
        # Verifica se a hora atual é pelo menos 30 minutos após a última aula
        elif agora > saida_liberada:
            
            return {
                "status": "erro",
                "mensagem": "O prazo para registrar o ponto já expirou. Última aula foi há mais de 30 minutos.",
                "ra": aluno.ra,
                "nome": aluno.nome
            }
        
        # Se não houver presença registrada, registra um ponto de entrada    
        elif not presenca:
            self.presenca_repository.criar_presenca(
                aluno=aluno,
                hora_entrada=agora.time(),
                reconhecido_por=reconhecido_por
            )
            
            return {
                "status": "sucesso",
                "tipo": "entrada",
                "data": date.today().strftime("%d/%m/%Y"),
                "hora": agora.strftime("%H:%M:%S"),
                "ra": aluno.ra,
                "nome": aluno.nome
            }
        # Se ja tiver uma entrada e não tiver saída, registra um ponto de saída
        elif presenca.hora_saida is None:
            self.presenca_repository.atualizar_saida(
                presenca=presenca,
                hora_saida=agora
            )
            
            return {
                "status": "sucesso",
                "tipo": "saida",
                "data": date.today().strftime("%d/%m/%Y"),
                "hora": agora.strftime("%H:%M:%S"),
                "ra": aluno.ra,
                "nome": aluno.nome
            }

        # Já tem entrada e saída, retorna o mesmo objeto
        return {
            "status": "completo",
            "mensagem": "Ponto já registrado (entrada e saída)",
            "ra": aluno.ra,
            "nome": aluno.nome
        }  


   
    def get_relatorio_de_presenca(self):
        hoje = date.today()
        presencas = Presenca.objects.filter(data=hoje).select_related('aluno')
        
        dias_semana = {
            'monday': 'segunda',
            'tuesday': 'terca',
            'wednesday': 'quarta',
            'thursday': 'quinta',
            'friday': 'sexta',
            'saturday': 'sabado',
            'sunday': 'domingo'
        }

        dia_semana = dias_semana[hoje.strftime('%A').lower()]
        aulas_do_dia = Aula.objects.filter(dia_semana=dia_semana).select_related('professor')

        relatorio = defaultdict(list)

        if not presencas or not aulas_do_dia:
            return relatorio

        intervalo_inicio = datetime.combine(hoje, time(20, 40))
        intervalo_fim = datetime.combine(hoje, time(20, 55))

        for presenca in presencas:
            aluno = presenca.aluno

            if not presenca.hora_entrada or not presenca.hora_saida:
                for aula in aulas_do_dia:
                    relatorio[aluno.ra].append({
                        "aluno": aluno.nome,
                        "ra": aluno.ra,
                        "disciplina": aula.disciplina,
                        "mensagem": "Ponto incompleto",
                        "entrada": presenca.hora_entrada.strftime('%H:%M') if presenca.hora_entrada else None,
                        "saida": presenca.hora_saida.strftime('%H:%M') if presenca.hora_saida else None,
                        "status": "Indefinido"
                    })
                continue

            ponto_entrada = datetime.combine(hoje, presenca.hora_entrada)
            ponto_saida = datetime.combine(hoje, presenca.hora_saida)

            for aula in aulas_do_dia:
                professor = aula.professor
                aula_inicio = datetime.combine(hoje, aula.horario_inicio)
                aula_fim = datetime.combine(hoje, aula.horario_fim)

                # Se não há sobreposição entre ponto e aula, ignora
                if ponto_saida <= aula_inicio or ponto_entrada >= aula_fim:
                    continue

                # Garante que o tempo fique no intervalo da aula
                entrada_comparada = max(ponto_entrada, aula_inicio)
                saida_comparada = min(ponto_saida, aula_fim)

                minutos_presenca = (saida_comparada - entrada_comparada).total_seconds() / 60

                # Desconta tempo de intervalo de café (se aplicável)
                if entrada_comparada < intervalo_fim and saida_comparada > intervalo_inicio:
                    inter_inicio = max(entrada_comparada, intervalo_inicio)
                    inter_fim = min(saida_comparada, intervalo_fim)
                    minutos_presenca -= (inter_fim - inter_inicio).total_seconds() / 60

                duracao_aula = (aula_fim - aula_inicio).total_seconds() / 60

                if aula_inicio < intervalo_fim and aula_fim > intervalo_inicio:
                    inter_inicio = max(aula_inicio, intervalo_inicio)
                    inter_fim = min(aula_fim, intervalo_fim)
                    duracao_aula -= (inter_fim - inter_inicio).total_seconds() / 60

                status = "Presente" if minutos_presenca >= duracao_aula * 0.75 else "Ausente"

                relatorio[aluno.ra].append({
                    "aluno": aluno.nome,
                    "ra": aluno.ra,
                    "disciplina": aula.disciplina,
                    "professor": professor.nome,
                    "entrada": entrada_comparada.strftime('%H:%M'),
                    "saida": saida_comparada.strftime('%H:%M'),
                    "tempo_presente_minutos": int(minutos_presenca),
                    "duracao_aula_minutos": int(duracao_aula),
                    "status": status
                })

        return relatorio