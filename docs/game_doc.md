# Omnimancer Idle — Core Game Design

*Working design document · Core progression, skills, resources and economy*

## 1. Game Concept

**Omnimancer Idle** is an open-ended incremental idle game about a mage gradually learning, practicing and mastering an expanding collection of magical disciplines.

The initial game introduces three skills:

1. **Research** — developing general magical knowledge and producing research materials.
2. **Spellcraft** — learning and casting spells connected to the three Primary Elements: Earth, Air and Water.
3. **Transmutation** — combining materials from the earlier skills to create more refined resources.

These three skills are the first layer of a much larger game. They establish the core progression, resource and economy systems, but they are deliberately not intended to represent the full complexity or direction of the late game. Later skills and systems will expand on these foundations and introduce more involved interactions.

Each skill is its own tab or page and contains its own set of actions. Actions level independently, and their levels contribute to the level of the skill they belong to. Skills also have their own progression scaling, milestone rewards and potentially a passive bonus that improves with every skill level.

The player chooses which part of the game to focus on. Progression is not intended to be a strict sequence in which one action must be completed before the next becomes useful. The player may concentrate on Research, develop Spellcraft, work on Transmutation, or move between them according to the resources and bonuses they need.

The player earns gold primarily by selling resources. Gold and selected materials are used to unlock additional actions, unlock skills and expand the inventory. Every resource should have a use or a potential future use, so selling something is a decision rather than an automatic action.

The game is designed around long-term progression and offline gains. A period away from the game should still produce meaningful progress in the currently active and eventually automated activities.

---

## 2. The Three Primary Elements

The initial elemental system consists of three Primary Elements:

- **Earth**
- **Air**
- **Water**

These are the elements used by the initial Spellcraft and Transmutation systems. They are not called Order, Life or Death, and those former categories are no longer part of the current design.

### 2.1 Earth

Earth represents solidity, material, structure, weight and endurance.

It is associated with stone, dust, minerals, crystals, mountains and the deeper physical foundations of the world. Early Earth magic should feel simple and tangible, while higher-tier magic can affect enormous geological structures or the substance of the world itself.

### 2.2 Air

Air represents movement, air, pressure, speed and the forces of the atmosphere.

It is associated with breath, breezes, gusts, gales, storms and increasingly powerful atmospheric phenomena. Early Air magic should be subtle and easy to control, while advanced magic can command immense storms and forces on a much greater scale.

### 2.3 Water

Water represents fluidity, flow, pressure, depth and transformation.

It is associated with droplets, streams, waves, currents, torrents and the deepest bodies of water. Early Water magic should manipulate small quantities of water, while later magic can command enormous bodies of water and powerful tidal forces.

The three elements should remain distinct in their identities, spells and resources. They can share a common progression structure without becoming interchangeable.

### 2.4 Future concept: Aspects

**Aspects are a separate, very early concept and are not part of the planned initial implementation.** They should not be confused with the three Primary Elements.

A future system may allow the player to invoke or channel an Aspect, potentially as part of a prestige or run-starting mechanic. Choosing an Aspect could lock the player into that Aspect for the duration of the run and apply modifiers to several areas of the game.

While an Aspect is active, actions performed throughout the game could also award experience toward that Aspect. The Aspect would therefore become another independently levelable progression layer, with its own experience and eventual bonuses.

This is only a draft direction. The number of Aspects, their effects, how they are invoked, how runs work and how their experience is balanced are all undecided. None of this should be treated as a requirement for the initial game.

---

## 3. Shared Progression System

The progression system has three connected levels of organization:

- **Skills** are the main tabs or pages, such as Research, Spellcraft and Transmutation.
- **Actions** are the activities available within each skill.
- **Levels** measure the progression of individual actions and the overall skill.

Every skill and action has its own progression. Improving one does not automatically level another, although skill milestones and other bonuses can affect multiple actions.

### 3.1 Skills and actions

Each skill contains its own collection of actions. The number of actions does not need to be the same for every skill.

Examples:

- Research contains its own research activities, from simple introductory research to extremely advanced discoveries.
- Spellcraft contains Earth, Air and Water spells across multiple tiers.
- Transmutation contains activities that combine resources from other skills into increasingly refined materials.

Every action has an independent level from **1 to 100**. It tracks its own experience, experience requirement, base duration, base output and individual leveling bonuses.

Each action also has an experience-curve scalar. This scalar stretches or compresses the underlying experience curve according to the action's tier. Higher-tier actions should generally require more experience to level than introductory actions, even when they belong to the same skill.

### 3.2 Independent action progression

Every action levels independently.

For example, performing Research II awards action experience to Research II. It does not award action experience to Research I, Research III or any Spellcraft or Transmutation action.

Likewise, casting an Earth spell does not directly level a Air or Water spell. Each spell action has its own progression.

There is no shared action-experience pool. Progression can still be connected through skill levels, skill milestones, resources and bonuses, but the individual action levels remain separate.

### 3.3 Skill progression

Each skill also has its own level, with a maximum of **level 100**. This is separate from the level of any individual action.

A skill's level is derived from the combined progression of the actions that belong to that skill. Action-level progress contributes toward the skill's progression, so improving individual actions also develops the overall skill.

The skill has its own experience scaling or scalar. This controls how much action-level progress is needed to advance the skill. Early skill levels should require only a small amount of action progression, potentially just a few action level-ups. The requirement should ramp up as the skill approaches higher levels.

