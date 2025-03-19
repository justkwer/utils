import { convertToWebp } from './convertToWebp/index.js';

const utils = async () => {
  const functionMap = {
    convertToWebp,
  };

  const functionToCall = process.argv[2];

  const selectedFunction = functionMap[functionToCall];

  if (selectedFunction) {
    await selectedFunction();
  } else {
    console.error(`Function ${functionToCall} not found.`);
  }
};

utils().catch((err) => console.error(err));
