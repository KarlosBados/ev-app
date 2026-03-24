export function calculateAcCost(sessions, tariffs) {
    if (!sessions || sessions.length === 0) return 0;
    
    const totalKwh = sessions.reduce((sum, s) => sum + (parseFloat(s.kwh) || 0), 0);
    
    if (!tariffs || tariffs.length === 0) {
        return totalKwh * 5; // Výchozí cena 5 Kč, pokud nemáš tarify
    }

    const t = tariffs[0];
    const nt_ratio = (parseFloat(t.nt_ratio) || 0) / 100;
    const vt_ratio = 1 - nt_ratio;
    
    const avgPrice = (parseFloat(t.vt_price) * vt_ratio) + (parseFloat(t.nt_price) * nt_ratio);
    return totalKwh * avgPrice;
}