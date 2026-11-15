import { ELEMENT_ICONS, OTHER_ICONS, SKILL_ICONS } from './iconLibrary'

// Notification types, their icons and their corresponding color variants.
export const TOAST_TYPES = {
    success: { icon: OTHER_ICONS.CHECK_CIRCLE, variant: 'exploration' },
    info: { icon: OTHER_ICONS.INFO, variant: 'water' },
    warning: { icon: OTHER_ICONS.ALERT_TRIANGLE, variant: 'spellcraft' },
    error: { icon: OTHER_ICONS.X_CIRCLE, variant: 'combat' },

    primary: { icon: OTHER_ICONS.SPARKLES, variant: 'primary' },
    secondary: { icon: OTHER_ICONS.CIRCLE_DOT, variant: 'secondary' },

    research: { icon: SKILL_ICONS.RESEARCH, variant: 'research' },
    spellcraft: { icon: SKILL_ICONS.SPELLCRAFT, variant: 'spellcraft' },
    transmutation: { icon: SKILL_ICONS.TRANSMUTATION, variant: 'transmutation' },
    exploration: { icon: SKILL_ICONS.EXPLORATION, variant: 'exploration' },
    unveiling: { icon: SKILL_ICONS.UNVEILING, variant: 'unveiling' },
    combat: { icon: SKILL_ICONS.COMBAT, variant: 'combat' },
    companions: { icon: SKILL_ICONS.COMPANIONS, variant: 'companions' },

    earth: { icon: ELEMENT_ICONS.EARTH, variant: 'earth' },
    air: { icon: ELEMENT_ICONS.AIR, variant: 'air' },
    water: { icon: ELEMENT_ICONS.WATER, variant: 'water' },
}