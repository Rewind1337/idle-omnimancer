# Combat Design

## Status and purpose

Combat is an implemented **passive skill**. Once started, it continuously fights in one selected, unlocked Exploration area while the player performs an unrelated active action. Combat reuses the shared Exploration world map, `HexMap`, area data, progression model, companion effects and normal player save/offline simulation.

The implementation is primarily in `src/data/combatConfig.js`, `src/data/worldData.js`, `src/game/gameEngine.js`, `src/game/gameReducer.js`, `src/game/playerState.js` and `src/pages/CombatPage.jsx`.

## Unlock and progression

- Combat is purchased through **Shop → Skills & Actions**.
- Current unlock cost: 25 each of Earth Catalyst II, Air Catalyst II and Water Catalyst II; 250 each of Mossbound Ore, Whispering Seeds and Stillwater Reeds; and 25,000 Coins. Existing unlock-cost reduction effects apply to this cost.
- Every world area has its own Combat action and saved action level/XP. The Combat skill unlock grants the area actions, but an action can only be started after its corresponding Exploration action is unlocked.
- Completing an encounter grants XP to the Combat action for the **active** area. Action progression follows the existing rule of at most one level-up per completion; excess XP for that completion is discarded. Overall Combat skill progression is derived from its area actions.
- Combat can run alongside the selected active action and other passive activities. It can be paused and resumed; pausing preserves the current encounter and its timers.

## Selected area versus active area

The map selection is deliberately separate from the area currently being fought:

- Clicking an unlocked area changes the pending map selection and the action card being shown, but does **not** switch or interrupt the running encounter.
- The Combat Panel continues to show the current active area and its live encounter until **Start Combat** is clicked for the newly selected area.
- Starting Combat commits the pending area as the active area. If it differs from the previous active area, the previous encounter is discarded and a fresh encounter begins in the newly committed area.
- Starting again in the same active area resumes its paused encounter. The active area is saved independently from the pending map selection.

## Encounter and cycle model

- Each area currently configures one enemy in an ordered `enemyLineup` array. The runtime supports future multi-enemy lineups.
- The player attacks only the **first living enemy** in the lineup. When it is defeated, the next living enemy becomes the target.
- Every living enemy attacks independently, each with its own attack interval and timer. Simultaneous enemy attacks resolve as separate attacks.
- Enemy archetypes use the following relative stats:

| Archetype | Health | Damage | Interval |
|---|---:|---:|---:|
| Average | x1.00 | x1.00 | x1.00 |
| Strong | x1.10 | x1.50 | x1.25 |
| Quick | x0.85 | x0.75 | x0.70 |
| Tank | x1.80 | x0.65 | x1.20 |

- Enemies inherit the element of their area. A missing area element is treated as Neutral.
- Base enemy health is **22** and base damage is **2**. Health scales by (1.08^{areaNumber-1}), damage by (1.045^{areaNumber-1}), and each enemy independently receives a random ±5% health and damage variation.
- Enemy attack interval starts at 5,000 ms and is reduced by 50 ms per area after area 1, before the archetype interval multiplier. The baseline is clamped to at least 1,000 ms before the archetype multiplier. Area 7 therefore starts at 4,700 ms.
- There is no enemy health regeneration and no damage carries between encounters.
- On victory, Combat action XP, the rare unidentified-artifact roll and the area's ordinary Exploration resources are awarded. A new encounter begins after a **5,000 ms** delay.
- Every new encounter is fresh: the player returns to full health, all player/enemy timers reset, and enemies start at full health.

## Player health, Barrier and outgoing damage

The player never dies in Combat. **Barrier** is a minimum-health limit, not a conventional damage-absorbing shield.

- Base maximum health is **100** and base Barrier is **5**.
- Incoming damage reduces health, but health cannot fall below Barrier.
- Damage output is 100% while current health is at least 50% of maximum health. Below 50%, it declines linearly toward 0% at 0 health. Barrier prevents reaching 0.
- For 100 maximum health and 5 Barrier, 50 or more health gives 100% damage; 40 gives 80%; 20 gives 40%; and 5 gives 10%.
- Companion Combat Health modifies maximum health. Combat Shield modifies Barrier. Barrier is clamped below 50% of maximum health.

Outgoing health multiplier:

`min(1, currentHealth / (0.5 * maxHealth))`

Incoming damage:

`max(barrier, currentHealth - incomingDamage)`

## Player attack rotation

The player configures an ordered rotation containing **Omnibolt** and/or unlocked Spellcraft actions.

- Each selected Spellcraft action contributes its element, tier and current action level.
- Damage per spell tier is **5**. Spellcraft damage is:

`(spellcraftActionTier * 5) * (1 + 0.01 * spellcraftActionLevel)`

- The rotation performs one attack at a time, advances to the next entry after each attack, then loops to the first entry.
- The initial rotation has **one slot**. The configuration allows a maximum of three slots, but the second and third slots still need a progression/purchase path.
- Duplicate choices are rejected. Only learned Spellcraft actions and Omnibolt are accepted.
- Player attack interval starts at **5,000 ms**. The Combat Interval companion effect reduces that interval multiplicatively; the interval is clamped to at least 100 ms.
- If a saved Spellcraft choice is no longer valid, save normalization removes it and falls back to Omnibolt if the rotation becomes empty. Runtime also falls back to Omnibolt if a selected entry becomes unavailable.

### Omnibolt

Omnibolt is a special baseline attack, not a regular Spellcraft action.

