import { unlink, writeFile } from 'fs/promises';
import { unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { globSync } from 'glob';

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const PREFIX = 'playwright_locker_';

class Locker {
  public static clearAll() {
    globSync(join(tmpdir(), `${PREFIX}*.txt`)).forEach(unlinkSync);
  }

  constructor(private key: string) {}

  private get filePath() {
    return join(tmpdir(), `${PREFIX}${this.key}.txt`);
  }

  async lock() {
    try {
      await writeFile(this.filePath, '', { flag: 'wx' });
    } catch {
      await sleep(50);
      await this.lock();
    }
  }

  async release() {
    await unlink(this.filePath);
  }
}

export default Locker;
