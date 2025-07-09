import fs from 'fs';
import { resolve } from 'path';
import micromatch from 'micromatch';

type SkipPattern = string | string[];
interface ScanDirectoryOptions {
  dirPrefix?: string;
  skip?: SkipPattern;
  skipInDest?: boolean;
}

export default class EsmInputBuilder {
  private input: Record<string, string> = {};
  private validFileExts = ['.ts'];
  private stripFileExts = ['.ts'];

  constructor(input: Record<string, string> = {}) {
    this.input = input;
  }

  scanDirectory(
    dir: string,
    options: ScanDirectoryOptions = {},
  ): EsmInputBuilder {
    const { dirPrefix = '', skip = [], skipInDest = false } = options;

    const fileDir = [dirPrefix, !skipInDest ? dir.split('/').pop() : '']
      .filter(Boolean)
      .join('/');

    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
      if (micromatch.some([fileDir, dirent.name], skip)) {
        return;
      }

      if (dirent.isDirectory()) {
        this.scanDirectory(resolve(dir, dirent.name), {
          dirPrefix: fileDir,
          skip,
        });
      } else if (dirent.isFile() && this.isValidFileExtension(dirent.name)) {
        const key = `${fileDir}/${this.stripFileExtension(dirent.name)}`;
        this.addFile(key, resolve(dir, dirent.name));
      }
    });

    return this;
  }

  addFile(key: string, path: string) {
    key = key.startsWith('/') ? key.slice(1) : key;

    if (this.input[key]) {
      return;
    }

    const pathIncluded = Object.values(this.input).some(
      (filePath) => filePath === path,
    );
    if (pathIncluded) {
      return;
    }

    this.input[key] = path;
  }

  build(): Record<string, string> {
    const input = { ...this.input };
    this.input = {};
    return input;
  }

  isValidFileExtension(fileName: string): boolean {
    return this.validFileExts.some((ext) => fileName.endsWith(ext));
  }

  stripFileExtension(fileName: string): string {
    return this.stripFileExts.reduce((name, ext) => {
      return name.endsWith(ext) ? name.slice(0, -ext.length) : name;
    }, fileName);
  }
}
