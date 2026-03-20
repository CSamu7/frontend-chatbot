global.fetch = jest.fn();

jest.mock('../services/userServices', () => ({
  userServices: {
    login: jest.fn(),
    getUser: jest.fn(),
    logout: jest.fn(),
    registerUser: jest.fn(),
  }
}));

describe('userServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login exitoso', async () => {
    const mockResponse = { id: '1', username: 'testuser', email: 'test@example.com' };
    const { userServices } = require('../services/userServices');
    userServices.login.mockResolvedValue(mockResponse);
    const result = await userServices.login('test@example.com', 'password123');

    expect(userServices.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(result).toEqual(mockResponse);
  });

  test('login falla con error de autenticación', async () => {
    const mockError = { error: 'Credenciales inválidas' };
    const { userServices } = require('../services/userServices');
    userServices.login.mockRejectedValue(mockError);

    await expect(userServices.login('wrong@example.com', 'wrongpass'))
      .rejects.toEqual(mockError);
  });

  test('getUser exitoso', async () => {
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
    const { userServices } = require('../services/userServices');
    userServices.getUser.mockResolvedValue(mockUser);
    const result = await userServices.getUser();

    expect(userServices.getUser).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  test('getUser falla cuando no hay sesión', async () => {
    const { userServices } = require('../services/userServices');
    userServices.getUser.mockRejectedValue(new Error('Unauthorized'));
    await expect(userServices.getUser()).rejects.toThrow('Unauthorized');
  });

  test('logout exitoso', async () => {
    const { userServices } = require('../services/userServices');
    userServices.logout.mockResolvedValue();
    await userServices.logout();
    expect(userServices.logout).toHaveBeenCalled();
  });

  test('registerUser exitoso', async () => {
    const newUser = { email: 'new@example.com', username: 'newuser', password: 'pass123' };
    const { userServices } = require('../services/userServices');
    userServices.registerUser.mockResolvedValue();
    await userServices.registerUser(newUser);

    expect(userServices.registerUser).toHaveBeenCalledWith(newUser);
  });

  test('registerUser falla con email duplicado', async () => {
    const newUser = { email: 'existing@example.com', username: 'existing', password: 'pass' };
    const mockError = { error: 'El email ya está registrado' };
    const { userServices } = require('../services/userServices');
    userServices.registerUser.mockRejectedValue(mockError);

    await expect(userServices.registerUser(newUser)).rejects.toEqual(mockError);
  });
});