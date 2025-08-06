// utils/csv-parser.ts
import * as fs from 'fs';
import * as csvParser from 'csv-parser';

export function parseCsv(filePath: string): Promise<Map<string, any>> {
  return new Promise((resolve, reject) => {
    const transactionMap = new Map();

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        transactionMap.set(row.transactionId, row);
      })
      .on('end', () => resolve(transactionMap))
      .on('error', reject);
  });
}
