// Takes a transcript + context (section, existing tasks/contacts) and uses
// GPT-4o-mini to parse intent and return structured actions.
import OpenAI from 'openai';
import { ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAuth(context);
  if (authErr) return authErr;

  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed');

  try {
    const { transcript, context: ctx } = JSON.parse(event.body || '{}');
    if (!transcript) return err(400, 'transcript is required');

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model  = process.env.OPENAI_PARSE_MODEL || 'gpt-4o-mini';
    const section = ctx?.section || 'general';

    const systemPrompt = buildSystemPrompt(section, ctx);
    const userPrompt   = `Transcript: "${transcript}"`;

    const response = await openai.chat.completions.create({
      model,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return ok(parsed);
  } catch (e) {
    console.error('voice-parse error:', e);
    return err(500, e.message);
  }
};

function buildSystemPrompt(section, ctx) {
  const tasksJSON    = ctx?.tasks    ? JSON.stringify(ctx.tasks.slice(0, 30))    : '[]';
  const contactsJSON = ctx?.contacts ? JSON.stringify(ctx.contacts.slice(0, 20)) : '[]';
  const today        = new Date().toISOString().slice(0, 10);

  if (section === 'my-day') {
    return `You are an AI assistant for a media company internal dashboard. Today is ${today}.
The user has just recorded a voice memo about their workday. Extract everything they mentioned.

Active tasks (JSON):
${tasksJSON}

Return a JSON object with this exact shape:
{
  "summary": "1-2 sentence summary of the day",
  "taskUpdates": [
    {
      "taskId": "<notion page id or null if no match>",
      "taskTitle": "<matched task name>",
      "newStatus": "<Done|In progress|Not started|On Hold|Waiting On Response|null>",
      "note": "<what the user said about this task>",
      "confidence": 0.0-1.0
    }
  ],
  "newTasks": [
    {
      "task": "<task description>",
      "priority": "High|Medium|Low",
      "category": []
    }
  ],
  "notes": [
    { "title": "<short title>", "body": "<full note text>" }
  ]
}

RULES:
- taskUpdates: match tasks by semantic similarity. Only include tasks the user actually mentioned. Use null taskId if no task matches.
- notes: Create ONE note entry per distinct topic, project, or activity the user mentioned — even if it also appears in taskUpdates or newTasks. Do NOT collapse multiple topics into a single note. For example, if the user mentions dashboards AND automation AND a client call, that should be 3 separate notes. Capture the specific details they said for each topic, not a vague summary. If the user only mentioned one thing, one note is fine.
- newTasks: only include things the user is explicitly committing to do next — not things they already did.`;
  }

  if (section === 'new-task' || section === 'task-update') {
    return `You are an AI assistant parsing a voice command for task management. Today is ${today}.
Active tasks: ${tasksJSON}

For a new task command, return:
{
  "task": { "task": "...", "owner": "...", "priority": "High|Medium|Low", "status": "Not started", "dueDate": "YYYY-MM-DD or null" }
}

For an update command (user described work they did or a status change on an existing task), return:
{
  "newStatus": "Done|In progress|Not started|On Hold|Waiting On Response|null",
  "summary": "brief description of the update"
}

Parse natural language like "mark it done", "finished that", "push to next week", etc.`;
  }

  if (section === 'new-contact') {
    return `You are an AI assistant parsing a voice command to add a new contact to a CRM.
Extract contact details from what the user says and return:
{
  "contact": {
    "name": "...",
    "company": "...",
    "role": "...",
    "email": "...",
    "phone": "...",
    "type": "External|Internal",
    "status": "Active"
  }
}
If any field is not mentioned, use an empty string or "Active"/"External" defaults.`;
  }

  if (section === 'contact-note') {
    const contactName = ctx?.contactName || 'this contact';
    return `You are an AI assistant logging a voice note about ${contactName}.
Return:
{
  "summary": "one sentence summary of the note",
  "title": "short title for the note (5 words max)"
}`;
  }

  // General / overview
  return `You are an AI assistant for a media company internal dashboard. Today is ${today}.
The user said something via voice. Route it to the right action.
Active tasks: ${tasksJSON}
Contacts: ${contactsJSON}

Return a JSON object:
{
  "summary": "what you understood",
  "actions": [
    { "type": "create_task|update_task|add_note|add_contact|other", "description": "..." }
  ]
}`;
}
