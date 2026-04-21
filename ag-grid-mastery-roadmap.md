# 🗺️ AG Grid React — Complete Mastery Roadmap
### From Absolute Zero to Expert-Level Mastery (Community Edition)

> **How to use this roadmap:** Each level builds on the previous. Don't skip levels. Every topic links to a concept — practice each one with a mini-project before moving on. The Community Edition is fully covered here; Enterprise-only features are explicitly marked and excluded.

---

## 📍 Prerequisites (Before You Start)

Before touching AG Grid, make sure you are solid on these fundamentals:

- **React** — useState, useEffect, useRef, useCallback, useMemo, useContext
- **TypeScript basics** — interfaces, generics, type annotations (AG Grid is TS-first)
- **JavaScript ES6+** — destructuring, spread, array methods (map, filter, reduce)
- **npm / Node.js** — installing packages, running dev servers
- **Basic HTML/CSS** — understanding of flexbox, CSS variables, basic layout

---

## 🟢 LEVEL 1 — Foundations & First Grid

**Goal:** Install AG Grid and render your first working data grid.

---

### 1.1 Understanding AG Grid

- What is AG Grid and why it exists (performance, feature richness vs. alternatives)
- Community vs. Enterprise — know exactly what's free
- The two rendering philosophies: Client-Side Row Model (CSRM) vs Server-Side
- Understanding the `AgGridReact` component as the entry point
- The role of `AgGridProvider` — module registration wrapper
- AG Grid versioning — understand that v33+ uses the new Module system

---

### 1.2 Installation & Project Setup

- Install AG Grid in a React/Vite or CRA project:

  ```bash
  npm install ag-grid-react
  # ag-grid-community is installed automatically as a peer dep
  ```

- Understand the package split: `ag-grid-community` (core) + `ag-grid-react` (React bindings)
- Import `AllCommunityModule` for full community feature access
- Understand tree-shaking and selective module imports for production builds
- Wrap your app with `AgGridProvider` and pass `modules`

---

### 1.3 Your First Grid

- Define `rowData` as an array of plain JS objects
- Define `columnDefs` as an array of column definition objects
- Render `<AgGridReact rowData={rowData} columnDefs={colDefs} />`
- Wrap the grid in a parent `div` with explicit `height` — understand why this is mandatory
- Use `style={{ height: 500 }}` or `className` with CSS height
- Verify the grid renders in the browser

---

### 1.4 Core Grid Props (The Basics)

- `rowData` — passing data to the grid
- `columnDefs` — defining columns
- `defaultColDef` — default settings applied to all columns
- `theme` — applying built-in themes (`themeQuartz`, `themeAlpine`, `themeBalham`)
- `rowHeight` — setting fixed row height
- `headerHeight` — setting header height
- `suppressCellFocus` — controlling focus behavior
- `animateRows` — enabling row animation

---

### 1.5 Column Definitions Deep Dive

Every column is defined by a `ColDef` object. Learn every basic property:

- `field` — maps to a property name in `rowData`
- `headerName` — custom display name for the column header
- `width` — fixed pixel width
- `minWidth` / `maxWidth` — size constraints
- `flex` — proportional sizing (like CSS flex-grow)
- `hide` — hidden by default
- `sortable` — enables sorting on this column
- `filter` — enables filtering (`true`, or a filter type string)
- `editable` — makes cells editable
- `resizable` — allows user to resize the column
- `pinned` — pin to `'left'` or `'right'`
- `lockPinned` — prevent user from changing pin status
- `lockPosition` — prevent column from being moved
- `checkboxSelection` — show checkbox for row selection
- `headerCheckboxSelection` — select-all checkbox in header

---

### 1.6 `defaultColDef`

- Set common column behaviors once instead of repeating on every column:
  ```js
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };
  ```
- `defaultColDef` is overridden by individual column definitions

---

### 💡 Level 1 Mini-Project

Build a static employee directory grid with at least 6 columns (name, department, role, salary, start date, active), a fixed height, a theme applied, and default sorting/filtering enabled.

---

## 🔵 LEVEL 2 — Columns In Depth

**Goal:** Master every column configuration capability.

---

### 2.1 Column Sizing

- `width` vs `flex` — when to use which
- `suppressSizeToFit` — opt a column out of `sizeColumnsToFit()`
- `autoSizeAllColumns()` API — size columns to fit their content
- `sizeColumnsToFit()` API — stretch columns to fill grid width
- Column resize via mouse drag
- `suppressAutoSize` — prevent auto-sizing on double-click

---

### 2.2 Column Moving & Reordering

- Drag columns to reorder by default
- `suppressMovable` on a column — prevent it from being moved
- `suppressDragLeaveHidesColumns` — column behavior on drag out of grid
- `lockPosition: true` vs `lockPosition: 'left'` / `lockPosition: 'right'`
- Listening to `onColumnMoved` event

---

### 2.3 Column Pinning

- `pinned: 'left'` or `pinned: 'right'` in column definition
- `lockPinned: true` — prevent users from unpinning
- Pinned columns scroll independently — understand the visual layout
- Using the Column Menu to pin interactively (user perspective)

---

### 2.4 Column Groups

- Grouping columns under a shared header using `children`:
  ```js
  {
    headerName: 'Personal Info',
    children: [
      { field: 'firstName' },
      { field: 'lastName' },
    ]
  }
  ```
- `marryChildren` — keeps children together when moving
- `openByDefault` — expand/collapse group by default
- Nested groups (multi-level headers)
- Styling group headers

---

### 2.5 Column Headers

- Custom header text with `headerName`
- `headerTooltip` — tooltip on the header
- Header height customization via grid prop `headerHeight`
- Custom header components with `headerComponent` — rendering React components in headers
- `headerComponentParams` — passing extra props to header components
- Aligning header text: `headerClass`
- `wrapHeaderText` and `autoHeaderHeight` — multi-line headers

---

### 2.6 Column State

- Understanding column state as a serializable snapshot: widths, visibility, order, pinning, sorting, filters
- `gridApi.getColumnState()` — get current state as JSON
- `gridApi.applyColumnState()` — restore state
- Save column state to `localStorage` and restore on page load (critical real-world skill)
- `onColumnStateChanged` event
- `onSortChanged`, `onFilterChanged`, `onColumnResized`, `onColumnVisible`, `onColumnPinned`

---

### 2.7 Column Spanning

- `colSpan` callback — merge cells across columns dynamically:
  ```js
  colSpan: (params) => params.data.isHeader ? 4 : 1
  ```
- Use cases: summary rows, section dividers, merged header cells

---

### 2.8 Updating Column Definitions

- `setGridOption('columnDefs', newColDefs)` — update column definitions at runtime
- Adding/removing columns dynamically
- Maintaining column state across updates
- Understanding the reconciliation behavior — AG Grid diffs column defs by `field` or `colId`
- Using `colId` to explicitly identify a column

---

### 💡 Level 2 Mini-Project
Build a financial data grid with grouped columns (e.g., Q1/Q2/Q3/Q4 grouped under "Quarterly Revenue"), pinned first column, column state saved to localStorage, and dynamic show/hide toggles outside the grid.

---

## 🟡 LEVEL 3 — Rows In Depth

**Goal:** Understand everything about rows — their data, appearance, behavior, and layout.

---

### 3.1 Row Data & Row IDs

- How AG Grid internally tracks rows
- `getRowId` — provide a stable unique ID per row:
  ```js
  getRowId={(params) => params.data.id}
  ```
- Why `getRowId` is critical for data updates, transactions, and selection persistence
- Difference between `rowIndex` (position) and `rowId` (identity)

---

### 3.2 Row Sorting

