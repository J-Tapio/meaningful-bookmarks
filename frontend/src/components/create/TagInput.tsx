import { useState, ChangeEvent } from "react";
// Components
import TagChip from "./TagChip";
// Store - Bookmark
import {
  BookmarkActions,
  BookmarkState,
  bookmarkStore,
} from "../../store/bookmark";

//==============================================================================

export default function TagInput() {
  const [inputValue, setInputValue] = useState<string>("");
  let { bookmarkTags, setBookmarkTags } = bookmarkStore(
    (state: BookmarkState & BookmarkActions) => state
  );

  //TODO: Find the correct types for events!

  function handleTagInput(e: any) {
    if (e.key === "Enter") {
      // console.log(e.target.value);
      // For unique tags - avoid duplicates
      let uniqueTags: Set<string> = new Set([...bookmarkTags, e.target.value]);
      setBookmarkTags(Array.from(uniqueTags));
      setInputValue("");
    }
  }

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  return (
    <div className="lg:max-w-[50%]">
      <label
        htmlFor="Tag input"
        className="form-label inline-block mb-2 text-gray-700"
      >
        <p className="font-semibold text-3xl dark:text-white">Tags</p>
      </label>
      <div className="flex flex-wrap space-x-3 py-3">
        {bookmarkTags &&
          bookmarkTags.map((tag, tagIndex) => (
            <TagChip
              key={tag}
              tag={tag}
              tagIndex={tagIndex}
              bookmarkTags={bookmarkTags}
              setBookmarkTags={setBookmarkTags}
            />
          ))}
      </div>
      <input
        type="text"
        onKeyDown={handleTagInput}
        onChange={handleInput}
        value={inputValue}
        placeholder="Type tag and press enter to insert another tag"
        className="
        form-control
        block
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
        focus:text-gray-700 focus:bg-white focus:border-[#06e7f0] focus:outline-none
        "
      />
    </div>
  );
}
