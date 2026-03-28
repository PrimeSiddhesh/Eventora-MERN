const express = require('express');
const router = express.Router();
const aiController = require('./aiController');

// POST /api/ai/generate-description
router.post('/generate-description', aiController.generateDescription);

// POST /api/ai/chat
router.post('/chat', aiController.handleChat);

module.exports = router;
