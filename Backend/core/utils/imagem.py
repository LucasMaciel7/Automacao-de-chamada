import base64
import os
from uuid import uuid4
from django.conf import settings

def salvar_imagem_base64_em_arquivo(base64_str):
    pasta = 'imagem/alunos'  # ✅ Caminho desejado
    pasta_destino = os.path.join(settings.MEDIA_ROOT, pasta)
    os.makedirs(pasta_destino, exist_ok=True)

    # Trata o base64
    header, data = base64_str.split(';base64,')
    ext = header.split('/')[-1]  # jpg, png etc
    nome_arquivo = f"{uuid4()}.{ext}"

    caminho_absoluto = os.path.join(pasta_destino, nome_arquivo)

    # Salva no disco
    with open(caminho_absoluto, 'wb') as f:
        f.write(base64.b64decode(data))

    return caminho_absoluto  # ✅ continue retornando absoluto como antes
