# HTMLTableKit

HTMLTableKit is a pure JavaScript library to handle HTML Tables programatically
instead of having to query HTML elements all the time.

# Why?

Becasue not everything is solved via SPAs and not everything requires 1k+ dependencies
from NPM. Seriously now, we had projects in the past that had certain limitations
that made using a framework or NPM a problem to the project and we had to code
directly in JavaScript.

# Features

- **Automatic Table Parsing**: Converts HTML tables into structured JavaScript objects
- **Type Detection**: Automatically detects column data types (string, number, decimal, boolean, free)
- **Hidden Input Support**: Captures hidden inputs within tables
- **CRUD Operations**: Add, update, and delete rows programmatically
- **Async CRUD Operations**: Add, update, and delete rows programmatically asynchronously
- **DOM Synchronization**: Changes to the data are reflected in the DOM
- **Header Detection**: Automatically detects table headers or creates numeric column names
- **Row ID Management**: Automatic ID generation or custom ID support

### Data Types

The library automatically detects the following data types for columns:

- **string**: Text content
- **number**: Integer values
- **decimal**: Floating-point numbers
- **boolean**: true/false values
- **free**: Complex content (HTML, buttons, etc.)

# What is in the dist/ directory?

### TypeScript Support (Important for TypeScript users!)

- __`HTMLTableKit.d.ts`__ - TypeScript type definitions. This allows TypeScript users to import your library with full type support and IntelliSense.
- __`HTMLTableKit.d.ts.map`__ - Source map for debugging TypeScript types.

### ES6 Module Version

- __`HTMLTableKit.js`__ - Main ES6 module (17KB)
- __`HTMLTableKit.min.js`__ - Minified ES6 module (6.2KB)
- __`HTMLTableKit.js.map`__ & __`HTMLTableKit.min.js.map`__ - Source maps for debugging

### Standalone Browser Version

- __`HTMLTableKit.standalone.js`__ - Full browser version (17.3KB)
- __`HTMLTableKit.standalone.min.js`__ - Minified browser version (6.3KB)
- __`HTMLTableKit.standalone.min.js.map`__ - Source map


# How to use the library

### For TypeScript Projects
```typescript
import HTMLTableKit from 'htmltablekit';
```
The TypeScript compiler will automatically use `HTMLTableKit.d.ts` for types.

### For Modern JavaScript (with bundlers like Webpack, Vite, etc.)
```javascript
// Development
import HTMLTableKit from './dist/HTMLTableKit.js'; // Or a CDN or local path
// Production
import HTMLTableKit from './dist/HTMLTableKit.min.js'; // Or a CDN or local path
```

### For Direct Browser Usage (no build tools)
```html
<!-- Development -->
<script src="dist/HTMLTableKit.standalone.js"></script>
<!-- Production -->
<script src="dist/HTMLTableKit.standalone.min.js"></script>
<script>
  const tableKit = new HTMLTableKit('myTableID');
</script>
```


### Get the table information

```javascript
// Get the table object
const tableData = tableKit.getTable();
console.log(tableData);

// Example output
 {
  "id": "employeeTable",
  "name": "Employee Records",
  "headers": [
    {
      "name": "header1",
      "type": "string"
    },
    {
      "name": "header2",
      "type": "number"
    },
    {
      "name": "header3",
      "type": "boolean"
    },
  ],
  "hidden": {
    "tableVersion": "1.0",
    "lastUpdated": "2025-01-03"
  },
  "rows": [
    {
      "id": "emp1",
      "header1": "Jane Smith",
      "header2": 25,
      "header3": true,
    },
    {
      "id": "emp2",
      "header1": "Bob Johnson",
      "header2": 44,
      "header3": false,
    },
  ]
}
```

### Synchronous Operations

#### Add a Row
```javascript
const newRow = tableKit.addRow({
  name: "John Doe",
  age: 30,
  salary: 50000.50,
  active: true
});
```

