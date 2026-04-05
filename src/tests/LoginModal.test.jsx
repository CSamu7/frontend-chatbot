import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginModal from '../components/LoginModal';

jest.mock('../hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('wouter', () => ({
  useLocation: jest.fn(),
  Link: ({ children, href }) => <a href={href}>{children}</a>
}));

jest.mock('./LoginModal.module.css', () => ({
  modal: 'modal',
  modalContent: 'modalContent',
  error: 'error'
}));

describe('LoginModal', () => {
  const mockUseUser = require('../hooks/useUser').default;
  const mockUseLocation = require('wouter').useLocation;
  const mockNavigate = jest.fn();
  const mockCloseModal = jest.fn();
  const mockLogin = jest.fn();

  const mockUseUserReturn = {
    login: mockLogin
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUser.mockReturnValue(mockUseUserReturn);
    mockUseLocation.mockReturnValue(['/chats/123', mockNavigate]);
  });

  test('Renderiza el modal correctamente', () => {
    render(<LoginModal closeModal={mockCloseModal} />);

    expect(screen.getByText('Inicia sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('¿No estás registrado?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Iniciar sesión')).toBeInTheDocument();
  });

  test('Cierra el modal cuando se hace click en el overlay', () => {
    render(<LoginModal closeModal={mockCloseModal} />);
    const overlay = document.querySelector('.modal');
    fireEvent.click(overlay);
    expect(mockCloseModal).toHaveBeenCalled();
  });

  test('No cierra el modal cuando se hace click en el contenido', () => {
    render(<LoginModal closeModal={mockCloseModal} />);
    const modalContent = document.querySelector('.modalContent');
    fireEvent.click(modalContent);
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  test('Llama a login con email y password cuando se envía el formulario', async () => {
    mockLogin.mockResolvedValue();
    render(<LoginModal closeModal={mockCloseModal} />);
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByDisplayValue('Iniciar sesión');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  test('Muestra error cuando el login falla', async () => {
    const errorMessage = 'Credenciales inválidas';
    mockLogin.mockRejectedValue({ error: errorMessage });
    render(<LoginModal closeModal={mockCloseModal} />);
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByDisplayValue('Iniciar sesión');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockCloseModal).not.toHaveBeenCalled();
    });
  });

  test('limpia el error antes de intentar login', async () => {
    mockLogin.mockRejectedValueOnce({ error: 'Error 1' });
    mockLogin.mockResolvedValueOnce();

    render(<LoginModal closeModal={mockCloseModal} />);
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByDisplayValue('Iniciar sesión');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Error 1')).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: 'correct' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  test('el enlace de registro apunta a /signup', () => {
    render(<LoginModal closeModal={mockCloseModal} />);
    const registerLink = screen.getByText('¿No estás registrado?');
    expect(registerLink).toHaveAttribute('href', '/signup');
  });

  test('los campos son requeridos', () => {
    render(<LoginModal closeModal={mockCloseModal} />);
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test('el input de email es de tipo email', () => {
    render(<LoginModal closeModal={mockCloseModal} />);
    const emailInput = screen.getByLabelText('Correo electrónico');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('el input de password es de tipo password', () => {
    render(<LoginModal closeModal={mockCloseModal} />);
    const passwordInput = screen.getByLabelText('Contraseña');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});