// Shared Notion client used by all functions.
import { Client } from '@notionhq/client';

export const notion = new Client({ auth: process.env.NOTION_TOKEN });

export const DB = {
  CRM:       '311ec2c4642881c2af03f92bb583f4ba',
  TASKS:     '311ec2c46428817a9cb8c18ea82101b0',
  GOALS:     '5baaa13aba09464aa686122518fd63e8',
  FINANCIAL: '20eec2c4642881608f64f87fd778f27e',
  COMPANIES: '312ec2c4642880aea5facc7396fb9327',
  NOTES:     '314ec2c4642880e28bd2000b1bc2224d',
  // Set NOTION_OUTREACH_DB_ID in Netlify env vars → Site settings → Environment variables
  OUTREACH:  process.env.NOTION_OUTREACH_DB_ID || '',
};

// ── Property readers ─────────────────────────────────────────────────────────
export function getProp(page, name) {
  const p = page.properties?.[name];
  if (!p) return null;
  switch (p.type) {
    case 'title':        return p.title?.map(r => r.plain_text).join('') || '';
    case 'rich_text':    return p.rich_text?.map(r => r.plain_text).join('') || '';
    case 'select':       return p.select?.name || null;
    case 'multi_select': return p.multi_select?.map(s => s.name) || [];
    case 'number':       return p.number ?? null;
    case 'date':         return p.date?.start || null;
    case 'checkbox':     return p.checkbox ?? false;
    case 'email':        return p.email || null;
    case 'phone_number': return p.phone_number || null;
    case 'url':          return p.url || null;
    case 'relation':     return p.relation?.map(r => r.id) || [];
    case 'people':       return p.people?.map(u => u.name || u.id) || [];
    case 'created_time': return p.created_time || null;
    default:             return null;
  }
}

// ── Property builders ─────────────────────────────────────────────────────────
export function title(text) {
  return { title: [{ text: { content: String(text || '') } }] };
}
export function richText(text) {
  return { rich_text: [{ text: { content: String(text || '') } }] };
}
export function select(name) {
  return name ? { select: { name } } : { select: null };
}
export function multiSelect(names = []) {
  return { multi_select: names.map(n => ({ name: n })) };
}
export function date(iso) {
  return iso ? { date: { start: iso } } : { date: null };
}
export function number(n) {
  return { number: n == null ? null : Number(n) };
}
export function relation(ids = []) {
  return { relation: ids.map(id => ({ id })) };
}

// ── CORS headers ──────────────────────────────────────────────────────────────
export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
};

export function ok(body) {
  return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
export function err(code, msg) {
  return { statusCode: code, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: msg }) };
}
