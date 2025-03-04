const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const db = require('./models/db');
const upload = require('./middlewares/upload');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(bodyParser.json());
app.use(cors());

app.use('/categories', categoryRoutes);

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});