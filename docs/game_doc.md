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
| Unveiling | Active | Sacrifice materials to gain insight; identify unidentified objects and open companion containers once the skill-level requirement is met. Working name. |
| Combat | Passive | Continuously fight in a selected unlocked Exploration area; produce combat rewards, unidentified objects and chances at area artifacts. |
| Companions | Collection system | Hatch elemental containers obtained through Exploration after meeting their Unveiling level requirements. Further progression and effects are undecided. |

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
- Unveiling's regular destruction actions and its special identification action each have their own independent action level and XP progression. Successfully processing a companion container or unidentified object awards substantial XP to the special action.

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

- Actions are generally unlocked with gold. Unlocking a later action does not require the previous action to reach level 100.
- An unlocked action becomes available but does not automatically become active.
- Some unlocks can require resources from other actions or skills when this creates a meaningful progression connection.
- Skill unlocks generally require gold plus resources from earlier skills.
- Unlocking a skill should normally include its first action, avoiding a separate first-action cost unless a skill has a specific reason to work differently.
- Requirements should be approachable progression gates, not long checklists that force every earlier action to level 100.

Exact prices and resource quantities are not yet defined; see Section 14.

### 3.5 Action duration and XP

- Every action has a base duration and base XP reward.
- Higher-tier actions generally take longer but should provide more XP and more valuable or useful resources.
- Duration can be improved by:
  - The action's own level bonuses.
  - Milestones from its skill.
  - Bonuses from other skills.
  - Global bonuses and future progression systems.
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

- Example: Spellcraft may increase maximum Mana by a fixed amount per Spellcraft level.
- Such a bonus would be linear: each new level adds the same amount.
- Other skills may have different per-level bonuses or no such bonus.
- The effect for each skill is not finalized.
- Per-level bonuses do not replace or consume action or skill milestone rewards.

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
- Each spell has its own Mana cost; higher-tier spells generally cost more.
- If Mana is insufficient for the next cast, the cast waits. Mana must not be consumed for an action that cannot complete.
- Spellcraft skill levels may increase maximum Mana by a fixed amount per level, separately from milestone rewards.
- Starting capacity, regeneration rate, spell costs and the per-level capacity increase remain to be balanced.

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

- Exact quantities, combinations and tier recipes remain undecided.
- Recipes should create meaningful connections between earlier skills.
- Each Transmutation action levels independently from 1 to 100.
- The overall Transmutation skill level follows the shared skill-level rules.
- Catalysts are physical items and can be sold.

---

## 8. Skill Four — Exploration

**Purpose:** Explore a growing world map, develop individual areas and discover resources and elemental companion containers.

Exploration is an **active skill**. Each unlocked area is an individual Exploration action and uses the normal action-level rules.

### 8.1 Shared hex map and starting layout

- Exploration is represented by a hexagonal map.
- The map begins with a central, neutral hex tile and three immediately adjacent starting areas:
  - **Neutral — The Crossroads**
  - **Earth — The Mossbound Foothills**
  - **Air — The Whispering Fields**
  - **Water — The Stillwater Pools**
- The Crossroads has no elemental alignment.
- The three elemental areas establish the initial directions or branches of the map.
- New areas branch from unlocked areas. Later branches may overlap, cross or connect; the map is not limited to three permanently separate paths.
- The map is shared with Combat and other future systems that use locations.
- No detailed map layout or fixed number of areas is defined yet.

### 8.2 Area structure and progression

Each area has:

- A unique name.
- An elemental alignment (Earth, Air, Water or none for the neutral starting tile).
- Its own action level from 1 to 100.
- Its own XP progression, duration and resource rewards.
- A position and connection to other areas on the shared map.

Progression rules:

- Every area is an independent Exploration action.
- Its level contributes to the overall Exploration skill level.
- Exploration skill level 100 requires every Exploration area/action in the skill to reach level 100.
- Different areas may share resource types, particularly within the same tier; every area does not need a unique resource.
- The exact area count, names beyond the starting areas, rewards, durations and unlock conditions are undecided.

