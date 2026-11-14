import { BookOpenText, Scale, WandSparkles, Star, ArrowUpRight, CircleDollarSign, GraduationCap, MapPin } from "lucide-react"
import { Badge } from "../components/Badge"
import { Button } from "../components/Button"
import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"
import { Grid } from "../components/Grid"
import { InputText } from "../components/InputText"
import { InputNumber } from "../components/InputNumber"
import { InputRange } from "../components/InputRange"
import { InputCheckbox } from "../components/InputCheckbox"
import { InputRadio } from "../components/InputRadio"

import { useState } from "react"
import { Progress } from "../components/Progress"
import { InputSelect } from "../components/InputSelect"
import { Heading } from "../components/Heading"
import { Text } from "../components/Text"

/* Temp stuff for showcasing */
const VARIANTS = ["primary", "secondary", "earth", "air", "water", "research", "spellcraft", "transmutation", "exploration", "combat", "unveiling"]
const SIZES = ["large", "medium", "small"]
const ICONS = [<BookOpenText />, <Scale />, <WandSparkles />, <Star />, <MapPin />, <CircleDollarSign />, <ArrowUpRight />, <GraduationCap />]

function Showcase() {
  const [textInput, setTextInput] = useState('')
  const [numberInput, setNumberInput] = useState(1)
  const [selectionInput, setSelectionInput] = useState('')
  const [clampedNumberInput, setClampedNumberInput] = useState(1)
  const [rangeInput, setRangeInput] = useState(50)
  const [checkbox, setCheckbox] = useState(false)
  const [radioSelection, setRadioSelection] = useState('')

  const handleTextInput = (e) => {
    setTextInput(e.target.value)
  }

  const handleClampedNumberInput = (e) => {
    let value = Number(e.target.value)
    let min = e.target.min
    let max = e.target.max
    setClampedNumberInput(Math.min(max, Math.max(min, value)))
  }

  const handleNumberInput = (e) => {
    let value = Number(e.target.value)
    setNumberInput(value)
  }

  const handleRangeInput = (e) => {
    let value = Number(e.target.value)
    setRangeInput(value)
  }

  return (
    <Paper layer={1}>
      <h2>Showcase - Paper Layer 1</h2>
      <Flex direction="column">
        <Paper layer={2}>
          <h3>Headings - Paper Layer 2</h3>
          <Flex wrap={true} padding={8} gap={16}>
            <Heading className="flex-grow w-min" h="1" text={"Heading 1"} variant={"research"} />
            <Heading className="flex-grow w-min" h="2" text={"Heading 2"} variant={"spellcraft"} />
            <Heading className="flex-grow w-min" h="3" text={"Heading 3"} variant={"transmutation"} />
            <Heading className="flex-grow w-min" h="4" text={"Heading 4"} variant={"combat"} />
            <Heading className="flex-grow w-min" h="5" text={"Heading 5"} variant={"exploration"} />
            <Heading className="flex-grow w-min" h="6" text={"Heading 6"} variant={"unveiling"} />
          </Flex>
          <h3>Texts</h3>
          <Flex wrap={true} padding={8} gap={16}>
            <Text className="flex-grow w-min" size="xsmall" text={"Test"} variant={"water"} />
            <Text className="flex-grow w-min" size="small" text={"Test"} variant={"earth"} />
            <Text className="flex-grow w-min" size="medium" text={"Test"} variant={"air"} />
            <Text className="flex-grow w-min" size="large" text={"Test"} variant={"unveiling"} />
            <Text className="flex-grow w-min" size="xlarge" text={"Test"} variant={"primary"} />
          </Flex>
        </Paper>
        <Paper layer={2}>
          <h3>Buttons /w sizes and variants</h3>
          <Grid columns={{ xsmall: 3, small: 4, medium: 5, large: 6 }} gap={8}>
            {VARIANTS.map((variant, indexVar) =>
              <Flex key={"flex-" + indexVar} direction="column" align="start">
                <h5 className="align-center">{variant}</h5>
                {SIZES.map((size, indexSize) =>
                  <Button size={size} className="w-100" key={"button-" + indexSize + "-" + indexVar + "-" + variant + "-" + size} variant={variant} icon={ICONS[indexVar % 8]}>{size.toUpperCase()}</Button>
                )}
                <Button size="medium" variant={variant} toggled={true} className="w-min" icon={ICONS[indexVar % 8]}>Toggled</Button>
              </Flex>
            )}
            <Flex direction="column" align="start">
              <h5 className="align-center">transparent</h5>
              <Button size="large" transparent={true} className="w-100" icon={ICONS[3]}>Large</Button>
              <Button size="medium" transparent={true} className="w-100" icon={ICONS[3]}>Medium</Button>
              <Button size="small" transparent={true} className="w-100" icon={ICONS[3]}>Small</Button>
              <Button size="medium" transparent={true} toggled={true} className="w-min" icon={ICONS[3]}>Toggled</Button>
            </Flex>
            <Flex direction="column" align="start">
              <h5 className="align-center">disabled state</h5>
              <Button size="large" className="w-100" variant={"primary"} icon={ICONS[3]} disabled={true}>Large</Button>
              <Button size="medium" className="w-100" variant={"primary"} icon={ICONS[3]} disabled={true}>Medium</Button>
              <Button size="small" className="w-100" variant={"primary"} icon={ICONS[3]} disabled={true}>Small</Button>
            </Flex>
          </Grid>
        </Paper>
        <Paper layer={2}>
          <h3>Badges /w variants</h3>
          <Flex wrap={true} padding={8} gap={16}>
            {VARIANTS.map((variant, index) =>
              <Badge interactive={index % 2} key={"badge-" + index + "-" + variant} variant={variant} icon={ICONS[index % 8]}>{variant.toLowerCase()}</Badge>
            )}
            <Badge interactive={true} key={"badge-transparent"} variant={"transparent"} icon={ICONS[3]}>transparent</Badge>
          </Flex>
        </Paper>
        <Paper layer={2}>
          <h3>Papers /w variants</h3>
          <Grid columns={{ xsmall: 4, small: 5, medium: 6, large: 8 }} gap={8}>
            {VARIANTS.map((variant, index) =>
              <Paper key={"paper-" + index + "-" + variant} transparent={true} variant={variant} interactive={true} padding={8}>
                <h5 className="align-center">{variant}</h5>
                <Flex wrap={true}>
                  <Paper layer={0} className="w-30 flex-grow" variant={variant} padding={16}></Paper>
                  <Paper layer={1} className="w-30 flex-grow" variant={variant} padding={16}></Paper>
                  <Paper layer={2} className="w-30 flex-grow" variant={variant} padding={16}></Paper>
                  <Paper layer={3} className="w-30 flex-grow" variant={variant} padding={16}></Paper>
                  <Paper layer={4} className="w-30 flex-grow" variant={variant} padding={16}></Paper>
                  <Paper layer={5} className="w-30 flex-grow" variant={variant} padding={16}></Paper>
                </Flex>
              </Paper>
            )}
            <Paper transparent={true} interactive={true} padding={8}>
              <h5 className="align-center">default</h5>
              <Flex wrap={true}>
                <Paper interactive={true} layer={0} className="w-30 flex-grow" padding={16}></Paper>
                <Paper interactive={true} layer={1} className="w-30 flex-grow" padding={16}></Paper>
                <Paper interactive={true} layer={2} className="w-30 flex-grow" padding={16}></Paper>
                <Paper interactive={true} layer={3} className="w-30 flex-grow" padding={16}></Paper>
                <Paper interactive={true} layer={4} className="w-30 flex-grow" padding={16}></Paper>
                <Paper interactive={true} layer={5} className="w-30 flex-grow" padding={16}></Paper>
              </Flex>
            </Paper>
          </Grid>
        </Paper>
        <Paper layer={2}>
          <h3>Input Stuff</h3>
          <Grid columns={{ xsmall: 1, small: 2, medium: 3, large: 4 }} gap={8}>
            <InputText variant="water" value={textInput} onChange={handleTextInput} label={"Example Text Input"} />
            <InputNumber variant="exploration" value={clampedNumberInput} onChange={handleClampedNumberInput} label={"Example Clamped Number Input"} min={1} max={420} />
            <InputSelect values={["Earth", "Air", "Water"]} value={selectionInput} onChange={setSelectionInput} variant="air" label={"Example Select"} />
            <InputNumber variant="earth" value={numberInput} onChange={handleNumberInput} label={"Example Number Input"} />
            <InputRange variant="combat" value={rangeInput} onChange={handleRangeInput} label={"Example Range Input"} min={1} max={67} />
            <InputCheckbox renderButtons variant="research" checked={checkbox} onChange={setCheckbox} label={"Example Checkbox"} checkboxLabel={"Some Checkbox"} />
            <InputRadio renderButtons values={["Earth", "Air", "Water"]} value={radioSelection} onChange={setRadioSelection} variant="unveiling" label={"Example Radio Buttons"} />
          </Grid>
        </Paper>
        <Paper layer={2}>
          <h3>Progressbars</h3>
          <Grid columns={{ xsmall: 1, small: 2, medium: 3, large: 4 }} gap={8}>
            {VARIANTS.map((variant, indexVar) =>
              <Flex direction="column" gap={8} key={"progflex-" + indexVar}>
                <Progress key={"prog-" + indexVar} size={"medium"} variant={variant} percentage={67} />
              </Flex>
            )}
            <Progress key={"prog-large"} size={"small"} animated="true" variant={"primary"} percentage={67} />
            <Progress key={"prog-small"} size={"large"} animated="true" variant={"primary"} percentage={67} />
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
        <Showcase />
      </Paper>
    </Flex>
  )
}