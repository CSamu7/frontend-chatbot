globalThis.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:8000/api',
      VITE_USER_URL: 'http://localhost:8000/api/user/',
      VITE_CHAT_URL: 'http://localhost:8000/api/chats/'
    }
  }
};

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'text-encoding';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;