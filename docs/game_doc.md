# Omnimancer Idle — Core Game Design

*Working design document · Skills, progression, exploration, combat, resources and economy*

## 1. Game Overview

**Omnimancer Idle** is an open-ended incremental idle game about a mage learning, practicing and mastering an expanding collection of magical disciplines.

- Skills are separate tabs or pages, each with its own progression and mechanics.
- Actions within a skill level independently; their progress also contributes to that skill's overall level.
- Players choose which skills, actions and systems to develop. Progression is not a rigid sequence.
- Resources connect skills through unlocks, recipes and other systems. Every physical item can also be sold for gold.
- Gold is used for skill and action unlocks, inventory expansion and other progression costs.
- Long-term progression and substantial offline gains are core parts of the game.
- The initial systems should be easy to understand while leaving room for much more complex skills and mechanics later.

### Planned skills and systems

| Skill / system | Type | Main purpose |
|---|---|---|
| Research | Active | Produce general magical knowledge and research materials. |
| Spellcraft | Active | Learn and cast Earth, Air and Water spells; produce elemental essences. |
| Transmutation | Active | Combine research materials and elemental essences into refined resources. |
| Exploration | Active | Explore named areas on a shared hex map, develop each area and discover resources and companion containers. |
| Unveiling | Active | Use Material Destruction actions to gain insight; unveil eligible unidentified objects and companion containers once the skill-level requirement is met. |
| Combat | Passive | Continuously fight in a selected unlocked Exploration area; produce combat rewards, unidentified objects and chances at area artifacts. |
| Companions | Collection system | Obtain elemental companions by using Unveil Artifact or Companion on containers discovered through Exploration after meeting their Unveiling level requirements. Further progression and effects are undecided. |

Research, Spellcraft and Transmutation establish the initial resource and progression loop. Exploration is planned as the fourth active skill, followed by Unveiling as a fifth active skill. Combat is the first planned passive skill.

---

## 2. Primary Elements and Aspects

### 2.1 Primary Elements

The initial elemental system uses three distinct Primary Elements:

- **Earth:** solidity, material, structure, weight and endurance; associated with stone, dust, minerals, crystals and mountains.
- **Air:** movement, airflow, pressure, speed and the atmosphere; associated with breath, breezes, gusts, gales and storms.
- **Water:** fluidity, flow, pressure, depth and transformation; associated with droplets, streams, waves, currents and torrents.

Design direction:

- Early elemental effects should be simple, tangible and easy to control.
- Higher tiers should grow into immense geological, atmospheric and tidal forces.
- Each element retains its own identity, spells, resources and companion types.
- Spellcraft currently gives each element a small action trade-off: Earth takes 5% longer, grants 15% more action XP and costs 10% more Mana; Air takes 5% less time, grants 10% less action XP and costs 10% less Mana; Water is the baseline.
- The elements can share progression structures without becoming interchangeable.
- Order, Life and Death are not part of the current Primary Element system.

### 2.2 Future concept: Aspects

Aspects are a separate, early concept and are **not** part of the planned initial implementation.

- A future system may let the player invoke or channel an Aspect, potentially when starting a run or prestige cycle.
- Choosing an Aspect could lock the player into it for that run and apply modifiers to several parts of the game.
- Actions performed while an Aspect is active could award Aspect XP.
- Aspects could have their own levels, progression and bonuses.
- The number of Aspects, their effects, invocation, run structure, XP and balancing are all undecided.
- Aspects must remain distinct from the three Primary Elements.

---

## 3. Shared Skill and Action Progression

### 3.1 Core terminology

- **Skill:** A major progression category and its own tab or page.
- **Action:** An activity within a skill, such as a Research activity, spell, Transmutation recipe, Exploration area, material-destruction task or special identification task.
- **Action level:** The independent level of one action.
- **Skill level:** The overall level derived from the progression of all actions within that skill.
- **Milestone:** A reward earned through an action's or skill's separate milestone track.

The number of actions can differ between skills. Every skill and action has its own progression, and improving one does not automatically level an unrelated action or skill.

### 3.2 Independent action progression

- Every normal active action has its own level from **1 to 100**, its own XP and XP requirement, base duration, base output and individual bonuses.
- Completing an action awards XP to that action only. For example, Research II does not directly level Research I, Research III or a Spellcraft action.
- Each action has a tier-based XP scalar. Higher-tier actions generally require more XP than introductory actions.
- Each skill can also have its own action-XP scalar, so actions from different skills may progress at different rates.
- There is no shared action-XP pool.
- Resource dependencies, skill levels, milestones and bonuses can connect progression without merging action levels.
- Unveiling's Material Destruction actions and **Unveil Artifact or Companion** each have their own independent action level and XP progression. Successfully processing a companion container or unidentified object awards substantial XP to **Unveil Artifact or Companion**.

Passive skills or other future systems may use a different progression structure where appropriate; they do not have to imitate an active action model.

### 3.3 Skill progression

- Every skill has its own level, with a maximum of **100**.
- Skill XP is derived from the combined progression of every action belonging to that skill.
- Improving actions contributes to the overall skill, but one heavily developed action must not be enough to max out the skill.
- Early skill levels should be achievable after relatively little action progression. Higher levels should require increasingly broad development across the skill.
- Each skill has its own progression scalar. Skills can have different numbers of actions and different curves.
- A skill **cannot reach level 100 until every action belonging to it has reached action level 100**.
- The exact formula that converts action progression into skill XP remains undecided.

Skills level independently. Research progress does not automatically increase Spellcraft, Transmutation or Exploration skill levels.

### 3.4 Unlocking skills and actions

- Actions are unlocked in their configured sequence. The next locked action is the only locked action shown, even when several actions share a tier; all previously unlocked actions remain visible.
- Unlocking a later action does not require the previous action to reach level 100.
- An unlocked action becomes available but does not automatically become active.
- Some unlocks can require resources from other actions or skills when this creates a meaningful progression connection.
- Skill unlocks generally require gold plus resources from earlier skills.
- Unlocking a skill should normally include its first action, avoiding a separate first-action cost unless a skill has a specific reason to work differently.
- Requirements should be approachable progression gates, not long checklists that force every earlier action to level 100.

Exact prices and resource quantities are not yet defined; see Section 14.

### 3.5 Action duration and XP

When a completed action grants enough XP to level up, it gains one level and its remaining XP resets to zero. Excess XP from that completion is discarded rather than carried into the next action level.

- Every action has a base duration and base XP reward.
- Higher-tier actions generally take longer but should provide more XP and more valuable or useful resources.
- Duration can be improved by:
  - The action's own level bonuses.
  - Milestones from its skill.
  - Bonuses from other skills.
  - Global bonuses and future progression systems.
- Action cards display the action's final output multiplier and preservation chance.
- Action-stat tooltips list the currently active element modifiers, applicable skill milestones and repeated action milestones that contribute to that statistic. Skill and action level tooltips list their configured milestones, including upcoming inactive rewards.
- XP is awarded when an action completes.
- XP requirements increase with action level and are affected by the skill scalar and action-tier scalar.
- Two actions at the same level can therefore require different amounts of XP.
- Level 100 should be a substantial early-game goal, becoming more achievable as the player gains bonuses and upgrades. With a sufficiently developed setup, an action should eventually be capable of reaching level 100 over a long offline period or overnight.

