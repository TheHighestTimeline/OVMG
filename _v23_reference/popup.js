// popup.js - Logic for the extension toolbar popup

const idleView = document.getElementById('idle-view');
const recordingView = document.getElementById('recording-view');
const projectInput = document.getElementById('project-name');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const openReviewBtn = document.getElementById('open-review-btn');
const stepCountEl = document.getElementById('step-count');

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
      if (res.stepCount > 0) {
        openReviewBtn.style.display = 'block';
      }
      if (res.projectName && res.projectName !== 'Untitled Walkthrough') {
        projectInput.value = res.projectName;
      }
    }
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

// Poll while popup open in case state changes
refreshState();
setInterval(refreshState, 1000);
