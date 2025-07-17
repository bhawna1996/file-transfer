import fs from 'fs';
import path from 'path';

export const reassembleFile = async (uploadDir: string, outputFilePath: string, manifest: any) => {
  const output = fs.createWriteStream(outputFilePath);
  for (const chunk of manifest.chunks) {
    const chunkPath = path.join(uploadDir, chunk.filename);
    const data = fs.readFileSync(chunkPath);
    output.write(data);
  }
  output.end();
};
