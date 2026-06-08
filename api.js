// Lists all Netlify Identity users. Admin only.
import fetch from 'node-fetch';
import { ok, err, CORS } from './_notion.js';
import { requireAdmin } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAdmin(context);
  if (authErr) return authErr;

  const siteUrl = process.env.URL || `https://${process.env.SITE_NAME}.netlify.app`;
  const token   = context.clientContext?.identity?.token;

  if (!token) return err(500, 'Identity token not available');

  try {
    const res  = await fetch(`${siteUrl}/.netlify/identity/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    const users = (data.users || []).map(u => ({
      id:          u.id,
      email:       u.email,
      fullName:    u.user_metadata?.full_name || '',
      roles:       u.app_metadata?.roles || [],
      isAdmin:     (u.app_metadata?.roles || []).includes('admin'),
      confirmedAt: u.confirmed_at,
      lastSignInAt: u.last_sign_in_at,
      banned:      u.banned || false,
    }));

    return ok(users);
  } catch (e) {
    return err(500, e.message);
  }
};
