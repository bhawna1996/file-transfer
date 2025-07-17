import fs from 'fs';
import path from 'path';

const logFilePath = path.join(__dirname, '../../transfer.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

/**
 * Logs a message with timestamp to console and to transfer.log
 * @param message - The message to log
 */
export function log(message: string): void {
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] ${message}`;
  console.log(fullMessage);
  logStream.write(fullMessage + '\n');
}
