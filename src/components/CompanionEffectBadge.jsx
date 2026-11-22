import { Badge } from "./Badge"
import { EffectStack, formatEffectDescription } from "./EffectStack"
import { Flex } from "./Flex"
import { Heading } from "./Heading"
import { Text } from "./Text"

import { EFFECT_ICONS, OTHER_ICONS } from "../data/iconLibrary"
import { getCompanionEffectEntry } from "../game/gameEngine"
import { humanize } from "../utility/helpers"
import { SKILL_NAVIGATION } from "../data/navigationData"

export function CompanionEffectBadge({
    companion,
    player,
    effectKey,
    size = "small",
    variant = "companions",
    showScopeLabel = true,
}) {
    const entry = getCompanionEffectEntry(player, companion, effectKey)
    if (!entry) return null

    const isPermanent = effectKey === "permanentEffect"
    const effectIcon = EFFECT_ICONS[entry.effect] ?? OTHER_ICONS.INFO
    const effectScope = isPermanent
        ? "This effect applies globally while this companion is unlocked."
        : "This effect applies to " +
            (SKILL_NAVIGATION.find(entry => entry.skillId === companion.activeEffect.targetSkillId)?.name ??
                humanize(companion.activeEffect.targetSkillId.replace(/^skill:/, ""))) +
            " while this companion is assigned to an active slot."

    return (
        <Badge
            size={size}
            variant={variant}
            interactive
            icon={effectIcon}
            tooltip={
                <Flex direction="column" gap={8}>
                    <Heading h="4" className="w-100 align-center">
                        {isPermanent ? "Permanent Effect" : "Active-only Effect"}
                    </Heading>
                    <Text size="small">{effectScope}</Text>
                    <hr />
                    <EffectStack
                        title={isPermanent ? "Permanent Effect" : "Active Effect"}
                        icon={effectIcon}
                        entries={[entry]}
                    />
                </Flex>
            }
        >
            {showScopeLabel ? (isPermanent ? "Permanent · " : "Active · ") : ""}
            {formatEffectDescription(entry)}
        </Badge>
    )
}
