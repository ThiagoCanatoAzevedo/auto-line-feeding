# CIAL — Central Inteligente de Atendimento de Linha

MVP de automação de abastecimento de linhas de montagem. Integra-se ao SAP, processa planilhas de peças e previsões, e orquestra o fluxo completo de requisição, verificação e fechamento de materiais via eventos MQTT.

## Arquitetura

### Frontend

Aplicação **React 19 + TypeScript + Vite + Tailwind CSS v4**. Compila em um único HTML (via `vite-plugin-singlefile`) servido pelo backend.

- Páginas: Landing (`/`), Login (`/login`), Register (`/register`)
- Autenticação JWT com suporte a "lembrar-me"
- Tema claro/escuro persistido

### Backend

Dividido em **4 microsserviços FastAPI** independentes:

| Serviço | Porta | Função |
|---|---|---|
| **Orchestrator** | `8001` | Orquestrador central — escuta eventos MQTT da linha de montagem e executa o pipeline completo |
| **Core** | `8002` | Regras de negócio — consumo, previsão (forecast), montagem, requisição (LM01), verificação e fechamento (LT22) via SAP GUI |
| **Auth** | `8003` | Autenticação e autorização de usuários (JWT) |
| **Helper Files** | `8004` | Processamento de arquivos estáticos PKMC e PK05 (dados de peças) |

### Fluxo de Dados

```
 Frontend (React + Vite)
       │
       │ HTTP (porta 8003)
       ▼
 Auth (8003) ──► MySQL (auth)
       │
 MQTT Broker (Linha de Montagem)
       │
       │ mensagem de evento
       ▼
 Orchestrator (8001)
       │
       │ chamadas HTTP
       ▼
   Core (8002) ──► MySQL (core)
       │
       ├──► Helper Files (8004) ──► MySQL (static)
       ├──► SAP GUI — transações LM01 / LT22
       └──► API externa — dados da linha de montagem
```

## Tecnologias

### Backend
- **Python 3.10** · **FastAPI** · **Uvicorn**
- **SQLAlchemy 2.0** · **Alembic**
- **MySQL** (via `pymysql`)
- **Polars** — processamento de dados em pipeline
- **PyWin32** — automação SAP GUI (COM)
- **Paho MQTT** — cliente MQTT via WebSocket
- **PyJWT** · **Passlib (Argon2)** — autenticação
- **Pytest** — testes

### Frontend
- **React 19** · **TypeScript** · **Vite**
- **Tailwind CSS v4**
- **React Router DOM** · **Lucide React**
- **vite-plugin-singlefile** — build em único HTML

## Pré-requisitos

- Python 3.10
- MySQL rodando (bancos `auth`, `core`, `static` criados)
- SAP GUI instalado (para automação SAP)
- Windows (dependência `pywin32` para COM)
- Node.js (para desenvolvimento do frontend)

## Instalação

### Backend

Para cada microsserviço em `backend/`:

```bash
cd backend\<servico>
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org
copy config\.env.example config\.env
# Edite config\.env com as credenciais do seu ambiente
alembic upgrade head
```

### Frontend

```bash
cd frontend
npm install
```

## Execução

### Backend

Cada microsserviço roda independentemente com `python main.py`:

| Serviço | URL |
|---|---|
| Orchestrator | http://127.0.0.1:8001 |
| Core | http://127.0.0.1:8002 |
| Auth | http://127.0.0.1:8003 |
| Helper Files | http://127.0.0.1:8004 |

Documentação Swagger: `/orchestrator-docs`, `/core-docs`, `/auth-docs`, `/static-files-docs`

### Frontend

```bash
npm run dev      # Dev server com hot-reload
npm run build    # Build para single HTML
npm run preview  # Preview do build
```

## Testes

### Backend

```bash
pytest
pytest --cov=.
```

## Pipeline (Orchestrator)

Quando uma mensagem MQTT é recebida, o orchestrator executa em sequência:

1. **Upsert** dos dados da linha de montagem
2. **Forecast** — processa FX4PD e gera previsão
3. **Consumo** — atualiza valores de consumo
4. **Requests Builder** — calcula quantidades a requisitar
5. **Recuperação** das requisições geradas no banco
6. **Sessão SAP** — abre sessão no SAP GUI
7. **Requisição (LM01)** + **Verificação (LT22)** — executa e confirma no SAP

## Estrutura do Projeto

```
auto-line-feeding/
├── frontend/
│   ├── src/
│   │   ├── pages/         # LandingPage, LoginPage, RegisterPage
│   │   ├── components/    # ThemeToggle
│   │   ├── context/       # ThemeContext
│   │   ├── utils/         # cn()
│   │   └── assets/        # Imagens, logos
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── auth/              # Microsserviço de autenticação
│   │   ├── modules/       # register, access, list, update, delete
│   │   ├── common/        # security, services
│   │   └── database/      # engine, session, migrations
│   ├── core/              # Microsserviço de negócio
│   │   ├── modules/       # assembly, consumption, forecast,
│   │   │                  # requests_builder, requests_checker,
│   │   │                  # requests_closure, sap_manager
│   │   └── database/
│   ├── helper_files/      # Microsserviço de arquivos estáticos
│   │   ├── modules/       # pkmc, pk05, files
│   │   └── database/
│   └── orchestrator/      # Orquestrador MQTT
│       ├── modules/       # mqtt_listener, pipeline
│       └── config/
└── README.md
```
