import { useState } from "react";

import { Flex } from "./components/Flex";
import { Navigation } from "./components/Navigation";
import { ScrollArea } from "./components/ScrollArea";
import { ToastProvider } from "./contexts/ToastProvider"
import { GameProvider } from "./contexts/GameProvider"

import { ResearchPage } from "./pages/ResearchPage";
import { SpellcraftPage } from "./pages/SpellcraftPage";
import { DevelopmentPage } from "./pages/DevelopmentPage";

import { cx } from './utility/helpers'

function ResponsivePage({
  children,
  activePage,
  setActivePage,
  navigationPosition = "top",
  navigationMode = "default",
  className = '',
}) {
  if (navigationPosition === "top") {
    return (
      <Flex direction="column" gap={4} className={cx('page', className)}>
        <Navigation activePage={activePage} setActivePage={setActivePage} position="top" mode={navigationMode} />
        <ScrollArea padding={0}>
          {children}
        </ScrollArea>
      </Flex>
    )
  } else if (navigationPosition === "side") {
    return (
      <Flex direction="row" align="start" className={cx('page', className)}>
        <Navigation activePage={activePage} setActivePage={setActivePage} position="side" mode={navigationMode} />
        <ScrollArea maxHeight={window.innerHeight - 8} padding={"0 8px 0 0"}>
          {children}
        </ScrollArea>
      </Flex>
    )
  }
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
