# Combat Design

## Status and purpose

Combat is a planned **passive skill**. Once unlocked and started, it should continue fighting in one selected unlocked Exploration area while the player carries out an unrelated active action. Changing the Combat location must not interrupt that active action.

Combat does not need a separate world map. It should reuse the Exploration map and its area data.

## World map and area progression

- Reuse the shared `HexMap` component and the area definitions in `src/data/worldData.js`.
- The map uses axial hex coordinates (`q`, `r`); adjacency is based on hex distance. Exploration owns visibility, unlocking and the per-area action progression.
- The player chooses an already-unlocked Exploration area as the Combat location.
- The level of that area's Exploration action is intended to improve Combat output, Combat XP and the chance to obtain that area's artifact.
- The area-specific artifact records, stable item IDs and icons are already registered in `worldData.js`, `itemData.js` and `iconLibrary.jsx`. Combat does not currently award them.

## Proposed Spellcraft attack rotation

The current direction is to let the player choose one or more learned and leveled Spellcraft actions and arrange them into an ordered attack rotation.

- Each selected Spellcraft action supplies its element and a baseline attack damage.
- A selected action should become stronger as that Spellcraft action's level increases.
- Earth, Air and Water should use a rock-paper-scissors relationship: an attack deals **25% more damage** when its element counters the target and **25% less damage** when the target counters its element.
- The exact counter cycle, damage curve, rotation rules and how Spellcraft action levels translate into damage remain open for balancing.

This is a design direction, not an implemented combat formula. No element counter mapping is assumed yet.

## Companion effects

The companion effect system now recognizes these Combat-focused stats:

- `combatInterval` — a lower interval means attacks happen more frequently.
- `combatDamage` — increases attack damage.
- `combatHealth` — increases the player's Combat health.
- `combatShield` — increases the player's Combat shield.

Three neutral Prism companions have been added for future Combat areas and reward drops:

| Companion | Container item ID | Active effect |
|---|---|---|
| Earth Prism | `item:neutral_prism_ii` | Combat Damage |
| Air Prism | `item:neutral_prism_iii` | Combat Interval |
| Water Prism | `item:neutral_prism_iv` | Combat Shield |

The corresponding effect types, labels and icons are registered, but they do not change combat outcomes until the Combat simulation consumes them. The Abyssal Lynx's existing Artifact Chance effect is also intended for Combat rewards.

## Rewards and Unveiling

- Combat is intended to produce unidentified objects and may award the artifact associated with the selected area.
- Unidentified objects should have a minimum required overall Unveiling skill level based on the area where they were obtained; later areas should require more Unveiling progression.
- Processing an eligible unidentified object through **Unveil Artifact or Companion** should have a chance to reveal the artifact associated with its source area and may reveal other valuable resources.
- Companion containers already use this Unveiling action, but unidentified Combat objects and artifact identification are not implemented.
- The exact unidentified object types, reward pools, artifact chances, other rewards and identification costs remain undecided.

## Decisions needed before implementation

- Combat unlock requirements and how the passive process is started, resumed and saved.
- Whether the player chooses a single target/encounter or Combat resolves repeatable encounters automatically within the selected area.
- How many Spellcraft actions can be placed in a rotation, whether order matters, and what happens when an action is unavailable.
- The Earth/Air/Water counter cycle and whether the matchup modifier is applied exactly as ×1.25 / ×0.75 to final damage.
- Baseline damage per Spellcraft action, action-level scaling and the relationship between Spellcraft tier and Combat progression.
- Attack interval, player/enemy health and shield behavior, enemy strength scaling and encounter pacing.
- Combat XP progression, reward tables, unidentified object drops, area artifact rates and offline simulation rules.
