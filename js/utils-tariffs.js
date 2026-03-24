export function calculateAcCost(sessions, tariffs) {
    if (!sessions || sessions.length === 0) return 0;
    
    return sessions.reduce((total, session) => {
        // Pokud má session vlastní cenu, použij ji, jinak počítej podle tarifu
        if (session.price) return total + parseFloat(session.price);
        
        // Jednoduchý výpočet (pokud nemáš tarify, počítej 0 nebo fixní cenu)
        const kwh = parseFloat(session.kwh) || 0;
        return total + (kwh * 5); // Defaultní cena 5 Kč/kWh pokud není tarif
    }, 0);
}