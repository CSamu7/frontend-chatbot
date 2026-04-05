import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatsHistory from '../components/ChatsHistory';
import { ErrorContext } from '../context/ErrorContext';

jest.mock('../services/chatServices', () => ({
  chatsService: {
    getChats: jest.fn().mockResolvedValue([]),
    postChat: jest.fn().mockResolvedValue({ id: 1, title: 'Nuevo chat', created_at: new Date().toISOString() }),
    deleteChat: jest.fn().mockResolvedValue(),
    patchChat: jest.fn().mockResolvedValue(),
  }
}));

jest.mock('wouter', () => ({
  useLocation: jest.fn()
}));

jest.mock('../hooks/useChat', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../components/ChatItem', () => {
  return function MockChatItem({ id, title, date, onDeleteChat, onSetActiveChat }) {
    return (
      <div data-testid="mock-chat-item" data-id={id}>
        <span>{title}</span>
        <span>{date}</span>
        <button onClick={() => onDeleteChat(id)}>Eliminar</button>
        <button onClick={() => onSetActiveChat(id)}>Activar</button>
      </div>
    );
  };
});

jest.mock('../components/ChatsHistory.module.css', () => ({
  pastConversations: 'pastConversations',
  header: 'header',
  createChatbtn: 'createChatbtn',
  title: 'title',
  chatItems: 'chatItems',
  messageNotChats: 'messageNotChats',
  icon: 'icon',
  buttonText: 'buttonText'
}));

describe('ChatsHistory', () => {
  const mockUseLocation = require('wouter').useLocation;
  const mockNavigate = jest.fn();
  const mockSetError = jest.fn();
  const mockOnSetActiveChat = jest.fn();
  const mockPostChat = jest.fn();
  const mockDeleteChat = jest.fn();
  
  const mockChats = [
    { id: 1, title: 'Chat 1', created_at: '2024-01-15T10:30:00Z' },
    { id: 2, title: 'Chat 2', created_at: '2024-01-16T14:20:00Z' },
    { id: 3, title: 'Chat 3', created_at: '2024-01-17T09:15:00Z' }
  ];

  const useChat = require('../hooks/useChat').default;

  const renderComponent = () => {
    useChat.mockReturnValue({
      chats: mockChats,
      deleteChat: mockDeleteChat,
      postChat: mockPostChat,
    });
    
    return render(
      <ErrorContext.Provider value={[null, mockSetError]}>
        <ChatsHistory user={{ id: 1 }} onSetActiveChat={mockOnSetActiveChat} />
      </ErrorContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue(['/chats/123', mockNavigate]);
    mockPostChat.mockResolvedValue({ id: 4, title: 'Nuevo chat', created_at: new Date().toISOString() });
  });

  test('renderiza el título correctamente', () => {
    renderComponent();
    expect(screen.getByText('Conversaciones pasadas')).toBeInTheDocument();
  });

  test('renderiza el botón de crear chat', () => {
    renderComponent();
    const createButton = screen.getByRole('button', { name: /crear nuevo chat/i });
    expect(createButton).toBeInTheDocument();
  });

  test('renderiza la lista de chats cuando hay chats', () => {
    renderComponent();
    const chatItems = screen.getAllByTestId('mock-chat-item');
    expect(chatItems).toHaveLength(3);
    expect(screen.getByText('Chat 1')).toBeInTheDocument();
    expect(screen.getByText('Chat 2')).toBeInTheDocument();
    expect(screen.getByText('Chat 3')).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay chats', () => {
    useChat.mockReturnValue({
      chats: [],
      deleteChat: mockDeleteChat,
      postChat: mockPostChat,
    });
    render(
      <ErrorContext.Provider value={[null, mockSetError]}>
        <ChatsHistory user={{ id: 1 }} onSetActiveChat={mockOnSetActiveChat} />
      </ErrorContext.Provider>
    );
    expect(screen.getByText('No tienes chats recientes')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-chat-item')).not.toBeInTheDocument();
  });

  test('llama a postChat y navega cuando se crea un nuevo chat', async () => {
    renderComponent();
    const createButton = screen.getByRole('button', { name: /crear nuevo chat/i });
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(mockPostChat).toHaveBeenCalledWith('Nuevo chat');
      expect(mockNavigate).toHaveBeenCalledWith('/chats/4');
    });
  });

  test('maneja error al crear chat', async () => {
    mockPostChat.mockRejectedValue({ detail: 'Error al crear chat' });
    renderComponent();
    const createButton = screen.getByRole('button', { name: /crear nuevo chat/i });
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('Error al crear chat. Intenta de nuevo.');
    });
  });

  test('maneja error sin detail', async () => {
    mockPostChat.mockRejectedValue({});
    renderComponent();
    const createButton = screen.getByRole('button', { name: /crear nuevo chat/i });
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('Error al crear chat. Intenta de nuevo.');
    });
  });

  test('llama a deleteChat cuando se elimina un chat', async () => {
    renderComponent();
    const deleteButtons = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(mockDeleteChat).toHaveBeenCalledWith(1);
    });
  });

  test('llama a onSetActiveChat cuando se activa un chat', () => {
    renderComponent();
    const activateButtons = screen.getAllByRole('button', { name: 'Activar' });
    fireEvent.click(activateButtons[1]);
    expect(mockOnSetActiveChat).toHaveBeenCalledWith(2);
  });

  test('pasa las props correctas a ChatItem', () => {
    renderComponent();
    const chatItems = screen.getAllByTestId('mock-chat-item');
    expect(chatItems[0]).toHaveAttribute('data-id', '1');
    expect(chatItems[1]).toHaveAttribute('data-id', '2');
    expect(chatItems[2]).toHaveAttribute('data-id', '3');
  });

  test('formatea las fechas correctamente', () => {
    renderComponent();
    const chatItems = screen.getAllByTestId('mock-chat-item');
    expect(chatItems[0]).toHaveTextContent('2024');
    expect(chatItems[1]).toHaveTextContent('2024');
    expect(chatItems[2]).toHaveTextContent('2024');
  });
});