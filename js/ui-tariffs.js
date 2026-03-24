export function renderTariffs(data, saveData) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="card">
      <h2>Tarify</h2>
      <p>Zde můžeš spravovat tarify pro domácí AC nabíjení.</p>

      <table>
        <tr>
          <th>Platnost od</th>
          <th>Platnost do</th>
          <th>VT cena</th>
          <th>NT cena</th>
          <th>NT poměr</th>
          <th>Účinnost</th>
          <th>Akce</th>
        </tr>

        ${data.tariffs.map(t => `
          <tr>
            <td>${t.valid_from}</td>
            <td>${t.valid_to || "—"}</td>
            <td>${t.vt_price} Kč</td>
            <td>${t.nt_price} Kč</td>
            <td>${t.nt_ratio}%</td>
            <td>${t.efficiency}%</td>
            <td><button onclick="editTariff('${t.valid_from}')">Upravit</button></td>
          </tr>
        `).join("")}
      </table>

      <br>
      <button onclick="addTariff()">Přidat nový tarif</button>
    </div>
  `;

  window.editTariff = (validFrom) => {
    const tariff = data.tariffs.find(t => t.valid_from === validFrom);
    renderTariffForm(tariff, data, saveData);
  };

  window.addTariff = () => {
    renderTariffForm(null, data, saveData);
  };
}

function validateTariff(t) {
  if (t.vt_price < 0) t.vt_price = Math.abs(t.vt_price);
  if (t.nt_price < 0) t.nt_price = Math.abs(t.nt_price);

  if (t.nt_ratio < 0 || t.nt_ratio > 100) t.nt_ratio = 0;

  if (t.efficiency < 50 || t.efficiency > 100) t.efficiency = 90;
}

function renderTariffForm(tariff, data, saveData) {
  const app = document.getElementById("app");

  const t = tariff || {
    valid_from: "",
    valid_to: "",
    vt_price: "",
    nt_price: "",
    nt_ratio: "",
    efficiency: ""
  };

  app.innerHTML = `
    <div class="card">
      <h2>${tariff ? "Upravit tarif" : "Nový tarif"}</h2>

      <label>Platnost od:</label>
      <input type="date" id="validFrom" value="${t.valid_from}">

      <label>Platnost do:</label>
      <input type="date" id="validTo" value="${t.valid_to || ""}">

      <label>VT cena (Kč/kWh):</label>
      <input type="number" id="vtPrice" step="0.01" value="${t.vt_price}">

      <label>NT cena (Kč/kWh):</label>
      <input type="number" id="ntPrice" step="0.01" value="${t.nt_price}">

      <label>NT poměr (%):</label>
      <input type="number" id="ntRatio" step="1" value="${t.nt_ratio}">

      <label>Účinnost (%):</label>
      <input type="number" id="efficiency" step="1" value="${t.efficiency}">

      <br><br>
      <button id="btnSave">Uložit</button>
      <button onclick="renderTariffs(data, saveData)">Zpět</button>
    </div>
  `;

  document.getElementById("btnSave").onclick = () => {
    const newTariff = {
      valid_from: document.getElementById("validFrom").value,
      valid_to: document.getElementById("validTo").value || null,
      vt_price: parseFloat(document.getElementById("vtPrice").value),
      nt_price: parseFloat(document.getElementById("ntPrice").value),
      nt_ratio: parseInt(document.getElementById("ntRatio").value),
      efficiency: parseInt(document.getElementById("efficiency").value)
    };

    validateTariff(newTariff);

    if (!tariff) {
      data.tariffs.push(newTariff);
    } else {
      Object.assign(tariff, newTariff);
    }

    saveData(data);
    renderTariffs(data, saveData);
  };
}
