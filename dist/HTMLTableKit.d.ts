/**
 * HTMLTableKit - A TypeScript library for managing HTML tables
 */
type DataType = 'string' | 'number' | 'decimal' | 'boolean' | 'free';
interface HiddenInput {
    [key: string]: string;
}
interface TableHeader {
    name: string;
    type: DataType;
}
interface TableRow {
    id: string;
    [key: string]: any;
}
interface TableObject {
    id: string;
    name: string;
    headers: TableHeader[];
    hidden: HiddenInput;
    rows: TableRow[];
}
declare class HTMLTableKit {
    private tableElement;
    private tableObject;
    private nextRowId;
    constructor(tableId: string);
    /**
     * Parse the HTML table and create the table object
     */
    private parseTable;
    /**
     * Parse hidden inputs within the table
     */
    private parseHiddenInputs;
    /**
     * Parse table headers
     */
    private parseHeaders;
    /**
     * Check if a row should be considered as header
     */
    private isRowHeader;
    /**
     * Create numeric headers
     */
    private createNumericHeaders;
    /**
     * Parse table rows
     */
    private parseRows;
    /**
     * Check if table has a header row
     */
    private hasHeaderRow;
    /**
     * Generate row ID
     */
    private generateRowId;
    /**
     * Detect column type based on all values in the column
     */
    private detectColumnType;
    /**
     * Parse value based on type
     */
    private parseValue;
    /**
     * Get the table object
     */
    getTable(): TableObject;
    /**
     * Add a new row to the table (synchronous version)
     */
    addRow(rowData: Partial<TableRow>): TableRow;
    /**
     * Add a new row to the table (async version)
     */
    addRowAsync(rowData: Partial<TableRow>, beforeAdd?: (row: TableRow) => Promise<TableRow | null>): Promise<TableRow | null>;
    /**
     * Update an existing row (synchronous version)
     */
    updateRow(id: string, updates: Partial<TableRow>): boolean;
    /**
     * Update an existing row (async version)
     */
    updateRowAsync(id: string, updates: Partial<TableRow>, beforeUpdate?: (row: TableRow, updates: Partial<TableRow>) => Promise<Partial<TableRow> | null>): Promise<boolean>;
    /**
     * Delete a row (synchronous version)
     */
    deleteRow(id: string): boolean;
    /**
     * Delete a row (async version)
     */
    deleteRowAsync(id: string, beforeDelete?: (row: TableRow) => Promise<boolean>): Promise<boolean>;
    /**
     * Get default value for a data type
     */
    private getDefaultValue;
    /**
     * Add row to DOM
     */
    private addRowToDOM;
    /**
     * Update row in DOM
     */
    private updateRowInDOM;
    /**
     * Delete row from DOM
     */
    private deleteRowFromDOM;
    /**
     * Refresh the table object from DOM
     */
    refresh(): void;
}
export default HTMLTableKit;
//# sourceMappingURL=HTMLTableKit.d.ts.map