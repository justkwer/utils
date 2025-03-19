import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { askUserInput } from './script.js';
import { adjustQuality, clearOutputDirectory } from './utils.js';

const validExtensions = ['.jpg', '.jpeg', '.png'];

/** Convert files in input folder to output folder in WebP format */
export const convertToWebp = async () => {
  const { quality, maxFileSize } = await askUserInput();

  if (quality === null && maxFileSize === null) {
    console.error('No valid input provided. Exiting.');
    return;
  }

  const inputDir = path.join(process.cwd(), 'input');
  const outputDir = path.join(process.cwd(), 'output');

  // Clearing the output folder before starting the conversion
  await clearOutputDirectory(outputDir);

  // Read files from input folder
  fs.readdir(inputDir, (err, files) => {
    if (err) {
      console.error('Error reading input folder:', err);

      return;
    }

    if (files.length === 0) {
      console.log('No files found in input folder');

      return;
    }

    const totalFiles = files.length;
    let processedFiles = 0;

    console.log('Conversion started');

    const conversionPromises = files.map((file) => {
      const inputFilePath = path.join(inputDir, file);
      const outputFilePath = path.join(outputDir, `${path.parse(file).name}.webp`);
      const fileExtension = path.extname(file).toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        console.log(`Skipping non-image file: ${file}`);

        return Promise.resolve();
      }

      return sharp(inputFilePath)
        .rotate()
        .webp({ quality: quality !== null ? quality : 100 })
        .toFile(outputFilePath)
        .then(async () => {
          // Check file size and adjust quality if needed
          let fileSize = fs.statSync(outputFilePath).size;
          const successConversion = (fileSize) => {
            // Delete the original file if conversion was successful
            fs.unlinkSync(inputFilePath);
            // Update and console percentage
            processedFiles++;
            const percentage = ((processedFiles / totalFiles) * 100).toFixed(2);
            console.log(
              `Conversion successful: ${file} -${Math.round(fileSize / 1024)}kB - ${percentage}% completed`,
            );
          };

          if (maxFileSize !== null && fileSize > maxFileSize * 1024) {
            await adjustQuality({
              inputFilePath,
              outputFilePath,
              maxFileSize,
              successConversion,
            });
          } else {
            successConversion(fileSize);
          }
        })
        .catch((err) => {
          console.error(`Error converting: ${file}:`, err.message);
          // Delete the file if it was created (invalid file)
          if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
          }
        });
    });

    // Wait for all promises to complete
    Promise.all(conversionPromises)
      .then(() => {
        console.log('Conversion completed');
      })
      .catch((err) => {
        console.error('Error during conversion:', err);
      });
  });
};
