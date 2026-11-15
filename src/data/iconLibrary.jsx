import { Activity, AlertTriangle, AudioWaveform, BallWave, Book, BookAudio, BookDown, BookHeadphones, BookHeart, BookMinus, BookOpenText, BookPlus, BookText, BookUp, BookX, CheckCircle, CircleDot, CirclePile, Cloud, CloudLightning, CloudRainWind, Compass, Droplet, Droplets, Earth, Eye, Feather, FlaskConical, GraduationCap, Haze, Info, LayerArrowUp, Layers2, Mountain, MountainSnow, PawPrint, Shell, Sparkles, Star, Stone, Swords, Tornado, WandSparkles, Waves, WavesArrowDown, Wind, WindArrowDown, WindArrowUp, X, XCircle } from "lucide-react";

export const OTHER_ICONS = {
    STAR: <Star />,
    GRADUATION_CAP: <GraduationCap />,
    CHECK_CIRCLE: <CheckCircle />,
    INFO: <Info />,
    ALERT_TRIANGLE: <AlertTriangle />,
    X_CIRCLE: <XCircle />,
    SPARKLES: <Sparkles />,
    CIRCLE_DOT: <CircleDot />,
    CLOSE: <X />,
}

export const SKILL_ICONS = {
    RESEARCH: <BookOpenText />,
    SPELLCRAFT: <WandSparkles />,
    TRANSMUTATION: <FlaskConical />,
    EXPLORATION: <Compass />,
    UNVEILING: <Eye />,
    COMBAT: <Swords />,
    COMPANIONS: <PawPrint />,
}

export const ELEMENT_ICONS = {
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