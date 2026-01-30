# 🚀 CouponVault - Quick Start Guide

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ MongoDB installed locally OR MongoDB Atlas account ([Get Free](https://www.mongodb.com/cloud/atlas))
- ✅ npm or yarn package manager

## 🎯 Installation Steps

### 1. Navigate to Project Directory
```bash
cd C:\Users\Shivam\.gemini\antigravity\scratch\CouponVault
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- MongoDB/Mongoose
- TypeScript
- Tailwind CSS
- And all other dependencies

### 3. Set Up Environment Variables

The `.env.local` file is already created with default values. If needed, you can modify:

```env
MONGODB_URI=mongodb://localhost:27017/couponvault
JWT_SECRET=dev-secret-key-change-in-production-12345
ADMIN_EMAIL=admin@couponvault.com
ADMIN_PASSWORD=Admin@12345
```

**Important**: Change these values in production!

### 4. Start MongoDB

#### Option A: Local MongoDB
```bash
# Windows (if installed as service)
net start MongoDB

# Or start manually
mongod
```

#### Option B: MongoDB Atlas
1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env.local`

### 5. Seed the Database
```bash
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
✅ Inserted 10 platforms
✅ Created admin user

Admin Credentials:
Email: admin@couponvault.com
Password: Admin@12345
```

### 6. Start Development Server
```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 2.5s
```

### 7. Open in Browser

Visit: **http://localhost:3000**

## 🎉 You're Ready!

### What to Try First:

1. **Browse Platforms**: Click "Platforms" in navigation
2. **Get a Coupon**: Click "Get Random Coupon" button
3. **Copy Code**: Click on the displayed coupon to copy
4. **Admin Dashboard**: Visit http://localhost:3000/admin
   - Email: `admin@couponvault.com`
   - Password: `Admin@12345`

## 📱 Available Features

### User Features
- ✨ Random coupon generation
- 🔍 Platform search and filtering
- 📋 One-click code copying
- 📊 Real-time availability
- ⚡ Daily claim limits (10/day)

### Admin Features
- 📊 Analytics dashboard
- 🎛️ Bulk coupon generation
- 📈 Usage statistics
- 🚨 Activity monitoring

## 🛠️ Common Issues & Solutions

### ❌ "Cannot connect to MongoDB"
**Solution**: 
- Ensure MongoDB is running: `net start MongoDB`
- Or check your MongoDB Atlas connection string

### ❌ "Port 3000 is already in use"
**Solution**:
```bash
# Use different port
npm run dev -- -p 3001
```

### ❌ "Module not found"
**Solution**:
```bash
# Clear and reinstall
rm -rf node_modules
npm install
```

### ❌ Build errors
**Solution**:
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📦 Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

## 🔄 Daily Automation (Optional)

To automatically generate coupons daily:

### Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Daily at 2:00 AM
4. Action: Start a program
5. Program: `node`
6. Arguments: `scripts/dailyTasks.js`
7. Start in: `C:\Users\Shivam\.gemini\antigravity\scratch\CouponVault`

### Linux Cron
```bash
crontab -e
# Add line:
0 2 * * * cd /path/to/CouponVault && node scripts/dailyTasks.js
```

## 📚 Next Steps

1. **Read Documentation**: Check `README.md` for detailed features
2. **Deploy**: See `DEPLOYMENT.md` for hosting options
3. **Customize**: Modify platforms, colors, and features
4. **Generate More Coupons**: Use admin panel

## 🎯 Key URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Platforms | http://localhost:3000/platforms |
| Random Coupon | http://localhost:3000/random |
| Admin Dashboard | http://localhost:3000/admin |
| FAQ | http://localhost:3000/faq |
| About | http://localhost:3000/about |

## 💡 Tips

- **First Login**: Use admin credentials from seed script
- **Daily Limit**: Each user can claim 10 coupons/day
- **Auto-Refill**: System auto-generates when stock is low
- **Expiry**: Coupons expire based on platform config (7-60 days)

## 🆘 Need Help?

- 📖 Check `README.md` for full documentation
- 🚀 See `DEPLOYMENT.md` for hosting
- 📊 Review `PROJECT_SUMMARY.md` for features
- 💬 Open an issue on GitHub

## ✅ Verification Checklist

- [ ] Node.js installed and working
- [ ] MongoDB running and accessible
- [ ] Dependencies installed successfully
- [ ] Database seeded with platforms
- [ ] Development server running
- [ ] Can access http://localhost:3000
- [ ] Can generate random coupons
- [ ] Admin panel accessible

---

**Happy Coding! 🎉**

For detailed documentation, see README.md
