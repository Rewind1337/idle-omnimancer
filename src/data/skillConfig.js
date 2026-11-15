import { RESEARCH_CONFIG } from "./researchConfig"
import { SPELLCRAFT_CONFIG } from "./SpellcraftConfig"

const GLOBAL_CONFIG = {
    maxSkillLevel: 100,         // max level of any skill
    maxActionLevel: 100,        // max level of any action
}

const generateActionXPTable = (config, tier) => {
    const table = []

    const baseXP =
        config.neededXP.base +
        config.neededXP.perTier * (tier - 1)

    const perLevelMult =
        config.neededXP.perLevelMult *
        Math.pow(config.neededXP.perTierMult, tier - 1)

    let totalXP = 0

    for (let level = 1; level <= GLOBAL_CONFIG.maxActionLevel; level++) {
        const neededXP = Math.ceil(
            (baseXP * Math.pow(perLevelMult, level - 1) +
                config.neededXP.perLevelFlat * (level - 1)) * Math.pow(config.neededXP.finalMultPerLevel, level - 1)
        )

        table.push({
            level,
            neededXP: level === GLOBAL_CONFIG.maxActionLevel ? null : neededXP,
            totalXP,
        })

        // Add the requirement to reach the next level.
        if (level < GLOBAL_CONFIG.maxActionLevel) {
            totalXP += neededXP
        }
    }

    return table
}

let researchTableTier1 = generateActionXPTable(RESEARCH_CONFIG, 1)
let researchTableTier8 = generateActionXPTable(RESEARCH_CONFIG, 8)
let spellcraftTableTier1 = generateActionXPTable(SPELLCRAFT_CONFIG, 1)
let spellcraftTableTier8 = generateActionXPTable(SPELLCRAFT_CONFIG, 8)

function _dev_compare(name, table1, table2) {
    console.log(name + " Comparison")
    console.log("Level:\t", 1, "->", 2, "\tT1:", table1[0].neededXP, "T8:", table2[0].neededXP)
    for (let level = 9; level < 99; level += 10) {
        console.log("Level:", level + 1, "->", level + 2, "\tT1:", table1[level].neededXP, "T8:", table2[level].neededXP)
    }
    console.log("Level:", 99, "->", 100, "\tT1:", table1[98].neededXP, "T8:", table2[98].neededXP)
}

_dev_compare("Tier 1", researchTableTier1, spellcraftTableTier1)
_dev_compare("Tier 8", researchTableTier8, spellcraftTableTier8)