Skills can have different numbers of actions and do not need to use identical skill-level scaling. Their individual action levels also use their own tier-dependent experience scalars.

A skill cannot reach level 100 while one or more of its actions remain below level 100. **Reaching skill level 100 requires every action belonging to that skill to reach action level 100 as well.** The exact calculation that converts the action levels into skill progression, including the skill-level experience curve, is still to be balanced.

Skills progress independently from one another. Research progression does not automatically increase the Spellcraft level, and Spellcraft progression does not automatically increase the Transmutation level.

See Section 4 for the skill-level model and its implications.

### 3.4 Unlocking additional actions

Actions are generally unlocked through gold. Unlocking an action does not require the previous action to reach level 100.

The player should be able to choose which available actions to unlock and develop. Increasing prices can encourage investment in existing actions, but should not impose a rigid sequence of completing every earlier action first.

Unlocking an action makes it available; it does not automatically make it the active action.

Some later systems may add material requirements to selected unlocks. These should create useful connections between skills rather than turn every action unlock into a long linear checklist.

### 3.5 Unlocking entire skills

The player does not necessarily begin with every skill available.

Unlocking a skill should require both gold and one or more resources produced by an earlier skill or skills. The first such requirement should be approachable. For example, unlocking Spellcraft could require a modest quantity of Research II or Research III materials in addition to gold.

Unlocking Transmutation could require research materials as well as elemental essences produced by Spellcraft.

These requirements connect the skills and give earlier resources a purpose beyond selling them. They are intended as light progression gates, not proof that every action in an earlier skill must be completed before the player can move on.

The exact required quantities and gold costs are not defined yet.

### 3.6 Action duration

Every action has a base duration. Higher-tier actions generally take longer to complete, but should also provide greater experience and more valuable or useful resources.

Action duration can be improved by several sources:

- The action's own individual leveling bonuses.
- Bonuses from milestones belonging to its skill.
- Bonuses from other skills.
- Global bonuses and future progression systems.

The exact effect of each bonus is not fixed here. For the current design, bonuses from different sources stack additively; see Section 8.5.

### 3.7 Action experience

Action experience is awarded when an action completes. Each action has its own base experience reward.

The amount of experience required for an action's next level increases with its current level. The action's skill and tier also influence how demanding its experience curve is:

- Each skill can have its own scalar for the action experience curve.
- Each action has an additional scalar based on its tier.
- The tier scalar stretches the curve further for more advanced actions.

Consequently, two actions at the same level can require different amounts of experience to level up.

Reaching action level 100 should be a substantial long-term goal in the early game. It should become a more realistic target later, once the player has accumulated suitable bonuses, upgrades and other progression advantages. A level-100 action should eventually be achievable in a long offline period or overnight with a sufficiently developed setup, but this should not be the expectation for a new player.

### 3.8 Active actions and future automation

The current starting assumption is that the player selects one action to actively work on at a time. This is a practical initial limitation, **not a permanent rule that the entire game must always obey**.

Future systems may allow certain actions to progress automatically or passively. Some actions may become largely self-sustaining, while others may be expensive, late-game activities that the player performs infrequently or levels through a different mechanism.

The game should leave room for these differences. Not every action needs to be equally active, equally affordable or leveled in exactly the same way.

### 3.9 Offline progress

Offline gains are an important part of the game.

When the player leaves the game, eligible active and automated activities should continue to make progress according to the offline simulation. Returning after a long break, such as going to sleep and coming back the next morning, should be capable of providing a meaningful period of progress in the relevant skill or skills.

Offline gains can include:

- Completed actions and action experience.
- Progress toward the skill level and its milestones.
- Resources produced by those actions.
- Gold earned when the player chooses to sell the resulting resources.
- Progress from future passive or automated systems, when unlocked.

Offline progress should feel substantial. A night away from the game may produce a large amount of resources and experience, and selling much of the output can provide a meaningful amount of gold.

The exact offline duration rules, caps, handling of a full inventory and treatment of future automated actions remain to be determined. Offline progress should not be treated as a separate reward that ignores the normal action and resource rules; it should simulate eligible game activity while the player is away.

---

## 4. Skill Levels

A skill level is an overall measure of how developed that skill is. It is not a separate action and is not leveled by repeatedly performing one dedicated skill-level activity.

### 4.1 Derived from the skill's actions

The skill level is derived from the progression of all actions belonging to that skill.

Every action contributes to its skill's overall development. This means the skill level can begin increasing after only a few action-level improvements, rather than requiring every action to be developed equally from the very beginning.

The skill's own progression scalar determines how quickly action-level progress translates into skill-level progress. Early levels should be accessible; later levels should require increasingly broad and substantial development across the skill.

A skill with more actions can have a different progression curve from a skill with fewer actions. The skill-level system must account for the number of actions in that skill rather than assuming that every skill has the same structure.

### 4.2 Maximum skill level

The maximum skill level is **100**.

Reaching skill level 100 requires every action in that skill to reach action level 100. A single highly developed action must not be enough to max out the skill while the other actions remain neglected.

This makes skill level a measure of the entire skill's completion, not simply a reflection of the player's most-used action.

The precise aggregation and experience formula is not locked in yet. It should support the intended behavior: early levels are gained from a relatively small amount of action progression, while the requirements become increasingly demanding and the final levels require development across all actions.

### 4.3 Skill-level bonuses

A skill may have a passive bonus that increases with every skill level, independently of its milestone rewards.

