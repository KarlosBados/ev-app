export function renderAddSession(data, saveData) {
  const app = document.getElementById("app");

  // Vyfiltrujeme jen ty, co nemají cenu (primárně DC)
  const missingEntries = data.charging_sessions.filter(s => 
    (s.type === "dc_fast" || s.manual_price === true) && (s.price === null || s.price === "")
  );

  if (missingEntries.length === 0) {
    app.innerHTML = `
      <div class="card" style="text-align:center;">
        <h2>Vše je doplněno! 🎉</h2>
        <p>Všechny importované záznamy mají přiřazenou cenu nebo se počítají z tarifu.</p>
        <button onclick="showDashboard()" class="btn-primary">Zpět na přehled</button>
      </div>`;
    return;
  }

  let html = `
    <div class="card">
      <h2>💰 Doplnit chybějící ceny</h2>
      <p>Nalezeno ${missingEntries.length} záznamů (zejména DC), kde je potřeba zadat celkovou částku.</p>
      <div style="max-height: 400px; overflow-y: auto; margin: 20px 0;">
  `;

  missingEntries.forEach((s) => {
    // Najdeme index v hlavním poli pro správné uložení
    const originalIndex = data.charging_sessions.findIndex(orig => orig.date === s.date && orig.kwh === s.kwh);

    html += `
      <div style="padding: 15px; border-bottom: 1px solid #eee; background: #fffdf5;">
        <strong>${s.date}</strong> | ⚡ <b>${s.kwh} kWh</b><br>
        <label>Celková cena (Kč s DPH): </label>
        <input type="number" 
               onchange="window.quickUpdatePrice(${originalIndex}, this.value)" 
               placeholder="Zadejte částku" 
               style="width: 120px; padding: 5px;">
      </div>
    `;
  });

  html += `
      </div>
      <button onclick="showDashboard()" class="btn-primary">💾 Hotovo / Přepočítat</button>
      <button onclick="showDashboard()" class="btn-secondary">Zpět</button>
    </div>
  `;

  app.innerHTML = html;

  // Pomocná funkce pro okamžité uložení
  window.quickUpdatePrice = (index, value) => {
    const val = parseFloat(value.replace(',', '.'));
    if (!isNaN(val)) {
      data.charging_sessions[index].price = val;
      saveData(data);
    }
  };
}