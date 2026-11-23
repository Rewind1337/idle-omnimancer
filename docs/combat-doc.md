# Combat Design

## Status and purpose

Combat is a planned **passive skill**. Once unlocked and started, it should continuously fight in one selected unlocked Exploration area while the player carries out an unrelated active action. Changing the Combat location must not interrupt that active action.

Combat reuses the Exploration world map and area data. It does not need a separate map.

## World map and area progression

- Reuse the shared `HexMap` component and area definitions in `src/data/worldData.js`.
- The map uses axial hex coordinates (`q`, `r`). Exploration owns area visibility, unlocking and its own per-area action progression.
- The player chooses an already-unlocked Exploration area as the Combat location.
- Each area has a corresponding Combat action, with its own action level and XP progression, following the same general action/skill progression model as Exploration.
- Completing an encounter counts as completing that area's Combat action. It grants base XP to the corresponding Combat action and contributes to the overall Combat skill progression.
- The selected area's Exploration action level is intended to improve Combat output, Combat XP and the chance to obtain that area's artifact.
- Combat rewards are defined by the selected area's `combat` data in `worldData.js`. By default, Combat should award only the rewards configured there, plus the normal progression XP. Additional reward systems (such as unidentified objects and artifacts) must be explicitly configured rather than silently added as generic drops.

## Encounter and cycle model

Combat is one continuous, automatic cycle of encounters in the selected area.

- An area currently has one enemy type and one enemy per encounter. The data model should support an ordered enemy lineup for future encounters with multiple enemies.
- The player attacks only the **first living enemy** in the lineup. Once it is defeated, the player targets the next enemy, continuing until the entire lineup is defeated.
- Every living enemy attacks the player independently. Each enemy has its own attack timer and attack interval, based on its configured enemy archetype. Enemy attacks are not combined into a synchronized group attack.
- Enemy archetypes provide small, recognizable stat variations, such as:
  - **Average:** balanced health, damage and attack interval.
  - **Heavy hitter:** slower attacks with higher damage.
  - **Quick:** faster attacks with lower damage.
  - **Tank:** higher health with lower damage.
  - Future boss archetypes may combine high health with high damage, or high speed with high damage.
- Enemies inherit their element from the area. For now, every enemy in an area has the same element as that area; the neutral starting area has Neutral enemies. Mixed-element enemy lineups are not currently planned.
- Enemy health and damage scale with the area's progression/number. Enemy attack interval also scales by a small flat amount: `5 - (areaNumber - 1) * 0.05` seconds before applying the archetype interval multiplier. For example, area 7 has a 4.7-second baseline enemy interval.
- Small stat variance can make encounters of the same area feel slightly different without changing their archetype.
- The baseline attack interval is **5 seconds**. This is the reference point for balancing player timing and area 1 enemy timing.
- There is no base enemy health regeneration and no damage retention between encounters.
- When all enemies are defeated, the player wins the encounter and receives the area's configured Combat rewards and Combat action XP.
- A new encounter begins after a **5-second inter-cycle delay**. It is a fresh fight: the player returns to full health, all player and enemy cooldowns/timers are reset, and enemies start at full health. No damage carries between cycles.

## Player health, Barrier and damage output

The player does not die in Combat. **Barrier** is a minimum-health limit, not a conventional damage-absorbing shield.

- Incoming damage reduces current health, but health cannot fall below the current Barrier value.
- The player's damage output is 100% while current health is at or above 50% of maximum health.
- Below 50% health, damage output decreases linearly toward 0% at 0 health. Since Barrier prevents reaching 0, the actual minimum damage output is the multiplier at the Barrier value.
- For example, with 100 maximum health and 5 Barrier: 50 or more health gives 100% damage; 40 health gives 80%; 20 gives 40%; and 5 gives 10%.
- The damage multiplier is applied to outgoing player attack damage. It never becomes negative.
- The player starts each new encounter at full health.

For maximum health (H_{max}), current health (H), and Barrier (B):

`damageMultiplier = min(1, H / (0.5 * H_max))`

`newHealth = max(B, currentHealth - incomingDamage)`

Barrier should normally remain below 50% of maximum health, otherwise the player could reach the minimum health without ever suffering an offensive penalty.

## Player attack rotation

The player configures an ordered rotation containing **Omnibolt** and/or learned, leveled Spellcraft actions.

- Each selected Spellcraft action contributes its own element, tier and action level to its attack.
- Spellcraft action damage is calculated as:

`(spellcraftActionTier * 10) * (1 + 0.01 * spellcraftActionLevel)`

