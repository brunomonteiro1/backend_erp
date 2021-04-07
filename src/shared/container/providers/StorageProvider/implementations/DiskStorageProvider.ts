import fs from 'fs';
import path from 'path';
import fileConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class StorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(fileConfig.tmpDirectory, file),
      path.resolve(fileConfig.uploadDirectory, file)
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(fileConfig.uploadDirectory, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default StorageProvider;
