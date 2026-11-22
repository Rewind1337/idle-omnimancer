import { createContext } from "react"

// Keep the frequently changing player context separate from stable commands
// and external-store subscriptions so focused hooks do not rerender globally.
export const GameContext = createContext(null)
export const GameServicesContext = createContext(null)