### 3.6 Active actions and passive systems

- The initial operating model for active skills is one selected action at a time.
- This is an initial limitation, **not a permanent rule for the entire game**.
- Future skills may introduce passive actions, automation or systems that progress independently.
- Some actions may become self-sustaining; others may remain expensive or occasional activities.
- Not every skill or action needs to be equally active or use the same progression mechanism.
- **Exploration and Unveiling are active skills. Combat is passive** and runs independently of the selected active action (see Sections 8–9 and 11).

### 3.7 Offline progress

Offline activity should simulate eligible game activity rather than award an unrelated bonus.

Offline progress can include:

- Completed active actions and action XP.
- Skill XP and milestone progress.
- Resources produced by eligible actions.
- Passive or automated systems once unlocked.
- Mana regeneration.
- Other future systems that explicitly support offline progression.

Design goals:

- A long break, such as an overnight period, should produce meaningful progress.
- Offline gains can accumulate substantial resources and XP.
- Selling accumulated resources remains the player's decision; gold is not automatically earned from unsold resources.
- Offline simulation should respect normal action and resource rules.
- Exact offline duration limits, caps, full-inventory handling and future automation rules remain undecided.

---

## 4. Skill Levels and Passive Bonuses

### 4.1 Skill-level model

- Skill level is an overall measure of development across that skill's actions, not a separate action.
- A skill can begin gaining levels after a few action-level improvements; all actions do not need to progress equally from the start.
- Its scalar determines how action progress translates into skill progress.
- Early levels should be accessible; late levels should require broad, substantial development.
- The formula must account for skills having different numbers of actions.
- Level 100 requires every action in the skill to reach level 100.

### 4.2 Per-level passive effects

A skill may grant a passive bonus for every skill level, separate from milestone rewards.

- Spellcraft currently increases passive Mana regeneration by **+0.5 Mana per second for every Spellcraft level gained after level 1**. Its configured base regeneration applies at level 1.
- Per-level bonuses are linear: each new level adds the same amount.
- Other skills may have different per-level bonuses or no such bonus.
- Per-level bonuses do not replace or consume action or skill milestone rewards.
- Spellcraft's maximum Mana capacity remains separate from its regeneration bonus.

---

## 5. Skill One — Research

**Purpose:** Develop general magical knowledge and produce research materials used by other skills.

Research is the foundational, element-independent skill. Its actions progress from accessible study to rare, powerful and almost primordial discoveries.

### 5.1 Actions and resources

Research currently has eight planned actions. Each action produces its own item and levels independently from 1 to 100.

| Tier | Action | Resource produced | Theme |
|---|---|---|---|
| I | **Read Books** | Loose Notes | Basic observations and introductory knowledge. |
| II | **Study Ancient Notes** | Bound Notes | Organized knowledge and older research. |
| III | **Examine Arcane Manuscripts** | Arcane Manuscript | Established magical theory. |
| IV | **Decipher Sealed Tomes** | Sealed Grimoire | Restricted, difficult knowledge. |
| V | **Explore Lost Archives** | Lost Archive Record | Rare discoveries from forgotten collections. |
| VI | **Investigate Forbidden Lore** | Forbidden Codex | Dangerous and powerful knowledge. |
| VII | **Unravel Primordial Mysteries** | Primordial Chronicle | Knowledge of the earliest foundations of existence. |
| VIII | **Research the First Truth** | Genesis Testament | Legendary, creation-level knowledge. |

- The names describe each action's theme; they do not mean that the player must own or find the named objects.
- Each resource is an individual item, not part of a generic Research Folio.
- Research materials support other skills, unlocks and recipes, and can also be sold.
- Research I is available from the start. Further actions are unlocked with gold.
- The eight actions are the current planned set, not a limit on future expansion.

---

## 6. Skill Two — Spellcraft

**Purpose:** Learn and cast spells associated with Earth, Air and Water, producing elemental essences.

Each spell is an independent action with its own level, XP, duration, Mana cost and resource output. Separate Earth, Air and Water skill-level tracks are **not** currently planned.

### 6.1 Spell actions

The first available spells are:

| Element | Tier I spell | Effect |
|---|---|---|
| Earth | **Shape Pebble** | Manipulate a small amount of earth or stone. |
| Air | **Stir Breeze** | Create a small, controlled movement of air. |
| Water | **Gather Droplet** | Gather or manipulate a tiny amount of water. |

Example spell naming progression:

| Tier | Earth | Air | Water |
|---|---|---|---|
| I | Shape Pebble | Stir Breeze | Gather Droplet |
| II | Shape Stone | Create Gust | Form Ripple |
| III | Raise Boulder | Summon Gale | Guide Stream |
| IV | Split the Ground | Call the Tempest | Shape the Wave |
| V | Trigger Quake | Unleash Cyclone | Command Torrent |
| VI | Mountain's Wrath | Stormfront | Tidal Surge |
| VII | Continental Shift | Sky Rend | Awaken Maelstrom |
| VIII | Worldshaper | Call of the Firmament | Primordial Tide |

- Names are thematic examples and can be refined.
- The progression should move from simple elemental tricks to extraordinary feats.
- Higher-tier spells can be unlocked without first reaching level 100 in the preceding spell.
- The initial spell actions become available through the Spellcraft unlock and subsequent action unlocks.

### 6.2 Mana and spellcasting

- Mana is a separate regenerating resource, not an inventory item.
- Casting a spell consumes its Mana cost.
- Mana regenerates passively, including offline, subject to the final offline rules.
- Spell Mana costs follow a configurable tier curve in `SPELLCRAFT_CONFIG.mana.cost`: base 6 at tier 1, then previous cost × 2 − 1. The baseline Water costs are 6, 11, 21, 41, 81, 161, 321 and 641 for tiers I–VIII, before elemental Mana-cost multipliers and milestone discounts.
- Element modifiers are configured per element in `SPELLCRAFT_CONFIG.elementModifiers`. Earth takes 5% longer, grants 15% more XP and costs 10% more Mana; Air takes 5% less time, grants 10% less XP and costs 10% less Mana; Water uses the baseline time, XP and Mana cost.
- If Mana is insufficient for the next cast, the cast waits. Mana must not be consumed for an action that cannot complete.
- Spellcraft's configured base regeneration is **1 Mana per second at skill level 1**. Each additional Spellcraft skill level adds **+0.5 Mana per second** and **+50 maximum Mana**.
- Effective regeneration is derived from the current overall Spellcraft skill level and applies during both online and offline simulation.
- Maximum Mana capacity and passive regeneration are calculated separately.

### 6.3 Elemental essences

Every spell produces an essence matching its element and tier. These are distinct inventory items used by Transmutation and potentially by future unlocks or systems.

