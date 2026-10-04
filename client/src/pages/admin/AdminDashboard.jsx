import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';

export default function AdminDashboard() {
  return (
    <>
      <Seo title="Dashboard" />
      <h1 className="text-2xl font-bold text-brand-800">Dashboard</h1>
      <p className="mt-4">
        <Link to="/admin/orders" className="text-brand-700 underline">
          View all orders →
        </Link>
      </p>
    </>
  );
}