- `sortable: true` on columns or `defaultColDef`
- Single-column sort on header click
- Multi-column sort: hold Shift + click
- `initialSort` in column definition — pre-sort on load:
  ```js
  { field: 'name', sort: 'asc', sortIndex: 0 }
  ```
- Custom sort comparator via `comparator` callback
- `sortingOrder` — cycle through `['asc', 'desc', null]`
- `multiSortKey` — change from Shift to Ctrl
- `accentedSort` — locale-aware sorting for accented characters
- `postSortRows` — custom post-processing after sort

---

### 3.3 Row Height

- Fixed row height: `rowHeight={50}` on grid
- Dynamic row height: `getRowHeight` callback:
  ```js
  getRowHeight={(params) => params.data.expanded ? 150 : 40}
  ```
- `autoRowHeight: true` — let the grid measure content (perf impact: understand trade-offs)
- `dynamicRowHeight` — changing height after render with `resetRowHeights()`

---

### 3.4 Row Pinning

- `pinnedTopRowData` — array of rows pinned to the top (totals, headers)
- `pinnedBottomRowData` — rows pinned to the bottom (grand totals, footers)
- Pinned rows are NOT part of the main dataset — they don't sort or filter
- Styling pinned rows differently using `rowClassRules`

---

### 3.5 Row Spanning

- `rowSpan` callback on a column — merges cells vertically:
  ```js
  rowSpan: (params) => params.data.isGroup ? 3 : 1
  ```
- `suppressRowTransform: true` required when using `rowSpan`
- Use cases: grouping without the built-in grouping feature

---

### 3.6 Row Styling

- `rowClass` — static CSS class on every row
- `rowClassRules` — conditional classes:
  ```js
  rowClassRules: {
    'row-danger': (params) => params.data.value < 0,
    'row-success': (params) => params.data.value > 100,
  }
  ```
- `rowStyle` — inline style object (avoid for performance; prefer classes)
- `getRowStyle` callback — dynamic inline styles per row
- Alternating row colors (zebra stripes) via theming or CSS

---

### 3.7 Row Numbers

- `rowNumbers: true` — built-in row number column (like a spreadsheet)
- Customizing the row number column via `rowNumbersColumnDef`

---

### 3.8 Row Pagination

- `pagination: true` — enable pagination
- `paginationPageSize` — rows per page (e.g., 25, 50, 100)
- `paginationPageSizeSelector` — list of page size options
- `suppressPaginationPanel` — hide the built-in pagination UI (build your own)
- Grid API methods: `paginationGoToPage()`, `paginationGetCurrentPage()`, `paginationGetTotalPages()`
- Pagination events: `onPaginationChanged`
- Pagination with sorting and filtering — understand how they interact

---

### 3.9 Row Dragging

- **Managed Row Dragging:** `rowDragManaged: true` — grid handles reordering automatically
- `rowDrag: true` on a column — show drag handle
- `rowDragText` — custom drag ghost text callback
- **Unmanaged Row Dragging:** Manual handling via `onRowDragStart`, `onRowDragMove`, `onRowDragEnd`
- Row drag customization — custom drag handle component
- **External DropZone:** `addRowDropZone()` API — drag rows outside the grid (e.g., to a list)
- **Grid to Grid:** Drag rows from one AG Grid to another
- `rowDragEntireRow` — drag by clicking anywhere on the row

---

### 3.10 Full Width Rows

- `isFullWidthRow` callback — mark certain rows as full-width
- `fullWidthCellRenderer` — custom React component for full-width rows
- Use cases: banners, advertisements, section separators, loading skeletons

---

### 3.11 Accessing Rows

- `gridApi.getRowNode(id)` — get a row node by ID
- `gridApi.forEachNode(callback)` — iterate all rows
- `gridApi.forEachLeafNode(callback)` — iterate only leaf nodes (skips groups)
- `gridApi.forEachNodeAfterFilter(callback)` — iterate after filters applied
- `gridApi.forEachNodeAfterFilterAndSort(callback)` — iterate in display order
- Understanding `RowNode` — the internal representation of a row
- `rowNode.data` — the actual data object
- `rowNode.id`, `rowNode.rowIndex`, `rowNode.displayed`

---

### 💡 Level 3 Mini-Project
Build an order management grid with: dynamic row heights based on a "notes" field, pinned top row showing totals, row color coding based on order status, draggable rows for priority reordering, and a paginated view.

---

## 🟠 LEVEL 4 — Cell Content & Rendering

**Goal:** Control exactly what appears inside every cell.

---

### 4.1 Value Getters

- `valueGetter` — derive a cell's value from logic instead of a field:
  ```js
  valueGetter: (params) => params.data.price * params.data.qty
  ```
- `params.data` — the row's data object
- `params.colDef` — the column definition
- `params.api` — the grid API
- When to use `valueGetter` vs `field` + `valueFormatter`

---

### 4.2 Value Formatters

- `valueFormatter` — format the raw value for display without changing the data:
  ```js
  valueFormatter: (params) => `$${params.value.toFixed(2)}`
  ```
- Formatting numbers, currencies, dates, percentages
- Locale-aware formatting with `Intl.NumberFormat` and `Intl.DateTimeFormat`
- `valueFormatter` does NOT affect sorting or filtering (the raw value is used)

---

### 4.3 Cell Data Types

- `cellDataType` — tell AG Grid the type: `'text'`, `'number'`, `'boolean'`, `'date'`, `'dateString'`, `'object'`
- Why data types matter — sorting, filtering, editing all use the type
- `dataTypeDefinitions` — define custom data types with custom parsers/formatters
- Auto-detection of data types vs explicit definition

---

### 4.4 Cell Renderers (Custom Cell Components)

This is one of the most powerful AG Grid features:

- `cellRenderer` — a React component rendered inside the cell:
  ```js
  cellRenderer: (params) => <strong>{params.value}</strong>
  ```
- As an inline function (simple cases) or as a registered component
- `cellRendererParams` — pass extra props to the renderer
- The `params` object: `value`, `data`, `node`, `colDef`, `api`, `context`
- Rendering badges, tags, progress bars, action buttons, avatars, status indicators
- `cellRendererSelector` — choose different renderers per row:
  ```js
  cellRendererSelector: (params) =>
    params.data.type === 'group' ? { component: GroupRenderer } : { component: LeafRenderer }
  ```
- Performance: avoid heavy components in cell renderers (they render for every visible cell)
- `refreshCell()` — force re-render a specific cell
- `IGetRowIdParams`, `ICellRendererParams` — TypeScript types for params

---

### 4.5 Cell Styles

- `cellStyle` — inline style object:
  ```js
  cellStyle: { color: 'red', fontWeight: 'bold' }
  ```
- `cellStyle` as a function — dynamic styles:
  ```js
  cellStyle: (params) => ({ color: params.value < 0 ? 'red' : 'green' })
  ```
- `cellClass` — CSS class on the cell
- `cellClassRules` — conditional CSS classes (same pattern as `rowClassRules`)
- `headerClass` — class on the header cell

---

### 4.6 Tooltips

- `tooltipField` — use a field from `rowData` as tooltip text
- `tooltipValueGetter` — computed tooltip:
  ```js
  tooltipValueGetter: (params) => `Full name: ${params.data.firstName} ${params.data.lastName}`
  ```
- Custom tooltip component: `tooltipComponent` — full React component as tooltip
- `tooltipShowDelay` / `tooltipHideDelay` — timing
- `headerTooltip` — tooltip on the column header

---

### 4.7 Change Cell Renderers (Highlighting Changes)

