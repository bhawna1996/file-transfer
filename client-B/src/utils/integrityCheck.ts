import crypto from 'crypto';
import fs from 'fs';

export const verifyChunk = (filePath: string, expectedHash: string): boolean => {
  const data = fs.readFileSync(filePath);
  const actualHash = crypto.createHash('md5').update(data).digest('hex');
  return actualHash === expectedHash;
};
