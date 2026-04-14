import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60; // 60 seconds timeout for PDF generation

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json({ error: 'HTML content required' }, { status: 400 });
    }

    // Use PDFShift API for reliable HTML to PDF conversion
    const pdfShiftApiKey = process.env.PDFSHIFT_API_KEY;
    
    if (!pdfShiftApiKey) {
      // Fallback: return HTML if no API key
      return new NextResponse(Buffer.from(html), {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': 'attachment; filename="certificate.html"',
        },
      });
    }

    const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${pdfShiftApiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: html,
        landscape: true,
        format: 'A4',
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        print_background: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`PDFShift API error: ${response.statusText}`);
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="certificate.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
