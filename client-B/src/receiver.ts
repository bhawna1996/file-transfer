import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { verifyChunk } from './utils/integrityCheck';
import { reassembleFile } from './utils/assemble';
import { log } from './utils/logger';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));


const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname); // keep chunk name like sample.dat.chunk0
  }
});
const upload = multer({ storage });

let manifest: any = null;


app.post('/manifest', (req: { body: any; }, res: { sendStatus: (arg0: number) => void; }) => {
  manifest = req.body;
  fs.writeFileSync('manifest.json', JSON.stringify(manifest));
  res.sendStatus(200);
});

app.post('/upload', upload.single('chunk'), (req, res) => {
  const chunk = req.file;

  if (!chunk) {
    log('No file uploaded');
    return res.status(400).send('No file uploaded.');
  }

  if (!manifest) {
    return res.status(400).send('Manifest not uploaded yet');
  }
  const expected = manifest.chunks.find((c: any) =>
    chunk.originalname === c.name
  );
  if (!expected) {
    log(`Unexpected chunk: ${chunk.originalname}`);
    return res.status(400).send('Chunk not listed in manifest');
  }

  const isValid = verifyChunk(chunk.path, expected.hash);

  if (!isValid) {
    console.error(`Chunk ${chunk.originalname} hash mismatch. Re-requesting...`);
    return res.status(400).send('Hash mismatch');
  }

  console.log(`Received and verified: ${chunk.originalname}`);
  res.sendStatus(200);
});

app.post('/reassemble', async (_req, res) => {
  try {
    await reassembleFile('uploads', 'output.dat', manifest);
    console.log('File reassembled successfully as uploads/output.dat');
    res.sendStatus(200);
  } catch (err) {
    console.error('Reassembly failed:', err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`Client B listening on port ${PORT}`));
