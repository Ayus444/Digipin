const { parentPort } = require('worker_threads');
const { getDigiPin, getLatLngFromDigiPin } = require('./digipin');

parentPort.on('message', (data) => {
    try {
        let result;
        if (data.type === 'encode') {
            result = getDigiPin(data.latitude, data.longitude);
        } else if (data.type === 'decode') {
            result = getLatLngFromDigiPin(data.digiPin);
        }
        parentPort.postMessage({ success: true, result });
    } catch (error) {
        parentPort.postMessage({ success: false, error: error.message });
    }
});
