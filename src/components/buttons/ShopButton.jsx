import { OTHER_ICONS } from '../../data/iconLibrary'
import { Button } from '../Button'

export function ShopButton({
    active = false,
    onClick
}) {
    return (
        <Button
            size="medium"
            variant="shop"
            className="w-min"
            badge={"7.12 Mil"}
            badgeIcon={OTHER_ICONS.DOLLAR_SIGN}
            icon={OTHER_ICONS.CIRCLE_DOLLAR_SIGN}
            checked={active}
            onClick={onClick}
        >
            Visit Shop
        </Button>
    )
}