export function renderVehicleSettings(data, saveData) {
    const app = document.getElementById("app");

    window.processVehicleSave = () => {
        const odo = document.getElementById("odo-input").value;
        const cons = document.getElementById("cons-input").value;
        const date = document.getElementById("date-input").value;

        data.odometer = parseFloat(odo) || 0;
        data.vehicle_consumption = parseFloat(String(cons).replace(',', '.')) || 0;
        data.service_start_date = date;

        // TADY SE VYTVÁŘÍ TEN UPDATE ČAS
        const ted = new Date();
        data.last_update = ted.toLocaleString('cs-CZ', {
            day: '2.digit',
            month: '2.digit',
            year: 'numeric',
            hour: '2.digit',
            minute: '2.digit'
        });

        saveData(data);
        alert("Data uložena! Čas: " + data.last_update);
        window.showDashboard();
    };

    app.innerHTML = `
        <div class="card" style="max-width: 500px; margin: 20px auto; padding: 20px;">
            <h2>🚗 Nastavení vozidla</h2>
            <div style="margin-bottom: 15px;">
                <label style="display:block; font-weight: bold;">Tachometr v autě (km):</label>
                <input type="number" id="odo-input" value="${data.odometer || ''}" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display:block; font-weight: bold;">Spotřeba z palubního PC (kWh/100km):</label>
                <input type="text" id="cons-input" value="${data.vehicle_consumption || ''}" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            </div>
            <button onclick="processVehicleSave()" style="width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">💾 Uložit a aktualizovat</button>
        </div>
    `;
}