# 🚀 Deployment Guide - Zynx AGI

## ☁️ **Option 1: Railway (Backend) - ง่ายที่สุด**

### **Step 1: สร้าง Railway Account**
1. ไปที่ https://railway.app
2. Sign up with GitHub
3. Create new project

### **Step 2: Deploy Backend**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd backend
railway init
railway up
```

### **Step 3: Get Backend URL**
- Railway จะให้ URL เช่น: `https://zynx-agi-backend.railway.app`
- ใช้ URL นี้สำหรับ frontend

## 🌐 **Option 2: Vercel (Frontend)**

### **Step 1: สร้าง Vercel Account**
1. ไปที่ https://vercel.com
2. Sign up with GitHub

### **Step 2: Deploy Frontend**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
vercel --prod
```

### **Step 3: Update API URL**
- แก้ไข `src/lib/api.ts`
- เปลี่ยน `API_BASE_URL` เป็น Railway URL

## 🔧 **Option 3: Docker + Cloud**

### **Deploy to DigitalOcean**
```bash
# Create droplet
# Upload docker-compose.yml
# Run: docker-compose up -d
```

### **Deploy to AWS**
```bash
# Use AWS ECS
# Upload Docker images
# Configure load balancer
```

## 📊 **Environment Variables**

### **Backend (.env)**
```env
DEBUG=false
API_KEY=your-production-api-key
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### **Frontend (.env)**
```env
VITE_API_URL=https://your-backend-url.railway.app
VITE_APP_NAME=Zynx AGI
```

## 🔒 **Security Checklist**

- [ ] Set production API key
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring

## 📈 **Monitoring**

### **Health Checks**
- Backend: `https://your-backend-url.railway.app/health`
- Frontend: `https://your-frontend-url.vercel.app`

### **Logs**
- Railway: Built-in logging
- Vercel: Built-in analytics

## 🚀 **Quick Deploy Commands**

```bash
# Backend to Railway
cd backend && railway up

# Frontend to Vercel
vercel --prod

# Test deployment
curl https://your-backend-url.railway.app/health
```