
import uuid
from django.db import models

class Aluno(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    email = models.EmailField()
    ra = models.CharField(max_length=20, unique=True)
    foto_uri = models.CharField(max_length=255)  # ou models.URLField()
    embeddings = models.JSONField()  # ou models.TextField() se usar SQLite

    def __str__(self):
        return self.nome

class Professor(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    email = models.EmailField()

    def __str__(self):
        return self.nome

class Aula(models.Model):
    DIAS_DA_SEMANA = [
        ('segunda', 'Segunda-feira'),
        ('terca', 'Terça-feira'),
        ('quarta', 'Quarta-feira'),
        ('quinta', 'Quinta-feira'),
        ('sexta', 'Sexta-feira'),
        ('sabado', 'Sábado'),
        ('domingo', 'Domingo'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)     
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    dia_semana = models.CharField(max_length=10, choices=DIAS_DA_SEMANA)
    horario_inicio = models.TimeField()
    horario_fim = models.TimeField()
    disciplina = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.disciplina} - {self.dia_semana}"

class Presenca(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE, null=True)
    data = models.DateField()
    hora_entrada = models.TimeField(null=True, blank=True)
    hora_saida = models.TimeField(null=True, blank=True)
    reconhecido_por = models.CharField(max_length=50, default="tablet")  # <-- ADICIONE AQUI


    class Meta:
        unique_together = ('aluno', 'data')

    def __str__(self):
        return f"{self.aluno.nome} - {self.data}"
