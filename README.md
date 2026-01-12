# Appartement

Projeto React com Docker e Docker Compose.

## 🚀 Tecnologias

- React 18
- Vite
- Docker
- Docker Compose
- Nginx

## 📦 Instalação e Uso

### Configuração Inicial

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações específicas.

### Desenvolvimento Local (sem Docker)

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Com Docker

#### Build e execução com Docker Compose

```bash
docker-compose up --build
```

A aplicação estará disponível em `http://localhost:3000`

#### Build manual

```bash
docker build -t appartement-react .
docker run -p 3000:80 appartement-react
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run preview` - Preview do build de produção

## 🐳 Docker

O projeto utiliza um Dockerfile multi-stage:
- **Stage 1 (builder)**: Instala dependências e faz o build da aplicação
- **Stage 2 (production)**: Serve a aplicação com Nginx

O docker-compose.yml facilita o gerenciamento do container.