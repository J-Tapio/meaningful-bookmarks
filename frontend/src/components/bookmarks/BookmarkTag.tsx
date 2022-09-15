export default function BookmarkTag({ tag }: { tag: string }) {
  return (
    <span className="px-4 py-1 rounded-full text-gray-700 hover:text-gray-900 dark:text-slate-800 bg-gray-200 dark:bg-slate-200 font-semibold text-sm flex align-center w-max hover:bg-gray-500 dark:hover:bg-slate-400">
      {tag}
    </span>
  );
}
