export function calculateAcCost(sessions, tariffs) {
    if (!sessions || sessions.length === 0) return 0;
    return sessions.reduce((sum, s) => {
        const kwh = parseFloat(s.kwh) || 0;
        const price = parseFloat(s.price) || (kwh * 5); // 5 Kč je základní cena
        return sum + price;
    }, 0);
}
