import { airtableCreate, toAirtableFields, TASKS_MAP } from './_airtable.js';
import { ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

const TABLE = () => process.env.AIRTABLE_TABLE_TASKS || 'Master Action Board';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const body = JSON.parse(event.body || '{}');
    const { task, status, priority, owner, dueDate, dealCategory, taskType, relatedOpportunity } = body;
    if (!task) return err(400, 'task is required');

    const dealCategoryArr   = Array.isArray(dealCategory) ? dealCategory : [dealCategory].filter(Boolean);
    const relatedOppArr     = relatedOpportunity ? [relatedOpportunity] : [];

    const obj = {
      task,
      status:               status   || 'Not started',
      owner:                owner    || '',
      dealCategory:         dealCategoryArr,
      relatedOpportunities: relatedOppArr,
    };
    if (priority) obj.priority = priority;
    if (dueDate)  obj.dueDate  = dueDate;
    if (taskType) obj.taskType = taskType;

    const fields = toAirtableFields(obj, TASKS_MAP);
    const record = await airtableCreate(TABLE(), fields);

    return ok({ id: record.id, task, status, priority, owner, dueDate, taskType: taskType || null, dealCategory: dealCategoryArr });
  } catch (e) {
    return err(500, e.message);
  }
};
