const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const db = require('./models/db');
const upload = require('./middlewares/upload');
const attentionlistRoutes = require('./routes/attentionlistRoutes');
const reviewsRoutes = require('./routes/reviewRoutes');
const browsingHistoryRoutes = require('./routes/browsingHistoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/attentionlist', attentionlistRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/browsing-history', browsingHistoryRoutes);

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