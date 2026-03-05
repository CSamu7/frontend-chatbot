import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NavMenu from './NavMenu';

jest.mock('wouter', () => ({
  useLocation: jest.fn()
}));

jest.mock('./NavMenu.module.css', () => ({
  menu: 'menu',
  menuList: 'menuList',
  menuItem: 'menuItem',
  menuLink: 'menuLink',
  username: 'username',
  logoutBtn: 'logoutBtn'
}));

describe('NavMenu', () => {
  const mockUseLocation = require('wouter').useLocation;
  const mockNavigate = jest.fn();
  const mockOnLogin = jest.fn();
  const mockOnLogout = jest.fn().mockResolvedValue();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue(['/', mockNavigate]);
  });

  test('Renderiza botón de iniciar sesión si hay usuario', () => {
    render(
      <NavMenu 
        onLogin={mockOnLogin} 
        onLogout={mockOnLogout} 
        user={null} 
      />
    );
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cerrar sesión/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/testuser/i)).not.toBeInTheDocument();
  });

  test('Llama a onLogin al dar clic en iniciar sesión', () => {
    render(
      <NavMenu 
        onLogin={mockOnLogin} 
        onLogout={mockOnLogout} 
        user={null} 
      />
    );
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(loginButton);
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  test('Muestra el nombre de usuario cuando lo hay', () => {
    const mockUser = { username: 'testuser' };
    render(
      <NavMenu 
        onLogin={mockOnLogin} 
        onLogout={mockOnLogout} 
        user={mockUser} 
      />
    );
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /iniciar sesión/i })).not.toBeInTheDocument();
  });

  test('Muestra botón de cerrar sesión cuando hay usuario', () => {
    const mockUser = { username: 'testuser' };
    render(
      <NavMenu 
        onLogin={mockOnLogin} 
        onLogout={mockOnLogout} 
        user={mockUser} 
      />
    );
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
  });

  test('Llama a onLogout y dirige a home cuando se cierra sesión', async () => {
    const mockUser = { username: 'testuser' };
    render(
      <NavMenu 
        onLogin={mockOnLogin} 
        onLogout={mockOnLogout} 
        user={mockUser} 
      />
    );
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    fireEvent.click(logoutButton);
    await waitFor(() => {
      expect(mockOnLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('Clase correcta al botón de iniciar sesión', () => {
    render(
      <NavMenu 
        onLogin={mockOnLogin} 
        onLogout={mockOnLogout} 
        user={null} 
      />
    );
    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    expect(loginButton).toHaveClass('menuLink');
  });

  test('Clase correcta al nombre de usuario', () => {
    const mockUser = { username: 'testuser' };
    render(
      <NavMenu 
        onLogin={mockOnLogin} 
        onLogout={mockOnLogout} 
        user={mockUser} 
      />
    );
    const usernameElement = screen.getByText('testuser');
    expect(usernameElement).toHaveClass('username');
  });

  test('Aplica la clase correcta al botón de cerrar sesión', () => {
    const mockUser = { username: 'testuser' };
    render(
      <NavMenu 
        onLogin={mockOnLogin} 
        onLogout={mockOnLogout} 
        user={mockUser} 
      />
    );
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    expect(logoutButton).toHaveClass('logoutBtn');
  });

  test('No mostrar botón de logout cuando no hay usuario', () => {
    render(
      <NavMenu 
        onLogin={mockOnLogin} 
        onLogout={mockOnLogout} 
        user={null} 
      />
    );
    expect(screen.queryByRole('button', { name: /cerrar sesión/i })).not.toBeInTheDocument();
  });

  test('Estructura correcta de lista', () => {
    const mockUser = { username: 'testuser' };
    render(
      <NavMenu 
        onLogin={mockOnLogin} 
        onLogout={mockOnLogout} 
        user={mockUser} 
      />
    );
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });

  test('Un solo item cuando no hay usuario', () => {
    render(
      <NavMenu 
        onLogin={mockOnLogin} 
        onLogout={mockOnLogout} 
        user={null} 
      />
    );
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
  });
});