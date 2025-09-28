const express = require('express');
const router = express.Router();
const ensureAuth = require('../middlewares/authMiddleware');
const protectedController = require('../controllers/protectedController');

router.get('/', ensureAuth, protectedController.profile);

module.exports = router;
