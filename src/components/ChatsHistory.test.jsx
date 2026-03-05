import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatsHistory from './ChatsHistory';
import { ErrorContext } from '../context/ErrorContext';

jest.mock('wouter', () => ({
  useLocation: jest.fn()
}));

jest.mock('./ChatItem', () => {
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

jest.mock('./ChatsHistory.module.css', () => ({
  pastConversations: 'pastConversations',
  header: 'header',
  createChatbtn: 'createChatbtn',
  title: 'title',
  chatItems: 'chatItems',
  messageNotChats: 'messageNotChats'
}));

describe('ChatsHistory', () => {
  const mockUseLocation = require('wouter').useLocation;
  const mockNavigate = jest.fn();
  const mockSetError = jest.fn();
  const mockOnPostChat = jest.fn();
  const mockOnDeleteChat = jest.fn();
  const mockOnSetActiveChat = jest.fn();
  
  const mockChats = [
    { id: 1, title: 'Chat 1', created_at: '2024-01-15T10:30:00Z' },
    { id: 2, title: 'Chat 2', created_at: '2024-01-16T14:20:00Z' },
    { id: 3, title: 'Chat 3', created_at: '2024-01-17T09:15:00Z' }
  ];

  const renderComponent = (props = {}) => {
    return render(
      <ErrorContext.Provider value={[null, mockSetError]}>
        <ChatsHistory
          chats={mockChats}
          onPostChat={mockOnPostChat}
          onDeleteChat={mockOnDeleteChat}
          onSetActiveChat={mockOnSetActiveChat}
          {...props}
        />
      </ErrorContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue(['/chats/123', mockNavigate]);
  });

  test('renderiza el título correctamente', () => {
    renderComponent();
    expect(screen.getByText('Conversaciones pasadas')).toBeInTheDocument();
  });

  test('renderiza el botón de crear chat', () => {
    renderComponent();
    const createButton = screen.getByRole('button', { name: '+' });
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
    renderComponent({ chats: [] });
    expect(screen.getByText('No tienes chats recientes')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-chat-item')).not.toBeInTheDocument();
  });

  test('llama a onPostChat y navega cuando se crea un nuevo chat', async () => {
    const newChat = { id: 4 };
    mockOnPostChat.mockResolvedValue(newChat);
    renderComponent();
    const createButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('');
      expect(mockOnPostChat).toHaveBeenCalledWith('Nuevo chat');
      expect(mockNavigate).toHaveBeenCalledWith('/chats/4');
    });
  });

  test('limpia el error antes de crear chat', async () => {
    const newChat = { id: 4 };
    mockOnPostChat.mockResolvedValue(newChat);
    renderComponent();
    const createButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('');
    });
  });

  test('maneja error al crear chat', async () => {
    const errorDetail = 'Error al crear el chat';
    mockOnPostChat.mockRejectedValue({ detail: errorDetail });
    renderComponent();
    const createButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(errorDetail);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('llama a onDeleteChat cuando se elimina un chat', async () => {
    mockOnDeleteChat.mockResolvedValue();
    renderComponent();
    const deleteButtons = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(mockOnDeleteChat).toHaveBeenCalledWith(1);
    });
  });

  test('llama a onSetActiveChat cuando se activa un chat', () => {
    renderComponent();
    const activateButtons = screen.getAllByRole('button', { name: 'Activar' });
    fireEvent.click(activateButtons[1]); // Activa el segundo chat
    expect(mockOnSetActiveChat).toHaveBeenCalledWith(2);
  });

  test('pasa las props correctas a ChatItem', () => {
    renderComponent();
    const chatItems = screen.getAllByTestId('mock-chat-item');
    expect(chatItems[0]).toHaveAttribute('data-id', '1');
    expect(chatItems[1]).toHaveAttribute('data-id', '2');
    expect(chatItems[2]).toHaveAttribute('data-id', '3');
    expect(screen.getByText('Chat 1')).toBeInTheDocument();
    expect(screen.getByText('Chat 2')).toBeInTheDocument();
    expect(screen.getByText('Chat 3')).toBeInTheDocument();
  });

  test('formatea las fechas correctamente', () => {
    renderComponent();
    const chatItems = screen.getAllByTestId('mock-chat-item');
    expect(chatItems[0]).toHaveTextContent('2024-01-15T10:30:00Z');
    expect(chatItems[1]).toHaveTextContent('2024-01-16T14:20:00Z');
    expect(chatItems[2]).toHaveTextContent('2024-01-17T09:15:00Z');
  });

  test('maneja error sin detail', async () => {
    mockOnPostChat.mockRejectedValue({});
    renderComponent();
    const createButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(undefined);
    });
  });
});