### 8.3 Area levels and milestones

An area's individual Exploration level should improve the corresponding area's Combat and discovery potential.

Planned effects include:

- Increased Combat output in that area.
- Increased Combat XP in that area.
- Increased chance to obtain that area's artifact.
- Action milestone rewards, following the general action-milestone system.
- Potentially increased chance to discover companion containers.

Area milestones occur at selected action-level intervals (every X levels), like other action milestones. Their thresholds and rewards can be adjusted during balancing; no final schedule is fixed.

### 8.4 Companion-container discoveries

- Completing an Exploration action has a low chance to find a companion container associated with that area's element.
- Every discovered container carries a minimum required **Unveiling skill level** before it can be opened.
- The requirement is based on where the container is found and the area's place in map progression: containers from early areas have low requirements, while containers from later, more dangerous areas require a much higher Unveiling skill level.
- Containers remain in the inventory until the player reaches the requirement and processes them through Unveiling's special action.
- Container types reflect the element:
  - **Earth:** Geodes, containing Earth companions.
  - **Air:** Eggs, containing Air companions.
  - **Water:** Container name and concept still to be decided; it should fit Water and contain Water companions.
- Containers are obtained through Exploration and are later hatched to obtain companions.
- Area action milestones may increase the chance to find containers.
- Not every area needs its own unique companion or unique container type.

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
- Identifying an eligible object through Unveiling's special action gives a chance to obtain the artifact associated with the area where it was found.
- Identification can also reveal other valuable resources with meaningful gold sale values.
- The exact relationship between object types, identification, artifact chances, other rewards and area artifacts is not yet defined.
- Combat formulas, encounter details, reward tables, XP progression, identification costs and artifact rates remain undecided.

Combat must remain independent of the player's currently selected active action. Its passive nature does not imply that its final progression model must be identical to an active skill's action structure.

---

## 10. Companions

**Purpose:** Collect elemental companions by hatching containers discovered through Exploration.

Companions are a collection system connected to Exploration. The working name for the system is **Companions**; its final interface placement and progression structure are not yet defined.

### 10.1 Containers and elemental identity

- Companions are obtained by opening/hatching containers found through Exploration, using Unveiling's special action.
- Each container has a minimum required Unveiling skill level based on its source area and map progression; early-area containers require a lower level than late-game containers.
- Earth Geodes contain Earth companions.
- Air Eggs contain Air companions.
- The Water container type and name are undecided.
- Containers are tied to their corresponding elemental type.
- Not every Exploration area needs a unique companion or a unique container.

### 10.2 Undecided companion design

The following are intentionally open:

- The Water container's final name and design.
- The number and variety of companions.
- Hatching requirements, timing and duplicate handling.
- Whether companions have levels, rarity, growth, upgrades or other progression.
- Whether companions provide bonuses, and if so, what those bonuses affect.
- How companions are displayed, equipped, assigned or otherwise used.
- Whether companions can be obtained through any method besides Exploration containers.

Do not assume a companion rescue system; the current primary acquisition concept is elemental containers discovered through Exploration and then hatched.

---

## 11. Skill Five — Unveiling (Working Name)

**Purpose:** Uncover hidden properties and secrets by sacrificing ordinary materials, then identify unidentified objects and open companion containers.

Unveiling is an **active skill**. It has regular material-destruction actions and one special identification action. Every action follows the standard independent level 1–100 progression and contributes to the overall Unveiling skill level.

### 11.1 Regular actions — Destroying materials

- Regular actions consume eligible physical items from other skill tabs in exchange for XP.
- Each source tab has its own destruction action. These actions level independently and contribute to the overall Unveiling skill level.
- The first regular action is **Destroy Research Books**.
- The initial action structure is:

