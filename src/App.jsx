/* import { useState } from "react"; */
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DefaultLayout from "./layouts/DefaultLayout";

import { DataContextProvider } from "./context/dataContext";

import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";

function App() {
  return (
    <>
      <DataContextProvider>
        <BrowserRouter>
          <Routes>
            <Route Component={DefaultLayout}>
              <Route index Component={HomePage} />
              <Route path="/aboutUs" Component={AboutUsPage} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataContextProvider>
    </>
  );
}

export default App;
