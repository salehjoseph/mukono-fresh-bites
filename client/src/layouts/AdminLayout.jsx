import { Link, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../store/authContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/admin" className="font-bold text-brand-800">
            Mukono Fresh Bites <span className="text-muted font-normal">— Admin</span>
          </Link>
          <div className="flex items-center justify-between gap-4 text-sm sm:justify-end">
            <span className="truncate text-muted">
              {user?.name} ({user?.role})
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-11 shrink-0 items-center gap-1 text-accent-700 hover:underline"
            >
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}