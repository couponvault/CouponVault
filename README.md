# CouponVault 🎁

A production-ready, full-stack coupon distribution platform that automatically generates, manages, and distributes verified coupon codes for multiple e-commerce and service platforms.

![CouponVault](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat-square&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)

## 🌟 Features

### Core Functionality
- **Automatic Coupon Generation**: Programmatically generate collision-free coupon codes
- **Smart Distribution**: Intelligent coupon allocation with weighted randomization
- **Multi-Platform Support**: 50+ platforms including Amazon, Flipkart, Netflix, etc.
- **Auto-Refill System**: Automatically generates new coupons when stock runs low
- **Expiry Management**: Automatic marking and cleanup of expired coupons

### User Features
- 🎲 Random coupon generator
- 🔍 Platform browsing with search and filters
- 📋 One-click copy-to-clipboard
- 📊 Real-time coupon availability
- ⏰ Countdown timers
- 📱 Fully responsive design
- 🌙 Dark/Light mode support

### Admin Features
- 📈 Comprehensive dashboard with analytics
- 🎛️ Platform management
- ⚙️ Coupon generation configuration
- 📊 Usage statistics and reporting
- 🚨 Activity monitoring
- 🔄 Manual bulk generation

### Security & Performance
- 🔒 JWT authentication
- 🛡️ Rate limiting and anti-abuse protection
- 🔐 Password encryption with bcrypt
- 🚫 XSS/CSRF protection
- ⚡ Redis caching support
- 📝 Activity logging

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Notifications**: React Hot Toast
- **Icons**: React Icons
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd CouponVault
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local` and update the values:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/couponvault

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_EMAIL=admin@couponvault.com
ADMIN_PASSWORD=Admin@12345

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15

# Coupon Generation
DAILY_COUPON_BATCH_SIZE=100
AUTO_REFILL_THRESHOLD=20
```

4. **Seed the database**
```bash
npm run seed
```

This will:
- Create platform data (Amazon, Flipkart, Netflix, etc.)
- Create an admin user with credentials from `.env.local`

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Project Structure

```
CouponVault/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── coupons/      # Coupon endpoints
│   │   │   ├── platforms/    # Platform endpoints
│   │   │   └── admin/        # Admin endpoints
│   │   ├── admin/            # Admin dashboard
│   │   ├── platforms/        # Platform pages
│   │   ├── random/           # Random coupon page
│   │   ├── about/            # About page
│   │   ├── faq/              # FAQ page
│   │   ├── contact/          # Contact page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   ├── admin/            # Admin components
│   │   ├── Navbar.tsx        # Navigation bar
│   │   └── Footer.tsx        # Footer
│   ├── lib/                   # Utility libraries
│   │   ├── mongodb.ts        # Database connection
│   │   ├── auth.ts           # Authentication utilities
│   │   └── rateLimit.ts      # Rate limiting
│   ├── models/                # Mongoose models
│   │   ├── Platform.ts       # Platform model
│   │   ├── Coupon.ts         # Coupon model
│   │   ├── User.ts           # User model
│   │   └── Activity.ts       # Activity log model
│   └── utils/                 # Utility functions
│       └── couponGenerator.ts # Coupon generation logic
├── scripts/
│   └── seedDatabase.js       # Database seeder
├── public/                    # Static files
├── .env.local                 # Environment variables
└── package.json              # Dependencies
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Coupons
- `GET /api/coupons/random` - Get random coupon
- `GET /api/coupons/random?platform=slug` - Get random coupon for specific platform

### Platforms
- `GET /api/platforms` - Get all platforms
- `GET /api/platforms?category=ecommerce` - Filter by category

### Admin (Protected)
- `GET /api/admin/stats` - Get dashboard statistics
- `POST /api/admin/generate` - Manually generate coupons

## 🔧 Configuration

### Coupon Generation Settings

Each platform can be configured with:
- `dailyGeneration`: Number of coupons to generate daily
- `expiryDays`: Coupon validity period
- `usageLimit`: How many times a coupon can be used
- `codeLength`: Length of the coupon code
- `prefix`: Platform-specific prefix
- `discountType`: percentage | fixed | freeShipping | bogo
- `discountValue`: Min/max discount range
- `minPurchase`: Minimum order value (optional)

### Rate Limiting

- API requests: 100 per 15 minutes
- Login attempts: 10 per minute
- Daily coupon claims: 10 per day

## 🎨 Customization

### Adding New Platforms

1. Add platform data to the seeder or use admin panel
2. Configure coupon generation settings
3. Platform will automatically appear in listings

### Styling

- Tailwind configuration: `tailwind.config.js`
- Global styles: `src/app/globals.css`
- Custom animations and components included

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Docker

```bash
# Build image
docker build -t couponvault .

# Run container
docker run -p 3000:3000 couponvault
```

## 📊 Database Schema

### Platform
- Configuration for coupon generation
- Statistics tracking
- Category and branding information

### Coupon
- Unique code generation
- Usage tracking
- Expiry management
- Platform association

### User
- Authentication credentials
- Role-based access
- Claim history

### Activity
- System event logging
- Security monitoring
- Audit trail

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Account lockout after failed logins
- CSRF protection
- XSS prevention
- Input validation with Zod
- Activity logging for suspicious behavior

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB team for the robust database
- Tailwind CSS for beautiful styling
- All open-source contributors

## 📧 Support

For support, email support@couponvault.com or open an issue in the repository.

---

**Made with ❤️ for savvy shoppers**

# Last Launch Trigger: 01/26/2026 14:17:43
.
