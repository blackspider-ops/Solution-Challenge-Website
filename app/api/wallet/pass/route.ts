import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Generate wallet pass for ticket
 * Returns an HTML page with the ticket that can be saved/bookmarked
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  try {
    // Find ticket and user
    const ticket = await db.ticket.findUnique({
      where: { qrToken: token },
      include: {
        registration: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const user = ticket.registration.user;
    const qrCodeUrl = `${request.nextUrl.origin}/api/qr/${token}`;

    // Generate a mobile-optimized HTML ticket page
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#667eea">
  <title>Solution Challenge 2026 - Ticket</title>
  <link rel="apple-touch-icon" href="/icon.svg">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .ticket {
      background: white;
      border-radius: 24px;
      max-width: 400px;
      width: 100%;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 32px 24px;
      text-align: center;
      color: white;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 32px 24px;
    }
    .name {
      font-size: 28px;
      font-weight: 700;
      color: #111;
      margin-bottom: 8px;
      text-align: center;
    }
    .email {
      font-size: 14px;
      color: #666;
      text-align: center;
      margin-bottom: 32px;
    }
    .qr-container {
      background: #f9fafb;
      padding: 24px;
      border-radius: 16px;
      text-align: center;
      margin-bottom: 24px;
    }
    .qr-container img {
      width: 240px;
      height: 240px;
      border: 3px solid white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .token {
      font-family: 'Courier New', monospace;
      font-size: 10px;
      color: #999;
      margin-top: 12px;
      word-break: break-all;
    }
    .details {
      background: #dbeafe;
      border-left: 4px solid #3b82f6;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .details h3 {
      font-size: 14px;
      color: #1e40af;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .details p {
      font-size: 14px;
      color: #1e3a8a;
      line-height: 1.8;
      margin: 0;
    }
    .instructions {
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .instructions h3 {
      font-size: 14px;
      color: #166534;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .instructions p {
      font-size: 13px;
      color: #166534;
      line-height: 1.6;
    }
    .actions {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
    .btn {
      flex: 1;
      padding: 14px;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      padding-bottom: 8px;
    }
    @media (max-width: 480px) {
      .qr-container img { width: 200px; height: 200px; }
      .name { font-size: 24px; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <h1>Solution Challenge 2026</h1>
      <p>Your Event Ticket</p>
    </div>
    
    <div class="content">
      <div class="name">${user.name || 'Participant'}</div>
      <div class="email">${user.email}</div>
      
      <div class="qr-container">
        <img src="${qrCodeUrl}" alt="QR Code Ticket">
        <div class="token">${token}</div>
      </div>
      
      <div class="details">
        <h3>📅 Event Details</h3>
        <p>
          <strong>Date:</strong> April 11-12, 2026<br>
          <strong>Time:</strong> 7:00 PM - 12:00 PM<br>
          <strong>Location:</strong> ECoRE Building, University Park, PA<br>
          <strong>Organizer:</strong> Google Developer Groups at Penn State
        </p>
      </div>
      
      <div class="instructions">
        <h3>✓ How to use this ticket:</h3>
        <p>
          1. Bookmark this page or add to home screen<br>
          2. Show the QR code at event entrance<br>
          3. Screenshot for offline access
        </p>
      </div>
      
      <div class="actions">
        <button class="btn btn-secondary" onclick="window.print()">📄 Print</button>
        <button class="btn btn-secondary" onclick="downloadQR()">💾 Save QR</button>
      </div>
      
      <div class="footer">
        <p><strong>Google Developer Groups at Penn State</strong></p>
        <p style="margin-top: 4px;">This ticket is valid only for ${user.email}</p>
      </div>
    </div>
  </div>
  
  <script>
    // Add to home screen prompt for iOS
    if (navigator.standalone === false && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
      setTimeout(() => {
        alert('Tip: Tap the Share button and select "Add to Home Screen" to save this ticket for quick access!');
      }, 1000);
    }
    
    function downloadQR() {
      const link = document.createElement('a');
      link.href = '${qrCodeUrl}';
      link.download = 'solution-challenge-ticket.png';
      link.click();
    }
  </script>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Wallet pass error:", error);
    return NextResponse.json(
      { error: "Failed to generate wallet pass" },
      { status: 500 }
    );
  }
}
