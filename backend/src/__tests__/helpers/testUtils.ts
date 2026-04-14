import type { NextFunction, Request, Response } from 'express';

export interface MockResponse extends Response {
    statusCode: number;
    body: unknown;
}

export const setTestEnv = (): void => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
    process.env.CORS_ORIGIN = 'http://localhost:3000';
};

export const createMockRequest = (overrides: Partial<Request> = {}): Request => {
    return {
        body: {},
        params: {},
        query: {},
        headers: {},
        ...overrides,
    } as Request;
};

export const createMockResponse = (): MockResponse => {
    const response: {
        statusCode: number;
        body: unknown;
        status: (code: number) => unknown;
        json: (payload: unknown) => unknown;
        send: (payload?: unknown) => unknown;
    } = {
        statusCode: 200,
        body: undefined,
        status(code: number) {
            this.statusCode = code;
            return this;
        },
        json(payload: unknown) {
            this.body = payload;
            return this;
        },
        send(payload?: unknown) {
            this.body = payload;
            return this;
        },
    };

    return response as MockResponse;
};

export const createNext = () => {
    let called = false;

    const next: NextFunction = () => {
        called = true;
    };

    return {
        next,
        wasCalled: () => called,
    };
};
