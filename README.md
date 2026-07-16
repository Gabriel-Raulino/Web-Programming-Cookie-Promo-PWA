# 🍪 Cookie Promo PWA — QR-Code & Push Notifications

<details>
<summary>🇺🇸 <b>Read in English</b></summary>
<br>

Academic project developed for the **Web Programming** course. A Progressive Web App (PWA) built for a fictional cookie brand's marketing campaign: customers scan the QR-Code printed on the packaging using their phone's camera, and it gets registered to their account. At the end of the promotion, winning QR-Codes are drawn and the corresponding customer is notified instantly via **Web Push**, even if the app isn't open.

### 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB (via Mongoose)
* **Auth:** JWT (`jsonwebtoken`)
* **Push Notifications:** Web Push API (VAPID) via `web-push`
* **QR-Code scanning (client):** [html5-qrcode](https://github.com/mebjas/html5-qrcode)
* **Frontend:** Vanilla HTML/CSS/JavaScript, installable as a PWA (manifest + service worker)

### 📂 Project Structure

```
.
├── app.js                     # Express app setup (middlewares, static files, routes)
├── index.js                    # Entry point (DB connection + server startup)
├── manda_msg.js                 # CLI tool: notifies the customer holding a given winning QR-Code
├── chaves.example.json          # Example VAPID key format (copy to chaves.json — see setup below)
├── routes/
│   └── promoRouter.js           # API route definitions
├── controllers/
│   └── promoCtl.js              # Request handlers (business logic)
├── middlewares/
│   └── auth.js                  # JWT authentication middleware
├── db/
│   └── db.js                     # MongoDB connection and Customer (Cliente) schema
└── public/                      # The PWA itself, served as static files
    ├── index.html / app.js           # Main app: login, QR-Code scanner, push subscription
    ├── manifest.json                  # PWA manifest (installable app metadata)
    ├── sw.js                          # Service worker (handles push events & notification clicks)
    └── gerador.html                   # Standalone helper page to generate QR-Codes for testing (simulates the factory printing them on packaging)
```

### 🚀 How to Run

**1. Prerequisites**
* [Node.js](https://nodejs.org/) (v18+)
* A running local MongoDB instance on `mongodb://localhost:27017` (e.g. via [MongoDB Community Server](https://www.mongodb.com/try/download/community) or Docker: `docker run -d -p 27017:27017 mongo`)

**2. Clone the repository**
```bash
git clone https://github.com/Gabriel-Raulino/Web-Programming-Cookie-Promo-PWA.git
cd Web-Programming-Cookie-Promo-PWA
```

**3. Install dependencies**
```bash
npm install
```

**4. Generate your own VAPID keys** (required for push notifications — never reuse someone else's)
```bash
npx web-push generate-vapid-keys
```
Copy `chaves.example.json` to `chaves.json` and paste in the keys you just generated:
```bash
cp chaves.example.json chaves.json
```
> ⚠️ `chaves.json` is git-ignored on purpose — it holds your **private** key and must never be committed.

Then open `public/app.js` and update the `PUBLIC_VAPID_KEY` constant with the **public** key from the same pair (the public key is meant to be shared with the client, the private key stays backend-only in `chaves.json`).

**5. Start the server**
```bash
node index.js
```
The server runs on `http://localhost:3000`.

**6. Try it out**
* Open `http://localhost:3000` in your browser (Chrome/Edge recommended) — this is the customer-facing PWA. Register/log in, allow notifications when prompted, and scan a QR-Code.
* Open `http://localhost:3000/gerador.html` in another tab to generate a QR-Code to scan (simulates the code printed on the cookie packaging) — point your webcam or phone camera at the screen showing it.
* To test on a **real phone**, note that Service Workers and Push require a secure context (HTTPS), and `localhost` only satisfies that on the same machine. To test over your local network or on a phone, tunnel the server through something like [ngrok](https://ngrok.com/) (`ngrok http 3000`) and use the HTTPS URL it gives you.

**7. Draw a winner and notify them**
Once a customer has scanned a QR-Code and enabled notifications, trigger a push from the backend with:
```bash
node manda_msg.js <codigo_qrcode> "Parabéns, você foi sorteado na promoção dos produtos X, entre em contato para receber seu prêmio"
```

### 🔌 API Endpoints

| Method | Route | Auth required | Description |
|---|---|---|---|
| POST | `/api/login` | No | Log in or auto-register a customer (email/password), returns a JWT |
| POST | `/api/qrcode` | Yes | Register a scanned QR-Code to the authenticated customer's account |
| GET | `/api/qrcodes` | Yes | List all QR-Codes registered by the authenticated customer |
| POST | `/api/subscribe` | Yes | Save the customer's push notification subscription |

### ⚠️ Known Limitations

This is an academic prototype, not a production-ready system. A few simplifications made for the scope of the assignment:
* Passwords are stored and compared in plain text (no hashing) — would need `bcrypt` or similar in a real-world scenario.
* The JWT signing secret is hardcoded in `middlewares/auth.js` rather than pulled from an environment variable.
* No rate limiting or input sanitization beyond basic required-field checks.
* `manda_msg.js` connects directly to MongoDB rather than going through the running server — fine for a CLI admin tool, but worth noting.

---
**Developed by:** Gabriel Raulino Dal Pont & Eduardo Pires

</details>

<details>
<summary>🇧🇷 <b>Ler em Português (BR)</b></summary>
<br>

Trabalho acadêmico desenvolvido para a disciplina de **Programação para WEB**. Um Progressive Web App (PWA) construído para a campanha de marketing de uma marca fictícia de biscoitos: o cliente escaneia com a câmera do celular o QR-Code impresso na embalagem, e ele é registrado na conta dele. Ao final da promoção, QR-Codes vencedores são sorteados e o cliente correspondente é notificado instantaneamente via **Web Push**, mesmo com o app fechado.

### 🛠️ Tecnologias

* **Backend:** Node.js, Express
* **Banco de dados:** MongoDB (via Mongoose)
* **Autenticação:** JWT (`jsonwebtoken`)
* **Notificações Push:** Web Push API (VAPID) via `web-push`
* **Leitura de QR-Code (cliente):** [html5-qrcode](https://github.com/mebjas/html5-qrcode)
* **Frontend:** HTML/CSS/JavaScript puro, instalável como PWA (manifest + service worker)

### 📂 Estrutura do Projeto

```
.
├── app.js                     # Configuração do Express (middlewares, estáticos, rotas)
├── index.js                    # Ponto de entrada (conexão com o banco + início do servidor)
├── manda_msg.js                 # Ferramenta de linha de comando: notifica o cliente dono de um QR-Code sorteado
├── chaves.example.json          # Exemplo do formato das chaves VAPID (copie para chaves.json — veja o setup abaixo)
├── routes/
│   └── promoRouter.js           # Definição das rotas da API
├── controllers/
│   └── promoCtl.js              # Handlers das requisições (regra de negócio)
├── middlewares/
│   └── auth.js                  # Middleware de autenticação via JWT
├── db/
│   └── db.js                     # Conexão com o MongoDB e schema do Cliente
└── public/                      # O PWA em si, servido como arquivos estáticos
    ├── index.html / app.js           # App principal: login, leitor de QR-Code, subscrição de push
    ├── manifest.json                  # Manifesto do PWA (metadados do app instalável)
    ├── sw.js                          # Service worker (trata eventos de push e cliques na notificação)
    └── gerador.html                   # Página auxiliar independente para gerar QR-Codes de teste (simula a fábrica imprimindo na embalagem)
```

### 🚀 Como Executar

**1. Pré-requisitos**
* [Node.js](https://nodejs.org/) (v18+)
* Uma instância local do MongoDB rodando em `mongodb://localhost:27017` (via [MongoDB Community Server](https://www.mongodb.com/try/download/community) ou Docker: `docker run -d -p 27017:27017 mongo`)

**2. Clone o repositório**
```bash
git clone https://github.com/Gabriel-Raulino/Web-Programming-Cookie-Promo-PWA.git
cd Web-Programming-Cookie-Promo-PWA
```

**3. Instale as dependências**
```bash
npm install
```

**4. Gere suas próprias chaves VAPID** (necessárias para as notificações push — nunca reaproveite chaves de outra pessoa)
```bash
npx web-push generate-vapid-keys
```
Copie `chaves.example.json` para `chaves.json` e cole as chaves geradas:
```bash
cp chaves.example.json chaves.json
```
> ⚠️ `chaves.json` está no `.gitignore` de propósito — ele guarda sua chave **privada** e nunca deve ser commitado.

Depois, abra `public/app.js` e atualize a constante `PUBLIC_VAPID_KEY` com a chave **pública** do mesmo par (a chave pública é feita pra ser compartilhada com o cliente; a privada fica só no backend, em `chaves.json`).

**5. Inicie o servidor**
```bash
node index.js
```
O servidor sobe em `http://localhost:3000`.

**6. Testando**
* Abra `http://localhost:3000` no navegador (Chrome/Edge recomendado) — essa é a PWA voltada ao cliente. Cadastre-se/faça login, permita as notificações quando solicitado, e escaneie um QR-Code.
* Abra `http://localhost:3000/gerador.html` em outra aba pra gerar um QR-Code pra escanear (simula o código impresso na embalagem do biscoito) — aponte a webcam ou a câmera do celular pra tela que mostra ele.
* Pra testar num **celular de verdade**, lembre que Service Workers e Push exigem contexto seguro (HTTPS), e o `localhost` só cobre isso na própria máquina. Pra testar pela rede local ou num celular, use um túnel como o [ngrok](https://ngrok.com/) (`ngrok http 3000`) e acesse pela URL HTTPS que ele gera.

**7. Sortear um vencedor e notificá-lo**
Depois que um cliente escanear um QR-Code e ativar as notificações, dispare um push do backend com:
```bash
node manda_msg.js <codigo_qrcode> "Parabéns, você foi sorteado na promoção dos produtos X, entre em contato para receber seu prêmio"
```

### 🔌 Endpoints da API

| Método | Rota | Requer autenticação | Descrição |
|---|---|---|---|
| POST | `/api/login` | Não | Login ou auto-cadastro do cliente (email/senha), retorna um JWT |
| POST | `/api/qrcode` | Sim | Registra um QR-Code escaneado na conta do cliente autenticado |
| GET | `/api/qrcodes` | Sim | Lista todos os QR-Codes registrados pelo cliente autenticado |
| POST | `/api/subscribe` | Sim | Salva a subscrição de notificações push do cliente |

### ⚠️ Limitações Conhecidas

Este é um protótipo acadêmico, não um sistema pronto para produção. Algumas simplificações feitas pelo escopo do trabalho:
* Senhas são armazenadas e comparadas em texto puro (sem hash) — num cenário real seria necessário `bcrypt` ou similar.
* O segredo de assinatura do JWT está fixo no código em `middlewares/auth.js`, em vez de vir de uma variável de ambiente.
* Não há rate limiting nem sanitização de entrada além das verificações básicas de campos obrigatórios.
* O `manda_msg.js` conecta direto no MongoDB em vez de passar pelo servidor rodando — tranquilo pra uma ferramenta de admin via linha de comando, mas vale registrar.

---
**Desenvolvido por:** Gabriel Raulino Dal Pont & Eduardo Pires

</details>
