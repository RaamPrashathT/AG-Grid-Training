// useNetworkStatus.ts
import { useState, useEffect } from "react";

/**
 * json-server doesn't expose a /health endpoint.
 * Pinging the root "/" is the lightest available route — it returns just the
 * endpoint index and is always present regardless of db content.
 *
 * Fixes vs original:
 * 1. Was pinging /shipments?_limit=1 — json-server v1 ignores _limit without
 *    explicit pagination config, returning the full dataset every 5s.
 * 2. Added browser online/offline events for near-instant detection, so the
 *    sync queue starts flushing immediately on reconnect rather than waiting
 *    up to 5s for the next poll.
 * 3. Seeds initial state from navigator.onLine to avoid a false "online"
 *    flash on startup when the device is actually offline.
 */

const PING_URL = "http://localhost:4001/";
const POLL_INTERVAL_MS = 5000;

export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

    useEffect(() => {
        const pingServer = async () => {
            try {
                const res = await fetch(PING_URL, { method: "GET", cache: "no-store" });
                setIsOnline(res.ok);
            } catch {
                setIsOnline(false);
            }
        };

        // Browser-level events: near-instant, but confirm with a real ping.
        const handleOnline = () => pingServer();
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        pingServer();
        const interval = setInterval(pingServer, POLL_INTERVAL_MS);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            clearInterval(interval);
        };
    }, []);

    return { isOnline };
}