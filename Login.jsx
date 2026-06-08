import fetch from 'node-fetch';
import { ok, err, CORS } from './_notion.js';
import { requireAdmin } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAdmin(context);
  if (authErr) return authErr;

  try {
    // role: 'admin' | 'sales' | '' (empty = full-access OVMG team member)
    const { email, name, role } = JSON.parse(event.body || '{}');
    if (!email) return err(400, 'email is required');

    // OVMG emails get full access by email domain; external invites need 'sales' role
    const isOvmgEmail = email.endsWith('@onevibemediagroup.com');
    if (!isOvmgEmail && role !== 'sales') {
      return err(400, 'External (non-OVMG) users must be invited with the sales role');
    }

    const siteUrl = process.env.URL || `https://${process.env.SITE_NAME}.netlify.app`;
    const token   = context.clientContext?.identity?.token;

    const roles = role === 'admin' ? ['admin'] : role === 'sales' ? ['sales'] : [];

    const res = await fetch(`${siteUrl}/.netlify/identity/admin/users`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        data: { full_name: name || email.split('@')[0] },
        app_metadata: { roles },
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return err(res.status, msg);
    }

    return ok({ invited: true, email });
  } catch (e) {
    return err(500, e.message);
  }
};
