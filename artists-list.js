import { notion, getProp, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

const DB = process.env.NOTION_CLIENTS_DB_ID || '';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  const unauth = await requireAuth(event); if (unauth) return unauth;
  if (!DB) return ok([]);  // No DB configured → empty so UI falls back to sample data

  try {
    const res = await notion.databases.query({ database_id: DB, page_size: 100 });
    const clients = res.results.map(p => ({
      id:              p.id,
      name:            getProp(p, 'Name') || '',
      genre:           getProp(p, 'Genre') || '',
      bio:             getProp(p, 'Bio') || '',
      brandVoice:      getProp(p, 'Brand Voice') || '',
      targetAudience:  getProp(p, 'Target Audience') || '',
      dos:             getProp(p, "Do's") || [],
      donts:           getProp(p, "Don'ts") || [],
      brandColors:     (getProp(p, 'Brand Colors') || '').split(',').map(s => s.trim()).filter(Boolean),
      handles: {
        instagram: getProp(p, 'IG Handle')      || '',
        tiktok:    getProp(p, 'TikTok Handle')  || '',
        facebook:  getProp(p, 'Facebook Handle')|| '',
        youtube:   getProp(p, 'YouTube Handle') || '',
      },
      followers: {
        instagram: getProp(p, 'IG Followers')      || null,
        tiktok:    getProp(p, 'TikTok Followers')  || null,
        youtube:   getProp(p, 'YouTube Followers') || null,
      },
      color:    getProp(p, 'Color')    || '#d96b3a',
      initials: getProp(p, 'Initials') || (getProp(p, 'Name') || '').split(/\s+/).map(w => w[0]).join('').slice(0,2).toUpperCase(),
      driveFolderId: getProp(p, 'Drive Folder ID') || '',
      lastSynced:    getProp(p, 'Last Synced') || null,
      platforms: ['instagram','tiktok','facebook','youtube'].filter(pl => {
        const k = ({ instagram: 'IG Handle', tiktok: 'TikTok Handle', facebook: 'Facebook Handle', youtube: 'YouTube Handle' })[pl];
        return !!getProp(p, k);
      }),
    })).filter(c => c.name);
    return ok(clients);
  } catch (e) {
    console.error('[social:artists-list]', e.message);
    return ok([]); // soft-fail: UI shows sample data
  }
};
