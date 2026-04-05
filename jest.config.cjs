module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(wouter)/)'
  ],
  globals: {
    'import.meta': {
      env: {
        VITE_API_URL: 'http://localhost:8000/api',
        VITE_USER_URL: 'http://localhost:8000/api/user/',
        VITE_CHAT_URL: 'http://localhost:8000/api/chats/'
      }
    }
  },
  testMatch: [
    '<rootDir>/src/tests/**/*.test.jsx',
    '<rootDir>/src/**/*.test.jsx'
  ]
};