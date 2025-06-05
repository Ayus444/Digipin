const DigiPin = require('../src/digipin');
const { Worker } = require('worker_threads');

// Base mock setup
jest.mock('worker_threads', () => {
    const EventEmitter = require('events');
    class MockWorker extends EventEmitter {
        constructor() {
            super();
            this._postMessageHandler = null;
            process.nextTick(() => {
                // Default successful response
                this.emit('message', { success: true, result: 'ABC-DEF-1234' });
            });
        }

        postMessage(msg) {
            if (this._postMessageHandler) this._postMessageHandler(this);
        }

        terminate() { }
    }

    return { Worker: MockWorker };
});

describe('DigiPin worker interface', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should resolve with digipin result', async () => {
        const result = await DigiPin({ type: 'encode', latitude: 13.0827, longitude: 80.2707 });
        expect(result).toEqual('ABC-DEF-1234');
    });
});
