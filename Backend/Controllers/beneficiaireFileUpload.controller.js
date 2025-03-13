const { uploadToCloudinary, deleteFromCloudinary, getFolderResources } = require('../Config/cloudinaryConfig');
const BeneficiaireFileUpload = require('../Models/BeneficiaireFileUpload.model');
const mongoose = require('mongoose');
const XLSX = require('xlsx');

// Upload a file to Cloudinary and save metadata
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Validate formation ID
    const formationId = req.body.formationId;
    if (!formationId || !mongoose.Types.ObjectId.isValid(formationId)) {
      return res.status(400).json({ message: 'Valid formation ID is required' });
    }
    
    console.log('Processing upload for formation:', formationId);

    // Validate Excel/CSV file
    try {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      if (!workbook.SheetNames.length) {
        return res.status(400).json({ message: 'The uploaded Excel file has no sheets' });
      }
      
      // Get first sheet and verify it has data
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const sampleData = XLSX.utils.sheet_to_json(worksheet, { range: 0, header: 1 });
      
      if (!sampleData || sampleData.length < 2) { // Assuming at least a header row and one data row
        return res.status(400).json({ message: 'The uploaded file appears to be empty or invalid' });
      }
      
      console.log('File verified, sample row count:', sampleData.length);
    } catch (parseError) {
      console.error('Error parsing Excel file:', parseError);
      return res.status(400).json({ 
        message: 'Cannot parse the uploaded file. Please ensure it is a valid Excel or CSV file', 
        error: parseError.message 
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: `formations/beneficiairesExcels/${formationId}`,
      resource_type: 'auto', // Let Cloudinary detect the type
      public_id: `file_${Date.now()}`,
      tags: ['excel', 'formation', formationId]
    });
    
    console.log('Cloudinary upload successful. Public ID:', result.public_id);
    
    // Create record in database
    const fileUpload = new BeneficiaireFileUpload({
      cloudinaryId: result.public_id,
      cloudinaryUrl: result.secure_url,
      cloudinaryFolder: `formations/beneficiairesExcels/${formationId}`,
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      formation: formationId,
      uploadedBy: req.user.userId,
      description: req.body.description || `Uploaded on ${new Date().toLocaleString()}`,
      tags: req.body.tags ? req.body.tags.split(',') : ['excel', 'import']
    });
    
    await fileUpload.save();
    
    res.status(201).json({
      message: "File uploaded successfully",
      fileUpload: {
        id: fileUpload._id,
        filename: fileUpload.originalFilename,
        url: fileUpload.cloudinaryUrl,
        uploadDate: fileUpload.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      message: "Error uploading file",
      error: error.message,
      details: error.http_code ? `HTTP ${error.http_code}` : undefined
    });
  }
};

// Get all files for a formation
const getFormationFiles = async (req, res) => {
  try {
    const { formationId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(formationId)) {
      return res.status(400).json({ message: 'Invalid formation ID' });
    }
    
    const files = await BeneficiaireFileUpload.find({ formation: formationId })
      .sort({ createdAt: -1 }) // Most recent first
      .populate('uploadedBy', 'nom prenom');
      
    res.status(200).json({
      message: "Files retrieved successfully",
      count: files.length,
      files
    });
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ message: "Error retrieving files", error: error.message });
  }
};

// Get a single file by ID
const getFileById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid file ID' });
    }
    
    const file = await BeneficiaireFileUpload.findById(id)
      .populate('uploadedBy', 'nom prenom')
      .populate('formation', 'nom dateDebut dateFin');
      
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    res.status(200).json({
      message: "File retrieved successfully",
      file
    });
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: "Error retrieving file", error: error.message });
  }
};

// Delete a file
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid file ID' });
    }
    
    const file = await BeneficiaireFileUpload.findById(id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check permission
    if (!req.user.role === 'Admin' && file.uploadedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Permission denied. You can only delete files you uploaded.' });
    }
    
    // Delete from Cloudinary
    if (file.cloudinaryId) {
      await deleteFromCloudinary(file.cloudinaryId);
    }
    
    // Delete from database
    await BeneficiaireFileUpload.findByIdAndDelete(id);
    
    res.status(200).json({
      message: "File deleted successfully",
      deletedFileId: id
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: "Error deleting file", error: error.message });
  }
};

// Update file metadata
const updateFileMetadata = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid file ID' });
    }
    
    const file = await BeneficiaireFileUpload.findById(id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Update fields
    const updateData = {};
    if (description) updateData.description = description;
    if (tags) updateData.tags = typeof tags === 'string' ? tags.split(',') : tags;
    
    const updatedFile = await BeneficiaireFileUpload.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    res.status(200).json({
      message: "File metadata updated successfully",
      file: updatedFile
    });
  } catch (error) {
    console.error('Error updating file metadata:', error);
    res.status(500).json({ message: "Error updating file metadata", error: error.message });
  }
};

module.exports = {
  uploadFile,
  getFormationFiles,
  getFileById,
  deleteFile,
  updateFileMetadata
};