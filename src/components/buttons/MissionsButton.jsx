import { OTHER_ICONS } from "../../data/iconLibrary"
import { Button } from "../Button"

export function MissionsButton({ active = false, onClick }) {
    return (
        <Button
            size="medium"
            variant="primary"
            className="w-min"
            checked={active}
            icon={OTHER_ICONS.STAR}
            onClick={onClick}
        >
            Missions
        </Button>
    )
}
