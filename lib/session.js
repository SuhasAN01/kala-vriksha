import { serialize, parse } from 'cookie';
import jwt from 'jsonwebtoken';

const SESSION_COOKIE = 'kv_session';
const SECRET = process.env.JWT_SECRET || 'kala-vriksha-secret-key-2026-mystical';

export function setSession(res, data) {
  const token = jwt.sign(data, SECRET, { expiresIn: '7d' });
  res.setHeader('Set-Cookie', serialize(SESSION_COOKIE, token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  }));
}

export function getSession(req) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function clearSession(res) {
  res.setHeader('Set-Cookie', serialize(SESSION_COOKIE, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  }));
}
