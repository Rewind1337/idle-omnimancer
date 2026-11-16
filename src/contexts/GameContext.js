import { createContext } from "react"

// Kept separate from the provider so Fast Refresh can treat the provider
// module as a component-only module.
export const GameContext = createContext(null)
