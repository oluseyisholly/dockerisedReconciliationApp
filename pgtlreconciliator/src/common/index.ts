import { join } from 'path';

export class StandardResopnse<T> {
  code: number;
  message: string;
  data: T;
}

export const FILE_UPLOADS_DIR = join(
  process.cwd(),
  'storage',
  'reconciliationFiles',
);

export type FilesTypes = {
  upload1: Express.Multer.File[];
  upload2: Express.Multer.File[];
};

export type ReconciliationreturnType = {
  missingInB: any[];
  missingInA: any[];
  mismatchedAmount: any[];
  mismatchedStatus: any[];
};

export type Transaction = {
  transactionId: string;
  timestamp: string;
  amount: string;
  currency: string;
  status: string;
};

export type ReconciliationJobType = {
  fileAPath: string;
  fileBPath: string;
  name: string;
};
