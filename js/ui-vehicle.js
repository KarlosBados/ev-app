export function renderVehicleSettings(data, saveData) {
    const app = document.getElementById("app");

    window.processVehicleSave = () => {
        const odo = document.getElementById("odo-input").value;
        const cons = document.getElementById("cons-input").value;

        data.odometer = parseFloat(odo) || 0;
        data.vehicle_consumption = parseFloat(String(cons).replace(',', '.')) || 0;

        const nyní = new Date();
        data.last_update = nyní.toLocaleString('cs-CZ', {
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
                <label style="display:block; font-weight: bold;">Tachometr (km):</label>
                <input type="number" id="odo-input" value="${data.odometer || ''}" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display:block; font-weight: bold;">Spotřeba z auta (kWh/100km):</label>
                <input type="text" id="cons-input" value="${data.vehicle_consumption || ''}" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            </div>
            <button onclick="processVehicleSave()" style="width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">💾 Uložit data</button>
            <button onclick="showDashboard()" style="width: 100%; padding: 10px; background: #eee; border: none; border-radius: 5px; margin-top: 10px; cursor: pointer;">Zpět</button>
        </div>
    `;
}