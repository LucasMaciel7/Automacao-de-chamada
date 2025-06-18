from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.serializer import AlunoCreateSerializer


from core.utils.imagem import salvar_imagem_base64_em_arquivo
from core.service.aluno import AlunoService
from django.utils.decorators import method_decorator

from drf_yasg.utils import swagger_auto_schema


class AlunoManagerRoute(APIView):
    
    def __init__(self):
        self.service = AlunoService()
  
  
  
    @swagger_auto_schema(
        operation_summary="Cadastrar novo aluno",
        request_body=AlunoCreateSerializer,
        responses={
            201: "Aluno cadastrado com sucesso.",
            400: "Dados inválidos.",
            500: "Erro interno."
        },
        security=[{'Bearer': []}],  # <- ISSO USA O HEADER AUTOMATICAMENTE
    )
    
    def post(self, request):
        serializer = AlunoCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            nome = serializer.validated_data['nome']
            email = serializer.validated_data['email']
            ra = serializer.validated_data['ra']
            image_base64 = serializer.validated_data['image_base64']

            # Salva imagem no sistema de arquivos
            foto_uri = salvar_imagem_base64_em_arquivo(image_base64)

            # Chama o service
            aluno = self.service.criar_aluno(nome, email, ra, foto_uri)

            return Response({'status': 'Aluno cadastrado com sucesso.', 'id': str(aluno.id)}, status=201)

        except ValueError as ve:
            return Response({'erro': str(ve)}, status=400)
        except Exception as e:
            return Response({'erro': f'Erro interno: {str(e)}'}, status=500)