#### Update a Row
```javascript
// Update specific fields of a row by ID
const success = tableKit.updateRow("row_1", {
  salary: 55000.00
});
```

#### Delete a Row
```javascript
const success = tableKit.deleteRow("row_1");
```

### Async Operations (with API integration)

The library provides async versions of all CRUD operations that allow you to integrate with APIs or perform validation before updating the DOM.

#### Async Add with API Call
```javascript
const newRow = await tableKit.addRowAsync(
  { name: "John", age: 30, salary: 50000 },
  async (row) => {
    // Make API call to save the row
    const response = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });
    
    if (!response.ok) {
      return null; // Cancel the operation
    }
    
    // Return the saved data (may include server-generated ID)
    const savedEmployee = await response.json();
    return savedEmployee;
  }
);
```

#### Async Update with Validation
```javascript
const success = await tableKit.updateRowAsync(
  "row_1",
  { salary: 55000 },
  async (currentRow, updates) => {
    // Validate the update on the server
    const response = await fetch(`/api/employees/${currentRow.id}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      return null; // Cancel if validation fails
    }
    
    return updates; // Proceed with the update
  }
);
```

#### Async Delete with Confirmation
```javascript
const success = await tableKit.deleteRowAsync(
  "row_1",
  async (row) => {
    // Delete from server first
    const response = await fetch(`/api/employees/${row.id}`, {
      method: 'DELETE'
    });
    
    // Only delete locally if server deletion succeeds
    return response.ok;
  }
);
```

### Refresh Table

To re-parse the table from the DOM:
```javascript
tableKit.refresh();
```

# How to build the library

- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:all` - Build all versions (ES6, standalone, and minified)
- `npm run build:standalone` - Create standalone browser version
- `npm run build:minify` - Create minified versions
- `npm run build:watch` - Watch mode for development
- `npm run clean` - Clean the dist directory
- `npm run demo` - Build all and start local server

# HTMLTableKit API Reference

## Constructor

| Method | Arguments | Description |
|--------|-----------|-------------|
| `new HTMLTableKit()` | `tableId: string` | Creates a new instance for the specified table ID |

## Core Methods

| Method | Arguments | Returns | Description |
|--------|-----------|---------|-------------|
| `getTable()` | none | `TableObject` | Returns the parsed table object with all data |
| `refresh()` | none | `void` | Re-parses the table from the DOM |

## Synchronous CRUD Methods

| Method | Arguments | Returns | Description |
|--------|-----------|---------|-------------|
| `addRow()` | `rowData: Partial<TableRow>` | `TableRow` | Adds a new row and returns it |
| `updateRow()` | `id: string, updates: Partial<TableRow>` | `boolean` | Updates a row by ID |
| `deleteRow()` | `id: string` | `boolean` | Deletes a row by ID |

## Async CRUD Methods

| Method | Arguments | Returns | Description |
|--------|-----------|---------|-------------|
| `addRowAsync()` | `rowData: Partial<TableRow>, beforeAdd?: (row: TableRow) => Promise<TableRow \| null>` | `Promise<TableRow \| null>` | Adds row with async callback for API integration |
| `updateRowAsync()` | `id: string, updates: Partial<TableRow>, beforeUpdate?: (row: TableRow, updates: Partial<TableRow>) => Promise<Partial<TableRow> \| null>` | `Promise<boolean>` | Updates row with async validation |
| `deleteRowAsync()` | `id: string, beforeDelete?: (row: TableRow) => Promise<boolean>` | `Promise<boolean>` | Deletes row with async confirmation |

## Type Definitions

```typescript
interface TableObject {
  id: string;
  name: string;
  headers: TableHeader[];
  hidden: { [key: string]: string };
  rows: TableRow[];
}

interface TableHeader {
  name: string;
  type: 'string' | 'number' | 'decimal' | 'boolean' | 'free';
}

interface TableRow {
  id: string;
  [key: string]: any; // Dynamic column values
}
