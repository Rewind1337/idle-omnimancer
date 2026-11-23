import { SKILL_ICONS } from "./iconLibrary"

// Skill order is also the unlock order used by the navigation.
export const SKILL_NAVIGATION = [
    { id: 0, skillId: "skill:research", name: "Research", icon: SKILL_ICONS.RESEARCH, variant: "research" },
    { id: 1, skillId: "skill:spellcraft", name: "Spellcraft", icon: SKILL_ICONS.SPELLCRAFT, variant: "spellcraft" },
    { id: 2, skillId: "skill:transmutation", name: "Transmutation", icon: SKILL_ICONS.TRANSMUTATION, variant: "transmutation" },
    { id: 3, skillId: "skill:exploration", name: "Exploration", icon: SKILL_ICONS.EXPLORATION, variant: "exploration" },
    { id: 4, skillId: "skill:unveiling", name: "Unveiling", icon: SKILL_ICONS.UNVEILING, variant: "unveiling" },
    { id: 5, skillId: "skill:companions", name: "Companions", icon: SKILL_ICONS.COMPANIONS, variant: "companions" },
    { id: 6, skillId: "skill:combat", name: "Combat", icon: SKILL_ICONS.COMBAT, variant: "combat" },
]

// Opened through the floating panel; intentionally excluded from the top navigation.
export const SHOP_NAVIGATION = {
    id: 7,
    name: "Shop",
    variant: "shop",
}
