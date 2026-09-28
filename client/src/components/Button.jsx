import { Link } from 'react-router-dom';

const styles = {
  primary: 'bg-accent-700 text-white hover:bg-accent-600',
  secondary: 'bg-brand-800 text-white hover:bg-brand-700',
  outline: 'border-2 border-brand-800 text-brand-800 hover:bg-brand-50',
};

export default function Button({
  to,
  href,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const base =
    'inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2 font-semibold transition-colors';
  const cls = `${base} ${styles[variant]} ${className}`;
  if (to)
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}