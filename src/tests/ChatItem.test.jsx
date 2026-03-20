import { render, screen, fireEvent } from '@testing-library/react';
import ChatItem from '../components/ChatItem';

jest.mock('wouter', () => ({
  Link: ({ children, href }) => <a href={href}>{children}</a>,
  useLocation: () => ['/chats/123', jest.fn()]
}));

describe('ChatItem Component', () => {
  const mockChat = {
    id: 1,
    title: 'Mi chat de prueba',
    date: '2024-01-15T10:30:00Z'
  };
  const mockOnDeleteChat = jest.fn();

  test('Renderiza el título y la fecha del chat', () => {
    render(
      <div> {}
        <ChatItem
          id={mockChat.id}
          title={mockChat.title}
          date={mockChat.date}
          onDeleteChat={mockOnDeleteChat}
        />
      </div>
    );
    expect(screen.getByText(mockChat.title)).toBeInTheDocument();
    const formattedDate = new Date(mockChat.date).toLocaleDateString();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  test('Llama a onDeleteChat cuando se hace click en eliminar', () => {
    render(
      <div>
        <ChatItem
          id={mockChat.id}
          title={mockChat.title}
          date={mockChat.date}
          onDeleteChat={mockOnDeleteChat}
        />
      </div>
    );
    const deleteButton = screen.getByRole('button', { name: 'X' });
    fireEvent.click(deleteButton);
    expect(mockOnDeleteChat).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteChat).toHaveBeenCalledWith(mockChat.id);
  });
});