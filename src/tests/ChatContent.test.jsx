import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ChatContent from '../components/ChatContent';

jest.mock('wouter', () => ({
  useLocation: () => ['/chats/123', jest.fn()]
}));

jest.mock('./ChatContent.module.css', () => ({
  chat: 'chat',
  message: 'message',
  ownMessage: 'ownMessage',
  botMessage: 'botMessage',
  messageTime: 'messageTime',
  emptyChatMessage: 'emptyChatMessage'
}));

describe('ChatContent', () => {
  const mockMessages = [
    { text: 'Hola', isUser: true, time: '12:00' },
    { text: '¿Cómo estás?', isUser: false, time: '12:01' },
    { text: 'Bien, gracias', isUser: true, time: '12:02' },
    { text: 'Me alegro', isUser: false, time: '12:03' }
  ];
  const mockOnMessages = jest.fn().mockResolvedValue();
  beforeEach(() => {
    mockOnMessages.mockClear();
  });

  test('muestra indicador de carga mientras obtiene mensajes', async () => {
    mockOnMessages.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    render(
      <ChatContent 
        idChat={1} 
        messages={[]} 
        onMessages={mockOnMessages} 
      />
    );
    expect(screen.getByText('Cargando mensajes...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Cargando mensajes...')).not.toBeInTheDocument();
    });
  });

  test('muestra mensaje inicial cuando no hay mensajes después de cargar', async () => {
    mockOnMessages.mockResolvedValue();
    render(
      <ChatContent 
        idChat={1} 
        messages={[]} 
        onMessages={mockOnMessages} 
      />
    );
    await waitFor(() => {
      expect(screen.queryByText('Cargando mensajes...')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Envia un mensaje para interactuar con el chatbot')).toBeInTheDocument();
  });

  test('renderiza los mensajes correctamente después de cargar', async () => {
    mockOnMessages.mockResolvedValue();
    render(
      <ChatContent 
        idChat={1} 
        messages={mockMessages} 
        onMessages={mockOnMessages} 
      />
    );
    await waitFor(() => {
      expect(screen.queryByText('Cargando mensajes...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Hola')).toBeInTheDocument();
    expect(screen.getByText('¿Cómo estás?')).toBeInTheDocument();
    expect(screen.getByText('Bien, gracias')).toBeInTheDocument();
    expect(screen.getByText('Me alegro')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('12:01')).toBeInTheDocument();
    expect(screen.getByText('12:02')).toBeInTheDocument();
    expect(screen.getByText('12:03')).toBeInTheDocument();
  });

  test('llama a onMessages cuando cambia idChat', async () => {
    mockOnMessages.mockResolvedValue();
    const { rerender } = render(
      <ChatContent 
        idChat={1} 
        messages={[]} 
        onMessages={mockOnMessages} 
      />
    );
    expect(mockOnMessages).toHaveBeenCalledWith(1);
    rerender(
      <ChatContent 
        idChat={2} 
        messages={[]} 
        onMessages={mockOnMessages} 
      />
    );
    await waitFor(() => {
      expect(mockOnMessages).toHaveBeenCalledWith(2);
    });
    expect(mockOnMessages).toHaveBeenCalledTimes(2);
  });

  test('no vuelve a llamar a onMessages si el idChat no cambia', async () => {
    mockOnMessages.mockResolvedValue();
    const { rerender } = render(
      <ChatContent 
        idChat={1} 
        messages={[]} 
        onMessages={mockOnMessages} 
      />
    );
    expect(mockOnMessages).toHaveBeenCalledTimes(1);
    rerender(
      <ChatContent 
        idChat={1} 
        messages={mockMessages} 
        onMessages={mockOnMessages} 
      />
    );
    expect(mockOnMessages).toHaveBeenCalledTimes(1);
  });

  test('maneja error en onMessages', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const testError = new Error('Error al cargar mensajes');
    mockOnMessages.mockRejectedValue(testError);

    render(
        <ChatContent 
        idChat={1} 
        messages={[]} 
         onMessages={mockOnMessages} 
        />
    );

    expect(screen.getByText('Cargando mensajes...')).toBeInTheDocument();
    await waitFor(() => {
        expect(screen.queryByText('Cargando mensajes...')).not.toBeInTheDocument();
    });
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(mockOnMessages).toHaveBeenCalledWith(1);
    consoleErrorSpy.mockRestore();
    });
});