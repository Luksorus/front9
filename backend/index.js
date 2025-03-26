require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const users = [];
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware для проверки JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Регистрация
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            id: Date.now(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };
        
        users.push(user);
        res.status(201).send('User registered');
    } catch {
        res.status(500).send();
    }
});

// Вход
app.post('/login', async (req, res) => {
    const user = users.find(u => u.email === req.body.email);
    if (!user) return res.status(400).send('User not found');
    
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign(
                { id: user.id, email: user.email }, 
                SECRET_KEY, 
                { expiresIn: '1h' }
            );
            res.json({ accessToken });
        } else {
            res.status(401).send('Invalid password');
        }
    } catch {
        res.status(500).send();
    }
});

// Защищенный маршрут
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ 
        message: 'Protected data', 
        user: req.user 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));