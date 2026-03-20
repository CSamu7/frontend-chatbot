import { renderHook, act } from '@testing-library/react';
import useAuth from '../hooks/useAuth';

const mockSetCsrfService = jest.fn();

jest.mock('../services/csrfServices', () => ({
  setCsrfService: (...args) => mockSetCsrfService(...args),
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('setCsrf llama al servicio', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.setCsrf();
    });

    expect(mockSetCsrfService).toHaveBeenCalledTimes(1);
  });

  test('setCsrf puede ser llamado múltiples veces', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.setCsrf();
      await result.current.setCsrf();
      await result.current.setCsrf();
    });

    expect(mockSetCsrfService).toHaveBeenCalledTimes(3);
  });

  test('setCsrf no recibe argumentos', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.setCsrf();
    });

    expect(mockSetCsrfService).toHaveBeenCalledWith();
  });
});