| Source tab | Regular action | Eligible items |
|---|---|---|
| Research | **Destroy Research Books** | Eligible Research books and materials. |
| Spellcraft | Destroy Spellcraft Materials | Eligible elemental essences and other Spellcraft materials. |
| Transmutation | Destroy Transmutation Materials | Eligible Catalysts and other Transmutation materials. |
| Exploration | Destroy Exploration Materials | Eligible resources obtained through Exploration. |
| Combat | Destroy Combat Materials | Eligible identified Combat rewards and materials. |

- The list establishes the intended one-action-per-other-tab structure; exact action names and eligible item groups can be refined.
- Companion containers and unidentified objects are reserved for the special identification action, not the regular destruction actions.
- Destroying an item removes it from the inventory. The player gives up its sale value and any other use it could have had in exchange for Unveiling progression.
- Exact quantities consumed, XP values, action durations and further destruction actions remain undecided.

### 11.2 Special action — Identifying and opening

- Unlocking Unveiling also unlocks its special action immediately, alongside **Destroy Research Books**.
- The special action can process both:
  - Companion containers (Geodes, Eggs and the eventual Water container), opening them to reveal a companion.
  - Unidentified objects obtained through Combat, revealing a chance at the artifact from their source area and potentially other valuable, sellable resources.
- Each container or unidentified object has a minimum required **overall Unveiling skill level**. The player cannot process it until the skill reaches that requirement.
- Requirements are assigned according to the item's source area and its place in map progression: early-area finds have low requirements; late-game finds have much higher requirements.
- Successfully processing a container or unidentified object awards a substantial amount of XP to this special action.
- The special action itself levels independently from 1 to 100. Its action-level progress contributes to the overall Unveiling skill level like every other Unveiling action.
- The requirement is checked against the overall Unveiling skill level, not the special action's individual level.
- The exact special-action name, processing time, XP rewards, item requirements, artifact chances and revealed reward tables remain undecided.

### 11.3 Skill progression and unlock

- Every regular destruction action and the special identification action has its own level from 1 to 100.
- Their combined progression contributes to the overall Unveiling skill level.
- Unveiling skill level is the progression gate for opening higher-level companion containers and identifying higher-level unidentified objects.
- Unlocking Unveiling grants both its first regular action (**Destroy Research Books**) and its special identification action. The player does not need to purchase either of those two actions separately.
- The skill's exact unlock requirements, including gold and any required resources, remain undecided.

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

Exploration and Combat values have not yet been established.

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
- The recurring values and milestone schedule are proposals and may change after playtesting.

### 12.3 Skill milestones

Every skill has its own milestone track at **skill levels 10, 20, 30, 40, 50, 60, 70, 80, 90 and 100**.

Milestones are based on the overall skill level, not individual action levels. Reaching a Research milestone does not grant the corresponding Spellcraft or Transmutation reward.

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
- Any exception must be explicitly defined by the mechanic; exceptions are not assumed.

---

## 14. Gold and Unlock Economy

Gold is a shared currency used for action unlocks, skill unlocks, inventory expansion and other progression costs. It is earned by selling physical items.

### 13.1 Initial skill unlock structure

| Skill | Intended unlock requirement |
|---|---|
| Research | Available from the beginning; Research I is free. |
| Spellcraft | Gold + a modest amount of Research materials, such as Bound Notes (Research II) or Arcane Manuscripts (Research III). |
| Transmutation | Gold + Research materials + elemental essences produced by Spellcraft. |
| Exploration | Unlocked after Transmutation in the intended skill order. Its unlock should follow a similar resource-and-gold approach, but use a different resource requirement and cost somewhat more gold than Transmutation. The exact resource and quantities are undecided. |
| Unveiling | Active skill; unlocking it also unlocks its first regular action, Destroy Research Books, and its special identification action. Gold/resource requirements are undecided. |
| Combat | Passive skill; unlock and start requirements are not yet defined. |

- Unlocking a skill should normally include its first action.
- Resource requirements should connect skills without demanding that every earlier action reach level 100.
- The exact resource quantities and gold costs are undecided.
- The Companion collection's separate unlock conditions, if any, are also undecided.

### 13.2 Research actions and further action unlocks

