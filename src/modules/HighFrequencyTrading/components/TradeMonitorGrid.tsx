'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef, 
  ICellRendererParams,
  GetRowIdParams, 
  ModuleRegistry, 
  AllCommunityModule, 
  themeQuartz 
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

// Data Hooks & Schemas
import { useRegions } from '../hooks/useRegions';
import { useLazyFetchTrades } from '../hooks/useTrades';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination, DOTS } from '../hooks/usePagination'; 
import { isTradeRow, type GridRowData, type Trade } from '../schema/trade.schema';

// UI Components
import { HierarchyCellRenderer } from './HierarchyCellRenderer';
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ✅ Extend our row data type locally to allow the parent to hold the sum
type MonitorRowData = GridRowData & { aggregatedTotal?: number; prevAggregatedTotal?: number };

function PriceCellRenderer(params: Readonly<ICellRendererParams<MonitorRowData>>) {
  if (!params.data) return '';

  if (!isTradeRow(params.data)) {
    if (typeof params.value !== 'number') {
      return <span>{params.valueFormatted ?? params.value}</span>;
    }

    const currentSum = Number(params.value);
    const previousSum = Number(params.data.prevAggregatedTotal ?? currentSum);
    const hasUp = currentSum > previousSum;
    const hasDown = currentSum < previousSum;

    return (
      <span className="inline-flex items-center gap-1">
        {hasUp && <span className="text-emerald-600">▲</span>}
        {hasDown && <span className="text-red-600">▼</span>}
        <span>{`Sum: $${currentSum.toFixed(2)}`}</span>
      </span>
    );
  }

  const currentPrice = Number(params.value);
  const previousPrice = Number(params.data.prevPrice);
  const hasUp = currentPrice > previousPrice;
  const hasDown = currentPrice < previousPrice;

  return (
    <span className="inline-flex items-center gap-1">
      {hasUp && <span className="text-emerald-600">▲</span>}
      {hasDown && <span className="text-red-600">▼</span>}
      <span>{params.valueFormatted ?? `$${currentPrice.toFixed(2)}`}</span>
    </span>
  );
}

