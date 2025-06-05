require('dotenv').config();
const app = require('./src/app');
const cors = require("cors");

const PORT = process.env.PORT || 5000;
app.use(cors());

app.listen(PORT, () => {
console.log(`DIGIPIN API is running and API docs can be found at at http://localhost:${PORT}/api-docs`);
});
