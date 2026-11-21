import { ArrowUpRight, Grip, Activity, AlertTriangle, AudioWaveform, BallWave, Book, BookAudio, BookDown, BookHeadphones, BookHeart, BookMinus, BookOpenText, BookPlus, BookText, BookUp, BookX, CheckCircle, CircleDollarSign, Coins, DollarSign, CircleDot, CirclePile, Cloud, CloudLightning, CloudRainWind, Compass, Droplet, Droplets, Earth, Eye, Feather, Flame, GraduationCap, Haze, Hourglass, Info, LayerArrowUp, Layers2, Merge, Mountain, MountainSnow, PawPrint, Recycle, Shell, ShoppingCart, Sparkles, Star, Stone, Swords, Tornado, WandSparkles, Waves, WavesArrowDown, Wind, WindArrowDown, WindArrowUp, X, XCircle, Scale, Zap, ClipboardList, ClipboardCheck, CircleFadingArrowUp, Circle, CircleChevronDown, CircleChevronUp, CircleChevronsDown, CircleChevronsUp, CircleDivide, CircleEllipsis, CircleEqual, CircleExclamationPoint, CircleLetterA, CircleLetterB, CircleLetterC, CircleLetterD, CircleLetterE, CircleLetterF, CircleLetterG, CircleLetterH, CircleLetterI, CircleLetterJ, Ellipsis } from "lucide-react";

export const OTHER_ICONS = {
    STAR: <Star />,
    CHECK_CIRCLE: <CheckCircle />,
    INFO: <Info />,
    ALERT_TRIANGLE: <AlertTriangle />,
    X_CIRCLE: <XCircle />,
    SPARKLES: <Sparkles />,
    CIRCLE_DOT: <CircleDot />,
    CLOSE: <X />,
    ARROW_UP_RIGHT: <ArrowUpRight />,
    GRIP: <Grip />,
    CIRCLE_DOLLAR_SIGN: <CircleDollarSign />,
    DOLLAR_SIGN: <DollarSign />,
    COINS: <Coins />,
    SHOPPING_CART: <ShoppingCart />,
    HOURGLASS: <Hourglass />,
    FLAME: <Flame />,
    RECYCLE: <Recycle />,
    MERGE: <Merge />,
    ZAP: <Zap />,
    MISSIONS: <ClipboardList />,
    MISSION_DONE: <ClipboardCheck />,
}

export const BAG_ICONS = {}

export const SHOP_ICONS = {
    IMPROVEMENTS: <CircleFadingArrowUp />,
    SKILLS_ACTIONS: <GraduationCap />,
    GENERAL_GOODS: <Coins />,
}

export const SKILL_ICONS = {
    RESEARCH: <BookOpenText />,
    SPELLCRAFT: <WandSparkles />,
    TRANSMUTATION: <Scale />,
    EXPLORATION: <Compass />,
    UNVEILING: <Eye />,
    COMBAT: <Swords />,
    COMPANIONS: <PawPrint />,
}

export const ELEMENT_ICONS = {
    ALL: <Ellipsis />,
    EARTH: <Mountain />,
    AIR: <Wind />,
    WATER: <Waves />
}

export const RESEARCH_ACTION_ICONS = [
    <Book />,
    <BookText />,
    <BookPlus />,
    <BookMinus />,
    <BookUp />,
    <BookDown />,
    <BookHeadphones />,
    <BookAudio />,
    <BookHeart />,
    <BookX />,
]

export const SPELLCRAFT_ACTION_ICONS = {
    EARTH: [
        <CirclePile />,
        <Stone />,
        <LayerArrowUp />,
        <MountainSnow />,
        <Activity />,
        <Mountain />,
        <Layers2 />,
        <Earth />,
    ],
    AIR: [
        <Wind />,
        <WindArrowDown />,
        <WindArrowUp />,
        <Cloud />,
        <Tornado />,
        <CloudLightning />,
        <Haze />,
        <Feather />,
    ],
    WATER: [
        <Droplet />,
        <Droplets />,
        <WavesArrowDown />,
        <AudioWaveform />,
        <Tornado />,
        <CloudRainWind />,
        <Shell />,
        <BallWave />,
    ]
}


export const TRANSMUTATION_ACTION_ICONS = [
    <CircleChevronsDown />,
    <CircleChevronDown />,
    <Circle />,
    <CircleDot />,
    <CircleChevronUp />,
    <CircleChevronsUp />,
    <CircleEqual />,
    <CircleExclamationPoint />,
    <CircleEllipsis />,
    <CircleDivide />,
]

export const TRANSMUTATION_ITEM_ICONS = [
    <CircleLetterA />,
    <CircleLetterB />,
    <CircleLetterC />,
    <CircleLetterD />,
    <CircleLetterE />,
    <CircleLetterF />,
    <CircleLetterG />,
    <CircleLetterH />,
    <CircleLetterI />,
    <CircleLetterJ />,
]


