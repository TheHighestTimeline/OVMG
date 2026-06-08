// Auth helper — validates Netlify Identity JWT from context.clientContext
import { CORS } from './_notion.js';

export function getUser(context) {
  return context?.clientContext?.user || null;
}

export function requireAuth(context) {
  const user = getUser(context);
  if (!user) {
    return {
      statusCode: 401,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }
  return null; // null = no error, proceed
}

export function requireAdmin(context) {
  const user = getUser(context);
  if (!user) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
  const roles = user.app_metadata?.roles || [];
  if (!roles.includes('admin')) {
    return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: 'Admin required' }) };
  }
  return null;
}

// Full access = OVMG email address OR admin role.
// Sales reps can read/write outreach but cannot call full-access endpoints.
export function requireFullAccess(context) {
  const user = getUser(context);
  if (!user) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
  const roles       = user.app_metadata?.roles || [];
  const isOvmgEmail = (user.email || '').endsWith('@onevibemediagroup.com');
  if (!isOvmgEmail && !roles.includes('admin')) {
    return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: 'Access denied' }) };
  }
  return null;
}
