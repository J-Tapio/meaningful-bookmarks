// Wails runtime
import { EventsOn, EventsOnce } from "../../wailsjs/runtime";
// Store
import {
  BookmarkState,
  BookmarkActions,
  bookmarkStore,
} from "../store/bookmark";
// Components
import MdNotes from "../components/markdown/MdEditor";
import SkeletonLoader from "../components/create/SkeletonLoader";
import PreviewThumbNail from "../components/create/PreviewThumbnail";
import SaveButton from "../components/create/SaveButton";
import PageScreenshot from "../components/create/PageScreenshot";
import TagInput from "../components/create/TagInput";
import NoteTitle from "../components/create/NoteTitle";
import UploadProgress from "../components/create/UploadProgress";

//==============================================================================
// If clipboard package not available - error while initializing
function UrlInput() {
  return (
    <div className="lg:max-w-[50%]">
      <input
        type="url"
        className="form-input text-black focus:border-slate-100 rounded"
      />
    </div>
  );
}

//------------------------------------------------------------------------------
export default function Create() {
  let {
    pageURL,
    pageImg,
    pageImgErr,
    pageImgLoaded,
    showUploadState,
    showURLInput,
  } = bookmarkStore((state: BookmarkState) => state);

  let {
    setPageURL,
    setPageImg,
    setPageImgLoaded,
    setPageImgErr,
    setShowURLInput,
    setUploadSuccess,
  } = bookmarkStore((state: BookmarkActions) => state);

  // Events emitted from Go
  EventsOnce("clipboard not available", () => setShowURLInput(true));

  EventsOnce("url", (url: string) => {
    //TODO: If copying link from other sources to notes - avoid re-initialization of bookmark creation and image fetch!
    setPageURL(url);
    setPageImgLoaded(false);
  });

  EventsOnce("screenshotImg", (imageData: string) => {
    setPageImg(imageData);
    setPageImgLoaded(true);
  });
  EventsOnce("screenshotErr", () => setPageImgErr(true));
  EventsOnce("Document uploaded successfully", () => setUploadSuccess(true));

  
  // If uploading document -> show upload progress
  // Else -> show components related to bookmark creation
  return (
    <>
      {showUploadState && <UploadProgress />}
      {!showUploadState && (
        <div className="px-10 pb-4 pt-6 flex-col m-auto max-w-[1200px]">
          <h1 className="font-semibold text-4xl">
            Create a meaningful bookmark
          </h1>
          <p className="font-semibold mt-12 text-3xl truncate w-[90%]">
            {pageURL ? `Page - ${pageURL}` : "Copy the page to the clipboard to proceed"}
          </p>
          <div className="pb-6 pt-6 flex-col justify-center space-y-12">
            {showURLInput && <UrlInput />}
            {!pageImgErr && !pageImgLoaded && pageURL && <SkeletonLoader />}
            {!pageImgErr && pageImgLoaded && pageURL && (
              <>
                <PageScreenshot imgSrc={pageImg} />
                <NoteTitle />
                <MdNotes />
                <TagInput />
                <SaveButton />
              </>
            )}

            {pageImgErr ||
              (!pageURL && !pageImgLoaded && (
                <>
                  <PreviewThumbNail
                    text={"Waiting for url to fetch the screenshot of the page"}
                    pulsate={true}
                  />
                </>
              ))}
            {pageURL && pageImgLoaded && pageImgErr && (
              <>
                <PreviewThumbNail
                  pulsate={false}
                  text={
                    "Unfortunately preview image not available of the site."
                  }
                />
                <NoteTitle />
                <MdNotes />
                <TagInput />
                <SaveButton />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
