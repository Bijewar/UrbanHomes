import {
  HardHat,
  Sofa,
  ChefHat,
  Armchair,
  Layers,
  PaintBucket,
  ToyBrick,
  Brush,
  ClipboardCheck,
  PencilRuler,
  Hammer,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

export type ServiceItem = {
  id: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  image: string;
  icon: LucideIcon;
};

/**
 * Urban Homes — eight service pillars.
 * The studio covers planning, designing and execution for both
 * residential and commercial projects.
 */
export const SERVICES: ServiceItem[] = [
  {
    id: "construction",
    title: "Construction & Renovation",
    short: "Built right, from the ground up.",
    description:
      "New construction, full home renovations and interior-exterior structural work — delivered by an in-house team that owns the drawings and the site. We plan, we engineer, and we execute under one accountable roof.",
    features: [
      "New Construction",
      "Home Renovation",
      "Interior & Exterior Work",
    ],
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    icon: HardHat,
  },
  {
    id: "interior",
    title: "Interior Design",
    short: "Spaces planned around the way you live.",
    description:
      "Complete home interiors designed and built with intention. From space planning to custom interior solutions, every decision serves a purpose and every material earns its place in the room.",
    features: [
      "Complete Home Interiors",
      "Space Planning",
      "Custom Interior Solutions",
    ],
    image:
      "https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&w=1200&q=80",
    icon: Sofa,
  },
  {
    id: "kitchen",
    title: "Modular Kitchen",
    short: "Kitchens that work as hard as you do.",
    description:
      "Modular kitchens designed for your cooking flow, your storage habits and your light. We handle the design, the civil prep, the modules and the final install — so the joins are honest and the finishes last.",
    features: [
      "Modular Kitchens",
      "Custom Kitchen Design",
      "Installation",
    ],
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
    icon: ChefHat,
  },
  {
    id: "furniture",
    title: "Custom Furniture",
    short: "Made-to-measure, finished by hand.",
    description:
      "Bespoke furniture built in-house for rooms that need a specific proportion or a specific soul. Made-to-measure pieces with hand-finished surfaces that age well and stay honest.",
    features: [
      "Custom Furniture",
      "Made-to-Measure Furniture",
      "Furniture Finishing",
    ],
    image:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
    icon: Armchair,
  },
  {
    id: "false-ceiling",
    title: "False Ceiling & Wall Design",
    short: "The fifth façade of a room.",
    description:
      "False ceilings, 3D special-effect textures, rustic finishes and PVC wall panels — engineered for light, proportion and acoustic comfort. Statement surfaces that don't shout.",
    features: [
      "False Ceiling",
      "3D Special Effect Texture",
      "Rustic Finishes",
      "PVC Wall Panels",
    ],
    image:
      "https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=1200&q=80",
    icon: Layers,
  },
  {
    id: "painting",
    title: "Painting & Finishing",
    short: "The last 10% that defines 100% of the impression.",
    description:
      "Interior and exterior painting with premium PU paints and polishes, plus texture finishes that hold up to the climate. Surface preparation is where we spend most of our time — the coats themselves are the easy part.",
    features: [
      "Interior & Exterior Painting",
      "PU Paint",
      "PU Polish",
      "Texture Finishes",
    ],
    image:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3afa01c96218.jpg",
    icon: PaintBucket,
  },
  {
    id: "wall-surface",
    title: "Wall & Surface Solutions",
    short: "Walls that perform, not just look the part.",
    description:
      "Waterproofing, customised wallpapers, roller blinds and full wall treatments — practical layers that protect the building and personality layers that make a room feel like yours.",
    features: [
      "Waterproofing",
      "Customized Wallpapers",
      "Roller Blinds",
      "Wall Treatments",
    ],
    image:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/641f1665baa5.jpg",
    icon: ToyBrick,
  },
  {
    id: "art",
    title: "Art & Custom Work",
    short: "Bespoke finishes, signed by hand.",
    description:
      "Mural art, bespoke design pieces and other custom interior work — made by hand, in-house, for clients who want a room no one else has. The kind of detail that turns a finished space into a story.",
    features: [
      "Mural Art",
      "Bespoke Designs",
      "Other Custom Interior Works",
    ],
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    icon: Brush,
  },
];

export type PortfolioItem = {
  id: string;
  title: string;
  category: "Residential" | "Commercial" | "Interior" | "Painting";
  location: string;
  image: string;
  tall?: boolean;
};

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "p1",
    title: "The Linden Residence",
    category: "Residential",
    location: "Pune, IN",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    tall: true,
  },
  {
    id: "p2",
    title: "Marble Atrium Office",
    category: "Commercial",
    location: "Mumbai, IN",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "p3",
    title: "Atelier Loft",
    category: "Interior",
    location: "Bengaluru, IN",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "p4",
    title: "Bronze Accent Wall",
    category: "Painting",
    location: "Delhi, IN",
    image:
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "p5",
    title: "Hillside Villa",
    category: "Residential",
    location: "Lonavala, IN",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "p6",
    title: "Boutique Hotel Lobby",
    category: "Commercial",
    location: "Jaipur, IN",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
    tall: true,
  },
  {
    id: "p7",
    title: "Studio Apartment Refresh",
    category: "Interior",
    location: "Hyderabad, IN",
    image:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/741e61521797.jpg",
  },
  {
    id: "p8",
    title: "Heritage Facade Revival",
    category: "Painting",
    location: "Kolkata, IN",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
  },
];

