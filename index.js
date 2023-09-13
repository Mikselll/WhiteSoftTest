import fs from 'fs';
import axios from 'axios';

const getData = async (replacementPath, fakeMessagesPath) => {
  const requestReplacement = fs.promises.readFile(replacementPath, "utf-8");
  const requestFakeMessages = axios.get(fakeMessagesPath);

  const [responseReplacement, responseFakeMessages] = await Promise.all([requestReplacement, requestFakeMessages]);
  const replacement = JSON.parse(responseReplacement);
  const fakeMessages = responseFakeMessages.data;

  return [replacement, fakeMessages];
};

const createCorrectMessageFile = async () => {
  const [replacement, fakeMessages] = await getData(process.argv[2], process.argv[3]);
  const replacementReverse = replacement.reverse();
  const correctMessages = [];
  fakeMessages.map((message) => {
    let correctMessage = message;
    replacementReverse.forEach((data) => {
      if (correctMessage.includes(data.replacement)) {
        correctMessage = correctMessage.replaceAll(data.replacement, data.source);
      }
    });
    if (correctMessage !== 'null') {
      correctMessages.push(correctMessage);
    }
  });
  await fs.promises.writeFile("result.json", JSON.stringify(correctMessages));
};

createCorrectMessageFile();