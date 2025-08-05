# Zynx AGI - Culturally Aware Artificial General Intelligence

[![CI](https://img.shields.io/github/actions/workflow/status/zynx-agi/zynx-agi/ci.yml?branch=main)](https://github.com/zynx-agi/zynx-agi/actions)
[![Coverage](https://img.shields.io/codecov/c/github/zynx-agi/zynx-agi)](https://codecov.io/gh/zynx-agi/zynx-agi)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **สวัสดีครับ/ค่ะ** - Welcome to Zynx AGI, where artificial general intelligence meets cultural awareness and ethical considerations.

## 🚀 Project Overview

Zynx AGI is a full-stack application that demonstrates culturally aware artificial general intelligence. The project combines:

- **Backend**: FastAPI with comprehensive logging and error handling
- **Frontend**: React/Vite with TypeScript and modern UI components
- **Cultural AI**: Thai-English hybrid responses with cultural sensitivity
- **Documentation**: Auto-generated OpenAPI and ReDoc documentation
- **CI/CD**: GitHub Actions with comprehensive testing and deployment

## 🏗️ Architecture

```
zynx-agi/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application
│   ├── test_main.py        # Comprehensive tests
│   ├── requirements.txt    # Python dependencies
│   └── .env.example       # Environment template
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── lib/               # Utilities and API
│   └── pages/             # Page components
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Local development
└── README.md              # This file
```

## 🛠️ Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Docker** and Docker Compose (optional)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/zynx-agi/zynx-agi.git
cd zynx-agi

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
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

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run tests
pytest test_main.py -v --cov=main --cov-report=html

# Start backend server
python main.py
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

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest test_main.py -v --cov=main --cov-report=html --cov-fail-under=80
```

**Coverage Target**: ≥80% pytest coverage

### Frontend Tests

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

## 📚 API Documentation

- **OpenAPI Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Key Endpoints

- `GET /health` - Backend health status
- `GET /api/v1/agi` - AGI information with cultural context
- `GET /api/v1/deeja` - Meet Deeja, the cultural AGI assistant

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
# Build and run backend
docker build -f backend/Dockerfile -t zynx-agi-backend ./backend
docker run -p 8000:8000 zynx-agi-backend

# Build and run frontend
docker build -f Dockerfile.frontend -t zynx-agi-frontend .
docker run -p 5173:5173 zynx-agi-frontend
```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow includes:

1. **Backend Tests**: pytest with coverage reporting
2. **Frontend Tests**: linting, type checking, and build
3. **Documentation**: Auto-generated OpenAPI docs
4. **Docker**: Build and test container images
5. **Security**: Vulnerability scanning with Trivy
6. **Deployment**: Automatic deployment to development environment

### Workflow Triggers

- **Push to main/develop**: Full pipeline execution
- **Pull Requests**: Tests and security scans
- **Manual**: Trigger via GitHub Actions UI

## 🌍 Cultural AI Features

### Thai Cultural Integration

- **Respect (การเคารพ)**: Cultural sensitivity in AI responses
- **Harmony (ความสมดุล)**: Balanced decision-making
- **Community (ชุมชน)**: Collaborative AI development

### Ethical Considerations

- **Privacy**: Data protection and user privacy
- **Transparency**: Clear decision-making processes
- **Fairness**: Unbiased and equitable treatment
- **Accountability**: Responsible AI development

## 🔧 Configuration

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# Security
SECRET_KEY=your-secret-key-here
DEBUG=True

# Cultural AI Settings
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,th,zh,ja,ko
CULTURAL_CONTEXT_ENABLED=True
```

### Frontend Configuration

Set `VITE_API_URL` in your environment or `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

## 📊 Monitoring

### Backend Logging

- **Location**: `backend/logs/app.log`
- **Rotation**: 10MB files, 7-day retention
- **Level**: INFO with structured formatting

### Health Monitoring

- **Backend**: `GET /health` endpoint
- **Frontend**: Real-time connection status indicator
- **Docker**: Health checks in containers

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Commit Convention

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Deeja**: Our cultural AGI assistant
- **Thai Culture**: Inspiration for cultural awareness
- **Open Source Community**: For amazing tools and libraries

---

**สวัสดีครับ/ค่ะ** - Thank you for exploring Zynx AGI! 🚀
