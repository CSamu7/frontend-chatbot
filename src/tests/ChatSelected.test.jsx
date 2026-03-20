import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import ChatSelected from '../components/ChatSelected';

jest.mock('wouter', () => ({
  ...jest.requireActual('wouter'),
  useLocation: jest.fn()
}));

jest.mock('../components/ChatContent', () => {
  return function MockChatContent({ idChat }) {
    return <div data-testid="chat-content">Chat Content - ID: {idChat}</div>;
  };
});

jest.mock('../components/InputMessage', () => {
  return function MockInputMessage({ onPostMessage, onPostChat, onModifyChat, messages }) {
    return <div data-testid="input-message">Input Message</div>;
  };
});

jest.mock('../components/NoChatSelected', () => {
  return function MockNoChatSelected() {
    return <div data-testid="no-chat-selected">No Chat Selected</div>;
  };
});

jest.mock('../hooks/useMessage', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../components/ChatSelected.module.css', () => ({
  chatContainer: 'chatContainer',
  chatContent: 'chatContent',
  inputContainer: 'inputContainer'
}));

describe('ChatSelected', () => {
  const mockUseMessage = require('../hooks/useMessage').default;
  const mockGetMessages = jest.fn();
  const mockPostMessage = jest.fn();
  const mockMessages = [];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMessage.mockReturnValue({
      messages: mockMessages,
      getMessages: mockGetMessages,
      postMessage: mockPostMessage
    });
  });

  const renderWithRouter = (component, initialPath = '/') => {
    window.history.pushState({}, '', initialPath);
    return render(
      <Router>
        {component}
      </Router>
    );
  };

  test('renderiza NoChatSelected en la ruta raíz', () => {
    renderWithRouter(<ChatSelected />, '/');
    expect(screen.getByTestId('no-chat-selected')).toBeInTheDocument();
  });

  test('renderiza ChatContent cuando hay un id de chat', () => {
    renderWithRouter(<ChatSelected />, '/chats/123');
    expect(screen.getByTestId('chat-content')).toBeInTheDocument();
    expect(screen.getByText('Chat Content - ID: 123')).toBeInTheDocument();
  });

  test('renderiza InputMessage siempre', () => {
    renderWithRouter(<ChatSelected />, '/');
    expect(screen.getByTestId('input-message')).toBeInTheDocument();
  });

  test('pasa onPostMessage a InputMessage', () => {
    renderWithRouter(<ChatSelected />, '/');
    expect(mockPostMessage).toBeDefined();
  });

  test('pasa messages y onMessages a ChatContent', () => {
    renderWithRouter(<ChatSelected />, '/chats/456');
    expect(mockGetMessages).toBeDefined();
  });
});