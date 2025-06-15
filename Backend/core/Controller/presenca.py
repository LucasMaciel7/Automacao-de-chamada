from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.serializer import RegistroPresencaSerializer

from core.service.aluno import AlunoService
from core.service.presenca import PresencaService


class PresencaManagerRoute(APIView):
    
    def __init__(self):
        self.service = AlunoService()
        self.presenca_service = PresencaService()
    
    def post(self, request):
        """
        Registra o ponto de presença do aluno.
        """
        serializer = RegistroPresencaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        aluno_ra = serializer.validated_data['ra']
        imagem_base64 = serializer.validated_data['imagem_base64']
        
        try:
            # Compara o rosto do aluno com a imagem base64
            resultado = self.service.compara_alunos(aluno_ra, imagem_base64)

            if not resultado:
                return Response(
                    {'erro': 'Rosto não corresponde ao aluno informado.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Registra a presença do aluno
            registra_presenca = self.presenca_service.registrar_presenca(
                aluno_ra = aluno_ra   
            )
            
            return Response({
                "dados": registra_presenca
            }, status=status.HTTP_200_OK)  
    

        except ValueError as e:
            return Response({'erro': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'erro': f'Erro inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get(self, request):
        try:
            
            relatorio = self.presenca_service.get_relatorio_de_presenca()
            return Response(relatorio, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"erro": f"Erro ao gerar relatório: {str(e)}"}, status=500)

        
