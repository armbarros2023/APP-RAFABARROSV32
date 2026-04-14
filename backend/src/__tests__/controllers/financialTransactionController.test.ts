import assert from 'node:assert/strict';
import test from 'node:test';
import { createMockRequest, createMockResponse, setTestEnv } from '../helpers/testUtils';

setTestEnv();

const prisma = (require('../../config/database') as typeof import('../../config/database')).default;
const financialTransactionController = require('../../controllers/financialTransactionController') as typeof import('../../controllers/financialTransactionController');

const transactionModel = prisma.financialTransaction as unknown as {
    findMany: (...args: any[]) => Promise<unknown>;
    create: (...args: any[]) => Promise<unknown>;
    update: (...args: any[]) => Promise<unknown>;
    delete: (...args: any[]) => Promise<unknown>;
};

const validBranchId = '44444444-4444-4444-8444-444444444444';
const validStudentId = '55555555-5555-4555-8555-555555555555';

test('getAllFinancialTransactions aplica filtros e ordenacao esperados', async () => {
    const originalFindMany = transactionModel.findMany;
    let receivedArgs: unknown;
    const transactions = [{ id: 'txn-1', description: 'Sessao ABA' }];

    transactionModel.findMany = async (...args) => {
        [receivedArgs] = args;
        return transactions;
    };

    try {
        const req = createMockRequest({
            query: {
                branchId: validBranchId,
                type: 'REVENUE',
                status: 'PAID',
            },
        });
        const res = createMockResponse();

        await financialTransactionController.getAllFinancialTransactions(req, res);

        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.body, transactions);
        assert.deepEqual(receivedArgs, {
            where: {
                branchId: validBranchId,
                type: 'REVENUE',
                status: 'PAID',
            },
            orderBy: { date: 'desc' },
        });
    } finally {
        transactionModel.findMany = originalFindMany;
    }
});

test('createFinancialTransaction converte data e vencimento para Date', async () => {
    const originalCreate = transactionModel.create;
    let receivedArgs: unknown;

    transactionModel.create = async (...args) => {
        [receivedArgs] = args;
        return { id: 'txn-1', ...(args[0] as { data: Record<string, unknown> }).data };
    };

    try {
        const req = createMockRequest({
            body: {
                branchId: validBranchId,
                studentId: validStudentId,
                date: '2026-03-17T12:00:00.000Z',
                description: 'Sessao individual',
                amount: 320,
                taxPercentage: 6,
                type: 'REVENUE',
                category: 'RECEITA_ATENDIMENTO',
                status: 'PAID',
                dueDate: '2026-03-25T12:00:00.000Z',
            },
        });
        const res = createMockResponse();

        await financialTransactionController.createFinancialTransaction(req, res);

        const data = (receivedArgs as { data: Record<string, unknown> }).data;

        assert.equal(res.statusCode, 201);
        assert.ok(data.date instanceof Date);
        assert.ok(data.dueDate instanceof Date);
        assert.equal((res.body as { id: string }).id, 'txn-1');
    } finally {
        transactionModel.create = originalCreate;
    }
});

test('createFinancialTransaction responde 400 para payload invalido', async () => {
    const req = createMockRequest({
        body: {
            branchId: validBranchId,
            date: '2026-03-17T12:00:00.000Z',
            description: 'A',
            amount: -10,
            type: 'REVENUE',
            category: 'RECEITA_ATENDIMENTO',
        },
    });
    const res = createMockResponse();

    await financialTransactionController.createFinancialTransaction(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
        error: 'Validation error',
        details: (res.body as { details: unknown }).details,
    });
    assert.ok(Array.isArray((res.body as { details: unknown[] }).details));
});

test('updateFinancialTransaction converte campos de data parciais para Date', async () => {
    const originalUpdate = transactionModel.update;
    let receivedArgs: unknown;

    transactionModel.update = async (...args) => {
        [receivedArgs] = args;
        return { id: 'txn-1', ...(args[0] as { data: Record<string, unknown> }).data };
    };

    try {
        const req = createMockRequest({
            params: { id: 'txn-1' },
            body: {
                date: '2026-03-20T12:00:00.000Z',
                dueDate: '2026-03-27T12:00:00.000Z',
                status: 'PENDING',
            },
        });
        const res = createMockResponse();

        await financialTransactionController.updateFinancialTransaction(req, res);

        const updateArgs = receivedArgs as { where: Record<string, unknown>; data: Record<string, unknown> };

        assert.equal(res.statusCode, 200);
        assert.deepEqual(updateArgs.where, { id: 'txn-1' });
        assert.ok(updateArgs.data.date instanceof Date);
        assert.ok(updateArgs.data.dueDate instanceof Date);
    } finally {
        transactionModel.update = originalUpdate;
    }
});

test('deleteFinancialTransaction responde 204 quando exclusao conclui', async () => {
    const originalDelete = transactionModel.delete;
    let receivedArgs: unknown;

    transactionModel.delete = async (...args) => {
        [receivedArgs] = args;
        return {};
    };

    try {
        const req = createMockRequest({
            params: { id: 'txn-1' },
        });
        const res = createMockResponse();

        await financialTransactionController.deleteFinancialTransaction(req, res);

        assert.equal(res.statusCode, 204);
        assert.deepEqual(receivedArgs, { where: { id: 'txn-1' } });
    } finally {
        transactionModel.delete = originalDelete;
    }
});