| Tier | Earth essence | Air essence | Water essence |
|---|---|---|---|
| I | Dust | Breath | Droplet |
| II | Pebble | Breeze | Ripple |
| III | Stone | Gust | Stream |
| IV | Shard | Gale | Wave |
| V | Crystal | Tempest | Torrent |
| VI | Geode | Cyclone | Maelstrom |
| VII | Mountain Heart | Skycore | Abyssal Heart |
| VIII | Worldheart | Firmament Core | Primordial Tide |

- The full item identity retains its element and tier; for example, Earth Dust is the Tier I Earth Essence.
- Essences of different elements are not interchangeable, even when they share a tier.
- Higher tiers should be more potent, valuable and useful in demanding recipes.
- The player chooses whether to retain essences for progression or sell them for gold.

### 6.4 Spell and skill progression

- Each spell levels independently from 1 to 100.
- A spell's level measures experience with that spell.
- Spellcraft's skill level measures broader development across all Spellcraft actions.
- Spellcraft milestones may improve general spell and elemental knowledge.
- Any future elemental mastery system must remain separate from spell action levels and the overall Spellcraft skill level.

---

## 7. Skill Three — Transmutation

**Purpose:** Combine Research materials and elemental essences into more refined resources.

Transmutation connects Research and Spellcraft. Its initial purpose is resource progression, not equipment, combat items or a complete crafting catalogue.

### 7.1 Actions and elemental paths

Transmutation has separate Earth, Air and Water paths. Each action has its own level, XP curve, duration, input requirements and output.

Example action structure:

| Tier | Earth action | Air action | Water action |
|---|---|---|---|
| I | Earth Transmutation I | Air Transmutation I | Water Transmutation I |
| II | Earth Transmutation II | Air Transmutation II | Water Transmutation II |
| III | Earth Transmutation III | Air Transmutation III | Water Transmutation III |
| IV | Earth Transmutation IV | Air Transmutation IV | Water Transmutation IV |
| V | Earth Transmutation V | Air Transmutation V | Water Transmutation V |

- These are structural labels; descriptive names may replace them when recipes are finalized.
- Higher tiers should require more advanced inputs and produce more potent materials.
- Elements do not need to have the same final number of actions.

### 7.2 Catalyst resources

The current resource family is **Catalysts**, with separate elemental identities:

- Earth Transmutation produces Earth Catalysts.
- Air Transmutation produces Air Catalysts.
- Water Transmutation produces Water Catalysts.
- Higher tiers produce increasingly refined forms.
- Final tier-specific names are undecided.

A Catalyst represents a concentrated material created by combining research knowledge with an elemental essence. Catalysts can be retained for future uses or sold.

### 7.3 Inputs and example recipes

Each action consumes materials from earlier skills.

- **Earth Transmutation I:** a Research material (such as Loose Notes or Bound Notes) + Earth Dust → Earth Catalyst.
- **Air Transmutation I:** a Research material + Air Breath → Air Catalyst.
- **Water Transmutation I:** a Research material + Water Droplet → Water Catalyst.

Higher tiers should require more advanced Research materials and elemental essences.

- The initial config provides eight tiered actions for each element so every current Spellcraft essence has one matching Transmutation recipe and is consumed by that recipe only.
- Each recipe pairs its corresponding elemental essence with a Research material and produces the matching elemental Catalyst tier.
- Recipe amounts, unlock costs, action durations and XP values in `transmutationConfig.js` are first-pass placeholders for in-game balancing, not final design decisions.
- Recipes should create meaningful connections between earlier skills.
- Each Transmutation action levels independently from 1 to 100.
- The overall Transmutation skill level follows the shared skill-level rules.
- Catalysts are physical items and can be sold.

---

## 8. Skill Four — Exploration

**Purpose:** Explore a growing world map, develop individual areas and discover area resources and elemental companion containers.

Exploration is an **active skill**. Every area is an independent action with its own level, XP, duration, rewards and unlock state. The areas share a hex map with Combat.

### 8.1 Shared hex map and adjacency

- The map uses axial hex coordinates (`q`, `r`). Two areas are adjacent when their hex distance is exactly one: `(abs(dq) + abs(dr) + abs(dq + dr)) / 2 === 1`.
- The Crossroads is the neutral starting area and is unlocked automatically when Exploration is unlocked.
- The Crossroads and its immediate neighbors form the initial visible map cluster. Further tiles become visible when they are directly adjacent to any unlocked area.
- A visible locked area can be selected to inspect its requirements. A distant, non-visible area is faded and cannot be selected.
- **Area unlocking is adjacency-based, not sequential.** Any locked area may be unlocked when at least one directly adjacent area is already unlocked and its configured costs can be paid. Unlocking one branch does not require unlocking earlier-numbered areas or maxing another area.
- The current branch layout includes the Crossroads connected to areas 2–4; area 2 connects onward to areas 5, 8 and 11; area 3 connects to areas 6, 9 and 12; area 4 connects to areas 7, 10 and 13. Hex geometry may create additional valid connections where coordinates are adjacent.
- The map is shared with Combat and future systems that use locations.

### 8.2 Current areas

| Area | Name | Element | Tier | Exploration resource | Combat artifact |
|---:|---|---|---:|---|---|
| 1 | The Crossroads | Neutral | I | Crossroads Field Notes | Crossroads Waystone |
| 2 | The Mossbound Foothills | Earth | I | Mossbound Ore | Mossbound Heartstone |
| 3 | The Whispering Fields | Air | I | Whispering Seeds | Whispering Chime |
| 4 | The Stillwater Pools | Water | I | Stillwater Reeds | Stillwater Idol |
| 5 | The Ironroot Ravine | Earth | II | Ironroot Ore | Ironroot Golem Core |
| 6 | The Zephyr Heights | Air | II | Zephyr Plumes | Zephyr Wisp Chime |
| 7 | The Moonlit Fen | Water | II | Moonlit Pearls | Fenwarden Idol |
| 8 | The Shattered Crags | Earth | III | Shatterstone Fragments | Cragbound Relic |
| 9 | The Tempest Reach | Air | III | Stormglass Shards | Tempest Eye |
| 10 | The Drowned Sanctum | Water | III | Abyssal Ink | Drowned Scepter |
| 11 | The Basalt Crown | Earth | IV | Basalt Heart | Basalt Crown Fragment |
| 12 | The Skybreak Summit | Air | IV | Skybreak Aether | Skybreak Sigil |
| 13 | The Tidal Abyss | Water | IV | Tidal Heart | Abyssal Crown |
| 14 | The Deepstone Warrens | Earth | V | Deepstone Crystals | Deepstone Guardian Core |
| 15 | The Highwind Expanse | Air | V | Highwind Plumes | Highwind Wisp Chime |
| 16 | The Mooncurrent Basin | Water | V | Mooncurrent Pearls | Mooncurrent Tide Idol |
| 17 | The Verdant Crucible | Earth | VI | Verdant Heartwood | Verdant Golem Core |
| 18 | The Stormwing Pinnacles | Air | VI | Stormwing Feathers | Stormwing Wisp Chime |
| 19 | The Glacial Mirror | Water | VI | Glacial Pearls | Glacial Tide Idol |
| 20 | The Obsidian Throne | Earth | VII | Obsidian Fragments | Obsidian Golem Relic |
| 21 | The Celestial Rift | Air | VII | Celestial Aether | Celestial Wisp Chime |
| 22 | The Leviathan Trench | Water | VII | Abyssal Corals | Abyssal Tide Scepter |
| 23 | The Primordial Forge | Earth | VIII | Primordial Ore | Primordial Golem Heart |
| 24 | The Starfall Firmament | Air | VIII | Starfall Aether | Starfall Wisp Sigil |
| 25 | The Worldtide Sanctum | Water | VIII | Worldtide Pearls | Worldtide Tide Crown |
| 26 | The Worldcore Caldera | Earth | IX | Worldcore Shards | Worldcore Relic |
| 27 | The Boundless Empyrean | Air | IX | Firmament Plumes | Firmament Wisp Chime |
| 28 | The Leviathan's Grave | Water | IX | Leviathan Essence | Leviathan Tide Scepter |
| 29 | The Genesis Bastion | Earth | X | Genesis Ore | Genesis Golem Core |
| 30 | The Origin Zenith | Air | X | Origin Aether | Origin Wisp Sigil |
| 31 | The Eternal Deep | Water | X | Eternal Tideheart | Eternal Tide Crown |

