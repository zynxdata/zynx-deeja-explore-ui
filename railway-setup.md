# 🚀 Deploy ฟรีบน Railway

## 📋 **Step 1: สร้าง Railway Account ฟรี**
1. ไปที่ https://railway.app
2. คลิก "Sign up with GitHub"
3. อนุญาต Railway เข้าถึง GitHub repo

## 🔧 **Step 2: Deploy Backend**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up
```

## 🌐 **Step 3: Deploy Frontend ฟรีบน Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
vercel --prod
```

## 💰 **ค่าใช้จ่าย: 0 บาท!**
- ✅ Railway: ฟรี 500 hours/month
- ✅ Vercel: ฟรี 100GB bandwidth/month
- ✅ Custom domain: ฟรี
- ✅ SSL certificate: ฟรี