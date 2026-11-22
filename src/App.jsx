import { useEffect, useState } from "react";

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
import { ExplorationPage } from "./pages/ExplorationPage";
import { UnveilingPage } from "./pages/UnveilingPage";
import { CompanionPage } from "./pages/CompanionPage";
import { OTHER_ICONS, SKILL_ICONS } from "./data/iconLibrary";
import { COMPANION_DATA } from "./data/companionData";
import { useGame } from "./hooks/useGame";

import { SKILL_NAVIGATION, SHOP_NAVIGATION } from "./data/navigationData";

const COMPANIONS_NAVIGATION = SKILL_NAVIGATION.find(skill => skill.skillId === "skill:companions")

function ResponsivePage({
  children,
  activePage,
  setActivePage,
  navigationPosition = "top",
  navigationMode = "default",
  onNavigationSettingsChange = () => { },
  className = '',
}) {
  const [bagModalVisible, setBagModalVisible] = useState(false)
  const [missionsModalVisible, setMissionsModalVisible] = useState(false)
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const { player } = useGame()
  const companionsUnlocked = player.unlockedSkills?.includes("skill:companions")

  const closeBagButton = (
    <Button variant="primary" onClick={() => setBagModalVisible(false)}>
      Close Bag
    </Button>
  )

  const shopButton = (
    <ShopButton
      active={activePage === SHOP_NAVIGATION.id}
      onClick={() => setActivePage(SHOP_NAVIGATION.id)}
    />
  )
  const missionsButton = (
    <MissionsButton
      active={missionsModalVisible}
      onClick={() => setMissionsModalVisible(true)}
    />
  )
  const companionsButton = companionsUnlocked ? (
    <Button
      variant="companions"
      size="medium"
      icon={SKILL_ICONS.COMPANIONS}
      badge={`${player.unlockedCompanions?.length ?? 0} / ${COMPANION_DATA.length}`}
      badgeIcon={OTHER_ICONS.COMPANION_EGG}
      checked={activePage === COMPANIONS_NAVIGATION?.id}
      onClick={() => setActivePage(COMPANIONS_NAVIGATION.id)}
    >
      Companions
    </Button>
  ) : null
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
      {companionsButton}
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
    <FloatingPanel>
      {companionsButton}
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
      />
      <SettingsModal
        visible={settingsModalVisible}
        setVisible={setSettingsModalVisible}
        settings={{ position: navigationPosition, mode: navigationMode }}
        onChange={onNavigationSettingsChange}
      />
      {floatingButtons}
      {navigationPosition === "top" && (
        <FloatingPanel position="right">
          {settingsButton}
        </FloatingPanel>
      )}
    </>
  )
}

const SETTINGS_KEY = "omnimancer-idle-settings"
const DEFAULT_NAVIGATION_SETTINGS = { position: "top", mode: "default" }

const loadNavigationSettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null")
    return {
      position: ["top", "side"].includes(saved?.position) ? saved.position : "top",
      mode: ["compact", "default"].includes(saved?.mode) ? saved.mode : "default",
    }
  } catch {
    return DEFAULT_NAVIGATION_SETTINGS
  }
}

function App() {
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
        >
          {activeSkill?.skillId === "skill:research" && <ResearchPage />}
          {activeSkill?.skillId === "skill:spellcraft" && <SpellcraftPage />}
          {activeSkill?.skillId === "skill:transmutation" && <TransmutationPage />}
          {activeSkill?.skillId === "skill:exploration" && <ExplorationPage />}
          {activeSkill?.skillId === "skill:unveiling" && <UnveilingPage />}
          {activeSkill?.skillId === "skill:companions" && <CompanionPage />}
          {activePage === SHOP_NAVIGATION.id && <ShopPage setActivePage={setActivePage} />}
        </ResponsivePage>
      </GameProvider>
    </ToastProvider>
  )
}

export default App
