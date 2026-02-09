import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sections } from '@/data/questions';
import { SubmissionPayload, SingleResponse, MultiResponse, TextResponse, RankResponse, PercentageResponse, QuestionResponse } from '@/lib/types';

function formatResponseForEmail(response: QuestionResponse | undefined, type: string): string {
  if (!response) return '<span style="color:#555577;">— Not answered —</span>';

  switch (type) {
    case 'single': {
      const r = response as SingleResponse;
      if (!r.selected) return '<span style="color:#555577;">— Not answered —</span>';
      if (r.selected === '__other__') return r.other || 'Other';
      return r.other ? `${r.selected}<br/><em style="color:#8888AA;">Other: ${r.other}</em>` : r.selected;
    }
    case 'multi': {
      const r = response as MultiResponse;
      if (!r.selected || r.selected.length === 0) return '<span style="color:#555577;">— Not answered —</span>';
      const items = r.selected
        .filter(s => s !== '__other__')
        .map(s => `<li style="margin:2px 0;">${s}</li>`);
      if (r.selected.includes('__other__') && r.other) {
        items.push(`<li style="margin:2px 0;"><em>Other: ${r.other}</em></li>`);
      }
      return `<ul style="margin:4px 0;padding-left:16px;">${items.join('')}</ul>`;
    }
    case 'text': {
      const r = response as TextResponse;
      if (!r.text?.trim()) return '<span style="color:#555577;">— Not answered —</span>';
      return `<div style="background:#1A1A2E;padding:8px 12px;border-radius:6px;border-left:3px solid #00F0FF;margin:4px 0;">${r.text}</div>`;
    }
    case 'rank': {
      const r = response as RankResponse;
      if (!r.ranked || r.ranked.length === 0) return '<span style="color:#555577;">— Not answered —</span>';
      return `<ol style="margin:4px 0;padding-left:16px;">${r.ranked.map((item, i) => `<li style="margin:2px 0;"><strong style="color:#39FF14;">#${i + 1}</strong> ${item}</li>`).join('')}</ol>`;
    }
    case 'percentage': {
      const r = response as PercentageResponse;
      if (!r.allocations || Object.keys(r.allocations).length === 0) return '<span style="color:#555577;">— Not answered —</span>';
      const total = Object.values(r.allocations).reduce((s, v) => s + v, 0);
      return `<table style="width:100%;border-collapse:collapse;margin:4px 0;">
        ${Object.entries(r.allocations)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => `<tr><td style="padding:4px 8px;color:#E8E8F0;">${k}</td><td style="padding:4px 8px;text-align:right;color:#00F0FF;font-family:monospace;">${v}%</td><td style="padding:4px 8px;text-align:right;color:#8888AA;font-family:monospace;">~${Math.round((v / 100) * 60000).toLocaleString()} SF</td></tr>`)
          .join('')}
        <tr style="border-top:1px solid #2A2A3E;"><td style="padding:4px 8px;color:#E8E8F0;font-weight:bold;">Total</td><td style="padding:4px 8px;text-align:right;font-weight:bold;color:${total === 100 ? '#39FF14' : '#FF006E'};font-family:monospace;">${total}%</td><td></td></tr>
      </table>`;
    }
    default:
      return '—';
  }
}

