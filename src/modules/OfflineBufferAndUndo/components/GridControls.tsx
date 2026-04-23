"use client";

import React, { useMemo, useState } from 'react';
import type { Shipment } from '../schema/shipment.schema';

interface GridControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isOnline: boolean;
  filterThreshold: number | '';
  setFilterThreshold: (val: number | '') => void;
  selectedShipments: Shipment[];
}

export const GridControls: React.FC<GridControlsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isOnline,
  filterThreshold,
  setFilterThreshold,
  selectedShipments,
}) => {
  const [isSelectionPopoverOpen, setIsSelectionPopoverOpen] = useState(false);

  const selectedCountLabel = useMemo(() => {
    const count = selectedShipments.length;
    return `${count} row${count === 1 ? '' : 's'} selected`;
  }, [selectedShipments.length]);

  return (
    <div className="grid gap-4 border-b border-border bg-muted/20 px-4 py-4 md:grid-cols-[1fr_auto] md:items-end">
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Edit session</span>
          <span className={isOnline ? "rounded-md border border-border bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700" : "rounded-md border border-border bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700"}>
            {isOnline ? "Online" : "Offline Buffering"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="inline-flex min-w-24 items-center justify-center rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="inline-flex min-w-24 items-center justify-center rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Redo
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSelectionPopoverOpen((prev) => !prev)}
              className="inline-flex min-w-32 items-center justify-center rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground"
            >
              Selected Data
            </button>

            {isSelectionPopoverOpen && (
              <div className="absolute left-0 top-12 z-30 w-[min(92vw,760px)] overflow-hidden rounded-lg border border-border bg-background shadow-xl">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <p className="text-sm font-semibold text-foreground">Selected rows</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">{selectedCountLabel}</span>
                    <button
                      type="button"
                      onClick={() => setIsSelectionPopoverOpen(false)}
                      className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-foreground"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="max-h-72 overflow-auto">
                  {selectedShipments.length === 0 ? (
                    <p className="px-3 py-4 text-sm text-muted-foreground">
                      Select one or more rows in the grid to preview them here.
                    </p>
                  ) : (
                    <table className="min-w-full border-collapse text-left text-sm">
                      <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2">Shipment ID</th>
                          <th className="px-3 py-2">Item</th>
                          <th className="px-3 py-2">Destination</th>
                          <th className="px-3 py-2">Qty</th>
                          <th className="px-3 py-2">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedShipments.map((shipment) => (
                          <tr key={shipment.id} className="border-t border-border/70">
                            <td className="px-3 py-2 font-medium text-foreground">{shipment.id}</td>
                            <td className="px-3 py-2 text-foreground">{shipment.itemName}</td>
                            <td className="px-3 py-2 text-foreground">{shipment.destination}</td>
                            <td className="px-3 py-2 text-foreground">{shipment.quantity}</td>
                            <td className="px-3 py-2 text-foreground">{shipment.weight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-1">
        <label htmlFor="filterThreshold" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          External filter: weight x quantity greater than
        </label>
        <input
          id="filterThreshold"
          type="number"
          placeholder="5000"
          value={filterThreshold}
          onChange={(e) => setFilterThreshold(e.target.value ? Number(e.target.value) : '')}
          className="h-10 w-44 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none"
        />
      </div>
    </div>
  );
};