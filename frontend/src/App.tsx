// Layout
import Layout from "./components/Layout";
// Views
import Create from "./views/Create";
import BookMarks from "./views/BookMarks";
// Store
import { AppState, appStore } from './store';

//==============================================================================

function App() {
  const appView = appStore((state: AppState) => state.appView);

  return (
    <Layout>
      {appView === "create" && <Create />}
      {appView === "bookmarks" && <BookMarks />}
    </Layout>
  );
}

export default App;