For example, **Spellcraft may increase maximum Mana by a fixed amount for every Spellcraft level**. This is a linear increase, so each new skill level adds the same amount of maximum Mana.

Other skills may have different per-level bonuses, or may use a different type of benefit. The exact bonus for each skill is not yet defined.

These per-level effects are separate from milestone rewards. A skill can gain its regular per-level benefit at every level and still receive additional milestone rewards at selected levels.

---

## 5. Skill One — Research

**Purpose:** Develop general magical knowledge and produce research materials that support other skills.

Research is the foundation of the mage's progression. It represents increasingly advanced study and discovery, independent of any one Primary Element.

Research should begin with simple, common activities and gradually move toward rare, powerful and almost godlike forms of knowledge. Its resources provide materials for other skills, especially Spellcraft unlocks and Transmutation recipes.

### 5.1 Research actions

The current Research skill contains eight actions. Each action has its own independent level from 1 to 100.

The action names should communicate a clear progression from introductory study to extraordinary discoveries:

| Tier | Action name | General theme |
|---|---|---|
| I | **Read Books** | Basic, accessible study and introductory knowledge. |
| II | **Study Ancient Notes** | More organized knowledge and older research. |
| III | **Examine Arcane Manuscripts** | Detailed study of established magical theory. |
| IV | **Decipher Sealed Tomes** | Restricted and difficult-to-understand knowledge. |
| V | **Explore Lost Archives** | Rare discoveries preserved in forgotten collections. |
| VI | **Investigate Forbidden Lore** | Dangerous and unusually powerful knowledge. |
| VII | **Unravel Primordial Mysteries** | Research into the earliest foundations of existence. |
| VIII | **Research the First Truth** | An almost legendary level of discovery, approaching the origin of all knowledge. |

The names describe the theme and power of each action. They do not imply that the player must literally read, own or find the objects named in the action.

The player starts with Research I available. Further actions can be unlocked as the player progresses.

### 5.2 Research resources

Each Research action produces its own resource. These resources should also progress from simple, common written material to rare and exceptionally powerful records of knowledge.

| Tier | Resource name | General theme |
|---|---|---|
| I | **Loose Notes** | Common observations and basic written knowledge. |
| II | **Bound Notes** | Organized notes containing more complete information. |
| III | **Arcane Manuscript** | A detailed written work containing established magical theory. |
| IV | **Sealed Grimoire** | A protected collection of advanced knowledge. |
| V | **Lost Archive Record** | Rare material recovered from forgotten research. |
| VI | **Forbidden Codex** | Restricted knowledge of considerable power. |
| VII | **Primordial Chronicle** | Records concerning the earliest forces and events. |
| VIII | **Genesis Testament** | A legendary record of foundational or creation-level knowledge. |

The resource names are intended as a coherent progression. They are individual items, not interchangeable quantities of a generic Research Folio.

Research materials are used by other skills and may be required for selected unlocks. They are also sellable, so the player must decide whether to retain them for future recipes and progression or sell them for gold.

### 5.3 Research action structure

| Action | Resource produced |
|---|---|
| Read Books | Loose Notes |
| Study Ancient Notes | Bound Notes |
| Examine Arcane Manuscripts | Arcane Manuscript |
| Decipher Sealed Tomes | Sealed Grimoire |
| Explore Lost Archives | Lost Archive Record |
| Investigate Forbidden Lore | Forbidden Codex |
| Unravel Primordial Mysteries | Primordial Chronicle |
| Research the First Truth | Genesis Testament |

Each action has its own level, experience curve, base duration, output and individual bonuses. The eight actions are the current planned Research set; the broader skill structure should still allow future actions to be added.

---

## 6. Skill Two — Spellcraft

**Purpose:** Learn and cast spells associated with Earth, Air and Water.

Spellcraft introduces the three Primary Elements and provides elemental resources for later activities. Each spell is an independent action with its own level, experience requirements, duration, Mana cost and resource output.

Spellcraft should develop both the player's knowledge of individual spells and their broader understanding of the elements. A separate elemental level system is not currently planned.

### 6.1 Initial elemental spells

The initial spell actions are divided into Earth, Air and Water.

| Element | Initial spell | Description |
|---|---|---|
| Earth | **Shape Pebble** | Manipulates a small amount of earth or stone. |
| Air | **Stir Breeze** | Produces a small and controlled movement of air. |
| Water | **Gather Droplet** | Gathers or manipulates a tiny amount of water. |

The player starts with the first available Spellcraft action when the skill is unlocked. The other initial elemental actions can be unlocked separately.

Higher tiers should follow the same progression from small, easy-to-control effects toward powerful elemental manipulation. Example naming directions include:

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

These names are thematic examples and can be refined later. They illustrate how the actions should grow from simple elemental tricks into extraordinary feats.

Every spell remains an independent action. Unlocking a higher-tier spell should not require the previous spell to reach level 100.

### 6.2 Mana and spellcasting

Spellcraft uses **Mana** as the resource required to cast spells.

Mana is a separate, regenerating resource. Casting a spell consumes Mana, and Mana regenerates passively over time. The player therefore needs sufficient Mana to perform a spell action, but does not need to gather Mana as an inventory item.

Each spell has a Mana cost. Higher-tier spells will generally require more Mana than introductory spells, although exact costs are not defined yet.

If the player does not have enough Mana for the next cast, that cast must wait until sufficient Mana has regenerated. The system should not consume Mana for an action that cannot be completed.

