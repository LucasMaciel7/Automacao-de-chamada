from django.urls import path
from core.Controller.aluno import AlunoManagerRoute

from core.Controller.realtorio import RelatorioPresencaRoute
from core.Controller.presenca import PresencaManagerRoute
from core.Controller.login import LoginManageRouter

from rest_framework import permissions
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from drf_yasg.views import get_schema_view




swagger_documentation = get_schema_view(
    openapi.Info(
        title = "Automação Chamada",
        default_version = "v1",
        contact = openapi.Contact(email= "lucasmacielcampos@gmail.com"),
        description = "API Documentation"
    ),
    public = True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes = ([])
)

urlpatterns = [
    path('alunos/', AlunoManagerRoute.as_view(), name='criar-aluno'),
    path('ponto/', PresencaManagerRoute.as_view(), name='registrar-presenca'),
    path('presenca/', RelatorioPresencaRoute.as_view(), name="Presencas do dia"),
    path('login/', LoginManageRouter.as_view(), name="Login"), 
    path('api/', swagger_documentation.with_ui('swagger', cache_timeout=0), name= "Documentation")

]
