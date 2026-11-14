import { Flex } from "./components/Flex";
import { Navigation } from "./components/Navigation";

import { useState } from "react";
import { ResearchPage } from "./pages/ResearchPage";
import { SpellcraftPage } from "./pages/SpellcraftPage";
import { TransmutationPage } from "./pages/TransmutationPage";
import { DevelopmentPage } from "./pages/DevelopmentPage";
import { ScrollArea } from "./components/ScrollArea";

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

function ResponsivePage({
  children,
  setActivePage,
  navigationPosition = "top",
  navigationMode = "default",
  className = '',
}) {
  if (navigationPosition === "top") {
    return (
      <Flex direction="column" gap={4} className={cx('page', className)}>
        <Navigation setActivePage={setActivePage} position="top" mode={navigationMode} />
        <ScrollArea padding={0}>
          {children}
        </ScrollArea>
      </Flex>
    )
  } else if (navigationPosition === "side") {
    return (
      <Flex direction="row" align="start" className={cx('page', className)}>
        <Navigation setActivePage={setActivePage} position="side" mode={navigationMode} />
        <ScrollArea maxHeight={window.innerHeight - 8} padding={"0 8px 0 0"}>
          {children}
        </ScrollArea>
      </Flex>
    )
  }
}

const PAGES = { RESEARCH: 0, SPELLCRAFT: 1, TRANSMUTATION: 2, DEVELOPMENT: 3 }

function App() {
  const [activePage, setActivePage] = useState(PAGES.RESEARCH)

  return (
    <ResponsivePage navigationPosition="top" navigationMode="default" setActivePage={setActivePage}>
      {activePage === PAGES.RESEARCH && <ResearchPage />}
      {activePage === PAGES.SPELLCRAFT && <SpellcraftPage />}
      {activePage === PAGES.TRANSMUTATION && <TransmutationPage />}
      {activePage === PAGES.DEVELOPMENT && <DevelopmentPage />}
    </ResponsivePage>
  )
}

export default App
