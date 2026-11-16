import { BookOpenText, Scale, WandSparkles, Star, ArrowUpRight, CircleDollarSign, GraduationCap, MapPin, FaceAngry, Sword, RatIcon, Trophy, TextQuote, ShieldBan, Bird, Dog } from "lucide-react"

import { useState } from "react"

import { useToast } from "../hooks/useToast"

import { Badge } from "../components/Badge"
import { Button } from "../components/Button"
import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"
import { Grid } from "../components/Grid"
import { Icon } from "../components/Icon"
import { InputText } from "../components/InputText"
import { InputNumber } from "../components/InputNumber"
import { InputRange } from "../components/InputRange"
import { InputCheckbox } from "../components/InputCheckbox"
import { InputRadio } from "../components/InputRadio"
import { Progress } from "../components/Progress"
import { InputSelect } from "../components/InputSelect"
import { Heading } from "../components/Heading"
import { Text } from "../components/Text"
import { Modal } from "../components/Modal"
import { Tooltip } from "../components/Tooltip"

import "../data/skillConfig.js"

const VARIANTS = ["primary", "secondary", "earth", "air", "water", "research", "spellcraft", "transmutation", "exploration", "combat", "unveiling", "companions"]
const SIZES = ["large", "medium", "small"]
const ICONS = [<BookOpenText />, <Scale />, <WandSparkles />, <Star />, <MapPin />, <CircleDollarSign />, <GraduationCap />, <FaceAngry />]

