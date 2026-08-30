import { Reveal } from "@/components/layout/Reveal";
import quarry from "@/assets/quarry.jpg";
import cutting from "@/assets/cutting.jpg";
import polishing from "@/assets/polishing.jpg";
import exportYard from "@/assets/export.jpg";
import blackGalaxy from "@/assets/black-galaxy.jpg";
import heroSlabs from "@/assets/hero-slabs.jpg";

const gallery = [
  { src: quarry, alt: "Open-pit black granite quarry", w: 1280, h: 960 },
  { src: cutting, alt: "Granite block being cut into slabs", w: 1024, h: 768 },
  { src: polishing, alt: "Polishing a dark granite slab", w: 1024, h: 768 },
  { src: exportYard, alt: "Granite blocks loaded for export", w: 1024, h: 768 },
  { src: blackGalaxy, alt: "Black Galaxy granite close-up", w: 1024, h: 768 },
  { src: heroSlabs, alt: "Finished polished granite slabs", w: 1920, h: 1080 },
];

export function Gallery() {
  return (
    <section className="bg-secondary py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Facility &amp; Finished Slabs</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Inside the operation</h2>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((g, i) => (
            <Reveal key={g.alt} delay={(i % 3) * 90}>
              <div className="overflow-hidden">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  width={g.w}
                  height={g.h}
                  className="h-64 w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
