/**
 * HTMLTableKit - A TypeScript library for managing HTML tables
 * Standalone Browser Version
 */
(function(global) {
    'use strict';
    
/**
 * HTMLTableKit - A TypeScript library for managing HTML tables
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class HTMLTableKit {
    constructor(tableId) {
        this.nextRowId = 0;
        const element = document.getElementById(tableId);
        if (!element) {
            throw new Error(`Table with id "${tableId}" not found`);
        }
        if (!(element instanceof HTMLTableElement)) {
            throw new Error(`Element with id "${tableId}" is not a table`);
        }
        this.tableElement = element;
        this.tableObject = this.parseTable();
    }
    /**
     * Parse the HTML table and create the table object
     */
    parseTable() {
        const tableObject = {
            id: this.tableElement.id || '',
            name: this.tableElement.getAttribute('name') || '',
            headers: [],
            hidden: {},
            rows: []
        };
        // Parse hidden inputs
        this.parseHiddenInputs(tableObject);
        // Parse headers
        this.parseHeaders(tableObject);
        // Parse rows
        this.parseRows(tableObject);
        return tableObject;
    }
    /**
     * Parse hidden inputs within the table
     */
    parseHiddenInputs(tableObject) {
        const hiddenInputs = this.tableElement.querySelectorAll('input[type="hidden"]');
        hiddenInputs.forEach((input) => {
            const htmlInput = input;
            const id = htmlInput.id || htmlInput.name;
            if (!id) {
                throw new Error('Hidden input found without id or name attribute');
            }
            tableObject.hidden[id] = htmlInput.value || htmlInput.textContent || '';
        });
    }
    /**
     * Parse table headers
     */
    parseHeaders(tableObject) {
        const headerRow = this.tableElement.querySelector('thead tr') ||
            this.tableElement.querySelector('tr:first-child');
        if (headerRow) {
            const headers = headerRow.querySelectorAll('th');
            if (headers.length > 0) {
                // Use th elements as headers
                headers.forEach((header, index) => {
                    var _a;
                    const headerText = ((_a = header.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || `column${index + 1}`;
                    tableObject.headers.push({
                        name: headerText.toLowerCase(),
                        type: 'string' // Will be determined later based on column data
                    });
                });
            }
            else {
                // Check if first row contains td elements that should be headers
                const firstRowCells = headerRow.querySelectorAll('td');
                if (firstRowCells.length > 0) {
                    // Determine if first row is header based on content
                    const isHeader = this.isRowHeader(firstRowCells);
                    if (isHeader) {
                        firstRowCells.forEach((cell, index) => {
                            var _a;
                            const headerText = ((_a = cell.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || `column${index + 1}`;
                            tableObject.headers.push({
                                name: headerText.toLowerCase(),
                                type: 'string'
                            });
                        });
                    }
                    else {
                        // Create numeric headers based on column count
                        this.createNumericHeaders(tableObject, firstRowCells.length);
                    }
                }
            }
        }
        else {
            // No rows found, create empty headers
            const firstDataRow = this.tableElement.querySelector('tbody tr, tr');
            if (firstDataRow) {
                const cellCount = firstDataRow.querySelectorAll('td, th').length;
                this.createNumericHeaders(tableObject, cellCount);
            }
        }
    }
    /**
     * Check if a row should be considered as header
     */
    isRowHeader(cells) {
        // Simple heuristic: if all cells contain non-numeric text, consider it a header
        return Array.from(cells).every(cell => {
            var _a;
            const text = ((_a = cell.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            return text !== '' && isNaN(Number(text));
        });
    }
    /**
     * Create numeric headers
     */
    createNumericHeaders(tableObject, count) {
        for (let i = 0; i < count; i++) {
            tableObject.headers.push({
                name: `column${i + 1}`,
                type: 'string'
            });
        }
    }
    /**
     * Parse table rows
     */
    parseRows(tableObject) {
        const tbody = this.tableElement.querySelector('tbody');
        const rows = tbody ? tbody.querySelectorAll('tr') : this.tableElement.querySelectorAll('tr');
        // Skip header row if it exists
        const startIndex = this.hasHeaderRow() ? 1 : 0;
        const dataRows = Array.from(rows).slice(startIndex);
        const columnData = tableObject.headers.map(() => []);
        // Collect all data first to determine column types
        dataRows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td, th');
            cells.forEach((cell, colIndex) => {
                var _a;
                if (colIndex < columnData.length) {
                    columnData[colIndex].push(((_a = cell.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '');
                }
            });
        });
        // Determine column types
        tableObject.headers.forEach((header, index) => {
            header.type = this.detectColumnType(columnData[index]);
        });
        // Parse rows with determined types
        dataRows.forEach((row, rowIndex) => {
            const rowObject = {
                id: this.generateRowId(row, rowIndex)
            };
            const cells = row.querySelectorAll('td, th');
            cells.forEach((cell, colIndex) => {
                var _a;
                if (colIndex < tableObject.headers.length) {
                    const header = tableObject.headers[colIndex];
                    const value = ((_a = cell.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                    rowObject[header.name] = this.parseValue(value, header.type);
                }
            });
            tableObject.rows.push(rowObject);
        });
    }
    /**
     * Check if table has a header row
     */
    hasHeaderRow() {
        const thead = this.tableElement.querySelector('thead');
        if (thead)
            return true;
        const firstRow = this.tableElement.querySelector('tr:first-child');
        if (firstRow) {
            const headers = firstRow.querySelectorAll('th');
            if (headers.length > 0)
                return true;
            // Check if first row looks like headers
            const cells = firstRow.querySelectorAll('td');
            return this.isRowHeader(cells);
        }
        return false;
    }
    /**
     * Generate row ID
     */
    generateRowId(row, index) {
        // Check if row has data-id attribute
        const dataId = row.getAttribute('data-id');
        if (dataId)
            return dataId;
        // Use index-based ID
        const id = `row_${index}`;
        this.nextRowId = Math.max(this.nextRowId, index + 1);
        return id;
    }
    /**
     * Detect column type based on all values in the column
     */
    detectColumnType(values) {
        if (values.length === 0)
            return 'string';
        // Check if all values are empty or contain HTML/complex content
        const hasComplexContent = values.some(value => {
            return value.includes('<') || value.includes('>') || value.length > 100;
        });
        if (hasComplexContent)
            return 'free';
        // Check if all values are boolean
        const booleanValues = ['true', 'false'];
        const allBoolean = values.every(value => value === '' || booleanValues.includes(value.toLowerCase()));
        if (allBoolean)
            return 'boolean';
        // Check if all values are numeric
        const numericValues = values.filter(value => value !== '');
        if (numericValues.length === 0)
            return 'string';
        const allNumeric = numericValues.every(value => !isNaN(Number(value)));
        if (!allNumeric)
            return 'string';
        // Distinguish between integer and decimal
        const hasDecimal = numericValues.some(value => value.includes('.'));
        return hasDecimal ? 'decimal' : 'number';
    }
    /**
     * Parse value based on type
     */
    parseValue(value, type) {
        switch (type) {
            case 'number':
                return value === '' ? null : parseInt(value, 10);
            case 'decimal':
                return value === '' ? null : parseFloat(value);
            case 'boolean':
                return value.toLowerCase() === 'true';
            case 'free':
            case 'string':
            default:
                return value;
        }
    }
    /**
     * Get the table object
     */
    getTable() {
        return this.tableObject;
    }
    /**
     * Add a new row to the table (synchronous version)
     */
    addRow(rowData) {
        const newRow = Object.assign({ id: rowData.id || `row_${this.nextRowId++}` }, rowData);
        // Fill missing columns with default values
        this.tableObject.headers.forEach(header => {
            if (!(header.name in newRow)) {
                newRow[header.name] = this.getDefaultValue(header.type);
            }
        });
        // Add to table object
        this.tableObject.rows.push(newRow);
        // Add to DOM
        this.addRowToDOM(newRow);
        return newRow;
    }
    /**
     * Add a new row to the table (async version)
     */
    addRowAsync(rowData, beforeAdd) {
        return __awaiter(this, void 0, void 0, function* () {
            const newRow = Object.assign({ id: rowData.id || `row_${this.nextRowId++}` }, rowData);
            // Fill missing columns with default values
            this.tableObject.headers.forEach(header => {
                if (!(header.name in newRow)) {
                    newRow[header.name] = this.getDefaultValue(header.type);
                }
            });
            // Call the async callback if provided
            if (beforeAdd) {
                const result = yield beforeAdd(newRow);
                if (!result) {
                    // If callback returns null, cancel the operation
                    return null;
                }
                // Update newRow with any changes from the callback
                Object.assign(newRow, result);
            }
            // Add to table object
            this.tableObject.rows.push(newRow);
            // Add to DOM
            this.addRowToDOM(newRow);
            return newRow;
        });
    }
    /**
     * Update an existing row (synchronous version)
     */
    updateRow(id, updates) {
        const rowIndex = this.tableObject.rows.findIndex(row => row.id === id);
        if (rowIndex === -1) {
            return false;
        }
        // Update table object
        const row = this.tableObject.rows[rowIndex];
        Object.assign(row, updates);
        // Update DOM
        this.updateRowInDOM(row, rowIndex);
        return true;
    }
    /**
     * Update an existing row (async version)
     */
    updateRowAsync(id, updates, beforeUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const rowIndex = this.tableObject.rows.findIndex(row => row.id === id);
            if (rowIndex === -1) {
                return false;
            }
            const row = this.tableObject.rows[rowIndex];
            // Call the async callback if provided
            if (beforeUpdate) {
                const result = yield beforeUpdate(row, updates);
                if (!result) {
                    // If callback returns null, cancel the operation
                    return false;
                }
                // Use the result from the callback
                updates = result;
            }
            // Update table object
            Object.assign(row, updates);
            // Update DOM
            this.updateRowInDOM(row, rowIndex);
            return true;
        });
    }
    /**
     * Delete a row (synchronous version)
     */
    deleteRow(id) {
        const rowIndex = this.tableObject.rows.findIndex(row => row.id === id);
        if (rowIndex === -1) {
            return false;
        }
        // Remove from table object
        this.tableObject.rows.splice(rowIndex, 1);
        // Remove from DOM
        this.deleteRowFromDOM(rowIndex);
        return true;
    }
    /**
     * Delete a row (async version)
     */
    deleteRowAsync(id, beforeDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            const rowIndex = this.tableObject.rows.findIndex(row => row.id === id);
            if (rowIndex === -1) {
                return false;
            }
            const row = this.tableObject.rows[rowIndex];
            // Call the async callback if provided
            if (beforeDelete) {
                const shouldDelete = yield beforeDelete(row);
                if (!shouldDelete) {
                    // If callback returns false, cancel the operation
                    return false;
                }
            }
            // Remove from table object
            this.tableObject.rows.splice(rowIndex, 1);
            // Remove from DOM
            this.deleteRowFromDOM(rowIndex);
            return true;
        });
    }
    /**
     * Get default value for a data type
     */
    getDefaultValue(type) {
        switch (type) {
            case 'number':
                return 0;
            case 'decimal':
                return 0.0;
            case 'boolean':
                return false;
            case 'free':
            case 'string':
            default:
                return '';
        }
    }
    /**
     * Add row to DOM
     */
    addRowToDOM(row) {
        const tbody = this.tableElement.querySelector('tbody') || this.tableElement;
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', row.id);
        this.tableObject.headers.forEach(header => {
            const td = document.createElement('td');
            const value = row[header.name];
            if (header.type === 'free') {
                td.innerHTML = value;
            }
            else {
                td.textContent = String(value);
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }
    /**
     * Update row in DOM
     */
    updateRowInDOM(row, rowIndex) {
        const tbody = this.tableElement.querySelector('tbody') || this.tableElement;
        const rows = tbody.querySelectorAll('tr');
        const startIndex = this.hasHeaderRow() ? 1 : 0;
        const domRow = rows[startIndex + rowIndex];
        if (!domRow)
            return;
        const cells = domRow.querySelectorAll('td, th');
        this.tableObject.headers.forEach((header, index) => {
            if (cells[index]) {
                const value = row[header.name];
                if (header.type === 'free') {
                    cells[index].innerHTML = value;
                }
                else {
                    cells[index].textContent = String(value);
                }
            }
        });
    }
    /**
     * Delete row from DOM
     */
    deleteRowFromDOM(rowIndex) {
        const tbody = this.tableElement.querySelector('tbody') || this.tableElement;
        const rows = tbody.querySelectorAll('tr');
        const startIndex = this.hasHeaderRow() ? 1 : 0;
        const domRow = rows[startIndex + rowIndex];
        if (domRow) {
            domRow.remove();
        }
    }
    /**
     * Refresh the table object from DOM
     */
    refresh() {
        this.tableObject = this.parseTable();
    }
}
// Export for use in browser
if (typeof window !== 'undefined') {
    window.HTMLTableKit = HTMLTableKit;
}

//# sourceMappingURL=HTMLTableKit.js.map
    
    // Expose to global scope
    global.HTMLTableKit = HTMLTableKit;
    
})(typeof window !== 'undefined' ? window : this);
