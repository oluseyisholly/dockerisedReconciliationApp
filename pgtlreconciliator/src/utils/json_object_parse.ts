import * as fs from 'fs';
import path from 'path';
import { ReconciliationreturnType } from 'src/common';

export function readJsonArray(filePath: string): ReconciliationreturnType {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}
