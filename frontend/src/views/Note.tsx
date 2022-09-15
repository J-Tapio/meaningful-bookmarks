// Markdown-it parser, Markdown editor and style assets
import mdParser from "../components/markdown/mdParser";
import MdTool from "react-markdown-editor-lite";
import "../components/markdown/prism.css";
import "../components/markdown/preview.css";
// Store
import { BookmarkActions, bookmarkStore } from "../store/bookmark";

//==============================================================================
// Using markdown editor as a way to preview the markdown document
function NotePreview({ note }: { note: string }) {
  return (
    <div className="preview">
      <MdTool
        className="h-auto"
        config={{
          view: {
            menu: false,
            md: false,
            html: true,
          },
          canView: {
            menu: false,
            md: false,
            both: false,
            fullScreen: false,
            hideMenu: false,
          },
        }}
        value={note}
        renderHTML={(note) => mdParser.render(note)}
      />
    </div>
  );
}

//------------------------------------------------------------------------------
interface Note {
  id: string;
  noteTitle: string;
  pageURL: string;
  imageURL: string;
  note: string | number[]; //converted to base64 when result comes back from Mongo
  tags: string[];
  created_at: number;
  updated_at: number;
}

export default function Note({ note }: { note: Note }) {
  const { setSelectedBookmark } = bookmarkStore(
    (state:BookmarkActions) => state
  );
  const noteBase64 = note.note as string;

  function formatTimeStamp(timestamp: number): string {
    let date = new Date(timestamp);
    return (
      date.toLocaleDateString("en-us", { dateStyle: "medium" }) +
      " - " +
      date.toLocaleTimeString("en-us", { timeStyle: "short" })
    );
  }

  function hostNameFromURL(bookmarkURL: string): string {
    bookmarkURL = new URL(bookmarkURL).hostname;
    if (bookmarkURL.includes("www.")) {
      bookmarkURL = bookmarkURL.slice(4);
    }
    return bookmarkURL;
  }

  return (
    <div className="pb-4 pt-6 flex-col space-y-4 max-w-[1200px]">
      <h1 className="font-semibold text-4xl">{note.noteTitle}</h1>
      <div className="font-semibold mt-12 text-2xl truncate w-[90%] hover:text-[1.7rem] ease-in-out duration-300">
        <a href={note.pageURL} target="_blank" rel="noopener noreferrer">
          {hostNameFromURL(note.pageURL)}
        </a>
      </div>
      <p className="text-md font-semibold">
        {formatTimeStamp(note.created_at)}
      </p>
      <div className="">
        <img
          src={note.imageURL}
          className="h-auto max-w-full rounded-t-xl"
          alt="screenshot of page"
        />
        {note && <NotePreview note={atob(noteBase64)} />}
      </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setSelectedBookmark(null);
          }}
          className="rounded-bl-xl rounded-tr-xl p-4 dark:text-white font-semibold bg-slate-300 hover:bg-slate-500 dark:bg-[#06e7f0] dark:hover:bg-[#04b5bd] ease-in-out duration-200"
        >
          Go Back
        </button>
    </div>
  );
}
