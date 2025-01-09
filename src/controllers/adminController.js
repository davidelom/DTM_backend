const User = require('../models/user');

module.exports = {
    listUsers: async (req, res) => {
        try {
            const users = await User.getAll();
            res.render('admin/admin', { 
                users,
                error: null,
                user: req.session.user || null,
            });
        } catch (err) {
            res.render('admin/admin', { 
                error: 'Erreur lors de la récupération des utilisateurs.',
                users: [],
                user: req.session.user || null,
            });
        }
    },

    deleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            await User.delete(id);
            res.status(200).json({ success: true, message: 'Utilisateur supprimé avec succès.' });
        } catch (err) {
            if (err.message === 'User not found') {
                res.status(404).json({ success: false, error: 'Utilisateur introuvable.' });
            } else {
                res.status(500).json({ success: false, error: 'Erreur lors de la suppression de l’utilisateur.' });
            }
        }
    },

    updateUser: async (req, res) => {
        const { id } = req.params;
        const { roles } = req.body;
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ success: false, error: 'Utilisateur introuvable.' });
            }

            const parsedRoles = Array.isArray(roles) ? roles : roles.split(',').map(role => role.trim());

            const updatedUser = await User.update(id, { roles: JSON.stringify(parsedRoles) });
            res.status(200).json({ success: true, message: 'Rôles mis à jour avec succès.', user: updatedUser });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour des rôles.' });
        }
    },

    getEditId: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.render('admin', { 
                    error: 'Utilisateur introuvable.',
                    users: [],
                    user: req.session.user || null,
                });
            }
            res.render('admin/edit-user', { 
                editUser: user,
                error: null,
                user: req.session.user || null,
            });
        } catch (err) {
            res.render('admin', { 
                error: 'Erreur lors de la récupération de l’utilisateur.',
                users: [],
                user: req.session.user || null,
            });
        }
    },
};
