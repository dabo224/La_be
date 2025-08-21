const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const eventsRouter = require('./src/routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/template'));

app.use('/events', eventsRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Université App');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});