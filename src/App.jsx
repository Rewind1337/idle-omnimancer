import { useState } from "react";
import { ArrowUpRight, CircleDollarSign, DollarSign, Grip } from "lucide-react";

import { Button } from "./components/Button";
import { BagModal } from "./components/modals/BagModal";
import { Flex } from "./components/Flex";
import { Navigation } from "./components/Navigation";
import { ScrollArea } from "./components/ScrollArea";
import { ToastProvider } from "./contexts/ToastProvider"
import { GameProvider } from "./contexts/GameProvider"

import { ResearchPage } from "./pages/ResearchPage";
import { SpellcraftPage } from "./pages/SpellcraftPage";
import { DevelopmentPage } from "./pages/DevelopmentPage";

import { cx } from './utility/helpers'
import { Paper } from "./components/Paper";
import { BagButton } from "./components/buttons/BagButton";
import { ShopButton } from "./components/buttons/ShopButton";
import { FloatingPanel } from "./components/FloatingPanel";

function ResponsivePage({
  children,
  activePage,
  setActivePage,
  navigationPosition = "top",
  navigationMode = "default",
  className = '',
}) {
  const [bagModalVisible, setBagModalVisible] = useState(false)

  const closeBagButton = (
    <Button variant="primary" onClick={() => setBagModalVisible(false)}>
      Close Bag
    </Button>
  )

  const page = navigationPosition === "top" ? (
    <Flex direction="column" gap={4} className={cx('page', className)}>
      <Navigation activePage={activePage} setActivePage={setActivePage} position="top" mode={navigationMode} />
      <ScrollArea padding={0}>
        {children}
      </ScrollArea>
    </Flex>
  ) : navigationPosition === "side" ? (
    <Flex direction="row" align="start" className={cx('page', className)}>
      <Navigation activePage={activePage} setActivePage={setActivePage} position="side" mode={navigationMode} />
      <ScrollArea maxHeight={window.innerHeight - 8} padding={"0 8px 0 0"}>
        {children}
      </ScrollArea>
    </Flex>
  ) : null

  const floatingButtons = <FloatingPanel>
    <ShopButton active={false} />
    <BagButton active={bagModalVisible} onClick={() => { setBagModalVisible(true) }} />
  </FloatingPanel>

  return (
    <>
      {page}
      <BagModal
        visible={bagModalVisible}
        setVisible={setBagModalVisible}
        closeBagButton={closeBagButton}
      />
      {floatingButtons}
    </>
  )
}

const PAGES = {
  RESEARCH: 0,
  SPELLCRAFT: 1,
  TRANSMUTATION: 2,
  EXPLORATION: 3,
  UNVEILING: 4,
  COMBAT: 5,
  COMPANIONS: 6,
  DEVELOPMENT: 7
}

function App() {
  const [activePage, setActivePage] = useState(PAGES.RESEARCH)

  return (
    <ToastProvider>
      <GameProvider>
        <ResponsivePage activePage={activePage} navigationPosition="top" navigationMode="compact" setActivePage={setActivePage}>
          {activePage === PAGES.RESEARCH && <ResearchPage />}
          {activePage === PAGES.SPELLCRAFT && <SpellcraftPage />}
          {activePage === PAGES.DEVELOPMENT && <DevelopmentPage />}
        </ResponsivePage>
      </GameProvider>
    </ToastProvider>
  )
}

export default App
