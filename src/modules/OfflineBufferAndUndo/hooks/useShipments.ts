import { useEffect, useState } from "react";
import { useHistory } from "./useHistory";
import { useSyncQueue } from "./useSyncQueue";

interface EditInput {
    rowId: string;
    field: string;
    oldValue: any;
    newValue: any;
}

export function useShipments(isOnline: boolean) {
    const [data, setData] = useState<any[]>([]);
    const [cellState, setCellState] = useState<Record<string, string>>({});

    const history = useHistory();
    const sync = useSyncQueue(isOnline);

    useEffect(() => {
        fetch("http://localhost:4001/shipments")
            .then((res) => res.json())
            .then(setData);
    }, []);

    const upsertCellValue = (rowId: string, field: string, value: any, updatedAt?: string) => {
        setData((prev) =>
            prev.map((r) => {
                if (String(r.id) !== rowId) return r;

                if (updatedAt) {
                    return { ...r, [field]: value, updatedAt };
                }

                return { ...r, [field]: value };
            }),
        );
    };

    const persistChange = (rowId: string, field: string, newValue: any, updatedAt?: string) => {
        const payload = updatedAt
            ? { [field]: newValue, updatedAt }
            : { [field]: newValue };

        if (isOnline) {
            fetch(`http://localhost:4001/shipments/${rowId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            return;
        }

        sync.add({ rowId, field, newValue });
    };

    const edit = ({ rowId, field, oldValue, newValue }: EditInput) => {
        const row = data.find((r) => String(r.id) === rowId);
        if (!row) return;

        if (oldValue === newValue) return;

        // validation
        if (field === "itemName" && !newValue) return;
        if (field === "destination" && !newValue) return;
        if (field === "quantity" && newValue < 0) return;
        if (field === "weight" && newValue <= 0) return;

        if (field === "weight") {
            const key = `${rowId}-${field}`;
            setCellState((s) => ({ ...s, [key]: "loading" }));

            setTimeout(() => {
                if (newValue > 1000) {
                    setCellState((s) => ({ ...s, [key]: "error" }));
                    upsertCellValue(rowId, field, oldValue);
                } else {
                    const now = new Date().toISOString();

                    history.push({ rowId, field, oldValue, newValue });
                    upsertCellValue(rowId, field, newValue, now);
                    persistChange(rowId, field, newValue, now);
                    setCellState((s) => ({ ...s, [key]: "idle" }));
                }
            }, 2000);

            return;
        }

        const now = new Date().toISOString();
        history.push({ rowId, field, oldValue, newValue });
        upsertCellValue(rowId, field, newValue, now);
        persistChange(rowId, field, newValue, now);
    };

    const undo = () => {
        const change = history.undo();
        if (!change) return;

        const now = new Date().toISOString();
        upsertCellValue(change.rowId, change.field, change.oldValue, now);
        persistChange(change.rowId, change.field, change.oldValue, now);
    };

    const redo = () => {
        const change = history.redo();
        if (!change) return;

        const now = new Date().toISOString();
        upsertCellValue(change.rowId, change.field, change.newValue, now);
        persistChange(change.rowId, change.field, change.newValue, now);
    };

    return {
        data,
        edit,
        undo,
        redo,
        canUndo: history.canUndo,
        canRedo: history.canRedo,
        cellState,
    };
}
