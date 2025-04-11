const express = require('express');
const routes = require('./routes/routes');
const authRoutes = require('./routes/auth');

const app = express();
const port = 8080; // You can change the default port here

app.use(express.json());
app.use('/', routes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});