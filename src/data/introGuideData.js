// First-visit guide copy is separated from the shared modal presentation.
export const INTRO_GUIDE_DATA = {
    welcome: {
        title: "Welcome, Omnimancer",
        subtitle: "A guided tour of progression, action cards, the Shop, and Missions",
        variant: "research",
        steps: [
            { label: "Your workspace", title: "Start with the skill summary", description: "Each skill page begins with a summary of your progress. Skill Level and Skill XP show overall advancement, while the two progress bars show your next level and total skill progress." },
            { label: "Action cards", title: "Actions are the heart of progression", description: "Choose an action to work on. Its card shows its tier, level, XP, time, bonuses, progress, and the items it consumes or produces. Hover badges and items to inspect their details." },
            { label: "Shop & Missions", title: "Spend and earn with purpose", description: "The Shop is where you buy lasting improvements and unlock new skills or actions. Missions ask you to turn in items for Fame, which can be spent in the Fame Shop." },
        ],
    },
    "skill:research": {
        title: "Research Guide", subtitle: "Learn how Research actions and milestones build your account", variant: "research",
        steps: [
            { label: "Research", title: "Turn knowledge into progress", description: "Research actions produce notes and records. Unlock higher tiers by meeting their listed requirements, then keep an appropriate action running to build Action XP and Research Skill XP." },
            { label: "Skill milestones", title: "Prioritize important skill milestones", description: "Research Skill milestones unlock at specific Research levels. They can improve Research itself, another named skill, or every skill globally. Other skills have their own milestone tracks too, so check each summary and plan around useful unlocks." },
            { label: "Action milestones", title: "Each action has its own milestone track", description: "Action milestones are earned from that particular action's level, not from the overall Research level. They improve only the action that earns them, so a well-levelled action can remain valuable after its tier is unlocked." },
        ],
    },
    "skill:spellcraft": {
        title: "Spellcraft Guide", subtitle: "Create elemental materials and manage your Mana economy", variant: "spellcraft",
        steps: [
            { label: "Spellcraft", title: "Convert Mana into elemental materials", description: "Spellcraft actions create elemental essences and materials. Each spell has a Mana cost, and your Mana capacity and regeneration determine how often you can cast." },
            { label: "Milestones", title: "Build the right magical strengths", description: "Spellcraft milestones can improve Mana regeneration, capacity, action speed, and other skills. Inspect each milestone to see whether it affects this skill, another skill, or all skills." },
            { label: "Actions", title: "Compare costs, output, and progress", description: "An action card shows its tier, level, XP, progress, and resource output. Check its Mana cost and output before deciding which spell to keep active." },
        ],
    },
    "skill:transmutation": {
        title: "Transmutation Guide", subtitle: "Transform gathered materials into more valuable resources", variant: "transmutation",
        steps: [
            { label: "Transmutation", title: "Turn inputs into new materials", description: "Transmutation actions consume materials to create new resources. The input and output sections show the quantities involved, and output bonuses can grant additional items." },
            { label: "Milestones", title: "Preservation is valuable, but not unlimited", description: "Transmutation milestones can improve preservation, output, and action speed. Preservation gives a chance to keep consumed inputs; it is a chance, not a guarantee, so review the combined percentage." },
            { label: "Actions", title: "Check the recipe before starting", description: "Read the Consumes and Produces sections before starting an action. Item tooltips reveal the tier and other details of each material." },
        ],
    },
    "skill:exploration": {
        title: "Exploration Guide", subtitle: "Open new areas and gather the materials found there", variant: "exploration",
        steps: [
            { label: "Exploration", title: "Explore the world one area at a time", description: "Exploration unlocks areas and produces local resources. Each area has a tier, an element, and its own rewards. New areas also create opportunities to find companions and artifacts." },
            { label: "Milestones", title: "Improve your expeditions", description: "Exploration milestones can improve action speed, output, companion discovery, and other skills. Some Exploration action progression also influences artifact discovery in Combat." },
            { label: "Actions", title: "Choose areas that support your goals", description: "Compare area requirements and rewards before unlocking the next expedition. Use resource tooltips to see which materials an area can provide." },
        ],
    },
    "skill:unveiling": {
        title: "Unveiling Guide", subtitle: "Identify mysterious finds and learn what they contain", variant: "unveiling",
        steps: [
            { label: "Unveiling", title: "Reveal the identity of mysterious items", description: "Unveiling actions examine unidentified finds and reveal their true item. Some discoveries have level requirements, so keep improving Unveiling to access the full collection." },
            { label: "Milestones", title: "Invest in speed and preservation", description: "Unveiling milestones improve the pace and efficiency of examining finds. Higher skill levels can also support other skills, so check the milestone list for cross-skill effects." },
            { label: "Actions", title: "Select eligible materials carefully", description: "Some actions let you choose which held item to use. The picker is restricted by the action's configured types and tier range, and shows what you currently qualify to unveil." },
        ],
    },
    "skill:companions": {
        title: "Companions Guide", subtitle: "Collect companions, train them, and choose active effects", variant: "companions",
        steps: [
            { label: "Companions", title: "Build your collection", description: "Companions are discovered through their containers. Each companion has a permanent effect, while companions placed in active slots also contribute their active effect." },
            { label: "Milestones", title: "Training strengthens your team", description: "Companion levels improve the effects they grant. The Companion Skill also has milestones that can strengthen companions or improve other parts of your progression." },
            { label: "Actions", title: "Choose who occupies each slot", description: "Active slots are limited and can be unlocked over time. Consider the target skill shown on each active effect, then assign companions to support the activities you are focusing on." },
        ],
    },
    "skill:combat": {
        title: "Combat Guide", subtitle: "Fight through explored areas and earn valuable discoveries", variant: "combat",
        steps: [
            { label: "Combat", title: "Fight in areas you have explored", description: "Combat encounters use the area you select and your configured ability rotation. Defeating enemies grants rewards and can uncover unidentified artifacts tied to that area." },
            { label: "Milestones", title: "Balance offence and survival", description: "Combat milestones can strengthen damage, health, shields, and combat pace. Other skills can also support Combat, so check cross-skill milestone and action-effect tooltips." },
            { label: "Actions", title: "Tune your rotation and area", description: "Choose abilities that suit the encounter and keep an eye on enemy strength. Artifact discovery is a chance-based reward; Unveiling identifies what you find afterward." },
        ],
    },
    shop: {
        title: "Shop Guide", subtitle: "Spend Coins and Fame on improvements, unlocks, and goods", variant: "shop",
        steps: [
            { label: "Shop tabs", title: "The Shop has separate categories", description: "Improvements contains permanent upgrades, Skills & Actions lists available unlocks, General Goods contains repeatable purchases, and Fame Shop opens the reward catalogue paid for with Fame." },
            { label: "Improvements", title: "Invest in lasting account upgrades", description: "Research Breakthroughs improve Research rewards, while additional Bag Slots expand how many different item stacks you can hold. Their costs are shown before you purchase." },
            { label: "Skills & Goods", title: "Unlock new ways to progress", description: "Skills & Actions lists the next eligible skill or action unlock and its requirements. General Goods provides repeatable purchases, while Fame Shop offers rewards earned through Missions." },
        ],
    },
    missions: {
        title: "Missions Guide", subtitle: "Turn in gathered items to earn Fame and unlock rewards", variant: "secondary",
        steps: [
            { label: "Missions", title: "Complete requests using collected items", description: "Each mission asks for one or more item quantities. The requirement row compares your held amount with the amount requested, so you can see how close you are to completing it." },
            { label: "Fame", title: "Earn Fame and advance mission tiers", description: "Turning in a mission grants its listed rewards, usually Fame. Complete enough missions in the current tier to unlock the next tier, where requests pay more Fame." },
            { label: "Rewards", title: "Use Fame in the Fame Shop", description: "Fame is separate from Coins. Spend it in the Shop's Fame Shop tab on special rewards." },
        ],
    },
}
