# Incremental Mage — Core Game Design

*Working design document · Progression and economy draft*

## 1. Game Concept

A pure incremental idle game about a mage gradually learning, mastering and specializing in three fundamental aspects of magic.

The initial game is built around three main skills:

1. **Research** — studying general magical knowledge and producing research materials.
2. **Spellcraft** — learning and practicing spells belonging to Order, Life and Death.
3. **Transmutation** — combining materials from the first two skills to produce new basic resources.

Each skill has its own collection of individual actions. Every action has its own level, experience, duration, output and progression bonuses.

The player starts with a small number of available actions and earns gold by selling the resources they produce. Gold is used to unlock additional actions and entire skills, as well as expand the player's inventory.

The player can perform **one action at a time**. They choose which available action to work on, and only that action receives experience and produces its associated resource.

The long-term goal is to build a large, interconnected progression system in which every action contributes to the player's overall development.

---

## 2. The Three Aspects of Magic

The mage can learn and master three distinct aspects. Each has its own identity, spells and resources.

### Order — structure and fundamental magic

Order represents the fundamental principles of magic: structure, stability, force, control and the underlying rules governing the world.

It is neither inherently life-giving nor destructive. It represents the ability to manipulate magic and impose structure upon the world.

Example first spell:

- **Force** — creates a tiny magical push. A simple demonstration of basic magical control.

### Life — growth and creation

Life represents vitality, growth, restoration and the creation or preservation of living things.

It is associated with plants, healing, regeneration and the forces that allow living things to flourish.

Example first spell:

- **Growth** — encourages a small flower or plant to grow slightly faster.

### Death — decay and endings

Death represents decay, deterioration, endings and the natural process of things losing their vitality.

It is not necessarily evil. It is the counterpart to Life: the force that brings things to an end.

Example first spell:

- **Wilt** — causes a flower or small plant to wither.

The three aspects should remain distinct in their identities, resources and future progression. They are not interchangeable, and specializing in one should not automatically level the others.

---

## 3. Shared Progression System

All three skills use the same fundamental action progression model.

### 3.1 Skills, actions and levels

The game is divided into **skills**, each represented by its own tab or page.

Each skill contains multiple **actions**.

Examples:

- Research contains Research I, Research II, Research III, and so on.
- Spellcraft contains Order I, Life I, Death I, Order II, Life II, Death II, and so on.
- Transmutation contains Order Transmutation I, Life Transmutation I, Death Transmutation I, and so on.

Every action has its own independent progression track, starting at **level 1 and ending at level 100**.

Each action tracks:

- Current level.
- Current experience.
- Experience required for the next level.
- Base action duration.
- Base experience reward.
- Resource produced per completed action.
- Bonuses gained from leveling.
- Milestone bonuses.

### 3.2 Independent action progression

Every action levels independently.

For example, Research I and Research II are completely separate actions.

If the player performs Research II, only Research II receives experience. Research I does not receive any experience, even if it is still below level 100.

The same applies across all skills. Performing an Order spell does not level a Life spell or a Death spell.

There is no shared experience pool between actions.

The only shared progression comes from bonuses awarded by certain milestones, which can improve other actions or the entire game.

### 3.3 Unlocking additional actions

Actions are unlocked using **gold**, not by completing the previous action.

This applies across all three skills.

The player starts with a small selection of available actions. As resources are produced and sold, the player earns enough gold to unlock additional actions.

Unlock prices increase substantially as the player progresses. This makes later actions progressively more expensive and encourages the player to keep improving existing actions before purchasing everything that becomes available.

An action can be unlocked while another action is still below level 100.

Unlocking an action makes it available; it does not automatically start it.

Entire skills also have unlock costs. The player does not have access to all three skill tabs from the beginning.

### 3.4 Action duration

Every action has a base duration.

Higher-tier actions generally take longer to complete, but provide more experience and resources.

The duration of an action can be improved through:

- Its own individual level.
- Its own milestone bonuses.
- Skill-wide bonuses from other actions in the same skill.
- Global bonuses from other skills.
- Future upgrades and systems.

