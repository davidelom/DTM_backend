require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true, 
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 2,
    },
}));
app.use(express.static(path.join(__dirname, 'public')));

const taskCounter = require('./middlewares/taskCount');

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api')

app.get('/', taskCounter, (req, res) => {
    res.render('index', { 
        userId: req.query.userId,
        user: req.session.user || null 
    });
});
app.use('/', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/admin', adminRoutes);
app.use('/api/tasks', apiRoutes);


if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;