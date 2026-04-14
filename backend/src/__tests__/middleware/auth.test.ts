import assert from 'node:assert/strict';
import test from 'node:test';
import { createMockRequest, createMockResponse, createNext, setTestEnv } from '../helpers/testUtils';

setTestEnv();

const { adminOnly, authMiddleware } = require('../../middleware/auth') as typeof import('../../middleware/auth');
const { generateToken } = require('../../utils/jwt') as typeof import('../../utils/jwt');

test('authMiddleware responde 401 quando nao existe token', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const { next, wasCalled } = createNext();

    authMiddleware(req, res, next);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: 'No token provided' });
    assert.equal(wasCalled(), false);
});

test('authMiddleware responde 401 para formato invalido de token', () => {
    const req = createMockRequest({
        headers: { authorization: 'Bearer' } as Record<string, string>,
    });
    const res = createMockResponse();
    const { next, wasCalled } = createNext();

    authMiddleware(req, res, next);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: 'Invalid token format' });
    assert.equal(wasCalled(), false);
});

test('authMiddleware popula req.user e chama next com token valido', () => {
    const token = generateToken({
        userId: 'user-123',
        email: 'therapist@clinic.com',
        role: 'THERAPIST',
    });
    const req = createMockRequest({
        headers: { authorization: `Bearer ${token}` } as Record<string, string>,
    });
    const res = createMockResponse();
    const { next, wasCalled } = createNext();

    authMiddleware(req, res, next);

    assert.equal(wasCalled(), true);
    assert.equal(req.user?.userId, 'user-123');
    assert.equal(req.user?.email, 'therapist@clinic.com');
    assert.equal(req.user?.role, 'THERAPIST');
    assert.equal(typeof ((req.user as unknown as Record<string, unknown>).iat), 'number');
    assert.equal(typeof ((req.user as unknown as Record<string, unknown>).exp), 'number');
    assert.equal(res.statusCode, 200);
});

test('authMiddleware responde 401 para token invalido', () => {
    const req = createMockRequest({
        headers: { authorization: 'Bearer token-invalido' } as Record<string, string>,
    });
    const res = createMockResponse();
    const { next, wasCalled } = createNext();

    authMiddleware(req, res, next);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: 'Invalid or expired token' });
    assert.equal(wasCalled(), false);
});

test('adminOnly bloqueia usuario sem role ADMIN', () => {
    const req = createMockRequest({
        user: {
            userId: 'user-456',
            email: 'therapist@clinic.com',
            role: 'THERAPIST',
        },
    });
    const res = createMockResponse();
    const { next, wasCalled } = createNext();

    adminOnly(req, res, next);

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, { error: 'Admin access required' });
    assert.equal(wasCalled(), false);
});

test('adminOnly permite acesso para ADMIN', () => {
    const req = createMockRequest({
        user: {
            userId: 'user-789',
            email: 'admin@clinic.com',
            role: 'ADMIN',
        },
    });
    const res = createMockResponse();
    const { next, wasCalled } = createNext();

    adminOnly(req, res, next);

    assert.equal(wasCalled(), true);
    assert.equal(res.statusCode, 200);
});
