/* import { useState } from "react"; */
import { HashRouter, Routes, Route } from "react-router-dom";

import DefaultLayout from "./layouts/DefaultLayout";

import { DataContextProvider } from "./context/dataContext";

import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";

function App() {
  return (
    <DataContextProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<HomePage />} />
            <Route path="aboutUs" element={<AboutUsPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </DataContextProvider>
  );
}

export default App;
