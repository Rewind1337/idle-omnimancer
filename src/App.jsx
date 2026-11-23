import { useCallback, useEffect, useMemo, useState } from "react";

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
import { ExplorationPage } from "./pages/ExplorationPage"
import { CombatPage } from "./pages/CombatPage";
import { UnveilingPage } from "./pages/UnveilingPage";
import { CompanionPage } from "./pages/CompanionPage";
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
  const { resetGame } = useGame()

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
      onClick={() => { setMissionsModalTab("overview"); setMissionsModalVisible(true) }}
    />
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
    </Flex>
  )
  const sideActionsRight = (
    <Flex direction="column" gap={8} className="navigation-side-actions">
      {settingsButton}
    </Flex>
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
      <Navigation
        activePage={activePage}
        setActivePage={setActivePage}
        position="side"
        mode={navigationMode}
        sideActionsLeft={sideActionsLeft}
        sideActionsRight={sideActionsRight}
      />
      <ScrollArea maxHeight={window.innerHeight - 8} padding={"0 8px 0 0"}>
        {children}
      </ScrollArea>
    </Flex>
  ) : null

  const floatingButtons = navigationPosition === "top" ? (
    <FloatingPanel mode={navigationMode}>
      {shopButton}
      {missionsButton}
      {bagButton}
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
      {floatingButtons}
      {navigationPosition === "top" && (
        <FloatingPanel position="right" mode={navigationMode}>
          {settingsButton}
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
          {activePage === SHOP_NAVIGATION.id && <ShopPage setActivePage={setActivePage} onOpenFameShop={() => { setMissionsModalTab("fame-shop"); setMissionsModalVisible(true) }} />}
        </ResponsivePage>
      </GameProvider>
    </ToastProvider>
  )
}

export default App
