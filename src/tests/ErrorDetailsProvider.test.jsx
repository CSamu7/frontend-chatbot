import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ErrorDetailsProvider from '../context/ErrorContextProvider';
import { ErrorContext } from '../context/ErrorContext';

const TestComponent = () => {
  const [error, setError] = React.useContext(ErrorContext);
  
  return (
    <div>
      <button onClick={() => setError('Error de prueba')}>Mostrar Error</button>
      <button onClick={() => setError('')}>Limpiar Error</button>
      <span data-testid="error-value">{error || 'sin error'}</span>
    </div>
  );
};

describe('ErrorDetailsProvider', () => {
  test('provee valores por defecto', () => {
    render(
      <ErrorDetailsProvider>
        <TestComponent />
      </ErrorDetailsProvider>
    );

    expect(screen.getByTestId('error-value')).toHaveTextContent('sin error');
  });

  test('actualiza el error cuando se llama a setError', () => {
    render(
      <ErrorDetailsProvider>
        <TestComponent />
      </ErrorDetailsProvider>
    );

    const showErrorButton = screen.getByText('Mostrar Error');
    act(() => {
      showErrorButton.click();
    });

    expect(screen.getByTestId('error-value')).toHaveTextContent('Error de prueba');
  });

  test('limpia el error cuando se llama a setError con string vacío', () => {
    render(
      <ErrorDetailsProvider>
        <TestComponent />
      </ErrorDetailsProvider>
    );

    const showErrorButton = screen.getByText('Mostrar Error');
    act(() => {
      showErrorButton.click();
    });

    expect(screen.getByTestId('error-value')).toHaveTextContent('Error de prueba');

    const clearErrorButton = screen.getByText('Limpiar Error');
    act(() => {
      clearErrorButton.click();
    });

    expect(screen.getByTestId('error-value')).toHaveTextContent('sin error');
  });

  test('múltiples componentes consumen el mismo contexto', () => {
    const AnotherComponent = () => {
      const [error] = React.useContext(ErrorContext);
      return <span data-testid="another-error">{error || 'sin error'}</span>;
    };

    render(
      <ErrorDetailsProvider>
        <TestComponent />
        <AnotherComponent />
      </ErrorDetailsProvider>
    );

    const showErrorButton = screen.getByText('Mostrar Error');
    act(() => {
      showErrorButton.click();
    });

    expect(screen.getByTestId('error-value')).toHaveTextContent('Error de prueba');
    expect(screen.getByTestId('another-error')).toHaveTextContent('Error de prueba');
  });

  test('el estado inicial es un string vacío', () => {
    let contextValue;
    const GetContextComponent = () => {
      contextValue = React.useContext(ErrorContext);
      return null;
    };

    render(
      <ErrorDetailsProvider>
        <GetContextComponent />
      </ErrorDetailsProvider>
    );

    expect(contextValue[0]).toBe('');
    expect(typeof contextValue[1]).toBe('function');
  });
});