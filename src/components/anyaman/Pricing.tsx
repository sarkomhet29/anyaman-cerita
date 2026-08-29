import { PricingCards } from "./PricingCards";

export function Pricing() {
  return (
    <section id="harga" className="bg-surface-2 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Harga yang jelas, tanpa kejutan
          </h2>
        </div>

        <PricingCards />
      </div>
    </section>
  );
}
