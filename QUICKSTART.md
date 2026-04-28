# 🚀 Quick Start Guide

## Avvio Rapido

```bash
./run.sh
```

Questo avvierà automaticamente:
- Backend FastAPI su http://localhost:8000
- Frontend React su http://localhost:5173

## Prerequisiti Verificati ✅

- ✅ Node.js installato
- ✅ Python 3.12 installato
- ✅ Dipendenze frontend installate
- ✅ Virtual environment Python configurato
- ✅ AWS CLI configurato
- ✅ Accesso a Bedrock (Claude 3 Haiku) verificato

## Test dell'Applicazione

1. Apri http://localhost:5173 nel browser
2. Clicca su "Generate Test Transaction" nella dashboard
3. Osserva il rilevamento frodi in tempo reale

## API Documentation

Visita http://localhost:8000/docs per la documentazione interattiva delle API.

## Struttura del Progetto

```
robinhood-agent/
├── backend/              # FastAPI + Strands Agents
│   ├── main.py          # Server principale
│   ├── config.py        # Configurazione
│   └── agents/          # AI Agents
│       ├── fraud_detection_agent.py
│       ├── threat_response_agent.py
│       └── case_manager_agent.py
├── src/                 # React Frontend
│   ├── components/      # UI Components
│   ├── pages/          # Pagine
│   └── services/       # API Services
└── run.sh              # Script di avvio
```

## Troubleshooting

### Backend non parte
```bash
cd backend
source venv/bin/activate
python main.py
```

### Frontend non parte
```bash
npm run dev
```

### Verificare AWS
```bash
aws sts get-caller-identity
aws bedrock list-foundation-models --region eu-west-1
```

## Fermare l'Applicazione

Premi `Ctrl+C` nel terminale dove hai eseguito `./run.sh`
