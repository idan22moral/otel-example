import express from 'express';
import { initContextMiddleware } from './context.js';
import fetch from 'node-fetch';

const app = express();

app.use(initContextMiddleware);

app.get('/', (req, res) => {
    const { traceId } = getExecutionContext();
    res.send(`Hello OpenTelemetry ${traceId}!`);
});

app.get('/users', async (req, res) => {
    // Simulate DB call
    await new Promise(resolve => setTimeout(resolve, 150));
    res.json({ users: ['alice', 'bob', 'charlie'] });
});

app.get('/orders', async (req, res) => {
    // Simulate fetching orders
    await new Promise(resolve => setTimeout(resolve, 120));
    res.json({ orders: [
        { id: 1, item: 'book', qty: 2 },
        { id: 2, item: 'pen', qty: 5 }
    ] });
});

app.get('/compute', (req, res) => {
    // Simulate CPU work
    let sum = 0;
    for (let i = 0; i < 1e6; i++) {
        sum += Math.sqrt(i);
    }
    res.json({ result: sum });
});

app.get('/error', (req, res) => {
    // Simulate random error
    if (Math.random() < 0.5) {
        res.status(500).json({ error: 'Random failure occurred!' });
    } else {
        res.json({ status: 'ok' });
    }
});

app.get('/chain', async (req, res) => {
    try {
        const response = await fetch('http://localhost:8000/ping');
        const data = await response.json();
        res.json({ fromNode: 'ok', fromPython: data });
    } catch (err) {
        res.status(500).json({ error: 'Failed to reach python-app', details: err.message });
    }
});

app.listen(8080, () => {
    console.log('Node app listening on port 8080');
});
