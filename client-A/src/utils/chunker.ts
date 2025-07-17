import fs from 'fs';
import path from 'path';

const CHUNK_SIZE = 100 * 1024 * 1024;

export function chunkFile(filePath: string, chunkDir: string): string[] {

  console.log(`chunkFile called with filePath=${filePath}, chunkDir=${chunkDir}`);

  const fileBuffer = fs.readFileSync(filePath);
  console.log(`fileBuffer length = ${fileBuffer.length}`);

  const fileName = path.basename(filePath);
  const totalChunks = Math.ceil(fileBuffer.length / CHUNK_SIZE);
  console.log(`totalChunks = ${totalChunks}`);

  const chunkPaths: string[] = [];
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, fileBuffer.length);
    const chunk = fileBuffer.slice(start, end);
    const chunkPath = path.join(chunkDir, `${fileName}.chunk${i}`);
    fs.writeFileSync(chunkPath, chunk);
    console.log(`wrote chunk ${i} => ${chunkPath} (${chunk.length} bytes)`);
    chunkPaths.push(chunkPath);
  }

  console.log('chunkPaths:', chunkPaths);
  return chunkPaths;
}
