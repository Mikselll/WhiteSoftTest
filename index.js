//Импортируем библиотеки для извлечения данных
import fs from 'fs';
import axios from 'axios';

//Реализовать функцию получения данных
const getData = async (replacementPath, fakeMessagesPath) => {

  //Сделать запросы на получение данных
  const requestReplacement = fs.promises.readFile(replacementPath, "utf-8");
  const requestFakeMessages = axios.get(fakeMessagesPath);

  //Передать промисы в promise.all и получить данные
  const [responseReplacement, responseFakeMessages] = await Promise.all([requestReplacement, requestFakeMessages]);

  //Парсим и получаем данные, с которыми можно работать
  const replacement = JSON.parse(responseReplacement);
  const fakeMessages = responseFakeMessages.data; 

  //Возвращаем данные, используя деструктуризацию
  return [replacement, fakeMessages];
};

//Реализовать функцию построения корректных сообщений
const buildCorrectMessages = async (replacement, fakeMessages) => {

  //Перевернуть массив replacement, тк по условию нужно использовать последнее встречающееся значение source
  const replacementReverse = replacement.reverse();

  //Создать пустой массив, в который мы будем закидывать корректные сообщения 
  const correctMessages = [];

  //Получить корректные сообщения путем перебора двух массивов 
  fakeMessages.forEach((message) => {
    
    //Создать переменную, которая будет изначально содержать значение фейкового сообщения. Делаем через let, потому что будем менять значение, пока оно не станет корректным
    let correctMessage = message;
    replacementReverse.forEach((data) => {

      //Сделать условие, при котором будем меняться переменная correctMessage
      if (correctMessage.includes(data.replacement)) {
        correctMessage = correctMessage.replaceAll(data.replacement, data.source);
      }
    });

    //Сделать проверку на null, тк по условию, если source null, то сообщения изначально не было
    if (correctMessage !== 'null') {
      correctMessages.push(correctMessage);
    }
  });

  //Вернуть корректные сообщения
  return correctMessages;
}

//Реализовать функцию, которая будет создавать новый файл result.json с корректными сообщениями
const createCorrectMessagesFile = async () => {

  //Получить данные, используя функцию getData
  const [replacement, fakeMessages] = await getData(process.argv[2], process.argv[3]);

  //Получить корректные сообщения, используя функцию buildCorrectMessages
  const correctMessages = await buildCorrectMessages(replacement, fakeMessages);

  //Создать и записать данные в result.json
  await fs.promises.writeFile("result.json", JSON.stringify(correctMessages));
};

// Вызвать функцию createCorrectMessagesFile
createCorrectMessagesFile();
