import { OTHER_ICONS } from '../../data/iconLibrary'
import { useGame } from '../../hooks/useGame'
import { Button } from '../Button'

const formatCoins = (value) => {
    const amount = Math.max(0, Number(value) || 0)
    const units = [
        { threshold: 1e9, suffix: "Bil" },
        { threshold: 1e6, suffix: "Mil" },
        { threshold: 1e3, suffix: "K" },
    ]
    const unit = units.find(({ threshold }) => amount >= threshold)
    if (!unit) return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(amount)
    const formatted = (amount / unit.threshold).toFixed(2).replace(/\.?0+$/, "")
    return `${formatted} ${unit.suffix}`
}

export function ShopButton({ active = false, onClick }) {
    const { player } = useGame()
    return (
        <Button
            size="medium"
            variant="shop"
            className="w-min"
            badge={formatCoins(player.currencies.coins)}
            badgeIcon={OTHER_ICONS.DOLLAR_SIGN}
            icon={OTHER_ICONS.CIRCLE_DOLLAR_SIGN}
            checked={active}
            onClick={onClick}
        >
            Visit Shop
        </Button>
    )
}
