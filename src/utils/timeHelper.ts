const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
export const calculateDuration = (s: string, e: string) => {
    const mins = toMin(e) - toMin(s);
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};