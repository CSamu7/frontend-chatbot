import { renderHook, act, waitFor } from '@testing-library/react';
import useUser from '../hooks/useUser';

// Mock completo del módulo userServices
jest.mock('../services/userServices', () => ({
  userServices: {
    getUser: jest.fn(),
    registerUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  }
}));

import { userServices } from '../services/userServices';

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('usuario inicial es null', () => {
    const { result } = renderHook(() => useUser());
    expect(result.current.user).toBeNull();
  });

  test('carga usuario desde localStorage al montar', async () => {
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
    localStorage.setItem('id', '1');
    userServices.getUser.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(userServices.getUser).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
    });
  });

  test('no carga usuario si no hay id en localStorage', () => {
    localStorage.removeItem('id');
    renderHook(() => useUser());
    
    expect(userServices.getUser).not.toHaveBeenCalled();
  });

  test('login exitoso guarda usuario y token', async () => {
    const mockResponse = { id: '1', username: 'testuser', email: 'test@example.com' };
    userServices.login.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUser());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(userServices.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(localStorage.getItem('id')).toBe('1');
    expect(result.current.user).toEqual(mockResponse);
  });

  test('logout limpia usuario y localStorage', async () => {
    const mockUser = { id: '1', username: 'testuser' };
    localStorage.setItem('id', '1');
    userServices.logout.mockResolvedValue();
    userServices.login.mockResolvedValue(mockUser);
    
    const { result } = renderHook(() => useUser());

    await act(async () => {
      await result.current.login('test@example.com', 'pass');
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(userServices.logout).toHaveBeenCalled();
    expect(localStorage.getItem('id')).toBeNull();
    expect(result.current.user).toBeNull();
  });

  test('registerUser llama al servicio', async () => {
    const newUser = { email: 'new@example.com', username: 'newuser', password: 'pass123' };
    userServices.registerUser.mockResolvedValue();

    const { result } = renderHook(() => useUser());

    await act(async () => {
      await result.current.registerUser(newUser);
    });

    expect(userServices.registerUser).toHaveBeenCalledWith(newUser);
  });
});