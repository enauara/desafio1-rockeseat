# Brev.ly - Encurtador de URL

### Aplicação criada para o desafio do nível 1 da pós graduação Tech Developer 360 da Rocketseat.

## Configuração das variáveis de ambiente
Variáveis separadas por ambiente. Backend (pasta /server). Frontend (pasta /web)

### 1. Backend (/server)
Navegue ate a pasta `server` e crie um arquivo ´.env´ baseado no ´.env.example`:

### Banco de dados:
PORT=""  
DATABASE_URL=""

### Cloudflare R2 Credentials:
CLOUDFLARE_ACCOUNT_ID=""  
CLOUDFLARE_ACCESS_KEY_ID=""   
CLOUDFLARE_SECRET_ACCESS_KEY=""  
CLOUDFLARE_BUCKET=""  
CLOUDFLARE_PUBLIC_URL=""

## Como executar o projeto
### Backend:
Ter o Docker instalado.

Via terminal acessar a pasta /server:    
- Instalar as dependencias: `npm install`  
- Configurar o ambiente com variáveis anteriores.  
- Acessar a pasta /server e rodar o comando: `docker compose up -d`  
- Gera os arquivos de migration: `npm run db:generate`
- Aplica as migrations no banco: `npm run db:migrate`
- Iniciar o servidor: `npm run dev`

### Frontend:  

Abrir um novo terminal e acessar a pasta /web:  
- Instalar as dependencias: `npm install`
- Iniciar o servidor: `npm run dev`

---