Only one action can be active at a time.

### 3.5 Experience

Experience is awarded only when the active action completes.

Each action has its own base XP reward. Higher-tier actions and actions belonging to later skills generally provide more base XP.

The XP required to advance also increases with the action's level.

This creates two independent progression challenges:

- Higher-tier actions have greater base requirements from the beginning.
- Higher levels within an action require progressively more experience.

The exact formulas and initial balancing values are proposed in Section 8.

---

## 4. Combined Level per Skill

Each main skill displays a combined level representing the total progression across all its individual actions.

The display should show:

**Combined Level: Current / Maximum**

The current combined level is the sum of the progression levels across every action belonging to that skill.

Since each action starts at level 1, its contribution to the combined level is its current level minus 1.

The maximum combined level is therefore:

**Number of actions × 99**

Locked actions still count towards the maximum. This allows the player to see how much total progression exists within the skill.

For example:

| Skill | Number of actions | Maximum combined level |
|---|---:|---:|
| Research | 5 | 495 |
| Spellcraft | 9 | 891 |
| Transmutation | 6 | 594 |

These are example action counts, not final limits.

Each skill should display its combined level near the top of its interface, ideally alongside an overall progress bar.

The combined level is a measure of total progression, not a separate action that can be leveled directly.

---

## 5. Skill One — Research

**Purpose:** Study general magical knowledge independently of the three aspects.

Research is the foundation of the mage's progression. It represents general magical education and theoretical knowledge rather than a specific magical discipline.

### 5.1 Research actions

Research is divided into individual actions, each producing a different research material.

Suggested naming:

- Research I
- Research II
- Research III
- Research IV
- Research V
- And so on.

Each action has its own level from 1 to 100.

The player starts with Research I unlocked. Additional research actions are purchased with gold.

Each action can be leveled independently, and its own level improves its production and speed.

### 5.2 Research resources

Each research action produces its own material.

Suggested naming:

- Research Folio I
- Research Folio II
- Research Folio III
- Research Folio IV
- And so on.

Research Folios represent the knowledge and written material obtained through studying that particular tier.

They are used as materials in Transmutation and potentially other future systems.

They can also be sold for gold.

### 5.3 Example action structure

| Action | Level range | Resource |
|---|---|---|
| Research I | 1–100 | Research Folio I |
| Research II | 1–100 | Research Folio II |
| Research III | 1–100 | Research Folio III |
| Research IV | 1–100 | Research Folio IV |
| Research V | 1–100 | Research Folio V |

The number of research actions is not fixed.

---

## 6. Skill Two — Spellcraft

**Purpose:** Learn, practice and master spells belonging to Order, Life and Death.

Spellcraft introduces the three magical aspects.

Each spell is an independent action with its own level, XP, duration and resource output.

### 6.1 Initial spells

The first available spell is Order I.

| Aspect | Spell | Description |
|---|---|---|
| Order | Force | Creates a tiny magical push. |
| Life | Growth | Encourages a small plant to grow. |
| Death | Wilt | Causes a small plant to wither. |

The player starts with **Order I: Force** when Spellcraft is unlocked.

Life I: Growth and Death I: Wilt can be unlocked with gold.

The player can choose to unlock and practice either spell without needing to level the previous one to 100.

### 6.2 Spell progression

Each aspect has its own collection of spells.

An example structure:

| Tier | Order | Life | Death |
|---|---|---|---|
| I | Force | Growth | Wilt |
| II | Surge | Bloom | Wither |
| III | Blast | Flourish | Decay |
| IV | Overload | Flourishing | Entropy |

Names beyond the first tier are placeholders.

Each spell has its own independent level from 1 to 100.

Unlocking a higher-tier spell costs gold. It does not require the previous spell to reach level 100.

### 6.3 Aspect essences

Every spell produces a resource associated with its aspect and tier.

Suggested naming:

- Order Essence I
- Life Essence I
- Death Essence I
- Order Essence II
- Life Essence II
- Death Essence II
- And so on.

