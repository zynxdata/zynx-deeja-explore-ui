# 🤖 Zynx AGI - Culturally Aware Artificial General Intelligence

[![CI](https://img.shields.io/github/actions/workflow/status/your-repo/zynx-agi/ci.yml?branch=main)](https://github.com/your-repo/zynx-agi/actions)
[![Coverage](https://img.shields.io/codecov/c/github/your-repo/zynx-agi)](https://codecov.io/gh/your-repo/zynx-agi)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **Culturally aware artificial general intelligence with ethical considerations at its core**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose (optional)

### Local Development

#### Option 1: Docker Compose (Recommended)
```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd zynx-agi

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

#### Option 2: Manual Setup
```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd zynx-agi

# Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Edit .env with your configuration
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend Setup (in another terminal)
cd ../
npm install
npm run dev
```

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.11
- **API Documentation**: Auto-generated OpenAPI/Swagger at `/docs`
- **Testing**: pytest with ≥80% coverage requirement
- **Logging**: Structured logging with loguru
- **CORS**: Configured for frontend integration

### Frontend (React + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: React Query for API state
- **Styling**: Tailwind CSS with custom AGI theme

### Key Features
- 🌍 **Cultural Awareness**: Thai and global cultural context integration
- 🤖 **AGI Interaction**: Real-time communication with AI systems
- 🛡️ **Ethical Considerations**: Built-in ethical AI principles
- 📊 **Comprehensive Testing**: Unit, integration, and E2E tests
- 🚀 **CI/CD Pipeline**: Automated testing, building, and deployment
- 📚 **Auto-generated Docs**: OpenAPI and ReDoc documentation

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest -v --cov=main --cov-report=html --cov-fail-under=80
```

### Frontend Tests
```bash
npm run test
npm run test:coverage
```

### Integration Tests
```bash
docker-compose up -d
# Run integration tests against running services
```

## 📚 API Documentation

### Available Endpoints

#### Health Check
```http
GET /health
```

#### Cultural Context
```http
GET /api/v1/agi/context
```

#### AGI Interaction
```http
POST /api/v1/agi/interact
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "cultural_context": "global",
  "language": "en"
}
```

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.yml up -d

# Production deployment
docker-compose -f docker-compose.yml --profile production up -d
```

### Manual Deployment
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend
npm run build
npm run preview
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes
4. Run tests: `npm test && cd backend && pytest`
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feat/amazing-feature`
7. Open a Pull Request

### Code Quality
- **Linting**: ESLint for frontend, flake8 for backend
- **Formatting**: Prettier for frontend, black for backend
- **Testing**: ≥80% coverage requirement
- **Security**: Automated vulnerability scanning

## 📊 Monitoring & Logging

### Health Checks
- Backend: `GET /health`
- Frontend: Built-in Vite health check
- Docker: Health checks configured for all services

### Logging
- **Backend**: Structured JSON logging with loguru
- **Frontend**: Console logging with error tracking
- **Docker**: Container logs accessible via `docker-compose logs`

## 🔒 Security

### Best Practices
- ✅ Environment variables for secrets
- ✅ CORS configuration
- ✅ Input validation with Pydantic
- ✅ Error handling without exposing internals
- ✅ Regular security updates
- ✅ Automated vulnerability scanning

### Secrets Management
- Never commit `.env` files
- Use environment variables for sensitive data
- Rotate secrets regularly
- Use secure secret management in production

## 📈 Performance

### Optimization
- **Frontend**: Vite for fast builds and HMR
- **Backend**: FastAPI for high-performance async API
- **Database**: Optimized queries and indexing (when added)
- **Caching**: Redis integration ready (when needed)

## 🆘 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check if port 8000 is available
lsof -i :8000

# Check Python environment
python --version
pip list
```

#### Frontend can't connect to backend
```bash
# Check CORS configuration
# Verify API_URL in frontend .env
# Check backend is running on correct port
```

#### Docker issues
```bash
# Clean up containers
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the excellent Python web framework
- **Vite** for the lightning-fast build tool
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework

---

**Built with ❤️ by the Zynx AGI Team**
