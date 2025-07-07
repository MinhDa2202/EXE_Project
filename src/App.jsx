import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllProducts } from "./Features/productsSlice";
import useStoreWebsiteDataToLocalStorage from "./Hooks/App/useStoreWebsiteDataToLocalStorage";
import useChangeLangDirOnKeys from "./Hooks/Helper/useChangeLangDirOnKeys";
import AppRoutes from "./Routes/AppRoutes";

function App() {
  const dispatch = useDispatch();
  useStoreWebsiteDataToLocalStorage();
  // useChangeLangDirOnKeys();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
