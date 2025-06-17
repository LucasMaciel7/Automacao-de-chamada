# 📚 Sistema de Automação de Chamada com Reconhecimento Facial

Este projeto tem como objetivo automatizar o registro de presença de alunos em salas de aula utilizando **reconhecimento facial**. A proposta nasceu de um projeto integrador acadêmico, com foco em reduzir a burocracia e aumentar a eficiência no controle de chamadas.

---

## 🚀 Tecnologias Utilizadas

### 📦 Backend
- **Python 3.10**
- **Django** (Framework web principal)
- **Django REST Framework** (APIs RESTful)
- **Postgres** (Banco de dados leve e local)
- **face_recognition** (Reconhecimento facial com dlib)
- **pipenv** (Gerenciador de pacotes )

### 💻 Frontend
- **React 18 + Vite + TypeScript**
- **TailwindCSS** (Estilização moderna)
- **React Webcam API** (Captura de imagem da câmera)

---

## 📌 Funcionalidades

### 👨‍🎓 Alunos
- Registro de entrada e saída via reconhecimento facial
- Captura de imagem por webcam em um tablet ou notebook
- Exibição de grid com presença do dia (nome, RA, entrada, saída)

### 👨‍🏫 Professores
- Relatório diário automático por e-mail com a presença dos alunos de suas aulas

### 🔧 Administrador
- Cadastro de alunos com nome, RA, e-mail e imagem facial
- Cadastro de professores e sua grade semanal de aulas
- Visualização de todas as presenças registradas

---

## 🧠 Fluxo de Funcionamento

1. **Cadastro de Aluno:** Envia a imagem base64 para o backend, que processa os embeddings e armazena no banco.
2. **Registro de Ponto:** O aluno informa o RA, tira uma selfie. O backend compara com os embeddings e registra a entrada ou saída, conforme o caso.
3. **Relatório:** O backend consulta as aulas do dia e envia por e-mail ao professor um relatório com a lista de alunos presentes.

---

## 🛠️ Como Rodar Localmente

### 🔧 Requisitos
- Python 3.10+
- Node.js 18+
- Pipenv
- Vite
- Git

### ▶ Backend (Django)
```bash
cd Backend
pipenv install
pipenv shell
python manage.py migrate
python manage.py runserver
```

### ▶ Frontend (React + Vite)
```bash
cd Frontend
npm install
npm run dev
```

---

## 🗃️ Estrutura das Tabelas (Principais Models)

### `Aluno`
- `id`: UUID
- `nome`
- `email`
- `ra`
- `foto_base64`
- `embeddings`

### `Professor`
- `id`: UUID
- `nome`
- `email`

### `Aula`
- `id`: UUID
- `professor_id`: FK
- `dia_semana`
- `horario_inicio`
- `horario_fim`
- `disciplina`

### `Presenca`
- `id`: UUID
- `aluno_id`: FK
- `data`
- `hora_entrada`
- `hora_saida`
- `reconhecido_por`
- `aula_id`: FK

---

## 📤 Endpoints Principais

| Método | Rota                 | Descrição                          |
|--------|----------------------|------------------------------------|
| POST   | `/ponto/`            | Registro de ponto com imagem base64 |
| POST   | `/alunos/`           | Cadastro de aluno com imagem base64 |
| GET    | `/relatorio-diario/` | Envia e-mail com presença da aula |
| GET    | `/presenca/:id_professor` | Envia e-mail com presença da aula |


---

## 📧 Envio de E-mail

- Utiliza `smtplib` (ou `send_mail` do Django) para envio automático.
- E-mail disparado com lista de alunos presentes após o fim da aula.
- Formato legível com nome, RA, horário de entrada e saída.

---

## 👥 Equipe

- **Ryan Fonseca Rodrigues** – Líder de desenvolvimento e integração
- Eduarda Alves Ribeiro
- Isadora de Araujo Viegas
- Lucas Maciel Campos
- Pedro Otavio Lopes

---

## 🏁 Status do Projeto

✅ Cadastro de alunos com imagem base64  
✅ Reconhecimento facial com entrada/saída  
✅ Grade horária de aulas  
🚧 Relatório automático por e-mail  
🚧 Painel administrativo completo (em desenvolvimento)

---

## 📄 Licença

Projeto acadêmico de uso educacional. Direitos reservados aos autores do projeto. Não distribuir sem autorização.
