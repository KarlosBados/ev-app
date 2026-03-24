// 1. IMPORTY - Musí odpovídat názvům souborů v levém panelu (viz image_0bef93.png)
import { renderDashboard } from './ui-dashboard.js';
import { renderVehicleSettings } from './ui-vehicle.js';
import { renderSessionsList } from './ui-sessions-list.js';
import { renderAddSession } from './ui-add-session.js';
import { renderTariffs } from './ui-tariffs.js';
import { renderImport } from './ui-import.js';

// 2. NAČTENÍ DAT
const savedData = localStorage.getItem('ev_data');
window.appData = savedData ? JSON.parse(savedData) : {
    charging_sessions: [],
    tariffs: [],
    odometer: 0,
    vehicle_consumption: 0,
    service_start_date: ""
};

// 3. GLOBÁLNÍ UKLÁDACÍ FUNKCE
window.saveData = (newData) => {
    localStorage.setItem('ev_data', JSON.stringify(newData));
    window.appData = newData;
};

// 4. MOSTY PRO TLAČÍTKA V INDEX.HTML (propojení s menu v image_0b6549.jpg)
window.showDashboard = () => renderDashboard(window.appData);
window.showVehicle = () => renderVehicleSettings(window.appData, window.saveData);
window.showSessionsList = () => renderSessionsList(window.appData, window.saveData);
window.showAddSession = () => renderAddSession(window.appData, window.saveData);
window.showTariffs = () => renderTariffs(window.appData, window.saveData);
window.showImport = () => renderImport(window.appData, window.saveData);

// 5. START APLIKACE
document.addEventListener('DOMContentLoaded', () => {
    // Spustí dashboard hned po načtení (opravuje bílou obrazovku v image_0c6392.jpg)
    window.showDashboard();
});