import { cloneElement, useEffect, useState } from "react"

import { Modal } from "../Modal"
import { Flex } from "../Flex"
import { Paper } from "../Paper"
import { Heading } from "../Heading"
import { Text } from "../Text"
import { Button } from "../Button"
import { Badge } from "../Badge"
import { Icon } from "../Icon"
import { Progress } from "../Progress"
import { SkillSummary } from "../skills/SkillSummary"
import { ActionHeader } from "../actions/ActionHeader"
import { ActionResources } from "../actions/ActionResources"

import { INTRO_GUIDE_DATA } from "../../data/introGuideData"
import { SKILL_NAVIGATION } from "../../data/navigationData"
import { SKILL_CONFIG_BY_ID, getActionXPTable } from "../../data/skillConfig"
import { MISSION_DATA } from "../../data/missionData"
import { EFFECT_ICONS, OTHER_ICONS, SHOP_ICONS } from "../../data/iconLibrary"
import { humanize } from "../../utility/helpers"

import "./IntroGuideModal.scss"

const PLACEHOLDER_SKILL_PROGRESS = {
    level: 4,
    xp: 42,
    neededXP: 80,
    totalXP: 342,
    maxXP: 1500,
}

const formatEffectValue = milestone => {
    if (milestone.type === "flat") return (milestone.value > 0 ? "+" : "") + milestone.value + " flat"
    if (milestone.effect === "preservation") return "+" + ((milestone.value - 1) * 100).toFixed(2) + " percentage points"
    if (["manaCost", "unlockCostReduction", "combatInterval"].includes(milestone.effect) && milestone.value < 1) {
        return ((1 - milestone.value) * 100).toFixed(2) + "% reduction"
    }
    return "+" + ((milestone.value - 1) * 100).toFixed(2) + "%"
}

const getReachLabel = reach => {
    if (reach === "global") return "All skills"
    if (reach === "local") return "This skill"
    return SKILL_NAVIGATION.find(entry => entry.skillId === reach)?.name ?? reach
}

function SkillSummaryPreview({ skillId, variant }) {
    const navigationEntry = SKILL_NAVIGATION.find(entry => entry.skillId === skillId)
    return (
        <SkillSummary
            skillId={skillId}
            title={navigationEntry?.name ?? "Research"}
            skillProgress={PLACEHOLDER_SKILL_PROGRESS}
            variant={variant}
            icon={<Icon size={64} variant={variant}>{cloneElement(navigationEntry?.icon ?? OTHER_ICONS.SPARKLES, { size: 48 })}</Icon>}
            milestones={[]}
            progressionMilestones={[]}
            skillXPTooltip="Example Skill XP. Your real total changes as actions gain levels."
        />
    )
}

function BadgeGlossary() {
    const entries = [
        { label: "Skill Level", icon: OTHER_ICONS.STAR, detail: "Your overall level in this skill. Skill levels come from the combined levels of its actions." },
        { label: "Skill XP", icon: OTHER_ICONS.SPARKLES, detail: "Progress toward the next Skill Level. Its tooltip also shows the next level requirement." },
        { label: "Action Tier", icon: OTHER_ICONS.MERGE, detail: "The tier of this action and the resources or rewards associated with it." },
        { label: "Action Level", icon: OTHER_ICONS.STAR, detail: "The level of this one action. Its milestones are tracked separately from the skill." },
        { label: "Action XP", icon: OTHER_ICONS.SPARKLES, detail: "Progress toward the next level of this action." },
        { label: "Action Speed", icon: EFFECT_ICONS.actionTime, detail: "How quickly the action completes. More action speed means less time per cycle." },
        { label: "Preservation", icon: EFFECT_ICONS.preservation, detail: "A chance to avoid consuming input items when an action completes." },
        { label: "Item Output", icon: EFFECT_ICONS.itemOutput, detail: "A multiplier applied to items produced. Fractional output is rolled over time." },
    ]
    return (
        <Flex direction="row" wrap gap={8} className="intro-guide-badge-glossary">
            {entries.map(entry => (
                <Badge key={entry.label} variant="research" icon={entry.icon} interactive tooltip={<Text size="small">{entry.detail}</Text>}>
                    {entry.label}
                </Badge>
            ))}
        </Flex>
    )
}

