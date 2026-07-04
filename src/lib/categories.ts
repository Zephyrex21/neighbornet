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
  { label: string; color: string; icon: string }
> = {
  health: { label: "Health", color: "#b8433a", icon: "🏥" },
  food: { label: "Food", color: "#c17a2e", icon: "🍲" },
  water: { label: "Water", color: "#2f6f8f", icon: "💧" },
  shelter: { label: "Shelter", color: "#6f4f8e", icon: "🏠" },
  education: { label: "Education", color: "#3a7d5c", icon: "📚" },
};
