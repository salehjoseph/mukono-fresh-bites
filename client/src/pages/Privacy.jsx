import Seo from '../components/Seo';
import { BUSINESS } from '../constants/business';

export default function Privacy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How Mukono Fresh Bites collects, uses and protects your personal information."
      />
      <h1 className="text-3xl font-bold text-brand-800">Privacy Policy</h1>
      <p className="mt-2 rounded border border-accent-700 bg-white p-3 text-sm">
        DRAFT: this policy has not been reviewed by a lawyer and must be checked before the site
        goes live.
      </p>

      <div className="mt-6 max-w-2xl space-y-6 text-muted">
        <section>
          <h2 className="text-xl font-semibold text-ink">Who we are</h2>
          <p className="mt-2">
            {BUSINESS.name} ({BUSINESS.location}) is responsible for the personal information
            described here. {/* TODO: add registered business name once confirmed. */}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">What we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Your name and phone number, so we can prepare and confirm your order.</li>
            <li>Your email address, only if you choose to give it.</li>
            <li>Your delivery location, only for delivery orders.</li>
            <li>Your order details and any notes you add.</li>
            <li>
              For mobile money payments, the payment reference and the last digits of your
              number. We never see or store your PIN.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Why we use it</h2>
          <p className="mt-2">
            Only to take, prepare, deliver and confirm your order, to contact you about it, and to
            keep basic business records. We do not sell your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Who sees it</h2>
          <p className="mt-2">
            Our staff who handle orders, and service providers needed to run the site, such as
            hosting and payment providers. {/* TODO: list actual providers before launch. */}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">How long we keep it</h2>
          <p className="mt-2">
            {/* TODO: owner and legal advisor to set the retention period. */}
            Order records are kept for a limited period needed for business and legal purposes,
            then deleted or anonymised. The exact period is to be confirmed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Your rights</h2>
          <p className="mt-2">
            You can ask us what information we hold about you, ask us to correct it, or ask us to
            delete it where the law allows. Contact us using the details on our Contact page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Cookies and local storage</h2>
          <p className="mt-2">
            We store your shopping cart in your browser so it is still there if you refresh the
            page. We do not use advertising cookies. {/* TODO: update if analytics are added. */}
          </p>
        </section>

        <p className="text-sm">Last updated: {/* TODO: set date when reviewed. */}draft</p>
      </div>
    </>
  );
}