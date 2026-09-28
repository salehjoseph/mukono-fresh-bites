import Button from '../components/Button';

export default function NotFound() {
  return (
    <>
      <h1 className="text-3xl font-bold text-brand-800">Page not found</h1>
      <p className="mt-2 text-muted">Sorry, we could not find that page.</p>
      <div className="mt-6">
        <Button to="/">Back to home</Button>
      </div>
    </>
  );
}