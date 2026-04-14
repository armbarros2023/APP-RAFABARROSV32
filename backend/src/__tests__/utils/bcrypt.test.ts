import assert from 'node:assert/strict';
import test from 'node:test';
import { setTestEnv } from '../helpers/testUtils';

setTestEnv();

const { comparePassword, hashPassword } = require('../../utils/bcrypt') as typeof import('../../utils/bcrypt');

test('hashPassword gera hash diferente do texto puro e comparePassword valida a senha correta', async () => {
    const plainPassword = 'SenhaForte@123';
    const hashedPassword = await hashPassword(plainPassword);

    assert.notEqual(hashedPassword, plainPassword);
    assert.equal(await comparePassword(plainPassword, hashedPassword), true);
});

test('comparePassword retorna false para senha incorreta', async () => {
    const hashedPassword = await hashPassword('SenhaCerta@123');

    assert.equal(await comparePassword('SenhaErrada@123', hashedPassword), false);
});
