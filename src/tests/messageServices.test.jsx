const mockCreateCsrfHeaders = jest.fn();

jest.mock('../helpers/csrfHelper', () => ({
  createCsrfHeaders: () => mockCreateCsrfHeaders(),
}));

const mockGetMessages = jest.fn();
const mockPostMessage = jest.fn();

jest.mock('../services/messageServices', () => ({
  messagesService: {
    getMessages: (...args) => mockGetMessages(...args),
    postMessage: (...args) => mockPostMessage(...args),
  }
}));

describe('messageServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getMessages exitoso', async () => {
    const mockMessages = {
      results: [
        { id: 1, text: 'Hola', isUser: true, time: '12:00' },
        { id: 2, text: '¿Cómo estás?', isUser: false, time: '12:01' }
      ]
    };
    mockGetMessages.mockResolvedValue(mockMessages);

    const { messagesService } = require('../services/messageServices');
    const result = await messagesService.getMessages(123);

    expect(mockGetMessages).toHaveBeenCalledWith(123);
    expect(result).toEqual(mockMessages);
  });

  test('getMessages falla con error de red', async () => {
    const mockError = { status: 500, text: 'Internal Server Error' };
    mockGetMessages.mockRejectedValue(mockError);
    const { messagesService } = require('../services/messageServices');

    await expect(messagesService.getMessages(123)).rejects.toEqual(mockError);
  });

  test('getMessages falla cuando no hay autenticación', async () => {
    const mockError = { status: 401, text: 'Unauthorized' };
    mockGetMessages.mockRejectedValue(mockError);
    const { messagesService } = require('../services/messageServices');

    await expect(messagesService.getMessages(123)).rejects.toEqual(mockError);
  });

  test('postMessage exitoso', async () => {
    const mockResponse = { id: 3, text: 'Hola bot', user: 1, chat: 123 };
    mockPostMessage.mockResolvedValue(mockResponse);
    const { messagesService } = require('../services/messageServices');
    const result = await messagesService.postMessage(123, '1', 'Hola bot');

    expect(mockPostMessage).toHaveBeenCalledWith(123, '1', 'Hola bot');
    expect(result).toEqual(mockResponse);
  });

  test('postMessage falla con error del servidor', async () => {
    const mockError = { status: 500, text: 'Server Error' };
    mockPostMessage.mockRejectedValue(mockError);
    const { messagesService } = require('../services/messageServices');

    await expect(messagesService.postMessage(123, '1', 'Hola bot'))
      .rejects.toEqual(mockError);
  });

  test('postMessage falla con error de validación', async () => {
    const mockError = { status: 400, text: 'Bad Request' };
    mockPostMessage.mockRejectedValue(mockError);
    const { messagesService } = require('../services/messageServices');

    await expect(messagesService.postMessage(123, '1', ''))
      .rejects.toEqual(mockError);
  });
});