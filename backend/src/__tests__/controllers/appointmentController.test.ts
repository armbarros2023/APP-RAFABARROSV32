import assert from 'node:assert/strict';
import test from 'node:test';
import { createMockRequest, createMockResponse, setTestEnv } from '../helpers/testUtils';

setTestEnv();

const prisma = (require('../../config/database') as typeof import('../../config/database')).default;
const appointmentController = require('../../controllers/appointmentController') as typeof import('../../controllers/appointmentController');

const appointmentModel = prisma.appointment as unknown as {
    findMany: (...args: any[]) => Promise<unknown>;
    create: (...args: any[]) => Promise<unknown>;
    update: (...args: any[]) => Promise<unknown>;
    delete: (...args: any[]) => Promise<unknown>;
};

const validBranchId = '11111111-1111-4111-8111-111111111111';
const validTherapistId = '22222222-2222-4222-8222-222222222222';
const validStudentId = '33333333-3333-4333-8333-333333333333';

test('getAllAppointments aplica filtros e ordenacao esperados', async () => {
    const originalFindMany = appointmentModel.findMany;
    let receivedArgs: unknown;
    const appointments = [{ id: 'appt-1', studentName: 'Maria' }];

    appointmentModel.findMany = async (...args) => {
        [receivedArgs] = args;
        return appointments;
    };

    try {
        const req = createMockRequest({
            query: {
                branchId: validBranchId,
                therapistId: validTherapistId,
                status: 'SCHEDULED',
            },
        });
        const res = createMockResponse();

        await appointmentController.getAllAppointments(req, res);

        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.body, appointments);
        assert.deepEqual(receivedArgs, {
            where: {
                branchId: validBranchId,
                therapistId: validTherapistId,
                status: 'SCHEDULED',
            },
            orderBy: { dateTime: 'asc' },
        });
    } finally {
        appointmentModel.findMany = originalFindMany;
    }
});

test('createAppointment converte dateTime para Date e define therapistId nulo quando ausente', async () => {
    const originalCreate = appointmentModel.create;
    let receivedArgs: unknown;

    appointmentModel.create = async (...args) => {
        [receivedArgs] = args;
        return { id: 'appt-1', ...(args[0] as { data: Record<string, unknown> }).data };
    };

    try {
        const req = createMockRequest({
            body: {
                branchId: validBranchId,
                studentId: validStudentId,
                dateTime: '2026-03-17T14:30:00.000Z',
                studentName: 'Lucas Lima',
                service: 'Avaliacao',
                status: 'SCHEDULED',
            },
        });
        const res = createMockResponse();

        await appointmentController.createAppointment(req, res);

        const data = (receivedArgs as { data: Record<string, unknown> }).data;

        assert.equal(res.statusCode, 201);
        assert.ok(data.dateTime instanceof Date);
        assert.equal(data.therapistId, null);
        assert.equal((res.body as { id: string }).id, 'appt-1');
    } finally {
        appointmentModel.create = originalCreate;
    }
});

test('createAppointment responde 400 para payload invalido', async () => {
    const req = createMockRequest({
        body: {
            branchId: 'invalido',
            dateTime: '2026-03-17T14:30:00.000Z',
            studentName: 'A',
            service: '',
        },
    });
    const res = createMockResponse();

    await appointmentController.createAppointment(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
        error: 'Validation error',
        details: (res.body as { details: unknown }).details,
    });
    assert.ok(Array.isArray((res.body as { details: unknown[] }).details));
});

test('updateAppointment converte dateTime parcial para Date', async () => {
    const originalUpdate = appointmentModel.update;
    let receivedArgs: unknown;

    appointmentModel.update = async (...args) => {
        [receivedArgs] = args;
        return { id: 'appt-1', ...(args[0] as { data: Record<string, unknown> }).data };
    };

    try {
        const req = createMockRequest({
            params: { id: 'appt-1' },
            body: {
                dateTime: '2026-03-18T09:00:00.000Z',
                therapistId: validTherapistId,
                status: 'COMPLETED',
            },
        });
        const res = createMockResponse();

        await appointmentController.updateAppointment(req, res);

        const updateArgs = receivedArgs as { where: Record<string, unknown>; data: Record<string, unknown> };

        assert.equal(res.statusCode, 200);
        assert.deepEqual(updateArgs.where, { id: 'appt-1' });
        assert.ok(updateArgs.data.dateTime instanceof Date);
        assert.equal(updateArgs.data.therapistId, validTherapistId);
    } finally {
        appointmentModel.update = originalUpdate;
    }
});

test('deleteAppointment responde 204 quando exclusao conclui', async () => {
    const originalDelete = appointmentModel.delete;
    let receivedArgs: unknown;

    appointmentModel.delete = async (...args) => {
        [receivedArgs] = args;
        return {};
    };

    try {
        const req = createMockRequest({
            params: { id: 'appt-1' },
        });
        const res = createMockResponse();

        await appointmentController.deleteAppointment(req, res);

        assert.equal(res.statusCode, 204);
        assert.deepEqual(receivedArgs, { where: { id: 'appt-1' } });
    } finally {
        appointmentModel.delete = originalDelete;
    }
});
