/**
 * Frontend Development Server Setup
 * 
 * This script bootstraps the Vite development server for the frontend.
 * The server runs on port 3000 and communicates with the backend on port 4000.
 */

import { createServer } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

async function startVite() {
  console.log('Starting Vite frontend server...');
  
  try {
    // Configure Vite server
    const server = await createServer({
      configFile: false,
      plugins: [
        react(),
        runtimeErrorOverlay(),
      ],
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), 'client', 'src'),
          '@shared': path.resolve(process.cwd(), 'shared'),
          '@assets': path.resolve(process.cwd(), 'attached_assets'),
        },
      },
      root: path.resolve(process.cwd(), 'client'),
      server: {
        port: 3000,
        host: '0.0.0.0',
        cors: true,
        strictPort: true,
        hmr: {
          port: 3000,
        },
      },
    });
    
    // Start the server
    await server.listen();
    
    console.log('Frontend server running at:');
    server.printUrls();
    console.log('\nConnect to the API server at http://localhost:4000/api');
  } catch (error) {
    console.error('Error starting Vite server:', error);
    process.exit(1);
  }
}

startVite();