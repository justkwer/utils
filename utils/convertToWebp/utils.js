import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/** Function to adjust quality based on file size */
export const adjustQuality = async ({
  inputFilePath,
  outputFilePath,
  maxFileSize,
  successConversion,
}) => {
  let quality = 100;
  let fileSize;

  do {
    await sharp(inputFilePath).webp({ quality }).toFile(outputFilePath);
    fileSize = fs.statSync(outputFilePath).size;

    if (quality > 1) {
      quality = quality > 5 ? quality - 5 : quality - 1;
    }

    if (quality <= 1) {
      break;
    }
  } while (fileSize > maxFileSize * 1024 && quality >= 1);

  successConversion(fileSize);
};

/** Function to clear the output directory */
export const clearOutputDirectory = async (outputDir) => {
  const files = await fs.promises.readdir(outputDir);

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(outputDir, file);
      await fs.promises.unlink(filePath);
      console.log(`Deleted: ${file}`);
    }),
  );
};
