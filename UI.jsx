import { useState, useEffect, useRef } from 'react';
import { C, SANS, MONO, SERIF } from '../constants.js';
import { startNotionOAuth, getNotionConnectionStatus, disconnectNotion } from '../api.js';

// ─────────────────────────────────────────────────────────────────────────────
// NotionConnector — shows Notion workspace connection status.
// Appears in the Playbook sidebar when Notion isn't connected yet,
// and in the Settings panel for account management.
// ─────────────────────────────────────────────────────────────────────────────

export default function NotionConnector({ showToast, compact = false, onConnected }) {
  const [status, setStatus]     = useState(null); // null = loading
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const popupRef = useRef(null);

  const load = () => {
    getNotionConnectionStatus()
      .then(setStatus)
      .catch(() => setStatus({ connected: false, oauthConfigured: false }));
  };

  useEffect(() => { load(); }, []);

  // Listen for OAuth popup message
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'ovmg.notion.connected') {
        load();
        showToast?.(`Connected to ${e.data.workspaceName || 'Notion'} ✓`);
        setConnecting(false);
        onConnected?.();
      }
      if (e.data?.type === 'ovmg.notion.error') {
        showToast?.('Notion connection failed: ' + e.data.error);
        setConnecting(false);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const connect = async () => {
    setConnecting(true);
    try {
      const { url } = await startNotionOAuth();
      const w = 520, h = 700;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top  = window.screenY + (window.outerHeight - h) / 2;
      popupRef.current = window.open(url, 'notion_oauth', `width=${w},height=${h},left=${left},top=${top}`);
      // Poll for popup close without message (user cancelled)
      const poll = setInterval(() => {
        if (popupRef.current?.closed) {
          clearInterval(poll);
          setConnecting(false);
        }
      }, 500);
    } catch (e) {
      showToast?.('Failed to start Notion OAuth: ' + e.message);
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!window.confirm('Disconnect your Notion workspace? The Playbook will fall back to the server token.')) return;
    setDisconnecting(true);
    try {
      await disconnectNotion();
      load();
      showToast?.('Notion disconnected');
    } catch (e) {
      showToast?.('Error: ' + e.message);
    } finally {
      setDisconnecting(false);
    }
  };

  if (status === null) {
    return compact ? null : (
      <div style={{ padding: '8px 0', fontSize: 11, color: C.ink3 }}>Checking Notion…</div>
    );
  }

  if (compact) {
    // Minimal version for embedding in Playbook sidebar
    if (status.connected) {
      return (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', margin: '8px 6px',
          background: C.bg, borderRadius: 8, border: `1px solid ${C.cr3}`,
          fontSize: 12, color: C.ink7,
        }}>
          <span style={{ fontSize: 14 }}>{status.workspace?.icon || '◎'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {status.workspace?.name || 'Notion'}
            </div>
            <div style={{ fontSize: 10, color: C.ink3, fontFamily: MONO, letterSpacing: '.04em' }}>Connected</div>
          </div>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
        </div>
      );
    }
    return (
      <div style={{ padding: '8px 6px' }}>
        {!status.oauthConfigured ? (
          <div style={{ padding: '10px 12px', background: C.yelS, borderRadius: 8, fontSize: 11, color: C.ink8, lineHeight: 1.5 }}>
            Set <code style={{ fontFamily: MONO }}>NOTION_OAUTH_CLIENT_ID</code> in Netlify to enable Notion login.
          </div>
        ) : (
          <button onClick={connect} disabled={connecting} style={{
            width: '100%', padding: '9px 12px',
            background: C.ink9, color: C.bg,
            border: 'none', borderRadius: 8,
            fontFamily: SANS, fontSize: 12, fontWeight: 600,
            cursor: connecting ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: connecting ? 0.7 : 1,
          }}>
            <span style={{ fontSize: 14 }}>◎</span>
            {connecting ? 'Connecting…' : 'Connect Notion Workspace'}
          </button>
        )}
      </div>
    );
  }

  // Full version for Settings page
  return (
    <div style={{
      padding: '16px 18px', background: C.bg2, border: `1px solid ${C.cr3}`,
      borderRadius: 10, display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ fontSize: 28, lineHeight: 1 }}>{status.connected ? (status.workspace?.icon || '◎') : '◎'}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.ink9, marginBottom: 2 }}>
          Notion Workspace
        </div>
        {status.connected ? (
          <div style={{ fontSize: 12, color: C.ink5 }}>
            Connected to <strong>{status.workspace?.name}</strong>
            <span style={{ marginLeft: 8, color: '#22c55e', fontSize: 10 }}>● Active</span>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: C.ink3 }}>
            Not connected · Used for Playbook editing
          </div>
        )}
      </div>
      {status.connected ? (
        <button onClick={disconnect} disabled={disconnecting} style={{
          padding: '7px 14px', border: `1px solid ${C.cr3}`,
          background: 'transparent', borderRadius: 7,
          fontFamily: SANS, fontSize: 12, color: C.ink5, cursor: 'pointer',
        }}>
          {disconnecting ? 'Disconnecting…' : 'Disconnect'}
        </button>
      ) : status.oauthConfigured ? (
        <button onClick={connect} disabled={connecting} style={{
          padding: '7px 14px', border: 'none',
          background: C.ink9, color: C.bg, borderRadius: 7,
          fontFamily: SANS, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          opacity: connecting ? 0.7 : 1,
        }}>
          {connecting ? 'Connecting…' : 'Connect'}
        </button>
      ) : (
        <span style={{ fontSize: 11, color: C.ink3, fontFamily: MONO }}>NOTION_OAUTH_CLIENT_ID needed</span>
      )}
    </div>
  );
}
