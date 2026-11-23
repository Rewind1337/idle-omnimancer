# Combat Design

## Status and purpose

Combat is implemented as a **passive skill**. Once unlocked and started, it continuously fights in one selected Exploration area while the player carries out an unrelated active action. Combat reuses the Exploration world map, shared `HexMap`, area data, skill/action progression and save system.

The implementation lives primarily in `src/data/combatConfig.js`, `src/game/gameEngine.js`, `src/game/playerState.js`, `src/game/gameReducer.js` and `src/pages/CombatPage.jsx`.

## World map, unlock and progression

- Combat is unlocked from **Shop → Skills & Actions** for 10 Earth Catalyst I, 10 Air Catalyst I, 10 Water Catalyst I and 50,000 Coins (before any applicable unlock-cost reduction).
- Each world area has its own Combat action and saved action level/XP. All Combat actions are granted with the skill unlock, but an action can only be started after its corresponding Exploration action has been unlocked.
- The player chooses an already-unlocked Exploration area as the Combat location. The shared world map shows Combat action levels and marks an area when its configured artifact is in the inventory.
- Combat can run alongside the player's active action and other passive activities. Starting another Combat area switches the selected area without stopping the unrelated active action. Combat can be paused and resumed; a paused encounter retains its current health and timers.
- Completing an encounter grants XP to that area's Combat action. Like other action progression, a completion can add at most one action level and excess XP for that completion is discarded. Overall Combat skill progression is derived from the combined levels of its area actions.
- The selected area's Exploration action level improves Combat XP, ordinary configured item output and artifact chance by **+1% per Exploration action level above level 1**. The multiplier is therefore (1 + 0.01 	imes (explorationActionLevel - 1)).
- The configured reward list is read from the area's `combat.produces` field in `worldData.js`. No generic drops are added.

## Encounter and cycle model

- Each area currently configures one enemy in an ordered `enemyLineup` array. The runtime supports multiple enemies in the same lineup.
- The player attacks only the **first living enemy** in the lineup. When it is defeated, the next living enemy becomes the target.
- Every living enemy attacks independently. Each has its own attack interval and timer; simultaneous attacks are resolved as separate attacks rather than merged into one hit.
- Enemy archetypes currently have these relative stats:

| Archetype | Health | Damage | Interval |
|---|---:|---:|---:|
| Average | x1.00 | x1.00 | x1.00 |
| Heavy Hitter | x1.10 | x1.50 | x1.25 |
| Quick | x0.85 | x0.75 | x0.70 |
| Tank | x1.80 | x0.65 | x1.20 |

- Enemies inherit the element of their area. A missing area element is treated as Neutral. Every current area has a single enemy of its area's element.
- Base enemy health is **22** and base damage is **2**. Both scale by area number: health is multiplied by (1.08^{areaNumber-1}), and damage by (1.045^{areaNumber-1}). Each enemy independently receives a random **±5%** health and damage variation.
- Enemy attack interval starts at 5,000 ms and is reduced by **50 ms per area after area 1**, before the archetype interval multiplier. The current implementation clamps the baseline to at least 1,000 ms before applying the archetype multiplier. Area 7 therefore starts from 4,700 ms.
- There is no enemy health regeneration and no damage carries over between encounters.
- On victory, configured Combat rewards are rolled and the area's Combat action receives XP. A new encounter begins after a **5,000 ms** delay.
- Every new encounter is fresh: the player returns to full health, all player/enemy timers reset to their configured intervals, and all enemies start at full health.

## Player health, Barrier and outgoing damage

The player never dies in Combat. **Barrier** is a minimum-health limit, not a conventional damage-absorbing shield.

- Base maximum health is **100** and base Barrier is **5**.
- Incoming damage reduces health, but health cannot fall below Barrier.
- Damage output is 100% while current health is at least 50% of maximum health. Below 50%, it declines linearly toward 0% at 0 health. Barrier prevents reaching 0.
- For 100 maximum health and 5 Barrier, 50 or more health gives 100% damage; 40 gives 80%; 20 gives 40%; and 5 gives 10%.
- Companion Combat Health modifies maximum health. Combat Shield modifies Barrier. Barrier is clamped below 50% of maximum health.

The outgoing health multiplier is:

`min(1, currentHealth / (0.5 * maxHealth))`

Incoming damage uses:

`max(barrier, currentHealth - incomingDamage)`

## Player attack rotation

The player configures an ordered rotation containing **Omnibolt** and/or unlocked Spellcraft actions.

