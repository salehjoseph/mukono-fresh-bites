import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CartProvider } from './store/cartContext';
import { AuthProvider } from './store/authContext';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}