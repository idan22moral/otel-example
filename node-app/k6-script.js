import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    vus: 10,
    duration: '30s',
};

const BASE_URL = 'http://localhost:8080';

export default function () {
    // Hit all endpoints
    let res1 = http.get(`${BASE_URL}/users`);
    check(res1, { 'users status 200': (r) => r.status === 200 });
    sleep(0.2);

    let res2 = http.get(`${BASE_URL}/orders`);
    check(res2, { 'orders status 200': (r) => r.status === 200 });
    sleep(0.2);

    let res3 = http.get(`${BASE_URL}/compute`);
    check(res3, { 'compute status 200': (r) => r.status === 200 });
    sleep(0.2);

    let res4 = http.get(`${BASE_URL}/error`);
    check(res4, { 'error status': (r) => r.status === 200 || r.status === 500 });
    sleep(0.2);
}
