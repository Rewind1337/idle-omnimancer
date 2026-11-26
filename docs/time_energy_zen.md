# Time Energy & Zen

## Overview

Time Energy and Zen are two related systems built around qualifying idle time.

- **Time Energy** is a stored resource. It is generated from qualifying idle time while the player is offline and can be spent while the player is online to accelerate active gameplay.
- **Zen** is a progression skill unlocked separately after Time Energy. Its primary action, **Meditate**, progresses passively during qualifying idle time and awards XP to a meditation tier selected by the player.

The systems share the same underlying idle-time cycle. They must not run separate timers that count the same elapsed time twice.

## Unlock progression

There are two separate, one-time Shop improvements. Both consume their full costs when purchased.

### 1. Time Energy

The first improvement unlocks the Time Energy system.

| Requirement | Cost |
| --- | ---: |
| Coins | 2,500 |
| Research T1 books | 100 |
| Research T2 books | 100 |
| Research T3 books | 100 |

Before this improvement is purchased, Time Energy does not exist for the player:
- It is not generated or stored.
- It cannot be spent.
- It is not displayed anywhere.
- The player cannot use the Time Energy acceleration toggle.

### 2. Zen

Zen is a separate Shop improvement and requires the Time Energy improvement to have been purchased first.

| Requirement | Cost |
| --- | ---: |
| Coins | 5,000 |
| Research T2 books | 250 |
| Research T3 books | 250 |
| Research T4 books | 250 |

Purchasing this improvement unlocks the Zen skill and its Meditate action. The Zen skill must not be accessible before this purchase.

## Time Energy

### Generation

Time Energy is generated **only while the game is offline**, and only for elapsed time during which no active action is progressing.

- Conversion rate: **1 hour of qualifying offline idle time generates 10 minutes of Time Energy**.
- Equivalent cycle: **6 minutes of qualifying idle time generates 60 seconds of Time Energy**.
- Maximum stored amount: **2 hours of Time Energy**.
- The existing maximum offline-progress duration remains **24 hours**.
- Generation stops at the 2-hour cap. Excess qualifying idle time is not stored for later.
- Keep fractional values internally so partial periods and the cap are handled accurately.

There is no online Time Energy generation in this design. In particular, simply leaving the game open while idle does not generate Time Energy.

### What counts as idle?

The relevant distinction is whether an **active action** is progressing, not whether any game system is progressing.

The following do not prevent idle time from counting:
- Combat progressing. Combat is passive and cannot be switched off in the same way as an active action.
- Passive companion learning progressing.
- No action being selected.
- An active action finishing during offline simulation.
- An active action becoming unable to continue because it has run out of required resources.

When an active action finishes or can no longer continue, the remaining eligible offline time is treated as idle from that exact point onward. Time Energy generation must begin for that remaining interval.

A skill or action being locked or unavailable does not itself prevent idle time from counting. The player always has access to Research and its first action; if that action is not currently running, the player is idle for this purpose.

### Time Energy cap

The storage cap is currently fixed at **2 hours**.

- Reaching the cap stops further Time Energy generation.
- Time Energy already stored is retained.
- Reaching the cap does not stop Zen meditation or Zen XP progression.
- The cap applies to stored Time Energy, not to the amount of idle time that can be simulated or to skill progression.

## Spending Time Energy: active 2× acceleration

Time Energy can be spent while the player is online to accelerate gameplay.

- The player can enable or disable acceleration with a toggle.
- When enabled and there is eligible game progression to advance, the simulation runs at **2× effective speed**.
- The additional simulated time is paid for with Time Energy at a **1:1 rate**: one second of Time Energy pays for one additional second of simulation.
- This is a simulation-speed increase, not a reward multiplier.
- Actions therefore complete in half the real time while acceleration is active. The game performs the normal action logic twice as often over the same real-time period, producing the corresponding additional completed actions and their normal rewards.
- Do not multiply action XP, skill XP, item output, resource yields, or other action results directly. Doing so would stack a reward multiplier on top of the faster simulation and produce more than the intended 2× effect.
- Offline simulation is never accelerated by this feature.

### When energy is consumed

Energy is consumed only while the additional simulation time is actually advancing eligible gameplay.

If there is nothing to accelerate, energy consumption pauses. For example, this can happen when:
- Combat has not yet been unlocked, and there are no companions selected for passive learning.
- Combat is paused and no companions are selected for passive learning.
- No other eligible progression is occurring.

The toggle may remain enabled during such a pause, but the player must not lose energy while no additional simulation time is being processed.

When the stored energy reaches zero, the game returns to normal speed automatically. It must not allow a negative balance.

## Zen skill

### Purpose and unlock

Zen is a skill focused on passive meditation during idle periods. It is unlocked only by purchasing the Zen Shop improvement described above, which itself requires Time Energy to have been unlocked first.

Zen is not automatically unlocked by purchasing Time Energy.

### Primary action: Meditate

Meditate is the primary action associated with Zen. It progresses passively whenever the player is idle, using the same qualifying idle-time determination as Time Energy.

The initial meditation cycle is:

| Property | Initial value |
| --- | --- |
| Cycle duration | 6 minutes |
| Time Energy associated with a completed offline cycle | 60 seconds |
| Mana cost | None |
| Preservation | None |
| Item output multiplier | Not applicable; Meditate does not directly output items |