- `enableCellChangeFlash: true` — flash cells when their value changes
- `cellFlashDuration` / `cellFadeDuration` — control flash timing
- `flashCells()` API — programmatically trigger flash
- Use cases: live data feeds, real-time dashboards

---

### 4.8 Cell Text Selection

- `enableCellTextSelection: true` — allow users to highlight and copy cell text
- `ensureDomOrder: true` — required alongside `enableCellTextSelection` for correct tab order

---

### 4.9 Reference Data

- `refData` — map raw values to display values (like an enum lookup):
  ```js
  refData: { M: 'Male', F: 'Female', U: 'Unknown' }
  ```
- Combined with editing — user sees friendly names, raw codes stored

---

### 4.10 View Refresh

- `refreshCells()` — re-render specific cells or all cells
- `redrawRows()` — fully re-render rows (heavier than refreshCells)
- `suppressChangeDetection` — when and why to disable change detection
- `onCellValueChanged` event — react when a cell's value changes

---

### 4.11 Cell Expressions

- String expressions as `valueGetter`:
  ```js
  valueGetter: 'data.price * data.quantity'
  ```
- Limited use case — prefer function-based getters for maintainability

---

### 💡 Level 4 Mini-Project
Build a product catalog grid with: a custom `cellRenderer` for product images + names combined, color-coded price cells (green/red based on stock), formatted currency and date columns, a custom tooltip showing extended product description, and cell flash on live price updates.

---

## 🔴 LEVEL 5 — Filtering

**Goal:** Master all filtering mechanisms — built-in, custom, and programmatic.

---

### 5.1 Filtering Overview

- How filtering works: column filters, quick filter, external filter, advanced filter
- Filter lifecycle: condition → model → display
- `filter: true` enables the default filter per column data type
- Filters don't modify `rowData` — they hide rows from display

---

### 5.2 Column Filters — Built-In Types

**Text Filter** (`filter: 'agTextColumnFilter'`):
- Filter options: `contains`, `notContains`, `equals`, `notEqual`, `startsWith`, `endsWith`, `blank`, `notBlank`
- `filterParams.filterOptions` — limit available options
- `filterParams.defaultOption` — set default condition
- `filterParams.caseSensitive` — case sensitivity
- `filterParams.debounceMs` — delay before applying

**Number Filter** (`filter: 'agNumberColumnFilter'`):
- Conditions: `equals`, `notEqual`, `lessThan`, `lessThanOrEqual`, `greaterThan`, `greaterThanOrEqual`, `inRange`, `blank`, `notBlank`
- `inRange` requires two values

**Date Filter** (`filter: 'agDateColumnFilter'`):
- Same conditions as number filter but for dates
- `filterParams.comparator` — custom date comparison function
- `filterParams.minValidYear` / `maxValidYear`
- Custom date component for the date picker

**BigInt Filter** (`filter: 'agBigIntColumnFilter'`):
- Handles JavaScript `BigInt` values

---

### 5.3 Filter Conditions & Combining

- AND / OR between two conditions within the same column
- `filterParams.maxNumConditions` — allow more than 2 conditions (default is 2)
- `filterParams.numAlwaysVisibleConditions` — always show N condition inputs

---

### 5.4 Applying Filters

