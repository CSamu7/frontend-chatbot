import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import InputMessage from '../components/InputMessage';
import { ErrorContext } from '../context/ErrorContext';

jest.mock('wouter', () => ({
  useLocation: jest.fn()
}));

jest.mock('../assets/chatbot_send_icon.png', () => 'send-icon.png');

describe('InputMessage', () => {
  const mockUseLocation = require('wouter').useLocation;
  const mockNavigate = jest.fn();
  const mockSetError = jest.fn();
  const mockOnPostMessage = jest.fn();
  const mockOnPostChat = jest.fn();
  const mockOnModifyChat = jest.fn();
  const mockMessages = [];
  const renderComponent = (props = {}) => {
    return render(
      <ErrorContext.Provider value={[null, mockSetError]}>
        <InputMessage
          onPostMessage={mockOnPostMessage}
          onPostChat={mockOnPostChat}
          onModifyChat={mockOnModifyChat}
          messages={mockMessages}
          {...props}
        />
      </ErrorContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue(['/chats/123', mockNavigate]);
  });

  describe('En un chat existente', () => {
    beforeEach(() => {
      mockUseLocation.mockReturnValue(['/chats/123', mockNavigate]);
    });

    test('envía mensaje en chat existente', async () => {
      mockOnPostMessage.mockResolvedValue();
      renderComponent();
      const textarea = screen.getByPlaceholderText('Escribe tu mensaje aquí...');
      const sendButton = screen.getByRole('button');
      fireEvent.change(textarea, { target: { value: 'Hola bot' } });
      fireEvent.click(sendButton);
      await waitFor(() => {
        expect(mockOnPostMessage).toHaveBeenCalledWith(123, 'Hola bot');
        expect(mockOnPostChat).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test('modifica el título si es el primer mensaje', async () => {
      mockOnPostMessage.mockResolvedValue();
      renderComponent({ messages: [] });
      const textarea = screen.getByPlaceholderText('Escribe tu mensaje aquí...');
      const sendButton = screen.getByRole('button');
      const longMessage = 'Este es un mensaje muy largo que debería truncarse a 47 caracteres';
      fireEvent.change(textarea, { target: { value: longMessage } });
      fireEvent.click(sendButton);
      const expectedTitle = longMessage.slice(0, 47) + '...';
      await waitFor(() => {
        expect(mockOnModifyChat).toHaveBeenCalledWith(123, expectedTitle);
        expect(mockOnPostMessage).toHaveBeenCalledWith(123, longMessage);
      });
    });

    test('No modifica el título si ya hay mensajes', async () => {
      mockOnPostMessage.mockResolvedValue();
      renderComponent({ messages: [{ id: 1, text: 'Mensaje anterior' }] });
      const textarea = screen.getByPlaceholderText('Escribe tu mensaje aquí...');
      const sendButton = screen.getByRole('button');
      fireEvent.change(textarea, { target: { value: 'Hola bot' } });
      fireEvent.click(sendButton);
      await waitFor(() => {
        expect(mockOnModifyChat).not.toHaveBeenCalled();
        expect(mockOnPostMessage).toHaveBeenCalledWith(123, 'Hola bot');
      });
    });
  });

  describe('Creando un nuevo chat', () => {
    beforeEach(() => {
      mockUseLocation.mockReturnValue(['/', mockNavigate]);
    });

    test('crea nuevo chat y envía mensaje', async () => {
      const newChat = { id: 456 };
      mockOnPostChat.mockResolvedValue(newChat);
      mockOnPostMessage.mockResolvedValue();
      renderComponent();
      const textarea = screen.getByPlaceholderText('Escribe tu mensaje aquí...');
      const sendButton = screen.getByRole('button');
      const messageText = 'Hola bot';
      fireEvent.change(textarea, { target: { value: messageText } });
      fireEvent.click(sendButton);
      const expectedTitle = messageText.slice(0, 47) + '...';
      await waitFor(() => {
        expect(mockOnPostChat).toHaveBeenCalledWith(expectedTitle);
        expect(mockOnPostMessage).toHaveBeenCalledWith(456, messageText);
        expect(mockNavigate).toHaveBeenCalledWith('/chats/456');
      });
    });
  });

  describe('Comportamiento del input', () => {
    test('limpia el textarea después de enviar exitosamente', async () => {
      mockOnPostMessage.mockResolvedValue();
      renderComponent();
      const textarea = screen.getByPlaceholderText('Escribe tu mensaje aquí...');
      const sendButton = screen.getByRole('button');
      fireEvent.change(textarea, { target: { value: 'Hola bot' } });
      fireEvent.click(sendButton);
      await waitFor(() => {
        expect(textarea.value).toBe('');
      });
    });

    test('deshabilita inputs mientras envía', async () => {
    let resolvePromise;
    const promise = new Promise(resolve => {
        resolvePromise = resolve;
    });
    mockOnPostMessage.mockImplementation(() => promise);
    renderComponent();
    const textarea = screen.getByPlaceholderText('Escribe tu mensaje aquí...');
    const sendButton = screen.getByRole('button');
    fireEvent.change(textarea, { target: { value: 'Hola bot' } });
      await act(async () => {
        fireEvent.click(sendButton);
        await new Promise(resolve => setTimeout(resolve, 10));
     });
    expect(textarea).toBeDisabled();
    expect(sendButton).toBeDisabled();
    await act(async () => {
        resolvePromise();
        await new Promise(resolve => setTimeout(resolve, 10));
    });
    expect(textarea).not.toBeDisabled();
    expect(sendButton).not.toBeDisabled();
    });

    test('no envía mensaje vacío', () => {
      renderComponent();
      const sendButton = screen.getByRole('button');
      fireEvent.click(sendButton);
      expect(mockOnPostMessage).not.toHaveBeenCalled();
      expect(mockOnPostChat).not.toHaveBeenCalled();
    });

    test('no envía mensaje con solo espacios', () => {
      renderComponent();
      const textarea = screen.getByPlaceholderText('Escribe tu mensaje aquí...');
      const sendButton = screen.getByRole('button');
      fireEvent.change(textarea, { target: { value: '   ' } });
      fireEvent.click(sendButton);
      expect(mockOnPostMessage).not.toHaveBeenCalled();
      expect(mockOnPostChat).not.toHaveBeenCalled();
    });
  });

  describe('Manejo de errores', () => {
    test('muestra error cuando falla el envío', async () => {
      const mockError = { detail: 'Error al enviar mensaje' };
      mockOnPostMessage.mockRejectedValue(mockError);
      renderComponent();
      const textarea = screen.getByPlaceholderText('Escribe tu mensaje aquí...');
      const sendButton = screen.getByRole('button');
      const messageText = 'Hola bot';
      fireEvent.change(textarea, { target: { value: messageText } });
      fireEvent.click(sendButton);
      await waitFor(() => {
        expect(mockSetError).toHaveBeenCalledWith('Error al enviar mensaje. Intenta de nuevo.');
      });
      expect(textarea.value).toBe('');
    });

    test('limpia el error antes de enviar', async () => {
      mockOnPostMessage.mockResolvedValue();
      renderComponent();
      const textarea = screen.getByPlaceholderText('Escribe tu mensaje aquí...');
      const sendButton = screen.getByRole('button');
      fireEvent.change(textarea, { target: { value: 'Hola bot' } });
      fireEvent.click(sendButton);
      await waitFor(() => {
        expect(mockSetError).toHaveBeenCalledWith('');
      });
    });
  });

  describe('Validación de ID de chat', () => {
    test('maneja idChat inválido en ruta de chat', () => {
    mockUseLocation.mockReturnValue(['/chats/invalid', mockNavigate]);
    renderComponent();
    const textarea = screen.getByPlaceholderText('Escribe tu mensaje aquí...');
    const sendButton = screen.getByRole('button');
    fireEvent.change(textarea, { target: { value: 'Hola bot' } });
    fireEvent.click(sendButton);
    expect(mockOnPostMessage).toHaveBeenCalledWith(NaN, 'Hola bot');
    expect(mockOnPostChat).not.toHaveBeenCalled();
    });
  });
});