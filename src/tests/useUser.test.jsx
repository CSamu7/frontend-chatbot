import { renderHook, act, waitFor } from '@testing-library/react';
import useUser from '../hooks/useUser';

const mockGetUser = jest.fn();
const mockRegisterUser = jest.fn();
const mockLogin = jest.fn();
const mockLogout = jest.fn();

jest.mock('../services/userServices', () => ({
  userServices: {
    getUser: (...args) => mockGetUser(...args),
    registerUser: (...args) => mockRegisterUser(...args),
    login: (...args) => mockLogin(...args),
    logout: (...args) => mockLogout(...args),
  }
}));

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
    mockGetUser.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(mockGetUser).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
    });
  });

  test('no carga usuario si no hay id en localStorage', () => {
    localStorage.removeItem('id');
    renderHook(() => useUser());
    
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  test('login exitoso guarda usuario y token', async () => {
    const mockResponse = { id: '1', username: 'testuser', email: 'test@example.com' };
    mockLogin.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUser());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(localStorage.getItem('id')).toBe('1');
    expect(result.current.user).toEqual(mockResponse);
  });

  test('logout limpia usuario y localStorage', async () => {
    const mockUser = { id: '1', username: 'testuser' };
    localStorage.setItem('id', '1');
    mockLogout.mockResolvedValue();
    
    const { result } = renderHook(() => useUser());

    mockLogin.mockResolvedValue(mockUser);
    await act(async () => {
      await result.current.login('test@example.com', 'pass');
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(localStorage.getItem('id')).toBeNull();
    expect(result.current.user).toBeNull();
  });

  test('registerUser llama al servicio', async () => {
    const newUser = { email: 'new@example.com', username: 'newuser', password: 'pass123' };
    mockRegisterUser.mockResolvedValue();

    const { result } = renderHook(() => useUser());

    await act(async () => {
      await result.current.registerUser(newUser);
    });

    expect(mockRegisterUser).toHaveBeenCalledWith(newUser);
  });
});