Mana regeneration is passive and should continue while the player is away from the game, subject to the eventual offline-progress rules.

The Spellcraft skill level may increase the maximum Mana capacity linearly. For example, each Spellcraft level could add the same fixed amount to maximum Mana. This per-level capacity bonus is separate from Spellcraft's milestone rewards.

The starting Mana capacity, regeneration rate, spell costs and exact amount added per Spellcraft level remain to be balanced.

### 6.3 Elemental essences

Each spell produces an essence associated with its element and tier. These essences are used by Transmutation and may be required for future unlocks and systems.

The essence names should be unique and should communicate a progression from weak, common traces of an element to concentrated, exceptional forms of elemental power.

| Tier | Earth essence | Air essence | Water essence |
|---|---|---|---|
| I | **Dust** | **Breath** | **Droplet** |
| II | **Pebble** | **Breeze** | **Ripple** |
| III | **Stone** | **Gust** | **Stream** |
| IV | **Shard** | **Gale** | **Wave** |
| V | **Crystal** | **Tempest** | **Torrent** |
| VI | **Geode** | **Cyclone** | **Maelstrom** |
| VII | **Mountain Heart** | **Skycore** | **Abyssal Heart** |
| VIII | **Worldheart** | **Firmament Core** | **Primordial Tide** |

These names are the essence item names, not new elements or separate skill levels. For clarity, the full item identity should also retain its element and tier. For example, Dust is the Tier I Earth Essence, while Droplet is the Tier I Water Essence.

Higher-tier essences should feel significantly more potent than the early materials. They should also have greater value and more demanding uses in later recipes.

Elemental essences are separate inventory items. Earth Dust, Air Breath and Water Droplet are not interchangeable simply because they share the same tier.

### 6.4 Spell progression and elemental knowledge

Each spell action has its own independent level from 1 to 100.

Leveling a spell represents gaining experience with that specific spell. Spellcraft's overall skill level represents broader development across all its spell actions.

Spellcraft progression and its milestones can deepen the player's general knowledge of the spells and elements. However, **separate Earth, Air and Water level tracks are not currently part of the planned system**.

A spell's individual action level, the overall Spellcraft skill level and any future elemental mastery system must remain distinct concepts.

### 6.5 Spell resources and future connections

Spellcraft produces elemental essences as part of normal spell progression. Those resources are not merely sale goods; they are also inputs for Transmutation and potentially other future skills.

The player should regularly have to choose between retaining essences for recipes or unlock requirements and selling them for gold.

---

## 7. Skill Three — Transmutation

**Purpose:** Combine research materials and elemental essences to produce more refined resources.

Transmutation connects Research and Spellcraft. It takes resources produced by those skills and turns them into more advanced materials.

The initial Transmutation system is not yet intended to create equipment, combat items or a complete crafting catalogue. Its purpose is to establish a further layer of resource progression that later skills can build upon.

### 7.1 Transmutation actions

Transmutation actions are organized around Earth, Air and Water. Each action has its own independent level, experience curve, duration, input requirements and output.

The three elemental paths should remain distinct:

- **Earth Transmutation** works with Earth materials and produces refined earth-based resources.
- **Air Transmutation** works with Air materials and produces refined air-based resources.
- **Water Transmutation** works with Water materials and produces refined water-based resources.

An example structure is:

| Tier | Earth action | Air action | Water action |
|---|---|---|---|
| I | Earth Transmutation I | Air Transmutation I | Water Transmutation I |
| II | Earth Transmutation II | Air Transmutation II | Water Transmutation II |
| III | Earth Transmutation III | Air Transmutation III | Water Transmutation III |
| IV | Earth Transmutation IV | Air Transmutation IV | Water Transmutation IV |
| V | Earth Transmutation V | Air Transmutation V | Water Transmutation V |

These are structural labels, not necessarily the final displayed action names. More descriptive names can be introduced when the individual recipes and outputs are finalized.

Higher tiers should require more advanced inputs and produce more potent materials. There is no requirement that every element has exactly the same final number of Transmutation actions.

### 7.2 Transmutation resources

The current working resource family is **Catalysts**, with a separate elemental identity.

| Element | Resource family |
|---|---|
| Earth | Earth Catalyst |
| Air | Air Catalyst |
| Water | Water Catalyst |

Each tier produces a more refined form of its elemental Catalyst. The item name and tier should make this progression clear, while the exact tier-specific names can be finalized alongside the recipes.

A Catalyst is a concentrated material created by combining research knowledge with an elemental essence. It represents a step beyond the simpler materials produced by Research and Spellcraft.

Catalysts are also sellable. The player may retain them for future recipes or sell them when gold is more useful.

### 7.3 Materials and recipes

A Transmutation action consumes materials from earlier skills.

For example:

**Earth Transmutation I**
- A Research material, such as Loose Notes or Bound Notes.
- Earth Dust.
- Produces an Earth Catalyst.

**Air Transmutation I**
- A Research material.
- Air Breath.
- Produces a Air Catalyst.

**Water Transmutation I**
- A Research material.
- Water Droplet.
- Produces a Water Catalyst.

Higher tiers should require more advanced research materials and elemental essences. Recipe requirements should grow with the complexity and value of the output.

The exact quantities, resource combinations and tier-specific recipes remain to be balanced. The important structural rule is that Transmutation creates a meaningful connection between the resources of earlier skills.

### 7.4 Independent progression

