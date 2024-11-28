import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Homepage } from "./pages/Homepage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Profile } from "./pages/Profile";
import { NewRecipe } from "./pages/NewRecipe";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="absolute inset-y-10 -z-10 mt-[10vh] overflow-hidden">
          <img src="background.svg" className="w-[100vw]" />
        </div>

        <Routes>
          <Route path="/" element={<Homepage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/new-recipe" element={<NewRecipe />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
