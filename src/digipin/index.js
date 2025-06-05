// index.js
const { Worker } = require('worker_threads');
const path = require('path');

function runWorker(data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, 'worker.js'));

        worker.once('message', (msg) => {
            if (msg.success) resolve(msg.result);
            else reject(new Error(msg.error));
            worker.terminate();
        });

        worker.once('error', reject);

        worker.once('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });

        worker.postMessage(data);
    });
}

module.exports = runWorker