- Every area currently has one unique guaranteed Exploration resource and one area-specific artifact reserved for Combat/Unveiling.
- The area identity, element, tier, action ID, map position and reward IDs are defined centrally in `src/data/worldData.js`; item metadata and icons are defined in `src/data/itemData.js` and `src/data/iconLibrary.jsx`.

### 8.3 Unlock costs and action progression

- Exploration itself currently costs 5 each of Earth Catalyst I, Air Catalyst I and Water Catalyst I, plus 10,000 coins.
- The Crossroads action is free and unlocked by default with the skill.
- Other area unlock costs are shared by tier: Tier I costs 10,000 coins, Tier II costs 30,000 coins, Tier III costs 75,000 coins and Tier IV costs 150,000 coins.
- Area unlock cost and adjacency are separate requirements: a neighboring area can still be unaffordable until the player has enough coins.
- Each area action levels independently from 1 to 100. Its level contributes to the overall Exploration skill level; level 100 in the skill requires every Exploration action to reach level 100.
- Current base action duration is 5 seconds at Tier I, increasing by 1 second per tier. Base action XP is 12 at Tier I, increasing by 5 per tier. XP requirements follow the shared configured action progression curve.
- Exploration skill milestones and area action milestones use the shared milestone system. Exact area-specific milestone rewards remain to be developed.

### 8.4 Area rewards and companion-container discoveries

- Each completed area action guarantees its configured area resource, subject to normal output multipliers and inventory-capacity rules.
- Areas 5, 6 and 7 can additionally discover Tier-I containers: Earth Geodes, Air Eggs and Water Shells respectively.
- Areas 11, 12 and 13 can additionally discover Tier-II containers: Earth Geodes, Air Eggs and Water Shells respectively.
- The current base companion-container discovery chance is 0.1% per completed Exploration action in an area configured with a container. This is a separate chance roll, not a guaranteed action output; item-output bonuses also multiply the discovery chance, which is capped at 100%.
- Areas without a configured container do not make a container discovery roll.
- Containers remain in inventory until the player reaches their minimum Unveiling skill-level requirement and processes them through **Unveil Artifact or Companion**. Exact level requirements and unveiling rewards remain to be balanced.
- Exploration does not drop Combat artifacts. Each area's artifact is defined now as its future area-specific Combat reward and may be revealed through Unveiling.

---
## 9. Passive Skill — Combat

**Purpose:** Fight continuously in a selected Exploration area and produce combat rewards.

Combat is the first planned **passive skill**. It runs independently of the active action selected in Research, Spellcraft, Transmutation or Exploration.

### 9.1 Starting and selecting a location

- Combat is unlocked and started once.
- After it has been started, it remains active without requiring the player to repeatedly start it.
- The player selects an already-unlocked Exploration area as the Combat location.
- Combat runs continuously in that area while the player works on an unrelated active action.
- Changing the Combat location does not interrupt or replace the current active-skill action.
- Combat uses the shared Exploration map.

### 9.2 Area progression and Combat rewards

The individual Exploration level of the selected area improves Combat performance there:

- Higher Combat output.
- More Combat XP.
- Higher chance to obtain that area's artifact.

Each area has its own artifact.

### 9.3 Unidentified objects and artifacts

- Combat can produce unidentified objects.
- Every unidentified object carries a minimum required **Unveiling skill level** before it can be identified. Its requirement is based on the area where it was obtained and that area's place in map progression; early-area objects require less Unveiling progression than objects from later areas.
- Using **Unveil Artifact or Companion** on an eligible object gives a chance to obtain the artifact associated with the area where it was found.
- Identification can also reveal other valuable resources with meaningful gold sale values.
- The exact relationship between object types, identification, artifact chances, other rewards and area artifacts is not yet defined.
- Combat formulas, encounter details, reward tables, XP progression, identification costs and artifact rates remain undecided.

Combat must remain independent of the player's currently selected active action. Its passive nature does not imply that its final progression model must be identical to an active skill's action structure.

---

## 10. Companions

**Purpose:** Collect elemental companions by unveiling containers discovered through Exploration.

Companions are a collection system connected to Exploration and Unveiling. Their final interface placement and progression structure are not yet implemented.

### 10.1 Containers and elemental identity

- Companions are obtained by processing containers found through Exploration with Unveiling's **Unveil Artifact or Companion** action.
- Earth Geodes contain Earth companions; Air Eggs contain Air companions; Water Shells contain Water companions.
- Container items are classified in the inventory as the `companions` group and `companionContainer` type, separate from ordinary Exploration resources.
- The current world contains Tier-I containers in areas 5–7 and Tier-II containers in areas 11–13. Their minimum Unveiling skill-level requirements are intended to scale with their source area's progression.
- Containers are tied to their corresponding elemental type. Not every area needs a unique companion or unique container.

### 10.2 Undecided companion design

- The number and variety of companions.
- Hatching requirements, timing and duplicate handling.
- Whether companions have levels, rarity, growth, upgrades or other progression.
- Whether companions provide bonuses, and if so, what those bonuses affect.
- How companions are displayed, equipped, assigned or otherwise used.
- Whether companions can be obtained through any method besides Exploration containers.

Do not assume a companion rescue system; the current acquisition concept is elemental containers discovered through Exploration and then unveiled.

---
## 11. Skill Five — Unveiling

**Purpose:** Uncover hidden properties and secrets by sacrificing ordinary materials, then identify unidentified objects and open companion containers.

Unveiling is an **active skill** with two action categories:
- **Material Destruction:** regular actions that consume eligible items from other skill tabs.
- **Unveil Artifact or Companion:** one special action that processes eligible unidentified objects and companion containers.

