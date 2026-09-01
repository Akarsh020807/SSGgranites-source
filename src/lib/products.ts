import blackGalaxy from "@/assets/black-galaxy.jpg";
import blackPearl from "@/assets/black-pearl.jpg";
import steelGrey from "@/assets/steel-grey.jpg";
import viscountWhite from "@/assets/viscount-white.jpg";
import kanigiriBlack from "@/assets/kanigiri-black.jpg";
import skBlue from "@/assets/sk-blue.jpg";
import vizagBlue from "@/assets/vizag-blue.jpg";
import tekkaliBlue from "@/assets/tekkali-blue.jpg";
import tanBrown from "@/assets/tan-brown.jpg";
import g20 from "@/assets/g20.jpg";
import absoluteBlack from "@/assets/absolute-black.jpg";
import riverWhite from "@/assets/river-white.jpg";
import colonialWhite from "@/assets/colonial-white.jpg";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  short: string;
  description: string;
  image: string;
  standardFinishes: string[];
  requestFinishes: string[];
  applications: string[];
  recommendedFinish: string;
  positioning: string[];
  note?: string;
  flagship?: boolean;
};

export const products: Product[] = [
  {
    slug: "black-galaxy",
    name: "Black Galaxy",
    tagline: "Flagship stone — from our own captive mine",
    short: "Jet-black base scattered with golden mineral flecks.",
    description:
      "Black Galaxy is our signature stone, quarried at our own captive mine and processed end to end in our facility. Its jet-black base is scattered with fine golden and bronze mineral flecks that catch light beautifully once polished. Exceptionally dense and hard-wearing, it resists staining and scratching, which is why it remains a first choice for kitchen countertops, feature flooring and exterior cladding worldwide. Because the blocks come from our own quarry, we can hold colour and fleck consistency tight across large orders.",
    image: blackGalaxy,
    standardFinishes: ["Polished", "Honed", "Leathered"],
    requestFinishes: ["Flamed (subject to block selection)", "Sandblasted / textured finishes"],
    applications: [
      "Kitchen countertops",
      "Kitchen islands",
      "Bathroom vanities",
      "Flooring",
      "Feature walls",
      "Wall cladding",
      "Monuments",
      "Commercial interiors",
    ],
    recommendedFinish: "Polished for interiors; leathered for a softer contemporary surface.",
    positioning: ["Luxury", "Iconic", "Premium", "Export-grade"],
    note: "Sourced from SSG Granites' own captive mine, which lets us hold colour and fleck consistency across large orders.",
    flagship: true,
  },
  {
    slug: "steel-grey",
    name: "Steel Grey",
    tagline: "Contemporary architectural grey",
    short: "Medium-to-dark grey with a fine, consistent granular structure.",
    description:
      "A sophisticated medium-to-dark grey granite with a fine, consistent granular structure. Its neutral charcoal-grey background gives it a contemporary architectural appearance while remaining highly versatile.",
    image: steelGrey,
    standardFinishes: ["Polished", "Honed", "Leathered", "Flamed"],
    requestFinishes: ["Bush-hammered / textured finishes"],
    applications: [
      "Kitchen countertops",
      "Vanity tops",
      "Flooring",
      "Staircases",
      "Wall cladding",
      "Exterior façades",
      "Outdoor paving",
      "Commercial projects",
    ],
    recommendedFinish: "Polished for interiors; flamed or textured for exterior applications.",
    positioning: ["Modern", "Minimal", "Commercial", "Contemporary"],
    note: "Steel Grey is particularly practical for high-use areas because its mid-grey tone is relatively forgiving of everyday marks, and it's widely recognised as an established Indian granite variety.",
  },
  {
    slug: "black-pearl",
    name: "Black Pearl",
    tagline: "Charcoal-to-black with silver movement",
    short: "Deep charcoal-black with subtle silver and grey mineral movement.",
    description:
      "A deep charcoal-to-black granite characterised by subtle silver, grey, and sometimes brown mineral movement. Depending on the block, the pattern can range from fine and understated to more pronounced.",
    image: blackPearl,
    standardFinishes: ["Polished", "Honed", "Leathered", "Flamed"],
    requestFinishes: ["Sandblasted / textured finishes"],
    applications: [
      "Kitchen countertops",
      "Islands",
      "Bathroom vanities",
      "Flooring",
      "Feature walls",
      "Staircases",
      "Exterior cladding",
      "Commercial interiors",
    ],
    recommendedFinish:
      "Polished for luxury interiors; leathered for a more contemporary natural-stone appearance.",
    positioning: ["Luxury", "Contemporary", "Bold", "Elegant"],
    note: "Black Pearl is available in both smaller- and larger-pattern block variations, so block selection matters for large projects.",
  },
  {
    slug: "viscount-white",
    name: "Viscount White",
    tagline: "Marble-inspired movement, granite durability",
    short: "Light grey-to-white with flowing grey movement and darker veining.",
    description:
      "A light grey-to-white granite with flowing grey movement and darker mineral veining. Its linear movement gives it a marble-inspired appearance while retaining the durability of granite.",
    image: viscountWhite,
    standardFinishes: ["Polished", "Honed", "Leathered"],
    requestFinishes: ["Flamed (subject to block selection)", "Sandblasted / textured finishes"],
    applications: [
      "Kitchen countertops",
      "Vanity tops",
      "Flooring",
      "Feature walls",
      "Staircases",
      "Wall cladding",
      "Tabletops",
      "Commercial interiors",
    ],
    recommendedFinish: "Polished.",
    positioning: ["Luxury", "Modern", "Marble-inspired", "Architectural"],
    note: "Also marketed as Viscon White / Viscount White — different blocks show noticeably different movement, so block selection matters.",
  },
  {
    slug: "kanigiri-black",
    name: "Kanigiri Black",
    tagline: "Uniform, fine-grained deep black",
    short: "Deep black with a relatively uniform, fine-grained appearance.",
    description:
      "A deep black granite with a relatively uniform, fine-grained appearance. Its clean visual field makes it particularly suitable where a strong, uninterrupted black surface is desired.",
    image: kanigiriBlack,
    standardFinishes: ["Polished", "Honed", "Leathered", "Flamed"],
    requestFinishes: ["Bush-hammered / textured finishes"],
    applications: [
      "Kitchen countertops",
      "Vanity tops",
      "Flooring",
      "Staircases",
      "Wall cladding",
      "Exterior façades",
      "Outdoor paving",
      "Monuments",
    ],
    recommendedFinish: "Polished for interiors; flamed for exterior paving and steps.",
    positioning: ["Minimalist", "Premium", "Bold", "Architectural"],
  },
  {
    slug: "sk-blue",
    name: "SK Blue",
    tagline: "Distinctive blue-grey character",
    short: "Blue-grey with darker mineral movement and fine natural texture.",
    description:
      "A distinctive blue-grey granite with darker mineral movement and fine natural texture. Offers considerably more character than conventional grey granites while remaining suitable for large architectural surfaces.",
    image: skBlue,
    standardFinishes: ["Polished", "Honed", "Leathered", "Flamed"],
    requestFinishes: ["Sandblasted / textured finishes"],
    applications: [
      "Kitchen countertops",
      "Vanity tops",
      "Flooring",
      "Feature walls",
      "Exterior façades",
      "Staircases",
      "Commercial interiors",
      "Outdoor paving",
    ],
    recommendedFinish: "Polished for interiors; flamed/textured for exterior use.",
    positioning: ["Contemporary", "Distinctive", "Architectural", "Premium"],
    note: "Associated with the Andhra Pradesh/Tekkali region in commercial sourcing. The exact quarry/block should determine the final description, since names can overlap in the market with Tekkali Blue.",
  },
  {
    slug: "vizag-blue",
    name: "Vizag Blue",
    tagline: "Natural blue-grey with garnet accents",
    short: "Blue-grey with fine mineral texture and occasional reddish garnet accents.",
    description:
      "A blue-grey natural stone with fine mineral texture, darker movement, and occasional reddish mineral/garnet accents. Its flowing structure gives slabs a distinctive natural character.",
    image: vizagBlue,
    standardFinishes: ["Polished", "Honed", "Leathered", "Flamed"],
    requestFinishes: ["Sandblasted", "Bush-hammered"],
    applications: [
      "Countertops",
      "Vanities",
      "Flooring",
      "Wall cladding",
      "Fireplaces",
      "Exterior façades",
      "Paving",
      "Staircases",
      "Memorial applications",
    ],
    recommendedFinish: "Polished for interiors; flamed/textured for exterior surfaces.",
    positioning: ["Distinctive", "Natural", "Contemporary", "Architectural"],
    note: "Colour and veining can vary significantly by block — specify by actual slab/block selection for large projects.",
  },
  {
    slug: "tekkali-blue",
    name: "Tekkali Blue",
    tagline: "Strong bluish-grey architectural surface",
    short: "Blue-grey to deep bluish-grey with natural mineral movement.",
    description:
      "A blue-grey to deep bluish-grey stone with natural mineral movement and granular texture. Creates a strong architectural surface without the visual heaviness of solid black granite.",
    image: tekkaliBlue,
    standardFinishes: ["Polished", "Honed", "Leathered", "Flamed"],
    requestFinishes: ["Sandblasted / textured finishes"],
    applications: [
      "Countertops",
      "Flooring",
      "Staircases",
      "Wall cladding",
      "Exterior façades",
      "Commercial projects",
      "Outdoor paving",
    ],
    recommendedFinish: "Polished for interiors; flamed for outdoor applications.",
    positioning: ["Contemporary", "Architectural", "Strong", "Natural"],
    note: "Catalogued separately from SK Blue where the actual quarry/block has a distinct appearance — market naming overlaps, but the real slab is the authority.",
  },
  {
    slug: "tan-brown",
    name: "Tan Brown",
    tagline: "Warm copper and chocolate tones",
    short: "Rich brown with black crystals and warm copper, burgundy tones.",
    description:
      "A rich brown granite featuring black mineral crystals with warm copper, burgundy, and chocolate-brown tones. Brings warmth and depth to both traditional and contemporary interiors.",
    image: tanBrown,
    standardFinishes: ["Polished", "Honed", "Leathered", "Flamed"],
    requestFinishes: ["Sandblasted / textured finishes"],
    applications: [
      "Kitchen countertops",
      "Vanity tops",
      "Flooring",
      "Staircases",
      "Wall cladding",
      "Fireplaces",
      "Exterior applications",
      "Commercial interiors",
    ],
    recommendedFinish: "Polished.",
    positioning: ["Warm", "Classic", "Elegant", "Versatile"],
    note: "One of the established South Indian commercial granite colours.",
  },
  {
    slug: "g20",
    name: "G20",
    tagline: "Understated dark commercial granite",
    short: "Predominantly black/charcoal with subtle natural variation.",
    description:
      "A dark granite with a predominantly black/charcoal appearance and subtle natural mineral variation. Provides a clean, understated surface suitable for contemporary architecture.",
    image: g20,
    standardFinishes: ["Polished", "Honed", "Leathered", "Flamed"],
    requestFinishes: ["Sandblasted / textured finishes"],
    applications: [
      "Kitchen countertops",
      "Vanity tops",
      "Flooring",
      "Staircases",
      "Wall cladding",
      "Exterior paving",
      "Commercial projects",
      "Monuments",
    ],
    recommendedFinish:
      "Polished for countertops and interiors; flamed for exterior applications.",
    positioning: ["Contemporary", "Minimal", "Commercial", "Durable"],
    note: "A recognised commercial granite name in Indian supplier catalogues.",
  },
  {
    slug: "absolute-black",
    name: "Absolute Black",
    tagline: "Uninterrupted minimalist black",
    short: "Deep, uniform black with minimal visible pattern.",
    description:
      "A deep, predominantly uniform black granite with minimal visible pattern. Its uninterrupted appearance makes it one of the strongest choices for modern minimalist architecture.",
    image: absoluteBlack,
    standardFinishes: ["Polished", "Honed", "Leathered", "Flamed"],
    requestFinishes: ["Sandblasted", "Bush-hammered"],
    applications: [
      "Premium kitchen countertops",
      "Kitchen islands",
      "Bathroom vanities",
      "Flooring",
      "Staircases",
      "Feature walls",
      "Exterior façades",
      "Monuments",
      "Commercial interiors",
    ],
    recommendedFinish:
      "Polished for a high-end luxury appearance; leathered for a softer contemporary finish.",
    positioning: ["Luxury", "Minimalist", "Contemporary", "Premium"],
    note: "Widely used across South Indian granite markets, particularly suited to modern, high-contrast interiors.",
  },
  {
    slug: "river-white",
    name: "River White",
    tagline: "Soft flowing light stone",
    short: "White-to-cream with flowing grey movement and dark specks.",
    description:
      "A light white-to-cream granite with flowing grey movement, fine dark mineral specks, and occasional subtle burgundy/pink accents. Its soft linear structure gives an elegant, sophisticated appearance.",
    image: riverWhite,
    standardFinishes: ["Polished", "Honed", "Leathered"],
    requestFinishes: ["Flamed (depending on block)", "Sandblasted / textured finishes"],
    applications: [
      "Kitchen countertops",
      "Islands",
      "Bathroom vanities",
      "Flooring",
      "Backsplashes",
      "Wall cladding",
      "Staircases",
      "Exterior façades",
    ],
    recommendedFinish: "Polished.",
    positioning: ["Elegant", "Light", "Contemporary", "Premium"],
    note: "Also marketed internationally as Thunder White — natural movement means block/slab selection matters for large projects.",
  },
  {
    slug: "colonial-white",
    name: "Colonial White",
    tagline: "Bright, timeless light granite",
    short: "White-to-soft-grey background with fine darker mineral detailing.",
    description:
      "A light, elegant granite with a white-to-soft-grey background, fine darker mineral detailing, and subtle natural movement. Creates a bright, spacious appearance while maintaining granite's durability.",
    image: colonialWhite,
    standardFinishes: ["Polished", "Honed", "Leathered"],
    requestFinishes: ["Flamed (subject to block selection)", "Sandblasted / textured finishes"],
    applications: [
      "Kitchen countertops",
      "Bathroom vanities",
      "Flooring",
      "Backsplashes",
      "Wall cladding",
      "Staircases",
      "Commercial interiors",
      "Exterior façades",
    ],
    recommendedFinish: "Polished for interiors; honed for a softer architectural appearance.",
    positioning: ["Bright", "Elegant", "Contemporary", "Timeless"],
    note: "A well-established Indian granite variety, commonly positioned alongside other light-coloured architectural granites.",
  },
];

export const flagship = products[0]!;
export const collection = products.slice(1);

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