- `filterParams.apply: true` — show an "Apply" button (don't filter on every keystroke)
- `filterParams.buttons: ['apply', 'reset', 'cancel']` — control visible buttons
- `filterParams.closeOnApply: true` — close filter popup after applying

---

### 5.5 Floating Filters

- `floatingFilter: true` — show an always-visible filter input below column headers
- Floating filters are a UX convenience — they sync with the full filter popup
- Custom floating filter component: `floatingFilterComponent`
- `suppressFloatingFilterButton` — hide the expand button

---

### 5.6 Quick Filter

- `quickFilterText` prop — type-based search across all columns simultaneously:
  ```jsx
  <AgGridReact quickFilterText={searchText} ... />
  ```
- `quickFilterParser` — custom text parsing
- `quickFilterMatcher` — custom matching logic
- `cacheQuickFilter: true` — performance optimization for large datasets
- Combine with a search input component outside the grid

---

### 5.7 External Filter

- Override AG Grid's filter with your own logic entirely
- `isExternalFilterPresent()` — return `true` when external filter should be active
- `doesExternalFilterPass(node)` — return `true` if the row should be displayed
- `onFilterChanged()` — call this to trigger re-evaluation
- Use cases: filter by multiple criteria from dropdowns/checkboxes outside the grid

---

### 5.8 Advanced Filter

- `enableAdvancedFilter: true` — enable the advanced filter UI
- Users can build complex filter expressions with AND/OR groups visually
- `advancedFilterModel` — read/write the filter state as JSON
- `advancedFilterParent` — render the filter UI in a custom container
- `advancedFilterBuilderParams` — customize the filter builder

---

### 5.9 Custom Column Filters

- Build a fully custom filter component using React:
  ```jsx
  const MyFilter = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
      isFilterActive: () => { /* ... */ },
      getModel: () => { /* ... */ },
      setModel: (model) => { /* ... */ },
    }));
    // ... render your custom UI
  });
  ```
- `filterComponent` on the column definition
- Methods the component must implement: `isFilterActive`, `getModel`, `setModel`, `onNewRowsLoaded`

---

### 5.10 Filter API

- `gridApi.getFilterInstance(colId)` — get a filter instance
- `gridApi.setFilterModel(model)` — programmatically set filters
- `gridApi.getFilterModel()` — read current filter state
- `gridApi.resetColumnFilters()` — clear all filters
- Persisting filter state to URL params or localStorage

---

### 💡 Level 5 Mini-Project
Build a data grid with: text + number + date column filters, a global quick search bar, a set of external filter buttons (filter by category), and a "Save Filters" button that serializes the filter state to localStorage and restores it on reload.

---

## 🟣 LEVEL 6 — Selection

**Goal:** Master row and cell selection in all its forms.

---

### 6.1 Row Selection

**Single Row Selection:**
- `rowSelection={{ mode: 'singleRow' }}`
- Click to select, click again to deselect (optional)
- `checkboxSelection: true` on a column

**Multi-Row Selection:**
- `rowSelection={{ mode: 'multiRow' }}`
- Click, Shift+Click, Ctrl+Click
- `checkboxSelection: true` + `headerCheckboxSelection: true` for select-all
- `selectAll` mode — `'all'` vs `'filtered'` vs `'currentPage'`

**Selection Events & API:**
- `onSelectionChanged` — fires when selection changes
- `gridApi.getSelectedRows()` — get data of selected rows
- `gridApi.getSelectedNodes()` — get RowNode objects
- `gridApi.selectAll()` / `gridApi.deselectAll()`
- `gridApi.selectAllFiltered()` / `gridApi.deselectAllFiltered()`
- Persisting selection across pagination or filtering

---

### 6.2 Cell Selection (Range Selection)

- `cellSelection: true` — enable Excel-like cell range selection
- Click and drag to select a rectangular range
- Shift+Click to extend selection
- `onCellSelectionChanged` event
- `gridApi.getCellRanges()` — get selected ranges

**Range Handle:**
- Visual handle on the bottom-right of the selected range
- `cellSelection.handle: { mode: 'range' }` — extend the range by dragging

**Fill Handle:**
- `cellSelection.handle: { mode: 'fill' }` — drag to auto-fill values (like Excel)
- `fillOperation` callback — custom fill logic:
  ```js
  fillOperation: (params) => params.initialValues[0] // replicate first value
  ```

---

### 💡 Level 6 Mini-Project
Build a spreadsheet-like grid where users can: select multiple rows with checkboxes, see a count of selected rows in a status bar, select cell ranges and see a sum/avg in the footer, and use the fill handle to auto-populate sequential values.

---

## ⚫ LEVEL 7 — Editing

**Goal:** Make the grid fully editable with validation and undo support.

---

### 7.1 Cell Editing Overview

- `editable: true` on a column or via `defaultColDef`
- `editable` as a function — conditional editability:
  ```js
  editable: (params) => params.data.status === 'draft'
  ```
- Double-click or press Enter/F2 to start editing
- Press Escape to cancel, Tab/Enter to confirm

---

### 7.2 Start/Stop Editing

- `gridApi.startEditingCell({ rowIndex, colKey })` — programmatically start editing
- `gridApi.stopEditing()` — stop editing (with or without accepting changes)
- `singleClickEdit: true` — single click to start editing
- `onCellEditingStarted` / `onCellEditingStopped` events

---

### 7.3 Built-In Cell Editors

**Text Editor** (`agTextCellEditor`):
- Default for text columns
- `useFormatter: true` — display formatted value in edit mode too

**Number Editor** (`agNumberCellEditor`):
- Numeric input
- `min`, `max`, `precision`, `step` params

**Large Text Editor** (`agLargeTextCellEditor`):
- Textarea popup for long text

**Date Editors** (`agDateCellEditor`, `agDateStringCellEditor`):
- Native date picker
- `min`, `max` date constraints

**Checkbox Editor** (`agCheckboxCellEditor`):
- Toggle boolean values

**Select Editor** (`agSelectCellEditor`):
- Dropdown from a list of values
- `values` param: array of options

**Rich Select Editor** (`agRichSelectCellEditor`):
- Enhanced dropdown with search, custom rendering
- `values` — list of options
- `cellRenderer` — custom option rendering
- `searchable: true` — enable search within dropdown
- Async values: `valuesCallback` — load options dynamically

---

### 7.4 Custom Cell Editors

Build any edit UI as a React component:
```jsx
const MyEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value);
  useImperativeHandle(ref, () => ({
    getValue: () => value,
    isCancelBeforeStart: () => false,
    isCancelAfterEnd: () => false,
  }));
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
});
```
- Register as `cellEditor: MyEditor`
- `cellEditorPopup: true` — render in a popup instead of inline
- `cellEditorPopupPosition` — `'over'` or `'under'`
- `cellEditorParams` — pass props to editor

---

### 7.5 Value Parsers & Setters

- `valueParser` — convert the raw edited string to the correct type before saving:
  ```js
  valueParser: (params) => Number(params.newValue)
  ```
- `valueSetter` — custom logic to update the row data:
  ```js
  valueSetter: (params) => {
    params.data.price = parseFloat(params.newValue);
    return true; // return true if value changed
  }
  ```
- `onCellValueChanged` — event fired after a valid value is committed

---

### 7.6 Validation

- `cellEditorParams.validate` — return an error message string or `null`:
  ```js
  validate: (value) => value < 0 ? 'Must be positive' : null
  ```
- Custom validation in `valueSetter` — reject change by returning `false`

---

### 7.7 Full Row Editing

- `editType: 'fullRow'` — all cells in a row enter edit mode simultaneously
- Useful for form-like row entry
- `onRowEditingStarted` / `onRowEditingStopped` events

---

### 7.8 Undo/Redo

- `undoRedoCellEditing: true` — enable undo/redo
- `undoRedoCellEditingLimit` — max number of undo steps
- Ctrl+Z / Ctrl+Y keyboard shortcuts automatically work
- `gridApi.undoCellEditing()` / `gridApi.redoCellEditing()`

---

### 7.9 Batch Editing

- Collect multiple edits before committing to the data source
- Pattern: accumulate changes in a local state, then commit on "Save" button
- `onCellValueChanged` — capture each change
- `readOnlyEdit: true` — grid fires events but doesn't update `rowData` (full control)

---

### 💡 Level 7 Mini-Project
Build an invoice editor grid where: rows are editable with different editor types per column (text, number, date, select), validation prevents negative quantities, undo/redo works, full-row editing mode is used, and a "Save Changes" button commits accumulated changes.

---

## 🟤 LEVEL 8 — Updating Data

**Goal:** Efficiently update the grid's data at runtime.

---

### 8.1 Replacing Row Data

- Setting a new `rowData` array via React state — simplest approach
- AG Grid reconciles using `getRowId` — rows with matching IDs are updated in place
- Without `getRowId`, AG Grid re-renders all rows from scratch
- `onRowDataUpdated` event

---

### 8.2 Single Row/Cell Updates

- `gridApi.getRowNode(id)` → `rowNode.setData(newData)` — replace all data in a row
- `rowNode.setDataValue(field, value)` — update a single cell
- These trigger change detection and cell flash if enabled

---

### 8.3 Transaction Updates

The most efficient way to update data:
```js
gridApi.applyTransaction({
  add: [{ id: 4, name: 'New Row' }],
  update: [{ id: 2, name: 'Updated' }],
  remove: [{ id: 3 }],
});
```
- `add` — add new rows (appended by default)
- `update` — update existing rows (matched by `getRowId`)
- `remove` — remove rows
- `addIndex` — position for added rows
- `applyTransaction` returns a result object with `add`, `update`, `remove` RowNode arrays
- Transactions do NOT cause a full re-render — only affected rows update

---

### 8.4 High Frequency Updates

For live/streaming data (stock tickers, sensor data):
- `applyTransactionAsync(transaction, callback)` — batches multiple rapid updates
- `asyncTransactionWaitMillis` — how long to batch before applying (default: 50ms)
- `onAsyncTransactionsFlushed` event
- Avoid calling `applyTransaction` in a tight loop — use async version instead

---

### 💡 Level 8 Mini-Project
Build a live stock ticker grid that: receives WebSocket-simulated price updates every 500ms, uses `applyTransactionAsync` for high-frequency updates, flashes cells on price change, and allows users to manually add/remove stocks via form.

---

## 🔷 LEVEL 9 — Grid API & Events

**Goal:** Fully command the grid programmatically.

---

### 9.1 Accessing the Grid API

- `useRef` + `onGridReady`:
  ```jsx
  const gridRef = useRef();
  <AgGridReact ref={gridRef} onGridReady={(params) => { /* params.api */ }} />
  // Usage: gridRef.current.api.method()
  ```
- `onGridReady` fires once the grid is initialized
- `gridRef.current.api` vs `params.api` — same object

---

### 9.2 Key Grid API Categories

**Column API:**
- `setColumnsVisible([colIds], visible)` — show/hide columns
- `setColumnPinned(colId, pinned)` — pin/unpin
- `moveColumn(colId, toIndex)` — reorder
- `autoSizeAllColumns()` — auto-size to content
- `sizeColumnsToFit()` — stretch to container width
- `getColumnDefs()` — get current column definitions

**Row API:**
- `forEachNode`, `forEachLeafNode`, `forEachNodeAfterFilter`, `forEachNodeAfterFilterAndSort`
- `getRowNode(id)` — get by ID
- `getDisplayedRowAtIndex(index)` — get by display index
- `getDisplayedRowCount()` — total displayed (after filter)

**Selection API:**
- `selectAll()`, `deselectAll()`, `selectAllFiltered()`
- `getSelectedRows()`, `getSelectedNodes()`

**Filter API:**
- `setFilterModel(model)`, `getFilterModel()`, `resetColumnFilters()`

**Sort API:**
- `applyColumnState({ state: [{ colId: 'name', sort: 'asc' }] })`

**Scroll API:**
- `ensureIndexVisible(index, 'middle')` — scroll to a row
- `ensureColumnVisible(colId)` — scroll to a column
- `getHorizontalPixelRange()`, `getVerticalPixelRange()`

**Export API:**
- `exportDataAsCsv()`, `getDataAsCsv()`

**Editing API:**
- `startEditingCell()`, `stopEditing()`, `undoCellEditing()`, `redoCellEditing()`

**Cell Flash API:**
- `flashCells({ rowNodes, columns })` — flash specific cells

**Misc:**
- `refreshCells()`, `redrawRows()`, `resetRowHeights()`
- `showLoadingOverlay()`, `showNoRowsOverlay()`, `hideOverlay()`
- `paginationGoToPage()`, `paginationGetCurrentPage()`
- `getRenderedNodes()` — get currently visible (DOM-rendered) row nodes
- `destroy()` — clean up the grid instance

---

### 9.3 Grid Events (Complete Reference)

**Grid Lifecycle Events:**
- `onGridReady` — grid initialized, API available
- `onFirstDataRendered` — data rendered for the first time
- `onGridSizeChanged` — grid container resized
- `onGridPreDestroyed` — before grid is destroyed
- `onModelUpdated` — row model changed (filter, sort, data update)

**Row Events:**
- `onRowClicked`, `onRowDoubleClicked`
- `onRowSelected`, `onSelectionChanged`
- `onRowDataUpdated`, `onRowGroupOpened`
- `onRowDragEnter`, `onRowDragMove`, `onRowDragEnd`, `onRowDragLeave`

**Cell Events:**
- `onCellClicked`, `onCellDoubleClicked`, `onCellFocused`
- `onCellValueChanged`, `onCellEditingStarted`, `onCellEditingStopped`
- `onCellMouseOver`, `onCellMouseOut`
- `onCellKeyDown`

**Column Events:**
- `onColumnMoved`, `onColumnResized`, `onColumnVisible`, `onColumnPinned`
- `onColumnGroupOpened`, `onColumnStateChanged`
- `onSortChanged`, `onFilterChanged`
- `onColumnRowGroupChanged`, `onColumnPivotChanged`, `onColumnValueChanged`

**Filter Events:**
- `onFilterChanged`, `onFilterModified`, `onFilterOpened`

**Pagination Events:**
- `onPaginationChanged`

**Import/Export Events:**
- `onAsyncTransactionsFlushed`

---

### 💡 Level 9 Mini-Project
Build a grid control panel outside the grid (a sidebar) that: uses the Grid API to show/hide columns via checkboxes, triggers sort reset, clears all filters, exports to CSV, scrolls to a specific row by ID, and displays a live counter of visible rows after filtering.

---

## 🌟 LEVEL 10 — Theming & Styling

**Goal:** Make the grid look exactly how you want it.

---

### 10.1 Theming Overview

- AG Grid v33+ uses a new CSS variable-based theming system
- Built-in themes: `themeQuartz` (default), `themeAlpine`, `themeBalham`
- Legacy themes from v32 still available but deprecated

---

### 10.2 Applying a Theme

```jsx
import { themeQuartz } from 'ag-grid-community';
<AgGridReact theme={themeQuartz} ... />
```

Customizing with `withParams`:
```js
const myTheme = themeQuartz.withParams({
  accentColor: '#007bff',
  backgroundColor: '#1a1a2e',
  foregroundColor: '#ffffff',
  fontSize: 14,
});
```

---

### 10.3 Theme Parameters (Key Variables)

- `accentColor` — primary interaction color (selected rows, focus rings)
- `backgroundColor` / `foregroundColor` — base colors
- `borderColor` — grid lines
- `rowHoverColor` — hover state
- `selectedRowBackgroundColor` — selected row
- `oddRowBackgroundColor` — zebra stripes
- `fontSize`, `fontFamily`
- `headerBackgroundColor`, `headerTextColor`
- `cellHorizontalPaddingScale` — horizontal padding factor
- `rowVerticalPaddingScale` — vertical padding factor
- `spacingScale` — global spacing multiplier

---

### 10.4 Colors & Dark Mode

- `colorScheme: 'dark'` — enable dark mode
- `colorScheme: 'inherit'` — follow the OS/browser preference
- Using CSS `prefers-color-scheme` media query
- Providing dark/light params with `withParams`:
  ```js
  const myTheme = themeQuartz
    .withParams({ backgroundColor: '#fff' }, 'light')
    .withParams({ backgroundColor: '#1a1a2e' }, 'dark');
  ```

---

### 10.5 Theming Parts

- Theme parts are composable sub-themes: `colorSchemeLightCold`, `colorSchemeDark`, `iconSetAlpine`, etc.
- `themeQuartz.withPart(iconSetMaterial)` — swap icon set
- Available icon sets: `iconSetAlpine`, `iconSetMaterial`, `iconSetQuartz`
- Custom icons via `iconSetQuartzLight`, `iconSetQuartzBold`

---

### 10.6 Typography & Borders

- `fontFamily`, `fontSize`, `fontWeight`
- `wrapperBorderRadius` — outer grid border radius
- `cellBorderStyle`, `rowBorderStyle` — control cell/row lines
- `columnBorderStyle` — vertical column separators

---

### 10.7 Extending with CSS

- Use `::part()` pseudo-element for direct DOM targeting (limited browser support)
- CSS custom properties override: set `--ag-*` variables in a CSS file
- `ag-theme-quartz` class scoping
- Writing CSS that targets specific cells, headers, pinned areas

---

### 10.8 Row & Cell Style (Runtime)

- `rowClass`, `rowClassRules`, `rowStyle`, `getRowStyle`
- `cellClass`, `cellClassRules`, `cellStyle`, `getCellClass`
- Combining static class names with dynamic ones

---

### 10.9 Grid Size & Layout

- Always wrap in a container with explicit height
- Full-page grid: `height: 100vh` or `height: 100%` with parent filling viewport
- Responsive grid: `onGridSizeChanged` event → `sizeColumnsToFit()`
- `domLayout: 'autoHeight'` — grid expands to fit all rows (caution: virtualization disabled)
- `domLayout: 'print'` — for print layout (all rows rendered)

---

### 10.10 Theme Builder

- Use the online AG Grid Theme Builder: https://www.ag-grid.com/theme-builder/
- Generate theme parameters visually
- Copy generated code into your project

---

### 💡 Level 10 Mini-Project
Implement a grid with: a custom branded light + dark theme using `withParams`, a toggle button to switch between modes, custom header background, striped rows, custom font, and a settings panel that lets users adjust font size and row height via sliders (using `withParams` at runtime).

---

## 🔶 LEVEL 11 — Advanced Features

**Goal:** Master the complex features that differentiate expert AG Grid developers.

---

### 11.1 Row Grouping

- `rowGroupPanelShow: 'always'` — show the "drag here to group" panel
- `rowGroup: true` on a column — enable grouping by that column
- Multi-level grouping (group within group)

**Group Display Types:**
- Single Group Column — all levels in one auto-generated column
- Multiple Group Columns — one column per grouping level
- Group Rows — entire rows for group headers

**Grouping Configuration:**
- `groupDefaultExpanded` — how many levels to expand by default (-1 = all)
- `autoGroupColumnDef` — customize the auto-generated group column
- `groupRowRenderer` / `groupRowRendererParams` — custom group row component
- `groupIncludeTotalFooter: true` — grand total row
- `groupIncludeFooter: true` — subtotal per group
- `groupHideOpenParents: true` — collapse parent when child groups shown
- `showOpenedGroup: true` — show group value in the group column

**Sorting Groups:**
- `groupMaintainOrder: true` — keep original order within groups
- Custom comparators in `autoGroupColumnDef`

**Row Selection in Groups:**
- `rowSelection.groupSelects` — `'self'`, `'filteredDescendants'`, `'descendants'`

---

### 11.2 Aggregation

- `aggFunc` on a column — aggregate values within groups:
  - Built-in: `'sum'`, `'min'`, `'max'`, `'count'`, `'avg'`, `'first'`, `'last'`
  - Custom: a function `(params) => params.values.reduce(...)`
- `enableValue: true` — allow a column to be used in the Values panel (Enterprise) or programmatically
- `aggregateOnlyChangedColumns: true` — performance optimization
- Total rows: pinned bottom row with aggregated values (manual implementation for Community)
- `groupAggFiltering: true` / `false` — whether aggregation happens before or after filtering

---

### 11.3 Tree Data

For hierarchical/nested data (folder trees, org charts):

- `treeData: true` on the grid
- `getDataPath` callback — returns the path for each row:
  ```js
  getDataPath={(data) => data.orgHierarchy} // e.g., ['CEO', 'VP Engineering', 'Engineer']
  ```

**Supplying Data:**
- Data paths (array of strings per node)
- Nested records (children arrays in data)
- Self-referential records (parentId references)

**Tree Configuration:**
- `autoGroupColumnDef` — customize the hierarchy column
- `groupDefaultExpanded` — default expand level
- Tree selection — selecting parents can auto-select children
- Tree filtering — how filter works with parent/child visibility
- Tree row dragging — drag nodes to restructure the tree

---

### 11.4 Master / Detail

For grids-within-grids:

- `masterDetail: true` — enable master/detail
- `isRowMaster` callback — which rows have detail
- `detailCellRendererParams` — configure the detail grid:
  ```js
  detailCellRendererParams: {
    detailGridOptions: { columnDefs: [...], defaultColDef: {...} },
    getDetailRowData: (params) => {
      params.successCallback(params.data.children);
    },
  }
  ```
- `detailRowHeight` — fixed height for detail section
- `detailRowAutoHeight: true` — auto height
- `keepDetailRows: true` — preserve detail grid state when closing
- `keepDetailRowsCount` — max cached detail rows
- Custom detail component: `detailCellRenderer` — completely custom React component for the detail area
- Nesting master/detail (grid-in-grid-in-grid)

---

### 11.5 Accessories

**Sidebar & Tool Panels:**
- `sideBar: true` — enable default sidebar (Columns + Filters panels)
- `sideBar: { toolPanels: [...] }` — customize
- **Columns Tool Panel** — drag/drop columns, show/hide, group, sort, aggregate
- **Filters Tool Panel** — access all column filters in one panel
- Custom Tool Panel component — build your own panel with `toolPanelComponent`

**Column Menu:**
- Right-click column header to open menu
- `getMainMenuItems` — customize menu items:
  ```js
  getMainMenuItems: (params) => [...params.defaultItems, 'separator', { name: 'Custom', action: () => {} }]
  ```

**Context Menu:**
- Right-click on a cell
- `getContextMenuItems` callback — define menu items
- Built-in items: `'copy'`, `'paste'`, `'export'`, `'csvExport'`
- Custom items with actions

**Status Bar:**
- `statusBar` prop — bar at the bottom of the grid
- Built-in components: `agTotalAndFilteredRowCountComponent`, `agTotalRowCountComponent`, `agFilteredRowCountComponent`, `agSelectedRowCountComponent`, `agAggregationComponent`
- Custom status bar component

**Overlays:**
- `loadingOverlayComponent` — custom loading spinner
- `noRowsOverlayComponent` — custom empty state
- `overlayLoadingTemplate` / `overlayNoRowsTemplate` — simple HTML templates
- `gridApi.showLoadingOverlay()`, `gridApi.showNoRowsOverlay()`, `gridApi.hideOverlay()`

---

### 11.6 Export — CSV

- `gridApi.exportDataAsCsv()` — download a CSV file
- `gridApi.getDataAsCsv()` — get CSV string
- `CsvExportParams`:
  - `fileName` — output file name
  - `columnKeys` — specific columns to include
  - `onlySelected: true` — export only selected rows
  - `skipPinnedTop`, `skipPinnedBottom`
  - `processHeaderCallback` — custom header text
  - `processCellCallback` — custom cell value per cell

---

### 11.7 Clipboard

- `enableClipboard: true` (Community) — basic copy/paste
- Ctrl+C — copy selected cells
- Ctrl+V — paste into editable cells
- `copyHeadersToClipboard: true` — include headers in copy
- `copyGroupHeadersToClipboard: true`
- `clipboardDelimiter` — default is `\t` (tab)
- `sendToClipboard` / `processDataFromClipboard` — custom clipboard handling
- `suppressCopyRowsToClipboard` — only copy cell ranges, not selected rows

---

### 11.8 Drag & Drop

- Row dragging to external elements via `addRowDropZone`
- Drag from external list into the grid
- Multi-grid drag and drop
- `dndSource: true` on a column — HTML5 drag source
- `dndSourceOnRowDrag` — custom drag data

---

### 11.9 Printing

- `domLayout: 'print'` — disables virtualization, renders all rows
- `gridApi.setGridOption('domLayout', 'print')` → trigger print → restore `'normal'`
- CSS `@media print` — hide UI elements, expand grid
- `suppressHorizontalScroll` — prevent horizontal scrollbar on print

---

### 11.10 Localisation

- `localeText` prop — override all UI strings:
  ```js
  localeText: { filterOoo: 'Filtrele...', equals: 'Eşittir', ... }
  ```
- Full list of localisation keys in the AG Grid docs
- Community-provided locale files on GitHub
- Dynamic locale switching — update `localeText` prop at runtime

---

### 11.11 Accessibility (ARIA)

- AG Grid is ARIA-compliant out of the box (role="grid", role="row", role="gridcell")
- `ariaLabel` — describe the grid for screen readers
- Keyboard navigation built-in (Tab, Arrow keys, Enter, Escape)
- `suppressCellFocus: false` — keep focus management enabled
- High contrast mode support via theming

---

### 11.12 RTL Support

- `enableRtl: true` — right-to-left text direction for Arabic, Hebrew, etc.
- Columns reverse order, pinning swaps sides
- Combine with `dir="rtl"` on the HTML element

---

### 11.13 Aligned Grids

- `alignedGrids` — synchronize scroll, column widths, and column order across multiple grids:
  ```jsx
  const grid1Ref = useRef();
  const grid2Ref = useRef();
  <AgGridReact ref={grid1Ref} alignedGrids={[grid2Ref]} ... />
  <AgGridReact ref={grid2Ref} alignedGrids={[grid1Ref]} ... />
  ```
- Use case: header-only grid + data grid side by side, frozen header effect

---

### 💡 Level 11 Mini-Project
Build an org chart viewer using Tree Data, a product inventory with master-detail (product → order history), and a reporting grid with: row grouping by department + aggregated salary sum, custom sidebar panel showing group statistics, a context menu with copy + export actions, and a status bar showing row count and sum.

---

## 🔵 LEVEL 12 — Server-Side Data & Row Models

**Goal:** Understand how to handle massive datasets that can't fit in the browser.

---

### 12.1 Understanding Row Models

AG Grid has four row models:

1. **Client-Side Row Model (CSRM)** — all data loaded upfront (default, what we've been using)
2. **Server-Side Row Model (SSRM)** — data fetched from server as needed
3. **Infinite Row Model** — legacy infinite scrolling (deprecated in favor of SSRM)
4. **Viewport Row Model** — only renders rows visible in viewport (Enterprise)

When to use SSRM: datasets of millions of rows, server-side sorting/filtering/grouping required.

---

### 12.2 Server-Side Row Model

- `rowModelType: 'serverSide'`
- `serverSideDatasource` — object with a `getRows(params)` method:
  ```js
  const datasource = {
    getRows: (params) => {
      const { startRow, endRow, sortModel, filterModel } = params.request;
      fetchData({ startRow, endRow, sortModel, filterModel }).then((data) => {
        params.success({ rowData: data.rows, rowCount: data.total });
      });
    }
  };
  gridApi.setGridOption('serverSideDatasource', datasource);
  ```

**SSRM Configuration:**
- `cacheBlockSize` — rows per server request (default: 100)
- `maxBlocksInCache` — max cached blocks in memory
- `purgeClosedRowNodes` — free memory when rows are off-screen

**Server-Side Sorting:**
- `params.request.sortModel` — array of `{ colId, sort }` objects
- Pass to your backend query

**Server-Side Filtering:**
- `params.request.filterModel` — current filter state as JSON
- Parse and translate to your backend query language

**Server-Side Grouping:**
- `params.request.rowGroupCols` — which columns to group by
- `params.request.groupKeys` — the specific group values being expanded
- Lazy loading of group children

**Server-Side Pagination:**
- `pagination: true` + SSRM — pages map to server requests
- `paginationPageSize` controls `startRow`/`endRow` in requests

**Server-Side Selection:**
- `rowSelection.mode: 'multiRow'` with SSRM
- Selection model handles partial loads

**Updating SSRM Data:**
- `gridApi.refreshServerSide({ purge: true })` — force a full refresh
- `gridApi.refreshServerSide({ route: ['group1'] })` — refresh a specific group
- Single-row updates: `getRowNode(id)` → `setData()`
- SSRM Transactions: `applyServerSideTransaction()` — add/update/remove without full refresh

**Load Retry:**
- `params.fail()` in datasource — signals load failure
- `gridApi.retryServerSideLoads()` — retry failed loads
- Custom loading cell renderer for loading/error states

---

### 12.3 Infinite Row Model (Legacy)

- `rowModelType: 'infinite'`
- Simpler than SSRM — one flat list with infinite scrolling
- `datasource` with `getRows(params)` method
- `infiniteInitialRowCount` — placeholder row count
- `maxConcurrentDatasourceRequests`
- Still useful for simple infinite scroll without grouping/pivoting

---

### 12.4 Grid State Persistence

- `initialState` prop — restore grid state on mount:
  ```js
  const initialState = { sort: { sortModel: [...] }, filter: { filterModel: {...} } };
  ```
- `onStateUpdated` event — fires on every state change
- `gridApi.getState()` — get complete serializable state
- State includes: sort, filter, columnDefs (visibility, width, order, pinning), scroll position, selection, pagination
- Save to backend for user-specific layouts

---

### 💡 Level 12 Mini-Project
Build a server-simulated grid that: uses the Server-Side Row Model with a mock async `getRows` function, supports server-side sorting and filtering, groups data by category with lazy loading, paginates results (25/page), and shows a retry button on load failure.

---

## 🌈 LEVEL 13 — Performance Optimization

**Goal:** Make the grid buttery smooth even with massive datasets.

---

### 13.1 DOM Virtualization

- AG Grid only renders DOM nodes for visible rows and columns — this is automatic
- `suppressColumnVirtualisation: true` — disable column virtualization (all columns always rendered; use sparingly)
- `rowBuffer` — number of rows rendered outside viewport (default: 10)
- Understanding the rendering pipeline: data → row model → virtual DOM → actual DOM

---

### 13.2 Change Detection

- AG Grid checks for changes on every `rowData` update
- `suppressChangeDetection: true` — disable automatic change detection (use `refreshCells()` manually)
- `enableCellChangeFlash` — visual indicator for changed cells
- Only update `rowData` when truly changed — avoid new array references unnecessarily
- Use `applyTransaction` instead of replacing entire `rowData`

---

### 13.3 Value Cache

- `enableCellExpressions: true` + `valueCache: true` — cache computed values
- `valueCacheNoPurgeOnDataChange: true` — don't purge cache on data change (advanced)
- Useful when `valueGetter` is expensive
- `gridApi.expireValueCache()` — manually invalidate

---

### 13.4 Row Animation

- `animateRows: true` — smooth transitions when rows move (sort, filter, group)
- Disable for better performance on very large datasets

---

### 13.5 Massive Row Count

- AG Grid Community handles ~100,000 client-side rows with virtualization
- `suppressRowVirtualisation: false` — keep virtualization on (default)
- Avoid complex `cellRenderer` components in high-row-count grids
- Use `getRowHeight` with `suppressRowTransform` carefully
- For 1M+ rows — switch to Server-Side Row Model

---

### 13.6 React-Specific Performance

- Use `useMemo` for `columnDefs` — avoid redefining on every render
- Use `useCallback` for callbacks passed to grid props
- `columnDefs` defined outside the component, or memoized inside
- Avoid passing new object references to the grid on every render
- Understanding when AG Grid triggers React re-renders
- `suppressReactUi: true` — use legacy non-React rendering (avoid unless debugging)

---

### 13.7 Scrolling Performance

- `suppressAnimationFrame: true` — skip animation frame optimization (rarely needed)
- `suppressColumnMoveAnimation: true` — faster column drag
- `debounceVerticalScrollbar: true` — reduce scroll event frequency
- CSS `will-change: transform` on grid container can help on some browsers
- Hardware-accelerated scrolling — AG Grid uses CSS transforms for row positioning

---

### 💡 Level 13 Mini-Project
Load 50,000 rows into a client-side grid and profile it. Then: memoize all columnDefs/callbacks, switch bulk updates to `applyTransaction`, enable value caching for a computed column, and measure the performance difference using React DevTools and Chrome Performance tab.

---

## 🎓 LEVEL 14 — Testing & Best Practices

**Goal:** Write testable, maintainable AG Grid code.

---

### 14.1 Testing Overview

Three testing strategies:
1. **Unit testing** with React Testing Library + Vitest/Jest
2. **End-to-end testing** with Playwright or Cypress

---

### 14.2 Unit Testing with React Testing Library

- Render the grid component in a test
- AG Grid requires a DOM environment — use jsdom
- Query cells by their text content
- Test that `rowData` is displayed correctly
- Test column header rendering
- Mock `gridApi` calls
- Test custom cell renderers in isolation (they're just React components)
- Test custom editors via `ref` and `getValue()`

---

### 14.3 E2E Testing with Playwright

- Navigate to the page with the grid
- Use `page.locator('[role="gridcell"]')` — target AG Grid's ARIA roles
- Click on cells, headers, filter buttons
- Test sorting: click header → verify row order
- Test filtering: interact with filter popup → verify visible rows
- Test editing: double-click cell → type → Tab → verify value

---

### 14.4 E2E Testing with Cypress

- Similar to Playwright with Cypress-specific selectors
- `cy.get('[col-id="name"]')` — target by column ID attribute
- AG Grid sets `col-id` attributes on cells and headers — use them for stable selectors

---

### 14.5 React Best Practices

- Define `columnDefs` outside the component (or `useMemo`) — critical for performance
- Use `useCallback` for all event handlers passed to the grid
- Use `getRowId` always when data has unique IDs
- Prefer `applyTransaction` over full `rowData` replacement for updates
- Use `onGridReady` to store the API ref — don't call API before grid is ready
- Separate grid configuration from data logic — keep column defs in their own file
- Use TypeScript with AG Grid — full generic typing for `ColDef<YourRowType>`

---

### 14.6 TypeScript Integration

- `ColDef<TData>` — typed column definition:
  ```ts
  const colDefs: ColDef<Employee>[] = [
    { field: 'name' }, // 'name' is type-checked against Employee
  ];
  ```
- `ICellRendererParams<TData>` — typed cell renderer params
- `ValueGetterParams<TData>`, `ValueFormatterParams<TData>`
- `GridApi<TData>` — typed grid API
- `GetRowIdParams<TData>`, `RowClassParams<TData>`
- Enable strict TypeScript for maximum benefit

---

### 14.7 Code Organization Patterns

- Column definitions file: `employeeColumns.ts`
- Custom renderers directory: `components/grid/renderers/`
- Custom editors directory: `components/grid/editors/`
- Grid wrapper component: `DataGrid.tsx` — encapsulate grid + state logic
- Custom hooks: `useGridState()`, `useGridApi()`, `useColumnState()`
- Grid context for cross-component communication

---

### 💡 Level 14 Mini-Project
Write a full test suite for your Level 11 project: unit tests for all custom cell renderers and editors, integration tests for filter and sort behavior, Playwright E2E tests for the complete user workflow (filter → sort → select → export).

---

## 🚀 LEVEL 15 — Real-World Patterns & Mastery

**Goal:** Apply everything in production-grade scenarios.

---

### 15.1 Grid Context

- `context` prop — pass arbitrary data to all renderers and callbacks:
  ```jsx
  <AgGridReact context={{ theme: 'dark', permissions: { canEdit: true } }} ... />
  ```
- Access via `params.context` in any callback or renderer
- Use for: user permissions, theme info, shared state, API references
- `gridApi.setGridOption('context', newContext)` — update at runtime

---

### 15.2 Grid Lifecycle

- `onGridReady` → `onFirstDataRendered` → normal operation → `onGridPreDestroyed`
- Cleanup: remove event listeners in `onGridPreDestroyed`
- Re-initialization patterns (destroy + recreate vs. update existing)

---

### 15.3 Grid State Management

- Full state serialization: `gridApi.getState()` covers everything
- Persist to backend per user → restore on login
- Layout presets: save/load named configurations
- URL-based state: encode filter/sort in URL params for shareable links
- `initialState` prop for SSR hydration

---

### 15.4 Custom Components Registry

Registering components globally via `AgGridProvider`:
```jsx
<AgGridProvider modules={modules} components={{ myRenderer: MyRenderer }}>
```
Then use by string name: `cellRenderer: 'myRenderer'`

---

### 15.5 AI Features (Community Preview)

- AG Grid AI Toolkit — new as of 2025
- MCP Server integration for AI-powered grid interactions
- Using AI to generate filter/sort commands via natural language
- Refer to official docs for current status: https://www.ag-grid.com/react-data-grid/ai-toolkit/

---

### 15.6 Sparklines (Community)

Mini charts inside cells:
- Install: `npm install ag-charts-community`
- `sparklineOptions` on a column:
  ```js
  {
    field: 'history',
    cellRenderer: 'agSparklineCellRenderer',
    cellRendererParams: {
      sparklineOptions: { type: 'line' }
    }
  }
  ```
- Types: `line`, `area`, `bar`, `column`
- Customization: colors, padding, tooltips, axis types
- Data format: array of numbers, or `[x, y]` pairs

---

### 15.7 Common Real-World Patterns

**Pattern 1: Editable Grid with Server Sync**
- `readOnlyEdit: true` + `onCellValueChanged` → collect changes → PATCH API on save

**Pattern 2: Dashboard Table**
- Status bar aggregations + pinned total row + sparkline column + conditional cell colors

**Pattern 3: File-System Tree**
- Tree Data + lazy loading children on expand + drag-to-move nodes

**Pattern 4: CRM Contact List**
- Client-side data + external filter panel + column state saved per user + export to CSV

**Pattern 5: Live Data Feed**
- SSRM or client-side + `applyTransactionAsync` + cell flash + WebSocket integration

**Pattern 6: Report Builder**
- Row grouping + aggregation + pivot + sidebar tool panel + export

**Pattern 7: Multi-Grid Dashboard**
- Aligned grids for synchronized scroll + individual filter/sort per grid

---

### 15.8 Common Pitfalls & How to Avoid Them

| Pitfall | Solution |
|---|---|
| Grid not visible | Ensure parent has explicit `height` |
| `gridApi` undefined | Only call after `onGridReady` |
| Columns reset on re-render | Memoize `columnDefs` with `useMemo` |
| Selection lost on filter | Use `getRowId` for stable identity |
| Sluggish on large data | Use `applyTransaction`, not full `rowData` replacement |
| Edit not working | Ensure `editable: true` AND `valueParser` returns correct type |
| Filter not clearing | Use `gridApi.resetColumnFilters()` |
| Height: auto breaking virtualization | Avoid `domLayout: 'autoHeight'` on large datasets |
| Memory leak | Call `gridApi.destroy()` on unmount if not using AgGridReact component |
| Custom renderer re-mounting excessively | Memoize component definition outside render function |

---

### 15.9 Debugging AG Grid

- Chrome DevTools: inspect DOM for `[role="row"]`, `[role="gridcell"]`
- AG Grid debug mode: `gridOptions.debug = true` (logs row model changes)
- `gridApi.getModel()` — inspect the current row model state
- React DevTools: check for unnecessary re-renders on the grid wrapper
- AG Grid GitHub issues: https://github.com/ag-grid/ag-grid/issues

---

### 15.10 Staying Current

- AG Grid changelog: https://www.ag-grid.com/changelog
- AG Grid pipeline (upcoming features): https://www.ag-grid.com/pipeline
- AG Grid blog: https://blog.ag-grid.com
- YouTube channel: https://youtube.com/c/ag-grid (official tutorials)
- Stack Overflow tag: `ag-grid`
- GitHub: https://github.com/ag-grid/ag-grid

---

## 📚 Learning Order Summary

```
Level 1  → Foundations & First Grid          (Days 1–2)
Level 2  → Columns In Depth                 (Days 3–5)
Level 3  → Rows In Depth                    (Days 6–8)
Level 4  → Cell Content & Rendering         (Days 9–12)
Level 5  → Filtering                        (Days 13–16)
Level 6  → Selection                        (Days 17–18)
Level 7  → Editing                          (Days 19–23)
Level 8  → Updating Data                    (Days 24–26)
Level 9  → Grid API & Events                (Days 27–30)
Level 10 → Theming & Styling                (Days 31–35)
Level 11 → Advanced Features                (Days 36–50)
Level 12 → Server-Side Data                 (Days 51–60)
Level 13 → Performance Optimization         (Days 61–65)
Level 14 → Testing & Best Practices         (Days 66–70)
Level 15 → Real-World Patterns & Mastery    (Days 71–90)
```

---

## 🛠️ Tools & Resources

| Resource | URL |
|---|---|
| Official Docs | https://www.ag-grid.com/react-data-grid/ |
| API Reference | https://www.ag-grid.com/react-data-grid/reference/ |
| Theme Builder | https://www.ag-grid.com/theme-builder/ |
| Live Examples | https://www.ag-grid.com/example/ |
| GitHub | https://github.com/ag-grid/ag-grid |
| Blog | https://blog.ag-grid.com |
| YouTube | https://youtube.com/c/ag-grid |
| Stack Overflow | https://stackoverflow.com/questions/tagged/ag-grid |
| CodeSandbox Starter | https://codesandbox.io/s/ag-grid-react-hello-world |

---

> **Final Note:** AG Grid Community Edition is extraordinarily powerful on its own. The Enterprise features (Server-Side pivot, Excel export, Row Grouping panel, Range Selection with fill handle, Set Filter, Rich Select) are worth knowing about — but everything in this roadmap is 100% free. Master this, and you'll be one of the most capable data grid developers anywhere.
