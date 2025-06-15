from django.contrib import admin
from core.models.models import Aluno, Professor, Aula, Presenca

admin.site.register(Aluno)
admin.site.register(Professor)
admin.site.register(Aula)
admin.site.register(Presenca)