Each spell action produces its corresponding essence.

These essences are used in Transmutation and potentially other future systems.

They can also be sold for gold.

The different essences remain separate inventory items and are not interchangeable by default.

### 6.4 Independent progression and shared bonuses

Order, Life and Death have no shared experience progression.

Leveling an Order spell does not grant experience to Life or Death spells.

However, individual spell milestones can grant bonuses that affect other actions or the entire game.

For example, reaching a particular milestone in an Order spell might provide a small global action-speed bonus.

This creates a reason to develop multiple aspects without forcing them to share levels or experience.

---

## 7. Skill Three — Transmutation

**Purpose:** Combine research materials and aspect essences to produce new basic resources.

Transmutation replaces the earlier Sigilcraft concept.

It is not currently about creating equipment, runes, sigils, spell tomes or combat items. Its initial purpose is simply to transform materials from the first two skills into another useful resource.

### 7.1 Transmutation actions

Transmutation contains independent actions associated with the three aspects.

The initial action categories are:

- Order Transmutation
- Life Transmutation
- Death Transmutation

Each category contains multiple tiers, and every tier is an independent action with its own level from 1 to 100.

An example:

| Tier | Order | Life | Death |
|---|---|---|---|
| I | Order Transmutation I | Life Transmutation I | Death Transmutation I |
| II | Order Transmutation II | Life Transmutation II | Death Transmutation II |
| III | Order Transmutation III | Life Transmutation III | Death Transmutation III |

Additional tiers can be introduced later.

### 7.2 Transmutation resources

The output should be a basic material rather than a finished magical item.

Suggested naming:

- Order Catalyst I
- Life Catalyst I
- Death Catalyst I
- Order Catalyst II
- Life Catalyst II
- Death Catalyst II

A Catalyst represents a concentrated material produced by combining knowledge and magical essence.

Alternative resource names include:

- Reagent — a general-purpose material used in further processes.
- Residuum — a concentrated residue left behind by magical processes.
- Condensate — a material formed by concentrating magical properties.
- Extract — a straightforward name for a refined material.

**Current preferred resource name: Catalyst.**

### 7.3 Materials and recipes

A Transmutation action requires materials from the first two skills.

For example:

**Order Transmutation I**
- Research Folio I.
- Order Essence I.
- Produces Order Catalyst I.

**Life Transmutation I**
- Research Folio I.
- Life Essence I.
- Produces Life Catalyst I.

**Death Transmutation I**
- Research Folio I.
- Death Essence I.
- Produces Death Catalyst I.

Higher tiers require more advanced research materials and essences.

The exact quantities and recipes will be balanced later.

### 7.4 Independent progression

Each Transmutation action has its own level from 1 to 100.

Performing Order Transmutation II does not grant experience to Order Transmutation I or either of the other aspects.

As with the other skills, additional actions are unlocked with gold.

The resulting Catalysts can be stored, used in future systems or sold for gold.

---

## 8. Initial Numerical Balancing

The following values are a proposed starting point for implementation and playtesting.

The intention is to keep the first actions straightforward and quick, while allowing later actions and skills to require progressively more experience.

### 8.1 Base action values

Each action has its own base duration and XP reward.

The duration increases gradually within each skill. The first actions should be relatively quick, and the differences between tiers should remain understandable.

#### Research

Research starts at 4 seconds and increases by 1 second per tier.

| Action | Base duration | Base XP per action | Base output |
|---|---:|---:|---:|
| Research I | 4 sec | 10 XP | 1 Research Folio I |
| Research II | 5 sec | 15 XP | 1 Research Folio II |
| Research III | 6 sec | 22.5 XP | 1 Research Folio III |
| Research IV | 7 sec | 33.75 XP | 1 Research Folio IV |
| Research V | 8 sec | 50.625 XP | 1 Research Folio V |

#### Spellcraft

Spellcraft starts at 5 seconds for all Tier I spells. Each subsequent spell tier increases the base duration by 2 seconds.

