import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FloatingChat } from "@/components/chat/FloatingChat";
import NotFound from "@/pages/not-found";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Praxis from "@/pages/praxis";
import Pythia from "@/pages/pythia";
import BecomeATrainer from "@/pages/become-a-trainer";
import PraxisLearn from "@/pages/praxis-learn";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Blog} />
      <Route path="/blog" component={Blog} />
      <Route path="/praxis" component={Praxis} />
      <Route path="/praxis-programme" component={Praxis} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/pythia" component={Pythia} />
      <Route path="/become-a-trainer" component={BecomeATrainer} />
      <Route path="/praxis/learn/:course/:lesson" component={PraxisLearn} />
      <Route path="/praxis/learn/:course" component={PraxisLearn} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <FloatingChat />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
