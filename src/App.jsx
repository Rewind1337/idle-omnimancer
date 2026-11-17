import { useState } from "react";

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
import { BagButton } from "./components/buttons/BagButton";
import { ShopButton } from "./components/buttons/ShopButton";
import { FloatingPanel } from "./components/FloatingPanel";

import { SKILL_NAVIGATION, DEVELOPMENT_NAVIGATION, SHOP_NAVIGATION } from "./data/navigationData";

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
    <ShopButton
      active={activePage === SHOP_NAVIGATION.id}
      onClick={() => setActivePage(SHOP_NAVIGATION.id)}
    />
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

function App() {
  const [activePage, setActivePage] = useState(
    SKILL_NAVIGATION.find(skill => skill.skillId === "skill:research").id
  )
  const activeSkill = SKILL_NAVIGATION.find(skill => skill.id === activePage)

  return (
    <ToastProvider>
      <GameProvider>
        <ResponsivePage activePage={activePage} navigationPosition="top" navigationMode="default" setActivePage={setActivePage}>
          {activeSkill?.skillId === "skill:research" && <ResearchPage />}
          {activeSkill?.skillId === "skill:spellcraft" && <SpellcraftPage />}
          {activePage === DEVELOPMENT_NAVIGATION.id && <DevelopmentPage />}
        </ResponsivePage>
      </GameProvider>
    </ToastProvider>
  )
}

export default App
