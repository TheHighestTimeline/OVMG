import { notion, DB, getProp, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const res = await notion.databases.query({
      database_id: DB.FINANCIAL,
      page_size: 100,
    });

    const items = res.results.map(p => {
      const target  = getProp(p, 'Target') ?? getProp(p, 'Goal Amount') ?? 0;
      const current = getProp(p, 'Current Amount') ?? getProp(p, 'Current') ?? getProp(p, 'Amount Raised') ?? 0;
      return {
        id:            p.id,
        goal:          getProp(p, 'Goal') || getProp(p, 'Name') || getProp(p, 'Title') || '',
        type:          getProp(p, 'Type') || 'Other',
        target,
        currentAmount: current,
        progress:      target > 0 ? current / target : 0,
      };
    });

    return ok(items);
  } catch (e) {
    return err(500, e.message);
  }
};