// Item artwork reuses the matching action-tier or elemental icons until dedicated
// item sprites are added. Keep IDs aligned with the items produced by each action.
export const ITEM_SPRITES = {
    // Research items
    "item:loose_notes": RESEARCH_ACTION_ICONS[0],
    "item:bound_notes": RESEARCH_ACTION_ICONS[1],
    "item:translated_scrolls": RESEARCH_ACTION_ICONS[2],
    "item:arcane_manuscript": RESEARCH_ACTION_ICONS[3],
    "item:sealed_grimoire": RESEARCH_ACTION_ICONS[4],
    "item:lost_archive_record": RESEARCH_ACTION_ICONS[5],
    "item:forgotten_texts": RESEARCH_ACTION_ICONS[6],
    "item:forbidden_codex": RESEARCH_ACTION_ICONS[7],
    "item:primordial_chronicle": RESEARCH_ACTION_ICONS[8],
    "item:genesis_testament": RESEARCH_ACTION_ICONS[9],

    // Spellcraft items
    "item:dust": SPELLCRAFT_ACTION_ICONS.EARTH[0],
    "item:breath": SPELLCRAFT_ACTION_ICONS.AIR[0],
    "item:droplet": SPELLCRAFT_ACTION_ICONS.WATER[0],
    "item:pebble": SPELLCRAFT_ACTION_ICONS.EARTH[1],
    "item:breeze": SPELLCRAFT_ACTION_ICONS.AIR[1],
    "item:ripple": SPELLCRAFT_ACTION_ICONS.WATER[1],
    "item:stone": SPELLCRAFT_ACTION_ICONS.EARTH[2],
    "item:gust": SPELLCRAFT_ACTION_ICONS.AIR[2],
    "item:stream": SPELLCRAFT_ACTION_ICONS.WATER[2],
    "item:shard": SPELLCRAFT_ACTION_ICONS.EARTH[3],
    "item:gale": SPELLCRAFT_ACTION_ICONS.AIR[3],
    "item:wave": SPELLCRAFT_ACTION_ICONS.WATER[3],
    "item:crystal": SPELLCRAFT_ACTION_ICONS.EARTH[4],
    "item:tempest": SPELLCRAFT_ACTION_ICONS.AIR[4],
    "item:torrent": SPELLCRAFT_ACTION_ICONS.WATER[4],
    "item:core": SPELLCRAFT_ACTION_ICONS.EARTH[5],
    "item:cyclone": SPELLCRAFT_ACTION_ICONS.AIR[5],
    "item:maelstrom": SPELLCRAFT_ACTION_ICONS.WATER[5],
    "item:mountain_heart": SPELLCRAFT_ACTION_ICONS.EARTH[6],
    "item:skycore": SPELLCRAFT_ACTION_ICONS.AIR[6],
    "item:abyssal_heart": SPELLCRAFT_ACTION_ICONS.WATER[6],
    "item:worldheart": SPELLCRAFT_ACTION_ICONS.EARTH[7],
    "item:firmament_core": SPELLCRAFT_ACTION_ICONS.AIR[7],
    "item:primordial_tide": SPELLCRAFT_ACTION_ICONS.WATER[7],

    // Transmutation catalysts use one letter icon per tier, shared across elements.
    "item:earth_catalyst_i": TRANSMUTATION_ITEM_ICONS[0],
    "item:air_catalyst_i": TRANSMUTATION_ITEM_ICONS[0],
    "item:water_catalyst_i": TRANSMUTATION_ITEM_ICONS[0],
    "item:earth_catalyst_ii": TRANSMUTATION_ITEM_ICONS[1],
    "item:air_catalyst_ii": TRANSMUTATION_ITEM_ICONS[1],
    "item:water_catalyst_ii": TRANSMUTATION_ITEM_ICONS[1],
    "item:earth_catalyst_iii": TRANSMUTATION_ITEM_ICONS[2],
    "item:air_catalyst_iii": TRANSMUTATION_ITEM_ICONS[2],
    "item:water_catalyst_iii": TRANSMUTATION_ITEM_ICONS[2],
    "item:earth_catalyst_iv": TRANSMUTATION_ITEM_ICONS[3],
    "item:air_catalyst_iv": TRANSMUTATION_ITEM_ICONS[3],
    "item:water_catalyst_iv": TRANSMUTATION_ITEM_ICONS[3],
    "item:earth_catalyst_v": TRANSMUTATION_ITEM_ICONS[4],
    "item:air_catalyst_v": TRANSMUTATION_ITEM_ICONS[4],
    "item:water_catalyst_v": TRANSMUTATION_ITEM_ICONS[4],
    "item:earth_catalyst_vi": TRANSMUTATION_ITEM_ICONS[5],
    "item:air_catalyst_vi": TRANSMUTATION_ITEM_ICONS[5],
    "item:water_catalyst_vi": TRANSMUTATION_ITEM_ICONS[5],
    "item:earth_catalyst_vii": TRANSMUTATION_ITEM_ICONS[6],
    "item:air_catalyst_vii": TRANSMUTATION_ITEM_ICONS[6],
    "item:water_catalyst_vii": TRANSMUTATION_ITEM_ICONS[6],
    "item:earth_catalyst_viii": TRANSMUTATION_ITEM_ICONS[7],
    "item:air_catalyst_viii": TRANSMUTATION_ITEM_ICONS[7],
    "item:water_catalyst_viii": TRANSMUTATION_ITEM_ICONS[7],
}
