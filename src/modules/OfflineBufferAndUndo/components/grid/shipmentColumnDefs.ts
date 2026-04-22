import type { ColDef } from "ag-grid-community";
import type { Shipment } from "../../schema/shipment.schema";
import { WeightCellRenderer } from "./WeightCellRenderer";

/**
 * Fix: AG Grid's default cell editor always returns strings.
 * Without a valueParser, editing `quantity` saves "42" (string) instead of
 * 42 (number). This silently breaks:
 *   - The external filter: "42" * 10 = NaN > threshold → always false
 *   - Server validation in useShipments: newValue < 0 compares string to number
 *   - Any server-side numeric logic
 *
 * valueParser runs after editing before onCellValueChanged fires, converting
 * the raw string back to the correct type.
 */
export const getShipmentColumnDefs = (): ColDef<Shipment>[] => [
    {
        field: "id",
        headerName: "Shipment ID",
        editable: false,
        width: 150,
    },
    {
        field: "itemName",
        headerName: "Item Name",
        editable: true,
        flex: 1,
    },
    {
        field: "destination",
        headerName: "Destination",
        editable: true,
        flex: 1,
    },
    {
        field: "quantity",
        headerName: "Quantity",
        editable: true,
        type: "numericColumn",
        width: 120,
        // FIX: parse the edited string back to a number before it hits onCellValueChanged.
        valueParser: (params) => {
            const n = Number(params.newValue);
            return isNaN(n) ? params.oldValue : n;
        },
    },
    {
        field: "weight",
        headerName: "Weight (kg)",
        editable: true,
        type: "numericColumn",
        cellRenderer: WeightCellRenderer,
        width: 180,
        // FIX: same as quantity — weight must arrive as a number.
        valueParser: (params) => {
            const n = Number(params.newValue);
            return isNaN(n) ? params.oldValue : n;
        },
    },
    {
        field: "updatedAt",
        headerName: "Updated At",
        editable: false,
        width: 200,
    },
];