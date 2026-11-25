import { ITEM_SPRITES, OTHER_ICONS } from "./iconLibrary"
import { humanize } from "../utility/helpers"
import { RESEARCH_BREAKTHROUGH_CONFIG } from "./researchBreakthroughConfig"

// Tier 1 and 2 establish the value curve; every later tier doubles the previous
// value minus one: 1, 2, 3, 5, 9, 17, 33, 65, ...
export const getBaseItemValue = (tier) => {
    const normalizedTier = Math.max(1, Math.floor(Number(tier) || 1))

    if (normalizedTier === 1) return 1
    if (normalizedTier === 2) return 2

    return Math.round((getBaseItemValue(normalizedTier - 1) * 2) - 1)
}

const ITEM_DEFINITIONS = [
    // Research
    { id: "item:loose_notes", tier: 1, variant: "research" },
    { id: "item:bound_notes", tier: 2, variant: "research" },
    { id: "item:translated_scrolls", tier: 3, variant: "research" },
    { id: "item:arcane_manuscript", tier: 4, variant: "research" },
    { id: "item:sealed_grimoire", tier: 5, variant: "research" },
    { id: "item:lost_archive_record", tier: 6, variant: "research" },
    { id: "item:forgotten_texts", tier: 7, variant: "research" },
    { id: "item:forbidden_codex", tier: 8, variant: "research" },
    { id: "item:primordial_chronicle", tier: 9, variant: "research" },
    { id: "item:genesis_testament", tier: 10, variant: "research" },

    // Rare discoveries unlocked through the Research Breakthrough shop upgrade.
    ...RESEARCH_BREAKTHROUGH_CONFIG.items.map(({ tier, itemId, name, baseValue }) => ({
        id: itemId,
        name,
        tier,
        baseValue,
        variant: "research",
        icon: OTHER_ICONS.FLAME,
    })),

    // Spellcraft
    { id: "item:dust", tier: 1, variant: "earth" },
    { id: "item:breath", tier: 1, variant: "air" },
    { id: "item:droplet", tier: 1, variant: "water" },
    { id: "item:pebble", tier: 2, variant: "earth" },
    { id: "item:breeze", tier: 2, variant: "air" },
    { id: "item:ripple", tier: 2, variant: "water" },
    { id: "item:stone", tier: 3, variant: "earth" },
    { id: "item:gust", tier: 3, variant: "air" },
    { id: "item:stream", tier: 3, variant: "water" },
    { id: "item:shard", tier: 4, variant: "earth" },
    { id: "item:gale", tier: 4, variant: "air" },
    { id: "item:wave", tier: 4, variant: "water" },
    { id: "item:crystal", tier: 5, variant: "earth" },
    { id: "item:tempest", tier: 5, variant: "air" },
    { id: "item:torrent", tier: 5, variant: "water" },
    { id: "item:core", tier: 6, variant: "earth" },
    { id: "item:cyclone", tier: 6, variant: "air" },
    { id: "item:maelstrom", tier: 6, variant: "water" },
    { id: "item:mountain_heart", tier: 7, variant: "earth" },
    { id: "item:skycore", tier: 7, variant: "air" },
    { id: "item:abyssal_heart", tier: 7, variant: "water" },
    { id: "item:worldheart", tier: 8, variant: "earth" },
    { id: "item:firmament_core", tier: 8, variant: "air" },
    { id: "item:primordial_tide", tier: 8, variant: "water" },

    // Unique resources produced by each Exploration area.
    { id: "item:crossroads_field_notes", tier: 2, variant: "exploration", type: "resource" },
    { id: "item:mossbound_ore", tier: 2, variant: "earth", type: "resource" },
    { id: "item:whispering_seeds", tier: 2, variant: "air", type: "resource" },
    { id: "item:stillwater_reeds", tier: 2, variant: "water", type: "resource" },
    { id: "item:ironroot_ore", tier: 3, variant: "earth", type: "resource" },
    { id: "item:zephyr_plumes", tier: 3, variant: "air", type: "resource" },
    { id: "item:moonlit_pearls", tier: 3, variant: "water", type: "resource" },
    { id: "item:shatterstone_fragments", tier: 4, variant: "earth", type: "resource" },
    { id: "item:stormglass_shards", tier: 4, variant: "air", type: "resource" },
    { id: "item:abyssal_ink", tier: 4, variant: "water", type: "resource" },
    { id: "item:basalt_heart", tier: 5, variant: "earth", type: "resource" },
    { id: "item:skybreak_aether", tier: 5, variant: "air", type: "resource" },
    { id: "item:tidal_heart", tier: 5, variant: "water", type: "resource" },

    // Higher-tier Exploration resources.
    { id: "item:deepstone_crystals", tier: 6, variant: "earth", type: "resource" },
    { id: "item:highwind_plumes", tier: 6, variant: "air", type: "resource" },
    { id: "item:mooncurrent_pearls", tier: 6, variant: "water", type: "resource" },
    { id: "item:verdant_heartwood", tier: 7, variant: "earth", type: "resource" },
    { id: "item:stormwing_feathers", tier: 7, variant: "air", type: "resource" },
    { id: "item:glacial_pearls", tier: 7, variant: "water", type: "resource" },
    { id: "item:obsidian_fragments", tier: 8, variant: "earth", type: "resource" },
    { id: "item:celestial_aether", tier: 8, variant: "air", type: "resource" },
    { id: "item:abyssal_corals", name: "Abyssal Bones", tier: 8, variant: "water", type: "resource" },
    { id: "item:primordial_ore", tier: 9, variant: "earth", type: "resource" },
    { id: "item:starfall_aether", tier: 9, variant: "air", type: "resource" },
    { id: "item:worldtide_pearls", tier: 9, variant: "water", type: "resource" },
    { id: "item:worldcore_shards", tier: 10, variant: "earth", type: "resource" },
    { id: "item:firmament_plumes", tier: 10, variant: "air", type: "resource" },
    { id: "item:leviathan_essence", tier: 10, variant: "water", type: "resource" },
    { id: "item:genesis_ore", tier: 11, variant: "earth", type: "resource" },
    { id: "item:origin_aether", tier: 11, variant: "air", type: "resource" },
    { id: "item:eternal_tideheart", tier: 11, variant: "water", type: "resource" },

    // Companion containers discovered by exploration for use in the Unveiling systems & Companion Tab.
    { id: "item:earth_geode_i", tier: 1, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 5, type: "companionContainer" },
    { id: "item:air_egg_i", tier: 1, variant: "air", baseValue: 1000, requiredUnveilingLevel: 5, type: "companionContainer" },
    { id: "item:water_shell_i", tier: 1, variant: "water", baseValue: 1000, requiredUnveilingLevel: 5, type: "companionContainer" },
    { id: "item:earth_geode_ii", tier: 2, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 10, type: "companionContainer" },
    { id: "item:air_egg_ii", tier: 2, variant: "air", baseValue: 1000, requiredUnveilingLevel: 10, type: "companionContainer" },
    { id: "item:water_shell_ii", tier: 2, variant: "water", baseValue: 1000, requiredUnveilingLevel: 10, type: "companionContainer" },
    { id: "item:earth_geode_iii", tier: 3, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 15, type: "companionContainer" },
    { id: "item:air_egg_iii", tier: 3, variant: "air", baseValue: 1000, requiredUnveilingLevel: 15, type: "companionContainer" },
    { id: "item:water_shell_iii", tier: 3, variant: "water", baseValue: 1000, requiredUnveilingLevel: 15, type: "companionContainer" },
    { id: "item:earth_geode_iv", tier: 4, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 20, type: "companionContainer" },
    { id: "item:air_egg_iv", tier: 4, variant: "air", baseValue: 1000, requiredUnveilingLevel: 20, type: "companionContainer" },
    { id: "item:water_shell_iv", tier: 4, variant: "water", baseValue: 1000, requiredUnveilingLevel: 20, type: "companionContainer" },
    { id: "item:earth_geode_v", tier: 5, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 25, type: "companionContainer" },
    { id: "item:air_egg_v", tier: 5, variant: "air", baseValue: 1000, requiredUnveilingLevel: 25, type: "companionContainer" },
    { id: "item:water_shell_v", tier: 5, variant: "water", baseValue: 1000, requiredUnveilingLevel: 25, type: "companionContainer" },
    { id: "item:neutral_prism_i", name: "Wayfinder Prism", tier: 1, variant: "neutral", baseValue: 1000, requiredUnveilingLevel: 5, type: "companionContainer" },
    { id: "item:neutral_prism_ii", name: "Earth Prism", tier: 2, variant: "neutral", baseValue: 1000, requiredUnveilingLevel: 10, type: "companionContainer" },
    { id: "item:neutral_prism_iii", name: "Air Prism", tier: 3, variant: "neutral", baseValue: 1000, requiredUnveilingLevel: 15, type: "companionContainer" },
    { id: "item:neutral_prism_iv", name: "Water Prism", tier: 4, variant: "neutral", baseValue: 1000, requiredUnveilingLevel: 20, type: "companionContainer" },

    // Companion progression materials and the shared low-value duplicate reward.
    { id: "item:earth_companion_xp", name: "Earth Companion Candy", tier: 1, variant: "earth", type: "companionExperience", baseValue: 100 },
    { id: "item:air_companion_xp", name: "Air Companion Candy", tier: 1, variant: "air", type: "companionExperience", baseValue: 100 },
    { id: "item:water_companion_xp", name: "Water Companion Candy", tier: 1, variant: "water", type: "companionExperience", baseValue: 100 },
    { id: "item:neutral_companion_xp", name: "Neutral Companion Candy", tier: 1, variant: "neutral", type: "companionExperience", baseValue: 100 },

    // Combat drops unidentified versions of each area's artifact. All have the
    // same base value; Unveiling requirements scale with the source area's tier.
    { id: "item:unidentified_crossroads_artifact", name: "Unidentified Crossroads Artifact", tier: 1, variant: "neutral", baseValue: 1000, requiredUnveilingLevel: 5, type: "unidentifiedArtifact", revealsItemId: "item:crossroads_waystone", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_mossbound_foothills_artifact", name: "Unidentified Mossbound Artifact", tier: 1, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 5, type: "unidentifiedArtifact", revealsItemId: "item:mossbound_heartstone", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_whispering_fields_artifact", name: "Unidentified Whispering Artifact", tier: 1, variant: "air", baseValue: 1000, requiredUnveilingLevel: 5, type: "unidentifiedArtifact", revealsItemId: "item:whispering_chime", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_stillwater_pools_artifact", name: "Unidentified Stillwater Artifact", tier: 1, variant: "water", baseValue: 1000, requiredUnveilingLevel: 5, type: "unidentifiedArtifact", revealsItemId: "item:stillwater_idol", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_ironroot_ravine_artifact", name: "Unidentified Ironroot Artifact", tier: 2, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 10, type: "unidentifiedArtifact", revealsItemId: "item:ironroot_golem_core", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_zephyr_heights_artifact", name: "Unidentified Zephyr Artifact", tier: 2, variant: "air", baseValue: 1000, requiredUnveilingLevel: 10, type: "unidentifiedArtifact", revealsItemId: "item:zephyr_wisp_chime", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_moonlit_fen_artifact", name: "Unidentified Moonlit Artifact", tier: 2, variant: "water", baseValue: 1000, requiredUnveilingLevel: 10, type: "unidentifiedArtifact", revealsItemId: "item:fenwarden_idol", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_shattered_crags_artifact", name: "Unidentified Shattered Artifact", tier: 3, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 15, type: "unidentifiedArtifact", revealsItemId: "item:cragbound_relic", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_tempest_reach_artifact", name: "Unidentified Tempest Artifact", tier: 3, variant: "air", baseValue: 1000, requiredUnveilingLevel: 15, type: "unidentifiedArtifact", revealsItemId: "item:tempest_eye", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_drowned_sanctum_artifact", name: "Unidentified Drowned Artifact", tier: 3, variant: "water", baseValue: 1000, requiredUnveilingLevel: 15, type: "unidentifiedArtifact", revealsItemId: "item:drowned_scepter", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_basalt_crown_artifact", name: "Unidentified Basalt Artifact", tier: 4, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 20, type: "unidentifiedArtifact", revealsItemId: "item:basalt_crown_fragment", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_skybreak_summit_artifact", name: "Unidentified Skybreak Artifact", tier: 4, variant: "air", baseValue: 1000, requiredUnveilingLevel: 20, type: "unidentifiedArtifact", revealsItemId: "item:skybreak_sigil", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_tidal_abyss_artifact", name: "Unidentified Tidal Artifact", tier: 4, variant: "water", baseValue: 1000, requiredUnveilingLevel: 20, type: "unidentifiedArtifact", revealsItemId: "item:abyssal_crown", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_deepstone_warrens_artifact", name: "Unidentified Deepstone Artifact", tier: 5, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 25, type: "unidentifiedArtifact", revealsItemId: "item:deepstone_guardian_core", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_highwind_expanse_artifact", name: "Unidentified Highwind Artifact", tier: 5, variant: "air", baseValue: 1000, requiredUnveilingLevel: 25, type: "unidentifiedArtifact", revealsItemId: "item:highwind_wisp_chime", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_mooncurrent_basin_artifact", name: "Unidentified Mooncurrent Artifact", tier: 5, variant: "water", baseValue: 1000, requiredUnveilingLevel: 25, type: "unidentifiedArtifact", revealsItemId: "item:mooncurrent_tide_idol", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_verdant_crucible_artifact", name: "Unidentified Verdant Artifact", tier: 6, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 30, type: "unidentifiedArtifact", revealsItemId: "item:verdant_golem_core", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_stormwing_pinnacles_artifact", name: "Unidentified Stormwing Artifact", tier: 6, variant: "air", baseValue: 1000, requiredUnveilingLevel: 30, type: "unidentifiedArtifact", revealsItemId: "item:stormwing_wisp_chime", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_glacial_mirror_artifact", name: "Unidentified Glacial Artifact", tier: 6, variant: "water", baseValue: 1000, requiredUnveilingLevel: 30, type: "unidentifiedArtifact", revealsItemId: "item:glacial_tide_idol", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_obsidian_throne_artifact", name: "Unidentified Obsidian Artifact", tier: 7, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 35, type: "unidentifiedArtifact", revealsItemId: "item:obsidian_golem_relic", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_celestial_rift_artifact", name: "Unidentified Celestial Artifact", tier: 7, variant: "air", baseValue: 1000, requiredUnveilingLevel: 35, type: "unidentifiedArtifact", revealsItemId: "item:celestial_wisp_chime", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_leviathan_trench_artifact", name: "Unidentified Leviathan Artifact", tier: 7, variant: "water", baseValue: 1000, requiredUnveilingLevel: 35, type: "unidentifiedArtifact", revealsItemId: "item:abyssal_tide_scepter", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_primordial_forge_artifact", name: "Unidentified Primordial Artifact", tier: 8, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 40, type: "unidentifiedArtifact", revealsItemId: "item:primordial_golem_heart", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_starfall_firmament_artifact", name: "Unidentified Starfall Artifact", tier: 8, variant: "air", baseValue: 1000, requiredUnveilingLevel: 40, type: "unidentifiedArtifact", revealsItemId: "item:starfall_wisp_sigil", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_worldtide_sanctum_artifact", name: "Unidentified Worldtide Artifact", tier: 8, variant: "water", baseValue: 1000, requiredUnveilingLevel: 40, type: "unidentifiedArtifact", revealsItemId: "item:worldtide_tide_crown", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_worldcore_caldera_artifact", name: "Unidentified Worldcore Artifact", tier: 9, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 45, type: "unidentifiedArtifact", revealsItemId: "item:worldcore_relic", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_boundless_empyrean_artifact", name: "Unidentified Boundless Artifact", tier: 9, variant: "air", baseValue: 1000, requiredUnveilingLevel: 45, type: "unidentifiedArtifact", revealsItemId: "item:firmament_wisp_chime", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_leviathans_grave_artifact", name: "Unidentified Leviathan's Artifact", tier: 9, variant: "water", baseValue: 1000, requiredUnveilingLevel: 45, type: "unidentifiedArtifact", revealsItemId: "item:leviathan_tide_scepter", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_genesis_bastion_artifact", name: "Unidentified Genesis Artifact", tier: 10, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 50, type: "unidentifiedArtifact", revealsItemId: "item:genesis_golem_core", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_origin_zenith_artifact", name: "Unidentified Origin Artifact", tier: 10, variant: "air", baseValue: 1000, requiredUnveilingLevel: 50, type: "unidentifiedArtifact", revealsItemId: "item:origin_wisp_sigil", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },
    { id: "item:unidentified_eternal_deep_artifact", name: "Unidentified Eternal Artifact", tier: 10, variant: "water", baseValue: 1000, requiredUnveilingLevel: 50, type: "unidentifiedArtifact", revealsItemId: "item:eternal_tide_crown", icon: OTHER_ICONS.UNIDENTIFIED_ARTIFACT },

    // Identified area artifacts revealed through Unveiling.
    { id: "item:crossroads_waystone", name: "Wayfinder's Compass", tier: 1, variant: "exploration", type: "artifact" },
    { id: "item:mossbound_heartstone", name: "Mossheart Bloom", tier: 1, variant: "earth", type: "artifact" },
    { id: "item:whispering_chime", name: "Whisperwind Whistle", tier: 1, variant: "air", type: "artifact" },
    { id: "item:stillwater_idol", name: "Stillwater Rod", tier: 1, variant: "water", type: "artifact" },
    { id: "item:ironroot_golem_core", name: "Ironroot Weight", tier: 2, variant: "earth", type: "artifact" },
    { id: "item:zephyr_wisp_chime", name: "Zephyr Longbow", tier: 2, variant: "air", type: "artifact" },
    { id: "item:fenwarden_idol", name: "Fenwarden's Club", tier: 2, variant: "water", type: "artifact" },
    { id: "item:cragbound_relic", name: "Cragbound Spade", tier: 3, variant: "earth", type: "artifact" },
    { id: "item:tempest_eye", name: "Tempest Caller", tier: 3, variant: "air", type: "artifact" },
    { id: "item:drowned_scepter", name: "Drowned Hook", tier: 3, variant: "water", type: "artifact" },
    { id: "item:basalt_crown_fragment", name: "Basalt Trophy", tier: 4, variant: "earth", type: "artifact" },
    { id: "item:skybreak_sigil", name: "Skybreak Sigil", tier: 4, variant: "air", type: "artifact" },
    { id: "item:abyssal_crown", name: "Abyssal Starcrown", tier: 4, variant: "water", type: "artifact" },

    { id: "item:deepstone_guardian_core", name: "Deepstone Pyramid", tier: 5, variant: "earth", type: "artifact" },
    { id: "item:highwind_wisp_chime", name: "Highwind Resonator", tier: 5, variant: "air", type: "artifact" },
    { id: "item:mooncurrent_tide_idol", name: "Mooncurrent Medal", tier: 5, variant: "water", type: "artifact" },
    { id: "item:verdant_golem_core", name: "Verdant Crook", tier: 6, variant: "earth", type: "artifact" },
    { id: "item:stormwing_wisp_chime", name: "Stormwing Mantle", tier: 6, variant: "air", type: "artifact" },
    { id: "item:glacial_tide_idol", name: "Glacial Loop", tier: 6, variant: "water", type: "artifact" },
    { id: "item:obsidian_golem_relic", name: "Obsidian Prism", tier: 7, variant: "earth", type: "artifact" },
    { id: "item:celestial_wisp_chime", name: "Celestial Arrowhead", tier: 7, variant: "air", type: "artifact" },
    { id: "item:abyssal_tide_scepter", name: "Abyssal Laurel", tier: 7, variant: "water", type: "artifact" },
    { id: "item:primordial_golem_heart", name: "Primordial Frame", tier: 8, variant: "earth", type: "artifact" },
    { id: "item:starfall_wisp_sigil", name: "Starfall Seal", tier: 8, variant: "air", type: "artifact" },
    { id: "item:worldtide_tide_crown", name: "Worldtide Reliquary", tier: 8, variant: "water", type: "artifact" },
    { id: "item:worldcore_relic", name: "Worldcore Spire", tier: 9, variant: "earth", type: "artifact" },
    { id: "item:firmament_wisp_chime", name: "Firmament Staff", tier: 9, variant: "air", type: "artifact" },
    { id: "item:leviathan_tide_scepter", name: "Leviathan Skiff", tier: 9, variant: "water", type: "artifact" },
    { id: "item:genesis_golem_core", name: "Genesis Key", tier: 10, variant: "earth", type: "artifact" },
    { id: "item:origin_wisp_sigil", name: "Origin Key", tier: 10, variant: "air", type: "artifact" },
    { id: "item:eternal_tide_crown", name: "Eternal Key", tier: 10, variant: "water", type: "artifact" },

    // Transmutation Catalyst placeholders; names and sale tiers can be tuned later.
    { id: "item:earth_catalyst_i", name: "Lesser Earth Catalyst", tier: 2, variant: "earth" },
    { id: "item:earth_catalyst_ii", name: "Weak Earth Catalyst", tier: 3, variant: "earth" },
    { id: "item:earth_catalyst_iii", name: "Regular Earth Catalyst", tier: 4, variant: "earth" },
    { id: "item:earth_catalyst_iv", name: "Greater Earth Catalyst", tier: 5, variant: "earth" },
    { id: "item:earth_catalyst_v", name: "Superior Earth Catalyst", tier: 6, variant: "earth" },
    { id: "item:earth_catalyst_vi", name: "Exalted Earth Catalyst", tier: 7, variant: "earth" },
    { id: "item:earth_catalyst_vii", name: "Supreme Earth Catalyst", tier: 8, variant: "earth" },
    { id: "item:earth_catalyst_viii", name: "Transcendent Earth Catalyst", tier: 9, variant: "earth" },
    { id: "item:air_catalyst_i", name: "Lesser Air Catalyst", tier: 2, variant: "air" },
    { id: "item:air_catalyst_ii", name: "Weak Air Catalyst", tier: 3, variant: "air" },
    { id: "item:air_catalyst_iii", name: "Regular Air Catalyst", tier: 4, variant: "air" },
    { id: "item:air_catalyst_iv", name: "Greater Air Catalyst", tier: 5, variant: "air" },
    { id: "item:air_catalyst_v", name: "Superior Air Catalyst", tier: 6, variant: "air" },
    { id: "item:air_catalyst_vi", name: "Exalted Air Catalyst", tier: 7, variant: "air" },
    { id: "item:air_catalyst_vii", name: "Supreme Air Catalyst", tier: 8, variant: "air" },
    { id: "item:air_catalyst_viii", name: "Transcendent Air Catalyst", tier: 9, variant: "air" },
    { id: "item:water_catalyst_i", name: "Lesser Water Catalyst", tier: 2, variant: "water" },
    { id: "item:water_catalyst_ii", name: "Weak Water Catalyst", tier: 3, variant: "water" },
    { id: "item:water_catalyst_iii", name: "Regular Water Catalyst", tier: 4, variant: "water" },
    { id: "item:water_catalyst_iv", name: "Greater Water Catalyst", tier: 5, variant: "water" },
    { id: "item:water_catalyst_v", name: "Superior Water Catalyst", tier: 6, variant: "water" },
    { id: "item:water_catalyst_vi", name: "Exalted Water Catalyst", tier: 7, variant: "water" },
    { id: "item:water_catalyst_vii", name: "Supreme Water Catalyst", tier: 8, variant: "water" },
    { id: "item:water_catalyst_viii", name: "Transcendent Water Catalyst", tier: 9, variant: "water" },
]

// Add repeatable, shop-only goods here. Do not add these IDs to skill action outputs.
// Example: { id: "item:minor_tonic", name: "Minor Tonic", tier: 1, shopPrice: 100, description: "A simple restorative.", variant: "shop", icon: OTHER_ICONS.STAR }
export const SHOP_ITEM_DEFINITIONS = []

const ARTIFACT_TRASH_NAMES = {
    crossroads: "Crossroads Scrap",
    mossbound_foothills: "Leaf Litter",
    whispering_fields: "Field Litter",
    stillwater_pools: "Silt-Caked Clump",
    ironroot_ravine: "Rusted Shavings",
    zephyr_heights: "Torn Canvas",
    moonlit_fen: "Marsh Silt",
    shattered_crags: "Loose Scree",
    tempest_reach: "Windworn Flotsam",
    drowned_sanctum: "Soaked Rubble",
    basalt_crown: "Coal Fragments",
    skybreak_summit: "Summit Litter",
    tidal_abyss: "Saltworn Scrap",
    deepstone_warrens: "Cave Gravel",
    highwind_expanse: "Dry Paper",
    mooncurrent_basin: "Silt Pebbles",
    verdant_crucible: "Compost Clump",
    stormwing_pinnacles: "Loose Plumes",
    glacial_mirror: "Frost Chips",
    obsidian_throne: "Black Glass Chips",
    celestial_rift: "Ashen Fragments",
    leviathan_trench: "Trench Silt",
    primordial_forge: "Forge Cinders",
    starfall_firmament: "Old Fabric",
    worldtide_sanctum: "Sea-Worn Rubble",
    worldcore_caldera: "Caldera Dust",
    boundless_empyrean: "Worn Packing",
    leviathans_grave: "Grave Pebbles",
    genesis_bastion: "Bastion Chippings",
    origin_zenith: "Zenith Dust",
    eternal_deep: "Deepwater Sediment",
}

const getArtifactTrashItemId = unidentifiedItem => {
    const areaId = unidentifiedItem.id
        .replace(/^item:unidentified_/, "")
        .replace(/_artifact$/, "")
    return "item:artifact_trash_" + areaId
}

const unidentifiedArtifactDefinitions = ITEM_DEFINITIONS.filter(item =>
    item.type === "unidentifiedArtifact"
)
const ARTIFACT_TRASH_DEFINITIONS = unidentifiedArtifactDefinitions.map(item => {
    const areaId = item.id.replace(/^item:unidentified_/, "").replace(/_artifact$/, "")
    const name = ARTIFACT_TRASH_NAMES[areaId]
    if (!name) throw new Error("Missing artifact trash name for " + item.id)

    return {
        id: getArtifactTrashItemId(item),
        name,
        tier: item.tier,
        variant: item.variant,
        baseValue: 250,
        type: "artifactTrash",
        icon: OTHER_ICONS.BOX,
    }
})

const ITEM_DEFINITIONS_WITH_TRASH = ITEM_DEFINITIONS.map(item =>
    item.type === "unidentifiedArtifact"
        ? { ...item, revealsTrashItemId: getArtifactTrashItemId(item) }
        : item
)

const ALL_ITEM_DEFINITIONS = [
    ...ITEM_DEFINITIONS_WITH_TRASH,
    ...ARTIFACT_TRASH_DEFINITIONS,
    ...SHOP_ITEM_DEFINITIONS,
]

const getItemClassification = (item) => {
    if (item.shopPrice !== undefined || item.variant === "shop") {
        return { group: "shop", type: "shopItem" }
    }
    if (item.type === "companionContainer" || item.type === "companionExperience" || item.type === "companionTrinket") {
        return { group: "companions", type: item.type }
    }
    if (item.type === "unidentifiedArtifact") {
        return { group: "combat", type: "unidentifiedArtifact" }
    }
    if (item.type === "artifact" || item.type === "artifactTrash") {
        return { group: "artifacts", type: item.type }
    }
    if (item.type === "resource") {
        return { group: "exploration", type: "resource" }
    }
    if (item.id.includes("_catalyst_")) {
        return { group: "transmutation", type: "catalyst" }
    }
    if (item.variant === "research") {
        return { group: "research", type: "researchMaterial" }
    }
    return { group: "spellcraft", type: "essence" }
}

export const ITEM_DATA = ALL_ITEM_DEFINITIONS.map(item => ({
    ...item,
    ...getItemClassification(item),
    baseValue: item.baseValue ?? getBaseItemValue(item.tier),
    name: item.name ?? humanize(item.id.replace(/^item:/, "")),
    icon: item.icon ?? ITEM_SPRITES[item.id] ?? OTHER_ICONS.STAR,
}))

export const ITEM_DATA_BY_ID = Object.fromEntries(
    ITEM_DATA.map(item => [item.id, item])
)

export const SHOP_ITEM_DATA = ITEM_DATA.filter(item =>
    Number.isFinite(item.shopPrice) && item.shopPrice >= 0
)

export const SHOP_ITEM_DATA_BY_ID = Object.fromEntries(
    SHOP_ITEM_DATA.map(item => [item.id, item])
)

// Currencies are deliberately kept out of ITEM_DATA and ITEM_DATA_BY_ID.
// They are balances, not physical inventory entries, and never consume bag slots.
export const CURRENCY_DATA = [
    {
        id: "currency:coins",
        name: "Coins",
        icon: OTHER_ICONS.COINS,
        variant: "shop",
        type: "currency",
    },
    {
        id: "currency:fame",
        name: "Fame",
        icon: OTHER_ICONS.STAR,
        variant: "primary",
        type: "currency",
    },
]

export const CURRENCY_DATA_BY_ID = Object.fromEntries(
    CURRENCY_DATA.map(currency => [currency.id, currency])
)


// Return only owned items in a source group or semantic type. These helpers are
// shared by inventory filtering and Unveiling's Material Destruction actions.
export const getInventoryItemsByGroup = (inventory, group) =>
    ITEM_DATA
        .filter(item => item.group === group && (inventory?.[item.id] ?? 0) > 0)
        .map(item => ({ ...item, amount: inventory[item.id] }))

export const getInventoryItemsByType = (inventory, type) =>
    ITEM_DATA
        .filter(item => item.type === type && (inventory?.[item.id] ?? 0) > 0)
        .map(item => ({ ...item, amount: inventory[item.id] }))
