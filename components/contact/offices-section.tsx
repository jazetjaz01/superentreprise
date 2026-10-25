import { getOffices } from "@/lib/offices";
import { OfficesMap } from "@/components/contact/offices-map";

// Liste et carte des agences (sous le formulaire de contact)
export async function OfficesSection() {
  const offices = await getOffices();
  if (offices.length === 0) return null;

  return (
    <section aria-labelledby="offices-title" className="mx-auto mt-24 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="offices-title"
          className="text-3xl font-semibold tracking-tight text-brand sm:text-4xl"
        >
          Nos implantations
        </h2>
        <p className="text-sm text-muted-foreground">
          {offices.length} agence{offices.length > 1 ? "s" : ""}
        </p>
      </div>
      <div className="mt-10">
        <OfficesMap offices={offices} />
      </div>
    </section>
  );
}
