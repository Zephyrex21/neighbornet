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
  health: { label: "Health", color: "#ef4444", icon: Stethoscope },
  food: { label: "Food", color: "#f59e0b", icon: UtensilsCrossed },
  water: { label: "Water", color: "#0ea5e9", icon: Droplet },
  shelter: { label: "Shelter", color: "#8b5cf6", icon: Home },
  education: { label: "Education", color: "#10b981", icon: BookOpen },
};
