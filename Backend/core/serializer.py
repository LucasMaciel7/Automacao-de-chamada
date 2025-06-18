from rest_framework import serializers
from core.utils.imagem import Base64ImageValidatorMixin

class AlunoCreateSerializer(serializers.Serializer, Base64ImageValidatorMixin):
    nome = serializers.CharField()
    email = serializers.EmailField()
    ra = serializers.CharField()
    image_base64 = serializers.CharField()

    def validate_image_base64(self, value): 
        return super().validate_image_base64(value)


class RegistroPresencaSerializer(serializers.Serializer, Base64ImageValidatorMixin):
    ra = serializers.CharField()
    imagem_base64 = serializers.CharField()

    def validate_imagem_base64(self, value):  
        return super().validate_image_base64(value)
    
    
class LoginSerializer(serializers.Serializer):
        username = serializers.CharField()
        password = serializers.CharField()