| Spell tier | Base duration | Base XP per action |
|---|---:|---:|
| I | 5 sec | 20 XP |
| II | 7 sec | 30 XP |
| III | 9 sec | 45 XP |
| IV | 11 sec | 67.5 XP |
| V | 13 sec | 101.25 XP |

These values apply independently to Order, Life and Death spells within the same tier.

#### Transmutation

Transmutation starts at 6 seconds for Tier I. Each subsequent tier increases the base duration by 3 seconds.

| Transmutation tier | Base duration | Base XP per action |
|---|---:|---:|
| I | 6 sec | 30 XP |
| II | 9 sec | 45 XP |
| III | 12 sec | 67.5 XP |
| IV | 15 sec | 101.25 XP |
| V | 18 sec | 151.875 XP |

These values apply independently to Order, Life and Death Transmutation actions within the same tier.

#### General pattern

The starting base durations are therefore:

- Research: 4, 5, 6, 7, 8 seconds...
- Spellcraft: 5, 7, 9, 11, 13 seconds...
- Transmutation: 6, 9, 12, 15, 18 seconds...

These are base durations before any speed bonuses.

The XP rewards also increase with each tier and from one skill to the next.

The initial output of each action is one resource per completion. Leveling bonuses can increase the effective output.

### 8.2 Experience required per level

Every action has its own experience requirement curve.

The curve should start gently, with the first few levels requiring approximately 1, 1.5, 2.25, 3.375 and 5.0625 completed actions.

After the first five level transitions, the exponential growth becomes slower. This allows the experience requirement to reach the desired level 99 → 100 values without growing uncontrollably.

#### Starting completion requirements

The number of completed actions required for the first level-up differs by skill and tier.

| Skill | Action tier | Completions for level 1 → 2 |
|---|---|---:|
| Research | I | 1 |
| Research | II | 1.5 |
| Research | III | 2.25 |
| Research | IV | 3.375 |
| Research | V | 5.0625 |
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

The same requirement applies to every aspect-specific action within the same Spellcraft or Transmutation tier.

For example, Order I, Life I and Death I each require approximately two completed actions for their first level-up.

#### Early level requirements

The first five level transitions follow the same progression:

| Current level | Required completions relative to the action's starting requirement |
|---|---:|
| 1 → 2 | 1× |
| 2 → 3 | 1.5× |
| 3 → 4 | 2.25× |
| 4 → 5 | 3.375× |
| 5 → 6 | 5.0625× |

For Research I, this means:

| Level progression | Required completions | XP required |
|---|---:|---:|
| 1 → 2 | 1 | 10 |
| 2 → 3 | 1.5 | 15 |
| 3 → 4 | 2.25 | 22.5 |
| 4 → 5 | 3.375 | 33.75 |
| 5 → 6 | 5.0625 | 50.625 |

For the first Spellcraft action, using Order I as an example:

| Level progression | Required completions | XP required |
|---|---:|---:|
| 1 → 2 | 2 | 40 |
| 2 → 3 | 3 | 60 |
| 3 → 4 | 4.5 | 90 |
| 4 → 5 | 6.75 | 135 |
| 5 → 6 | 10.125 | 202.5 |

For the first Transmutation action:

| Level progression | Required completions | XP required |
|---|---:|---:|
| 1 → 2 | 3 | 90 |
| 2 → 3 | 4.5 | 135 |
| 3 → 4 | 6.75 | 202.5 |
| 4 → 5 | 10.125 | 303.75 |
| 5 → 6 | 15.1875 | 455.625 |

Fractional XP and completion equivalents are allowed internally. The UI can round displayed XP values sensibly.

#### Late-level targets

The final level requirement should be around 100,000 completed actions' worth of XP for every action.

This results in the following level 99 → 100 targets:

