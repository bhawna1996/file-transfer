import fs from 'fs';
import axios from 'axios';
import { chunkFile } from './utils/chunker';
import { generateManifest } from './utils/manifest';
import { uploadChunkWithRetry } from './utils/uploadChunksWithRetry';
import { log } from './utils/logger';
import path from 'path';

const SERVER_URL = 'http://localhost:3000'; // Receiver server (Client B)

async function run() {
  // const inputFile = './assets/Developer.dat';
  const inputFile = path.join(__dirname, '..', 'src', 'assets', 'Developer.pdf');
  console.log('Starting Client A (Sender)...', inputFile);

  if (!fs.existsSync(inputFile)) {
    console.error('Input file not found.');
    process.exit(1);
  }

  const originalFileName = path.basename(inputFile);
  const chunkDir = 'chunks';
  if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir);
  
  
  // Step 1: Chunk the file
  const chunkPaths = chunkFile(inputFile, chunkDir);
  log(`Split file into ${chunkPaths.length} chunks`);

  // Step 2: Create manifest
  const manifest = generateManifest(originalFileName, chunkDir, chunkPaths);
  fs.writeFileSync('manifest.json', JSON.stringify(manifest));
  log('Manifest file created and saved');

  // Step 3: Send manifest to Client B
  try {
    await axios.post(`${SERVER_URL}/manifest`, manifest);
    log('Manifest sent to Client B');
  } catch (err: any) {
    log(`Failed to send manifest: ${err.message}`);
    return;
  }

  // Step 4: Upload all chunks with retry logic
  await Promise.all(
    chunkPaths.map(chunkPath => uploadChunkWithRetry(chunkPath, SERVER_URL, log))
  );

  log('All chunks attempted.');
}

run();