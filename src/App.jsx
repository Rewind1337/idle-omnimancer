import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "./components/Button";
import { BagModal } from "./components/modals/BagModal"
import { MissionsModal } from "./components/modals/MissionsModal";
import { Flex } from "./components/Flex";
import { Navigation } from "./components/Navigation";
import { ScrollArea } from "./components/ScrollArea";
import { ToastProvider } from "./contexts/ToastProvider"
import { GameProvider } from "./contexts/GameProvider"

import { ResearchPage } from "./pages/ResearchPage";
import { SpellcraftPage } from "./pages/SpellcraftPage";
import { TransmutationPage } from "./pages/TransmutationPage";
import { ShopPage } from "./pages/ShopPage";

import { cx } from './utility/helpers'
import { BagButton } from "./components/buttons/BagButton";
import { ShopButton } from "./components/buttons/ShopButton";
import { MissionsButton } from "./components/buttons/MissionsButton";
import { FloatingPanel } from "./components/FloatingPanel";
import { SettingsModal } from "./components/modals/SettingsModal";
import { IntroGuideModal } from "./components/modals/IntroGuideModal";
import { ExplorationPage } from "./pages/ExplorationPage"
import { CombatPage } from "./pages/CombatPage";
import { UnveilingPage } from "./pages/UnveilingPage";
import { CompanionPage } from "./pages/CompanionPage";
import { ZenPage } from "./pages/ZenPage";
import { TimeEnergyPanel } from "./components/TimeEnergyPanel";
import { OTHER_ICONS } from "./data/iconLibrary";
import { useGame } from "./hooks/useGame";

import { SKILL_NAVIGATION, SHOP_NAVIGATION } from "./data/navigationData";

function ResponsivePage({
  children,
  activePage,
  setActivePage,
  navigationPosition = "top",
  navigationMode = "detailed",
  onNavigationSettingsChange = () => { },
  className = '',
  missionsModalVisible,
  setMissionsModalVisible,
  missionsModalTab,
  setMissionsModalTab,
}) {
  const [bagModalVisible, setBagModalVisible] = useState(false)
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight)
  const [navigationBottom, setNavigationBottom] = useState(96)
  const navigationRef = useRef(null)
  const [activeGuideId, setActiveGuideId] = useState(null)
  const { resetGame, player, markIntroGuideSeen } = useGame()
  const currentGuideId = activePage === SHOP_NAVIGATION.id
    ? "shop"
    : SKILL_NAVIGATION.find(skill => skill.id === activePage)?.skillId ?? null

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Measure wrapped navigation instead of relying on a fixed panel offset.
  useEffect(() => {
    if (navigationPosition !== "top") return undefined
    const element = navigationRef.current
    if (!element) return undefined

    const updateNavigationBottom = () => {
      setNavigationBottom(Math.ceil(element.getBoundingClientRect().bottom + 8))
    }
    const frameId = window.requestAnimationFrame(updateNavigationBottom)
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(updateNavigationBottom)
      : null
    observer?.observe(element)
    window.addEventListener("resize", updateNavigationBottom)
    return () => {
      window.cancelAnimationFrame(frameId)
      observer?.disconnect()
      window.removeEventListener("resize", updateNavigationBottom)
    }
  }, [navigationPosition, navigationMode])

  useEffect(() => {
    if (activeGuideId) return

    const nextGuideId = player.introGuides?.welcome !== true
      ? "welcome"
      : currentGuideId

    if (nextGuideId && player.introGuides?.[nextGuideId] !== true) {
      setActiveGuideId(nextGuideId)
    }
  }, [activeGuideId, currentGuideId, player.introGuides])

  const closeGuide = useCallback(() => {
    if (activeGuideId) markIntroGuideSeen(activeGuideId)
    setActiveGuideId(null)
  }, [activeGuideId, markIntroGuideSeen])

  const openCurrentGuide = useCallback(() => {
    setActiveGuideId(missionsModalVisible ? "missions" : (currentGuideId ?? "welcome"))
  }, [currentGuideId, missionsModalVisible])

  const handleCloseBag = useCallback(() => setBagModalVisible(false), [])
  const closeBagButton = useMemo(() => (
    <Button variant="primary" onClick={handleCloseBag}>
      Close Bag
    </Button>
  ), [handleCloseBag])

  const handleResetGame = useCallback(() => {
    resetGame()
    const startingSkill = SKILL_NAVIGATION.find(skill => skill.skillId === "skill:research")
    if (startingSkill) setActivePage(startingSkill.id)
  }, [resetGame, setActivePage])

  const shopButton = (
    <ShopButton
      active={activePage === SHOP_NAVIGATION.id}
      onClick={() => setActivePage(SHOP_NAVIGATION.id)}
    />
  )
  const missionsButton = (
    <MissionsButton
      active={missionsModalVisible}
      onClick={() => {
        setMissionsModalTab("overview")
        setMissionsModalVisible(true)
        if (player.introGuides?.missions !== true) setActiveGuideId("missions")
      }}
    />
  )
  const guideButton = (
    <Button
      variant="primary"
      size="medium"
      className="w-min"
      icon={OTHER_ICONS.INFO}
      aria-label="Open guide for the current page"
      title="Guide"
      onClick={openCurrentGuide}
    >
      Guide
    </Button>
  )
  const bagButton = (
    <BagButton
      active={bagModalVisible}
      onClick={() => setBagModalVisible(true)}
    />
  )
  const settingsButton = (
    <Button
      variant="primary"
      size="medium"
      className="w-min"
      icon={OTHER_ICONS.SETTINGS}
      aria-label="Settings"
      title="Settings"
      onClick={() => setSettingsModalVisible(true)}
    >Settings</Button>
  )

  const sideActionsLeft = (
    <Flex direction="column" gap={8} className="navigation-side-actions">
      {shopButton}
      {missionsButton}
      {bagButton}
      {guideButton}
    </Flex>
  )
  const sideActionsRight = (
    <Flex direction="column" gap={8} className="navigation-side-actions">
      {settingsButton}
    </Flex>
  )

  const page = navigationPosition === "top" ? (
    <Flex direction="column" gap={4} className={cx('page', className)}>
      <div ref={navigationRef} className="top-navigation-anchor">
        <Navigation activePage={activePage} setActivePage={setActivePage} position="top" mode={navigationMode} />
      </div>
      <ScrollArea padding={0}>
        {children}
      </ScrollArea>
    </Flex>
  ) : navigationPosition === "side" ? (
    <Flex direction="row" align="start" className={cx('page', className)}>
      <Navigation
        activePage={activePage}
        setActivePage={setActivePage}
        position="side"
        mode={navigationMode}
        sideActionsLeft={sideActionsLeft}
        sideActionsRight={sideActionsRight}
      />
      <ScrollArea maxHeight={viewportHeight} padding={0}>
        {children}
      </ScrollArea>
    </Flex>
  ) : null

  const floatingButtons = navigationPosition === "top" ? (
    <FloatingPanel mode={navigationMode}>
      {shopButton}
      {missionsButton}
      {bagButton}
      {guideButton}
    </FloatingPanel>
  ) : null

  return (
    <>
      {page}
      <BagModal
        visible={bagModalVisible}
        setVisible={setBagModalVisible}
        closeBagButton={closeBagButton}
      />
      <MissionsModal
        visible={missionsModalVisible}
        setVisible={setMissionsModalVisible}
        activeTab={missionsModalTab}
        onTabChange={setMissionsModalTab}
      />
      <SettingsModal
        visible={settingsModalVisible}
        setVisible={setSettingsModalVisible}
        settings={{ position: navigationPosition, mode: navigationMode }}
        onChange={onNavigationSettingsChange}
        onResetGame={handleResetGame}
      />
      <IntroGuideModal guideId={activeGuideId} onClose={closeGuide} />
      {floatingButtons}
      {navigationPosition === "top" && (
        <FloatingPanel position="right" mode={navigationMode}>
          {settingsButton}
        </FloatingPanel>
      )}
      {player.timeEnergy?.unlocked && activePage !== SKILL_NAVIGATION.find(skill => skill.skillId === "skill:zen")?.id && (
        <FloatingPanel position="top-right" top={navigationPosition === "top" ? navigationBottom : 8} direction="column" mode={navigationMode}>
          <TimeEnergyPanel />
        </FloatingPanel>
      )}
    </>
  )
}

