import {
    getNodeAutoInstrumentations,
} from '@opentelemetry/auto-instrumentations-node';
import {
    PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';

import grpc from '@grpc/grpc-js';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { SERVICE_NAME } from './constants.js';

const traceExporter = new OTLPTraceExporter({
    url: 'localhost:4317',
    credentials: grpc.credentials.createInsecure(),
});
const metricExporter = new OTLPMetricExporter({
    url: 'localhost:4317',
    credentials: grpc.credentials.createInsecure(),
});
const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000,
});

const sdk = new NodeSDK({
    serviceName: SERVICE_NAME,
    traceExporter,
    metricReader,
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// Allow for graceful shutdown
process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => console.log('🟡 OpenTelemetry SDK shut down gracefully'))
        .catch((err) => console.error('🔴 Error during shutdown', err))
        .finally(() => process.exit(0));
});
