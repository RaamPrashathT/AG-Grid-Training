import { useState } from "react";

export interface Change {
    rowId: string;
    field: string;
    oldValue: any;
    newValue: any;
}

export function useHistory() {
    const [undoStack, setUndoStack] = useState<Change[]>([]);
    const [redoStack, setRedoStack] = useState<Change[]>([]);

    const push = (change: Change) => {
        console.log("PUSH CALLED", change);
        setUndoStack((prev) => {
            const next = [...prev, change];
            console.log("NEW STACK LENGTH:", next.length);
            return next;
        });
        setRedoStack([]);
    };

    const undo = (): Change | null => {
        if (undoStack.length === 0) return null;

        const last = undoStack[undoStack.length - 1];

        setUndoStack((prev) => prev.slice(0, -1));
        setRedoStack((prev) => [...prev, last]);

        return last;
    };

    const redo = (): Change | null => {
        if (redoStack.length === 0) return null;

        const last = redoStack[redoStack.length - 1];

        setRedoStack((prev) => prev.slice(0, -1));
        setUndoStack((prev) => [...prev, last]);

        return last;
    };

    return {
        push,
        undo,
        redo,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
    };
}
