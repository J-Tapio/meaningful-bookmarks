import { useEffect } from "react";
import { BookmarkActions, BookmarkState, bookmarkStore } from "../../store/bookmark";

//==============================================================================

export default function UploadProgress() {
  const { uploadSuccess, setShowUploadState, resetBookmark } = bookmarkStore(
    (state: BookmarkState & BookmarkActions) => state
  );

  useEffect(() => {
    if (uploadSuccess) {
      let timer = setTimeout(() => {
        setShowUploadState(false);
        resetBookmark();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  return (
    <div className="flex justify-center items-center h-full w-full m-auto max-w-[1200px]">
      {!uploadSuccess && (
        <div>
          <div className="flex space-x-4">
            <div className="animate-[bounce_1.15s_ease-in-out_infinite] w-16 h-16 bg-[#06e7f0] rounded-full opacity-1"></div>
            <div className="animate-[bounce_1.2s_ease-in-out_infinite] w-16 h-16 bg-[#06e7f0] rounded-full opacity-1"></div>
            <div className="animate-[bounce_1.25s_ease-in-out_infinite] w-16 h-16 bg-[#06e7f0] rounded-full opacity-1"></div>
          </div>
          <p className="mt-2 text-center">Uploading...</p>
        </div>
      )}
      {uploadSuccess && (
        <p className="text-[#06e7f0] font-bold text-4xl">
          Bookmark saved successfully!
        </p>
      )}
    </div>
  );
}
