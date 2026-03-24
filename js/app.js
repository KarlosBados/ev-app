import { calculateAcCost } from "./utils-tariffs.js";

export function renderDashboard(data) {
    const app = document.getElementById("app");
    const km = parseFloat(data.odometer) || 0;
    const sessions = data.charging_sessions || [];
    const totalCost = calculateAcCost(sessions, data.tariffs);

    app.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif; max-width: 600px; margin: auto;">
            <div style="background: #2c3e50; color: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <h1 style="margin:0; opacity: 0.8;">EV MONITOR</h1>
                <div style="font-size: 3em; margin: 20px 0; color: #2ecc71; font-weight: bold;">${Math.round(totalCost).toLocaleString()} Kč</div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
                    Najeto: <b>${km.toLocaleString()} km</b>
                </div>
                <button onclick="window.showVehicle()" style="margin-top: 20px; padding: 12px 25px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">⚙️ Nastavení vozidla</button>
            </div>
        </div>
    `;
}
