import { useEffect, useState } from "react";

export function useElapsedTime(startedAt?: string) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!startedAt) return;

        const interval = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => window.clearInterval(interval);
    }, [startedAt]);

    if (!startedAt) return 0;

    return Math.max(0, Math.floor(
        (now - new Date(startedAt).getTime()) / 1000
    ));
}

export function formatDuration(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map((value) => String(value).padStart(2, "0"))
        .join(":");
}