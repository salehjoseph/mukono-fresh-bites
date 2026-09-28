import { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BUSINESS } from '../constants/business';
import { whatsappLink } from '../utils/whatsapp';

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const skipClass =
  'sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:p-3';

function linkClass({ isActive }) {
  const state = isActive ? 'text-brand-800 underline' : 'text-ink hover:text-brand-700';
  return 'block rounded px-3 py-2 font-medium ' + state;
}

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const wa = whatsappLink();
  const navState = open ? 'block' : 'hidden';

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className={skipClass}>
        Skip to main content
      </a>

      <header className="relative border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-brand-800">
            {BUSINESS.name}
          </Link>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <nav
            id="main-nav"
            aria-label="Main"
            className={
              navState +
              ' absolute left-0 right-0 top-full z-40 border-b border-stone-200 bg-white p-2 md:static md:block md:border-0 md:p-0'
            }
          >
            <ul className="md:flex md:items-center md:gap-2">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={linkClass}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS.name}, {BUSINESS.location}
          </p>
          {wa && (
            <p className="mt-1">
              <a className="underline" href={wa}>
                Chat with us on WhatsApp
              </a>
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}