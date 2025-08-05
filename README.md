# Zynx AGI - Culturally Aware Artificial General Intelligence

![CI](https://img.shields.io/github/actions/workflow/status/zynx-agi/zynx-agi/ci.yml?branch=main)
![Coverage](https://img.shields.io/codecov/c/github/zynx-agi/zynx-agi)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌏 เกี่ยวกับโปรเจค (About the Project)

Zynx AGI เป็นระบบปัญญาประดิษฐ์ทั่วไปที่มีความตระหนักทางวัฒนธรรม (Culturally Aware AGI) ที่ออกแบบมาเพื่อให้เข้าใจและเคารพความหลากหลายทางวัฒนธรรม โดยเฉพาะวัฒนธรรมไทยและวัฒนธรรมอื่นๆ ทั่วโลก

Zynx AGI is a culturally aware artificial general intelligence system designed to understand and respect cultural diversity, with particular focus on Thai culture and other global cultures.

## 🚀 Features

### Frontend (React + Vite + TypeScript)
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Cultural Interface**: Thai-English hybrid interface
- **Interactive Components**: Animated hero section with Deeja character
- **API Integration**: Real-time connection to FastAPI backend
- **Responsive Design**: Works on all devices

### Backend (FastAPI + Python)
- **RESTful API**: Clean, documented endpoints
- **Cultural Context**: Built-in Thai cultural awareness
- **Logging**: Comprehensive logging with loguru
- **Documentation**: Auto-generated OpenAPI docs
- **Testing**: 80%+ pytest coverage

### DevOps & CI/CD
- **Docker**: Containerized development and production
- **GitHub Actions**: Automated lint → test → build → deploy
- **Environment Management**: Secure .env handling
- **Documentation**: Auto-generated API docs

## 🛠️ การติดตั้ง (Installation)

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker (optional)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/zynx-agi/zynx-agi.git
cd zynx-agi

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Set up environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Start development servers
npm run dev          # Frontend (http://localhost:5173)
cd backend && python main.py  # Backend (http://localhost:8000)
```

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 API Documentation

- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Key Endpoints

```bash
GET /health                    # Health check
GET /api/v1/agi              # AGI information with cultural context
GET /api/v1/deeja            # Meet Deeja - Cultural AGI Assistant
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest test_main.py -v --cov=main --cov-report=html
```

### Frontend Tests
```bash
npm run lint
npm run build
```

### Docker Tests
```bash
docker-compose up -d
curl http://localhost:8000/health
curl http://localhost:5173
```

## 🏗️ Project Structure

```
zynx-agi/
├── src/                    # Frontend React components
│   ├── components/         # UI components
│   ├── lib/               # Utilities and API client
│   └── pages/             # Page components
├── backend/               # FastAPI backend
│   ├── main.py           # Main application
│   ├── test_main.py      # Test suite
│   └── requirements.txt   # Python dependencies
├── .github/workflows/     # CI/CD pipelines
├── docker-compose.yml     # Docker orchestration
└── README.md             # This file
```

## 🌍 Cultural Features

### Thai Cultural Integration
- **การเคารพ (Respect)**: Built-in respect for cultural norms
- **ความสมดุล (Harmony)**: Balanced approach to AI interactions
- **ชุมชน (Community)**: Community-focused AI design

### Global Perspectives
- **Cultural Sensitivity**: Multi-cultural awareness
- **Ethical Considerations**: Responsible AI development
- **Inclusive Design**: Accessible to diverse users

## 🤖 Meet Deeja

Deeja is our cultural AGI assistant with the following traits:
- ✅ **Culturally Aware**: Understands cultural contexts
- ✅ **Empathetic**: Shows emotional intelligence
- ✅ **Ethical**: Makes responsible decisions
- ✅ **Multilingual**: Speaks Thai and English

## 🔧 Development

### Code Style
- **Frontend**: ESLint + Prettier
- **Backend**: Black + flake8
- **Commits**: Conventional commits (feat/fix/chore)

### Environment Variables
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8000

# Backend (backend/.env)
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
```

## 🚀 Deployment

### GitHub Actions Pipeline
1. **Lint**: Code quality checks
2. **Test**: Unit and integration tests
3. **Build**: Documentation generation
4. **Deploy**: Automated deployment

### Manual Deployment
```bash
# Build frontend
npm run build

# Start backend
cd backend && python main.py

# Docker deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring

- **Health Checks**: `/health` endpoint
- **Logs**: Structured logging with loguru
- **Coverage**: 80%+ test coverage requirement
- **Performance**: Docker health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Thai Cultural Advisors**: For cultural sensitivity guidance
- **AI Ethics Community**: For responsible AI development principles
- **Open Source Contributors**: For the amazing tools and libraries

---

**Zynx AGI** - Building culturally aware artificial intelligence for a better world 🌏🤖
