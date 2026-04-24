import type { ColDef } from "ag-grid-community";
import type { Shipment } from "../../schema/shipment.schema";
import { WeightCellRenderer } from "./WeightCellRenderer";

export const getShipmentColumnDefs = (): ColDef<Shipment>[] => [
    {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 50,
        pinned: "left",
    },
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
        editable: false,
        type: "numericColumn",
        width: 120,
        valueParser: (params) => {
            const n = Number(params.newValue);
            return Number.isNaN(n) ? params.oldValue : n;
        },
    },
    {
        field: "weight",
        headerName: "Weight",
        editable: true,
        type: "numericColumn",
        cellRenderer: WeightCellRenderer,
        width: 180,

        valueParser: (params) => {
            const n = Number(params.newValue);
            return Number.isNaN(n) ? params.oldValue : n;
        },
    },
    
    {
        field: "updatedAt",
        headerName: "Updated At",
        editable: false,
        width: 200,
    },
];
