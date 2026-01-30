# 🗄️ MongoDB Atlas Setup (5 Minutes)

Since you don't have MongoDB installed locally, use MongoDB Atlas (free cloud database).

## Step 1: Create Account

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with:
   - Email
   - Or Google account (faster)

## Step 2: Create FREE Cluster

1. After login, click **"Build a Database"**
2. Choose **FREE tier** (M0 Sandbox - 512MB)
3. Select:
   - Cloud Provider: **AWS** (or any)
   - Region: **Mumbai** or closest to you
4. Cluster Name: **CouponVault** (or leave default)
5. Click **"Create"**
6. Wait 1-3 minutes for cluster creation

## Step 3: Create Database User

1. You'll see **"Security Quickstart"**
2. Under **"How would you like to authenticate?"**:
   - Username: `couponvault_user`
   - Password: Click **"Autogenerate Secure Password"**
   - **COPY and SAVE this password!** (you'll need it)
3. Click **"Create User"**

## Step 4: Whitelist IP Address

1. Scroll down to **"Where would you like to connect from?"**
2. Click **"Add My Current IP Address"**
3. OR click **"Allow Access from Anywhere"** (easier for development)
   - This adds IP: `0.0.0.0/0`
4. Click **"Finish and Close"**

## Step 5: Get Connection String

1. Click **"Connect"** button
2. Choose **"Connect your application"**
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. **Copy the connection string**, looks like:
   ```
   mongodb+srv://couponvault_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **IMPORTANT**: Replace `<password>` with the actual password you saved earlier

## Step 6: Update Your .env.local File

1. Open: `C:\Users\Shivam\.gemini\antigravity\scratch\CouponVault\.env.local`

2. Find the line:
   ```env
   MONGODB_URI=mongodb://localhost:27017/couponvault
   ```

3. Replace it with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://couponvault_user:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/couponvault?retryWrites=true&w=majority
   ```

4. **Save the file**

## Example:

If your password was: `Abc123xyz!`
And your cluster is: `cluster0.ab12cd.mongodb.net`

Your `.env.local` should have:
```env
MONGODB_URI=mongodb+srv://couponvault_user:Abc123xyz!@cluster0.ab12cd.mongodb.net/couponvault?retryWrites=true&w=majority
```

## ✅ Verify Connection

Your connection string should:
- Start with `mongodb+srv://`
- Have your username
- Have your actual password (not `<password>`)
- End with `/couponvault?retryWrites=true&w=majority`

## 🎉 Done!

Now run:
```bash
npm run seed
npm run dev
```

---

## 🆘 Troubleshooting

**Error: "Authentication failed"**
- Check password is correct (no `<password>` placeholder)
- Password may have special characters - try URL encoding

**Error: "Connection timeout"**
- Check IP whitelist includes `0.0.0.0/0`
- Or add your current IP address

**Error: "Network error"**
- Check internet connection
- Firewall might be blocking MongoDB ports

---

**Need Help?** The MongoDB Atlas interface is very user-friendly. Just follow the wizard!
