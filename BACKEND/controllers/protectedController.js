exports.profile = (req, res) => {
  // req.session.user viene del login
  const user = req.session.user || null;
  res.json({ message: 'Ruta protegida', user });
};
