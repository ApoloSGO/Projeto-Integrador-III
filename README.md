
# 🚀 VersionTrack — Sistema de Controle de Versões e Feedback

## 📌 Sobre o Projeto

O **VersionTrack** é uma aplicação web desenvolvida para gerenciar versões de software e coletar feedback de usuários de forma organizada.

A plataforma permite que usuários reportem erros, enquanto a equipe técnica acompanha e atualiza o status das correções.

---

## 🧠 Objetivo

* Centralizar o registro de erros de software
* Melhorar a comunicação entre usuários e equipe
* Controlar versões e atualizações do sistema
* Organizar o ciclo de resolução de problemas

---

## 🏗️ Arquitetura

```
Frontend (React + Vite)
        ↓
Backend (Django REST API)
        ↓
Banco de Dados
```

---

## ⚙️ Tecnologias Utilizadas

### 🔹 Backend

* Python
* Django
* Django REST Framework

### 🔹 Frontend

* React
* Vite
* JavaScript / TypeScript

### 🔹 Ferramentas

* Figma (design)
* VS Code
* Git / GitHub

---

## 📁 Estrutura do Projeto

```
Projeto-Integrador-III/
│
├── backend/
│   ├── .venv/
│   ├── manage.py
│   ├── apps/
│   │   ├── feedback/
│   │   ├── projects/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   ├── package.json
```

---

## 🚀 Como Executar o Projeto

### 🔧 Backend (Django)

```bash
cd backend
.\venv\Scripts\activate
python manage.py migrate
python manage.py runserver
```

Servidor:

```
http://127.0.0.1:8000/
```

---

### 🎨 Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Servidor:

```
http://localhost:5173/
```

---

## 🔌 Integração com API

Exemplo de consumo da API:

```javascript
fetch("http://127.0.0.1:8000/api/feedback/feedbacks/")
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 📊 Funcionalidades

### 👤 Usuários

* Cadastro e autenticação (futuro)

### 🐞 Feedback (Erros)

* Título
* Descrição
* Severidade
* Data

### 🔄 Status

* Aberto
* Em análise
* Resolvido

### 📦 Projetos e Versões

* Controle de versões
* Histórico de alterações

---

## 🎨 Interface

O layout do sistema foi desenvolvido no Figma, com foco em:

* Usabilidade
* Organização visual
* Componentização

---

## ⚠️ Problemas Comuns

| Problema                | Solução                          |
| ----------------------- | -------------------------------- |
| Erro 404                | Verificar rotas no Django        |
| CORS bloqueado          | Configurar `django-cors-headers` |
| npm não funciona        | Instalar Node.js corretamente    |
| módulos não encontrados | instalar dependências            |

---

## 🔒 Melhorias Futuras

* Autenticação JWT
* Integração com GitHub
* Notificações em tempo real
* Dashboard analítico
* Deploy em nuvem (AWS)

---

## 👨‍💻 Autor

Projeto desenvolvido como parte do curso **Projeto Integrador**.

---

## 📄 Licença

Este projeto é de uso acadêmico.

```
```
