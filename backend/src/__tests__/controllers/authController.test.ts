import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createMockRequest, createMockResponse, setTestEnv } from '../helpers/testUtils';

setTestEnv();

const prisma = (require('../../config/database') as typeof import('../../config/database')).default;
const authController = require('../../controllers/authController') as typeof import('../../controllers/authController');
const { hashPassword, comparePassword } = require('../../utils/bcrypt') as typeof import('../../utils/bcrypt');
const { verifyToken } = require('../../utils/jwt') as typeof import('../../utils/jwt');

const userModel = prisma.user as unknown as {
    findUnique: (...args: any[]) => Promise<unknown>;
    create: (...args: any[]) => Promise<unknown>;
};

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

before(() => {
    console.log = () => undefined;
    console.error = () => undefined;
});

after(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
});

test('login normaliza email e retorna token quando as credenciais sao validas', async () => {
    const originalFindUnique = userModel.findUnique;
    let receivedArgs: unknown;
    const hashedPassword = await hashPassword('SenhaForte@123');

    userModel.findUnique = async (...args) => {
        [receivedArgs] = args;
        return {
            id: 'user-1',
            name: 'Dra. Rafa',
            email: 'admin@clinic.com',
            password: hashedPassword,
            role: 'ADMIN',
        };
    };

    try {
        const req = createMockRequest({
            body: {
                email: '  ADMIN@CLINIC.COM ',
                password: 'SenhaForte@123',
            },
        });
        const res = createMockResponse();

        await authController.login(req, res);

        const payload = verifyToken(String(res.cookies.token.value));

        assert.equal(res.statusCode, 200);
        assert.deepEqual(receivedArgs, { where: { email: 'admin@clinic.com' } });
        assert.equal(payload.email, 'admin@clinic.com');
        assert.equal((res.cookies.token.options as { httpOnly: boolean }).httpOnly, true);
        assert.equal((res.body as { user: { role: string } }).user.role, 'ADMIN');
    } finally {
        userModel.findUnique = originalFindUnique;
    }
});

test('login responde 401 quando a senha nao confere', async () => {
    const originalFindUnique = userModel.findUnique;
    const hashedPassword = await hashPassword('SenhaCorreta@123');

    userModel.findUnique = async () => ({
        id: 'user-2',
        name: 'Terapeuta Teste',
        email: 'therapist@clinic.com',
        password: hashedPassword,
        role: 'THERAPIST',
    });

    try {
        const req = createMockRequest({
            body: {
                email: 'therapist@clinic.com',
                password: 'SenhaErrada@123',
            },
        });
        const res = createMockResponse();

        await authController.login(req, res);

        assert.equal(res.statusCode, 401);
        assert.deepEqual(res.body, { error: 'Invalid credentials' });
    } finally {
        userModel.findUnique = originalFindUnique;
    }
});

test('register responde 409 quando o usuario ja existe', async () => {
    const originalFindUnique = userModel.findUnique;

    userModel.findUnique = async () => ({
        id: 'user-3',
        email: 'existente@clinic.com',
    });

    try {
        const req = createMockRequest({
            body: {
                name: 'Usuario Existente',
                email: 'existente@clinic.com',
                password: 'SenhaForte@123',
            },
        });
        const res = createMockResponse();

        await authController.register(req, res);

        assert.equal(res.statusCode, 409);
        assert.deepEqual(res.body, { error: 'User already exists' });
    } finally {
        userModel.findUnique = originalFindUnique;
    }
});

test('register cria usuario com hash e role padrao THERAPIST', async () => {
    const originalFindUnique = userModel.findUnique;
    const originalCreate = userModel.create;
    let receivedCreateArgs: unknown;

    userModel.findUnique = async () => null;
    userModel.create = async (...args) => {
        [receivedCreateArgs] = args;

        return {
            id: 'user-4',
            name: 'Nova Terapeuta',
            email: 'nova@clinic.com',
            password: (args[0] as { data: { password: string } }).data.password,
            role: 'THERAPIST',
        };
    };

    try {
        const req = createMockRequest({
            body: {
                name: 'Nova Terapeuta',
                email: 'nova@clinic.com',
                password: 'SenhaForte@123',
            },
        });
        const res = createMockResponse();

        await authController.register(req, res);

        const createArgs = receivedCreateArgs as { data: { password: string; role: string } };
        const storedPassword = createArgs.data.password;

        assert.equal(res.statusCode, 201);
        assert.equal(createArgs.data.role, 'THERAPIST');
        assert.notEqual(storedPassword, 'SenhaForte@123');
        assert.equal(await comparePassword('SenhaForte@123', storedPassword), true);
        assert.ok(res.cookies.token.value);
        assert.equal((res.body as { user: { email: string } }).user.email, 'nova@clinic.com');
    } finally {
        userModel.findUnique = originalFindUnique;
        userModel.create = originalCreate;
    }
});

test('me responde 401 quando req.user nao existe', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    await authController.me(req, res);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: 'Unauthorized' });
});
