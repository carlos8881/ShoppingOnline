const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models/db');
const attentionlistRoutes = require('./routes/attentionlistRoutes');
const browsingHistoryRoutes = require('./routes/browsingHistoryRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.use('/attentionlist', attentionlistRoutes);
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