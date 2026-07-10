export type AccessType = "open" | "insured" | "registered";

export const ACCESS_TYPES: AccessType[] = ["open", "insured", "registered"];

export const ACCESS_META: Record<
  AccessType,
  { label: string; description: string; color: string }
> = {
  open: {
    label: "Open to all",
    description: "No membership, insurance, or registration needed.",
    color: "#10b981",
  },
  insured: {
    label: "Insured workers",
    description: "Requires ESI or similar workplace insurance coverage.",
    color: "#f59e0b",
  },
  registered: {
    label: "Registered members",
    description: "Requires prior registration, referral, or membership.",
    color: "#8b5cf6",
  },
};
