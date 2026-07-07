# Auto Line Feeding (ALF) — Backend

Sistema backend de automação de abastecimento de linhas de montagem. Integra-se ao SAP, processa planilhas de peças e previsões, e orquestra o fluxo completo de requisição, verificação e fechamento de materiais via eventos MQTT.

## Arquitetura

O backend é dividido em **4 microsserviços FastAPI** independentes:

| Serviço | Porta | Função |
|---|---|---|
| **Orchestrator** | `8001` | Orquestrador central — escuta eventos MQTT da linha de montagem e executa o pipeline completo |
| **Core** | `8002` | Regras de negócio — consumo, previsão (forecast), montagem, requisição (LM01), verificação e fechamento (LT22) via SAP GUI |
| **Auth** | `8003` | Autenticação e autorização de usuários (JWT) |
| **Helper Files** | `8004` | Processamento de arquivos estáticos PKMC e PK05 (dados de peças) |

### Fluxo de Dados

```
MQTT Broker (Linha de Montagem)
       │
       │ mensagem de evento
       ▼
 Orchestrator (8001)
       │
       │ chamadas HTTP
       ▼
   Core (8002)
       │
       ├──► Helper Files (8004) — planilhas PKMC/PK05
       ├──► SAP GUI — transações LM01 / LT22
       ├──► API externa — dados da linha de montagem
       └──► MySQL — bancos auth, core, static

 Auth (8003) — JWT para todos os serviços
```

## Tecnologias

- **Python 3.10**
- **FastAPI** + **Uvicorn**
- **SQLAlchemy 2.0** + **Alembic**
- **MySQL** (via `pymysql`)
- **Polars** — processamento de dados em pipeline
- **PyWin32** — automação SAP GUI (COM)
- **Paho MQTT** — cliente MQTT via WebSocket
- **PyJWT** / **Passlib (Argon2)** — autenticação
- **Pytest** — testes

## Pré-requisitos

- Python 3.10
- MySQL rodando (bancos `auth`, `core`, `static` criados)
- SAP GUI instalado (para automação SAP)
- Windows (dependência `pywin32` para COM)

## Instalação

Para cada microsserviço:

```bash
cd backend\<servico>
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org
```

Copie o arquivo de configuração:

```bash
copy config\.env.example config\.env
# Edite config\.env com as credenciais do seu ambiente
```

Execute as migrations:

```bash
alembic upgrade head
```

## Execução

Cada microsserviço roda independentemente:

```bash
python main.py
```

| Serviço | URL |
|---|---|
| Orchestrator | http://127.0.0.1:8001 |
| Core | http://127.0.0.1:8002 |
| Auth | http://127.0.0.1:8003 |
| Helper Files | http://127.0.0.1:8004 |

### Documentação interativa (Swagger)

- Orchestrator: `/orchestrator-docs`
- Core: `/core-docs`
- Auth: `/auth-docs`
- Helper Files: `/static-files-docs`

## Testes

```bash
pytest
# ou com cobertura
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
backend/
├── auth/              # Microsserviço de autenticação
│   ├── modules/       # register, access, list, update, delete
│   ├── common/        # security, services
│   └── database/      # engine, session, migrations
├── core/              # Microsserviço de negócio
│   ├── modules/       # assembly, consumption, forecast,
│   │                  # requests_builder, requests_checker,
│   │                  # requests_closure, sap_manager
│   └── database/      # engine, session, migrations
├── helper_files/      # Microsserviço de arquivos estáticos
│   ├── modules/       # pkmc, pk05, files
│   └── database/      # engine, session, migrations
└── orchestrator/      # Orquestrador MQTT
    ├── modules/       # mqtt_listener, pipeline
    └── config/        # settings
```
