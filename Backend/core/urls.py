from django.urls import path
from core.Controller.aluno import AlunoManagerRoute

from core.Controller.presenca import PresencaManagerRoute

urlpatterns = [
    path('alunos/', AlunoManagerRoute.as_view(), name='criar-aluno'),
    path('registra_ponto/', PresencaManagerRoute.as_view(), name='registrar-presenca'),
]
