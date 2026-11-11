import { ArrowUpRight, CircleDollarSign, GraduationCap, MapPin } from "lucide-react"
import { Badge } from "../components/Badge"
import { Button } from "../components/Button"
import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"

/* Temp stuff for showcasing */
const VARIANTS = ["primary", "secondary", "primal", "life", "death", "research", "spellcraft", "transmutation"]
const ICONS = [<MapPin />, <CircleDollarSign />, <ArrowUpRight />, <GraduationCap />]

function Showcase() {
  return (
    <Paper layer={1}>
      <h2>Showcase - Paper Layer 1</h2>
      <Flex direction="column">
        <Paper layer={2}>
          <h3>Buttons /w sizes and variants - Paper Layer 2</h3>
          <Flex wrap={true}>
            {VARIANTS.map((variant, index) => <>
              <Button size="large" key={variant + "-large"} variant={variant} icon={ICONS[index%4]}>{variant.toLowerCase()}</Button>
              <Button size="medium" key={variant + "-med"} variant={variant} icon={ICONS[index%4]}>{variant.toLowerCase()}</Button>
              <Button size="small" key={variant + "-smol"} variant={variant} icon={ICONS[index%4]}>{variant.toLowerCase()}</Button>
              <hr/>
            </>
            )}
            <Button size="large" key={"disabled-large"} variant={"primary"} icon={ICONS[3]} disabled={true}>Disabled</Button>
            <Button size="medium" key={"disabled-med"} variant={"primary"} icon={ICONS[3]} disabled={true}>Disabled</Button>
            <Button size="small" key={"disabled-smol"} variant={"primary"} icon={ICONS[3]} disabled={true}>Disabled</Button>
          </Flex>
        </Paper>
        <Paper layer={2}>
          <h3>Badges (half are 'interactive')</h3>
          <Flex wrap={true} padding={8} gap={16}>
            {VARIANTS.map((variant, index) =>
              <Badge interactive={index%2} key={variant} variant={variant} icon={ICONS[index%4]}>{variant.toLowerCase()}</Badge>
            )}
          </Flex>
        </Paper>
      </Flex>
    </Paper>
  )
}

export function DevelopmentPage() {
  return (
    <Flex direction="column">
        <Paper layer={0}>
          <h1>Dev Playground - Paper Layer 0</h1>
          <Showcase/>
        </Paper>
    </Flex>
  )
}