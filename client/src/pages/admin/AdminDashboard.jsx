import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';

export default function AdminDashboard() {
  return (
    <>
      <Seo title="Dashboard" />
      <h1 className="text-2xl font-bold text-brand-800">Dashboard</h1>
      <div className="mt-4 flex flex-col gap-2">
        <Link to="/admin/orders" className="text-brand-700 underline">
          View all orders →
        </Link>
        <Link to="/admin/menu-items" className="text-brand-700 underline">
          Manage menu items →
        </Link>
        <Link to="/admin/categories" className="text-brand-700 underline">
          Manage categories →
        </Link>
      </div>
    </>
  );
}