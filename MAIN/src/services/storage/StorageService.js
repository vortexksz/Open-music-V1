import fs from 'fs';
import path from 'path';

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file) {
    // Hapi menyimpan metadata di file.hapi
    const { filename } = file.hapi;
    const extension = path.extname(filename);
    const newFilename = `cover-${Date.now()}${extension}`;
    const filePath = path.join(this._folder, newFilename);

    const fileStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      file.on('error', (error) => reject(error));
      fileStream.on('error', (error) => reject(error));

      file.pipe(fileStream);

      file.on('end', () => {
        resolve(newFilename);
      });
    });
  }
}

export default StorageService;
