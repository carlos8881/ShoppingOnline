const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const db = require('./models/db');
const upload = require('./middlewares/upload');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(bodyParser.json());
app.use(cors());

app.use('/products', productRoutes);

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