| Skill | Action tier | Base XP per action | XP needed for level 99 → 100 |
|---|---|---:|---:|
| Research | I | 10 | 1,000,000 |
| Research | II | 15 | 1,500,000 |
| Research | III | 22.5 | 2,250,000 |
| Spellcraft | I | 20 | 2,000,000 |
| Spellcraft | II | 30 | 3,000,000 |
| Spellcraft | III | 45 | 4,500,000 |
| Transmutation | I | 30 | 3,000,000 |
| Transmutation | II | 45 | 4,500,000 |
| Transmutation | III | 67.5 | 6,750,000 |

These final requirements are deliberately higher for later tiers and later skills.

#### Experience curve formula

Let:

- `B` = base XP awarded by one completed action.
- `M` = starting number of completions required for that action's first level-up.
- `L` = the action's current level.
- `R` = a growth multiplier calculated for that action.

The experience required to advance from the current level is:

For levels 1 through 5:

`XP required = B × M × 1.5^(L - 1)`

For levels 6 through 99:

`XP required = B × M × 1.5^4 × R^(L - 5)`

The multiplier `R` is calculated as:

`R = (100,000 / (M × 1.5^4))^(1 / 94)`

This ensures that the level 99 → 100 requirement equals 100,000 times the action's base XP reward.

The multiplier is recalculated for each action based on its skill and tier.

This gives every action the same general shape of progression while allowing its starting requirement and final XP target to differ.

The intention is that early progression feels accessible, but reaching level 100 remains a substantial long-term achievement.

### 8.3 Individual action leveling bonuses

Every action should improve itself as it levels.

The proposed baseline:

- **Every 2 levels:** +0.5% action speed for this action.
- **Every 5 levels:** +1% resource output for this action.
- **Every 10 levels:** +1% chance to avoid consuming the required resources when completing this action.
- **Level 25:** +25% action speed for this action.
- **Level 50:** +100% resource output for this action.
- **Level 100:** No special bonus for now.

These bonuses are tied to the individual action.

For example, leveling Research I improves Research I's action speed, output and resource-saving chance. It does not directly improve Research II.

The regular interval bonuses continue to apply at levels 25, 50 and 100. The level 25 and 50 bonuses are additional effects.

At level 100, the regular interval bonuses still apply, but there is no additional special level 100 action bonus currently defined.

The resource-saving chance means that the action has a chance to complete without consuming the materials normally required to perform it.

This is particularly useful for Transmutation, where actions consume resources from Research and Spellcraft.

For actions that do not consume input materials, this bonus has no practical effect until the action requires resources in a future system.

For output bonuses, fractional expected output should be handled through fractional carry-over or a chance to produce an additional item, rather than simply discarding fractional values.

### 8.4 Skill-wide and global milestones

In addition to individual action bonuses, certain milestones award permanent bonuses that affect other actions.

Milestones are triggered when an individual action reaches the relevant level.

The milestone bonus affects the entire skill that the action belongs to, not just the action that reached it.

#### Skill-wide milestones

| Milestone level | Bonus | Applies to |
|---|---|---|
| 10 | +10% resource output | All actions in the same skill |
| 30 | +10% action speed | All actions in the same skill |
| 70 | +25% resource output | All actions in the same skill |
| 90 | +25% action speed | All actions in the same skill |

For example, when Research I reaches level 10, it grants +10% output to every Research action, including Research II and Research III.

If Research II later reaches level 10, it can grant the same milestone bonus again.

Each action can earn each milestone once. Bonuses earned from different actions stack.

This gives the player a reason to level multiple actions within the same skill, even if some of those actions are not currently being used.

#### Global milestones

Levels 50 and 100 are reserved for global milestone rewards.

These bonuses will eventually affect the entire game rather than just one skill.

Potential rewards include:

- Global action speed.
- Global resource output.
- Global chance to avoid consuming resources.
- Other universal progression bonuses.

The exact global milestone effects are not decided yet.

Level 50 already has its individual +100% output bonus from Section 8.3. That bonus affects only the action that reaches level 50. The separate global level 50 milestone is still reserved for a future decision.

Level 100 has no additional individual action bonus or defined global effect at the moment.

#### Reserved milestones

Levels 20, 40, 60 and 80 are intentionally reserved for future milestone effects.