Every Transmutation action has its own level from 1 to 100.

Performing Earth Transmutation II does not grant action experience to Earth Transmutation I or to any Air or Water action.

The overall Transmutation skill level is derived from the progression of its actions, just like the other skills. Transmutation can also have its own skill-level scalar and milestones.

Catalysts can be stored, used in future systems or sold for gold.

---

## 8. Initial Numerical Balancing

The values in this section are starting points for implementation and playtesting, not immutable final balance.

The first three skills should be straightforward to understand. Their early actions should complete quickly, while higher tiers should take longer, provide more experience and produce more valuable or useful resources.

The game is expected to expand considerably beyond these initial skills. Numerical values should therefore leave room for later progression systems, stronger bonuses and substantially more valuable resources.

### 8.1 Base action values

Each action has its own base duration and base experience reward.

#### Research

Research starts at 4 seconds and increases by 1 second per tier. The current Research skill has eight actions.

| Action | Base duration | Base XP per action | Base output |
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

Spellcraft starts at 5 seconds for Tier I spells. Each subsequent spell tier increases the base duration by 2 seconds.

| Spell tier | Base duration | Base XP per action |
|---|---:|---:|
| I | 5 sec | 20 XP |
| II | 7 sec | 30 XP |
| III | 9 sec | 45 XP |
| IV | 11 sec | 67.5 XP |
| V | 13 sec | 101.25 XP |

These values apply independently to Earth, Air and Water spells within the same tier. They are example values for the initial tiers, not a limit on the eventual number of spells.

Spellcraft actions also have a Mana cost. Mana costs are balanced separately from action duration and base action XP.

#### Transmutation

Transmutation starts at 6 seconds for Tier I. Each subsequent tier increases the base duration by 3 seconds.

| Transmutation tier | Base duration | Base XP per action |
|---|---:|---:|
| I | 6 sec | 30 XP |
| II | 9 sec | 45 XP |
| III | 12 sec | 67.5 XP |
| IV | 15 sec | 101.25 XP |
| V | 18 sec | 151.875 XP |

These values apply independently to Earth, Air and Water Transmutation actions within the same tier. They are example values for the initial tiers, not a final limit on the skill's size.

#### General pattern

The starting base durations are therefore:

- Research: 4, 5, 6, 7, 8, 9, 10, 11 seconds.
- Spellcraft: 5, 7, 9, 11, 13 seconds for the initial example tiers.
- Transmutation: 6, 9, 12, 15, 18 seconds for the initial example tiers.

These are base durations before bonuses. The XP rewards also increase with each tier and from one skill to the next.

The initial output of each action is one resource per completion. Leveling bonuses and other progression systems may increase the effective output.

### 8.2 Experience required per action level

Every action has its own experience requirement curve. The curve becomes more demanding as the action levels up.

The experience requirement is influenced by:

- The action's base XP reward.
- The starting requirement for that action.
- The experience scalar assigned to its skill.
- The additional experience scalar assigned to the action's tier.

The skill scalar makes actions in different skills progress at different rates. The tier scalar stretches the curve further for higher-tier actions within a skill.

The first levels should be approachable, but reaching level 100 should require a substantial amount of progress. In the early game, this should be a long-term goal. As the player accumulates stronger bonuses and develops a better setup, the same level-100 goal should become increasingly achievable, including over long offline periods.

#### Starting completion requirements

The starting number of completed actions required for the first level-up differs by skill and tier.

| Skill | Action tier | Completions for level 1 → 2 |
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

These are initial balancing values for the example actions. The same starting requirement applies to each element-specific action within the same Spellcraft or Transmutation tier.

The higher-tier Research values continue the existing 1.5 progression between tiers. The eventual curves and scalars remain subject to playtesting.

### 8.3 Skill-level passive bonuses

A skill may have a passive effect that improves with every level gained in that skill.

For example, Spellcraft may increase maximum Mana by a fixed amount for every Spellcraft level. This is a linear bonus: each level adds the same amount of capacity.

These bonuses are awarded by the skill's ordinary level progression. They are not milestone rewards, and they do not replace or consume either action milestones or skill milestones.

Other skills may have different per-level passive effects. The exact effect for each skill is not yet defined.

### 8.4 Action-level bonuses and action milestones

Every action has its own independent level progression and its own action-level rewards. **Action milestones belong to the individual action that reaches them.** They are tracked separately for every action and do not depend on the overall level of the skill.

The proposed baseline action-level bonuses are:

- **Every 2 action levels:** +0.5% action speed for this action.
- **Every 5 action levels:** +1% resource output for this action.
- **Every 10 action levels:** +1% chance to avoid consuming required input resources when completing this action.

These recurring bonuses are based on the action's own level. They apply only to that action and continue to accumulate as it levels.

In addition to those recurring bonuses, individual actions can receive special action milestone rewards at selected levels:

| Action milestone | Proposed reward | Applies to |
|---|---|---|
| 25 | +25% action speed | The action that reached level 25 |
| 50 | +100% resource output | The action that reached level 50 |
| 100 | No special reward defined yet | To be decided |

The recurring bonuses still apply at levels 25, 50 and 100. The special milestone rewards are additional effects.

Every action tracks its own milestones independently. For example, Research I reaching action level 25 grants its own level-25 reward. Research II reaching action level 25 can grant the same milestone reward separately. Neither event requires the Research skill itself to reach skill level 25.

