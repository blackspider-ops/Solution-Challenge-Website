const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'PDF Service is running', version: '1.0.0' });
});

// PDF generation endpoint
app.post('/generate-pdf', async (req, res) => {
  let browser = null;
  
  try {
    const { html } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    console.log('Launching browser...');
    console.log('HTML length:', html.length);
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    
    console.log('Setting content...');
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });

    console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);

    if (pdfBuffer.length === 0) {
      throw new Error('Generated PDF is empty');
    }

    // Send PDF as base64
    const base64Pdf = pdfBuffer.toString('base64');
    console.log('Base64 length:', base64Pdf.length);
    
    res.json({
      success: true,
      pdf: base64Pdf,
      size: pdfBuffer.length,
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed');
    }
  }
});

app.listen(PORT, () => {
  console.log(`PDF Service running on port ${PORT}`);
});