Every action follows the standard independent level 1–100 progression and contributes to the overall Unveiling skill level.

### 11.1 Material Destruction actions

- Each Material Destruction action consumes eligible physical items from one other skill tab in exchange for XP.
- Every source tab has its own Material Destruction action. These actions level independently and contribute to the overall Unveiling skill level.
- Item definitions expose a source `group` and a semantic `type`. The current groups are `research`, `spellcraft`, `transmutation`, `exploration`, `combat`, and `companions`; regular Material Destruction actions select owned items from their corresponding source group.
- The current semantic types are `researchMaterial`, `essence`, `catalyst`, `resource`, `artifact`, `companionContainer`, and `shopItem`. These classifications are metadata for inventory filtering and system eligibility, not additional item IDs.
- Companion containers are in the `companions` group and are excluded from ordinary Exploration Material Destruction; they are processed only by **Unveil Artifact or Companion**.
- The first action is **Destroy Research Books**.
- The initial action structure is:

| Source tab | Material Destruction action | Eligible items |
|---|---|---|
| Research | **Destroy Research Books** | Eligible Research books and materials. |
| Spellcraft | Destroy Spellcraft Materials | Eligible elemental essences and other Spellcraft materials. |
| Transmutation | Destroy Transmutation Materials | Eligible Catalysts and other Transmutation materials. |
| Exploration | Destroy Exploration Materials | Eligible resources obtained through Exploration. |
| Combat | Destroy Combat Materials | Eligible identified Combat rewards and materials. |

- The list establishes the intended one-action-per-other-tab structure; exact action names and eligible item groups can be refined.
- Companion containers and unidentified objects are reserved for **Unveil Artifact or Companion**, not the Material Destruction actions.
- Each Material Destruction action lets the player choose one currently owned item from its source group. Every completed action consumes exactly one copy of the selected item.
- Destruction takes 6 seconds plus 1 second per item tier above Tier I.
- Destruction XP is calculated from item sale value as **round(baseValue^0.7)**, with a minimum reward of 1 XP. This gives approximately 1 XP for value 1, 5 XP for value 10 and 25 XP for value 100.
- Destroying an item removes it from the inventory. The player gives up its sale value and any other use it could have had in exchange for Unveiling progression.

### 11.2 Unveil Artifact or Companion

- Unlocking Unveiling also unlocks **Unveil Artifact or Companion** immediately, alongside the first Material Destruction action, **Destroy Research Books**.
- **Unveil Artifact or Companion** can process both:
  - Companion containers (Geodes, Eggs and Shells), opening them to reveal a companion.
  - Unidentified objects obtained through Combat, revealing a chance at the artifact from their source area and potentially other valuable, sellable resources.
- Each container or unidentified object has a minimum required **overall Unveiling skill level**. The player cannot process it until the skill reaches that requirement.
- Requirements are assigned according to the item's source area and its place in map progression: early-area finds have low requirements; late-game finds have much higher requirements.
- Successfully processing a companion container awards 50 XP to **Unveil Artifact or Companion** and takes 15 seconds.
- The first container opened for each element unlocks that element's companion.
- Further openings have a 50% chance to produce the matching elemental Companion XP item, or a 50% chance to produce the shared **Faded Trinket**, a low-value sellable item.
- Companion XP is represented by three separate inventory items: Earth Companion XP, Air Companion XP and Water Companion XP. These are not hidden per-companion counters.
- **Unveil Artifact or Companion** levels independently from 1 to 100. Its action-level progress contributes to the overall Unveiling skill level like every other Unveiling action.
- The requirement is checked against the overall Unveiling skill level, not the special action's individual level.
- Unidentified-object rewards and higher-tier companion reward scaling remain to be balanced and will be connected when Combat's unidentified-object data is implemented.

### 11.3 Skill progression and unlock

- Every Material Destruction action and **Unveil Artifact or Companion** has its own level from 1 to 100.
- Their combined progression contributes to the overall Unveiling skill level.
- Unveiling skill level is the progression gate for opening higher-level companion containers and identifying higher-level unidentified objects.
- Unlocking Unveiling grants both its first Material Destruction action (**Destroy Research Books**) and **Unveil Artifact or Companion**. The player does not need to purchase either action separately.
- Unlocking Unveiling costs 5 each of Mossbound Ore, Whispering Seeds and Stillwater Reeds, plus 10,000 coins.

---

## 12. Initial Numerical Balancing

All values in this section are starting points for implementation and playtesting, not immutable final balance. Initial actions should be straightforward and quick; higher tiers should take longer while providing more XP and more valuable or useful resources.

### 11.1 Base action values

#### Research

Research starts at 4 seconds and increases by 1 second per tier. Each action initially produces one resource per completion.

| Action | Base duration | Base XP per completion | Base output |
|---|---:|---:|---:|
| Read Books | 4 sec | 10 XP | 1 Loose Notes |
| Study Ancient Notes | 5 sec | 15 XP | 1 Bound Notes |
| Examine Arcane Manuscripts | 6 sec | 22.5 XP | 1 Arcane Manuscript |
| Decipher Sealed Tomes | 7 sec | 33.75 XP | 1 Sealed Grimoire |
| Explore Lost Archives | 8 sec | 50.625 XP | 1 Lost Archive Record |
| Investigate Forbidden Lore | 9 sec | 75.9375 XP | 1 Forbidden Codex |
| Unravel Primordial Mysteries | 10 sec | 113.90625 XP | 1 Primordial Chronicle |
| Research the First Truth | 11 sec | 170.859375 XP | 1 Genesis Testament |

#### Spellcraft

Tier I starts at 5 seconds. Each subsequent tier adds 2 seconds.

| Spell tier | Base duration | Base XP per completion |
|---|---:|---:|
| I | 5 sec | 20 XP |
| II | 7 sec | 30 XP |
| III | 9 sec | 45 XP |
| IV | 11 sec | 67.5 XP |
| V | 13 sec | 101.25 XP |

- Values apply independently to Earth, Air and Water spells of the same tier.
- These are initial example tiers, not a limit on the eventual number of spells.
- Mana costs are balanced separately.

#### Transmutation

Tier I starts at 6 seconds. Each subsequent tier adds 3 seconds.

| Transmutation tier | Base duration | Base XP per completion |
|---|---:|---:|
| I | 6 sec | 30 XP |
| II | 9 sec | 45 XP |
| III | 12 sec | 67.5 XP |
| IV | 15 sec | 101.25 XP |
| V | 18 sec | 151.875 XP |

Values apply independently to Earth, Air and Water Transmutation actions of the same tier. These are initial example tiers, not a final limit on the skill.

#### Starting duration pattern

- Research: 4, 5, 6, 7, 8, 9, 10, 11 seconds.
- Spellcraft: 5, 7, 9, 11, 13 seconds for the initial example tiers.
- Transmutation: 6, 9, 12, 15, 18 seconds for the initial example tiers.
- The initial output for each action is one resource per completion, before bonuses.

Exploration uses the configured values summarized in Section 8.3. Combat values have not yet been established.