function buildOwnerEmailHtml(payload: SubmissionPayload): string {
  const sectionHtmls = sections.map((section) => {
    const questionHtmls = section.questions.map((q) => {
      return `
        <div style="margin-bottom:16px;">
          <div style="font-size:13px;color:#8888AA;margin-bottom:4px;">${q.text}</div>
          <div style="font-size:14px;color:#E8E8F0;">
            ${formatResponseForEmail(payload.responses[q.id], q.type)}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div style="margin-bottom:24px;">
        <div style="background:#12121A;border:1px solid #2A2A3E;border-radius:8px;overflow:hidden;">
          <div style="padding:12px 16px;background:linear-gradient(135deg,#12121A,#1A1A2E);border-bottom:1px solid #2A2A3E;">
            <span style="font-size:16px;margin-right:8px;">${section.icon}</span>
            <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:bold;color:#00F0FF;text-transform:uppercase;letter-spacing:2px;">${String(section.number).padStart(2, '0')} — ${section.title}</span>
          </div>
          <div style="padding:16px;">
            ${questionHtmls}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background-color:#0A0A0F;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
        <!-- Header -->
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:22px;color:#00F0FF;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">
            Facility Vision Response
          </h1>
          <div style="height:2px;width:80px;margin:0 auto 16px;background:linear-gradient(90deg,#00F0FF,#39FF14);border-radius:1px;"></div>
          <div style="font-size:13px;color:#8888AA;">
            Submitted ${new Date(payload.submittedAt).toLocaleString()}
          </div>
        </div>

        <!-- Respondent Info -->
        <div style="background:#12121A;border:1px solid #2A2A3E;border-radius:8px;padding:16px;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 8px;color:#8888AA;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Name</td>
              <td style="padding:4px 8px;color:#E8E8F0;font-size:14px;">${payload.respondent.name}</td>
            </tr>
            <tr>
              <td style="padding:4px 8px;color:#8888AA;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</td>
              <td style="padding:4px 8px;color:#E8E8F0;font-size:14px;">${payload.respondent.email}</td>
            </tr>
            ${payload.respondent.role ? `<tr>
              <td style="padding:4px 8px;color:#8888AA;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Role</td>
              <td style="padding:4px 8px;color:#E8E8F0;font-size:14px;">${payload.respondent.role}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:4px 8px;color:#8888AA;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Completion</td>
              <td style="padding:4px 8px;color:${payload.completionRate === 100 ? '#39FF14' : '#00F0FF'};font-size:14px;font-weight:bold;">${payload.completionRate}%</td>
            </tr>
          </table>
        </div>

        <!-- Sections -->
        ${sectionHtmls}

        <!-- Footer -->
        <div style="text-align:center;padding:24px 0;border-top:1px solid #2A2A3E;">
          <div style="font-size:11px;color:#555577;">
            Prime Facility Vision Questionnaire — ${new Date().getFullYear()}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildConfirmationEmailHtml(payload: SubmissionPayload): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background-color:#0A0A0F;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:22px;color:#00F0FF;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">
            Thank You
          </h1>
          <div style="height:2px;width:80px;margin:0 auto 16px;background:linear-gradient(90deg,#00F0FF,#39FF14);border-radius:1px;"></div>
        </div>

        <div style="background:#12121A;border:1px solid #2A2A3E;border-radius:8px;padding:24px;margin-bottom:24px;">
          <p style="color:#E8E8F0;font-size:15px;line-height:1.6;margin:0 0 16px;">
            Hi ${payload.respondent.name},
          </p>
          <p style="color:#8888AA;font-size:14px;line-height:1.6;margin:0 0 16px;">
            Your Facility Vision questionnaire has been received successfully. We appreciate you taking the time to share your vision for the 60,000 SF facility.
          </p>
          <div style="background:#1A1A2E;border-radius:6px;padding:12px 16px;margin-bottom:16px;">
            <div style="font-size:12px;color:#8888AA;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Completion Rate</div>
            <div style="font-size:24px;color:${payload.completionRate === 100 ? '#39FF14' : '#00F0FF'};font-weight:bold;font-family:monospace;">${payload.completionRate}%</div>
          </div>
          <p style="color:#8888AA;font-size:14px;line-height:1.6;margin:0;">
            We'll be in touch within 48 hours to discuss next steps.
          </p>
        </div>

        <div style="text-align:center;padding:24px 0;border-top:1px solid #2A2A3E;">
          <div style="font-size:11px;color:#555577;">
            Prime Facility Vision Questionnaire — ${new Date().getFullYear()}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildRespondentCopyHtml(payload: SubmissionPayload): string {
  const sectionHtmls = sections.map((section) => {
    const questionHtmls = section.questions.map((q) => {
      return `
        <div style="margin-bottom:16px;">
          <div style="font-size:13px;color:#8888AA;margin-bottom:4px;">${q.text}</div>
          <div style="font-size:14px;color:#E8E8F0;">
            ${formatResponseForEmail(payload.responses[q.id], q.type)}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div style="margin-bottom:24px;">
        <div style="background:#12121A;border:1px solid #2A2A3E;border-radius:8px;overflow:hidden;">
          <div style="padding:12px 16px;background:linear-gradient(135deg,#12121A,#1A1A2E);border-bottom:1px solid #2A2A3E;">
            <span style="font-size:16px;margin-right:8px;">${section.icon}</span>
            <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:bold;color:#00F0FF;text-transform:uppercase;letter-spacing:2px;">${String(section.number).padStart(2, '0')} — ${section.title}</span>
          </div>
          <div style="padding:16px;">
            ${questionHtmls}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background-color:#0A0A0F;font-family:'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:22px;color:#00F0FF;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">
            Your Facility Vision Responses
          </h1>
          <div style="height:2px;width:80px;margin:0 auto 16px;background:linear-gradient(90deg,#00F0FF,#39FF14);border-radius:1px;"></div>
          <div style="font-size:13px;color:#8888AA;">
            Submitted ${new Date(payload.submittedAt).toLocaleString()} — ${payload.completionRate}% Complete
          </div>
        </div>

        <div style="background:#12121A;border:1px solid #2A2A3E;border-radius:8px;padding:16px;margin-bottom:24px;">
          <p style="color:#E8E8F0;font-size:15px;line-height:1.6;margin:0 0 12px;">
            Hi ${payload.respondent.name}, here's a copy of all your responses for your records.
          </p>
          <p style="color:#8888AA;font-size:13px;line-height:1.6;margin:0;">
            We'll be in touch within 48 hours to discuss next steps.
          </p>
        </div>

        ${sectionHtmls}

        <div style="text-align:center;padding:24px 0;border-top:1px solid #2A2A3E;">
          <div style="font-size:11px;color:#555577;">
            Prime Facility Vision Questionnaire — ${new Date().getFullYear()}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const payload: SubmissionPayload = await request.json();

    if (!payload.respondent?.name || !payload.respondent?.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'matthew@chrestenson.com';
    const fromAddress = process.env.FROM_EMAIL || 'Prime Facility Vision <onboarding@resend.dev>';

    if (!apiKey || apiKey === 're_xxxxxxxxxxxx') {
      // Fallback: return success anyway but log that email wasn't sent
      console.warn('RESEND_API_KEY not configured. Email not sent.');
      return NextResponse.json({
        success: true,
        warning: 'Email service not configured. Responses captured.',
      });
    }

    const resend = new Resend(apiKey);

    // Send to owner (matthew@chrestenson.com)
    const ownerEmailPromise = resend.emails.send({
      from: fromAddress,
      to: recipientEmail,
      subject: `Facility Vision Response — ${payload.respondent.name} (${payload.completionRate}%)`,
      html: buildOwnerEmailHtml(payload),
    });

    // Send full copy to respondent
    const confirmEmailPromise = resend.emails.send({
      from: fromAddress,
      to: payload.respondent.email,
      subject: 'Your Facility Vision Responses — Copy',
      html: buildRespondentCopyHtml(payload),
    });

    const [ownerResult, confirmResult] = await Promise.allSettled([
      ownerEmailPromise,
      confirmEmailPromise,
    ]);

    const errors: string[] = [];
    if (ownerResult.status === 'rejected') {
      errors.push(`Owner email failed: ${ownerResult.reason}`);
    }
    if (confirmResult.status === 'rejected') {
      errors.push(`Confirmation email failed: ${confirmResult.reason}`);
    }

    if (errors.length > 0) {
      console.error('Email errors:', errors);
      // Still return success if at least one went through
      if (ownerResult.status === 'fulfilled' || confirmResult.status === 'fulfilled') {
        return NextResponse.json({
          success: true,
          warning: errors.join('; '),
        });
      }
      return NextResponse.json(
        { success: false, error: errors.join('; ') },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