- Research is available at the start with Research I and Loose Notes.
- Research I is free; later Research actions cost gold.
- Additional actions in an unlocked skill generally cost gold.
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

- The bag starts with limited capacity.
- Each distinct item type occupies one slot; copies of the same item stack.
- Example: one or fifty Loose Notes use one slot. Earth Dust, Air Breath and Water Droplet each use a separate slot.
- Different elements and tiers remain separate items.
- Research materials, essences, Catalysts and future resources each use their own item slots.
- Gold and Mana are counters/currencies and do not occupy normal slots.

### 14.2 Expansion

- Additional slots can be purchased with gold.
- Cost should rise with bag size, making expansion a meaningful long-term gold sink without frustrating the early game.
- Later expansions should also require specific resources, potentially from different skills.
- Resource requirements should become more demanding as capacity grows.
- Starting capacity, expansion increments, gold curve and resource requirements are undecided.

### 14.3 Item management and full inventory

The bag should support:

- Item quantities.
- Sorting and filtering by category, skill, element and tier.
- Selling one item, selected quantities or multiple items.
- Displaying each item's current sale value and the total value of a selected quantity.

The player must not silently lose resources when the bag is full.

- Preferred behavior: pause production when there is no room and clearly explain why.
- A visible overflow system is an alternative, but resources should not be silently discarded.
- Final full-inventory handling is undecided.

---

## 16. Selling Items and Resource Values

**Every physical item should be sellable**, including Research materials, elemental essences, Catalysts, companion containers and resources from future skills.

### 15.1 Base values and modifiers

- Every item has its own base sale value.
- Skills, milestones and future upgrades may increase sale value.
- Apply sale-value bonuses using the additive stacking rule unless a specific exception is defined.
- Higher-tier and more advanced resources should generally be worth more than introductory materials.
- Value is based on the individual item, not tier alone; items in the same tier can have different values based on their source, purpose and production requirements.
- Later skills should introduce resources worth substantially more than early-game materials.
- Exact base values and sale modifiers remain undecided and must be balanced against production, inputs, unlocks and later economy.

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
9. Unlock Exploration after Transmutation using its eventual resource and gold requirements.
10. Explore the starting areas and expand the map; develop individual area levels and discover resources or companion containers.
11. Unlock and start passive Combat when its requirements are met; select an unlocked Exploration area and let Combat run independently.
12. Unlock Unveiling when its requirements are met. Develop the skill by destroying eligible materials through its regular actions.
13. Use Unveiling's special action to open companion containers and identify eligible unidentified objects once the overall skill-level requirements are met.
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
- Unveiling's special action opens elemental containers and identifies objects, potentially revealing Companions, area artifacts and other valuable resources.
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
- **Mana supports Spellcraft:** Spells consume Mana; Mana regenerates passively; Spellcraft levels may increase maximum Mana.
- **Exploration is active:** Areas are individual actions on a shared hex map.
- **Combat is passive:** It continues in a selected unlocked Exploration area independently of the active action.
- **Companions come from containers:** Elemental containers discovered through Exploration are opened through Unveiling to obtain companions.
- **Unveiling gates discoveries:** Destruction actions build the skill; its special action identifies objects and opens containers according to their source-based skill-level requirements.
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
- Mana starting capacity, regeneration rate, spell costs and maximum-Mana gain per Spellcraft level.
- Final Transmutation action names, Catalyst tier names, recipes, quantities and input combinations.
- Final action unlock prices and skill unlock resource quantities.

### Exploration, Combat and Companions
- Exploration area count, map layout beyond the starting tiles, later area names, connections and unlock conditions.
- Exploration action durations, XP, resource tables and output values.
- Area milestone thresholds and rewards, including exact container chance bonuses.
- The exact Water companion-container type and name.
- The final name and theme of Unveiling.
- The exact list and names of Unveiling's regular destruction actions, including eligible items from each source tab.
- Destruction quantities, action durations, XP values and progression curves.
- The special identification action's final name, processing time and XP rewards.
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
