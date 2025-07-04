// Fetch stats and update the analysis page
function updateStats() {
  fetch('/stats')
    .then(res => res.json())
    .then(data => {
      // Update bar widths and labels
      const jediBar = document.getElementById('jediBar');
      const sithBar = document.getElementById('sithBar');
      jediBar.style.width = data.jedi_pct + '%';
      sithBar.style.width = data.sith_pct + '%';
      jediBar.textContent = `Jedi ${data.jedi_pct}%`;
      sithBar.textContent = `Sith ${data.sith_pct}%`;

      // Update summary
      document.getElementById('statsSummary').innerHTML = `
        <strong>Total Prompts:</strong> ${data.total}<br>
        <span style='color:#1976d2'><strong>Jedi (Safe):</strong> ${data.jedi} (${data.jedi_pct}%)</span><br>
        <span style='color:#d32f2f'><strong>Sith (Risky):</strong> ${data.sith} (${data.sith_pct}%)</span>
      `;
    })
    .catch(() => {
      document.getElementById('statsSummary').textContent = 'Failed to load statistics.';
    });
}

document.addEventListener('DOMContentLoaded', updateStats); 