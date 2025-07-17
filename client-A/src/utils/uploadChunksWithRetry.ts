import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

export async function uploadChunkWithRetry(chunkPath: string, serverUrl: string, log: Function) {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const form = new FormData();
      form.append('chunk', fs.createReadStream(chunkPath));
      form.append('chunkName', chunkPath);

      await axios.post(`${serverUrl}/upload`, form, {
        headers: form.getHeaders()
      });

      log(`Uploaded ${chunkPath}`);
      return;
    } catch (err: any) {
      log(`Failed to upload ${chunkPath} (Attempt ${attempt}): ${err.response?.statusText || err.message}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  log(`Giving up on ${chunkPath} after ${MAX_RETRIES} attempts`);
}