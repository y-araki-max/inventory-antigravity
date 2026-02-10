
// Simple CSV Parser that handles quoted values and newlines
function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let insideQuote = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuote && nextChar === '"') {
                // Escaped quote
                currentCell += '"';
                i++;
            } else {
                // Toggle quote
                insideQuote = !insideQuote;
            }
        } else if (char === ',' && !insideQuote) {
            // End of cell
            currentRow.push(currentCell.trim()); // Trim whitespace? Maybe not for strict parsing but usually safer.
            currentCell = '';
        } else if ((char === '\r' || char === '\n') && !insideQuote) {
            // End of row
            if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
            currentRow.push(currentCell.trim());
            rows.push(currentRow);
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }
    // Push last row
    if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
    }
    return rows;
}

export const parseInventoryCSV = (csvContent, products) => {
    const rows = parseCSV(csvContent);
    const result = {};

    if (rows.length < 50) return result; // Not enough data?

    // The CSV has blocks of 7 columns per product.
    // We scan horizontally.
    const maxCols = rows[10]?.length || 0; // Check a row with data to guess width

    for (let col = 0; col < maxCols; col += 7) {
        // 1. Identify Product
        // Look at the first few rows in this block (Col 0..6 relative)
        let productName = null;
        let productId = null;

        // Header check strategy: Rows 0-5
        for (let r = 0; r <= 6; r++) {
            if (!rows[r]) continue;
            // Check the first column of the block and the merged cells might be anywhere
            const cell = rows[r][col];
            if (!cell) continue;

            // Clean up: remove newlines, "マルチビタミン＆ミネラル" prefix if redundant
            const cleanName = cell.replace(/[\r\n]+/g, '').replace('マルチビタミン＆ミネラル', '').trim();
            if (!cleanName) continue;

            // Try to match with PRODUCTS
            const matched = products.find(p =>
                p.name === cleanName ||
                p.fullName === cleanName ||
                p.name === cell.trim() || // Raw match
                p.fullName.includes(cleanName) // Fuzzy name
            );

            if (matched) {
                productId = matched.id;
                productName = matched.name;
                break;
            }
        }

        if (!productId) continue; // Skip if no product found in this block

        // 2. Extract Data
        // Initial Stock: Row 58 (approximately), Column index 5 (Stock column)
        // We look for the row where column 0 is "31" (Date)
        // Actually, let's find the "31" row.
        let jan31RowIndex = -1;
        for (let r = 20; r < rows.length; r++) {
            if (rows[r] && rows[r][col] === '31') {
                jan31RowIndex = r;
                break;
            }
        }

        let initialStock = 0;
        if (jan31RowIndex !== -1) {
            const stockVal = rows[jan31RowIndex][col + 5]; // 6th column in block
            initialStock = parseInt(stockVal?.replace(/,/g, '') || '0');
        }

        // History: Rows 11-16 (Fixed positions?)
        // Row 11: 2025年7月...
        // Format of history cell: "2025年7月出庫" in Col 0, Value in Col 2?
        // Let's look at the CSV format again. 
        // Row 11: "2025年7月出庫",,,"1326",,"22"
        // Col indices relative to block: 0, 1, 2, 3(Out), 4, 5(Sample).
        // Wait, "2025年7月出庫" is in Col 0. 
        // Col 3 seems to be '販売数' (Sales/Out), Col 5 is 'サンプル' (Sample).
        // Let's extract total Out (Sales + Sample) for history.
        const history = [];
        for (let r = 10; r <= 15; r++) { // Rows 11-16 (0-indexed 10-15)
            if (!rows[r]) continue;
            const label = rows[r][col]; // e.g. "2025年7月出庫"
            const outVal = parseInt(rows[r][col + 3]?.replace(/,/g, '') || '0');
            const sampleVal = parseInt(rows[r][col + 5]?.replace(/,/g, '') || '0');

            if (label && label.includes('年')) {
                history.push({
                    month: label.replace('出庫', '').trim(),
                    out: outVal,
                    sample: sampleVal,
                    total: outVal + sampleVal
                });
            }
        }

        // Current Month (Jan) Total
        // Sum of Daily Out + Sample
        let janOut = 0;
        let janSample = 0;
        // Start from row 28 (Date 1) to jan31RowIndex
        const startDayRow = jan31RowIndex - 30; // approx
        for (let r = startDayRow; r <= jan31RowIndex; r++) {
            if (!rows[r]) continue;
            // Check if valid date row (Col 0 is number)
            const dateNum = parseInt(rows[r][col]);
            if (isNaN(dateNum)) continue;

            // Col 3: Out, Col 4: Sample?
            // Header says: 1月,,入庫,出庫,サンプル,在庫
            // Indices: 0, 1, 2, 3, 4, 5
            const dOut = parseInt(rows[r][col + 3]?.replace(/,/g, '') || '0');
            const dSample = parseInt(rows[r][col + 4]?.replace(/,/g, '') || '0');

            janOut += dOut;
            janSample += dSample;
        }

        // Add Jan to history?
        history.push({
            month: '2026年1月',
            out: janOut,
            sample: janSample,
            total: janOut + janSample
        });

        // Reorder Point: Row 8 "発注点"
        // Row 8: "発注点",,,"7700" (Col 3)
        let reorderPoint = 0;
        if (rows[7] && rows[7][col]?.includes('発注点')) {
            reorderPoint = parseInt(rows[7][col + 3]?.replace(/,/g, '') || '0');
        }

        // Average Out: Row 9 "平均出庫"
        let averageOut = 0;
        if (rows[8] && rows[8][col]?.includes('平均出庫')) {
            averageOut = parseInt(rows[8][col + 3]?.replace(/,/g, '') || '0');
        }

        result[productId] = {
            name: productName,
            initialStock, // Jan 31st stock
            history,
            reorderPoint,
            averageOut
        };
    }

    return result;
};
