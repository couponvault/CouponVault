import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If we're trying to access static files like images, let them pass (optional, but good for favicon)
  if (request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.includes('.')) {
      return NextResponse.next();
  }

  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Under Maintenance | CouponVault</title>
        <style>
          body { 
            background-color: #0a0b0f; 
            color: #ffffff; 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            display: flex; 
            flex-direction: column;
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
            text-align: center; 
          }
          .container {
            padding: 40px;
            background: #12131a;
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            max-width: 500px;
            width: 90%;
          }
          h1 { 
            font-size: 2.5rem; 
            margin-top: 0;
            margin-bottom: 1rem;
            background: linear-gradient(to right, #22d3ee, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p { 
            color: #9ca3af; 
            line-height: 1.6;
            margin-bottom: 0;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🛠️</div>
          <h1>Under Maintenance</h1>
          <p>We are currently upgrading CouponVault with an amazing new look and features. Please check back tomorrow morning!</p>
        </div>
      </body>
    </html>
  `, {
    status: 503,
    headers: { 'content-type': 'text/html' }
  })
}

// Apply this middleware to every single route
export const config = {
  matcher: '/:path*',
}