function SampleActionDemo({ skillId, variant, action }) {
    const [progress, setProgress] = useState(54)
    const actionXPTable = getActionXPTable(action.id) ?? []
    const neededXP = actionXPTable[2]?.neededXP ?? actionXPTable[0]?.neededXP ?? 12
    const currentXP = Math.round(neededXP * 0.42)
    const actionName = action.name ?? humanize(action.id.replace(/^action:/, ""))
    const outputItems = action.produces ?? []
    const inputItems = action.consumes ?? []

    return (
        <Paper layer={1} variant={variant} className="intro-guide-action-demo">
            <Flex direction="column" gap={12}>
                <Flex direction="row" align="center" gap={12}>
                    <Icon size={48} variant={variant}>
                        {cloneElement(SKILL_NAVIGATION.find(entry => entry.skillId === skillId)?.icon ?? OTHER_ICONS.SPARKLES, { size: 40 })}
                    </Icon>
                    <Flex direction="column" gap={8}>
                        <ActionHeader
                            name={actionName}
                            tier={action.tier ?? 1}
                            level={3}
                            isUnlocked
                            currentXP={currentXP}
                            neededXP={neededXP}
                            actionXPTable={actionXPTable}
                            actionMilestones={[]}
                        />
                        <Flex direction="row" wrap gap={6} className="intro-guide-action-effects">
                            <Badge variant={variant} icon={EFFECT_ICONS.actionTime} interactive tooltip="Example bonus: this action completes faster.">Action Speed ×1.10</Badge>
                            <Badge variant={variant} icon={EFFECT_ICONS.preservation} interactive tooltip="Example bonus: a small chance to keep consumed inputs.">Preservation 3%</Badge>
                            <Badge variant={variant} icon={EFFECT_ICONS.itemOutput} interactive tooltip="Example bonus: the action may produce additional items.">Item Output ×1.25</Badge>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex direction="column" gap={6}>
                    <Flex direction="row" align="center" justify="space-between">
                        <Heading h="4">Action progress</Heading>
                        <Text size="small" tabularNums>{progress}%</Text>
                    </Flex>
                    <Progress variant={variant} percentage={progress} size="small" corners="rounded" animated label={progress + "%"} />
                    <Flex direction="row" wrap gap={8}>
                        <Button variant={variant} size="small" onClick={() => setProgress(value => value >= 100 ? 0 : Math.min(100, value + 16))}>Advance sample</Button>
                        <Button variant="secondary" size="small" onClick={() => setProgress(0)}>Reset sample</Button>
                    </Flex>
                </Flex>
                <Flex direction="row" wrap gap={8} className="intro-guide-resource-demo">
                    {inputItems.length > 0
                        ? <ActionResources consumes={inputItems} />
                        : <Paper layer={2} className="intro-guide-resource-note"><Heading h="4">Consumes</Heading><Text size="small">This example action has no input requirement.</Text></Paper>}
                    {outputItems.length > 0
                        ? <ActionResources produces={outputItems} />
                        : <Paper layer={2} className="intro-guide-resource-note"><Heading h="4">Produces</Heading><Text size="small">This action does not produce a bag item.</Text></Paper>}
                </Flex>
            </Flex>
        </Paper>
    )
}

