import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Home from "./pages/Home";
import Exploration from "./pages/Exploration";
import Laboratory from "./pages/Laboratory";
import Workspace from "./pages/Workspace";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative min-h-screen">
          <StarfieldBackground />
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exploration" element={<Exploration />} />
            <Route path="/laboratory" element={<Laboratory />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
