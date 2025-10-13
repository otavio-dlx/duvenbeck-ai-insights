import { LoginGate } from "@/components/LoginGate";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TaggingProvider } from "@/contexts/TaggingContext";
import "@/i18n/config";
import { Dashboard } from "@/pages/Dashboard";
import PriorityAnalysisPage from "@/pages/PriorityAnalysis";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TaggingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LoginGate>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/priority-analysis"
                element={<PriorityAnalysisPage />}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LoginGate>
        </BrowserRouter>
      </TooltipProvider>
    </TaggingProvider>
  </QueryClientProvider>
);

export default App;
