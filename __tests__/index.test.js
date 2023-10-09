import { jest } from '@jest/globals';
import fs from 'node:fs/promises';
import axios from 'axios';
import createCorrectMessagesFile from '../index.js';

const readFileSpy = jest.spyOn(fs, 'readFile');
const writeFileSpy = jest.spyOn(fs, 'writeFile');
const axiosGetSpy = jest.spyOn(axios, 'get');

test('функция должна правильно создавать файл с корректными сообщениями', async () => {
  const replacementData = [
    { replacement: 'yellow', source: 'blue' },
    { replacement: 'red', source: 'green' },
  ];
  const fakeMessagesData = ['yellow car', 'red wood'];
  const resultData = ['blue car', 'green wood'];

  writeFileSpy.mockResolvedValue();
  readFileSpy.mockResolvedValue(JSON.stringify(replacementData));
  axiosGetSpy.mockResolvedValue({ data: fakeMessagesData });

  await createCorrectMessagesFile();

  expect(writeFileSpy).toHaveBeenCalledWith('result.json', JSON.stringify(resultData));
});

test('функция должна удалять неккоректное сообщение, когда source равен null', async () => {
  const replacementData = [{ replacement: 'car', source: null }];
  const fakeMessagesData = ['car'];
  const resultData = [];

  writeFileSpy.mockResolvedValue();
  readFileSpy.mockResolvedValue(JSON.stringify(replacementData));
  axiosGetSpy.mockResolvedValue({ data: fakeMessagesData });

  await createCorrectMessagesFile();

  expect(writeFileSpy).toHaveBeenCalledWith('result.json', JSON.stringify(resultData));
});

test('функция должна возвращать последнее встречающееся значение source, когда replacement повторяется больше 1 раза', async () => {
  const replacementData = [
    { replacement: 'red', source: 'green' },
    { replacement: 'red', source: 'blue' },
  ];
  const fakeMessagesData = ['red car'];
  const resultData = ['blue car'];

  writeFileSpy.mockResolvedValue();
  readFileSpy.mockResolvedValue(JSON.stringify(replacementData));
  axiosGetSpy.mockResolvedValue({ data: fakeMessagesData });

  await createCorrectMessagesFile();

  expect(writeFileSpy).toHaveBeenCalledWith('result.json', JSON.stringify(resultData));
});

test('функция должна правильно обрабатывать неккоректное сообщение, которое содержит несколько заменяемых подстрок', async () => {
  const replacementData = [
    { replacement: 'long', source: 'short' },
    { replacement: 'fake', source: 'true' },
  ];
  const fakeMessagesData = ['long fake message'];
  const resultData = ['short true message'];

  writeFileSpy.mockResolvedValue();
  readFileSpy.mockResolvedValue(JSON.stringify(replacementData));
  axiosGetSpy.mockResolvedValue({ data: fakeMessagesData });

  await createCorrectMessagesFile();

  expect(writeFileSpy).toHaveBeenCalledWith('result.json', JSON.stringify(resultData));
});

test('функция должна заменять все одинаковые неккоректные подстроки', async () => {
  const replacementData = [{ replacement: 'fake', source: 'true' }];
  const fakeMessagesData = ['fake message fake'];
  const resultData = ['true message true'];

  writeFileSpy.mockResolvedValue();
  readFileSpy.mockResolvedValue(JSON.stringify(replacementData));
  axiosGetSpy.mockResolvedValue({ data: fakeMessagesData });

  await createCorrectMessagesFile();

  expect(writeFileSpy).toHaveBeenCalledWith('result.json', JSON.stringify(resultData));
});
