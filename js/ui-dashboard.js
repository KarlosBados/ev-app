import { calculateAcCost } from "./utils-tariffs.js";

export function renderDashboard(data) {
    const app = document.getElementById("app");
    const INITIAL_KWH = 76.23; 
    const km = parseFloat(data.odometer) || 0;
    const carCons = parseFloat(data.vehicle_consumption) || 0;
    const sessions = data.charging_sessions || [];
    
    const sessionsHome = sessions.filter(s => s.type === "ac_home" && !s.price);
    const sessionsOthers = sessions.filter(s => s.type !== "ac_home" || s.price);
    
    const kwhHome = sessionsHome.reduce((sum, s) => sum + (parseFloat(s.kwh) || 0), 0);
    const kwhOthers = sessionsOthers.reduce((sum, s) => sum + (parseFloat(s.kwh) || 0), 0);
    const totalKwh = kwhHome + kwhOthers + INITIAL_KWH;

    const costHome = calculateAcCost(sessionsHome, data.tariffs);
    const costOthers = sessionsOthers.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    const totalCost = costHome + costOthers;

    // Rozpočítání km podle podílu energie
    const ratioHome = totalKwh > 0 ? kwhHome / totalKwh : 0;
    const ratioOthers = totalKwh > 0 ? kwhOthers / totalKwh : 0;
    const kmHome = km * ratioHome;
    const kmOthers = km * ratioOthers;

    const avgCostTotal = km > 0 ? (totalCost / km) * 100 : 0;
    const avgCostHome = kmHome > 0 ? (costHome / kmHome) * 100 : 0;
    const avgCostOthers = kmOthers > 0 ? (costOthers / kmOthers) * 100 : 0;
    const realCons = km > 0 ? (totalKwh / km) * 100 : 0;

    app.innerHTML = `
        <div class="dashboard-grid">
            <div class="card main-card" style="background: #2c3e50; color: white; grid-column: 1 / -1; text-align: center; padding: 20px;">
                <h3 style="margin:0; opacity: 0.7; font-size: 0.8em;">CELKOVÉ NÁKLADY NA PROVOZ</h3>
                <div style="font-size: 3em; font-weight: bold; color: #2ecc71;">${Math.round(totalCost).toLocaleString()} Kč</div>
                <div>Průměr celkem: <b>${avgCostTotal.toFixed(2)} Kč / 100 km</b></div>
            </div>

            <div class="card" style="border-top: 6px solid #e67e22;">
                <h3 style="color:#e67e22">🏠 Nabíjení DOMA</h3>
                <div style="font-size: 2em; font-weight: bold;">${Math.round(costHome).toLocaleString()} Kč</div>
                <div style="margin: 5px 0;"><b>${avgCostHome.toFixed(2)} Kč / 100 km</b></div>
                <small>Energie: ${kwhHome.toFixed(1)} kWh</small>
            </div>

            <div class="card" style="border-top: 6px solid #3498db;">
                <h3 style="color:#3498db">⚡ Nabíjení VENKU</h3>
                <div style="font-size: 2em; font-weight: bold;">${Math.round(costOthers).toLocaleString()} Kč</div>
                <div style="margin: 5px 0;"><b>${avgCostOthers.toFixed(2)} Kč / 100 km</b></div>
                <small>Energie: ${kwhOthers.toFixed(1)} kWh</small>
            </div>

            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 style="margin:0;">📊 Provozní údaje</h3>
                    <small style="color: #95a5a6; font-size: 0.7em;">Update: <b>${data.last_update || '---'}</b></small>
                </div>
                <div style="margin-top: 15px;">
                    <div>Tachometr: <b>${km.toLocaleString()} km</b></div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px solid #eee; margin-top: 10px; padding-top: 10px;">
                        <span>Výpočet (Zásuvka): <b>${realCons.toFixed(1)} kWh</b></span>
                        <span>Zadáno (Auto): <b>${carCons.toFixed(1)} kWh</b></span>
                    </div>
                    <div style="margin-top: 10px; background: #fff4e5; padding: 5px; border-radius: 5px; text-align: center; font-size: 0.8em; color: #d35400;">
                        Rozdíl (ztráty): <b>${(realCons - carCons).toFixed(1)} kWh / 100 km</b>
                    </div>
                </div>
            </div>
        </div>
    `;
}