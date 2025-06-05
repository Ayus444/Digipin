require('dotenv').config();
const http = require('http');

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`DIGIPIN API is running and API docs can be found at at http://localhost:${PORT}/api-docs`);
});
