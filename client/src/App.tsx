import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Feed from "@/pages/Feed";
import Network from "@/pages/Network";
import Leagues from "@/pages/Leagues";
import Teams from "@/pages/Teams";
import TeamDetail from "@/pages/TeamDetail";
import TeamSelectionDetail from "@/pages/TeamSelectionDetail";
import Messages from "@/pages/Messages";
import Notifications from "@/pages/Notifications";
import CreateAccount from "@/pages/CreateAccount";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Feed} />
      <Route path="/network" component={Network} />
      <Route path="/leagues" component={Leagues} />
      <Route path="/teams" component={Teams} />
      <Route path="/teams/selection/:id" component={TeamSelectionDetail} />
      <Route path="/teams/:id" component={TeamDetail} />
      <Route path="/messages" component={Messages} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/create-account" component={CreateAccount} />
      <Route path="/profile/:id" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/settings/appearance" component={Settings} />
      <Route path="/settings/profile" component={Settings} />
      <Route path="/settings/privacy" component={Settings} />
      <Route path="/settings/notifications" component={Settings} />
      <Route path="/settings/accessibility" component={Settings} />
      <Route path="/settings/language" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-neutral-100">
        <Header />
        <main className="flex-grow pt-16 pb-16 md:pb-5">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
