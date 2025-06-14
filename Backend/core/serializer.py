from rest_framework import serializers

class AlunoCreateSerializer(serializers.Serializer):
    nome = serializers.CharField()
    email = serializers.EmailField()
    ra = serializers.CharField()
    image_base64 = serializers.CharField()

    def validate_image_base64(self, value):
        if not value.startswith("data:image"):
            raise serializers.ValidationError("Imagem base64 inválida ou mal formatada.")
        if ';base64,' not in value:
            raise serializers.ValidationError("Formato base64 esperado não encontrado.")
        return value