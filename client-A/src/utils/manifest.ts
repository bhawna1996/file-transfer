import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export function generateManifest(fileName: string, chunkDir: string, chunkPaths: string[]) {
  return {
    fileName,
    totalChunks: chunkPaths.length,
    chunks: chunkPaths.map(chunkPath => {
      const data = fs.readFileSync(chunkPath);
      const hash = crypto.createHash('md5').update(data).digest('hex');

      return {
        name: path.basename(chunkPath),
        path: chunkPath,
        size: data.length,
        hash
      };
    })
  };
}
