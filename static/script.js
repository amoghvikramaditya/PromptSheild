console.log('webkitSpeechRecognition' in window);

function showLoading() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}
function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

let lastPrompt = '';

function submitPrompt() {
  const prompt = document.getElementById("promptInput").value;
  // Remove force-green on new submission
  document.body.classList.remove('force-green');
  lastPrompt = prompt;
  console.log('Submitting prompt:', prompt);
  if (!prompt.trim()) {
    alert('Please enter or speak a prompt before submitting.');
    return;
  }
  showLoading();
  fetch("/analyze_prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  })
  .then(res => res.json())
  .then(data => {
    // Show reasoning
    let html = `<h2>${data.verdict}</h2>
      <p><strong>Risk Score:</strong> ${data.score}</p>
      <p><strong>LLM Classification:</strong> ${data.llm_classification}</p>
      <p><strong>Heuristic Flags:</strong> ${data.matched_flags.join(", ") || "None"}</p>
      <p><strong>Reasoning:</strong> ${data.reasoning}</p>`;
    if (data.verdict.includes('SITH')) {
      html += `<p><strong>Choose a Jedi-Safe Prompt:</strong></p><div id='rewritesArea' class='rewrite-tiles'></div>`;
      html += `<button id='submitRewriteBtn' class='lightsaber-btn'>Submit Selected Prompt</button><div id='llmFinalResponse'></div>`;
    } else {
      html += `<p><strong>Jedi-Safe Prompt:</strong><br> ${data.rewritten_prompts[0]}</p>`;
      html += `<p><strong>LLM Response:</strong><br> ${data.llm_response}</p>`;
    }
    document.getElementById("resultArea").innerHTML = html;
    // Add event listener for Sith prompt selection
    if (data.verdict.includes('SITH')) {
      // Render tiles for rewritten prompts
      const rewritesArea = document.getElementById('rewritesArea');
      data.rewritten_prompts.forEach((rp, i) => {
        const tile = document.createElement('div');
        tile.className = 'rewrite-tile' + (i === 0 ? ' selected' : '');
        tile.textContent = rp;
        tile.tabIndex = 0;
        tile.onclick = () => {
          document.querySelectorAll('.rewrite-tile').forEach(t => t.classList.remove('selected'));
          tile.classList.add('selected');
        };
        tile.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            tile.onclick();
          }
        };
        rewritesArea.appendChild(tile);
      });
      document.getElementById('submitRewriteBtn').onclick = function() {
        const selectedTile = document.querySelector('.rewrite-tile.selected');
        if (!selectedTile) return;
        const prompt = selectedTile.textContent;
        document.getElementById('llmFinalResponse').innerHTML = '<em>Getting LLM response...</em>';
        fetch('/final_llm_response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        })
        .then(res => res.json())
        .then(resp => {
          document.getElementById('llmFinalResponse').innerHTML = `<strong>LLM Response:</strong><br>${resp.llm_response}`;
        })
        .catch(() => {
          document.getElementById('llmFinalResponse').innerHTML = '<span style="color:red">Error getting LLM response.</span>';
        });
      };
    }
    // --- SITH MODE PADAWAN OVERRIDE ---
    if (!data.verdict.includes('SITH') && sithMode) {
      // Show the feedback area
      const sithFeedbackArea = document.getElementById('sithFeedbackArea');
      const sithOverrideInputArea = document.getElementById('sithOverrideInputArea');
      const sithFeedbackStatus = document.getElementById('sithFeedbackStatus');
      const sithKeyPointInput = document.getElementById('sithKeyPointInput');
      sithFeedbackArea.style.display = '';
      sithOverrideInputArea.style.display = 'none';
      sithFeedbackStatus.textContent = '';
      sithKeyPointInput.value = '';
      // Attach event listeners
      document.getElementById('sithOverrideBtn').onclick = function() {
        // Prefill with highlighted text if any
        const promptInput = document.getElementById('promptInput');
        let selectedText = '';
        if (promptInput && promptInput.selectionStart !== undefined) {
          const start = promptInput.selectionStart;
          const end = promptInput.selectionEnd;
          if (start !== end) {
            selectedText = promptInput.value.substring(start, end);
          }
        }
        sithKeyPointInput.value = selectedText || lastPrompt;
        sithOverrideInputArea.style.display = '';
        sithFeedbackStatus.textContent = '';
      };
      document.getElementById('submitSithKeyPointBtn').onclick = function() {
        const keyPoint = sithKeyPointInput.value.trim();
        if (!keyPoint) {
          sithFeedbackStatus.textContent = 'Please enter or highlight a key phrase.';
          sithFeedbackStatus.style.color = 'red';
          return;
        }
        sithFeedbackStatus.textContent = 'Submitting...';
        sithFeedbackStatus.style.color = '';
        fetch('/add_red_flag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ flag: keyPoint })
        })
        .then(res => res.json())
        .then(resp => {
          if (resp.success) {
            sithFeedbackStatus.textContent = 'Key phrase added as red flag!';
            sithFeedbackStatus.style.color = 'green';
            sithOverrideInputArea.style.display = 'none';
          } else {
            sithFeedbackStatus.textContent = 'Could not add: ' + (resp.reason || 'Unknown error');
            sithFeedbackStatus.style.color = 'red';
          }
        })
        .catch(() => {
          sithFeedbackStatus.textContent = 'Error submitting red flag.';
          sithFeedbackStatus.style.color = 'red';
        });
      };
    } else {
      // Hide the feedback area if not in Sith mode or not PADAWAN
      document.getElementById('sithFeedbackArea').style.display = 'none';
    }
    hideLoading();
  })
  .catch(err => {
    hideLoading();
    alert('An error occurred. Please try again.');
  });
}

