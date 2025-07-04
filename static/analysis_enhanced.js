// Enhanced Analysis Dashboard Script
// Handles stats, charts, insights, and red flags for analysis.html

let forceChart = null;
let timelineChart = null;
let analysisData = {
  jedi: 0,
  sith: 0,
  total: 0,
  timeline: [],
  flags: []
};

// Initialize charts
function initializeCharts() {
  // Force Distribution Doughnut Chart
  const forceCtx = document.getElementById('forceChart').getContext('2d');
  forceChart = new Chart(forceCtx, {
    type: 'doughnut',
    data: {
      labels: ['Jedi (Safe)', 'Sith (Risky)'],
      datasets: [{
        data: [50, 50],
        backgroundColor: ['#00e1ff', '#ff003c'],
        borderColor: ['#00e1ff', '#ff003c'],
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ffe81f',
            font: { size: 14 }
          }
        }
      }
    }
  });

  // Timeline Chart
  const timelineCtx = document.getElementById('timelineChart').getContext('2d');
  timelineChart = new Chart(timelineCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Threat Level',
        data: [],
        borderColor: '#ff003c',
        backgroundColor: 'rgba(255, 0, 60, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: '#ffe81f' },
          grid: { color: 'rgba(255, 232, 31, 0.1)' }
        },
        x: {
          ticks: { color: '#ffe81f' },
          grid: { color: 'rgba(255, 232, 31, 0.1)' }
        }
      },
      plugins: {
        legend: { labels: { color: '#ffe81f' } }
      }
    }
  });
}

// Generate AI insights based on data
function generateInsights(data) {
  const insights = [];
  const totalPrompts = data.total;
  const sithPercentage = totalPrompts > 0 ? (data.sith / totalPrompts) * 100 : 0;

  if (totalPrompts === 0) {
    insights.push({
      type: 'info',
      title: '🚀 Getting Started',
      content: 'No prompts analyzed yet. Start by testing some prompts to see detailed security analysis.'
    });
  } else if (sithPercentage > 70) {
    insights.push({
      type: 'warning',
      title: '⚠️ High Threat Environment',
      content: `${sithPercentage.toFixed(1)}% of prompts show risky patterns. Consider reviewing your prompt sources and implementing stricter filtering.`
    });
  } else if (sithPercentage > 30) {
    insights.push({
      type: 'warning',
      title: '🔍 Moderate Risk Detected',
      content: `${sithPercentage.toFixed(1)}% of prompts flagged as risky. Monitor for injection attempts and unusual patterns.`
    });
  } else {
    insights.push({
      type: 'success',
      title: '✅ Strong Security Posture',
      content: `Only ${sithPercentage.toFixed(1)}% of prompts flagged as risky. Your current security measures are effective.`
    });
  }

  if (totalPrompts > 10) {
    const trendAnalysis = analyzeTrend(data.timeline);
    insights.push({
      type: 'info',
      title: '📊 Trend Analysis',
      content: `Security trend: ${trendAnalysis.direction}. ${trendAnalysis.description}`
    });
  }

  if (data.flags && data.flags.length > 0) {
    insights.push({
      type: 'info',
      title: '🛠️ Active Defenses',
      content: `${data.flags.length} security flags are actively monitoring for threats. System learning from ${totalPrompts} analyzed prompts.`
    });
  }

  return insights;
}

// Analyze trend from timeline data
function analyzeTrend(timeline) {
  if (timeline.length < 5) {
    return {
      direction: 'Insufficient data',
      description: 'Need more data points to determine trend.'
    };
  }
  const recent = timeline.slice(-5);
  const older = timeline.slice(-10, -5);
  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
  if (recentAvg > olderAvg + 5) {
    return {
      direction: 'Increasing threats',
      description: 'Recent uptick in risky prompts detected. Enhanced monitoring recommended.'
    };
  } else if (recentAvg < olderAvg - 5) {
    return {
      direction: 'Improving security',
      description: 'Threat levels decreasing. Security measures showing positive impact.'
    };
  } else {
    return {
      direction: 'Stable',
      description: 'Threat levels remain consistent. Continue current security protocols.'
    };
  }
}

