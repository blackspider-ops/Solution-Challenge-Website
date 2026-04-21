# PDF Generation Service

A free, standalone PDF generation service using Puppeteer.

## Deploy to Render.com (Free)

1. Push this `pdf-service` folder to a GitHub repository
2. Go to https://render.com and sign up (free)
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: `gdg-pdf-service` (or any name)
   - **Root Directory**: `pdf-service`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. Copy your service URL (e.g., `https://gdg-pdf-service.onrender.com`)
9. Add this URL as `PDF_SERVICE_URL` environment variable in Vercel

## API Endpoint

**POST** `/generate-pdf`

Request body:
```json
{
  "html": "<html>...</html>"
}
```

Response:
```json
{
  "success": true,
  "pdf": "base64-encoded-pdf-data",
  "size": 123456
}
```

## Local Testing

```bash
npm start
```

Then test with:
```bash
curl -X POST http://localhost:3001/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"html":"<html><body><h1>Test</h1></body></html>"}'
```
