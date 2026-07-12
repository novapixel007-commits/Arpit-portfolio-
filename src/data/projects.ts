import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";

export type ProjectOrientation = "horizontal" | "vertical";

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  orientation: ProjectOrientation;
  description: string;
  video: string;
  thumbnail?: string;
  image?: string;
  software: string[];
  tools?: string[];
  featured?: boolean;
  role: string;
  challenge: string;
  process: { step: string; detail: string }[];
  result: string;
  gallery: string[];
}

export const PROJECTS: Project[] = [
  // ── Position 1 · Hero horizontal ──────────────────────────────────────────
  {
    id: 7,
    slug: "cinematic-motion-system",
    title: "Cinematic Motion System",
    category: "Motion Graphics",
    orientation: "horizontal",
    featured: true,
    description:
      "A cinematic motion graphics sequence crafted with clean animation, dynamic transitions, modern typography, and precise visual rhythm. Designed to create a premium, high-end viewing experience.",
    software: ["DaVinci Resolve", "Fusion"],
    tools: ["DaVinci Resolve", "Fusion", "Motion Graphics", "Animation", "Typography", "Cinematic"],
    video: "https://www.youtube.com/watch?v=4fFSQCw_SOA",
    image: "https://img.youtube.com/vi/4fFSQCw_SOA/maxresdefault.jpg",
    thumbnail: "https://img.youtube.com/vi/4fFSQCw_SOA/maxresdefault.jpg",
    role: "Motion Designer",
    challenge:
      "A cinematic motion graphics sequence crafted with clean animation, dynamic transitions, modern typography, and precise visual rhythm. Designed to create a premium, high-end viewing experience.",
    process: [
      { step: "Design", detail: "Modern typography and layout." },
    ],
    result: "A premium, high-end viewing experience.",
    gallery: ["https://img.youtube.com/vi/4fFSQCw_SOA/maxresdefault.jpg", p1, p2],
  },

  // ── Position 2 · Vertical ─────────────────────────────────────────────────
  {
    id: 2,
    slug: "talking-head-editorial",
    title: "Talking Head Edit",
    category: "Talking Head",
    orientation: "vertical",
    description:
      "A premium vertical talking head edit crafted with precise pacing, clean color grading, and polished sound design.",
    software: ["DaVinci Resolve", "Color Grading", "Editing"],
    tools: ["DaVinci Resolve", "Color Grading", "Editing"],
    video: "https://youtube.com/shorts/ULVFMQPNA3M?feature=share",
    image: "https://img.youtube.com/vi/ULVFMQPNA3M/maxresdefault.jpg",
    thumbnail: "https://img.youtube.com/vi/ULVFMQPNA3M/maxresdefault.jpg",
    role: "Senior Video Editor",
    challenge:
      "Standard vertical content is often cluttered with distracting subtitles and aggressive cuts. We wanted to pioneer a high-end, editorial approach to vertical storytelling that relied on pacing, voice dynamics, and professional color finishing.",
    process: [
      { step: "Pacing & Selects", detail: "Curated raw takes to preserve natural pauses, sighs, and expressions that convey authentic emotion." },
      { step: "Color Matching", detail: "Matched multi-cam lighting variations to establish a soft, stone-gray skin tone finish." },
      { step: "Audio Dynamics", detail: "Polished vocals in Fairlight, applying precision sound treatment and clean spatial separation." },
    ],
    result: "Generated over 2.4M organic views across Instagram and YouTube Shorts with a 72% average completion rate.",
    gallery: ["https://img.youtube.com/vi/ULVFMQPNA3M/maxresdefault.jpg", p3, p4],
  },

  // ── Position 3 · Vertical ─────────────────────────────────────────────────
  {
    id: 3,
    slug: "talking-head-brand-story",
    title: "Talking Head Edit",
    category: "Talking Head",
    orientation: "vertical",
    description:
      "A premium vertical talking head edit crafted with precise pacing, clean color grading, and polished sound design.",
    software: ["DaVinci Resolve", "Color Grading", "Editing"],
    tools: ["DaVinci Resolve", "Color Grading", "Editing"],
    video: "https://youtube.com/shorts/tJkfDVOSf4k?feature=share",
    image: "https://img.youtube.com/vi/tJkfDVOSf4k/maxresdefault.jpg",
    thumbnail: "https://img.youtube.com/vi/tJkfDVOSf4k/maxresdefault.jpg",
    role: "Video Editor & Finisher",
    challenge:
      "Transforming a founder interview into a tight, emotionally resonant narrative. Every frame had to build brand authority and trust.",
    process: [
      { step: "Scripting on the Timeline", detail: "Sub-edited and restructured sentences to form a tight, logical narrative flow." },
      { step: "B-Roll Orchestration", detail: "Sourced and color-matched cinematic product details to align with key interview beats." },
      { step: "Foley & Music Alignment", detail: "Built a custom sound layer with sub-bass drops to support visual transitions." },
    ],
    result: "Featured as a benchmark creative asset contributing to successful investor outreach.",
    gallery: ["https://img.youtube.com/vi/tJkfDVOSf4k/maxresdefault.jpg", p3, p4],
  },

  // ── Position 4 · Horizontal ───────────────────────────────────────────────
  {
    id: 4,
    slug: "motion-graphics-launch",
    title: "Motion Graphic",
    category: "Motion Graphics",
    orientation: "horizontal",
    description:
      "A high-impact motion graphics sequence built with clean animation, dynamic transitions, and precise visual rhythm.",
    software: ["DaVinci Resolve", "Fusion", "Animation"],
    tools: ["DaVinci Resolve", "Fusion", "Animation"],
    video: "https://youtu.be/5RDF3y9pO5A?si=O94_t5XTYFTgozRH",
    image: "https://img.youtube.com/vi/5RDF3y9pO5A/maxresdefault.jpg",
    thumbnail: "https://img.youtube.com/vi/5RDF3y9pO5A/maxresdefault.jpg",
    role: "Fusion Compositor",
    challenge:
      "A startup wanted to announce their brand refresh with an animation that felt like physical paper layering on digital screens. The motion curves had to feel heavy and tactile, not robotic.",
    process: [
      { step: "Tactile References", detail: "Studied macro video references of real paper sheets folding and layering under light." },
      { step: "Bezier Curve Tuning", detail: "Spent hours refining ease-in and ease-out curves inside Fusion Spline Editor for maximum weight." },
      { step: "Depth Defocus Pass", detail: "Applied dynamic focal lens blurs to mimic professional camera lenses focusing on detail slides." },
    ],
    result: "Shared by Framer Design as a showcase launch animation, leading to 12 inbound inquiries for high-end product campaigns.",
    gallery: ["https://img.youtube.com/vi/5RDF3y9pO5A/maxresdefault.jpg", p2, p4],
  },

  // ── Position 5 · Vertical ─────────────────────────────────────────────────
  {
    id: 5,
    slug: "talking-head-product-spot",
    title: "motion graphic",
    category: "Talking Head",
    orientation: "vertical",
    description:
      "A premium vertical talking head edit crafted with precise pacing, clean color grading, and polished sound design.",
    software: ["DaVinci Resolve", "Color Grading", "Editing"],
    tools: ["DaVinci Resolve", "Color Grading", "Editing"],
    video: "https://youtube.com/shorts/4KOAWKMEKAo?feature=share",
    image: "https://img.youtube.com/vi/4KOAWKMEKAo/maxresdefault.jpg",
    thumbnail: "https://img.youtube.com/vi/4KOAWKMEKAo/maxresdefault.jpg",
    role: "Lead Editor & Colorist",
    challenge:
      "Merging slow-motion product macro shots with high-intensity voice narration. The pacing had to expand and contract smoothly without causing visual fatigue or disconnect.",
    process: [
      { step: "Speed Ramping Analysis", detail: "Calculated exact frame-interpolated curves to ease into 120fps macro footage." },
      { step: "Luminance Pass", detail: "Balanced high contrast highlights on glass and metallic surfaces to make products look ultra-luxurious." },
      { step: "Finishing Touches", detail: "Rendered a fine film grain overlay to pull the disparate elements into a unified cinematic layout." },
    ],
    result: "Boosted product pre-orders by 32% compared to the brand's previous traditional video campaigns.",
    gallery: ["https://img.youtube.com/vi/4KOAWKMEKAo/maxresdefault.jpg", p3, p1],
  },

  // ── Position 6 · Vertical (was the original sample at position 1) ──────────
  {
    id: 1,
    slug: "motion-graphics-cinematic",
    title: "Motion Graphic",
    category: "Talking Head",
    orientation: "vertical",
    description:
      "A premium vertical talking head edit crafted with precise pacing, clean color grading, and polished sound design.",
    software: ["DaVinci Resolve", "Color Grading", "Editing"],
    tools: ["DaVinci Resolve", "Color Grading", "Editing"],
    video: "https://youtube.com/shorts/7hDNSs5ArsY?feature=share",
    image: "https://img.youtube.com/vi/7hDNSs5ArsY/maxresdefault.jpg",
    thumbnail: "https://img.youtube.com/vi/7hDNSs5ArsY/maxresdefault.jpg",
    role: "Senior Video Editor",
    challenge:
      "Crafting a tight, emotionally resonant vertical narrative that maintains viewer attention through precise pacing and professional color finishing.",
    process: [
      { step: "Pacing & Selects", detail: "Curated raw takes to preserve natural pauses and expressions that convey authentic emotion." },
      { step: "Color Matching", detail: "Matched lighting variations to establish a cohesive, premium skin tone finish." },
      { step: "Audio Dynamics", detail: "Polished vocals applying precision sound treatment and clean spatial separation." },
    ],
    result: "A premium talking head edit delivering high engagement and polished brand authority.",
    gallery: ["https://img.youtube.com/vi/7hDNSs5ArsY/maxresdefault.jpg", p3, p1],
  },
];