// Update the analysis display
function updateAnalysisDisplay(data) {
  analysisData = data;
  // Update statistics
  document.getElementById('jediCount').textContent = data.jedi;
  document.getElementById('sithCount').textContent = data.sith;
  document.getElementById('totalCount').textContent = data.total;
  const jediPercentage = data.total > 0 ? data.jedi_pct : 0;
  const sithPercentage = data.total > 0 ? data.sith_pct : 0;
  document.getElementById('jediPercentage').textContent = jediPercentage.toFixed(1) + '%';
  document.getElementById('sithPercentage').textContent = sithPercentage.toFixed(1) + '%';
  // Update progress bars
  document.getElementById('jediProgress').style.width = jediPercentage + '%';
  document.getElementById('sithProgress').style.width = sithPercentage + '%';
  // Update threat level
  let threatLevel = 'LOW';
  let threatClass = 'threat-low';
  if (sithPercentage > 50) {
    threatLevel = 'HIGH';
    threatClass = 'threat-high';
  } else if (sithPercentage > 25) {
    threatLevel = 'MEDIUM';
    threatClass = 'threat-medium';
  }
  const threatElement = document.getElementById('threatLevel');
  threatElement.textContent = threatLevel;
  threatElement.className = `threat-level ${threatClass}`;
  // Update detection rate (mock calculation)
  const detectionRate = data.total > 0 ? Math.min(95, 70 + (data.total * 0.5)) : 0;
  document.getElementById('detectionRate').textContent = detectionRate.toFixed(1) + '%';
  // Update security status
  const securityStatus = threatLevel === 'LOW' ? 'Secure' : 
                        threatLevel === 'MEDIUM' ? 'Monitoring' : 'Alert';
  document.getElementById('securityStatus').textContent = securityStatus;
  // Update charts
  if (forceChart) {
    forceChart.data.datasets[0].data = [data.jedi, data.sith];
    forceChart.update();
  }
  // Generate timeline data (mock)
  const timelineData = generateTimelineData(data);
  if (timelineChart) {
    timelineChart.data.labels = timelineData.labels;
    timelineChart.data.datasets[0].data = timelineData.values;
    timelineChart.update();
  }
  // Update insights
  if (data.total === 0) {
    document.getElementById('insightsContainer').innerHTML = '<div class="insight-item info">No prompts analyzed yet. Submit prompts on the main page to see analysis here.</div>';
  } else {
    const insights = generateInsights(data);
    updateInsightsDisplay(insights);
  }
}

// Generate mock timeline data
function generateTimelineData(data) {
  const labels = [];
  const values = [];
  const now = new Date();
  for (let i = 9; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(now.getHours() - i);
    labels.push(date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    // Generate realistic threat levels based on current data
    const baseThreat = data.total > 0 ? (data.sith / data.total) * 100 : 0;
    const variation = (Math.random() - 0.5) * 20;
    values.push(Math.max(0, Math.min(100, baseThreat + variation)));
  }
  return { labels, values };
}

// Update insights display
function updateInsightsDisplay(insights) {
  const container = document.getElementById('insightsContainer');
  container.innerHTML = '';
  insights.forEach(insight => {
    const div = document.createElement('div');
    div.className = `insight-item ${insight.type}`;
    div.innerHTML = `<strong>${insight.title}:</strong> ${insight.content}`;
    container.appendChild(div);
  });
}

// Load and display red flags
function loadRedFlags() {
  fetch('/red_flags')
    .then(response => response.json())
    .then(flags => {
      const container = document.getElementById('flagsContainer');
      if (flags.length === 0) {
        container.innerHTML = '<p>No custom security flags configured. Flags help detect specific threat patterns.</p>';
      } else {
        container.innerHTML = '<div class="flag-list"></div>';
        const flagList = container.querySelector('.flag-list');
        flags.forEach(flag => {
          const flagDiv = document.createElement('div');
          flagDiv.className = 'flag-item';
          flagDiv.textContent = flag;
          flagList.appendChild(flagDiv);
        });
      }
    })
    .catch(error => {
      console.error('Error loading flags:', error);
      document.getElementById('flagsContainer').innerHTML = '<p>Error loading security flags.</p>';
    });
}

function getCachedAnalysisData() {
  const cached = localStorage.getItem('analysisData');
  if (!cached) return null;
  try {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < 30000) {
      return parsed.data;
    }
  } catch (e) {}
  return null;
}

function setCachedAnalysisData(data) {
  localStorage.setItem('analysisData', JSON.stringify({ data, timestamp: Date.now() }));
}

function refreshAnalysis() {
  // Try cache first
  const cached = getCachedAnalysisData();
  if (cached) {
    updateAnalysisDisplay(cached);
    loadRedFlags();
    // Also fetch in background to update cache
    fetch('/stats')
      .then(response => response.json())
      .then(data => {
        setCachedAnalysisData(data);
        updateAnalysisDisplay(data);
      })
      .catch(error => {
        console.error('Error refreshing analysis:', error);
      });
    return;
  }
  // No valid cache, fetch from backend
  fetch('/stats')
    .then(response => response.json())
    .then(data => {
      setCachedAnalysisData(data);
      updateAnalysisDisplay(data);
    })
    .catch(error => {
      console.error('Error refreshing analysis:', error);
    });
  loadRedFlags();
}

// Initialize everything
window.addEventListener('DOMContentLoaded', function() {
  initializeCharts();
  refreshAnalysis();
  // Auto-refresh every 30 seconds
  setInterval(refreshAnalysis, 30000);
  const savedMode = localStorage.getItem('forceMode');
  if (savedMode === 'sith') {
    sithMode = true;
    setMode(true);
  } else {
    sithMode = false;
    setMode(false);
  }
});

// Mode switching (from original script)
const modeToggle = document.getElementById('modeToggle');
let sithMode = false;
function setMode(isSith) {
  if (isSith) {
    document.body.classList.add('sith-mode');
    document.body.classList.remove('jedi-mode');
    modeToggle.textContent = 'Switch to Jedi Mode';
    modeToggle.classList.add('sith');
    localStorage.setItem('forceMode', 'sith');
  } else {
    document.body.classList.add('jedi-mode');
    document.body.classList.remove('sith-mode');
    modeToggle.textContent = 'Switch to Sith Mode';
    modeToggle.classList.remove('sith');
    localStorage.setItem('forceMode', 'jedi');
  }
}
modeToggle.addEventListener('click', function() {
  sithMode = !sithMode;
  setMode(sithMode);
}); 