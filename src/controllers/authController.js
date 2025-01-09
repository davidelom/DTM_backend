const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validatePassword = require('../utils/passwordTestFunc');

module.exports = {
    login: async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await User.findByUsername(username);

            if (!user) {
                return res.render('auth/login', { 
                    error: 'Invalid username or password.',
                    user: req.session.user || null 
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign(
                    { id: user.id, username: user.username, roles: user.roles },
                    process.env.JWT_SECRET,
                    { expiresIn: '2h' }
                );

                req.session.token = token;

                req.session.user = { id: user.id, username: user.username, roles: user.roles };
                return res.redirect('/tasks');
            } else {
                return res.render('auth/login', { 
                    error: 'Invalid username or password.',
                    user: req.session.user || null 
                });
                //res.status(400).send('Invalid username or password.');
            }
        } catch (err) {
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
    },
    register: async (req, res) => {
        const { username, password, email } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('auth/register', { 
                error: 'Veuillez renseigner une adresse email valide.',
                user: req.session.user || null 
            });
        }
        const responsePV = validatePassword(password)
        if (responsePV.isValid){
            passwordValide = password
        } else {
            return res.render('auth/register', { 
                error: responsePV.message,
                user: req.session.user || null 
            });
        }

        const hashedPassword = await bcrypt.hash(passwordValide, 10);

        try {
            const existingUser = await User.findByUsernameOrEmail(username, email);

            if (existingUser) {
                return res.render('auth/register', { 
                    error: 'Le nom d\'utilisateur ou l\'email existe déjà.',
                    user: req.session.user || null 
                });
            }

            const user = await User.create({ username, password: hashedPassword, email });

            const token = jwt.sign(
                { id: user.id, username: user.username, roles: user.roles },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            req.session.token = token;

            req.session.user = { id: user.id, username: user.username, roles: user.roles || ['ROLE_USER'] };

            return res.redirect('/tasks');
        } catch (err) {
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) return res.status(500).send('Error logging out.');
            res.redirect('/login');
        });
    },
};