function MilestoneList({ skillId, variant }) {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    const skillMilestones = skill?.milestones ?? []
    const actionMilestones = skill?.actionMilestones ?? []

    return (
        <Flex direction="column" gap={12}>
            <Paper layer={1} variant={variant}>
                <Flex direction="column" gap={8}>
                    <Heading h="3">Skill milestones</Heading>
                    <Text size="small">These belong to the skill as a whole. Their effects can apply locally, to another skill, or globally.</Text>
                    {skillMilestones.length > 0 ? skillMilestones.map((milestone, index) => (
                        <Paper key={"skill-milestone-" + index} layer={2} className="intro-guide-milestone">
                            <Flex direction="row" wrap justify="space-between" align="center" gap={8}>
                                <Badge variant={variant}>Skill Level {milestone.level}</Badge>
                                <Badge variant={variant} icon={EFFECT_ICONS[milestone.effect]}>{humanize(milestone.effect)}</Badge>
                            </Flex>
                            <Text size="small">{formatEffectValue(milestone)} · Applies to {getReachLabel(milestone.reach)}</Text>
                        </Paper>
                    )) : <Text size="small">This skill has no configured skill-level milestones yet.</Text>}
                </Flex>
            </Paper>
            <Paper layer={1} variant={variant}>
                <Flex direction="column" gap={8}>
                    <Heading h="3">Action milestones</Heading>
                    <Text size="small">These are earned by each individual action. They improve only the action that earns them.</Text>
                    {actionMilestones.length > 0 ? actionMilestones.map((milestone, index) => (
                        <Paper key={"action-milestone-" + index} layer={2} className="intro-guide-milestone">
                            <Flex direction="row" wrap justify="space-between" align="center" gap={8}>
                                <Badge variant={variant}>{milestone.levels === 1 ? "Each Action Level" : "Every " + milestone.levels + " Action Levels"}</Badge>
                                <Badge variant={variant} icon={EFFECT_ICONS[milestone.effect]}>{humanize(milestone.effect)}</Badge>
                            </Flex>
                            <Text size="small">{formatEffectValue(milestone)}{milestone.reach ? " · Applies to " + getReachLabel(milestone.reach) : " · This action only"}</Text>
                        </Paper>
                    )) : <Text size="small">This skill has no configured action milestones yet.</Text>}
                </Flex>
            </Paper>
        </Flex>
    )
}

function WelcomeOverview() {
    return (
        <Flex direction="column" gap={16}>
            <Text>Think of each skill as its own progression system. Your skill summary tracks overall progress, while action cards show the work that produces resources and advances those skills.</Text>
            <SkillSummaryPreview skillId="skill:research" variant="research" />
            <Paper layer={1} variant="research">
                <Heading h="3">What the summary and action badges mean</Heading>
                <Text size="small">Hover each badge to see its explanation. The numbers shown in this guide are examples, not your saved progress.</Text>
                <BadgeGlossary />
            </Paper>
        </Flex>
    )
}

function WelcomeActions() {
    const research = SKILL_CONFIG_BY_ID["skill:research"]
    const sampleAction = research.actions.find(action => action.id === "action:read_books") ?? research.actions[0]
    return (
        <Flex direction="column" gap={16}>
            <Text>Every action card follows the same pattern. Its header identifies the action and tier, badges summarize levels and bonuses, and the progress bar fills as the action cycle completes.</Text>
            <SampleActionDemo skillId="skill:research" variant="research" action={sampleAction} />
            <Paper layer={1} variant="research">
                <Heading h="3">A later Research action can consume earlier notes</Heading>
                <Text size="small">The first Research action only produces notes. Higher actions can consume those earlier notes to create advanced records. Hover the items to inspect them.</Text>
                <ActionResources consumes={[{ item: "item:loose_notes", amount: 100 }]} produces={[{ item: "item:bound_notes", amount: 1 }]} />
            </Paper>
        </Flex>
    )
}

function ShopAndMissionsOverview() {
    const firstMission = MISSION_DATA.missions[0]
    return (
        <Flex direction="row" wrap gap={12} className="intro-guide-two-column">
            <Paper layer={1} variant="shop" className="intro-guide-overview-card">
                <Flex direction="column" gap={8}>
                    <Flex direction="row" align="center" gap={8}>
                        <Icon size={28} variant="shop">{SHOP_ICONS.IMPROVEMENTS}</Icon>
                        <Heading h="3">Shop</Heading>
                    </Flex>
                    <Text size="small">Use Coins to buy improvements, unlock skills and actions, and purchase general goods. The Shop has separate tabs and a Fame Shop for special rewards.</Text>
                    <Badge variant="shop">Improvements</Badge>
                    <Badge variant="shop">Skills & Actions</Badge>
                    <Badge variant="shop">General Goods</Badge>
                    <Badge variant="secondary">Fame Shop</Badge>
                </Flex>
            </Paper>
            <Paper layer={1} variant="secondary" className="intro-guide-overview-card">
                <Flex direction="column" gap={8}>
                    <Flex direction="row" align="center" gap={8}>
                        <Icon size={28} variant="secondary">{OTHER_ICONS.MISSIONS}</Icon>
                        <Heading h="3">Missions</Heading>
                    </Flex>
                    <Text size="small">Missions turn surplus items into Fame. Complete enough of the current tier to unlock higher tiers and larger Fame rewards.</Text>
                    {firstMission && <Paper layer={2}>
                        <Heading h="4">{firstMission.title}</Heading>
                        <Text size="small">{firstMission.description}</Text>
                        <Badge variant="secondary">Tier {firstMission.tier}</Badge>
                    </Paper>}
                </Flex>
            </Paper>
        </Flex>
    )
}

