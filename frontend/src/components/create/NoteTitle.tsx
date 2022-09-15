import React, {KeyboardEventHandler, useState} from "react";
import { BookmarkState, BookmarkActions, bookmarkStore } from "../../store/bookmark";

//==============================================================================

export default function NoteTitle() {
  const {noteTitle, setNoteTitle} = bookmarkStore((state:BookmarkState & BookmarkActions) => state);
  const [titleComplete, setTitleComplete] = useState<boolean>(false);

  //TODO: Add proper type for these below!!
  // Change to input if clicking on text
  function titleCompleted(e: any) {
    if (e.key === "Enter" && noteTitle.length > 0) {
      setTitleComplete(true);
    }
  }

  function handleInput(e:any) {
    setNoteTitle(e.target.value)
  }

  function editTitle(e: any) {
    setTitleComplete(false)
  }

  return (
    <>
      {!titleComplete && (
        <div className="lg:max-w-[50%]">
          <label
            htmlFor="Title input"
            className="form-label inline-block mb-4 text-gray-700"
          >
            <p className="font-semibold text-3xl dark:text-white">Note title</p>
          </label>
          <input
            type="text"
            onKeyDown={titleCompleted}
            onChange={handleInput}
            value={noteTitle}
            placeholder="Give title for this bookmark. Press enter key when ready."
            className="
        mt-3
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
        focus:text-gray-700  focus:border-[#06e7f0]
        "
          />
        </div>
      )}
      {titleComplete && (
        <p
          onClick={editTitle}
          className="inline-block font-bold text-3xl dark:text-white cursor-text hover:text-[2.1rem] ease-in-out duration-300 truncate w-[90%]"
          data-bs-toggle="tooltip"
          data-bs-html="true"
          title="Edit the title"
        >
          Title - {noteTitle}
        </p>
      )}
    </>
  );
}