import create from "zustand";

// TODO: Consider separating bookmark creation related to BookmarkState

export interface AppState {
  darkMode: boolean
  appView: "create" | "bookmarks"
  changeColorMode: () => void
  changeAppView: (selectedView: "create" | "bookmarks") => void
}

export const appStore = create<AppState>((set) => ({
  darkMode: false,
  changeColorMode: () => set((state) => ({darkMode: !state.darkMode})),
  appView: "create",
  changeAppView: (selectedView) => set((state) => ({ appView: selectedView})),
}));