- It is always **Neutral** and has no elemental advantage or disadvantage.
- Its effective level is the overall Spellcraft skill level, not an individual action level.
- It uses the same damage-per-tier value:

`(omniboltTier * 5) * (1 + 0.01 * spellcraftSkillLevel)`

- Its initial tier is **1**. A future upgrade may increase it; no such upgrade is currently available.
- Omnibolt can be selected alongside Spellcraft actions and can appear only once in a rotation.

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
- The Abyssal Lynx's `artifactChance` effect increases the chance of receiving an unidentified artifact drop.

The neutral Prism companions provide Combat effects:

| Companion | Container item ID | Active effect |
|---|---|---|
| Earth Prism | `item:neutral_prism_ii` | Combat Damage |
| Air Prism | `item:neutral_prism_iii` | Combat Interval |
| Water Prism | `item:neutral_prism_iv` | Combat Shield |

Their existing per-level effect definitions are consumed by the Combat stat calculations.

## Combat rewards and unidentified artifacts

Each area's Combat reward data has two distinct purposes:

- `combat.produces` contains the area's **Unidentified [Area] Artifact** item. It is a rare drop, using the existing base **0.1% chance per victory**. The chance is multiplied by the selected area's Exploration-level output multiplier and applicable Artifact Chance effects, then capped at 100%.
- `combat.artifactId` identifies the real artifact that the unidentified item can reveal later.
- `explorationRewards` is derived from the area's `exploration.produces` list. Combat also awards these ordinary Exploration items on every victory, applying the selected area's Exploration-level output multiplier and fractional output rolls. Companion containers are excluded; they are not Combat rewards.

There is one unique unidentified artifact item per area. Each item:

- Has semantic type `unidentifiedArtifact` and inventory group `combat`.
- Uses the tier of its source area.
- Has a base value of **1,000 Coins per tier** (Tier I = 1,000; Tier X = 10,000).
- Requires overall Unveiling level **5 per tier** (Tier I = 5; Tier X = 50), matching the same progression pattern as companion containers.
- Points to its corresponding identified artifact through `revealsItemId`.

Unidentified artifacts are Combat resources, not identified artifacts. They are explicitly excluded from **Study Combat Materials** and can only be consumed by **Unveil Artifact or Companion**. The identified items retain semantic type `artifact` and use the separate `artifacts` inventory group.

## Artifact identification through Unveiling

**Unveil Artifact or Companion** accepts both companion containers and unidentified artifacts.

- The unidentified artifact's `requiredUnveilingLevel` is checked against the player's **overall Unveiling skill level**, using the same eligibility rule as companion eggs/geodes/shells.
- Each attempt consumes one selected unidentified artifact.
- Each attempt has a **10% chance** to reveal its linked identified artifact. A failed attempt consumes the input and awards no identified artifact.
- On success, the real artifact is added to inventory and its ID is recorded in `player.identifiedArtifacts`. Repeated successful identifications can add additional copies while the identified state remains unique.
- The Unveiling action reserves the inventory capacity needed for a possible success before the action can complete, accounting for the selected input slot being freed.
- Identified artifact tooltips list the Unveiling action as their source. Unidentified artifact tooltips list the area's Combat drop chance and their Unveiling consumption source.

The Combat map displays a question mark for each visible area whose artifact has not yet been identified and a check mark once that artifact is in the player's identified-artifact record. Legacy saves that already contain a real area artifact in inventory are migrated to the identified-artifact record.

## Inventory handling

- Combat rewards are rolled once at encounter completion. If an item cannot fit in the Bag, its rolled item and quantity are held in a pending reward queue; the reward is not rerolled or lost.
- Combat waits for Bag space before beginning the next encounter. Pending rewards can be granted after space is freed even while Combat is paused; the five-second rest countdown advances only while Combat is running.
- The Unveiling action checks capacity for the possible identified artifact before consuming an unidentified artifact, including the slot freed by consuming the input.

## Save and offline behavior

- Pending map selection and active Combat area are saved independently.
- The rotation, running state, current phase, encounter health, individual enemy timers, player health/timer, completed encounter count, identified artifact IDs and reward queues are saved with the normal player state.
- Save normalization validates the selected and active areas, rotation entries, enemy lineup and numeric encounter fields. Legacy direct artifact inventory is migrated as already identified.
- Combat uses the same offline catch-up path as other game activity. The engine advances offline time in the existing one-second slices, processing each enemy's timer and the player's timer independently.
- Pausing preserves the current encounter; changing the active area via **Start Combat** creates a fresh encounter. Merely clicking a different map area does not interrupt the current fight.

## Configuration responsibilities

- **`combatConfig.js`:** skill unlock costs, XP curve, timings, player base stats, Omnibolt tier and damage-per-tier value, rotation slot limits, enemy base scaling, archetypes, elemental multipliers and Exploration-level output scaling.
- **`worldData.js`:** each area's enemy lineup, unidentified artifact drop, linked identified artifact and Exploration reward list.
- **Spellcraft data:** each Spellcraft action's element and tier; saved action state provides the current level.
- **Companion effect definitions:** source the player's Combat stat modifiers.
- **Combat runtime state:** active and pending area, encounter, timers, rotation, rewards and identification state are saved on the player and simulated in `gameEngine.js`.

## Remaining future work

- Add a progression/purchase path for the second and third rotation slots.
- Add an upgrade path for Omnibolt's tier.
- Add multi-enemy/boss lineups to areas when those encounters are designed.
- Balance enemy stats, the current 0.1% drop chance, 10% identification chance and reward output through playtesting.