function ShopGuideStep({ step }) {
    if (step === 1) return (
        <Flex direction="column" gap={12}>
            <Paper layer={1} variant="shop">
                <Heading h="3">Improvements</Heading>
                <Text size="small">Research Breakthroughs strengthen Research rewards. Additional Bag Slots increase the number of different item stacks you can hold.</Text>
                <Flex direction="row" wrap gap={8}>
                    <Badge variant="shop" icon={OTHER_ICONS.FLAME}>Research Breakthrough</Badge>
                    <Badge variant="shop" icon={OTHER_ICONS.GRIP}>Additional Bag Slot</Badge>
                </Flex>
            </Paper>
            <Text>Read the cost displayed on each purchase before buying. Bag capacity is about the number of distinct item stacks, not the total quantity inside those stacks.</Text>
        </Flex>
    )
    if (step === 2) return (
        <Flex direction="column" gap={12}>
            <Paper layer={1} variant="shop">
                <Heading h="3">Skills & Actions</Heading>
                <Text size="small">Unlocking a skill opens a new progression page. Unlocking an action adds another tier or activity within a skill. Requirements are shown as item and currency costs.</Text>
                <ActionResources requires={[{ item: "item:loose_notes", amount: 100 }, { item: "currency:coins", amount: 10 }]} />
            </Paper>
            <Paper layer={1} variant="secondary">
                <Heading h="3">General Goods and Fame Shop</Heading>
                <Text size="small">General Goods contains direct item purchases. Fame Shop uses Fame, which is earned from completed Missions rather than ordinary action rewards.</Text>
            </Paper>
        </Flex>
    )
    return <ShopAndMissionsOverview />
}

function MissionGuideStep({ step }) {
    const mission = MISSION_DATA.missions[0]
    const objective = mission?.objective
    const requirements = objective?.items ?? (objective?.item ? [{ item: objective.item, amount: objective.amount }] : [])
    const fameReward = (mission?.rewards ?? []).filter(reward => reward.currency === "currency:fame").reduce((sum, reward) => sum + reward.amount, 0)

    if (step === 0) return (
        <Flex direction="column" gap={12}>
            <Text>Each mission requests items you already know how to gather or produce. Its requirement row compares your current amount with the amount requested.</Text>
            {mission && <Paper layer={1} variant="secondary">
                <Flex direction="row" justify="space-between" wrap align="center" gap={8}>
                    <Heading h="3">{mission.title}</Heading>
                    <Badge variant="secondary">Tier {mission.tier}</Badge>
                </Flex>
                <Text size="small">{mission.description}</Text>
                <ActionResources requires={requirements.map(entry => ({ item: entry.item, amountLabel: "40 / " + entry.amount.toLocaleString() }))} />
                <Progress variant="secondary" size="small" corners="rounded" percentage={40} animated label="Example requirement progress" />
            </Paper>}
        </Flex>
    )

    if (step === 1) return (
        <Flex direction="column" gap={12}>
            <Text>Turn in a completed mission to receive its listed rewards. Completing enough missions in the current tier advances the mission tier, which increases the Fame offered by later requests.</Text>
            <Paper layer={1} variant="secondary">
                <Heading h="3">Example reward</Heading>
                <Flex direction="row" wrap gap={8}>
                    <Badge variant="secondary" icon={OTHER_ICONS.STAR}>+{fameReward} Fame</Badge>
                    <Badge variant="secondary">Mission Tier {mission?.tier ?? 1}</Badge>
                </Flex>
            </Paper>
        </Flex>
    )

    return (
        <Flex direction="column" gap={12}>
            <Text>Fame is spent separately from Coins. Open the Shop, select the Fame Shop tab, and compare its rewards with the Fame you have earned through Missions.</Text>
            <Paper layer={1} variant="shop">
                <Flex direction="row" align="center" gap={8}>
                    <Icon size={32} variant="shop">{SHOP_ICONS.GENERAL_GOODS}</Icon>
                    <Flex direction="column" gap={2}>
                        <Heading h="3">Fame Shop</Heading>
                        <Text size="small">Special rewards purchased using Fame</Text>
                    </Flex>
                </Flex>
            </Paper>
        </Flex>
    )
}