### 11.2 Initial action XP requirements

Every action has its own XP requirement curve. The requirement becomes more demanding as the action levels.

The curve is influenced by:

- The action's base XP reward.
- Its starting XP requirement.
- The XP scalar for its skill.
- The additional XP scalar for its action tier.

The following table gives the starting number of completed actions required for the first action level-up (level 1 → 2):

| Skill | Action tier | Completions |
|---|---|---:|
| Research | I | 1 |
| Research | II | 1.5 |
| Research | III | 2.25 |
| Research | IV | 3.375 |
| Research | V | 5.0625 |
| Research | VI | 7.59375 |
| Research | VII | 11.390625 |
| Research | VIII | 17.0859375 |
| Spellcraft | I | 2 |
| Spellcraft | II | 3 |
| Spellcraft | III | 4.5 |
| Spellcraft | IV | 6.75 |
| Spellcraft | V | 10.125 |
| Transmutation | I | 3 |
| Transmutation | II | 4.5 |
| Transmutation | III | 6.75 |
| Transmutation | IV | 10.125 |
| Transmutation | V | 15.1875 |

- These are initial balancing values, not final formulas.
- The requirement is the same for each element-specific action within the same Spellcraft or Transmutation tier.
- Research's values continue a 1.5 progression between tiers.
- Fractional completion requirements are expected values; actual action completions remain whole actions.
- Higher-tier curves and all eventual skill/action scalars remain subject to playtesting.

---

## 13. Levels, Milestones and Bonus Stacking

### 12.1 Skill-level passive bonuses

A skill may award a passive effect at every skill level, such as the proposed fixed increase to maximum Mana per Spellcraft level. Such effects are separate from all milestone rewards.

### 12.2 Action-level bonuses and milestones

Each action has its own independent milestone track. Action milestones:

- Belong only to the action that reaches them.
- Are separate from the overall skill's milestone track.
- Can be earned independently by every action. For example, Research I and Research II each have their own level-25 milestone.
- Do not require the overall skill to reach the same numbered level.

Proposed recurring action-level bonuses:

| Frequency | Proposed bonus | Scope |
|---|---|---|
| Every 2 action levels | +0.5% action speed | That action |
| Every 5 action levels | +1% resource output | That action |
| Every 10 action levels | +1% chance to avoid consuming required input resources | That action |

Additional proposed action milestones:

| Action level | Additional reward | Scope |
|---|---|---|
| 25 | +25% action speed | That action |
| 50 | +100% resource output | That action |
| 100 | Not defined | To be decided |

- Recurring bonuses continue to apply at special milestones; the special rewards are additional.
- Input-saving chance matters for actions that consume inputs, such as Transmutation. It has no practical effect on an action without input costs unless a future system adds them.
- The game engine now reads recurring `actionMilestones` from each skill configuration. A reward with `levels: N` is awarded once per every N action levels, counting from level 0; for example, `levels: 2` first applies at action level 2 and again at 4, 6, and so on.
- Research's current prototype configuration grants +1% resource output every 2 levels, +1% action speed every 5 levels, and +10% action XP every 20 levels. Spellcraft currently grants +1% action speed every 2 levels, +1% resource output every 5 levels, and +10% action XP every 20 levels. These values are defined independently in each skill's `actionMilestones` configuration.
- The other schedule above remains a design proposal, not a hardcoded progression rule.

### 12.3 Skill milestones

Every skill has its own milestone track at **skill levels 10, 20, 30, 40, 50, 60, 70, 80, 90 and 100**.

Milestones are based on the overall skill level, not individual action levels. Reaching a Research milestone does not grant the corresponding Spellcraft or Transmutation reward.

The engine reads each skill's `milestones` configuration. A milestone becomes active when its source skill reaches the configured level; `reach: "local"` targets that source skill, `reach: "skill:<id>"` targets one named skill, and `reach: "global"` targets every registered skill. Its effect is applied to the relevant actions in the target skill.

Research currently has three prototype skill milestones: level 10 grants +10% action speed to Research, level 20 grants +20% action speed to Spellcraft, and level 30 grants +10% action XP globally. Spellcraft currently has three draft skill milestones: level 10 grants +10% action speed to Spellcraft, level 20 grants +20% item output to Transmutation, and level 30 grants +10% action speed globally. Further milestones remain to be configured.

Possible milestone purposes:

- **Improve the same skill:** e.g. increase output across all Research actions.
- **Improve another skill:** e.g. a Research milestone improves Spellcraft XP gain or action speed.
- **Provide a global bonus:** e.g. improve all skills. Levels 50 and 100 may be candidates for particularly important global boosts, but this is not a fixed schedule.
- **Grant a unique effect:** e.g. increase maximum Mana or another special capacity.

Potential reward categories:

- Action speed.
- Resource output.
- XP gain.
- Chance to avoid consuming input resources.
- Maximum Mana or another skill-specific capacity.
- Sell value multiplier.
- Unlock cost reduction.
- Other effects introduced by future systems.

A skill milestone may affect its own skill, another skill, all skills or a unique system. Exact rewards and reward-to-level mapping remain undecided.

Action milestones and skill milestones are separate progression tracks and can be reached at different times.

### 12.4 Bonus stacking

Bonuses of the same type from different sources stack **additively** by default.

- Example: +20% individual action speed and +20% global action speed = +40% total action speed.
- The same default applies to action speed, resource output, XP gain and other same-type bonuses.
- In config, a `type: "mult"` value is expressed as a multiplier, and only its bonus portion is accumulated: two `1.1` bonuses therefore produce +20%, not +21%. A `type: "flat"` value is added directly to the effect's corresponding stat.
- Action-time multipliers represent action speed: a `1.1` bonus means 10% more action speed, so the required duration is divided by 1.1.
- Fractional resource output is resolved by awarding the whole-number portion and rolling the fractional remainder for one additional unit.
- Any exception must be explicitly defined by the mechanic; exceptions are not assumed.

---

## 14. Gold and Unlock Economy

Gold is a shared currency used for action unlocks, skill unlocks, inventory expansion and other progression costs. It is earned by selling physical items.

### 13.1 Initial skill unlock structure

| Skill | Intended unlock requirement |
|---|---|
| Research | Available from the beginning; Research I is free. |
| Spellcraft | 100 Loose Notes and 1,000 coins. |
| Transmutation | Gold + Research materials + elemental essences produced by Spellcraft. |
| Exploration | 5 Earth Catalyst I, 5 Air Catalyst I, 5 Water Catalyst I and 10,000 coins. Unlocking the skill also unlocks The Crossroads. |
| Unveiling | Active skill; unlocking it also unlocks its first Material Destruction action, Destroy Research Books, and **Unveil Artifact or Companion**. Gold/resource requirements are undecided. |
| Combat | Passive skill; unlock and start requirements are not yet defined. |

- Unlocking a skill should normally include its first action.
- Resource requirements should connect skills without demanding that every earlier action reach level 100.
- The exact resource quantities and gold costs are undecided; the current Transmutation config uses editable starter values.
- The Companion collection's separate unlock conditions, if any, are also undecided.

