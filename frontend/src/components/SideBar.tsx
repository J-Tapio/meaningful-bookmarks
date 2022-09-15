// FontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFeather,
  faBookmark,
  faMoon,
  faSun,
  faCode,
} from "@fortawesome/free-solid-svg-icons";
// Store
import { appStore, AppState } from "../store";

//==============================================================================

export default function SideBar() {
  const {darkMode, changeColorMode, appView, changeAppView} = appStore((state:AppState) => state)

  const changeToCreate = () => {
    changeAppView("create");
  };
  
  const changeToBookmarks = () => {
    changeAppView("bookmarks");
  };

  const switchColorMode = (e: React.MouseEvent): void => {
    e.preventDefault();
    changeColorMode();
  };

  return (
    <div>
      <div className="sidebar w-[3.4rem] overflow-hidden border-r dark:border-slate-700 hover:w-56 hover:shadow-lg">
        <div className="flex h-screen flex-col justify-between pt-2 pb-6">
          <div>
            <div className="flex pl-1.5 min-w-max items-center">
              <FontAwesomeIcon icon={faCode} size="2xl" color="#06e7f0" />
              <div className="flex-col">
                <p className="pl-[.4rem] font-bold dark:text-white">
                  meaningful
                </p>
                <p className="pl-[.4rem] font-bold dark:text-white">
                  {" "}
                  Bookmarks
                </p>
              </div>
            </div>
            <ul className="mt-6 tracking-wide">
              <li
                className={`py-2 min-w-max hover:bg-slate-200 dark:hover:bg-slate-700 ${
                  appView === "create" && "bg-slate-300 dark:bg-slate-800"
                }`}
                onClick={changeToCreate}
              >
                <a
                  href="#"
                  aria-label="Create"
                  className="bg group flex items-center space-x-4 rounded-full px-3.5 py-3"
                >
                  <FontAwesomeIcon
                    icon={faFeather}
                    size="xl"
                    color={darkMode ? "#06e7f0" : "#000000"}
                  />
                  <span className="dark:text-white font-semibold">Create</span>
                </a>
              </li>
              <li
                className={`py-2 min-w-max hover:bg-slate-200 dark:hover:bg-slate-700 ${
                  appView === "bookmarks" && "bg-slate-300 dark:bg-slate-800"
                }`}
                onClick={changeToBookmarks}
              >
                <a
                  href="#"
                  aria-label="Create"
                  className="bg group flex items-center space-x-4 rounded-full px-4 py-3"
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    size="xl"
                    color={darkMode ? "#06e7f0" : "#000000"}
                  />
                  <span className="pl-[.3rem] font-semibold">Bookmarks</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="px-4 min-w-max flex">
            <button onClick={switchColorMode}>
              {darkMode ? (
                <FontAwesomeIcon icon={faSun} size="xl" color="#eab308" />
              ) : (
                <FontAwesomeIcon icon={faMoon} size="xl" color="#78716c" />
              )}
            </button>
            <p className="pl-[1.2rem]">
              Switch to{" "}
              <span className="font-bold">{darkMode ? "light" : "dark"}</span>{" "}
              mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
