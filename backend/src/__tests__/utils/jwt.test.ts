import assert from 'node:assert/strict';
import test from 'node:test';
import { setTestEnv } from '../helpers/testUtils';

setTestEnv();

const { generateToken, verifyToken } = require('../../utils/jwt') as typeof import('../../utils/jwt');

test('generateToken e verifyToken fazem round-trip do payload', () => {
    const payload = {
        userId: 'user-123',
        email: 'admin@clinic.com',
        role: 'ADMIN',
    };

    const token = generateToken(payload);
    const decoded = verifyToken(token);

    assert.equal(decoded.userId, payload.userId);
    assert.equal(decoded.email, payload.email);
    assert.equal(decoded.role, payload.role);
    assert.equal(typeof ((decoded as unknown as Record<string, unknown>).iat), 'number');
    assert.equal(typeof ((decoded as unknown as Record<string, unknown>).exp), 'number');
});

test('verifyToken rejeita token invalido', () => {
    assert.throws(() => verifyToken('token-invalido'), {
        message: 'Invalid or expired token',
    });
});
