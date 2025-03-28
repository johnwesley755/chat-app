import { io, Socket } from 'socket.io-client';

// Use Vite's environment variables instead of process.env
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;
let isConnecting = false;
let connectionAttempts = 0;
const MAX_RECONNECTION_ATTEMPTS = 3;
let backoffTimer: ReturnType<typeof setTimeout> | null = null;
let isInBackoffPeriod = false;

const initializeSocket = (token: string): Socket => {
  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    console.log('Socket connection already in progress, reusing...');
    if (!socket) {
      throw new Error('Socket is null but isConnecting is true');
    }
    return socket;
  }
  
  // Return existing socket if available
  if (socket) {
    console.log('Reusing existing socket connection');
    return socket;
  }

  // If we're in a backoff period, don't try to connect again
  if (isInBackoffPeriod) {
    console.log('In backoff period, not attempting to connect');
    const dummySocket = io(SOCKET_URL, { autoConnect: false }) as Socket;
    return dummySocket;
  }

  console.log(`Initializing socket connection to ${SOCKET_URL}`);
  isConnecting = true;
  connectionAttempts++;

  // Create a new socket connection with the auth token
  socket = io(SOCKET_URL, {
    auth: {
      token
    },
    transports: ['websocket'],
    reconnection: connectionAttempts < MAX_RECONNECTION_ATTEMPTS,
    reconnectionAttempts: 2,
    reconnectionDelay: 3000,
    timeout: 10000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5
  });

  socket.on('connect', () => {
    console.log('Socket connected successfully');
    isConnecting = false;
    connectionAttempts = 0;
    isInBackoffPeriod = false;
    if (backoffTimer) {
      clearTimeout(backoffTimer);
      backoffTimer = null;
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    isConnecting = false;
    
    if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
      console.error(`Max reconnection attempts (${MAX_RECONNECTION_ATTEMPTS}) reached, entering backoff period`);
      disconnectSocket();
      
      // Enter backoff period to prevent immediate reconnection attempts
      isInBackoffPeriod = true;
      backoffTimer = setTimeout(() => {
        console.log('Backoff period ended, reconnection will be allowed on next request');
        isInBackoffPeriod = false;
        connectionAttempts = 0;
      }, 30000); // 30 second backoff
    }
  });

  return socket;
};

const disconnectSocket = (): void => {
  if (socket) {
    console.log('Disconnecting socket');
    socket.disconnect();
    socket = null;
  }
  isConnecting = false;
};

const getSocket = (token: string): Socket => {
  if (!socket && !isInBackoffPeriod) {
    return initializeSocket(token);
  }
  return socket || initializeSocket(token);
};

export { initializeSocket, disconnectSocket, getSocket };