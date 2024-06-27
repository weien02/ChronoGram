import { expect, test } from 'vitest'
import {
  usernameAlreadyExists,
  searchUid,
} from './authFunctions';


test('usernameAlreadyExists returns true if username exists', async () => {
  const mockUsername = 'chronogram';
  const result = await usernameAlreadyExists(mockUsername);
  expect(result).toBe(true);
});

test('usernameAlreadyExists returns false if username does not exist', async () => {
  const mockUsername = 'fakeUsername';
  const result = await usernameAlreadyExists(mockUsername);
  expect(result).toBe(false);
});

test('searchUid returns the correct UID for a given username', async () => {
  const mockUsername = 'chronogram';
  const result = await searchUid(mockUsername);
  expect(result).toBe('w9jGwdBNDUbezO88H8NsB5jiHgw1');
});