export type ProcessStep = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const PROCESS: ProcessStep[] = [
  {
    id: 1,
    title: "Consultation",
    description:
      "We listen first — your vision, site, budget and timeline. A no-obligation conversation (on WhatsApp, on call, or on site) that becomes the brief for everything that follows.",
    icon: ClipboardCheck,
  },
  {
    id: 2,
    title: "Design",
    description:
      "Concepts, drawings, 3D walkthroughs and material palettes — refined together until every detail feels inevitable and the budget is honest from day one.",
    icon: PencilRuler,
  },
  {
    id: 3,
    title: "Execution",
    description:
      "Our in-house engineers and craftsmen bring the drawings to life under dedicated site supervision and weekly quality reviews — no sub-contracted quality.",
    icon: Hammer,
  },
  {
    id: 4,
    title: "Handover",
    description:
      "Snag-free, documented, and ready to move in. We walk you through every system and stay close after the keys change hands.",
    icon: KeyRound,
  },
];

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Ananya Mehta",
    role: "Homeowner · Pune",
    quote:
      "They treated our home like their own. Every drawing had a reason, every wall had a finish we love. The painting work alone redefined how the house feels.",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "t2",
    name: "Rohan Kapoor",
    role: "Director · Kapoor Interiors",
    quote:
      "We've worked with many contractors. Urban Homes is the first that delivers design intent and engineering reality in the same conversation. A genuine design-build partner.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "t3",
    name: "Sneha Reddy",
    role: "Architect · Studio Verte",
    quote:
      "Their finishing crew is rare — they actually understand architecture. The surfaces are clean, the joints are honest, and the timeline was respected to the day.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "t4",
    name: "Vikram Singh",
    role: "Hotelier · Jaipur",
    quote:
      "We needed a boutique feel on a commercial timeline. They delivered a lobby that photographs beautifully and performs even better in person.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
];

export const PAINTING_PALETTE = [
  { name: "Warm Ivory", hex: "#FAF8F5" },
  { name: "Soft Stone", hex: "#E8E4DE" },
  { name: "Warm Taupe", hex: "#D8CFC2" },
  { name: "Bronze", hex: "#B8894F" },
  { name: "Terracotta", hex: "#C1704D" },
  { name: "Deep Charcoal", hex: "#2B2B2B" },
];
