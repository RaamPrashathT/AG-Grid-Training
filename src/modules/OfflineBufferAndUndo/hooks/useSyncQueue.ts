import { useEffect, useState } from "react";

interface Change {
  rowId: string;
  field: string;
  newValue: any;
}

export function useSyncQueue(isOnline: boolean) {
  const [queue, setQueue] = useState<Change[]>([]);

  const add = (change: Change) => {
    setQueue((prev) => [...prev, change]);
  };

  const send = async (c: Change) => {
    await fetch(`http://localhost:4001/shipments/${c.rowId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [c.field]: c.newValue }),
    });
  };

  useEffect(() => {
    if (!isOnline || queue.length === 0) return;

    const process = async () => {
      for (const item of queue) {
        try {
          await send(item);
        } catch {
          return;
        }
      }
      setQueue([]);
    };

    process();
  }, [isOnline, queue]);

  return { add };
}