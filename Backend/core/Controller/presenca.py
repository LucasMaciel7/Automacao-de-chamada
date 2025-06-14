from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.serializer import RegistroPresencaSerializer

from core.service.aluno import AlunoService



class PresencaManagerRoute(APIView):
    
    def __init__(self):
        self.service = AlunoService()
    
    
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
            resultado = self.service.compara_alunos(aluno_ra, imagem_base64)

            if not resultado:
                return Response(
                    {'erro': 'Rosto não corresponde ao aluno informado.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Aqui entraria a lógica de salvar presença na tabela Presenca
            return Response({'status': 'Ponto registrado com sucesso.'}, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({'erro': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'erro': f'Erro inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
