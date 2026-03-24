// Pomocná proměnná pro práci s dočasnými daty
let tempSessions = null;

export function renderSessionsList(data, saveData, filter = 'all') {
  const app = document.getElementById("app");

  // Při prvním otevření si vytvoříme pracovní kopii dat
  if (tempSessions === null) {
    tempSessions = JSON.parse(JSON.stringify(data.charging_sessions));
  }

  // Funkce pro změnu ceny (měníme jen v kopii)
  window.updateSessionPrice = (index, value) => {
    const session = tempSessions[index];
    const val = value.trim() === "" ? null : parseFloat(value.replace(',', '.'));
    session.price = val;

    if (session.type === "ac_home") {
        session.manual_price = (val !== null && !isNaN(val));
    }
    renderSessionsList(data, saveData, filter);
  };

  // Potvrzení a uložení
  window.confirmAndSave = () => {
    data.charging_sessions = tempSessions;
    tempSessions = null; // Vyčistit kopii
    saveData(data);
    window.showDashboard();
  };

  // Zrušení změn
  window.cancelAndBack = () => {
    tempSessions = null; // Zahodit kopii
    window.showDashboard();
  };

  window.setSessionFilter = (newFilter) => {
    renderSessionsList(data, saveData, newFilter);
  };

  let html = `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h2 style="margin:0;">📋 Historie</h2>
        <div style="display: flex; gap: 8px;">
            <button onclick="cancelAndBack()" class="btn-secondary" style="background: #95a5a6; padding: 8px 15px;">Zpět</button>
            <button onclick="confirmAndSave()" class="btn-primary" style="background: #27ae60; padding: 8px 15px;">💾 Uložit</button>
        </div>
      </div>

      <div style="display: flex; gap: 5px; margin-bottom: 20px; background: #eee; padding: 5px; border-radius: 8px;">
        <button onclick="setSessionFilter('all')" 
                style="flex:1; border:none; padding: 8px; border-radius: 6px; cursor:pointer; font-weight:bold; background: ${filter === 'all' ? 'white' : 'transparent'};">Vše</button>
        <button onclick="setSessionFilter('auto')" 
                style="flex:1; border:none; padding: 8px; border-radius: 6px; cursor:pointer; font-weight:bold; color: #3498db; background: ${filter === 'auto' ? 'white' : 'transparent'};">🏠 Automat</button>
        <button onclick="setSessionFilter('manual')" 
                style="flex:1; border:none; padding: 8px; border-radius: 6px; cursor:pointer; font-weight:bold; color: #e67e22; background: ${filter === 'manual' ? 'white' : 'transparent'};">⚡ Ruční</button>
      </div>

      <div class="list-container" style="max-height: 60vh; overflow-y: auto;">
  `;

  // Používáme tempSessions místo data.charging_sessions
  tempSessions.forEach((s, index) => {
    const isAutoAC = (s.type === 'ac_home' && !s.manual_price);
    if (filter === 'auto' && !isAutoAC) return;
    if (filter === 'manual' && isAutoAC) return;

    const borderColor = isAutoAC ? '#3498db' : '#e67e22';
    const bgColor = isAutoAC ? '#f0f7ff' : '#fff5eb';

    html += `
      <div class="session-item" style="padding: 12px; border-bottom: 1px solid #eee; margin-bottom: 8px; border-left: 5px solid ${borderColor}; background: ${bgColor}; border-radius: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <b>${s.date}</b>
          <input type="number" step="0.01" 
                 value="${s.price !== null ? s.price : ''}" 
                 placeholder="Automat"
                 onchange="updateSessionPrice(${index}, this.value)"
                 style="width: 100px; padding: 6px; border: 1px solid #ccc; border-radius: 4px; text-align: right;">
        </div>
      </div>
    `;
  });

  html += `
      </div>
      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button onclick="cancelAndBack()" class="btn-secondary" style="flex:1; padding: 15px; background: #95a5a6;">Zrušit změny</button>
        <button onclick="confirmAndSave()" class="btn-primary" style="flex:2; padding: 15px; background: #27ae60;">💾 Uložit vše</button>
      </div>
    </div>
  `;
  
  app.innerHTML = html;
}