// --- Star Field Generation ---
function createStars(numStars = 80) {
  const starField = document.querySelector('.star-field');
  if (!starField) return;
  starField.innerHTML = '';
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.animationDuration = `${3 + Math.random() * 4}s`;
    starField.appendChild(star);
  }
}
window.addEventListener('DOMContentLoaded', () => {
  createStars();
});

// --- Mode Switching ---
const modeToggle = document.getElementById('modeToggle');
const heroTitle = document.getElementById('modeTitle');
const heroSubtitle = document.getElementById('modeSubtitle');
const promptInput = document.getElementById('promptInput');
const sendBtn = document.getElementById('sendBtn');
const footer = document.getElementById('modeFooter');
const loadingText = document.getElementById('loadingText');

let sithMode = false;
function setMode(isSith) {
  sithMode = isSith;
  if (isSith) {
    document.body.classList.add('sith-mode');
    document.body.classList.remove('jedi-mode');
    heroTitle.textContent = 'SITH EMPIRE';
    heroSubtitle.textContent = 'Master of the Dark Side';
    promptInput.placeholder = 'Command your power...';
    sendBtn.textContent = 'Send to Sith Lords';
    modeToggle.textContent = 'Jedi Mode';
    footer.textContent = 'Your lack of faith is disturbing | © 2024 PromptShield';
    loadingText.textContent = 'Channeling the dark side...';
  } else {
    document.body.classList.remove('sith-mode');
    document.body.classList.add('jedi-mode');
    heroTitle.textContent = 'JEDI COUNCIL';
    heroSubtitle.textContent = 'Guardian of Peace & Justice';
    promptInput.placeholder = 'Share your wisdom...';
    sendBtn.textContent = 'Send to Jedi Council';
    modeToggle.textContent = 'Sith Simulator';
    footer.textContent = 'May the Force be with you! | © 2024 PromptShield';
    loadingText.textContent = 'Consulting the Jedi Council...';
  }
}
modeToggle.addEventListener('click', () => setMode(!sithMode));
setMode(false);

// --- Loading Overlay ---
function showLoading() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}
function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

// --- Prompt Submission (reuse existing logic) ---
document.getElementById('sendBtn').onclick = submitPrompt;

// --- Voice-to-text using Web Speech API (reuse existing logic, but update button text/animation) ---
const micBtn = document.getElementById('micBtn');
let recognition;
let isRecording = false;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = function() {
    micBtn.classList.add('active');
    micBtn.textContent = '🛑 Stop';
  };
  recognition.onend = function() {
    micBtn.classList.remove('active');
    micBtn.textContent = '🎤 Voice Input';
    isRecording = false;
  };
  recognition.onerror = function(e) {
    micBtn.classList.remove('active');
    micBtn.textContent = '🎤 Voice Input';
    isRecording = false;
  };
  recognition.onresult = function(event) {
    let interim_transcript = '';
    let final_transcript = '';
    for (let i = 0; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    const combined = final_transcript + interim_transcript;
    promptInput.value = combined;
  };
  micBtn.addEventListener('click', function() {
    if (!isRecording) {
      isRecording = true;
      recognition.start();
      micBtn.textContent = '🛑 Stop';
    } else {
      isRecording = false;
      recognition.stop();
      micBtn.textContent = '🎤 Voice Input';
    }
  });
} else {
  micBtn.style.display = 'none';
}

// --- Advanced Options Toggle ---
window.toggleAdvancedOptions = function() {
  const adv = document.getElementById('advancedContent');
  if (adv.style.display === 'none' || adv.style.display === '') {
    adv.style.display = 'block';
  } else {
    adv.style.display = 'none';
  }
};

// Modal logic for Documentation and About
const documentationLink = document.getElementById('documentationLink');
const aboutLink = document.getElementById('aboutLink');
const documentationModal = document.getElementById('documentationModal');
const aboutModal = document.getElementById('aboutModal');
const closeDocumentation = document.getElementById('closeDocumentation');
const closeAbout = document.getElementById('closeAbout');

documentationLink.addEventListener('click', function(e) {
  e.preventDefault();
  documentationModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
});
aboutLink.addEventListener('click', function(e) {
  e.preventDefault();
  aboutModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
});
closeDocumentation.addEventListener('click', function() {
  documentationModal.style.display = 'none';
  document.body.style.overflow = '';
});
closeAbout.addEventListener('click', function() {
  aboutModal.style.display = 'none';
  document.body.style.overflow = '';
});
window.addEventListener('click', function(event) {
  if (event.target === documentationModal) {
    documentationModal.style.display = 'none';
    document.body.style.overflow = '';
  }
  if (event.target === aboutModal) {
    aboutModal.style.display = 'none';
    document.body.style.overflow = '';
  }
});

// Listen for input changes to handle green mode
const promptInputField = document.getElementById('promptInput');
promptInputField.addEventListener('input', function() {
  if (promptInputField.value.trim().toLowerCase() === 'may the prompt be with you') {
    document.body.classList.add('force-green');
  } else {
    document.body.classList.remove('force-green');
  }
});
