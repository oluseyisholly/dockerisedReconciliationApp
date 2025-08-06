import * as fs from 'fs';
import * as path from 'path';

export function writeJsonFile(filename: string, data: any): string {
  const outputPath = path.join(
    process.cwd(),
    'storage',
    'json_reports',
    filename,
  );

  // Ensure the output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ JSON file saved to ${outputPath}`);

  return outputPath;
}
