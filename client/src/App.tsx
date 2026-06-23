import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Praxis from "@/pages/praxis";
import Pythia from "@/pages/pythia";
import About from "@/pages/about";
import SecondBrain from "@/pages/second-brain";
import LegalRag from "@/pages/legalrag";
import BecomeATrainer from "@/pages/become-a-trainer";
import PraxisLearn from "@/pages/praxis-learn";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={About} />
        <Route path="/blog" component={Blog} />
        <Route path="/praxis" component={Praxis} />
        <Route path="/praxis-programme" component={Praxis} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/pythia" component={Pythia} />
        <Route path="/about" component={About} />
        <Route path="/second-brain" component={SecondBrain} />
        <Route path="/legalrag" component={LegalRag} />
        <Route path="/become-a-trainer" component={BecomeATrainer} />
        <Route path="/praxis/learn/:course/:lesson" component={PraxisLearn} />
        <Route path="/praxis/learn/:course" component={PraxisLearn} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