These can later introduce additional skill-wide, global or more specialized bonuses.

### 8.5 Bonus stacking

Bonuses from different sources should stack **multiplicatively**, not additively.

This is important because an action can receive bonuses from several places:

- Its own individual level.
- Its own individual milestones.
- Other actions in the same skill.
- Global milestones.
- Future upgrades and systems.

For example, an action with +20% individual action speed and +20% global action speed should not simply receive +40% action speed.

Instead, the speed multipliers are multiplied:

`1.20 × 1.20 = 1.44`

The action therefore performs at 1.44 times its base rate, equivalent to a 44% increase in action rate.

#### Action duration calculation

The final duration is calculated by dividing the base duration by the combined speed multiplier:

`Final duration = Base duration / (Individual speed multiplier × Skill speed multiplier × Global speed multiplier)`

For example:

- Base duration: 5 seconds.
- Individual speed bonus: +20%.
- Global speed bonus: +20%.

`Final duration = 5 / (1.20 × 1.20)`

`Final duration ≈ 3.47 seconds`

#### Output calculation

Output bonuses follow the same multiplicative principle.

For example:

- Individual output bonus: +20%.
- Skill-wide output bonus: +10%.
- Global output bonus: +25%.

`Final output multiplier = 1.20 × 1.10 × 1.25`

`Final output multiplier = 1.65`

The action therefore produces an average of 1.65 times its base output.

#### Resource-saving chance

Resource-saving bonuses should also be combined in a way that respects multiplicative stacking.

A useful approach is to multiply the remaining consumption probabilities.

For example, two independent 10% resource-saving bonuses result in:

`1 - (0.90 × 0.90) = 0.19`

The final chance to avoid consuming resources is therefore 19%, not 20%.

This keeps all bonus sources consistent without allowing additive stacking to become excessive.

---

## 9. Gold and Unlock Economy

Gold is the primary currency used to unlock additional actions and entire skills, as well as expand the player's inventory.

It is earned primarily by selling resources.

### 9.1 Unlocking the first skill

The Research skill is available from the beginning.

The player starts with:

- Research I unlocked.
- Research Folio I as its output.

The first action is free.

Additional Research actions are unlocked using gold.

Suggested starting unlock prices:

| Action | Unlock cost |
|---|---:|
| Research I | Free |
| Research II | 25 gold |
| Research III | 250 gold |
| Research IV | 2,500 gold |
| Research V | 25,000 gold |
| Research VI | 250,000 gold |

The price increases by a factor of ten for every additional action.

### 9.2 Unlocking additional skills

The player does not have access to all skill tabs from the beginning.

Each new skill has its own one-time unlock cost.

Unlocking a skill automatically unlocks its first action.

Suggested starting structure:

| Skill | Skill unlock cost | Included first action |
|---|---:|---|
| Research | Free | Research I |
| Spellcraft | 1,000 gold | Order I: Force |
| Transmutation | 100,000 gold | Order Transmutation I |

The Transmutation unlock cost is a provisional estimate, following the tenfold increase from Spellcraft.

The first action of a newly unlocked skill is effectively included in the price of unlocking that skill. It does not require a second payment.

### 9.3 Additional actions within unlocked skills

Once a skill is unlocked, its additional actions can be purchased with gold.

The suggested starting price sequence is:

| Action within skill | Unlock cost |
|---|---:|
| First action | Included in skill unlock |
| Second action | 25 gold |
| Third action | 250 gold |
| Fourth action | 2,500 gold |
| Fifth action | 25,000 gold |
| Sixth action | 250,000 gold |

This applies to each skill.

For example, after unlocking Spellcraft, the first action is Order I. Life I is the second action, Death I is the third, Order II is the fourth, and so on.

All gold is shared across the game. The player must decide which actions and skills to unlock first.

The price ladder is designed to encourage the player to level older actions and sell their resources before purchasing increasingly expensive content.

---

## 10. Bag and Inventory

The game has a dedicated bag system for storing all produced resources.

