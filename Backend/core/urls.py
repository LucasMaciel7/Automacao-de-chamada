from django.urls import path
from core.Controller.aluno import AlunoManagerRoute

urlpatterns = [
    path('alunos/', AlunoManagerRoute.as_view(), name='criar-aluno'),
]
