from django.urls import path
from core.Controller.aluno import AlunoManagerRoute

from core.Controller.realtorio import RelatorioPresencaRoute
from core.Controller.presenca import PresencaManagerRoute

urlpatterns = [
    path('alunos/', AlunoManagerRoute.as_view(), name='criar-aluno'),
    path('ponto/', PresencaManagerRoute.as_view(), name='registrar-presenca'),
    path('presenca/', RelatorioPresencaRoute.as_view(), name="Presencas do dia")
]
