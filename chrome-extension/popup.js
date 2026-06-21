// popup.js v2.4 — Logic for the extension toolbar popup
// Wired against background.js v2.4's multi-project message protocol:
// GET_STATE, START_RECORDING, STOP_RECORDING, OPEN_REVIEW, LIST_PROJECTS, LOAD_PROJECT

const idleView      = document.getElementById('idle-view');
const recordingView = document.getElementById('recording-view');
const projectInput  = document.getElementById('project-name');
const startBtn       = document.getElementById('start-btn');
const stopBtn         = document.getElementById('stop-btn');
const openReviewBtn   = document.getElementById('open-review-btn');
const stepCountEl     = document.getElementById('step-count');
const recentSection   = document.getElementById('recent-section');
const projectListEl   = document.getElementById('project-list');
const importBtn       = document.getElementById('import-btn');
const importFileInput = document.getElementById('import-file-input');

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function timeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function refreshState() {
  chrome.runtime.sendMessage({ type: 'GET_STATE' }, (res) => {
    if (!res) return;
    if (res.recording) {
      idleView.style.display = 'none';
      recordingView.style.display = 'block';
      stepCountEl.textContent = res.stepCount;
    } else {
      idleView.style.display = 'block';
      recordingView.style.display = 'none';
      openReviewBtn.style.display = res.stepCount > 0 ? 'block' : 'none';
      if (res.projectName && res.projectName !== 'Untitled Walkthrough') {
        projectInput.value = res.projectName;
      }
      loadRecentProjects(res.projectId);
    }
  });
}

function loadRecentProjects(activeProjectId) {
  chrome.runtime.sendMessage({ type: 'LIST_PROJECTS' }, (res) => {
    if (!res || !res.projects || res.projects.length === 0) {
      recentSection.style.display = 'none';
      return;
    }
    recentSection.style.display = 'block';
    projectListEl.innerHTML = '';
    res.projects.slice(0, 6).forEach((p) => {
      const item = document.createElement('div');
      item.className = 'project-item' + (p.id === (activeProjectId || res.activeProjectId) ? ' active' : '');
      item.innerHTML = `
        <div class="project-info">
          <div class="project-name-text">${escapeHtml(p.name)}</div>
          <div class="project-meta">${p.stepCount} step${p.stepCount === 1 ? '' : 's'} · ${timeAgo(p.updatedAt)}</div>
        </div>
        <button class="project-open" type="button">Open</button>
      `;
      const openProject = () => {
        chrome.runtime.sendMessage({ type: 'LOAD_PROJECT', projectId: p.id }, () => {
          chrome.runtime.sendMessage({ type: 'OPEN_REVIEW' }, () => window.close());
        });
      };
      item.querySelector('.project-open').addEventListener('click', (e) => {
        e.stopPropagation();
        openProject();
      });
      item.addEventListener('click', openProject);
      projectListEl.appendChild(item);
    });
  });
}

startBtn.addEventListener('click', () => {
  const projectName = projectInput.value.trim() || 'Untitled Walkthrough';
  chrome.runtime.sendMessage({ type: 'START_RECORDING', projectName }, () => {
    window.close();
  });
});

stopBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'STOP_RECORDING' }, () => {
    window.close();
  });
});

openReviewBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'OPEN_REVIEW' }, () => {
    window.close();
  });
});

// ─── Import from Storylane PDF ────────────────────────────────────────────
// Expects the *-import.json produced by tools/import_storylane_pdf.py:
// { projectName, steps: [...], intro?, cta?, persistentCta? } using the same
// step/intro schema background.js uses. intro/cta/persistentCta are optional
// (e.g. import_storylane_pdf.py only includes "intro" when the source PDF's
// first page looks like a cover slide).
importBtn.addEventListener('click', () => importFileInput.click());

importFileInput.addEventListener('change', () => {
  const file = importFileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    let data;
    try {
      data = JSON.parse(reader.result);
    } catch (e) {
      alert('That file is not valid JSON. Pick the *-import.json produced by import_storylane_pdf.py.');
      return;
    }
    if (!data || !Array.isArray(data.steps)) {
      alert('That JSON does not look like a walkthrough import file (missing "steps" array).');
      return;
    }
    const projectName = data.projectName || file.name.replace(/-import\.json$/i, '') || 'Imported Walkthrough';
    chrome.runtime.sendMessage({ type: 'NEW_PROJECT', name: projectName }, (newRes) => {
      if (!newRes || !newRes.ok) { alert('Could not create a project for the import.'); return; }
      const updateMsg = {
        type: 'UPDATE_STEPS',
        projectId: newRes.projectId,
        steps: data.steps,
        projectName
      };
      if (data.intro) updateMsg.intro = data.intro;
      if (data.cta) updateMsg.cta = data.cta;
      if (data.persistentCta) updateMsg.persistentCta = data.persistentCta;
      chrome.runtime.sendMessage(updateMsg, () => {
        chrome.runtime.sendMessage({ type: 'OPEN_REVIEW' }, () => window.close());
      });
    });
  };
  reader.readAsText(file);
  importFileInput.value = '';
});

// Poll while popup open in case state changes (e.g. recording started from another tab)
refreshState();
setInterval(refreshState, 1000);
