// Wails runtime
import { EventsEmit } from "../../../wailsjs/runtime/runtime";
// Store
import {
  BookmarkState,
  BookmarkActions,
  bookmarkStore,
} from "../../store/bookmark";

//------------------------------------------------------------------------------

interface NoteAndTags {
  Title: string;
  Note: string;
  Tags: string[];
}

export default function SaveButton() {
  const { bookmarkNote, bookmarkTags, noteTitle, setShowUploadState } =
    bookmarkStore((state: BookmarkState & BookmarkActions) => state);

  function submitNoteData(e: React.MouseEvent<HTMLElement>) {
    //? I guess redundant to use preventDefault since button type is 'button'
    e.preventDefault();
    // Reveals upload animation
    setShowUploadState(true);
    // Emit event with payload - Go handles the creation of bookmark and image save etc.
    EventsEmit("bookmark", {
      Title: noteTitle,
      Note: bookmarkNote,
      Tags: bookmarkTags,
    } as NoteAndTags);
  }

  return (
    <div>
      <button
        onClick={submitNoteData}
        type="button"
        className="px-6 pt-2.5 pb-2.5 bg-[#06e7f0] text-white font-semibold text-xs leading-normal uppercase rounded shadow-md hover:bg-[#049da3] hover:shadow-lg focus:bg-bg-[#049da3] focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out flex align-center cursor-pointer disabled:cursor-not-allowed text-[.8rem]"
        disabled={noteTitle != "" && bookmarkNote != "" && bookmarkTags.length > 0 ? false : true}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="download"
          className="w-4 mr-2 text-black"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
          ></path>
        </svg>
        Save Bookmark
      </button>
    </div>
  );
}
