export function calculateAcCost(sessions, tariffs) {
    if (!sessions || sessions.length === 0) return 0;
    return sessions.reduce((total, session) => {
        if (session.price) return total + parseFloat(session.price);
        const kwh = parseFloat(session.kwh) || 0;
        return total + (kwh * 5); // základní cena 5 Kč/kWh
    }, 0);
}