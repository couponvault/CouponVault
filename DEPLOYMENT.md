# CouponVault Deployment Guide

## 📋 Prerequisites

Before deploying CouponVault, ensure you have:

1. MongoDB database (Atlas or self-hosted)
2. Node.js 18+ installed
3. Domain name (optional, for production)

## 🌐 Deployment Options

### 1. Vercel (Recommended for Next.js)

#### Step 1: Prepare Your Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_APP_URL`

4. Click "Deploy"

#### Step 3: Post-Deployment
```bash
# Run database seeder (one-time)
npm run seed
```

### 2. Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project from GitHub
4. Add MongoDB plugin
5. Set environment variables
6. Deploy automatically

### 3. DigitalOcean App Platform

1. Connect GitHub repository
2. Select Node.js environment
3. Add MongoDB database
4. Configure environment variables
5. Deploy

### 4. Self-Hosted (VPS)

#### Requirements
- Ubuntu 20.04+ server
- 2GB RAM minimum
- MongoDB installed

#### Steps

```bash
# 1. Clone repository
git clone <your-repo>
cd CouponVault

# 2. Install dependencies
npm install

# 3. Set up environment variables
nano .env.local
# Add all required variables

# 4. Build the application
npm run build

# 5. Seed database (one-time)
npm run seed

# 6. Install PM2
npm install -g pm2

# 7. Start application
pm2 start npm --name "couponvault" -- start

# 8. Set up PM2 to start on boot
pm2 startup
pm2 save

# 9. Set up Nginx reverse proxy
sudo nano /etc/nginx/sites-available/couponvault
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/couponvault /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 10. Set up SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🗄️ MongoDB Setup

### MongoDB Atlas (Cloud)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string
6. Add to `MONGODB_URI` in environment variables

### Local MongoDB

```bash
# Install MongoDB
sudo apt update
sudo apt install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Use in .env.local
MONGODB_URI=mongodb://localhost:27017/couponvault
```

## 🔐 Environment Variables

### Required Variables

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/couponvault

# Authentication
JWT_SECRET=your-random-secret-at-least-32-characters
JWT_EXPIRES_IN=7d

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15

# Coupon Settings
DAILY_COUPON_BATCH_SIZE=100
AUTO_REFILL_THRESHOLD=20
```

### Optional Variables

```env
# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Affiliate Links
AMAZON_AFFILIATE_TAG=your-tag
FLIPKART_AFFILIATE_TAG=your-tag
```

## 🔄 Automated Coupon Generation

### Set up Cron Jobs

For automated daily coupon generation:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * cd /path/to/CouponVault && node scripts/dailyGeneration.js
```

Create `scripts/dailyGeneration.js`:
```javascript
const { generateDailyBatch } = require('../src/utils/couponGenerator');

async function run() {
  try {
    const result = await generateDailyBatch();
    console.log('Daily batch generation:', result);
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

run();
```

## 📊 Monitoring

### Set up Monitoring Tools

1. **Application Monitoring**
   - Use Vercel Analytics (if on Vercel)
   - Or install New Relic / DataDog

2. **Database Monitoring**
   - MongoDB Atlas monitoring
   - Set up alerts for storage/performance

3. **Error Tracking**
   - Install Sentry for error tracking

```bash
npm install @sentry/nextjs
```

## 🔧 Performance Optimization

### 1. Enable Redis Caching

```bash
# Install Redis
sudo apt install redis-server

# Configure in code
REDIS_URL=redis://localhost:6379
```

### 2. CDN Setup

Configure Vercel Edge Network or CloudFlare for static assets.

### 3. Database Indexing

Indexes are already set in models, but verify:
```javascript
db.coupons.getIndexes()
db.platforms.getIndexes()
```

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set proper CORS headers
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Set up firewall rules

## 🔄 Backup Strategy

### Automated MongoDB Backups

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/couponvault_$DATE"

# Add to crontab (daily at 3 AM)
0 3 * * * /path/to/backup.sh
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Deploy multiple instances behind load balancer
- Use Redis for distributed rate limiting
- Enable database replication

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Enable caching layers

## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed**
- Check MongoDB URI
- Verify network access
- Check firewall rules

**Build Errors**
- Clear `.next` folder
- Delete `node_modules` and reinstall
- Check Node.js version

**Performance Issues**
- Enable Redis caching
- Optimize database queries
- Use CDN for static assets

## 📞 Support

For deployment issues:
- Email: support@couponvault.com
- Documentation: Check README.md
- Issues: Open GitHub issue

---

**Happy Deploying! 🚀**