- Each selected Spellcraft action contributes its element, tier and current action level.
- Spellcraft damage is `(tier * 10) * (1 + 0.01 * spellcraftActionLevel)`.
- The rotation performs one attack at a time, advances to the next entry after each attack, and loops when it reaches the end.
- The initial rotation has **one slot**. The configuration allows a planned maximum of **three slots**, but slot expansion is not yet purchasable or otherwise unlocked.
- Duplicate choices are rejected. Only learned Spellcraft actions and Omnibolt are accepted.
- Player attack interval starts at **5,000 ms**. The Combat Interval companion effect modifies the interval multiplicatively; lower values make attacks faster. The interval is clamped to at least 100 ms.
- If a saved Spellcraft choice is no longer valid, save normalization removes it and falls back to Omnibolt if the rotation becomes empty. At runtime, an unavailable entry also falls back to Omnibolt.

### Omnibolt

Omnibolt is a special baseline attack, not a regular Spellcraft action.

- It is always **Neutral** and has no elemental advantage or disadvantage.
- Its effective level is the overall Spellcraft skill level, not an individual action level.
- Its damage uses the same formula with its own configurable tier: `(omniboltTier * 10) * (1 + 0.01 * spellcraftSkillLevel)`.
- Its initial tier is **1**. A future upgrade may increase it; no such upgrade is currently available.
- Omnibolt can be selected alongside Spellcraft actions and can appear only once in the rotation.

## Elemental matchups

The counter cycle is:

- **Earth counters Water.**
- **Water counters Air.**
- **Air counters Earth.**

An attack deals **125% damage** when its element counters the target, and **75% damage** when the target counters its element. Neutral matchups deal **100% damage**. Neutral attacks or targets always deal 100%; Omnibolt is Neutral.

## Combat stats and companion effects

Combat consumes the existing companion effect system:

- `combatInterval` reduces player attack interval.
- `combatDamage` increases outgoing damage.
- `combatHealth` increases maximum Combat health.
- `combatShield` increases Barrier.
- The Abyssal Lynx's `artifactChance` effect increases the chance of receiving a configured area artifact.

Three neutral Prism companions provide Combat effects:

| Companion | Container item ID | Active effect |
|---|---|---|
| Earth Prism | `item:neutral_prism_ii` | Combat Damage |
| Air Prism | `item:neutral_prism_iii` | Combat Interval |
| Water Prism | `item:neutral_prism_iv` | Combat Shield |

Their existing per-level effect definitions are consumed by the Combat stat calculations; they are not hardcoded as separate bonuses in the Combat page.

## Rewards, artifact chance and inventory handling

- Each area's existing `combat.produces` entry identifies its associated artifact. All current 31 area rewards map to existing artifact item definitions.
- The base artifact chance uses the Exploration artifact chance of **0.1% per victory**. It is multiplied by the selected area's Exploration-level output multiplier and any Combat-targeted Artifact Chance effects, then clamped to 100%.
- Artifact output is not multiplied into multiple copies by the ordinary output multiplier. A successful artifact roll awards the configured base quantity.
- Ordinary configured item rewards use the Exploration-level output multiplier and fractional output rolls. (Current area Combat reward lists contain the area artifact.)
- If an item reward cannot fit into the Bag, its already-rolled item and quantity are kept as a pending reward. Combat waits for space rather than rerolling or losing the item; when space becomes available, the pending reward is granted and the 5-second rest begins.
- Reward item sources are surfaced in the normal item tooltip's Obtaining section.

Unidentified Combat objects and artifact unveiling are not implemented. They remain a future reward system, rather than being added as implicit drops.

## Save and offline behavior

- The selected area, rotation, running state, current phase, encounter health, independent enemy timers, player health/timer, completed encounter count and reward queues are saved with the normal player state.
- Save normalization validates the selected area, rotation entries, enemy lineup and numeric encounter fields. Invalid or outdated encounter data is reset instead of being trusted.
- Combat uses the same offline catch-up path as other game activity. The engine advances offline time in the existing one-second slices, processing each enemy's timer and the player's timer independently.
- Starting or changing areas creates a fresh encounter. Pausing preserves the current encounter. A victory resets the next encounter after the rest delay.

## Configuration responsibilities

- **`combatConfig.js`:** skill unlock costs, XP curve, timings, player base stats, Omnibolt tier, rotation slot limits, enemy base scaling, archetypes, elemental multipliers and Exploration-level output scaling.
- **`worldData.js`:** each area's enemy lineup and configured Combat rewards.
- **Spellcraft data:** each Spellcraft action's element and tier; saved action state provides the current level.
- **Companion effect definitions:** source the player's Combat stat modifiers.
- **Combat runtime state:** saved on the player and simulated in `gameEngine.js`.

## Remaining future work

- Add an upgrade path for the second and third rotation slots.
- Add an upgrade path for Omnibolt's tier.
- Implement unidentified Combat objects and the Unveiling flow if/when their rewards, chances, requirements and costs are defined.
- Add multi-enemy/boss lineups to areas when those encounters are designed.
- Balance the current enemy and XP/output numbers through playtesting.
