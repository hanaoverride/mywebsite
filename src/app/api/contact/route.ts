import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

interface ContactBody {
  from_name?: string;
  from_email?: string;
  subject?: string;
  message?: string;
}
function validate(body: ContactBody): string | null {
  if (!body.from_name?.trim()) return 'Name is required';
  if (!body.from_email?.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.from_email)) return 'Invalid email format';
  if (!body.subject?.trim()) return 'Subject is required';
  if (!body.message?.trim()) return 'Message is required';
  if (body.message.length > 1000) return 'Message must be 1000 characters or less';
  return null;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.error('Missing EmailJS configuration:', { serviceId, templateId, publicKey });
    return NextResponse.json(
      { error: 'Email configuration is missing' },
      { status: 500 }
    );
  }

  try {
    console.log('Sending email with params:', {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      hasPrivateKey: !!privateKey,
    });

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          from_name: body.from_name,
          from_email: body.from_email,
          subject: body.subject,
          message: body.message,
        },
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    }

    const errorText = await response.text();
    console.error('EmailJS error response:', response.status, errorText);

    const mailtoUrl = `mailto:hanaoverride@gmail.com?subject=${encodeURIComponent(body.subject)}&body=${encodeURIComponent(`From: ${body.from_name} (${body.from_email})\n\n${body.message}`)}`;
    return NextResponse.json(
      {
        success: false,
        error: `EmailJS error: ${errorText}`,
        fallback: mailtoUrl,
      },
      { status: 502 },
    );
  } catch (error: any) {
    console.error('Fetch error:', error);
    const mailtoUrl = `mailto:hanaoverride@gmail.com?subject=${encodeURIComponent(body.subject)}&body=${encodeURIComponent(`From: ${body.from_name} (${body.from_email})\n\n${body.message}`)}`;
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send email',
        fallback: mailtoUrl,
      },
      { status: 502 },
    );
  }
}
