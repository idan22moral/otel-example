from fastapi import FastAPI
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
import time

app = FastAPI()

# Tracing setup
trace_provider = TracerProvider(resource=Resource.create({SERVICE_NAME: "python-app"}))
otlp_exporter = OTLPSpanExporter(endpoint="http://localhost:4318/v1/traces")
span_processor = BatchSpanProcessor(otlp_exporter)
trace_provider.add_span_processor(span_processor)
FastAPIInstrumentor.instrument_app(app, tracer_provider=trace_provider)

# Metrics setup
metric_exporter = OTLPMetricExporter(endpoint="http://localhost:4318/v1/metrics")
metric_reader = PeriodicExportingMetricReader(metric_exporter, export_interval_millis=1000)
meter_provider = MeterProvider(resource=Resource.create({SERVICE_NAME: "python-app"}), metric_readers=[metric_reader])

@app.get("/ping")
def ping():
    return {"message": "pong"}

@app.get("/compute")
def compute():
    # Simulate some work
    time.sleep(0.2)
    return {"result": 42}
