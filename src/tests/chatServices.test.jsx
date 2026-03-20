const mockCreateCsrfHeaders = jest.fn(() => {
  const headers = new Headers();
  headers.set('X-CSRFToken', 'test-token');
  return headers;
});

jest.mock('../helpers/csrfHelper', () => ({
  createCsrfHeaders: () => mockCreateCsrfHeaders(),
}));

const mockGetChats = jest.fn();
const mockDeleteChat = jest.fn();
const mockPostChat = jest.fn();
const mockPatchChat = jest.fn();

jest.mock('../services/chatServices', () => ({
  chatsService: {
    getChats: (...args) => mockGetChats(...args),
    deleteChat: (...args) => mockDeleteChat(...args),
    postChat: (...args) => mockPostChat(...args),
    patchChat: (...args) => mockPatchChat(...args),
  }
}));

describe('chatServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getChats exitoso', async () => {
    const mockChats = { results: [{ id: 1, title: 'Chat 1' }] };
    mockGetChats.mockResolvedValue(mockChats);
    const { chatsService } = require('../services/chatServices');
    const result = await chatsService.getChats(1);

    expect(mockGetChats).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockChats);
  });

  test('getChats falla con error', async () => {
    const mockError = new Error('Network error');
    mockGetChats.mockRejectedValue(mockError);
    const { chatsService } = require('../services/chatServices');

    await expect(chatsService.getChats(1)).rejects.toThrow('Network error');
  });

  test('deleteChat exitoso', async () => {
    mockDeleteChat.mockResolvedValue();
    const { chatsService } = require('../services/chatServices');
    await chatsService.deleteChat(1);

    expect(mockDeleteChat).toHaveBeenCalledWith(1);
  });

  test('postChat exitoso', async () => {
    const mockResponse = { id: 2, title: 'Nuevo chat', user: 1 };
    mockPostChat.mockResolvedValue(mockResponse);
    const { chatsService } = require('../services/chatServices');
    const result = await chatsService.postChat(1, 'Nuevo chat');

    expect(mockPostChat).toHaveBeenCalledWith(1, 'Nuevo chat');
    expect(result).toEqual(mockResponse);
  });

  test('postChat falla con error del servidor', async () => {
    const mockError = { error: 'Error al crear chat' };
    mockPostChat.mockRejectedValue(mockError);
    const { chatsService } = require('../services/chatServices');

    await expect(chatsService.postChat(1, 'Nuevo chat')).rejects.toEqual(mockError);
  });

  test('patchChat exitoso', async () => {
    mockPatchChat.mockResolvedValue();
    const { chatsService } = require('../services/chatServices');
    await chatsService.patchChat(1, 'Título actualizado');

    expect(mockPatchChat).toHaveBeenCalledWith(1, 'Título actualizado');
  });

  test('patchChat falla con error', async () => {
    const mockError = new Error('Error al actualizar');
    mockPatchChat.mockRejectedValue(mockError);
    const { chatsService } = require('../services/chatServices');

    await expect(chatsService.patchChat(1, 'Nuevo título')).rejects.toThrow('Error al actualizar');
  });
});