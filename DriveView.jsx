import { useState, useEffect, useRef } from 'react';
import { C, SERIF, SANS, MONO, fmtD, prBg, prFg, uid } from '../constants.js';
import { Eyebrow, Btn, Tag, Inp, Sel, FR, PBar, useConfirm } from '../components/UI.jsx';
import { NotesList, LinksList, Collapsible } from '../components/CardExtras.jsx';
import useIsMobile, { useDevice } from '../hooks/useIsMobile.js';
import { getAppState, setAppState } from '../api.js';

const KV_KEY = 'kanban:amplify';

// ── Lane config ────────────────────────────────────────────────────────────────
const LANES = ['Onboarding', 'Active', 'In Review', 'Completed', 'Additional Outreach'];

const LANE_STYLE = {
  'Onboarding':         { hBg: C.blu,    hFg: '#fff', border: C.blu    },
  'Active':             { hBg: C.grn,    hFg: '#fff', border: C.grn    },
  'In Review':          { hBg: C.yel,    hFg: '#fff', border: C.yel    },
  'Completed':          { hBg: C.ink5,   hFg: '#fff', border: C.ink5   },
  'Additional Outreach':{ hBg: C.acc,    hFg: '#fff', border: C.acc    },
};

const SERVICE_KEYS = ['visuals', 'websites', 'contentCreation', 'consulting', 'brandDirection'];
const SERVICE_LABELS = {
  visuals:        'Visuals',
  websites:       'Websites',
  contentCreation:'Content Creation',
  consulting:     'Consulting',
  brandDirection: 'Brand Direction',
};

const PRIORITY_OPTIONS = ['', 'High', 'Medium', 'Low'];

// ── Sample data ────────────────────────────────────────────────────────────────
const SAMPLE_CARDS = [
  {
    id: 'c1',
    lane: 'Active',
    clientName: 'Nova Sound Collective',
    driveFolderLink: 'https://drive.google.com/drive/folders/example1',
    priority: 'High',
    dueDate: '2026-06-15',
    notes: 'Client onboarded Jan 2026. Focus on visual identity and social content pipeline.',
    services: {
      visuals:        { status: 'in work', remaining: 3 },
      websites:       { status: 'done',    remaining: 0 },
      contentCreation:{ status: 'in work', remaining: 8 },
      consulting:     { status: 'done',    remaining: 0 },
      brandDirection: { status: 'in work', remaining: 2 },
    },
    subtasks: [
      { id: 's1', text: 'Complete logo suite v2', done: true },
      { id: 's2', text: 'Deliver 10 social templates', done: true },
      { id: 's3', text: 'Monthly content calendar - June', done: false },
      { id: 's4', text: 'Finalize color palette expansion', done: false },
    ],
    attachments: [],
  },
  {
    id: 'c2',
    lane: 'Onboarding',
    clientName: 'Meridian Arts',
    driveFolderLink: '',
    priority: 'Medium',
    dueDate: '2026-07-01',
    notes: 'New client from referral. Initial discovery call complete.',
    services: {
      visuals:        { status: 'in work', remaining: 5 },
      websites:       { status: 'in work', remaining: 1 },
      contentCreation:{ status: '',        remaining: 0 },
      consulting:     { status: 'in work', remaining: 2 },
      brandDirection: { status: '',        remaining: 0 },
    },
    subtasks: [
      { id: 's5', text: 'Send onboarding questionnaire', done: true },
      { id: 's6', text: 'Brand audit document', done: false },
    ],
    attachments: [],
  },
  {
    id: 'c3',
    lane: 'In Review',
    clientName: 'Blackline Studios',
    driveFolderLink: 'https://drive.google.com/drive/folders/example3',
    priority: 'High',
    dueDate: '2026-05-30',
    notes: 'Awaiting client feedback on website mockups. Second round of revisions expected.',
    services: {
      visuals:        { status: 'done',    remaining: 0 },
      websites:       { status: 'in work', remaining: 1 },
      contentCreation:{ status: 'done',    remaining: 0 },
      consulting:     { status: 'done',    remaining: 0 },
      brandDirection: { status: 'done',    remaining: 0 },
    },
    subtasks: [
      { id: 's7', text: 'Website homepage mockup', done: true },
      { id: 's8', text: 'Inner pages mockup', done: true },
      { id: 's9', text: 'Revisions round 1', done: true },
      { id: 's10', text: 'Client approval sign-off', done: false },
    ],
    attachments: [],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function computeProgress(subtasks) {
  if (!subtasks || subtasks.length === 0) return 0;
  const done = subtasks.filter(s => s.done).length;
  return Math.round((done / subtasks.length) * 100);
}

function ServiceBadge({ label, status, remaining }) {
  if (!status) return null;
  const isDone = status === 'done';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 7px', borderRadius: 6,
      background: isDone ? C.grnS : C.bluS,
      border: `1px solid ${isDone ? C.grn : C.blu}22`,
      fontSize: 10, fontFamily: MONO,
      color: isDone ? C.grn : C.blu,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span style={{ opacity: 0.7 }}>{isDone ? 'done' : `in work${remaining > 0 ? ` (${remaining})` : ''}`}</span>
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────────
function AmplifyCard({ card, onClick, onDragStart, onDelete }) {
  const pct = computeProgress(card.subtasks);
  const hasDrivLink = !!card.driveFolderLink;
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        background: '#fff',
        border: `1px solid ${C.cr2}`,
        borderRadius: 8, padding: '10px 12px',
        cursor: 'grab', userSelect: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,.04)',
        transition: 'box-shadow .12s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink9, lineHeight: 1.3, marginBottom: 4 }}>
          {card.clientName}
        </div>
        {onDelete && (
          <button onClick={e => { e.stopPropagation(); onDelete(card); }} title="Delete card"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.ink2, fontSize: 15, lineHeight: 1, padding: '0 2px', flexShrink: 0 }}>×</button>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
        {SERVICE_KEYS.filter(k => card.services[k]?.status).map(k => (
          <ServiceBadge
            key={k}
            label={SERVICE_LABELS[k]}
            status={card.services[k]?.status}
            remaining={card.services[k]?.remaining || 0}
          />
        ))}
      </div>

      <div style={{ marginBottom: 6 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: MONO, fontSize: 10, color: C.ink3, marginBottom: 3,
        }}>
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div style={{ height: 4, background: C.cr2, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: pct === 100 ? C.grn : C.acc,
            borderRadius: 999, transition: 'width .3s',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {card.priority && (
          <Tag bg={prBg(card.priority)} fg={prFg(card.priority)}>{card.priority}</Tag>
        )}
        {card.dueDate && (
          <span style={{ fontFamily: MONO, fontSize: 10, color: C.ink3 }}>
            Due {fmtD(card.dueDate)}
          </span>
        )}
        {hasDrivLink && (
          <span
            style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 10, color: C.blu, cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); window.open(card.driveFolderLink, '_blank'); }}
          >
            Drive
          </span>
        )}
      </div>
    </div>
  );
}

