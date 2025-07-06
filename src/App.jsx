import useStoreWebsiteDataToLocalStorage from "./Hooks/App/useStoreWebsiteDataToLocalStorage";
import useLoadLoginFromLocalStorage from "./Hooks/App/useLoadLoginFromLocalStorage";
import AppRoutes from "./Routes/AppRoutes";
import ChatWidget from "./Components/ChatWidget/ChatWidget";


function App() {
  useStoreWebsiteDataToLocalStorage();
  useLoadLoginFromLocalStorage();

  return (
    <>
      <AppRoutes />
      <ChatWidget />
    </>
  );
}

export default App;