function Showcase() {
  const { showToast /*, dismissToast, clearToasts */ } = useToast()

  const exampleToastButtons = [
    {
      text: "Level increased", toast: () => {
        showToast({
          title: "Research level increased!", message: "Read Books has reached level 25.", type: "research"
        })
      }
    },
    {
      text: "New discovery", toast: () => {
        showToast({
          title: "New discovery", message: "You discovered something interesting.", type: "unveiling"
        })
      }
    },
    {
      text: "Bag warning", toast: () => {
        showToast({
          title: "Inventory almost full!", message: "Only one inventory slot remains.", type: "warning", duration: 8000
        })
      }
    },
    {
      text: "Bag Full", toast: () => {
        showToast({
          title: "Inventory full!", message: "Production has paused because there is no available space.", type: "error", duration: 0, action: {
            label: "Open Bag",
            onClick: () => setBagModalVisible(true)
          }
        })
      }
    }
  ]

  const [textInput, setTextInput] = useState('')
  const [numberInput, setNumberInput] = useState(1)
  const [selectionInput, setSelectionInput] = useState('')
  const [clampedNumberInput, setClampedNumberInput] = useState(1)
  const [rangeInput, setRangeInput] = useState(50)
  const [checkbox, setCheckbox] = useState(false)
  const [radioSelection, setRadioSelection] = useState('')

  const [bagModalVisible, setBagModalVisible] = useState(false)

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
          <h3>Buttons</h3>
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
          <h3>Fancy Icons</h3>
          <Flex wrap={true} padding={8} gap={16}>
            <Paper round layer="0" variant={VARIANTS[0]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[0]} innerShape={3}>
                {<BookOpenText size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[0]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[0]} outerShape={3}>
                {<BookOpenText size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[0]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[0]} outerShape={3} innerShape={3} outerRunes={"solid"} innerRunes={"solid"}>
                {<BookOpenText size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[1]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[1]} outerShape={4} innerShape={3} outerRunes={"dashed"} innerRunes={"dashed"}>
                {<Scale size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[2]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[2]} outerShape={5} innerShape={3} outerRunes={"dotted"} innerRunes={"dotted"}>
                {<WandSparkles size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[3]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[3]} outerShape={6} innerShape={3} outerRunes={"gap"} innerRunes={"gap"}>
                {<Star size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[4]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[4]} outerShape={7} innerShape={3} outerRunes={"wide"} innerRunes={"dashed"}>
                {<MapPin size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[5]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[5]} outerShape={8} innerShape={3} outerRunes={"solid"} innerRunes={"dotted"}>
                {<CircleDollarSign size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[6]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[6]} outerShape={9} innerShape={3} outerRunes={"wide"} innerRunes={"gap"}>
                {<GraduationCap size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[7]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[7]} outerShape={10} innerShape={3} outerRunes={"dashed"} innerRunes={"dotted"}>
                {<FaceAngry size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[8]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[8]} outerShape={"bevel"} innerShape={3} outerRunes={"dashed"} innerRunes={"gap"}>
                {<Sword size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[9]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[9]} outerShape={"rabbet"} innerShape={3} outerRunes={"dotted"} innerRunes={"dashed"}>
                {<RatIcon size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[10]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[10]} outerShape={"house"} innerShape={3} outerRunes={"dotted"} innerRunes={"wide"}>
                {<Trophy size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[0]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[0]} outerShape={"chevron"} innerShape={3} outerRunes={"solid"} innerRunes={"dotted"}>
                {<TextQuote size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[1]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[1]} outerShape={"star"} innerShape={3} outerRunes={"dashed"} innerRunes={"gap"}>
                {<ShieldBan size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[2]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[2]} outerShape={"close"} innerShape={3} outerRunes={"gap"} innerRunes={"solid"}>
                {<Bird size={48} />}
              </Icon>
            </Paper>
            <Paper round layer="0" variant={VARIANTS[3]} interactive className="w-min">
              <Icon size={64} variant={VARIANTS[3]} outerShape={"frame"} innerShape={3} outerRunes={"dotted"} innerRunes={"dashed"}>
                {<Dog size={48} />}
              </Icon>
            </Paper>
          </Flex>
        </Paper>
        <Paper layer={2}>
          <h3>Badges</h3>
          <Flex wrap={true} padding={8} gap={16}>
            {VARIANTS.map((variant, index) =>
              <Badge interactive={index % 2} key={"badge-" + index + "-" + variant} variant={variant} icon={ICONS[index % 8]}>{variant.toLowerCase()}</Badge>
            )}
            <Badge interactive={true} key={"badge-transparent"} variant={"transparent"} icon={ICONS[3]}>transparent</Badge>
          </Flex>
        </Paper>
        <Paper layer={2}>
          <h3>Toasts</h3>
          <Flex wrap={true} padding={8} gap={16}>
            {exampleToastButtons.map((toast, index) =>
              <Button key={"toastbutton-" + index} onClick={() => { toast.toast() }} icon={<ArrowUpRight />}>{toast.text}</Button>
            )}
          </Flex>
          <h3>Tooltips</h3>
          <Flex>
            <Tooltip content="Basic Tooltip"><Paper><ArrowUpRight /></Paper></Tooltip>
            <Tooltip content={
              <Flex direction="column">
                <Heading h="3" className="align-center">More Complex</Heading>
                <Heading h="5" className="align-center">Things</Heading>
                <Badge variant={"primary"} icon={ICONS[3]}>Badge</Badge>
              </Flex>
            }>
              <Paper><ArrowUpRight /></Paper>
            </Tooltip>
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
            <InputSelect variant="air" values={["Earth", "Air", "Water"]} value={selectionInput} onChange={setSelectionInput} label={"Example Select"} />
            <InputNumber variant="earth" value={numberInput} onChange={handleNumberInput} label={"Example Number Input"} />
            <InputRange variant="combat" value={rangeInput} onChange={handleRangeInput} label={"Example Range Input"} min={1} max={67} />
            <InputCheckbox variant="transmutation" renderButtons checked={checkbox} onChange={setCheckbox} label={"Example Checkbox Buttons"} checkboxLabel={"Some Checkbox"} />
            <InputCheckbox variant="transmutation" checked={checkbox} onChange={setCheckbox} label={"Example Checkbox"} checkboxLabel={"Some Checkbox"} />
            <InputRadio variant="spellcraft" renderButtons values={["Earth", "Air", "Water"]} value={radioSelection} onChange={setRadioSelection} label={"Example Radio Buttons"} />
            <InputRadio variant="spellcraft" values={["Earth", "Air", "Water"]} value={radioSelection} onChange={setRadioSelection} label={"Example Radio"} />
          </Grid>
        </Paper>
        <Paper layer={2}>
          <h3>Modals</h3>
          <Flex>
            <Modal
              visible={bagModalVisible}
              variant="transmutation"
              onBackdropClick={() => { setBagModalVisible(false) }}
              header={<Heading h='1'>Bag Modal</Heading>}
              content={<Flex direction="column">
                Clicking outside of the Modal closes the Modal
                <Button variant={"primary"} onClick={() => { setBagModalVisible(false) }}>This Button closes the Modal</Button>
              </Flex>}
              footer={<Button variant={"primary"} onClick={() => { setBagModalVisible(false) }}>This Button also closes the Modal</Button>}
            />
            <Button size="medium" variant="transmutation" toggled={bagModalVisible} onClick={() => { setBagModalVisible(true) }} className="w-min" icon={<ArrowUpRight />}>Open Bag</Button>
          </Flex>
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