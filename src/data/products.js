import blackGalaxy from "@/assets/black-galaxy.jpg";
import blackPearl from "@/assets/black-pearl.jpg";
import steelGrey from "@/assets/steel-grey.jpg";

export const products = [
  {
    slug: "black-galaxy",
    name: "Black Galaxy Granite",
    tagline: "Flagship — from our own mine",
    short: "Deep black base scattered with golden mineral flecks. Our flagship stone.",
    description:
      "Black Galaxy is our signature stone, quarried at our own captive mine and processed end to end in our facility. Its jet-black base is scattered with fine golden and bronze mineral flecks that catch light beautifully once polished. Exceptionally dense and hard-wearing, it resists staining and scratching, which is why it remains a first choice for kitchen countertops, feature flooring and exterior cladding worldwide. Because the blocks come from our own quarry, we can hold colour and fleck consistency tight across large orders.",
    image: blackGalaxy,
    finishes: ["Polished", "Honed", "Leather", "Flamed"],
    applications: ["Countertops", "Flooring", "Wall Cladding", "Monuments"],
  },
  {
    slug: "steel-grey",
    name: "Steel Grey Granite",
    tagline: "Versatile companion variety",
    short: "Even grey tones with a fine grain — a calm, contemporary surface.",
    description:
      "Steel Grey carries a balanced charcoal-to-silver tone with a uniform fine grain, making it one of the most adaptable granites for modern interiors and exteriors. It pairs easily with timber, glass and matte metals, and its consistent background hides everyday wear. We supply it in slab and tile format for countertops, staircases, lobbies, façades and paving.",
    image: steelGrey,
    finishes: ["Polished", "Honed", "Leather", "Flamed"],
    applications: ["Countertops", "Flooring", "Façades", "Paving"],
  },
  {
    slug: "black-pearl",
    name: "Black Pearl Granite",
    tagline: "Dark stone with pearl shimmer",
    short: "Dark base with distinct pearl-like silver flecks and subtle shimmer.",
    description:
      "Black Pearl sits in the same dark granite family as Black Galaxy but reads differently — a deep charcoal-black field broken by larger silver-grey crystals that shimmer as light moves across the surface. It suits projects that want depth and movement rather than a flat black, and performs equally well indoors and outdoors thanks to its hardness and low porosity.",
    image: blackPearl,
    finishes: ["Polished", "Honed", "Leather", "Flamed"],
    applications: ["Countertops", "Flooring", "Cladding", "Monuments"],
  },
];
