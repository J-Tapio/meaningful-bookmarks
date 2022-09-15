// Store
import { BookmarkActions, BookmarkState, bookmarkStore } from "../../store/bookmark";

//==============================================================================

//? Should this be displayed when image not available?
const backupImg = "https://ik.imagekit.io/htg3gsxgz/Bookmarks/mb-thumbnail_5DEDY0Ao4.png?ik-sdk-version=javascript-1.4.3&updatedAt=1662830162991"


export default function PageScreenshot({ imgSrc }: {imgSrc: string}) {
  const {pageImgLoaded} = bookmarkStore((state: BookmarkState) => state)
  const {setPageImgLoaded} = bookmarkStore((state: BookmarkActions) => state)

  return (
    <div className={pageImgLoaded ? "block": "hidden"}>
      <img
        src={imgSrc}
        onLoad={() => {setPageImgLoaded(true)}}
        className="h-auto rounded-lg"
        alt="screenshot of page"
      />
    </div>
  );
}
