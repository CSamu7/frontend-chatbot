import { render, screen } from '@testing-library/react';
import NoChatSelected from '../components/NoChatSelected';

jest.mock('../components/NoChatSelected.module.css', () => ({
  noChatContainer: 'noChatContainer',
  noChatMessage: 'noChatMessage',
  noChatIcon: 'noChatIcon'
}));

describe('NoChatSelected', () => {
  test('renderiza el icono de chat', () => {
    render(<NoChatSelected />);
    
    const icon = screen.getByText('💬');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('noChatIcon');
  });

  test('renderiza el mensaje principal', () => {
    render(<NoChatSelected />);
    
    const message = screen.getByText(/selecciona una conversación/i);
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('noChatMessage');
  });

  test('aplica la clase container', () => {
    render(<NoChatSelected />);
    
    const container = screen.getByText('💬').parentElement;
    expect(container).toHaveClass('noChatContainer');
  });
});