function SkillGuideStep({ guideId, step, guide }) {
    const skill = SKILL_CONFIG_BY_ID[guideId]
    const navigationEntry = SKILL_NAVIGATION.find(entry => entry.skillId === guideId)
    const action = skill?.actions?.[0]
    if (step === 0) return (
        <Flex direction="column" gap={12}>
            <Text>{guide.steps[0].description}</Text>
            <SkillSummaryPreview skillId={guideId} variant={guide.variant} />
        </Flex>
    )
    if (step === 1) return (
        <Flex direction="column" gap={12}>
            <Text>{guide.steps[1].description}</Text>
            {guideId === "skill:research" && <Paper layer={1} variant="research">
                <Heading h="3">How to prioritize progression</Heading>
                <Text size="small">Research is only one milestone track. Spellcraft, Transmutation, Exploration, Unveiling, Companions, and Combat each have their own milestones. Check their level requirements and prioritize milestones that improve the skills or actions you use most.</Text>
            </Paper>}
            <MilestoneList skillId={guideId} variant={guide.variant} />
        </Flex>
    )
    if (!action || !skill || !navigationEntry) return null
    return (
        <Flex direction="column" gap={12}>
            <Text>{guide.steps[2].description}</Text>
            <SampleActionDemo skillId={guideId} variant={guide.variant} action={action} />
        </Flex>
    )
}

function GuideContent({ guideId, step, guide }) {
    if (guideId === "welcome") return step === 0 ? <WelcomeOverview /> : step === 1 ? <WelcomeActions /> : <ShopAndMissionsOverview />
    if (guideId === "shop") return <ShopGuideStep step={step} />
    if (guideId === "missions") return <MissionGuideStep step={step} />
    return <SkillGuideStep guideId={guideId} step={step} guide={guide} />
}

export function IntroGuideModal({ guideId, onClose }) {
    const [step, setStep] = useState(0)
    const guide = INTRO_GUIDE_DATA[guideId] ?? INTRO_GUIDE_DATA.welcome
    const totalSteps = guide.steps.length
    const currentStep = Math.min(step, totalSteps - 1)

    useEffect(() => {
        setStep(0)
    }, [guideId])

    return (
        <Modal
            visible={Boolean(guideId)}
            variant={guide.variant}
            className="intro-guide-modal"
            padding={16}
            header={
                <Flex direction="row" justify="space-between" align="center" wrap gap={12}>
                    <Flex direction="column" gap={4}>
                        <Heading h="1">{guide.title}</Heading>
                        <Text size="small">{guide.subtitle}</Text>
                    </Flex>
                    <Badge variant={guide.variant}>{currentStep + 1} / {totalSteps}</Badge>
                </Flex>
            }
            content={
                <Flex direction="column" gap={16} className="intro-guide-scroll">
                    <Flex direction="row" wrap gap={6} className="intro-guide-step-tabs">
                        {guide.steps.map((entry, index) => (
                            <Button key={entry.label} variant={guide.variant} size="small" checked={index === currentStep} onClick={() => setStep(index)}>
                                {index + 1}. {entry.label}
                            </Button>
                        ))}
                    </Flex>
                    <Paper layer={1} className="intro-guide-step" key={guideId + "-" + currentStep}>
                        <Flex direction="column" gap={12}>
                            <Heading h="2">{guide.steps[currentStep].title}</Heading>
                            <GuideContent guideId={guideId} step={currentStep} guide={guide} />
                        </Flex>
                    </Paper>
                </Flex>
            }
            footer={
                <Flex direction="row" justify="space-between" align="center" wrap gap={8}>
                    <Button variant="secondary" disabled={currentStep === 0} onClick={() => setStep(value => Math.max(0, value - 1))}>Previous</Button>
                    <Flex direction="row" align="center" gap={8}>
                        <Button variant="secondary" onClick={onClose}>Close Guide</Button>
                        <Button variant={guide.variant} onClick={() => currentStep === totalSteps - 1 ? onClose() : setStep(value => Math.min(totalSteps - 1, value + 1))}>
                            {currentStep === totalSteps - 1 ? "Finish" : "Next"}
                        </Button>
                    </Flex>
                </Flex>
            }
        />
    )
}
