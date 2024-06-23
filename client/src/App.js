import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthorsPage from "./pages/AuthorsPage";
import BooksPage from "./pages/BooksPage";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BooksPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="authors" element={<AuthorsPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