### 13.2 Research actions and further action unlocks

- Research is available at the start with Research I and Loose Notes.
- Research I is free; later Research actions cost gold.
- Additional actions in an unlocked skill generally cost gold.
- Spellcraft action unlocks follow tiered Research-material and coin costs: tier 1 Air/Water require 100 Loose Notes and 2,000/3,000 coins; tier 2 requires 200 Bound Notes and 10,000/20,000/30,000 coins. Tiers 3–8 use 300–800 units of the matching Research material and elemental coin costs that increase tenfold per tier.
- Action prices should rise with tier and expected value, encouraging investment in existing production.
- Some actions may also require resources when this creates a meaningful connection.
- No fixed starting price sequence is defined.
- Gold is shared across the game, so players choose between new actions, new skills and inventory expansion.

### 13.3 Economy direction

- The initial three skills — Research, Spellcraft and Transmutation — primarily establish progression and useful materials, rather than being the game's main money makers.
- Their resources have sale value and can help fund unlocks.
- Players should often choose between keeping materials for future requirements and selling them for immediate gold.
- Later skills are expected to introduce much more valuable resources and stronger income opportunities.
- Prices, production rates, bag capacity and item values must be balanced together.

---

## 15. Bag and Inventory

The bag stores produced resources and other physical items. It is central to progression because items may be needed for recipes or unlocks and can also be sold.

### 14.1 Slots and stacking

- The bag currently starts with 25 slots, configured through `GLOBAL_CONFIG.startingBagSpace`.
- Each distinct item type occupies one slot; copies of the same item stack.
- Example: one or fifty Loose Notes use one slot. Earth Dust, Air Breath and Water Droplet each use a separate slot.
- Different elements and tiers remain separate items.
- Research materials, essences, Catalysts and future resources each use their own item slots.
- Coins and Mana are balances, not physical items, and do not occupy normal bag slots. Currency definitions (such as `currency:coins`) are kept separate from `ITEM_DATA`.

### 14.2 Expansion

- Additional slots can be purchased with coins. The first additional slot costs 1,000 coins, the second costs 2,000, the third costs 4,000, and each subsequent slot doubles in price.
- The starting capacity, first-slot price and price multiplier are configurable through `GLOBAL_CONFIG`.
- Later expansions should also require specific resources, potentially from different skills.
- Resource requirements should become more demanding as capacity grows.
- Expansion increments and later resource requirements are undecided. The current initial price curve is configurable in `GLOBAL_CONFIG`.

### 14.3 Item management and full inventory

The bag should support:

- Item quantities.
- Sorting and filtering by source group, semantic item type, element and tier. Item definitions carry `group` and `type` metadata, and inventory helpers can return the owned items for a given group or type.
- The current classification supports future filters and Unveiling eligibility: Research materials, Spellcraft essences, Transmutation Catalysts, Exploration resources, Combat artifacts, Companion containers and Shop goods.
- Selling one item, selected quantities or multiple items.
- Displaying each item's current sale value and the total value of a selected quantity.

The player must not silently lose resources when the bag is full.

- Preferred behavior: pause production when there is no room and clearly explain why.
- A visible overflow system is an alternative, but resources should not be silently discarded.
- Final full-inventory handling is undecided.

### 14.4 Shop

- The Shop is a single page with internal tabs: **Improvements**, **Skills & Actions** and **General Goods**.
- Improvements includes repeatable upgrades such as purchasing additional bag slots.
- Skills & Actions lists available skill unlocks and the next locked action from each configured, unlocked skill. Each entry displays its unlock requirements.
- General Goods is reserved for repeatable purchases of items that cannot be obtained through actions or other game systems. No General Goods are currently configured.
- The global floating panel also provides a Missions shortcut on every main tab. Its modal is currently an empty placeholder with a close button.
- Repeatable General Goods are defined in `SHOP_ITEM_DEFINITIONS` inside `src/data/itemData.js`; only items in that section appear in the General Goods shop tab.

---

## 16. Selling Items and Resource Values

**Every physical item should be sellable**, including Research materials, elemental essences, Catalysts, companion containers and resources from future skills.

### 15.1 Base values and modifiers

- Every item has its own base sale value.
- Skills, milestones and future upgrades may increase sale value.
- Apply sale-value bonuses using the additive stacking rule unless a specific exception is defined.
- Higher-tier and more advanced resources should generally be worth more than introductory materials.
- Current Research and Spellcraft outputs use the shared tier-derived value curve; future item types may define their own base values when source, purpose or rarity warrants a deviation.
- Later skills should introduce resources worth substantially more than early-game materials.
- Physical item sale values are derived from their tier in `ITEM_DATA`: tier 1 is worth 1 coin, tier 2 is worth 2, and each later tier is worth twice the previous value minus one (1, 2, 3, 5, 9, 17, 33, 65, ...).

### 15.2 Selling as a choice

- Selling converts resources into gold for unlocks and expansion.
- Keeping resources preserves them for recipes, unlocks and future systems.
- Early-game materials should be useful enough that selling everything is not always the obvious choice.
- The first three skills are not intended to be the game's main income sources; later skills should expand earning potential.

---

## 17. Overall Progression and Game Loop

### 16.1 Initial resource loop

| Skill / system | Purpose | Main output or role |
|---|---|---|
| Research | General magical study | Research materials |
| Spellcraft | Earth, Air and Water spells | Elemental essences; consumes Mana |
| Transmutation | Refine earlier resources | Elemental Catalysts |
| Bag | Store and manage items | Inventory capacity |
| Selling | Convert items into currency | Gold for unlocks and expansion |

A possible initial progression:

1. Start with Research I and produce Loose Notes.
2. Sell some materials for gold while retaining resources likely to be useful.
3. Unlock and develop additional Research actions.
4. Gather Research materials and gold to unlock Spellcraft.
5. Cast Earth, Air and Water spells using Mana; produce elemental essences.
6. Retain or sell essences as needed.
7. Gather Research materials, elemental essences and gold to unlock Transmutation.
8. Combine earlier resources into Catalysts; retain or sell the output.
9. Unlock Exploration after Transmutation using 5 each of the Tier-I Earth, Air and Water Catalysts plus 10,000 coins; The Crossroads becomes available immediately.
10. Explore the starting areas and expand the map; develop individual area levels and discover resources or companion containers.
11. Unlock and start passive Combat when its requirements are met; select an unlocked Exploration area and let Combat run independently.
12. Unlock Unveiling when its requirements are met. Develop the skill by destroying eligible materials through its regular actions.
13. Use **Unveil Artifact or Companion** to open companion containers and identify eligible unidentified objects once the overall skill-level requirements are met.
14. Collect the revealed Companions, area artifacts and other valuable resources; retain or sell them as appropriate.
15. Continue developing whichever actions, areas and systems best serve the player's current goals.

This is an example of how systems can connect, not a mandatory sequence. Exact Combat, Unveiling and Companion unlock timing remains undecided.

### 16.2 Open-ended progression