The 6-minute cycle is fixed for the initial implementation. The design may later introduce ways to reduce its duration, but no reduction or modifier should be implemented initially.

### Meditation tiers and XP

The player can choose between different meditation targets/tiers. These are separate actions/tiers within the Zen skill, rather than one shared meditation level.

- Each meditation tier has its own action progression, including XP and level.
- The player selects which meditation tier to work on.
- Each completed Meditate cycle awards the selected tier its configured XP.
- A cycle awards XP only when it completes. Partial cycles do not award partial XP.
- Meditate itself has a base XP value and a cycle duration, and follows the normal skill/action progression conventions where applicable.
- There is no mana cost, no preservation mechanic, and no item output multiplier for Meditate.

### Relationship between Zen and Time Energy

The two systems use the same elapsed idle-time cycles, but their rewards are distinct:

- A completed 6-minute qualifying **offline** idle cycle contributes 60 seconds of Time Energy, subject to the 2-hour storage cap.
- A completed Meditate cycle awards XP to the currently selected meditation tier, whether the qualifying idle time occurs online or offline.
- **Online idle time can progress Zen meditation, but does not generate Time Energy.**
- If Time Energy is already at its cap, Zen meditation continues and awards XP normally. The cap must not block or pause skill progression.
- If the player has not unlocked Time Energy, neither Time Energy generation nor Zen is available. Zen additionally requires its own separate unlock.

Combat and passive companion learning can continue alongside Meditate. They are passive progression systems and do not occupy the active-action slot.

### Partial cycle progress

Meditation progress is persistent and must never be discarded merely because the player stops being idle.

For example, if the player meditates for 4 minutes and then starts an active action:
- The incomplete 4-minute cycle is retained.
- No meditation-tier XP is awarded yet.
- The active action progresses normally.
- The next time the player becomes idle, Meditate resumes from the remaining 2 minutes.
- On completion, the selected meditation tier receives the XP for one full cycle.

The same rule applies across online/offline transitions and across separate idle periods. Partial progress is retained, but partial cycles never award XP.

## Offline simulation and time accounting

Offline processing must account for the 24-hour offline-progress cap and divide the elapsed interval according to when active actions are actually progressing.

At a minimum, the simulation must correctly handle:
1. Time during which an active action progresses.
2. An active action completing partway through the offline interval.
3. An active action stopping because its required resources are exhausted.
4. The remaining interval becoming idle immediately after either of those events.
5. Passive Combat and passive companion learning continuing during idle intervals.
6. Time Energy generation during qualifying offline idle intervals, stopping at the storage cap.
7. Zen meditation cycle progress and completed-cycle XP during qualifying idle intervals, if Zen is unlocked.
8. Carrying incomplete meditation progress across active actions and future idle intervals.

Do not count the same elapsed time twice. Time Energy generation, Zen cycle advancement, Combat, companion learning, and active-action simulation should be coordinated against one consistent elapsed-time timeline.

The Time Energy cap must not cause the offline simulator to skip or shorten the remaining idle interval: it only prevents additional energy from being stored. Zen and other eligible passive systems may continue to progress.

## Persistence and state

The implementation should persist the relevant state so that closing and reopening the game does not lose progress.

At minimum, account for:
- Whether the Time Energy improvement has been purchased.
- The stored Time Energy amount, including fractional values.
- The player's 2× acceleration toggle preference, if that preference is intended to persist between sessions.
- Whether the Zen improvement has been purchased.
- The selected meditation tier.
- Each meditation tier's XP and level.
- Partial Meditate cycle progress.

Unlock state must be authoritative: a player who has not purchased an improvement must not gain access to its associated functionality through stale or malformed saved state.

## Research page UI

Time Energy should initially be displayed in a dedicated area on the **Research page**. Do not add it to the normal Bag or treat it as a regular inventory item.

The dedicated area should provide:
- Current stored Time Energy and the 2-hour cap.
- A visual representation of storage.
- The online 2× acceleration toggle.
- A concise explanation of how Time Energy is generated and spent.

Zen should appear as a skill only after its separate Shop improvement has been purchased. Its UI should expose the available meditation tiers, the selected tier, its progression/XP, and the current partial cycle progress in a way consistent with the existing skill and action interfaces.

## Explicit exclusions for the initial implementation

The following are intentionally out of scope:
- Generating Time Energy while the game is online.
- Generating Time Energy merely because the game is open and idle.
- Accelerating offline progression with stored Time Energy.
- Increasing action rewards or XP directly with a 2× reward multiplier.
- Increasing the 2-hour Time Energy storage cap.
- Reducing the 6-minute Meditate cycle duration.
- Unlocking Zen automatically with the Time Energy improvement.
- Adding any separate online-idle Time Energy improvement or alternate Time Energy skill.

## Implementation notes

Before implementation, inspect the existing action/tick simulation, offline-progress processing, passive Combat and companion progression, Shop improvement definitions, Research page layout, and player-state persistence.

Prefer integrating with the existing simulation and progression systems over creating a parallel timer or duplicating action/reward calculations. The implementation should preserve normal action behavior and use additional simulated time to achieve 2× speed.

This document describes the intended gameplay behavior. Exact code structure and UI placement details may be refined to fit the existing project architecture without changing the rules above.
