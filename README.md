# BookBot - Frontend Chatbot

Aplicación frontend para un chatbot interactivo que consulta libros de la biblioteca escolar, construida con React, Vite y CSS Modules. Permite gestionar conversaciones, enviar mensajes y autenticarse con el backend.

## Tecnologías

- **React 18** - Biblioteca para interfaces de usuario
- **Vite** - Herramienta de construcción rápida
- **Wouter** - Enrutamiento ligero para React
- **CSS Modules** - Estilos encapsulados por componente
- **Jest + Testing Library** - Pruebas unitarias

## Estructura del Proyecto

```
frontend-chatbot/
├── public/                  # Archivos estáticos
├── src/
│   ├── assets/              # Imágenes e íconos
│   ├── components/          # Componentes React
│   ├── helpers/             # Funciones auxiliares
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Páginas principales
│   ├── services/            # Servicios API
│   ├── tests/               # Pruebas unitarias
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

## Variables de Entorno

Crear archivo `.env` con las siguientes variables:

```env
VITE_API_URL=http://localhost:8000/api
```

## Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Cobertura de pruebas
npm run test:coverage
```

**Resultados:** 112 pruebas | 19 suites | 100% pasando

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal del chatbot |
| `/signup` | Registro de nuevos usuarios |

## Componentes Principales

| Componente | Descripción |
|------------|-------------|
| `ChatBotPage` | Layout principal del chatbot |
| `ChatsHistory` | Listado de conversaciones pasadas |
| `ChatSelected` | Área de chat activo |
| `ChatContent` | Visualización de mensajes con animaciones |
| `InputMessage` | Campo de entrada de mensajes |
| `LoginModal` | Modal de inicio de sesión |
| `NavMenu` | Menú de navegación y autenticación |
| `ConfirmDialog` | Diálogo de confirmación para acciones destructivas |

## Hooks Personalizados

| Hook | Propósito |
|------|-----------|
| `useChat` | CRUD de conversaciones |
| `useMessage` | Envío y obtención de mensajes |
| `useUser` | Autenticación (login, logout, registro) |
| `useAuth` | Manejo de tokens CSRF |