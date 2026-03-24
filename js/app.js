import { renderDashboard } from './ui-dashboard.js';
import { renderVehicleSettings } from './ui-vehicle.js';
import { renderSessionsList } from './ui-sessions-list.js';
import { renderAddSession } from './ui-add-session.js';
import { renderTariffs } from './ui-tariffs.js';
import { renderImport } from './ui-import.js';

const savedData = localStorage.getItem('ev_data');
window.appData = savedData ? JSON.parse(savedData) : {
    charging_sessions: [],
    tariffs: [],
    odometer: 0,
    vehicle_consumption: 0,
    service_start_date: "",
    last_update: "" 
};

window.saveData = (newData) => {
    localStorage.setItem('ev_data', JSON.stringify(newData));
    window.appData = newData;
};

window.showDashboard = () => renderDashboard(window.appData);
window.showVehicle = () => renderVehicleSettings(window.appData, window.saveData);
window.showAddSession = () => renderAddSession(window.appData, window.saveData);
window.showSessionsList = () => renderSessionsList(window.appData, window.saveData);
window.showTariffs = () => renderTariffs(window.appData, window.saveData);
window.showImport = () => renderImport(window.appData, window.saveData);

document.addEventListener('DOMContentLoaded', () => {
    window.showDashboard();
});