Likewise, a skill milestone does not automatically trigger an action milestone. The two systems can happen at different times and must never be treated as the same progression track.

The resource-saving bonus is relevant for actions that consume input materials, such as Transmutation. It gives the action a chance to complete without consuming the required inputs. For actions with no input cost, the bonus has no practical effect unless a future system introduces one.

Fractional expected output should be handled through a suitable fractional carry-over or chance-based additional output system rather than discarding fractions.

### 8.5 Skill milestones

Every skill has its own independent milestone rewards at every 10 skill levels:

**Level 10, 20, 30, 40, 50, 60, 70, 80, 90 and 100.**

These milestones are triggered by the **overall skill level**, not by the level of an individual action. Each skill has its own milestone track. Reaching a milestone in Research does not automatically grant the corresponding Spellcraft or Transmutation milestone.

The exact rewards are **not defined yet**. There may be repeating patterns across skills, but the milestone at a given level does not need to be identical for every skill.

Skill milestones can serve several different purposes:

**A. Improve the skill they belong to**

A milestone can provide a skill-wide bonus that improves every action in the skill that awarded it.

For example, a Research skill milestone could increase the output of all Research actions, not just one individual Research action.

**B. Improve a different skill**

A milestone can improve another skill, creating connections between the progression systems.

For example, a Research skill milestone could improve the experience gain or action speed of all Spellcraft actions.

**C. Provide a global bonus**

A milestone can improve every skill and therefore affect essentially all actions in the game.

Skill levels 50 and 100 are examples of levels that may be used for particularly important global boosts. This is a potential repeating pattern, not a finalized reward schedule.

**D. Provide a unique bonus**

A milestone can grant a special effect that does not fit into a normal action-wide category.

For example, a Spellcraft skill milestone could increase maximum Mana.

Potential skill milestone bonus categories include:

- Action speed.
- Resource output.
- Experience gain.
- Chance to avoid consuming input resources.
- Maximum Mana or other skill-specific capacity.
- Sell value multiplier.
- Unlock cost reduction.
- Other unique effects introduced by future systems.

A skill milestone may affect its own skill, another skill, all skills or a special system. The purpose is to make overall skill progression meaningful beyond simply increasing a number.

Action milestones and skill milestones are separate systems. An action can reach its own milestone without its skill reaching the same numbered level, and a skill can reach a milestone without every action reaching that level.

The exact level-to-reward mapping and the rewards for each skill remain intentionally undecided.

### 8.6 Bonus stacking

For the current design, bonuses stack **additively**.

For example, an action with +20% individual action speed and +20% global action speed receives a total of **+40% action speed**.

The same general additive approach applies to bonuses of the same type from different sources, including action speed, resource output and experience gain.

This is the default rule for the current game design. A future mechanic may have a specific reason to behave differently, but exceptions should be explicitly defined rather than assumed.
---

## 9. Gold and Unlock Economy

Gold is a shared currency used to unlock additional actions, unlock entire skills and expand the player's inventory.

It is earned by selling resources and items. The importance of selling changes as the game develops: the first three skills are primarily about progression and creating useful materials, while later skills are expected to provide much stronger sources of income.

### 9.1 Unlocking Research actions

Research is available from the beginning.

The player starts with:

- Research unlocked.
- Research I available.
- Loose Notes as the first Research output.

Research I is free. Additional Research actions are unlocked with gold.

Unlock prices should increase as the player progresses, but the exact price sequence is not defined here. It should be balanced against the action's production, the resources it creates, bag capacity and the other things the player could spend gold on.

Unlocking a new Research action should not require the previous action to reach level 100.

### 9.2 Unlocking additional skills

Unlocking a skill should require both gold and resources from one or more earlier skills.

The intended initial structure is:

| Skill | Required progression resources |
|---|---|
| Research | Available from the beginning. |
| Spellcraft | Gold plus a modest quantity of Research materials, such as Bound Notes from Research II or Arcane Manuscripts from Research III. |
| Transmutation | Gold plus Research materials and elemental essences produced by Spellcraft. |

The first unlock requirements should be approachable and should demonstrate the relationship between skills without creating an unnecessarily long grind.

Unlocking a skill should normally make its first action available as part of that unlock. The player should not have to pay an additional action-unlock cost for the initial action unless a future skill has a specific reason to work differently.

The exact required quantities and gold costs are undecided and should be balanced during implementation.

### 9.3 Additional actions within unlocked skills

Once a skill is unlocked, its additional actions can be purchased with gold.

The price should rise with the action's tier and expected value. This creates a reason to improve existing production before immediately purchasing every available action.

Some future actions may also require resources from other actions or skills. These resource requirements should be used where they create meaningful progression connections, not applied mechanically to every unlock.

There is no fixed starting price sequence defined here. All gold is shared across the game, so the player chooses how to distribute it between new actions, new skills and inventory expansion.

---

## 10. Bag and Inventory

The game has a dedicated bag system for storing produced resources and other physical items.

The inventory is an important part of progression because resources are used by other skills, may be needed for future unlocks and can be sold for gold.

### 10.1 Inventory slots

The bag starts with a limited number of slots.

Each distinct item type occupies one slot, while multiple copies of the same item can stack together.

For example, Loose Notes occupy one slot whether the player owns one copy or fifty copies. Earth Dust, Air Breath and Water Droplet are different item types and each occupies its own slot.

Different elements and tiers remain separate items. Research materials, elemental essences and Catalysts also occupy their own item slots.

