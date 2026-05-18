# 🤖 Agent do Nadson - WhatsApp AI Bot

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![AI](https://img.shields.io/badge/AI-Ollama-blue)
![WhatsApp Bot](https://img.shields.io/badge/WhatsApp-Bot-25D366)
![Status](https://img.shields.io/badge/status-active-success)

---

## 🧠 Sobre o projeto

O **Agent do Nadson** é um bot inteligente para WhatsApp que utiliza IA local com Ollama para responder mensagens automaticamente.

Ele funciona como um **assistente virtual personalizado**, capaz de interagir de forma natural, com regras de comportamento definidas e controle administrativo.

---

## ⚙️ Funcionalidades

✔ Atendimento automático no WhatsApp  
✔ IA local com Ollama (sem API paga)  
✔ Personalidade configurada no prompt  
✔ Controle de ativação (/on e /off)  
✔ Mensagem automática na primeira interação  
✔ Respostas rápidas para “sim” e “não”  
✔ Status “digitando...” no chat  
✔ Ignora grupos automaticamente  
✔ Sistema de sessão com Baileys  

---

## 💬 Exemplo de conversa

👤 Usuário: Oi  
🤖 Bot: Olá! Como posso te ajudar? 🙂

👤 Usuário: Quem é Nadson?  
🤖 Bot: Ele é estudante de Engenharia de Software e desenvolvedor Full Stack.

👤 Usuário: Cadê ele?  
🤖 Bot: No momento o Nadson está um pouco distante do telefone, não sei dizer quando ele volta. Posso te ajudar em algo? 🙂

---

## 🧠 Arquitetura

Usuário → WhatsApp → Baileys → Node.js Bot → Ollama (IA local) → Resposta

---

## 🛠️ Tecnologias utilizadas

- Node.js  
- @whiskeysockets/baileys  
- :contentReference[oaicite:1]{index=1}  
- Axios  
- Pino Logger  
- qrcode-terminal  

---

## 📁 Estrutura do projeto

project/
├── index.js
├── services/
│ └── ollama.js
├── auth/ (gerado automaticamente)
├── package.json
└── package-lock.json

---

## 🔐 Comandos administrativos

- `/on` → Ativa o bot  
- `/off` → Desativa o bot  

---

## ▶️ Como executar

### 1. Instale as dependências

```bash
npm install