The inventory is an important part of the economy because the player will accumulate many different materials.

### 10.1 Inventory slots

The bag starts with a limited number of slots.

Each distinct item type occupies one slot, while multiple copies of the same item can stack together.

For example, Research Folio I occupies one slot whether the player owns one or fifty copies.

Different tiers and aspects remain separate items and therefore occupy separate slots.

For example, Order Essence I and Life Essence I are different items and each occupies its own slot, even though they belong to the same tier.

Gold is stored as a currency counter and does not occupy a bag slot.

### 10.2 Expanding the bag

The player can purchase additional bag slots using gold.

The cost should increase as the bag becomes larger, creating a long-term gold sink.

Bag expansion should remain useful throughout the game, but its costs should not compete too aggressively with the much more important action and skill unlocks.

The exact starting capacity, expansion increments and gold cost curve are still to be determined.

### 10.3 Item management

The bag should support:

- Viewing item quantities.
- Sorting and filtering items by category, skill, aspect and tier.
- Selling individual items or selected quantities.
- Selling multiple items at once.
- Seeing the current sale value of each item.
- Seeing the total value of a selected quantity.

The player should not silently lose resources when their bag is full.

Production should either pause when there is no room or use a clearly visible overflow system. The preferred behavior is to prevent resource loss and clearly indicate why production has stopped.

---

## 11. Selling Items and Resource Values

Almost every physical item produced through the game's activities should be sellable.

This includes:

- Research Folios.
- Order Essences.
- Life Essences.
- Death Essences.
- Order Catalysts.
- Life Catalysts.
- Death Catalysts.
- Other resources introduced in future activities.

Each item has a base selling value.

### 11.1 Selling value progression

Resource selling values should increase with the resource's tier, but the progression should remain relatively modest.

The value should not be calculated from how long the action takes to complete. A resource should not automatically become extremely valuable simply because its associated action has a long base duration.

The initial selling value progression uses the following pattern:

- Tier I: 2 gold.
- Tier II: 4 gold.
- Tier III: 7 gold.
- Tier IV: 12 gold.
- Tier V: 20 gold.
- Tier VI: 33 gold.
- Tier VII: 54 gold.
- Tier VIII: 88 gold.
- Tier IX: 143 gold.
- Tier X: 232 gold.

The next value is calculated from the previous two values, plus one gold:

**Next value = Previous value + Second-previous value + 1**

For example:

- Tier III: 2 + 4 + 1 = 7 gold.
- Tier IV: 4 + 7 + 1 = 12 gold.
- Tier V: 7 + 12 + 1 = 20 gold.

This produces a gradually increasing sequence without the excessive price escalation of the earlier proposal.

### 11.2 Applying values to resources

The initial approach is to use the same base selling value for resources belonging to the same tier, regardless of which skill or aspect produced them.

For example:

| Resource | Tier | Base selling value |
|---|---:|---:|
| Research Folio I | I | 2 gold |
| Order Essence I | I | 2 gold |
| Life Essence I | I | 2 gold |
| Death Essence I | I | 2 gold |
| Order Catalyst I | I | 2 gold |
| Life Catalyst I | I | 2 gold |
| Death Catalyst I | I | 2 gold |
| Research Folio II | II | 4 gold |
| Order Essence II | II | 4 gold |
| Life Essence II | II | 4 gold |
| Death Essence II | II | 4 gold |
| Order Catalyst II | II | 4 gold |
| Life Catalyst II | II | 4 gold |
| Death Catalyst II | II | 4 gold |

This keeps the economy easy to understand and avoids giving resources arbitrary values based on their production duration.

The values can be adjusted later if certain resources become too easy or difficult to obtain, or if their importance in future recipes requires a different economy.

### 11.3 Uses for gold

Gold is primarily used for:

- Unlocking additional skills.
- Unlocking additional actions within skills.
- Expanding bag capacity.
- Potentially purchasing upgrades and other improvements in future systems.

Selling items should be a useful source of gold and an important part of progression.

