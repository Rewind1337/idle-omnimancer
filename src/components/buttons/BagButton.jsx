import { OTHER_ICONS } from '../../data/iconLibrary'
import { Button } from '../Button'

export function BagButton({
    active = false,
    onClick
}) {
    return (
        <Button
            size="medium"
            variant="transmutation"
            checked={active}
            onClick={onClick}
            className="w-min"
            badge={"0 / 25"}
            badgeIcon={OTHER_ICONS.GRIP}
            icon={OTHER_ICONS.ARROW_UP_RIGHT}
        >
            Open Bag
        </Button>
    )
}