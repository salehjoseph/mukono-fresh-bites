import Seo from '../components/Seo';
import { BUSINESS } from '../constants/business';

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms of Service"
        description="Terms for ordering from Mukono Fresh Bites."
      />
      <h1 className="text-3xl font-bold text-brand-800">Terms of Service</h1>
      <p className="mt-2 rounded border border-accent-700 bg-white p-3 text-sm">
        DRAFT: these terms have not been reviewed by a lawyer. All policies below are
        placeholders until the owner confirms them.
      </p>

      <div className="mt-6 max-w-2xl space-y-6 text-muted">
        <section>
          <h2 className="text-xl font-semibold text-ink">Orders</h2>
          <p className="mt-2">
            Orders placed on this site are requests until {BUSINESS.name} confirms them. We may
            decline or cancel an order, for example if an item is unavailable, and we will contact
            you if that happens.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Prices</h2>
          <p className="mt-2">
            Prices are in Ugandan Shillings (UGX). The final total, including any delivery fee,
            is calculated by us when the order is placed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Delivery and pickup</h2>
          <p className="mt-2">
            Delivery is available only in areas and at fees that we list. Estimated times are
            estimates, not guarantees. {/* TODO: owner to confirm delivery areas and policy. */}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Payment</h2>
          <p className="mt-2">
            You can pay with cash on pickup or delivery. Mobile money will be added later.
            {/* TODO: refund and failed-payment policy to be confirmed. */}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Cancellations</h2>
          <p className="mt-2">
            To change or cancel an order, contact us as soon as possible. Once preparation has
            started we may not be able to cancel. {/* TODO: owner to confirm. */}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink">Allergies</h2>
          <p className="mt-2">
            If you have a food allergy, tell us in the order notes and by contacting us directly.
            {/* TODO: owner to confirm allergen statement. */}
          </p>
        </section>

        <p className="text-sm">Last updated: {/* TODO: set date when reviewed. */}draft</p>
      </div>
    </>
  );
}