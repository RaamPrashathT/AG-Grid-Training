// components/HierarchyCellRenderer.tsx
import React, { useState } from 'react';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { isTradeRow, type GridRowData } from '../schema/trade.schema';

export function HierarchyCellRenderer(props: Readonly<CustomCellRendererProps<GridRowData>>) {
  const { data, value, context } = props;
  const [isLoading, setIsLoading] = useState(false);

  // Safety check in case of empty rows during loading
  if (!data) return null;

  const isTrade = isTradeRow(data);
  const isExpanded = context.expandedRegions.has(data.id);

  // --- CHILD ROW RENDER ---
  if (isTrade) {
    return (
      <div className="pl-8 flex items-center text-gray-600 font-mono text-sm w-full h-full ml-2">
        <span className="text-gray-300 mr-2">↳</span> 
        <span className="font-semibold text-indigo-600">{data.symbol}</span>
      </div>
    );
  }

  // --- PARENT ROW RENDER ---
  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row selection triggers if you add them later
    
    if (!isExpanded) setIsLoading(true);
    // context.toggleExpand is passed down from the main Grid component
    await context.toggleExpand(data.id);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center font-medium text-gray-900 w-full h-full select-none">
      <button 
        onClick={handleToggle}
        disabled={isLoading}
        className="mr-3 w-5 h-5 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors shadow-sm focus:outline-none"
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        {isLoading ? (
          <span className="block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
        ) : (
          <span className="text-xs text-gray-600 leading-none pb-[2px]">
            {isExpanded ? '−' : '+'}
          </span>
        )}
      </button>
      {value}
    </div>
  );
}