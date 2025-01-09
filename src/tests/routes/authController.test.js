const bcrypt = require('bcrypt');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user');

const { JSDOM } = require('jsdom');

jest.mock('../../models/user');

describe('Auth Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should register a new user', async () => {
        User.findByUsernameOrEmail.mockResolvedValue(null);
        User.create.mockResolvedValue({ id: 1, username: 'test' });

        const response = await request(app)
            .post('/register')
            .send({
                username: 'test',
                password: 'Password123!',
                email: 'test@example.com',
            });

        expect(User.findByUsernameOrEmail).toHaveBeenCalledWith('test', 'test@example.com');
        expect(User.create).toHaveBeenCalledWith({
            username: 'test',
            password: expect.any(String),
            email: 'test@example.com',
        });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/tasks');
    });

    test('should login an existing user', async () => {
        const hashedPassword = await bcrypt.hash('test', 10);
        const mockUser = { id: 1, username: 'test', password: hashedPassword };
        User.findByUsername.mockResolvedValue(mockUser);

        const response = await request(app).post('/login').send({
            username: 'test',
            password: 'test',
        });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/tasks');
    });

    test('should return error when logging in with invalid username', async () => {
        User.findByUsername.mockResolvedValue(null);

        const response = await request(app).post('/login').send({
            username: 'invalidUser',
            password: 'test',
        });

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Invalid username or password.');
        expect(User.findByUsername).toHaveBeenCalledWith('invalidUser');
    });

    test('should return error when logging in with incorrect password', async () => {
        const hashedPassword = await bcrypt.hash('test', 10);
        const mockUser = { id: 1, username: 'test', password: hashedPassword, roles: ['ROLE_USER'] };
        User.findByUsername.mockResolvedValue(mockUser);

        const response = await request(app).post('/login').send({
            username: 'test',
            password: 'wrongPassword',
        });

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Invalid username or password.');
    });

    test('should logout the logged-in user', async () => {
        const hashedPassword = await bcrypt.hash('test', 10);
        const mockUser = { id: 1, username: 'test', password: hashedPassword };
        User.findByUsername.mockResolvedValue(mockUser);

        const agent = request.agent(app);

        const loginResponse = await agent.post('/login').send({
            username: 'test',
            password: 'test',
        });

        expect(loginResponse.statusCode).toBe(302);
        expect(loginResponse.headers.location).toBe('/tasks');

        const logoutResponse = await agent.get('/logout');

        expect(logoutResponse.statusCode).toBe(302);
        expect(logoutResponse.headers.location).toBe('/login');
    });
});

describe('Password Validation', () => {
    it('should reject passwords shorter than 8 characters', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Short1!'
            });

        const dom = new JSDOM(response.text);
        const extractText = dom.window.document.querySelector('#message_error').textContent.trim();
        expect(response.statusCode).toBe(200);
        expect(extractText).toContain('Le mot de passe doit contenir au moins 8 caractères.');
    });

    it('should reject passwords without uppercase letters', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123!'
            });

        const dom = new JSDOM(response.text);
        const extractText = dom.window.document.querySelector('#message_error').textContent.trim();
    
        expect(response.statusCode).toBe(200);
        expect(extractText).toContain('Le mot de passe doit contenir au moins une lettre majuscule.');    
    });

    it('should reject passwords without lowercase letters', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'PASSWORD123!'
            });

        const dom = new JSDOM(response.text);
        const extractText = dom.window.document.querySelector('#message_error').textContent.trim();
    
        expect(response.statusCode).toBe(200);
        expect(extractText).toContain('Le mot de passe doit contenir au moins une lettre minuscule.');    
    });

    it('should reject passwords without numbers', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Password!'
            });

        const dom = new JSDOM(response.text);
        const extractText = dom.window.document.querySelector('#message_error').textContent.trim();
    
        expect(response.statusCode).toBe(200);
        expect(extractText).toContain('Le mot de passe doit contenir au moins un chiffre.');    
    });

    it('should reject passwords without special characters', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Password123'
            });

        const dom = new JSDOM(response.text);
        const extractText = dom.window.document.querySelector('#message_error').textContent.trim();
    
        expect(response.statusCode).toBe(200);
        expect(extractText).toContain('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?":{}|<>).');    
    });

    it('should reject passwords with spaces', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Password 123!'
            });

        const dom = new JSDOM(response.text);
        const extractText = dom.window.document.querySelector('#message_error').textContent.trim();
    
        expect(response.statusCode).toBe(200);
        expect(extractText).toContain('Le mot de passe ne doit pas contenir d\'espaces.');    

    });
});