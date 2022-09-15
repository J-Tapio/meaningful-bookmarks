// When fetching image of the page
export default function SkeletonLoader() {
  return (
    <div className="max-w-full h-[400px] border border-gray-700 shadow rounded-lg p-4 w-full">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-700 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-gray-700 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-gray-700 rounded col-span-2"></div>
              <div className="h-2 bg-gray-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-gray-700 rounded"></div>
            <div className="h-2 bg-gray-700 rounded"></div>
            <div className="h-2 bg-gray-700 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-gray-700 rounded col-span-1"></div>
              <div className="h-2 bg-gray-700 rounded col-span-2"></div>
              <div className="h-40 col-span-3 bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-700 rounded col-span-3 text-center text-white font-bold">
                <p className="my-1">FETCHING SCREENSHOT OF THE PAGE</p>
              </div>
              <div className="h-2 bg-gray-700 rounded col-span-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}