However, the player should also have reasons to retain resources for use in Transmutation and future systems rather than selling everything immediately.

---

## 12. Overall Game Loop

The initial game consists of three interconnected skills and one shared inventory and economy system.

| Skill | Purpose | Main output |
|---|---|---|
| Research | General magical education | Research Folios |
| Spellcraft | Learning the three aspects | Aspect Essences |
| Transmutation | Combining research and essences | Catalysts |
| Bag | Storing and managing items | Inventory capacity |
| Selling | Turning items into gold | Gold |

### 12.1 Starting progression

The player begins with Research unlocked and Research I available.

The initial progression looks like this:

1. Perform Research I to produce Research Folio I.
2. Sell Research Folios to earn gold.
3. Purchase Research II for 25 gold.
4. Continue researching, leveling individual actions and earning gold.
5. Work towards the 1,000 gold required to unlock Spellcraft.
6. Unlock Spellcraft, automatically receiving Order I: Force.
7. Practice Force to produce Order Essence I.
8. Unlock Life I and Death I with gold when desired.
9. Continue developing Research and Spellcraft to earn the resources and gold required to unlock Transmutation.
10. Unlock Transmutation, automatically receiving Order Transmutation I.
11. Combine research materials and aspect essences into Catalysts.
12. Sell Catalysts or save them for future systems.

### 12.2 Long-term progression

As the player develops, the progression loop becomes increasingly interconnected.

- Research provides materials required by Transmutation.
- Spellcraft provides aspect-specific essences required by Transmutation.
- Transmutation produces another resource category that can be used in future systems.
- Selling resources provides gold for new skill and action unlocks.
- Leveling individual actions improves their own production.
- Action milestones provide bonuses to their skill or eventually the entire game.

The player can switch between any unlocked action at any time.

Only the currently active action gains experience and produces its associated resource.

The player should continually make decisions about whether to level an existing action, unlock a new one, produce materials for Transmutation or sell resources for gold.

---

## 13. Design Principles

The following principles should guide future development:

- **Independent progression:** Every action has its own level and experience. Experience is never shared between actions.
- **Gold-based unlocks:** New actions and entire skills are purchased with gold, not automatically unlocked by reaching level 100.
- **One active action:** The player chooses one action at a time.
- **Meaningful levels:** Leveling an action improves its speed, output and resource-saving chance, not just a displayed number.
- **Milestones matter:** Every ten levels provide milestone opportunities, with some bonuses affecting the entire skill and others eventually affecting the whole game.
- **Distinct aspects:** Order, Life and Death have separate identities, resources and progression paths.
- **Resources matter:** Materials should be useful beyond the activity that produces them.
- **Selling is an option:** Almost every physical item should have a sale value.
- **Controlled economy:** Higher-tier items are more valuable, but selling should not trivialize progression.
- **Multiplicative bonuses:** Independent sources of bonuses should multiply rather than simply add together.
- **Expandable structure:** New actions, tiers, resources and skills should be easy to add later.

---

## 14. Intentionally Undecided

The following systems are not yet defined:

- The final number of actions in each skill.
- The final names of higher-tier spells.
- The final naming convention for higher-tier research materials and essences.
- The final Transmutation resource naming, including whether Catalyst is the best choice.
- The exact XP curves and action durations after playtesting.
- The final action and skill unlock prices.
- The exact quantities of materials consumed by Transmutation.
- Whether action output is always one item or can increase through levels and milestones.
- How fractional resource output is handled internally.
- The final global milestone rewards at levels 50 and 100.
- The effects assigned to the reserved milestones at levels 20, 40, 60 and 80.
- The full bag capacity and expansion price curve.
- Whether offline progress is capped.
- Whether future upgrades can automate actions or allow multiple simultaneous actions.
- Future skills and resource categories.
- The eventual purpose of Catalysts in later progression systems.

The initial implementation should focus on the three independent skills, their action progression, gold-based unlocks, resource production, inventory and selling.

The system should be designed so that additional mechanics can be introduced without changing the fundamental progression model.