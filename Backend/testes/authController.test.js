const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../Models/userModel'); // Assurez-vous que le chemin est correct
const { Login } = require('../Controllers/Login.js'); // Chemin vers votre contrôleur
process.env.JWT_SECRET = 'salaaamon';

// Créer une application Express pour les tests
const app = express();
app.use(express.json());
app.post('/login', Login); // Définir la route pour le test

// Mock de User.findOne
jest.mock('../Models/userModel');

describe('Login Controller', () => {
    let mockUser;

    beforeEach(async () => {
        jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test

        mockUser = {
            _id: '12345',
            email: 'exemple@gmail.com',
            password: await bcrypt.hash('dddddddd', 10), // Hash du mot de passe
            role: 'Mentor'
        };
    });

    it('should return 400 if user is not found', async () => {
        User.findOne.mockResolvedValue(null); // Simuler un utilisateur non trouvé

        const response = await request(app)
            .post('/login')
            .send({ email: 'wrong@example.com', password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 400 if password is invalid', async () => {
        User.findOne.mockResolvedValue(mockUser); // Simuler un utilisateur trouvé
         
        const response = await request(app)
            .post('/login')
            .send({ email: 'saloua@gmail.com', password: 'dddddd' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 200 and a token if login is successful', async () => {
        User.findOne.mockResolvedValue(mockUser); // Simuler un utilisateur trouvé

        const response = await request(app)
            .post('/login')
            .send({ email: 'saloua@gmail.com', password: 'dddddddd' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.role).toBe(mockUser.role);
    });

    it('should return 500 if there is an internal server error', async () => {
        User.findOne.mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
    });
});
