import { Switch, Route, Redirect, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider } from "@/lib/preferences";
import NotFound from "@/pages/not-found";

// Primary structure
import Home from "@/pages/home";
import About from "@/pages/about";
import AboutMe from "@/pages/about-me";
import Services from "@/pages/services";
import Portfolio from "@/pages/portfolio";
import Praxis from "@/pages/praxis";
import PraxisProgramme from "@/pages/praxis-programme";
import Calendar from "@/pages/calendar";
import Pythia from "@/pages/pythia";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Contact from "@/pages/contact";
import Sharepoint from "@/pages/sharepoint";
import FicheCapacites from "@/pages/fiche-capacites";

// Unlisted: reachable by direct link, deliberately absent from the nav so any
// URL already shared with a client keeps working.
import GtmOrchestrator from "@/pages/gtm-orchestrator";
import BecomeATrainer from "@/pages/become-a-trainer";
import PraxisLearn from "@/pages/praxis-learn";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminLogin from "@/pages/admin-login";
import AdminSetup from "@/pages/admin-setup";

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
        {/* Primary structure */}
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/about/me" component={AboutMe} />
        <Route path="/services" component={Services} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/praxis" component={Praxis} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/pythia" component={Pythia} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/contact" component={Contact} />
        <Route path="/sharepoint" component={Sharepoint} />
        <Route path="/fiche-capacites" component={FicheCapacites} />

        {/* Unlisted */}
        {/* The explainer had its own page for a day; it now opens the home page.
            The URL stays alive so anything already shared still lands. */}
        <Route path="/how-ai-works-here">{() => <Redirect to="/" />}</Route>
        <Route path="/praxis-programme" component={PraxisProgramme} />
        <Route path="/gtm-orchestrator" component={GtmOrchestrator} />
        <Route path="/become-a-trainer" component={BecomeATrainer} />
        <Route path="/praxis/learn/:course/:lesson" component={PraxisLearn} />
        <Route path="/praxis/learn/:course" component={PraxisLearn} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/setup" component={AdminSetup} />

        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          </TooltipProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}

export default App;
