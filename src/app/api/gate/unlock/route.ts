import { NextResponse } from 'next/server';

type Body = { answers?: string[] };

function norm(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, '');
}

async function sha256(input: string) {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Constant-time-ish compare (prevents trivial timing differences)
function safeEq(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function getExpectedHashes(): string[] {
  // Supports up to 10 questions without changing code
  const keys = Array.from({ length: 10 }, (_, i) => `GATE_A${i + 1}_HASH`);
  const values = keys
    .map((k) => process.env[k])
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0);

  return values;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const answers = Array.isArray(body.answers) ? body.answers : [];

  const expected = getExpectedHashes();
  if (expected.length === 0) {
    return NextResponse.json({ ok: false, error: 'Gate not configured' }, { status: 500 });
  }

  // Must match number of configured questions (1..10)
  if (answers.length !== expected.length) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const hashed = await Promise.all(answers.map((a) => sha256(norm(a))));
  const ok = hashed.every((h, i) => safeEq(h, expected[i]));

  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });

  const res = NextResponse.json({ ok: true });

  // 30-day unlock
  res.cookies.set('ethel_gate', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  return res;
}
