import { Flex } from "./components/Flex";
import { Navigation } from "./components/Navigation";

import { useState } from "react";
import { ResearchPage } from "./pages/ResearchPage";

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

function ResponsivePage({
  children,
  setActivePage,
  navigationPosition = "top",
  className = '',
}) {
  if (navigationPosition === "top") {
    return (
      <Flex direction="column" className={cx('page', className)}>
        <Navigation setActivePage={setActivePage} position="top"/>
        {children}
      </Flex>
    )
  } else if (navigationPosition === "side") {
    return (
      <Flex direction="row" align="start" className={cx('page', className)}>
        <Navigation setActivePage={setActivePage} position="side"/>
        {children}
      </Flex>
    )
  } else if (navigationPosition === "mobile") {
    return (
        <Flex direction="column" className={cx('page', className)}>
          <Navigation setActivePage={setActivePage} position="mobile"/>
          {children}
        </Flex>
    )
  }
}

const PAGES = {RESEARCH: 0, SPELLCRAFT: 1, TRANSMUTATION: 2}

function App() {
  const [activePage, setActivePage] = useState(PAGES.RESEARCH)

  return (
    <ResponsivePage navigationPosition="side" setActivePage={setActivePage}>
      {activePage === PAGES.RESEARCH && <ResearchPage/>}
      {activePage === PAGES.SPELLCRAFT && <ResearchPage/>}
      {activePage === PAGES.TRANSMUTATION && <ResearchPage/>}
    </ResponsivePage>
  )
}

export default App
