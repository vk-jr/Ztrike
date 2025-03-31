import { useState, useEffect, createContext, useContext } from "react";
import { Switch, Route, useLocation, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
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
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Create auth context
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

// Private route component that redirects to login if not authenticated
function PrivateRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <Component {...rest} /> : null;
}

// Public route that redirects to feed if already authenticated
function PublicRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [, navigate] = useLocation();
  const [isLoginRoute] = useRoute('/login');
  const [isRegisterRoute] = useRoute('/register');
  
  useEffect(() => {
    if (!loading && isAuthenticated && (isLoginRoute || isRegisterRoute)) {
      navigate('/feed');
    }
  }, [isAuthenticated, loading, navigate, isLoginRoute, isRegisterRoute]);
  
  if (loading && (isLoginRoute || isRegisterRoute)) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={(props) => <PublicRoute component={Login} {...props} />} />
      <Route path="/register" component={(props) => <PublicRoute component={Register} {...props} />} />
      <Route path="/" component={(props) => <PrivateRoute component={Feed} {...props} />} />
      <Route path="/feed" component={(props) => <PrivateRoute component={Feed} {...props} />} />
      <Route path="/network" component={(props) => <PrivateRoute component={Network} {...props} />} />
      <Route path="/leagues" component={(props) => <PrivateRoute component={Leagues} {...props} />} />
      <Route path="/teams" component={(props) => <PrivateRoute component={Teams} {...props} />} />
      <Route path="/teams/selection/:id" component={(props) => <PrivateRoute component={TeamSelectionDetail} {...props} />} />
      <Route path="/teams/:id" component={(props) => <PrivateRoute component={TeamDetail} {...props} />} />
      <Route path="/messages" component={(props) => <PrivateRoute component={Messages} {...props} />} />
      <Route path="/notifications" component={(props) => <PrivateRoute component={Notifications} {...props} />} />
      <Route path="/create-account" component={(props) => <PrivateRoute component={CreateAccount} {...props} />} />
      <Route path="/profile/:id" component={(props) => <PrivateRoute component={Profile} {...props} />} />
      <Route path="/settings" component={(props) => <PrivateRoute component={Settings} {...props} />} />
      <Route path="/settings/appearance" component={(props) => <PrivateRoute component={Settings} {...props} />} />
      <Route path="/settings/profile" component={(props) => <PrivateRoute component={Settings} {...props} />} />
      <Route path="/settings/privacy" component={(props) => <PrivateRoute component={Settings} {...props} />} />
      <Route path="/settings/notifications" component={(props) => <PrivateRoute component={Settings} {...props} />} />
      <Route path="/settings/accessibility" component={(props) => <PrivateRoute component={Settings} {...props} />} />
      <Route path="/settings/language" component={(props) => <PrivateRoute component={Settings} {...props} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        const data = await response.json();
        return data.user;
      } catch (error) {
        return null;
      }
    },
  });
  
  useEffect(() => {
    if (!isLoading) {
      setUser(data);
    }
  }, [data, isLoading]);
  
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      queryClient.clear();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated: !!user, 
        user, 
        loading: isLoading,
        setUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function AppLayout() {
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoginRoute] = useRoute('/login');
  const [isRegisterRoute] = useRoute('/register');
  
  // Don't show header and footer on login/register pages
  const showHeaderFooter = isAuthenticated || (!isLoginRoute && !isRegisterRoute);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showHeaderFooter && <Header />}
      <main className={`flex-grow ${showHeaderFooter ? 'pt-16 pb-16 md:pb-5' : ''}`}>
        <Router />
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppLayout />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