Gold and Mana are tracked as currencies or resource counters and do not occupy normal bag slots.

### 10.2 Expanding the bag

The player can purchase additional bag slots using gold.

The gold cost should increase as the bag becomes larger. The scaling needs to be balanced so that inventory expansion remains a meaningful long-term gold sink without making early progression unnecessarily frustrating.

At some point, expanding the bag should also require specific resources in addition to gold. These requirements act as progression gates: the player may not yet have the required resource, so they must develop the relevant skill before purchasing further capacity.

The resource requirements should become more demanding as the player expands the bag. They may draw from different skills as the game grows.

The exact starting capacity, expansion increments, gold cost curve and resource requirements are all undecided.

### 10.3 Item management

The bag should support:

- Viewing item quantities.
- Sorting and filtering items by category, skill, element and tier.
- Selling individual items or selected quantities.
- Selling multiple items at once.
- Seeing the current sale value of each item.
- Seeing the total value of a selected quantity.

The player should not silently lose resources when the bag is full.

Production should either pause when there is no room or use a clearly visible overflow system. The preferred behavior is to prevent resource loss and clearly indicate why production has stopped.

---

## 11. Selling Items and Resource Values

**Every physical item should be sellable.** There should not be a category of resources that is permanently excluded from selling simply because it is used in a recipe or progression requirement.

This includes Research materials, elemental essences, Catalysts and resources introduced by future skills.

Selling is a player decision. A resource may be useful later, but the player can choose to sell it now when gold is more important. The player should be able to weigh immediate income against retaining materials for unlocks, recipes and future systems.

### 11.1 Base selling values and progression

Every item has its own base selling value.

The sale value shown to the player can be increased by bonuses from skills, milestones and future upgrades. These bonuses should be applied to the item's base value according to the general bonus-stacking rules in Section 8.5.

Better and higher-tier resources should generally be worth more than the simpler resources that came before them. The increase should make sense for the resource's place in progression: an advanced, potent material should normally be more valuable than a common introductory material.

The base value is associated with the individual item, not determined solely by its tier. Different resources of the same tier may have different base values, especially when they come from different skills or require different inputs to produce.

Later skills are expected to introduce resources that sell for substantially more gold than the materials from the first three skills. This is an important part of the long-term economy and should allow later progression to generate much larger amounts of money.

Exact base selling values are not finalized and should be balanced alongside production rates, resource requirements, unlock costs and the value of later skills.

### 11.2 Role of selling in early and later progression

The first three skills — Research, Spellcraft and Transmutation — are primarily about progression, unlocking systems and producing materials for other activities.

Their resources should have sale values, and selling them should help when the player needs gold. However, the initial three tabs are not intended to be the game's major money-making systems.

The player will often have a reason to keep early resources for skill unlocks, Transmutation recipes and future requirements. Selling most of the output should be possible, but it should be a trade-off rather than the only obvious way to play.

Later skills are expected to change the economic direction of the game. They should introduce more valuable resources and stronger opportunities to generate gold, making the economy expand as the player reaches more advanced content.

---

## 12. Overall Game Loop

The first three skills establish the initial progression loop:

| Skill or system | Purpose | Main outputs or role |
|---|---|---|
| Research | Develop general magical knowledge | Research materials |
| Spellcraft | Learn and cast Earth, Air and Water spells | Elemental essences; uses Mana |
| Transmutation | Combine research materials and elemental essences | Catalysts |
| Bag | Store and manage resources | Inventory capacity |
| Selling | Turn items into gold | Gold for unlocks and expansion |

These three initial tabs are the **tip of the iceberg**, not the complete game. They are deliberately straightforward and should introduce the fundamental systems without trying to showcase every type of progression the game will eventually contain.

### 12.1 Starting progression

The player begins with Research available and Research I unlocked.

A possible early progression is:

1. Perform Research I to produce Loose Notes.
2. Sell some Loose Notes when gold is needed, while retaining materials that may be useful later.
3. Unlock additional Research actions with gold and develop their independent levels.
4. Gather the Research materials required to unlock Spellcraft.
5. Spend gold and the required Research materials to unlock Spellcraft.
6. Use Mana to cast the available Earth, Air and Water spells.
7. Produce elemental essences and decide which ones to retain or sell.
8. Gather the Research materials and elemental essences required to unlock Transmutation.
9. Unlock Transmutation and begin combining resources from the earlier skills.
10. Produce Catalysts, retain them for future uses or sell them when gold is needed.
11. Continue developing whichever actions and skills are most useful for the player's current goals.

This is an example of how the initial skills connect, not a mandatory order in which every player must complete each step before doing anything else.

### 12.2 Open-ended progression

The game is **not intended to have a single linear progression path**.

The player should be free to decide which area of the game to develop at a given time. They may focus on one skill, spread their effort across several skills, improve selected actions for their bonuses, gather materials for an unlock or work toward a particular milestone.

Progression and completion are not the same thing as having an action at level 100.

For example, a player could have completed roughly 50% of the game's available progression while not having a single action at level 100. This is expected, especially if the player has chosen to unlock many systems, pursue a variety of milestones or use a setup that is not optimized for a particular action.

The action level-100 goal is deliberately long-term. The player should be able to make meaningful progress through many different systems without first maxing out every action in the current skill.

The game should encourage experimentation and changing focus. A player may decide to develop Research for a needed resource, switch to Spellcraft to build up an elemental essence supply, and then return to Transmutation to use those materials.

