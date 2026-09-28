import Button from '../components/Button';
import { BUSINESS } from '../constants/business';
import { whatsappLink } from '../utils/whatsapp';

export default function Home() {
  const wa = whatsappLink();
  return (
    <section>
      <h1 className="text-3xl font-bold text-brand-800 md:text-5xl">{BUSINESS.tagline}</h1>
      <p className="mt-3 max-w-xl text-muted">
        Order for pickup or delivery in {BUSINESS.location}.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button to="/menu">Order Now</Button>
        {wa && (
          <Button href={wa} variant="outline">
            Chat on WhatsApp
          </Button>
        )}
      </div>
    </section>
  );
}