const SETTINGS_KEY = "omnimancer-idle-settings"
const DEFAULT_NAVIGATION_SETTINGS = { position: "top", mode: "detailed" }

const loadNavigationSettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null")
    return {
      position: ["top", "side"].includes(saved?.position) ? saved.position : "top",
      mode: saved?.mode === "compact" ? "compact" : "detailed",
    }
  } catch {
    return DEFAULT_NAVIGATION_SETTINGS
  }
}

function App() {
  const [missionsModalVisible, setMissionsModalVisible] = useState(false)
  const [missionsModalTab, setMissionsModalTab] = useState("overview")
  const [activePage, setActivePage] = useState(
    SKILL_NAVIGATION.find(skill => skill.skillId === "skill:research").id
  )
  const [navigationSettings, setNavigationSettings] = useState(loadNavigationSettings)
  const activeSkill = SKILL_NAVIGATION.find(skill => skill.id === activePage)

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(navigationSettings))
    } catch {
      // Keep the current layout for this session if browser storage is unavailable.
    }
  }, [navigationSettings])

  return (
    <ToastProvider>
      <GameProvider>
        <ResponsivePage
          activePage={activePage}
          navigationPosition={navigationSettings.position}
          navigationMode={navigationSettings.mode}
          onNavigationSettingsChange={(key, value) =>
            setNavigationSettings(current => ({ ...current, [key]: value }))
          }
          setActivePage={setActivePage}
          missionsModalVisible={missionsModalVisible}
          setMissionsModalVisible={setMissionsModalVisible}
          missionsModalTab={missionsModalTab}
          setMissionsModalTab={setMissionsModalTab}
        >
          {activeSkill?.skillId === "skill:research" && <ResearchPage />}
          {activeSkill?.skillId === "skill:spellcraft" && <SpellcraftPage />}
          {activeSkill?.skillId === "skill:transmutation" && <TransmutationPage />}
          {activeSkill?.skillId === "skill:exploration" && <ExplorationPage />}
          {activeSkill?.skillId === "skill:combat" && <CombatPage />}
          {activeSkill?.skillId === "skill:unveiling" && <UnveilingPage />}
          {activeSkill?.skillId === "skill:companions" && <CompanionPage />}
          {activeSkill?.skillId === "skill:zen" && <ZenPage />}
          {activePage === SHOP_NAVIGATION.id && <ShopPage setActivePage={setActivePage} onOpenFameShop={() => { setMissionsModalTab("fame-shop"); setMissionsModalVisible(true) }} />}
        </ResponsivePage>
      </GameProvider>
    </ToastProvider>
  )
}

export default App
