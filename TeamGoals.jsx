// Receives base64-encoded audio from the browser, sends to OpenAI Whisper,
// returns the transcript text.
// Uses fs.createReadStream (not File/toFile) to stay 100% Node.js compatible.
import OpenAI from 'openai';
import { writeFile, unlink } from 'fs/promises';
import { createReadStream } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAuth(context);
  if (authErr) return authErr;

  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed');

  let tmpPath = null;
  try {
    const { audio, mimeType } = JSON.parse(event.body || '{}');
    if (!audio) return err(400, 'audio (base64) is required');

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model  = process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-mini-transcribe';

    // Decode base64 → temp file → ReadStream (avoids browser-only File/Blob APIs)
    const buf = Buffer.from(audio, 'base64');
    const ext = (mimeType || 'audio/webm').includes('ogg') ? 'ogg' : 'webm';
    tmpPath = join(tmpdir(), `rec_${Date.now()}.${ext}`);
    await writeFile(tmpPath, buf);

    const transcription = await openai.audio.transcriptions.create({
      file:  createReadStream(tmpPath),
      model,
      response_format: 'text',
    });

    // response_format:'text' returns a plain string
    const transcript = typeof transcription === 'string' ? transcription : transcription.text || '';

    return ok({ transcript: transcript.trim() });
  } catch (e) {
    console.error('transcribe error:', e);
    return err(500, e.message);
  } finally {
    // Always clean up the temp file
    if (tmpPath) await unlink(tmpPath).catch(() => {});
  }
};
