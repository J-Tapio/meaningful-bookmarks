import { useState } from "react";
import { BookmarkActions, bookmarkStore } from "../../store/bookmark";

// If clipboard package not available - error while initializing
export default function UrlInput() {
  const [isInvalidURL, setIsInvalidURL] = useState<boolean>(true);
  const [providedURL, setProvidedURL] = useState<string>("");
  const [showInvalidInfo, setShowInvalidInfo] = useState<boolean>(false);
  const { setPageURL } = bookmarkStore((state: BookmarkActions) => state);

  function handleInputChange(e: any) {
    if (showInvalidInfo) setShowInvalidInfo(false);

    setProvidedURL(e.target.value);
  }

  function handleInputDone(e: any) {
    if (e.key === "Enter" && providedURL.length > 0) {
      try {
        // Check if valid URL with help of URL() constructor
        let typedURL = new URL(providedURL);
        // Save to store
        setPageURL(providedURL);

        setIsInvalidURL(false);
        setProvidedURL(typedURL.hostname);
      } catch (error) {
        // TypeError will be thrown if invalid string provided to URL()
        setShowInvalidInfo(true);
      }
    }
  }

  function handleURLEdit() {
    setIsInvalidURL(true);
    setProvidedURL("https://" + providedURL);
  }

  return (
    <div className="flex-col space-y-3">
      <div
        className="flex font-bold text-3xl cursor-pointer hover:text-[2rem] ease-in-out duration-300"
        onClick={handleURLEdit}
      >
        <p>Url</p>
        {!isInvalidURL && (
          <p className="ml-2">
            {" - "}
            {providedURL}
          </p>
        )}
      </div>

      <div className="flex space-x-5 items-center">
        {showInvalidInfo && (
          <p className="font-bold text-red-700 animate-pulse text-2xl uppercase">
            invalid:
          </p>
        )}
        {isInvalidURL && (
          <input
            type="url"
            placeholder="Copy or type the URL, eg. https://www.something.com and then press enter"
            className="block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white dark:bg-slate-700 dark:text-white bg-clip-padding
        border border-solid light:border-gray-300 dark:border-cyan-800
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700  focus:border-[#06e7f0]"
            onKeyDown={handleInputDone}
            onChange={handleInputChange}
            value={providedURL}
          />
        )}
      </div>
    </div>
  );
}
