import { AsyncLocalStorage } from 'node:async_hooks';
import { trace, context } from '@opentelemetry/api';

const asyncLocalStorage = new AsyncLocalStorage();

export function getExecutionContext() {
    return asyncLocalStorage.getStore();
}

export async function initContextMiddleware(req, res, next) {
    const ctx = {
        traceId: trace.getSpan(context.active()).spanContext().traceId
    };
    asyncLocalStorage.run(ctx, next);
}
