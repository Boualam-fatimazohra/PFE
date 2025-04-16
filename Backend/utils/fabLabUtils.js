const mongoose = require('mongoose');
const Encadrant = require('../Models/encadrant.model');
const FormationFab = require('../Models/formationFab.model');
const FormationBase = require('../Models/formationBase.model');
const EncadrantFormation = require('../Models/encadrantFormation.model');
const { Utilisateur } = require('../Models/utilisateur.model');
const Fab = require('../Models/fab.model');

/**
 * Fab Lab Utilities
 * Collection of utility functions for Fab Labs operations
 */
const fabLabUtils = {
  /**
   * Get all formatreurs associated with a specific Fab
   * @param {ObjectId} fabId - The ID of the Fab
   * @returns {Promise<Array>} - List of formatreurs with their user details
   */
  getAllFormateurFab: async function(fabId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(fabId)) {
        throw new Error('Invalid Fab ID format');
      }
      
      // Get all formation IDs associated with this Fab
      const fabFormations = await FormationFab.find({ 
        baseFormation: { $exists: true }
      }).select('baseFormation');
      
      const baseFormationIds = fabFormations.map(ff => ff.baseFormation);
      
      // Find all encadrants assigned to these formations
      const encadrantAssignments = await EncadrantFormation.find({
        formationBase: { $in: baseFormationIds }
      }).populate({
        path: 'encadrant',
        populate: {
          path: 'utilisateur',
          model: 'Utilisateur',
          select: 'nom prenom email numeroTelephone role' // Exclude sensitive info like password
        }
      });
      
      // Extract unique encadrants who are formatreurs
      const formatreurs = encadrantAssignments
        .filter(assignment => assignment.encadrant && 
                assignment.encadrant.utilisateur && 
                assignment.encadrant.utilisateur.role === 'Formateur')
        .map(assignment => assignment.encadrant);
      
      // Remove duplicates
      const uniqueFormatreurs = Array.from(
        new Map(formatreurs.map(item => [item._id.toString(), item])).values()
      );
      
      return uniqueFormatreurs;
    } catch (error) {
      console.error('Error in getAllFormateurFab:', error);
      throw error;
    }
  },

  getAllEncadrantsFab: async function(fabId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(fabId)) {
        throw new Error('Invalid Fab ID format');
      }
      
      // Get all formation IDs associated with this Fab
      const fabFormations = await FormationFab.find({
        baseFormation: { $exists: true }
      }).select('baseFormation');
      
      const baseFormationIds = fabFormations.map(ff => ff.baseFormation);
      
      // Find all encadrants assigned to these formations
      const encadrantAssignments = await EncadrantFormation.find({
        formationBase: { $in: baseFormationIds }
      }).populate({
        path: 'encadrant',
        populate: {
          path: 'utilisateur',
          model: 'Utilisateur',
          select: 'nom prenom email numeroTelephone role' // Exclude sensitive info like password
        }
      });
      
      // Extract unique encadrants (regardless of role)
      const encadrants = encadrantAssignments
        .filter(assignment => assignment.encadrant && assignment.encadrant.utilisateur)
        .map(assignment => assignment.encadrant);
      
      // Remove duplicates
      const uniqueEncadrants = Array.from(
        new Map(encadrants.map(item => [item._id.toString(), item])).values()
      );
      
      return uniqueEncadrants;
    } catch (error) {
      console.error('Error in getAllEncadrantsFab:', error);
      throw error;
    }
  },
  
  /**
   * Get all formations associated with a specific Fab
   * @param {ObjectId} fabId - The ID of the Fab
   * @param {Object} filters - Optional filters (status, categorie, niveau, etc.)
   * @returns {Promise<Array>} - List of formations with their details
   */
  getAllFormationsFab: async function(fabId, filters = {}) {
    try {
      if (!mongoose.Types.ObjectId.isValid(fabId)) {
        throw new Error('Invalid Fab ID format');
      }
      
      // Build query based on filters
      const query = { ...filters };
      
      // Get formation details with base formation info
      const formations = await FormationFab.find(query)
        .populate({
          path: 'baseFormation',
          model: 'FormationBase',
          select: 'nom dateDebut dateFin description image'
        })
        .sort({ 'baseFormation.dateDebut': -1 }); // Most recent first
      
      return formations;
    } catch (error) {
      console.error('Error in getAllFormationsFab:', error);
      throw error;
    }
  },
  
  /**
   * Get all beneficiaries enrolled in formations for a specific Fab
   * @param {ObjectId} fabId - The ID of the Fab
   * @param {ObjectId} formationId - Optional formation ID to filter by specific formation
   * @returns {Promise<Array>} - List of beneficiaries with their details
   */
  getAllBeneficiairesFormationsFab: async function(fabId, formationId = null) {
    try {
      if (!mongoose.Types.ObjectId.isValid(fabId)) {
        throw new Error('Invalid Fab ID format');
      }
      
      let formationQuery = {};
      
      // If specific formation is requested
      if (formationId && mongoose.Types.ObjectId.isValid(formationId)) {
        formationQuery = { _id: formationId };
      }
      
      // Get all formations of this fab
      const fabFormations = await FormationFab.find(formationQuery)
        .select('baseFormation');
      
      const baseFormationIds = fabFormations.map(ff => ff.baseFormation);
      
      // For a real implementation, you would have a model for participants/beneficiaries
      // This is a placeholder implementation assuming a Beneficiaire model exists
      // Replace this with your actual data model
      
      // Example implementation (to be replaced with actual model):
      // const beneficiaires = await BeneficiaireFormation.find({
      //   formationBase: { $in: baseFormationIds }
      // }).populate('beneficiaire');
      
      // For demonstration purposes:
      // This code should be replaced with your actual beneficiary retrieval logic
      const beneficiaires = []; 
      
      // Note: Implement this function based on your actual data model
      // This placeholder returns an empty array
      
      return beneficiaires;
    } catch (error) {
      console.error('Error in getAllBeneficiairesFormationsFab:', error);
      throw error;
    }
  }
};

module.exports = fabLabUtils;