import fs from 'node:fs/promises';
import axios from 'axios';

const getData = async (replacementPath, fakeMessagesPath) => {
  const requestReplacement = fs.readFile(replacementPath, "utf-8");
  const requestFakeMessages = axios.get(fakeMessagesPath);

  const [responseReplacement, responseFakeMessages] = await Promise.all([requestReplacement, requestFakeMessages]);
  const replacement = JSON.parse(responseReplacement);
  const fakeMessages = responseFakeMessages.data;

  return [replacement, fakeMessages];
};

const buildCorrectMessages = async (replacement, fakeMessages) => {
  const replacementReverse = replacement.reverse();
  const correctMessages = [];

  fakeMessages.forEach((message) => {
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

  return correctMessages;
}

const createCorrectMessagesFile = async () => {
  const [replacement, fakeMessages] = await getData('./replacement.json', 'https://raw.githubusercontent.com/thewhitesoft/student-2023-assignment/main/data.json');
  const correctMessages = await buildCorrectMessages(replacement, fakeMessages);

  await fs.writeFile("result.json", JSON.stringify(correctMessages));
};

createCorrectMessagesFile();

export default createCorrectMessagesFile;