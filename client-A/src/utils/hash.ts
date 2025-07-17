import fs from 'fs';
import crypto from 'crypto';

export const hashFile = (filePath: string): string => {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(data).digest('hex');
};