export function TradeMonitorGrid() {
  const gridRef = useRef<AgGridReact<MonitorRowData>>(null);
  const expandedRegionsRef = useRef<Set<string>>(new Set());
  const activeToggleRegionsRef = useRef<Set<string>>(new Set());

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());

  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, isError, error } = useRegions({
    page, perPage: pageSize, search: debouncedSearch,
  });

  const { mutateAsync: fetchTrades } = useLazyFetchTrades();
  const paginationRange = usePagination(data?.items || 0, pageSize, page);

  // --- HIGH FREQUENCY & AGGREGATION ENGINE ---
  useEffect(() => {
    const interval = setInterval(() => {
      const api = gridRef.current?.api;
      if (!api) return;

      const childNodes: any[] = [];
      const parentNodes = new Map<string, any>();
      
      // 1. Map current state of the grid
      api.forEachNode((node) => {
        if (!node.data) return;
        if (isTradeRow(node.data)) {
          childNodes.push(node);
        } else {
          parentNodes.set(node.data.id, node);
        }
      });

      if (childNodes.length === 0) return;

      // 2. Mutate 10 random children
      const shuffled = childNodes.sort(() => 0.5 - Math.random());
      const selectedNodes = shuffled.slice(0, 10);
      const mutatedTradesMap = new Map<string, Trade>();

      const updatedChildren = selectedNodes.map(node => {
        const trade = node.data as Trade;
        const changePercent = (Math.random() * 0.04) - 0.02;
        const newPrice = Number((trade.price * (1 + changePercent)).toFixed(2));
        
        const updatedTrade = { ...trade, prevPrice: trade.price, price: newPrice };
        mutatedTradesMap.set(trade.id, updatedTrade);
        return updatedTrade;
      });

      // 3. Dynamic Parent Aggregation
      const parentSums = new Map<string, number>();

      // Sum up all children, prioritizing the ones we *just* mutated
      childNodes.forEach(childNode => {
        const tradeId = childNode.data.id;
        const parentId = childNode.data.parentId;
        const latestPrice = mutatedTradesMap.has(tradeId) 
          ? mutatedTradesMap.get(tradeId)!.price 
          : childNode.data.price;

        parentSums.set(parentId, (parentSums.get(parentId) || 0) + latestPrice);
      });

      const updatedParents: MonitorRowData[] = [];
      
      // Assign the new sums to the parent nodes
      parentSums.forEach((sum, parentId) => {
        const parentNode = parentNodes.get(parentId);
        if (parentNode && parentNode.data) {
          const previousSum = typeof parentNode.data.aggregatedTotal === 'number'
            ? parentNode.data.aggregatedTotal
            : Number(sum.toFixed(2));

          updatedParents.push({
            ...parentNode.data,
            aggregatedTotal: Number(sum.toFixed(2)),
            prevAggregatedTotal: previousSum,
          });
        }
      });

      // 4. BATCH INJECT: Update children and their parents at the exact same time
      api.applyTransactionAsync({ update: [...updatedChildren, ...updatedParents] });

    }, 500);

    return () => clearInterval(interval);
  }, []); 

  // --- The Core Hierarchy Engine ---
  const toggleExpand = useCallback(async (regionId: string) => {
    const api = gridRef.current?.api;
    if (!api || activeToggleRegionsRef.current.has(regionId)) return;

    activeToggleRegionsRef.current.add(regionId);

    const isExpanding = !expandedRegionsRef.current.has(regionId);

    try {
      if (isExpanding) {
        const trades = await fetchTrades(regionId);
        const parentNode = api.getRowNode(regionId);
        
        if (parentNode && parentNode.rowIndex !== null && parentNode.data) {
          // ✅ Instantly calculate initial sum on expansion
          const initialSum = trades.reduce((acc, trade) => acc + trade.price, 0);
          
          api.applyTransaction({ 
            add: trades, 
            addIndex: parentNode.rowIndex + 1,
            // Update the parent immediately so there is no 500ms delay
            update: [{
              ...parentNode.data,
              aggregatedTotal: Number(initialSum.toFixed(2)),
              prevAggregatedTotal: Number(initialSum.toFixed(2)),
            }]
          });
          setExpandedRegions((prev) => {
            const next = new Set(prev);
            next.add(regionId);
            expandedRegionsRef.current = next;
            return next;
          });
        }
      } else {
        const childrenToRemove: MonitorRowData[] = [];
        api.forEachNode((node) => {
          if (node.data && isTradeRow(node.data) && node.data.parentId === regionId) {
            childrenToRemove.push(node.data);
          }
        });

        const parentNode = api.getRowNode(regionId);
        if (parentNode && parentNode.data) {
          // ✅ Silently remove the children AND clear the parent's sum
          api.applyTransaction({
            remove: childrenToRemove,
            update: [{ ...parentNode.data, aggregatedTotal: undefined, prevAggregatedTotal: undefined }]
          });
        } else if (childrenToRemove.length > 0) {
          api.applyTransaction({ remove: childrenToRemove });
        }

        setExpandedRegions((prev) => {
          const next = new Set(prev);
          next.delete(regionId);
          expandedRegionsRef.current = next;
          return next;
        });
      }
    } catch (err) {
      console.error("Failed to toggle region", err);
    } finally {
      activeToggleRegionsRef.current.delete(regionId);
    }
  }, [fetchTrades]);

  useEffect(() => {
    expandedRegionsRef.current = expandedRegions;
  }, [expandedRegions]);

  const gridContext = useMemo(() => ({ expandedRegions, toggleExpand }), [expandedRegions, toggleExpand]);

  // --- AG Grid Configuration ---
  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1, minWidth: 150, resizable: true, sortable: false, filter: false,
  }), []);

  const columnDefs = useMemo<ColDef<MonitorRowData>[]>(() => [
    { 
      headerName: 'Region / Symbol', 
      colId: 'hierarchyName',
      cellRenderer: HierarchyCellRenderer,
      valueGetter: (params) => {
        if (!params.data) return '';
        return isTradeRow(params.data) ? params.data.symbol : params.data.name;
      }
    },
    { 
      headerName: 'Desk / Side', 
      colId: 'deskOrSide',
      valueGetter: (params) => {
        if (!params.data) return '';
        return isTradeRow(params.data) ? params.data.side : params.data.tradingDesk;
      },
      cellClassRules: {
        'text-green-600 font-semibold': (p) => !!p.data && isTradeRow(p.data) && p.data.side === 'BUY',
        'text-red-600 font-semibold': (p) => !!p.data && isTradeRow(p.data) && p.data.side === 'SELL',
      }
    },
    { 
      headerName: 'Currency / Price', 
      colId: 'currencyOrPrice',
      // ✅ Dynamic Getter: Return raw numbers for both children and sums so flashing works!
      valueGetter: (params) => {
        if (!params.data) return '';
        if (isTradeRow(params.data)) {
          return params.data.price;
        } else {
          return params.data.aggregatedTotal !== undefined ? params.data.aggregatedTotal : params.data.currency;
        }
      },
      // ✅ Dynamic Formatter: Make it look beautiful
      valueFormatter: (params) => {
        if (!params.data) return '';
        if (isTradeRow(params.data)) {
          return `$${Number(params.value).toFixed(2)}`;
        } else {
          return typeof params.value === 'number' ? `Sum: $${params.value.toFixed(2)}` : params.value;
        }
      },
      cellRenderer: PriceCellRenderer,
      enableCellChangeFlash: false,
    },
    { 
      field: 'createdAt', 
      headerName: 'Timestamp',
      valueFormatter: (params) => {
        if (!params.data || !params.value) return '';

        const timestamp = new Intl.DateTimeFormat('en-GB', { timeStyle: 'medium' }).format(new Date(params.value));

        if (isTradeRow(params.data)) {
          return `${timestamp} | ${params.data.traderName}`;
        }

        return timestamp;
      }
    }
  ], []);

  const getRowId = useMemo(() => {
    return (params: GetRowIdParams<MonitorRowData>) => params.data.id;
  }, []);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPage(1); 
  };

  if (isError) return <div className="p-6 text-red-600 font-sans border border-red-200 bg-red-50 rounded-md">Failed to load regions data.</div>;

  return (
    <div className="w-full max-w-full min-w-0 p-6 space-y-4 bg-white flex flex-col h-full overflow-hidden">
      
      <div className="flex justify-between items-end pb-2 border-b border-gray-100 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-serif tracking-tight text-gray-900">Trade Monitor</h1>
          <p className="text-sm text-gray-500 font-sans mt-1">Regional Aggregation Overview</p>
        </div>
        <input
          type="text"
          placeholder="Search regions..."
          className="px-4 py-2 text-sm font-sans border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div style={{ height: '600px' }} className="w-full max-w-full min-w-0 overflow-hidden shadow-sm rounded-lg border border-gray-100 flex-shrink-0">
        <AgGridReact<MonitorRowData>
          ref={gridRef} 
          theme={themeQuartz}
          rowData={data?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={getRowId}
          context={gridContext} 
          loading={isLoading}
          cellFlashDuration={800} 
          cellFadeDuration={200}  
          getRowClass={(params) => (params.data && isTradeRow(params.data)) ? 'bg-gray-50' : 'bg-white hover:bg-gray-50/50'}
          overlayLoadingTemplate={'<span class="font-sans text-gray-600">Fetching Regions...</span>'}
          overlayNoRowsTemplate={'<span class="font-sans text-gray-600">No regions found.</span>'}
        />
      </div>

      <div className="flex items-center justify-between pt-2 flex-shrink-0 overflow-x-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-700 font-sans whitespace-nowrap">Rows per page</p>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-[70px] text-sm font-sans bg-white border-gray-200 focus:ring-1 focus:ring-gray-900">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent className="font-sans">
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-500 font-sans whitespace-nowrap">
            {data ? `Showing ${(page - 1) * pageSize + 1} to ${Math.min(page * pageSize, data.items)} of ${data.items}` : 'Loading...'}
          </div>
        </div>

        {data && data.items > 0 && (
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); if (data?.prev) setPage((p) => p - 1); }}
                  className={!data?.prev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {paginationRange.map((pageNumber, idx) => {
                if (pageNumber === DOTS) return <PaginationItem key={`dots-${idx}`}><PaginationEllipsis /></PaginationItem>;
                return (
                  <PaginationItem key={`page-${pageNumber}`}>
                    <PaginationLink href="#" isActive={page === pageNumber} onClick={(e) => { e.preventDefault(); setPage(pageNumber as number); }}>
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); if (data?.next) setPage((p) => p + 1); }}
                  className={!data?.next ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}