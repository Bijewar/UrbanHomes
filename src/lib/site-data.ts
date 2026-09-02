import {
  Ruler,
  Compass,
  PaintBucket,
  ClipboardCheck,
  PencilRuler,
  HardHat,
  KeyRound,
} from "lucide-react";

export type ServiceItem = {
  id: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  image: string;
  icon: any;
};

export const SERVICES: ServiceItem[] = [
  {
    id: "civil",
    title: "Civil Engineering",
    short: "Structures that stand the test of time.",
    description:
      "From foundations to finishing details, our civil engineers blend structural integrity with elegant problem-solving — engineered to perform and built to last.",
    features: [
      "Structural design & analysis",
      "Foundation & footing solutions",
      "Site supervision & QA/QC",
      "RCC, steel & retrofitting",
    ],
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    icon: Ruler,
  },
  {
    id: "architecture",
    title: "Architecture & Design",
    short: "Spaces designed with intention.",
    description:
      "We design architecture that breathes — light, proportion, material and movement considered together. Every drawing is a promise of a space that feels right.",
    features: [
      "Concept & schematic design",
      "3D renders & walkthroughs",
      "Working drawings & BOQ",
      "Interior & landscape design",
    ],
    image:
      "https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&w=1200&q=80",
    icon: Compass,
  },
  {
    id: "painting",
    title: "Painting & Finishing",
    short: "The last 10% that defines 100% of the impression.",
    description:
      "Surface preparation, premium materials, and craftsmen who care. Our finishing work turns walls into experiences — smooth, durable, beautiful.",
    features: [
      "Interior & exterior painting",
      "Texture, stencil & accent walls",
      "Waterproofing & sealants",
      "Polish, veneer & surface treatment",
    ],
    image:
      "https://images.unsplash.com/photo-1589939805396-29842a929af0?auto=format&fit=crop&w=1200&q=80",
    icon: PaintBucket,
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
      "https://images.unsplash.com/photo-1631048500301-7e85ed6c6c5a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "p8",
    title: "Heritage Facade Revival",
    category: "Painting",
    location: "Kolkata, IN",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0ba5a8b94?auto=format&fit=crop&w=1000&q=80",
  },
];

export type ProcessStep = {
  id: number;
  title: string;
  description: string;
  icon: any;
};

export const PROCESS: ProcessStep[] = [
  {
    id: 1,
    title: "Consultation",
    description:
      "We listen first — your vision, site, budget and timeline. A no-obligation conversation that becomes the brief for everything that follows.",
    icon: ClipboardCheck,
  },
  {
    id: 2,
    title: "Design",
    description:
      "Concepts, drawings, 3D walkthroughs and material palettes — refined together until every detail feels inevitable.",
    icon: PencilRuler,
  },
  {
    id: 3,
    title: "Execution",
    description:
      "Our in-house engineers and craftsmen bring the drawings to life under dedicated site supervision and weekly quality reviews.",
    icon: HardHat,
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
      "We've worked with many contractors. Maison Studio is the first that delivers design intent and engineering reality in the same conversation. A genuine design-build partner.",
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
      "https://images.unsplash.com/photo-1580489944761-4a1efc8c1d6a?auto=format&fit=crop&w=200&q=80",
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