// ── Lane column ────────────────────────────────────────────────────────────────
function LaneColumn({ lane, cards, dragOverLane, onCardClick, onDragStart, onDragOver, onDrop, onDragLeave, isTablet, onAddCard, onDelete }) {
  const st = LANE_STYLE[lane] || LANE_STYLE['Onboarding'];
  const isOver = dragOverLane === lane;
  return (
    <div style={{ flex: isTablet ? '0 0 180px' : '0 0 230px', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '9px 12px', borderRadius: '8px 8px 0 0', background: st.hBg,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: st.hFg }}>
          {lane}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, background: 'rgba(255,255,255,.18)', color: st.hFg, padding: '1px 7px', borderRadius: 99 }}>
            {cards.length}
          </span>
          <button
            onClick={() => onAddCard(lane)}
            title="Add card"
            style={{
              background: 'rgba(255,255,255,.2)', border: 'none', color: st.hFg,
              borderRadius: 4, width: 20, height: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, lineHeight: 1, padding: 0,
            }}
          >
            +
          </button>
        </div>
      </div>

      <div
        onDragOver={onDragOver} onDrop={onDrop} onDragLeave={onDragLeave}
        style={{
          flex: 1, overflowY: 'auto', padding: '7px 6px',
          background: isOver ? `${st.hBg}22` : C.bg2,
          border: `1px solid ${isOver ? st.border : C.cr2}`,
          borderTop: 'none', borderRadius: '0 0 8px 8px',
          display: 'flex', flexDirection: 'column', gap: 6,
          minHeight: 100, transition: 'background .15s, border-color .15s',
        }}
      >
        {cards.length === 0 ? (
          <div style={{ padding: '16px 8px', textAlign: 'center', fontSize: 11, color: C.ink3, fontFamily: MONO, opacity: isOver ? .3 : .6 }}>
            Drop here
          </div>
        ) : cards.map(c => (
          <AmplifyCard
            key={c.id}
            card={c}
            onClick={() => onCardClick(c)}
            onDragStart={e => onDragStart(e, c)}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

// ── Card detail drawer ─────────────────────────────────────────────────────────
function CardDrawer({ card, onSave, onClose, showToast }) {
  const [form, setForm] = useState({ ...card });
  const [saving, setSaving] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setService = (key, field, val) =>
    setForm(f => ({ ...f, services: { ...f.services, [key]: { ...f.services[key], [field]: val } } }));

  const addSubtask = () => {
    const text = newSubtask.trim();
    if (!text) return;
    set('subtasks', [...(form.subtasks || []), { id: uid(), text, done: false }]);
    setNewSubtask('');
  };
  const toggleSubtask = (id) =>
    set('subtasks', form.subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s));
  const removeSubtask = (id) =>
    set('subtasks', form.subtasks.filter(s => s.id !== id));

  const pct = computeProgress(form.subtasks);
  const doneCount = (form.subtasks || []).filter(s => s.done).length;

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      onSave(form);
      setSaving(false);
      onClose();
    }, 300);
  };

  const LABEL_STYLE = { fontFamily: MONO, fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: C.ink3, marginBottom: 4 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn
          v="gho"
          onClick={() => { showToast('Slack notification sent'); }}
          sx={{ fontSize: 11, padding: '6px 10px' }}
        >
          Notify Web Dev Team
        </Btn>
        <Btn
          v="gho"
          onClick={() => { showToast('Draft created in support@amplifyartists.io'); }}
          sx={{ fontSize: 11, padding: '6px 10px' }}
        >
          Create Email Draft
        </Btn>
      </div>

      {/* Basic info */}
      <div style={{ padding: '14px 16px', background: C.bg2, border: `1px solid ${C.cr2}`, borderRadius: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: '1/-1' }}>
            <FR label="Client Name">
              <Inp value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Client / artist name" />
            </FR>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <FR label="Drive Folder Link">
              <Inp value={form.driveFolderLink || ''} onChange={e => set('driveFolderLink', e.target.value)} placeholder="https://drive.google.com/..." />
            </FR>
          </div>
          <FR label="Priority">
            <Sel value={form.priority || ''} onChange={e => set('priority', e.target.value)}>
              {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p || '-- None --'}</option>)}
            </Sel>
          </FR>
          <FR label="Due Date">
            <Inp type="date" value={form.dueDate || ''} onChange={e => set('dueDate', e.target.value)} />
          </FR>
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: '14px 16px', background: C.bg2, border: `1px solid ${C.cr2}`, borderRadius: 10 }}>
        <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>Progress — {doneCount} / {(form.subtasks || []).length} subtasks done</div>
        <PBar pct={pct} />
      </div>

      {/* Services */}
      <div style={{ padding: '14px 16px', background: C.bg2, border: `1px solid ${C.cr2}`, borderRadius: 10 }}>
        <div style={{ ...LABEL_STYLE, marginBottom: 10 }}>Service Breakdown</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SERVICE_KEYS.map(key => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, fontSize: 13, color: C.ink7, fontFamily: SANS, minWidth: 120 }}>
                {SERVICE_LABELS[key]}
              </div>
              <Sel
                value={form.services[key]?.status || ''}
                onChange={e => setService(key, 'status', e.target.value)}
                sx={{ width: 120 }}
              >
                <option value="">— None —</option>
                <option value="in work">In Work</option>
                <option value="done">Done</option>
              </Sel>
              <div style={{ width: 70 }}>
                <Inp
                  type="number"
                  value={form.services[key]?.remaining ?? ''}
                  onChange={e => setService(key, 'remaining', parseInt(e.target.value, 10) || 0)}
                  placeholder="Rem."
                  sx={{ textAlign: 'center', padding: '6px 8px' }}
                />
              </div>
              <div style={{ fontSize: 10, color: C.ink3, fontFamily: MONO, width: 28 }}>left</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subtasks */}
      <div style={{ padding: '14px 16px', background: C.bg2, border: `1px solid ${C.cr2}`, borderRadius: 10 }}>
        <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>Sub-tasks</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <Inp
            value={newSubtask}
            onChange={e => setNewSubtask(e.target.value)}
            placeholder="Add a subtask..."
            sx={{ flex: 1 }}
          />
          <Btn onClick={addSubtask} disabled={!newSubtask.trim()} sx={{ padding: '6px 12px', fontSize: 12 }}>+ Add</Btn>
        </div>
        {(form.subtasks || []).length === 0 ? (
          <div style={{ fontSize: 12, color: C.ink3, fontFamily: MONO, padding: '8px', textAlign: 'center', background: C.bg, border: `1px dashed ${C.cr3}`, borderRadius: 6 }}>
            No subtasks yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {form.subtasks.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: C.bg, border: `1px solid ${C.cr2}`, borderRadius: 6 }}>
                <input
                  type="checkbox"
                  checked={s.done}
                  onChange={() => toggleSubtask(s.id)}
                  style={{ accentColor: C.grn, width: 15, height: 15, cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{
                  flex: 1, fontSize: 13, color: s.done ? C.ink3 : C.ink8,
                  textDecoration: s.done ? 'line-through' : 'none', fontFamily: SANS,
                }}>
                  {s.text}
                </span>
                <button
                  onClick={() => removeSubtask(s.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.ink2, fontSize: 16, lineHeight: 1, padding: '0 2px', flexShrink: 0 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes log + links */}
      <div style={{ padding: '14px 16px', background: C.bg2, border: `1px solid ${C.cr2}`, borderRadius: 10 }}>
        <div style={{ ...LABEL_STYLE, marginBottom: 10 }}>Notes Log</div>
        <NotesList notes={form.noteList || []} onChange={v => set('noteList', v)} />
      </div>

      <div style={{ padding: '14px 16px', background: C.bg2, border: `1px solid ${C.cr2}`, borderRadius: 10 }}>
        <Collapsible title="Links (decks, drive, docs)" icon="🔗" count={(form.links || []).length} defaultOpen>
          <LinksList links={form.links || []} onChange={v => set('links', v)} namePlaceholder="Label" urlPlaceholder="https://…" />
        </Collapsible>
      </div>

      {/* Pinned summary */}
      <div style={{ padding: '14px 16px', background: C.bg2, border: `1px solid ${C.cr2}`, borderRadius: 10 }}>
        <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>Pinned Summary</div>
        <textarea
          value={form.notes || ''}
          onChange={e => set('notes', e.target.value)}
          rows={4}
          placeholder="Long-form context, always visible…"
          style={{
            width: '100%', boxSizing: 'border-box', padding: '8px 10px',
            border: `1px solid ${C.cr3}`, borderRadius: 6,
            background: C.bg, color: C.ink9, fontFamily: SANS,
            fontSize: 13, lineHeight: 1.5, resize: 'vertical', outline: 'none',
          }}
        />
      </div>

      {/* Attachments */}
      {(form.attachments || []).length > 0 && (
        <div style={{ padding: '14px 16px', background: C.bg2, border: `1px solid ${C.cr2}`, borderRadius: 10 }}>
          <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>Attachments</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {form.attachments.map((url, i) => (
              <img key={i} src={url} alt="Attachment" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, border: `1px solid ${C.cr3}` }} />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Btn v="gho" onClick={onClose}>Cancel</Btn>
        <Btn onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Btn>
      </div>
    </div>
  );
}

// ── New card drawer ────────────────────────────────────────────────────────────
function NewCardDrawer({ defaultLane, onSave, onClose, showToast }) {
  const [form, setForm] = useState({
    clientName: '', driveFolderLink: '', priority: '', dueDate: '', notes: '',
    lane: defaultLane || LANES[0],
    services: Object.fromEntries(SERVICE_KEYS.map(k => [k, { status: '', remaining: 0 }])),
    subtasks: [],
    attachments: [],
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const create = () => {
    if (!form.clientName.trim()) { showToast('Client name is required'); return; }
    setSaving(true);
    setTimeout(() => {
      onSave({ ...form, id: uid() });
      setSaving(false);
      onClose();
    }, 300);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ padding: '12px 16px', borderRadius: 8, background: C.accS, border: `1px solid ${C.acc}` }}>
        <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.acc, letterSpacing: '.06em' }}>NEW AMPLIFY CLIENT</div>
        <div style={{ fontSize: 12, color: C.ink5, marginTop: 3 }}>Only the client name is required.</div>
      </div>
      <div style={{ padding: '14px 16px', background: C.bg2, border: `1px solid ${C.cr2}`, borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FR label="Client Name *">
          <Inp value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Artist or business name" />
        </FR>
        <FR label="Lane">
          <Sel value={form.lane} onChange={e => set('lane', e.target.value)}>
            {LANES.map(l => <option key={l}>{l}</option>)}
          </Sel>
        </FR>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FR label="Priority">
            <Sel value={form.priority} onChange={e => set('priority', e.target.value)}>
              {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p || '-- None --'}</option>)}
            </Sel>
          </FR>
          <FR label="Due Date">
            <Inp type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
          </FR>
        </div>
        <FR label="Drive Folder Link">
          <Inp value={form.driveFolderLink} onChange={e => set('driveFolderLink', e.target.value)} placeholder="https://drive.google.com/..." />
        </FR>
        <FR label="Notes">
          <textarea
            value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
            placeholder="Initial context..."
            style={{
              width: '100%', boxSizing: 'border-box', padding: '8px 10px',
              border: `1px solid ${C.cr3}`, borderRadius: 6,
              background: C.bg, color: C.ink9, fontFamily: SANS,
              fontSize: 13, lineHeight: 1.5, resize: 'vertical', outline: 'none',
            }}
          />
        </FR>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Btn v="gho" onClick={onClose}>Cancel</Btn>
        <Btn onClick={create} disabled={saving}>{saving ? 'Creating...' : '+ Add Client'}</Btn>
      </div>
    </div>
  );
}

// ── Mobile board ───────────────────────────────────────────────────────────────
function MobileBoard({ byLane, onCardClick, onDelete }) {
  const firstWithCards = LANES.find(l => (byLane[l] || []).length > 0) || LANES[0];
  const [activeLane, setActiveLane] = useState(firstWithCards);
  const cards = byLane[activeLane] || [];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 10, scrollbarWidth: 'thin' }}>
        {LANES.map(l => {
          const active = l === activeLane;
          const cnt = (byLane[l] || []).length;
          const sty = LANE_STYLE[l];
          return (
            <button key={l} onClick={() => setActiveLane(l)} style={{
              flex: '0 0 auto',
              background: active ? sty.hBg : C.bg, color: active ? sty.hFg : C.ink5,
              border: `1px solid ${active ? sty.border : C.cr3}`,
              borderRadius: 999, padding: '6px 12px',
              fontFamily: MONO, fontSize: 11, fontWeight: 600,
              letterSpacing: '.06em', textTransform: 'uppercase',
              cursor: 'pointer', whiteSpace: 'nowrap',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {l}
              <span style={{ background: active ? 'rgba(255,255,255,.22)' : C.cr2, color: active ? sty.hFg : C.ink3, fontSize: 10, padding: '1px 6px', borderRadius: 99 }}>{cnt}</span>
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cards.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: C.ink3, fontFamily: MONO, fontSize: 11, background: C.bg2, border: `1px dashed ${C.cr3}`, borderRadius: 10 }}>
            No clients in {activeLane}
          </div>
        ) : cards.map(c => (
          <AmplifyCard key={c.id} card={c} onClick={() => onCardClick(c)} onDragStart={() => {}} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

// ── Filter pill ────────────────────────────────────────────────────────────────
function FilterPill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? C.ink9 : C.bg, color: active ? '#fff' : C.ink5,
      border: `1px solid ${active ? C.ink9 : C.cr3}`,
      borderRadius: 999, padding: '4px 11px', fontSize: 11,
      cursor: 'pointer', fontFamily: SANS, transition: 'all .12s', whiteSpace: 'nowrap',
    }}>
      {label}
    </button>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────────
export default function AmplifyKanban({ user, showToast, openOv, closeOv }) {
  const isMobile = useIsMobile();
  const isTablet = useDevice() === 'tablet';
  const isAdmin  = user?.isAdmin || user?.roles?.includes('admin') || (user?.email || '').endsWith('@onevibemediagroup.com');
  const [cards, setCards] = useState(SAMPLE_CARDS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tfLane, setTfLane] = useState('All');
  const [dragOverLane, setDragOverLane] = useState(null);
  const [confirmNode, confirm] = useConfirm();
  const dragCard = useRef(null);

  // ── Persistence ─────────────────────────────────────────────────────────────
  const didLoad = useRef(false);
  useEffect(() => {
    getAppState(KV_KEY).then(({ data }) => {
      if (Array.isArray(data) && data.length) setCards(data);
    }).catch(() => {}).finally(() => { setLoading(false); didLoad.current = true; });
  }, []);
  useEffect(() => {
    // Only save AFTER the initial load completes — never overwrite server data on mount.
    if (didLoad.current) setAppState(KV_KEY, cards).catch(() => {});
  }, [cards]);

  const deleteCard = (card) => confirm({
    itemName: card.clientName,
    confirmLabel: 'Delete',
    onConfirm: () => setCards(prev => prev.filter(c => c.id !== card.id)),
  });

  const filtered = cards.filter(c => {
    if (tfLane !== 'All' && c.lane !== tfLane) return false;
    if (search) {
      const hay = [c.clientName, c.notes, c.priority].filter(Boolean).join(' ').toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const byLane = Object.fromEntries(LANES.map(l => [l, []]));
  filtered.forEach(c => {
    if (byLane[c.lane]) byLane[c.lane].push(c);
    else byLane[LANES[0]].push(c);
  });

  const totalActive = cards.filter(c => ['Onboarding', 'Active', 'In Review'].includes(c.lane)).length;
  const totalCompleted = cards.filter(c => c.lane === 'Completed').length;

  // Drag handlers
  const handleDragStart = (e, card) => { dragCard.current = card; e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e, lane) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverLane(lane); };
  const handleDrop = (e, targetLane) => {
    e.preventDefault();
    setDragOverLane(null);
    const card = dragCard.current;
    if (!card || card.lane === targetLane) return;
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, lane: targetLane } : c));
    dragCard.current = null;
  };
  const handleDragLeave = () => setDragOverLane(null);

  const openCard = card => {
    openOv({
      kind: 'drawer',
      title: card.clientName,
      sub: [card.lane, card.priority].filter(Boolean).join(' — '),
      body: (
        <CardDrawer
          card={card}
          onSave={updated => setCards(prev => prev.map(c => c.id === updated.id ? updated : c))}
          onClose={closeOv}
          showToast={showToast}
        />
      ),
    });
  };

  const openNewCard = (defaultLane = LANES[0]) => {
    openOv({
      kind: 'drawer',
      title: 'New Amplify Client',
      sub: 'Add a new client to the board',
      body: (
        <NewCardDrawer
          defaultLane={defaultLane}
          onSave={newCard => setCards(prev => [...prev, newCard])}
          onClose={closeOv}
          showToast={showToast}
        />
      ),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {confirmNode}

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12, flexShrink: 0 }}>
        <div>
          <Eyebrow>Amplify Artists</Eyebrow>
          <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: isMobile ? 26 : 38, letterSpacing: '-.025em', margin: 0, color: C.ink9, lineHeight: 1 }}>
            Client Board
          </h1>
          <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.ink3 }}>
              <span style={{ color: C.ink9, fontWeight: 600 }}>{totalActive}</span> active
            </span>
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.grn, fontWeight: 600 }}>
              {totalCompleted} completed
            </span>
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.ink3 }}>{cards.length} total</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
          <Inp value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." sx={{ width: isMobile ? '100%' : 200 }} />
          <Btn onClick={() => openNewCard()}>+ New Client</Btn>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14,
        padding: '8px 12px', background: C.bg2, border: `1px solid ${C.cr2}`,
        borderRadius: 10, flexWrap: 'wrap', flexShrink: 0,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 9, color: C.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginRight: 2 }}>Filter</span>
        <FilterPill label="All" active={tfLane === 'All'} onClick={() => setTfLane('All')} />
        {LANES.map(l => (
          <FilterPill key={l} label={l} active={tfLane === l} onClick={() => setTfLane(l)} />
        ))}
      </div>

      {isMobile ? (
        <MobileBoard byLane={byLane} onCardClick={openCard} onDelete={isAdmin ? deleteCard : null} />
      ) : (
        <div style={{ overflowX: 'auto', flex: 1, paddingBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, minWidth: 'max-content', alignItems: 'flex-start' }}>
            {LANES.map(lane => (
              <LaneColumn
                key={lane}
                lane={lane}
                cards={byLane[lane] || []}
                dragOverLane={dragOverLane}
                onCardClick={openCard}
                onDragStart={handleDragStart}
                onDragOver={e => handleDragOver(e, lane)}
                onDrop={e => handleDrop(e, lane)}
                onDragLeave={handleDragLeave}
                isTablet={isTablet}
                onAddCard={openNewCard}
                onDelete={isAdmin ? deleteCard : null}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
