console.warn("LOADED: NOVÁ VERZE ui-edit-session.js");

export function renderEditSessions(data, saveData) {
  const app = document.getElementById("app");

  let html = `
    <div class="card">
      <h2>💰 Doplnit ceny</h2>
      <p>Zde doplníš celkovou cenu za nabíjení (včetně DPH).</p>
      <br>
  `;

  data.charging_sessions.forEach((s, index) => {
    const icon =
      s.type === "ac_home" ? "🏠" :
      s.type === "ac_external" ? "🔌" :
      "⚡";

    const needsPrice = (s.type === "ac_external" || s.type === "dc_fast");

    html += `
      <div class="sessionRow">
        <strong>${icon} ${new Date(s.date).toLocaleString("cs-CZ")}</strong><br>
        ${s.kwh} kWh<br>

        ${needsPrice ? `
          <label>Cena celkem (Kč):</label>
          <input type="number" class="priceInput" data-index="${index}" value="${s.price ?? ""}">
        ` : `
          <em>AC doma – cena se počítá podle tarifu</em>
        `}

        <hr>
      </div>
    `;
  });

  html += `
      <button id="saveAll">💾 Uložit</button>
      <button onclick="showDashboard()">🔙 Zpět</button>
    </div>
  `;

  app.innerHTML = html;

  document.getElementById("saveAll").onclick = () => {
    document.querySelectorAll(".priceInput").forEach(input => {
      const idx = input.dataset.index;
      const val = parseFloat(input.value);

      if (!isNaN(val)) {
        data.charging_sessions[idx].price = val;
      }
    });

    saveData(data);
    showDashboard();
  };
}