### 12.3 Interconnected skills and resource progression

Each skill should connect to one or more other skills through resources, unlocks and bonuses.

Examples in the initial game:

- Research produces materials used by Spellcraft unlock requirements and Transmutation recipes.
- Spellcraft produces elemental essences used by Transmutation and potentially future skills.
- Spellcraft also develops knowledge of spells and the three Primary Elements.
- Transmutation combines earlier resources into more refined materials.
- Skill milestones can create bonuses that improve actions in other skills.
- Selling resources provides gold for unlocks and inventory expansion.

The resource progression should follow the principle of **simple things leading to more complicated things**.

Early actions produce common, simple and relatively weak materials. Later actions produce increasingly refined, potent and valuable resources. Each new skill should build on what the player has already learned or produced, while also introducing its own new mechanics.

This does not mean every skill must be a direct upgrade of the previous one. The connections should create choices and useful dependencies while leaving the player free to choose their preferred progression focus.

### 12.4 Long-term and offline progression

The game should provide meaningful progress over both active and offline play.

During a long offline period, the active action and eligible automated systems should continue to produce resources and action experience. Those completions also contribute toward skill development and milestones.

When the player returns, they may have accumulated a substantial amount of one resource, made considerable progress in a skill, and earned a large potential amount of gold by selling the output.

The player should then decide how to use that progress: keep resources for other skills, sell them for gold, unlock new actions, expand the bag or focus on a different progression path.

As the game grows, additional forms of automation and passive progression can reduce the need to manually operate every action.

---

## 13. Design Principles

The following principles should guide future development:

- **Open-ended progression:** Players choose which skills, actions and systems to focus on. The game is not a strict sequence of actions that must each reach level 100 before the player can move forward.
- **Independent action levels:** Every action has its own level and experience progression. Performing one action does not directly level another action.
- **Derived skill levels:** Every skill has its own level from 1 to 100, derived from the progression of all actions within that skill. Reaching skill level 100 requires every action in that skill to reach level 100.
- **Different progression scalars:** Skills can have different numbers of actions and their own skill and action experience scaling. Individual actions also have tier-dependent scalars.
- **Meaningful levels:** Action levels improve their own actions and can award independent action milestones. Skill levels can provide per-level passive benefits and separate skill milestones.
- **Independent action and skill milestones:** Each action has its own milestone track, separate from its skill's milestone track. Action milestones affect the action that reaches them; skill milestones can affect their own skill, another skill, all skills or a unique system.
- **Additive bonuses:** Bonuses from different sources stack additively by default. Exceptions must be explicitly defined.
- **Distinct Primary Elements:** Earth, Air and Water have separate identities, spells and elemental resources.
- **Aspects are future-facing:** The possible invoke/channel and run-based Aspect system is only a draft concept and is not part of the initial implementation.
- **Mana supports Spellcraft:** Spells require Mana, Mana regenerates passively, and Spellcraft skill levels may increase maximum Mana.
- **Resources matter:** Every resource should have a potential purpose in another skill, an unlock, a recipe or a future system.
- **Everything is sellable:** Every physical item has a base sale value. Selling is a choice between immediate gold and retaining resources for later.
- **Simple to complex:** Early resources and activities should be straightforward. Later skills should introduce more potent resources, deeper interactions and larger economic opportunities.
- **Offline progress is substantial:** Time away from the game should continue to produce meaningful progress in eligible actions and automated systems.
- **Automation can evolve:** One active action is the initial operating model, not an unchangeable restriction on future systems.
- **Expandable structure:** New skills, actions, tiers, resources, bonuses and mechanics should be possible without rewriting the foundations of the progression system.

---

## 14. Intentionally Undecided

The following details remain open for balancing, implementation or future design:

- The exact formula that converts action progression into a skill level.
- The experience curve and scalar for each skill.
- The exact tier-based experience scalar for every action.
- The final action count for skills other than the current eight Research actions.
- The final spell names and which spell tiers will be implemented.
- The final names and descriptions of higher-tier elemental essences.
- The exact Mana costs, starting capacity, regeneration rate and maximum-Mana increase per Spellcraft level.
- Whether skill-level passive bonuses will be used by every skill and what each skill's bonus will be.
- The exact recurring individual action-level bonus values after playtesting.
- The exact action milestone rewards and their level thresholds.
- The milestone rewards for each skill at levels 10 through 100.
- Which milestones will affect their own skill, another skill, all skills or a unique system.
- The final Transmutation action names, resource names, recipes and input quantities.
- The final unlock requirements and gold prices for actions and skills.
- The final bag starting capacity, gold expansion curve and additional resource requirements.
- The base selling value of every item and the bonuses that increase sale values.
- How fractional resource output is handled internally.
- The exact offline progress rules, any offline cap and full-inventory behavior.
- Which actions or systems eventually become automatic or passive.
- Whether later systems allow more than one actively selected action to progress at once.
- Future skills, resource categories and their connections to the initial three skills.
- Whether the future Aspect concept becomes a prestige or run-based system, how many Aspects exist and how their experience and bonuses work.
- Whether a separate elemental mastery system is ever introduced.

The initial implementation should establish the three Primary Elements, the first three skills, action and skill progression, Mana-based Spellcraft, resource production, resource-based skill unlocks, inventory expansion, selling and meaningful offline gains.

These foundations should remain simple enough to understand while allowing the game to grow into a much larger and more interconnected progression system.
