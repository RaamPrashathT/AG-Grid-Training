"use client";

import React from 'react';

interface GridControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isOnline: boolean;
  filterThreshold: number | '';
  setFilterThreshold: (val: number | '') => void;
}

export const GridControls: React.FC<GridControlsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isOnline,
  filterThreshold,
  setFilterThreshold,
}) => {
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