- Players can focus on one skill, spread progress across several skills, gather materials, work toward milestones or unlock new systems.
- Reaching action level 100 is not a prerequisite for moving forward.
- A player could be roughly 50% through the available game progression without having any action at level 100.
- Action level 100 is a long-term goal; meaningful progress should be possible through many systems without maxing every action.
- Players should be encouraged to change focus: develop Research, build elemental essence supplies through Spellcraft, use them in Transmutation, then explore or work on other systems.

### 16.3 Interconnected resources and progression

- Research materials support Spellcraft unlocks and Transmutation recipes.
- Spellcraft essences support Transmutation and potentially later systems.
- Transmutation creates refined materials for future progression.
- Exploration provides area resources and elemental companion containers.
- Exploration area levels improve Combat output, Combat XP and artifact chance in their respective areas.
- Combat produces unidentified objects and chances at area-specific artifacts.
- Unveiling consumes eligible materials to gain XP; its overall skill level gates access to higher-level containers and unidentified objects.
- **Unveil Artifact or Companion** opens elemental containers and identifies objects, potentially revealing Companions, area artifacts and other valuable resources.
- Skill milestones can improve other skills or global systems.
- Selling resources funds unlocks and bag expansion.

The general progression principle is **simple things leading to more complicated things**. Early activities and resources should be easy to understand; later skills should introduce greater potency, deeper interactions and larger economic opportunities. Not every skill must be a direct upgrade of the previous one.

### 16.4 Long-term and offline play

- Active actions and eligible passive/automated systems should make meaningful progress while the player is away.
- Completed actions contribute resources, action XP, skill progress and milestones.
- Mana regeneration and passive Combat should work independently of the selected active action, subject to final offline rules.
- On return, players decide whether to keep resources, sell them, unlock actions, expand inventory or change focus.
- Additional automation should gradually reduce the need to manually operate every system.

---

## 18. Design Principles

- **Open-ended progression:** Players choose what to develop; no rigid action-level-100 gate.
- **Independent action levels:** Each action has its own XP and level progression.
- **Derived skill levels:** Skill levels reflect all actions in the skill; level 100 requires every action at level 100.
- **Different progression curves:** Skills can have different action counts and skill scalars; actions also have tier scalars.
- **Meaningful levels:** Action levels improve their actions; skill levels may provide passive effects.
- **Separate milestone tracks:** Action milestones belong to individual actions; skill milestones belong to the overall skill.
- **Additive bonuses:** Same-type bonuses from different sources add together by default.
- **Distinct Primary Elements:** Earth, Air and Water have separate identities, spells, resources and companion types.
- **Aspects are future-facing:** The potential run-based invoke/channel concept is not part of initial implementation.
- **Mana supports Spellcraft:** Spells consume Mana; Mana regenerates passively; Spellcraft starts with its configured base regeneration at level 1 and gains +0.5 Mana per second for every level thereafter.
- **Exploration is active:** Areas are individual actions on a shared hex map.
- **Combat is passive:** It continues in a selected unlocked Exploration area independently of the active action.
- **Companions come from containers:** Elemental containers discovered through Exploration are opened through Unveiling to obtain companions.
- **Unveiling gates discoveries:** Material Destruction actions build the skill; **Unveil Artifact or Companion** identifies objects and opens containers according to their source-based skill-level requirements.
- **Resources matter:** Resources connect skills through recipes, unlocks and future uses.
- **Everything is sellable:** Every physical item has an individual sale value; selling trades future utility for immediate gold.
- **Simple to complex:** Early content is straightforward; later systems add more powerful resources and interactions.
- **Substantial offline progress:** Eligible active and passive systems continue while the player is away.
- **Automation can evolve:** One active action is the starting model, not a permanent restriction.
- **Expandable foundations:** New skills, actions, areas, tiers, resources, companions and mechanics should fit without rewriting the core systems.

---

## 19. Intentionally Undecided

The following details remain open for design, balancing or implementation:

### Progression and skills
- The exact formula converting action progression into skill XP and skill level.
- Skill-specific XP scalars and exact action-tier XP scalars.
- Final action counts for skills other than the current eight Research actions.
- Which skills use per-level passive bonuses and the exact effects.
- Whether/how passive skills such as Combat use a distinct skill-level progression model.

### Research, Spellcraft and Transmutation
- Final spell names and which spell tiers will be implemented.
- Final descriptions and names for higher-tier essences.
- Mana starting capacity, spell costs and any future maximum-Mana gain per Spellcraft level.
- Final Transmutation action names, Catalyst tier names, recipes, quantities and input combinations.
- Final action unlock prices and skill unlock resource quantities.

### Exploration, Combat and Companions
- Exploration area count, map layout beyond the starting tiles, later area names, connections and unlock conditions.
- Exploration action durations, XP, resource tables and output values.
- Area milestone thresholds and rewards, including exact container chance bonuses.
- The exact Water companion-container type and name.
- The exact list and names of Unveiling's Material Destruction actions, including eligible items from each source tab.
- Destruction quantities, action durations, XP values and progression curves.
- The **Unveil Artifact or Companion** action's processing time, XP rewards and scaling.
- The minimum Unveiling skill level assigned to each companion container and unidentified object, including the mapping from source area/map progression to requirement.
- The reward tables, artifact chances and other valuable resources revealed by identification.
- Unveiling's gold/resource unlock requirements and exact unlock timing.
- Companion variety, rarity, hatching requirements, timing and duplicate handling.
- Companion levels, growth, upgrades, bonuses and use/equipment model.
- Companion interface placement and any separate unlock conditions.
- Combat unlock requirements and timing.
- Combat's XP/progression model, formulas, encounters, output, reward tables and identification system.
- Unidentified object types, identification costs and artifact chances.
- The artifact associated with each area and its exact effects or use.
- Whether containers or companions have acquisition methods beyond the current Exploration concept.

### Economy, inventory and systems
- Exact unlock costs and gold curves.
- Bag starting capacity, expansion increments, gold scaling and resource requirements.
- Base sale value of each item and sale-value bonuses.
- How fractional resource output is handled internally; proposed handling is fractional carry-over or chance-based additional output, not simply discarding fractions.
- Exact offline rules, offline cap and full-inventory behavior.
- Which actions become automatic or passive.
- Whether future systems permit more than one active action at a time.
- Future skills, resource categories and their connections to current skills.
- Whether the future Aspect concept becomes a prestige/run system, its number of Aspects, invocation, XP and bonuses.
- Whether a separate elemental mastery system is introduced.

### Initial implementation priorities

The initial foundation should establish:

- Earth, Air and Water as the Primary Elements.
- Research, Spellcraft and Transmutation with their initial action/resource structure.
- Independent action progression and derived skill levels.
- Spellcraft's Mana-based casting.
- Transmutation's resource recipes.
- Resource-based skill unlocks.
- Inventory expansion and selling.
- Meaningful offline gains.

Exploration, passive Combat, Companions and Unveiling are planned additions to the broader progression structure. Their defined high-level behavior should be preserved, while the exact formulas, content and balancing listed above remain open.
