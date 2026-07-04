import {
  Stethoscope,
  UtensilsCrossed,
  Droplet,
  Home,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export type Category = "health" | "food" | "water" | "shelter" | "education";

export const CATEGORIES: Category[] = [
  "health",
  "food",
  "water",
  "shelter",
  "education",
];

export const CATEGORY_META: Record<
  Category,
  { label: string; color: string; icon: LucideIcon }
> = {
  health: { label: "Health", color: "#b8433a", icon: Stethoscope },
  food: { label: "Food", color: "#c17a2e", icon: UtensilsCrossed },
  water: { label: "Water", color: "#2f6f8f", icon: Droplet },
  shelter: { label: "Shelter", color: "#6f4f8e", icon: Home },
  education: { label: "Education", color: "#3a7d5c", icon: BookOpen },
};
