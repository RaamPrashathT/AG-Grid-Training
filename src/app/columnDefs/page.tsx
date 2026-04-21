"use client";

import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";

ModuleRegistry.registerModules([AllCommunityModule]);

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
};

export default function GridPage() {
    const columnTypes = useMemo<Record<string, ColDef<User>>>(
        () => ({
            numberColumn: {
                width: 300,
            },
        }),
        [],
    );

    const [rowData, setRowData] = useState<User[]>([]);
    const allColumns = useMemo<ColDef<User>[]>(
        () => [
            { field: "id", headerName: "ID", cellDataType: "text", type: "numberColumn" },
            { field: "name", headerName: "Name", flex:1 },
            { field: "username", headerName: "Username", flex:1 },
            { field: "email", headerName: "Email", flex:1 },
            { field: "phone", headerName: "Phone", flex:1 },
            { field: "website", headerName: "Website", flex:1 },
        ],
        [],
    );

    const [columnDefs, setColumnDefs] = useState<ColDef<User>[]>(allColumns);

    const defaultColDef = useMemo<ColDef<User>>(
        () => ({
            sortable: true,
            filter: true,
        }),
        [],
    );

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((res) => res.json())
            .then((data) => setRowData(data));
    }, []);

    return (
        <div>
            <div style={{ height: 500 }}>
                <AgGridReact<User>
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    columnTypes={columnTypes}
                    rowSelection={{
                        mode: "multiRow",
                        checkboxes: true,
                        headerCheckbox: true,
                        selectAll: "filtered",
                    }}
                />
            </div>

            <Button
                onClick={() => {
                    setColumnDefs(
                        allColumns.filter((col) =>
                            ["name", "email"].includes(col.field!),
                        ),
                    );
                }}
            >
                Show only name and email
            </Button>
            <Button
                onClick={() => {
                    setColumnDefs(allColumns);
                }}
            >
                Show All
            </Button>
        </div>
    );
}
