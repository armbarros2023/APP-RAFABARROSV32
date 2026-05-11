import type { NextFunction, Request, Response } from 'express';

export interface MockResponse extends Response {
    statusCode: number;
    body: unknown;
    cookies: Record<string, { value: unknown; options?: unknown }>;
    clearedCookies: string[];
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
        cookies: Record<string, { value: unknown; options?: unknown }>;
        clearedCookies: string[];
        status: (code: number) => unknown;
        json: (payload: unknown) => unknown;
        send: (payload?: unknown) => unknown;
        cookie: (name: string, value: unknown, options?: unknown) => unknown;
        clearCookie: (name: string) => unknown;
    } = {
        statusCode: 200,
        body: undefined,
        cookies: {},
        clearedCookies: [],
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
        cookie(name: string, value: unknown, options?: unknown) {
            this.cookies[name] = { value, options };
            return this;
        },
        clearCookie(name: string) {
            this.clearedCookies.push(name);
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
