// Express route handler
const express = require('express');
import {createEvaluation} from '../Controllers/evaluation.controller.js';
const router = express.Router();
router.post('/api/evaluations',createEvaluation);
  
  module.exports = router;