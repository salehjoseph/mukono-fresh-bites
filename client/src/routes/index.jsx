import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import RequireAuth from '../components/RequireAuth';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderConfirmation from '../pages/OrderConfirmation';
import NotFound from '../pages/NotFound';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/menu', element: <Menu /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/privacy', element: <Privacy /> },
      { path: '/terms', element: <Terms /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/order-confirmation', element: <OrderConfirmation /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    element: <RequireAuth allowedRoles={['ADMIN', 'STAFF']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [{ path: '/admin', element: <AdminDashboard /> }],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);