- The rotation executes one attack at a time, advancing to the next selected entry after each player attack, then looping back to the first entry.
- The initial rotation has **one slot**. Progression/upgrades may expand it, but the planned maximum is **three slots**.
- Duplicate choices are not allowed. The selection UI should allow each eligible Spellcraft action only once.
- Attack interval is based on the 5-second baseline and is modified by applicable Combat stats/effects. Damage modifiers and interval modifiers remain separate.
- If an attack is not currently usable for a future reason, the eventual implementation must define whether it is skipped or waits; this behavior is not yet decided.

### Omnibolt

Omnibolt is a special baseline attack choice, not a regular Spellcraft action.

- It is always **Neutral**, so it has no elemental advantage or disadvantage.
- Its effective spell level is the overall **Spellcraft skill level**, rather than an individual Spellcraft action level.
- It uses the same damage formula as other attacks, with its own configurable tier:

`(omniboltTier * 10) * (1 + 0.01 * spellcraftSkillLevel)`

- Its initial tier is **1**. A future upgrade, potentially through a Fame Shop purchase or another improvement, can increase its tier.
- Omnibolt can be selected alongside Spellcraft actions and can appear only once in a rotation.

## Elemental matchups

Earth, Air and Water use a counter cycle:

- **Earth counters Water.**
- **Water counters Air.**
- **Air counters Earth.**

An attack deals **125% damage** when its element counters the target, and **75% damage** when the target counters its element. A neutral matchup deals **100% damage**.

Neutral attacks and neutral targets have no advantage or disadvantage against any element. Omnibolt is Neutral.

## Combat stats and companion effects

The companion effect system recognizes these Combat-focused stats:

- `combatInterval` — modifies the player's attack interval; a lower interval means more frequent attacks.
- `combatDamage` — increases outgoing attack damage.
- `combatHealth` — increases the player's maximum Combat health.
- `combatShield` — increases the player's Barrier (the minimum-health limit).

Three neutral Prism companions are intended for future Combat areas and reward drops:

| Companion | Container item ID | Active effect |
|---|---|---|
| Earth Prism | `item:neutral_prism_ii` | Combat Damage |
| Air Prism | `item:neutral_prism_iii` | Combat Interval |
| Water Prism | `item:neutral_prism_iv` | Combat Shield |

The corresponding effect types, labels and icons are registered, but they do not affect combat outcomes until the Combat simulation consumes them. The Abyssal Lynx's existing Artifact Chance effect is also intended for Combat rewards.

## Rewards and Unveiling

- The selected area's `combat.produces` list is the default source of encounter rewards.
- Combat may also produce unidentified objects and the artifact associated with the selected area, but these must be explicitly configured as additional reward mechanics.
- Unidentified objects should have a minimum required overall Unveiling skill level based on their source area; later areas should require more Unveiling progression.
- Processing an eligible unidentified object through **Unveil Artifact or Companion** should have a chance to reveal the artifact associated with its source area and may reveal other valuable resources.
- Companion containers already use this Unveiling action, but unidentified Combat objects and artifact identification are not implemented.
- Exact unidentified object types, reward pools, artifact chances, additional reward quantities and identification costs remain undecided.

## Proposed configuration responsibilities

The implementation should keep balance data separate from the combat simulation:

- **Combat configuration:** baseline timings, player starting stats, Omnibolt tier, initial and maximum rotation slots, elemental matchup multipliers, health/barrier behavior, area-based enemy interval scaling and enemy archetype definitions.
- **World area data:** each area's Combat action identity, enemy lineup/type selection and its configured Combat rewards. The existing `combat.produces` field remains the default reward list.
- **Spellcraft data:** source of each spell's element and tier; the action's current level supplies its damage scaling.
- **Companion effects:** source of player Combat stat modifiers, applied through the existing effect system.
- **Combat runtime state:** selected area, ordered rotation, current enemy lineup and health, player health, individual attack timers, current target, cycle state and progression/reward results. Runtime state must be designed for save/load and offline simulation.

Enemy archetypes should define relative stat tendencies, while area progression supplies the overall scaling. Exact multipliers, variance ranges, enemy base-stat formulas, reward chances and offline catch-up behavior are intentionally left for balancing and implementation.

## Remaining design decisions

- Exact enemy health and damage scaling per area, the size of stat variance, and exact archetype multipliers.
- The final interaction between player attack interval effects and the 5-second baseline.
- How to handle an unavailable rotation entry, if that can occur.
- Combat unlock requirements and how the passive process is started, resumed and saved.
- Combat XP amounts/scalars, the exact way Exploration action level affects Combat, and the reward/artifact chance formulas.
- Unidentified object types, reward pools and identification costs.
- Offline simulation precision and limits for independent enemy attack timers.
