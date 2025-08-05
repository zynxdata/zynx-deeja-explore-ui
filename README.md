# 🤖 Zynx AGI - Culturally Aware Artificial General Intelligence

[![CI](https://img.shields.io/github/actions/workflow/status/your-repo/zynx-agi/ci.yml?branch=main&label=CI)](https://github.com/your-repo/zynx-agi/actions)
[![Coverage](https://img.shields.io/codecov/c/github/your-repo/zynx-agi?label=Coverage)](https://codecov.io/gh/your-repo/zynx-agi)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **Culturally aware artificial general intelligence with ethical considerations at its core**

## 🌟 Features

- **Cultural Awareness**: Multi-cultural context processing with support for Thai, English, Chinese, Japanese, Korean, Arabic, Spanish, French, German, and Russian
- **Ethical Frameworks**: Integration of utilitarian, deontological, virtue ethics, care ethics, and justice ethics
- **Modern Tech Stack**: FastAPI backend + React/Vite frontend with TypeScript
- **Comprehensive Testing**: ≥80% pytest coverage with automated CI/CD
- **Auto-Generated Docs**: OpenAPI & ReDoc documentation on each commit
- **Docker Support**: Complete containerization for local development and production
- **Security First**: Environment-based configuration with secrets management

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.11+
- **Docker** and **Docker Compose** (optional)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-repo/zynx-agi.git
cd zynx-agi

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Run the backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
zynx-agi/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application
│   ├── test_main.py        # Test suite
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile         # Backend container
│   └── .env.example       # Environment template
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── lib/               # Utilities and API
│   └── pages/             # Page components
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Local development
├── Dockerfile.frontend     # Frontend container
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Application Settings
DEBUG=false
API_KEY=your-secret-api-key-here
DATABASE_URL=sqlite:///./zynx_agi.db

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log

# Server Settings
HOST=0.0.0.0
PORT=8000

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# AGI Settings
DEFAULT_CULTURAL_CONTEXT=global
DEFAULT_ETHICAL_FRAMEWORK=utilitarian
MAX_PROMPT_LENGTH=1000
```

### Frontend Environment

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Zynx AGI
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest test_main.py -v --cov=main --cov-report=term-missing --cov-fail-under=80
```

### Frontend Tests

```bash
npm test
npm run test:coverage
```

### Run All Tests

```bash
# Backend
cd backend && pytest

# Frontend
npm run test

# Docker (all services)
docker-compose up --abort-on-container-exit
```

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/agi/capabilities` | Get AGI capabilities |
| `POST` | `/api/v1/agi/process` | Process AGI request |

### Example Request

```bash
curl -X POST "http://localhost:8000/api/v1/agi/process" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, how are you?",
    "cultural_context": "Thai",
    "ethical_framework": "utilitarian"
  }'
```

## 🐳 Docker

### Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production

```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up -d
```

## 🔄 CI/CD Pipeline

The project includes automated CI/CD with GitHub Actions:

1. **Lint**: ESLint for frontend, flake8 for backend
2. **Test**: Jest for frontend, pytest for backend (≥80% coverage)
3. **Build**: Docker image building and testing
4. **Deploy**: Automatic deployment to staging/production
5. **Security**: Trivy vulnerability scanning

### Pipeline Stages

- `backend-tests`: Python backend testing with coverage
- `frontend-tests`: React frontend testing and linting
- `generate-docs`: Auto-generate OpenAPI documentation
- `docker-build`: Build and test Docker containers
- `deploy-staging`: Deploy to staging (develop branch)
- `deploy-production`: Deploy to production (main branch)
- `security-scan`: Vulnerability scanning

## 🛡️ Security

- **Environment Variables**: All secrets managed via `.env` files
- **API Key Authentication**: Optional API key validation
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Pydantic models for request validation
- **Logging**: Comprehensive logging with loguru
- **Docker Security**: Non-root user in containers

## 🌍 Cultural Awareness

The AGI system supports multiple cultural contexts:

- **Thai** 🇹🇭: Thai cultural norms and communication patterns
- **Chinese** 🇨🇳: Chinese cultural context and values
- **Japanese** 🇯🇵: Japanese cultural considerations
- **Korean** 🇰🇷: Korean cultural framework
- **Arabic** 🇸🇦: Arabic cultural and linguistic patterns
- **Global** 🌍: Universal cultural considerations

## ⚖️ Ethical Frameworks

- **Utilitarian**: Greatest good for the greatest number
- **Deontological**: Duty-based ethical reasoning
- **Virtue Ethics**: Character-based ethical decisions
- **Care Ethics**: Relationship-focused ethical considerations
- **Justice Ethics**: Fairness and equality principles

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Pytest**: Comprehensive backend testing
- **Coverage**: ≥80% test coverage required

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the excellent Python web framework
- **React** and **Vite** for the modern frontend experience
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/zynx-agi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/zynx-agi/discussions)
- **Documentation**: [Wiki](https://github.com/your-repo/zynx-agi/wiki)

---

**Made with ❤️ by the Zynx AGI Team**
