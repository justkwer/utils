import readline from 'readline';

/** Set up readline for user input */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const defaultQuality = 80;
const defaultMaxFileSize = 512;

/** Function to ask for quality or max file size */
export const askUserInput = () => {
  console.log('Starting function convertToWebp');
  return new Promise((resolve) => {
    rl.question(
      'Quality or max file size? (q for quality, m for max file size) [default: q]: ',
      (choice) => {
        choice = choice.trim().toLowerCase() || 'q';
        if (choice === 'q') {
          rl.question(`Enter quality [default: ${defaultQuality}]: `, (answer) => {
            const value = answer.trim() || defaultQuality;
            resolve({ quality: parseInt(value, 10), maxFileSize: null });
            rl.close();
          });
        } else if (choice === 'm') {
          rl.question(`Enter max file size in KB [default: ${defaultMaxFileSize}]: `, (answer) => {
            const value = answer.trim() || defaultMaxFileSize;
            resolve({ quality: null, maxFileSize: parseInt(value, 10) });
            rl.close();
          });
        } else {
          console.error('Invalid choice. Please enter "q" for quality or "m" for max file size.');
          rl.close();
          resolve({ quality: null, maxFileSize: null });
        }
      },
    );
  });
};
