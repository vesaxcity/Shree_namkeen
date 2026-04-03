import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { router } from './routes';

/**
 * QueryClient with sensible defaults:
 * - staleTime: 5 min  (avoids pointless re-fetches on tab focus)
 * - refetchOnWindowFocus: false  (keeps UX calm for a product catalogue)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * App — Root component.
 *
 * Provider order (outermost → innermost):
 *   QueryClientProvider  →  AuthProvider  →  CartProvider  →  RouterProvider
 *
 * react-hot-toast's <Toaster> sits inside RouterProvider so it can
 * access the router context if needed in future, but outside all pages.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
                fontFamily: "'Montserrat', sans-serif",
              },
              success: {
                iconTheme: { primary: '#4ade80', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;