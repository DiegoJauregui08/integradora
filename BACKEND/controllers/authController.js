const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'Faltan credenciales' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña inválidos' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Usuario o contraseña inválidos' });

    // guarda info de sesión mínima
    req.session.user = { id: user._id.toString(), username: user.username };
    return res.json({ message: 'Autenticación exitosa' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error en servidor' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error', err);
      return res.status(500).json({ error: 'No se pudo cerrar sesión' });
    }
    // limpia la cookie del cliente
    res.clearCookie('sid');
    return res.json({ message: 'Sesión cerrada' });
  });
};
