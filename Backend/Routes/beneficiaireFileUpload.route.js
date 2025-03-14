const express = require('express');
const router = express.Router();
const { 
  uploadFile, 
  getFormationFiles, 
  getFileById, 
  deleteFile, 
  updateFileMetadata 
} = require('../Controllers/beneficiaireFileUpload.controller');
const { upload, handleMulterError } = require('../Middlewares/FileUploadMiddleware');
const authenticated = require('../Middlewares/Authmiddleware');
const authorizeRoles = require('../Middlewares/RoleMiddleware');

// Upload a file to a formation
router.post(
  '/upload',
  authenticated,
  authorizeRoles('Admin', 'Formateur', 'Manager'),
  upload.single('file'),
  handleMulterError,
  uploadFile
);

// Get all files for a specific formation
router.get(
  '/formation/:formationId',
  authenticated,
  authorizeRoles('Admin', 'Formateur', 'Manager'),
  getFormationFiles
);

// Get a specific file by ID
router.get(
  '/:id',
  authenticated,
  authorizeRoles('Admin', 'Formateur', 'Manager'),
  getFileById
);

// Delete a file
router.delete(
  '/:id',
  authenticated,
  authorizeRoles('Admin', 'Formateur', 'Manager'),
  deleteFile
);

// Update file metadata
router.patch(
  '/:id',
  authenticated,
  authorizeRoles('Admin', 'Formateur', 'Manager'),
  updateFileMetadata
);

module.exports = router;