import { render, screen } from '@testing-library/react';
import Logo from '../components/Logo';

jest.mock('../assets/logo.png', () => 'logo-test.png');

jest.mock('../components/Logo.module.css', () => ({
  logo: 'logo',
  logoImg: 'logoImg',
  logoText: 'logoText'
}));

describe('Logo', () => {
  test('renderiza la imagen del logo', () => {
    render(<Logo />);
    
    const logoImage = screen.getByRole('img');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'logo-test.png');
    expect(logoImage).toHaveClass('logoImg');
  });

  test('renderiza el texto con enlace', () => {
    render(<Logo />);
    
    const logoLink = screen.getByText('BookBot');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveClass('logoText');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  test('aplica la clase logo al contenedor principal', () => {
    render(<Logo />);
    
    const container = screen.getByText('BookBot').parentElement;
    expect(container).toHaveClass('logo');
  });

  test('la imagen tiene el atributo alt con el texto correcto', () => {
    render(<Logo />);
    
    const logoImage = screen.getByRole('img');
    expect(logoImage).toHaveAttribute('alt', 'Logo de SamuBot');
  });
});