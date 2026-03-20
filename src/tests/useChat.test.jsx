import { renderHook, act, waitFor } from '@testing-library/react';
import useChat from '../hooks/useChat';

const mockGetChats = jest.fn();
const mockDeleteChat = jest.fn();
const mockPatchChat = jest.fn();
const mockPostChat = jest.fn();

jest.mock('../services/chatServices', () => ({
  chatsService: {
    getChats: (...args) => mockGetChats(...args),
    deleteChat: (...args) => mockDeleteChat(...args),
    patchChat: (...args) => mockPatchChat(...args),
    postChat: (...args) => mockPostChat(...args),
  }
}));

describe('useChat', () => {
  const mockUser = { id: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('carga los chats cuando hay usuario', async () => {
    const mockChats = { results: [{ id: 1, title: 'Chat 1' }] };
    mockGetChats.mockResolvedValue(mockChats);

    const { result } = renderHook(() => useChat(mockUser));

    await waitFor(() => {
      expect(result.current.chats).toEqual(mockChats.results);
    });
    expect(mockGetChats).toHaveBeenCalledWith(1);
  });

  test('no carga chats cuando no hay usuario', () => {
    renderHook(() => useChat(null));
    
    expect(mockGetChats).not.toHaveBeenCalled();
  });

  test('elimina un chat', async () => {
    const initialChats = { results: [{ id: 1, title: 'Chat 1' }] };
    mockGetChats.mockResolvedValue(initialChats);
    mockDeleteChat.mockResolvedValue();

    const { result } = renderHook(() => useChat(mockUser));

    await waitFor(() => {
      expect(result.current.chats).toEqual([{ id: 1, title: 'Chat 1' }]);
    });

    await act(async () => {
      await result.current.deleteChat(1);
    });

    expect(mockDeleteChat).toHaveBeenCalledWith(1);
    expect(result.current.chats).toEqual([]);
  });

  test('modifica un chat', async () => {
    const initialChats = { results: [{ id: 1, title: 'Chat 1' }] };
    mockGetChats.mockResolvedValue(initialChats);
    mockPatchChat.mockResolvedValue();

    const { result } = renderHook(() => useChat(mockUser));

    await waitFor(() => {
      expect(result.current.chats).toEqual([{ id: 1, title: 'Chat 1' }]);
    });

    await act(async () => {
      await result.current.modifyChat(1, 'Nuevo título');
    });

    expect(mockPatchChat).toHaveBeenCalledWith(1, 'Nuevo título');
    expect(result.current.chats[0].title).toBe('Nuevo título');
  });

  test('crea un nuevo chat', async () => {
    const initialChats = { results: [] };
    const newChat = { id: 2, title: 'Nuevo chat' };
    const updatedChats = { results: [newChat] };
    
    localStorage.setItem('id', '1');
    mockGetChats.mockResolvedValueOnce(initialChats);
    mockPostChat.mockResolvedValue(newChat);
    mockGetChats.mockResolvedValueOnce(updatedChats);

    const { result } = renderHook(() => useChat(mockUser));

    await waitFor(() => {
      expect(result.current.chats).toEqual([]);
    });

    let createdChat;
    await act(async () => {
      createdChat = await result.current.postChat('Nuevo chat');
    });

    expect(mockPostChat).toHaveBeenCalledWith('1', 'Nuevo chat');
    expect(createdChat).toEqual(newChat);
    await waitFor(() => {
      expect(result.current.chats).toEqual([newChat]);
    });
  });
});