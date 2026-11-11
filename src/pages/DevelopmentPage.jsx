import { BookOpenText, Scale, WandSparkles, Star, ArrowUpRight, CircleDollarSign, GraduationCap, MapPin } from "lucide-react"
import { Badge } from "../components/Badge"
import { Button } from "../components/Button"
import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"
import { Grid } from "../components/Grid"

/* Temp stuff for showcasing */
const VARIANTS = ["primary", "secondary", "earth", "air", "water", "research", "spellcraft", "transmutation", "primal", "life", "death"]
const ICONS = [<BookOpenText/>, <Scale/>, <WandSparkles/>, <Star/>, <MapPin />, <CircleDollarSign />, <ArrowUpRight />, <GraduationCap />]

function Showcase() {
  return (
    <Paper layer={1}>
      <h2>Showcase - Paper Layer 1</h2>
      <Flex direction="column">
        <Paper layer={2}>
          <Flex wrap={true} padding={8} gap={16}>
            <h1 className="flex-grow w-min">Heading 1</h1>
            <h2 className="flex-grow w-min">Heading 2</h2>
            <h3 className="flex-grow w-min">Heading 3</h3>
            <h4 className="flex-grow w-min">Heading 4</h4>
            <h5 className="flex-grow w-min">Heading 5</h5>
            <h6 className="flex-grow w-min">Heading 6</h6>
          </Flex>
        </Paper>
        <Paper layer={2}>
          <h3>Buttons /w sizes and variants - Paper Layer 2</h3>
          <Grid columns={{xsmall: 3, small: 4, medium: 5, large: 6}} gap={8}>
            {VARIANTS.map((variant, index) => <Flex direction="column" align="start">
              <h5 className="align-center">{variant}</h5>
              <Button size="large" className="w-100" key={"button-" + variant + "-large"} variant={variant} icon={ICONS[index%8]}>large</Button>
              <Button size="medium" className="w-100" key={"button-" + variant + "-medium"} variant={variant} icon={ICONS[index%8]}>medium</Button>
              <Button size="small" className="w-100" key={"button-" + variant + "-small"} variant={variant} icon={ICONS[index%8]}>small</Button>
              <hr/>
            </Flex>
            )}
            <Flex direction="column">
              <h5 className="align-center">disabled state</h5>
              <Button size="large" className="w-100" key={"button-disabled-large"} variant={"primary"} icon={ICONS[3]} disabled={true}>Disabled</Button>
              <Button size="medium" className="w-100" key={"button-disabled-medium"} variant={"primary"} icon={ICONS[3]} disabled={true}>Disabled</Button>
              <Button size="small" className="w-100" key={"button-disabled-small"} variant={"primary"} icon={ICONS[3]} disabled={true}>Disabled</Button>
            </Flex>
          </Grid>
        </Paper>
        <Paper layer={2}>
          <h3>Badges /w variants</h3>
          <Flex wrap={true} padding={8} gap={16}>
            {VARIANTS.map((variant, index) =>
              <Badge interactive={index%2} key={"badge-" + variant} variant={variant} icon={ICONS[index%8]}>{variant.toLowerCase()}</Badge>
            )}
              <Badge interactive={true} key={"badge-transparent"} variant={"transparent"} icon={ICONS[3]}>transparent</Badge>
          </Flex>
        </Paper>
        <Paper layer={2}>
          <h3>Papers /w variants</h3>
          <Grid columns={{xsmall: 4, small: 5, medium: 6, large: 8}} gap={8}>
            {VARIANTS.map((variant) =>
              <Paper variant={"transparent"} padding={8}>
              <h5 className="align-center">{variant}</h5>
                <Flex wrap={true}>
                  <Paper layer={0} className="w-30 flex-grow" key={"paper-" + variant} variant={variant} padding={16}></Paper>
                  <Paper layer={1} className="w-30 flex-grow" key={"paper-" + variant} variant={variant} padding={16}></Paper>
                  <Paper layer={2} className="w-30 flex-grow" key={"paper-" + variant} variant={variant} padding={16}></Paper>
                  <Paper layer={3} className="w-30 flex-grow" key={"paper-" + variant} variant={variant} padding={16}></Paper>
                </Flex>
              </Paper>
            )}
          </Grid>
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