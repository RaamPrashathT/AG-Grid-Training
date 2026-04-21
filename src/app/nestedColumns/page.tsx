"use client";

import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    ModuleRegistry,
    AllCommunityModule,
    ColDef,
    ColGroupDef,
} from "ag-grid-community";
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

type ColumnDefItem = ColDef<User> | ColGroupDef<User>;

const GridPage = () => {
    const [rowData, setRowData] = useState<User[]>([]);

    const columnTypes = useMemo<Record<string, ColDef<User>>>(
        () => ({
            numberColumn: {
                width: 120,
                filter: "agNumberColumnFilter",
                headerName: "ID"
            },
        }),
        [],
    );

    const allColumns = useMemo<ColumnDefItem[]>(
        () => [
            {
                field: "id",
                colId: "id",
                headerName: "ID",
                cellDataType: "text",
            },
            {
                headerName: "User Info",
                groupId: "userInfo",
                children: [
                    {
                        field: "name",
                        colId: "name",
                        headerName: "Name",
                        cellDataType: "text",
                        resizable: false,
                        valueFormatter: (params) => params.value.toUpperCase(),
                        filter: true,
                        filterParams: {
                            filterOptions: [],
                            defaultOption: "contains",
                            maxNumConditions: 1,
                            numAlwaysVisibleConditions: 1,
                        },
                    },
                    {
                        field: "username",
                        colId: "username",
                        headerName: "Username",
                        cellDataType: "text",
                        resizable: false,
                    },
                ],
            },
            {
                headerName: "Contact Info",
                groupId: "contactInfo",
                children: [
                    {
                        field: "email",
                        colId: "email",
                        headerName: "Email",
                        cellDataType: "text",
                    },
                    {
                        field: "phone",
                        colId: "phone",
                        headerName: "Phone",
                        cellDataType: "text",
                    },
                    {
                        field: "website",
                        colId: "website",
                        headerName: "Website",
                        cellDataType: "text",
                        hide: true,
                        valueFormatter: (params) => `https://${params.value}`,
                    },
                ],
            },
        ],
        [],
    );

    const [columnDefs, setColumnDefs] = useState<ColumnDefItem[]>(allColumns);

    const defaultColDef = useMemo<ColDef<User>>(
        () => ({
            sortable: true,
            flex: 1,
        }),
        [],
    );

    const setChildColumnHide = (
        groupHeaderName: string,
        field: keyof User,
        hide: boolean,
    ) => {
        setColumnDefs((prev) =>
            prev.map((col) => {
                if (
                    !("children" in col) ||
                    col.headerName !== groupHeaderName
                ) {
                    return col;
                }

                return {
                    ...col,
                    children: col.children?.map((child) =>
                        "field" in child && child.field === field
                            ? { ...child, hide }
                            : child,
                    ),
                };
            }),
        );
    };

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
                    rowSelection={{ mode: "multiRow" }}
                    columnTypes={columnTypes}
                    suppressMovableColumns={true}
                />
            </div>

            <Button
                onClick={() =>
                    setChildColumnHide("Contact Info", "website", false)
                }
            >
                Unhide Website
            </Button>

            <Button
                onClick={() =>
                    setChildColumnHide("Contact Info", "website", true)
                }
            >
                Hide Website
            </Button>

            <Button onClick={() => setColumnDefs(allColumns)}>Revert</Button>
        </div>
    );
};

export default GridPage;
