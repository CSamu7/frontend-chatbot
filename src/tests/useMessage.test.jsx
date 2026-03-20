import { renderHook, act, waitFor } from '@testing-library/react';
import useMessage from '../hooks/useMessage';

const mockGetMessages = jest.fn();
const mockPostMessage = jest.fn();

jest.mock('../services/messageServices', () => ({
  messagesService: {
    getMessages: (...args) => mockGetMessages(...args),
    postMessage: (...args) => mockPostMessage(...args),
  }
}));

describe('useMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('obtiene mensajes de un chat', async () => {
    const mockMessages = {
      results: [
        { id: 1, text: 'Hola', isUser: true, time: '12:00' },
        { id: 2, text: '¿Cómo estás?', isUser: false, time: '12:01' }
      ]
    };
    mockGetMessages.mockResolvedValue(mockMessages);

    const { result } = renderHook(() => useMessage());

    await act(async () => {
      await result.current.getMessages(123);
    });

    expect(mockGetMessages).toHaveBeenCalledWith(123);
    expect(result.current.messages).toEqual(mockMessages.results);
  });

  test('envía un mensaje y actualiza los mensajes', async () => {
    const updatedMessages = { 
      results: [{ id: 1, text: 'Hola bot', isUser: true, time: '12:02' }] 
    };
    
    localStorage.setItem('id', '1');
    mockPostMessage.mockResolvedValue();
    mockGetMessages.mockResolvedValue(updatedMessages);

    const { result } = renderHook(() => useMessage());

    await act(async () => {
      await result.current.postMessage(123, 'Hola bot');
    });

    expect(mockPostMessage).toHaveBeenCalledWith(123, '1', 'Hola bot');
    expect(mockGetMessages).toHaveBeenCalledTimes(1);
    expect(mockGetMessages).toHaveBeenCalledWith(123);
    expect(result.current.messages).toEqual(updatedMessages.results);
  });

  test('getMessages se llama después de postMessage', async () => {
    localStorage.setItem('id', '1');
    mockPostMessage.mockResolvedValue();
    mockGetMessages.mockResolvedValue({ results: [] });

    const { result } = renderHook(() => useMessage());
    let callOrder = [];
    
    mockPostMessage.mockImplementation(() => {
      callOrder.push('postMessage');
      return Promise.resolve();
    });
    
    mockGetMessages.mockImplementation(() => {
      callOrder.push('getMessages');
      return Promise.resolve({ results: [] });
    });

    await act(async () => {
      await result.current.postMessage(123, 'Hola');
    });

    expect(callOrder[0]).toBe('postMessage');
    expect(callOrder[1]).toBe('getMessages');
    expect(mockPostMessage).toHaveBeenCalledTimes(1);
    expect(mockGetMessages).toHaveBeenCalledTimes(1);
  });

  test('mensajes iniciales están vacíos', () => {
    const { result } = renderHook(() => useMessage());
    expect(result.current.messages).toEqual([]);
  });

  test('getMessages actualiza el estado correctamente', async () => {
    const mockMessages = { results: [{ id: 1, text: 'Test', isUser: true, time: '12:00' }] };
    mockGetMessages.mockResolvedValue(mockMessages);

    const { result } = renderHook(() => useMessage());

    await act(async () => {
      await result.current.getMessages(456);
    });

    expect(result.current.messages).toEqual(mockMessages.results);
  });
});