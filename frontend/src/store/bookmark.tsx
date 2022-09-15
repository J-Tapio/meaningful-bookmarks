import create from "zustand";

//==============================================================================

type NoteDocument = {
  id: string;
  noteTitle: string;
  pageURL: string;
  imageURL: string;
  note: number[] | string;
  tags: string[];
  created_at: number;
  updated_at: number;
};

export type BookmarkState = {
  showUploadState: boolean;
  uploadSuccess: boolean;
  pageURL: string;
  noteTitle: string;
  bookmarkNote: string;
  bookmarkTags: string[];
  showURLInput: boolean;
  pageImg: string;
  pageImgLoaded: boolean;
  pageImgErr: boolean;
  // When viewing bookmarks & selecting one
  createdBookmarks: NoteDocument[];
  selectedBookmark: NoteDocument | null;
}

export type BookmarkActions = {
  setShowUploadState: (show: boolean) => void;
  setUploadSuccess: (success: boolean) => void;
  setPageURL: (url: string) => void;
  setNoteTitle: (title: string) => void;
  setBookmarkNote: (note: string) => void;
  setBookmarkTags: (tags: string[]) => void;
  setShowURLInput: (showInput: boolean) => void;
  setPageImg: (imgData: string) => void;
  setPageImgLoaded: (loaded: boolean) => void;
  setPageImgErr: (hasError: boolean) => void;
  resetBookmark: () => void;
  // When browsing all bookmarks and selecting one bookmark
  setCreatedBookmarks: (bookmarks: NoteDocument[]) => void;
  setSelectedBookmark: (bookmark: NoteDocument | null) => void;
};

const initialBmState: BookmarkState = {
  pageImg: "",
  pageImgLoaded: false,
  pageImgErr: false,
  pageURL: "",
  showURLInput: false,
  noteTitle: "",
  bookmarkNote: "# Notes \n\n",
  bookmarkTags: [],
  showUploadState: false,
  uploadSuccess: false,
  // When viewing bookmarks & selecting one
  createdBookmarks: [],
  selectedBookmark: null,
};

export const bookmarkStore = create<BookmarkState & BookmarkActions>((set, get) => ({
  ...initialBmState,
  setShowUploadState: (show: boolean) => set((state) => ({ showUploadState: show })),
  setUploadSuccess: (success: boolean) => set((state) => ({ uploadSuccess: success })),
  setPageURL: (url: string) => set((state) => ({ pageURL: url })),
  setNoteTitle: (title: string) => set((state) => ({ noteTitle: title })),
  setBookmarkNote: (note: string) => set((state) => ({ bookmarkNote: note })),
  setBookmarkTags: (tags: string[]) => set((state) => ({ bookmarkTags: tags })),
  setShowURLInput: (showInput: boolean) => set((state) => ({ showURLInput: showInput })),
  setPageImg: (imgData: string) => set((state) => ({ pageImg: imgData })),
  setPageImgLoaded: (loaded: boolean) => set((state) => ({ pageImgLoaded: loaded })),
  setPageImgErr: (hasError: boolean) => set((state) => ({ pageImgErr: hasError })),
  resetBookmark: () => {set(initialBmState)},
  // All bookmarks & selecting bookmark
  setCreatedBookmarks: (bookmarks: NoteDocument[]) => set((state) => ({createdBookmarks: bookmarks})),
  setSelectedBookmark: (bookmark: NoteDocument | null) => set((state) => ({selectedBookmark: bookmark}))
}));