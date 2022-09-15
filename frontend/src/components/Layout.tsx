import { ReactNode } from 'react';
// Components
import SideBar from './SideBar';
// Store
import { AppState, appStore } from '../store'

//==============================================================================

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}:LayoutProps) {
  const darkMode = appStore((state:AppState) => state.darkMode)

  return (
    <div className={darkMode ? "dark" : "light"}>
      <div className="flex bg-sky-50 dark:bg-gray-900 dark:text-white">
        <SideBar />
        <div className="w-full h-screen overflow-y-auto scrollbar-thin dark:scrollbar-track-gray-700 dark:scrollbar-thumb-[#02777c] scrollbar-track-gray-200 scrollbar-thumb-[#02777c] scroll-smooth">
          {/* Render here the view -> create or bookmarks */}
          {children}
        </div>
      </div>
    </div>
  );
}
