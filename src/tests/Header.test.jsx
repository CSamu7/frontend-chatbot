import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

jest.mock('../components/Header.module.css', () => ({
  header: 'header'
}));

jest.mock('../components/Logo', () => {
  return function MockLogo() {
    return <div data-testid="mock-logo">Logo Mock</div>;
  };
});

describe('Header', () => {
  test('renderiza el header con children', () => {
    render(
      <Header>
        <div>Contenido del header</div>
      </Header>
    );
    
    expect(screen.getByText('Contenido del header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
  });

  test('aplica la clase header al elemento principal', () => {
    render(
      <Header>
        <span>test</span>
      </Header>
    );
    
    const header = document.querySelector('.header');
    expect(header).toHaveClass('header');
  });
});