import BookmarkTag from "./BookmarkTag"

type BookmarkCard = {
  noteTitle: string;
  pageURL: string;
  tags: string[];
  createdAt: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
};

export default function BookmarkCard({
  noteTitle,
  pageURL,
  tags,
  createdAt,
  onClick,
}: BookmarkCard) {
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
    <div
      onClick={onClick}
      className="flex-col cursor-pointer bg-slate-100 shadow-md hover:shadow-lg hover:bg-slate-300 dark:bg-slate-800 p-2.5 dark:hover:bg-slate-700 rounded-md"
    >
      <div className="flex justify-between space-x-2 font-semibold">
        <p className="text-2xl">{noteTitle}</p>
        <div className="flex-col text-right space-y-1">
          <p className="text-sm">{formatTimeStamp(createdAt)}</p>
          <p className="text-md">{hostNameFromURL(pageURL)}</p>
        </div>
      </div>
      <div className="flex space-x-3 pt-2">
        {tags.length && tags.map((tag) => <BookmarkTag key={tag} tag={tag} />)}
      </div>
    </div>
  );
}
