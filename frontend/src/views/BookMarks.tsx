import { useEffect } from "react";
import { AllBookmarks, BookmarkById } from "../../wailsjs/go/main/App";
// Components
import Note from "./Note";
import BookmarkCard from "../components/bookmarks/BookmarkCard";
// Store
import {
  BookmarkState,
  BookmarkActions,
  bookmarkStore,
} from "../store/bookmark";

//==============================================================================
//TODO: Reconsider naming of components. Now there is Bookmarks component which shows all the bookmarks, which are BookmarkCard components. When viewing single bookmark there is Note component for that? 

export default function BookMarks() {
  const { createdBookmarks, selectedBookmark } = bookmarkStore(
    (state: BookmarkState) => state
  );

  const { setSelectedBookmark, setCreatedBookmarks } = bookmarkStore(
    (state: BookmarkActions) => state
  );

  async function getAllBookmarks() {
    try {
      setCreatedBookmarks(await AllBookmarks());
    } catch (error) {
      //TODO: Handle error
      console.log(error);
    }
  }

  async function getBookmarkById(id: string) {
    try {
      let bookmark = await BookmarkById(id);
      setSelectedBookmark(bookmark);
    } catch (error) {
      //TODO: Handle error
      console.log(error);
    }
  }

  useEffect(() => {
    getAllBookmarks();
  }, []);

  return (
    <div className="px-6 pb-6 pt-6 flex-col space-y-4 m-auto max-w-[1200px]">
      {!selectedBookmark && !createdBookmarks && (
        <div className="flex-col justify-center">
          <h1 className="font-semibold text-2xl md:text-4xl">
            You havent created any bookmarks yet?
          </h1>
          <h1 className="font-semibold text-2xl md:text-4xl">
            Go and create one!
          </h1>
        </div>
      )}
      {!selectedBookmark && createdBookmarks && createdBookmarks.length > 0 && (
        <>
          <h1 className="font-semibold text-4xl">Bookmarks</h1>
          {createdBookmarks.map((bookmark) => (
            <BookmarkCard
              onClick={(e: any) => {
                e.preventDefault();
                getBookmarkById(bookmark.id);
              }}
              key={bookmark.id}
              noteTitle={bookmark.noteTitle}
              pageURL={bookmark.pageURL}
              createdAt={bookmark.createdAt}
              tags={bookmark.tags}
            />
          ))}
        </>
      )}
      {selectedBookmark && <Note note={selectedBookmark} />}
    </div>
  );
}
