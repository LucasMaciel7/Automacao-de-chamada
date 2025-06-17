# core/Controller/presenca.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.service.presenca import PresencaService

class RelatorioPresencaRoute(APIView):
    def __init__(self):
        self.presenca_service = PresencaService()

    def get(self, request):
        try:
            relatorio = self.presenca_service.presencas_do_dia()
            return Response(relatorio, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"erro": f"Erro ao gerar relatório: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
