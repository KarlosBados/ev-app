export function renderImport(data, saveData, onFinish) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="card">
      <h2>📥 Import z MyŠkoda</h2>
      <p>Vyberte CSV soubor (formát: "datum","typ","kWh",...).</p>
      <input type="file" id="csvFile" accept=".csv" style="margin: 20px 0;">
      <div id="status"></div>
      <br>
      <button id="btnDoImport" class="btn-primary" disabled>🚀 Importovat nové záznamy</button>
      <button onclick="showDashboard()" class="btn-secondary">Zpět</button>
    </div>
  `;

  const fileInput = document.getElementById("csvFile");
  const btnDoImport = document.getElementById("btnDoImport");
  const status = document.getElementById("status");
  let toImport = [];

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split(/\r?\n/);
      toImport = [];
      let skipped = 0;

      lines.forEach(line => {
        const cleanLine = line.replace(/"/g, '').trim();
        if (!cleanLine) return;

        const parts = cleanLine.split(',');
        if (parts.length < 3) return;

        const date = parts[0]; // "18.03.2026 20:57"
        const typeRaw = parts[1]; // "AC" nebo "DC"
        const kwh = parseFloat(parts[2]);

        // Kontrola duplicity (shoda data i množství)
        const isDuplicate = data.charging_sessions.some(s => s.date === date && s.kwh === kwh);

        if (!isDuplicate) {
          toImport.push({
            date: date,
            kwh: kwh,
            type: typeRaw === "DC" ? "dc_fast" : "ac_home",
            price: null, // Cena zůstane prázdná pro výpočet z tarifu nebo ruční zadání
            manual_price: false
          });
        } else {
          skipped++;
        }
      });

      status.innerHTML = `Nalezeno <b>${toImport.length}</b> nových záznamů (přeskočeno ${skipped} duplicit).`;
      btnDoImport.disabled = toImport.length === 0;
    };
    reader.readAsText(file);
  };

  btnDoImport.onclick = () => {
    data.charging_sessions = [...toImport, ...data.charging_sessions];
    saveData(data);
    alert("Hotovo!");
    onFinish();
  };
}