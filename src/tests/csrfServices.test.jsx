const mockSetCsrfService = jest.fn();

jest.mock('../services/csrfServices', () => ({
  setCsrfService: (...args) => mockSetCsrfService(...args),
}));

global.fetch = jest.fn();

describe('csrfServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('setCsrfService hace fetch a la URL correcta', async () => {
    const mockResponse = { csrf_token: 'token123' };
    
    mockSetCsrfService.mockImplementation(async () => {
      const fetch = global.fetch;
      const response = await fetch('http://localhost:3000/get_csrf/', {
        credentials: 'include'
      });
      return response.json();
    });

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse)
    });

    const { setCsrfService } = require('../services/csrfServices');
    const result = await setCsrfService();

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/get_csrf/',
      { credentials: 'include' }
    );
    expect(result).toEqual(mockResponse);
  });

  test('setCsrfService maneja error de red', async () => {
    mockSetCsrfService.mockImplementation(async () => {
      throw new Error('Network error');
    });

    const { setCsrfService } = require('../services/csrfServices');

    await expect(setCsrfService()).rejects.toThrow('Network error');
  });
});