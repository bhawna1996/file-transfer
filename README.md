# file-transfer
Send file to client B to client B
-- Client A (Sender)

Split the 1 GB file into 100 MB chunks.
Calculate MD5 hash of each chunk.
Generate a manifest.json with filenames + hashes.
Send manifest and all chunks concurrently to Client B.

-- Client B (Receiver)

Receive manifest.
Accept concurrent chunk uploads.
For each chunk - Verify MD5 hash.
If failed, log and request re-transmission.

---Run the Project---
first run client B
- npm run build
- npm run start

and run client A 
- npm run build
- npm run send for clientA

There is one samplefile.dat which is saved inside client A. This file will send to Client B by running the CLIENT A server.
