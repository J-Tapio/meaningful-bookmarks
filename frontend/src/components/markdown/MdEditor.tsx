// Markdown-it parser, Markdown editor, related css assets
import mdParser from './mdParser';
import MdTool, { Plugins } from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './editor.css';
import './prism.css'
// Store
import { BookmarkState, BookmarkActions, bookmarkStore } from "../../store/bookmark";

//==============================================================================
// Adds tab-insert plugin so focus not lost when tab key used
MdTool.use(Plugins.TabInsert, { tabMapValue: 1 });

export default function MdEditor() {
  const { bookmarkNote } = bookmarkStore((state:BookmarkState) => state)
  const { setBookmarkNote } = bookmarkStore((state:BookmarkActions) => state);

  return (
    <div>
      <p className="font-semibold text-3xl dark:text-white">Notes</p>
      <MdTool
        style={{ height: "500px", marginTop: "1.5rem"}}
        config={{
          view: {
            menu: true,
            md: true,
            html: true,
          },
          canView: {
            menu: true,
            md: false,
            html: true,
            both: true,
            fullScreen: true,
            hideMenu: true,
          },
          table: {
            maxRow: 5,
            maxCol: 6,
          },
        }}
        value={bookmarkNote}
        onChange={({ text, html }) => {
          //console.log(html);
          setBookmarkNote(text);
        }}
        renderHTML={(text) => mdParser.render(text)}
      />
    </div>
  );
}