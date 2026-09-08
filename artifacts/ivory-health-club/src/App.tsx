import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AnimatePresence } from 'framer-motion';

// Layouts
import { MainLayout } from '@/components/layout/main-layout';
import { AdminLayout } from '@/components/layout/admin-layout';

// Main Pages
import Home from '@/pages/home';
import Services from '@/pages/services';
import Membership from '@/pages/membership';
import Enroll from '@/pages/enroll';
import ProgramEnroll from '@/pages/program-enroll';
import Programs from '@/pages/programs';
import Gallery from '@/pages/gallery';
import BlogList from '@/pages/blog';
import BlogPost from '@/pages/blog-post';
import Book from '@/pages/book';
import Contact from '@/pages/contact';
import About from '@/pages/about';
import Restaurant from '@/pages/restaurant';
import JuiceBar from '@/pages/juice-bar';
import {
  Academies,
  AcademyDetail,
  FitnessPrograms,
  KidsYouthPrograms,
  SummerCamp,
} from '@/pages/program-pages';

// Admin Pages
import AdminDashboard from '@/pages/admin/dashboard';
import AdminEnrollments from '@/pages/admin/enrollments';
import AdminBookings from '@/pages/admin/bookings';
import AdminMessages from '@/pages/admin/messages';
import AdminBlog from '@/pages/admin/blog';
import AdminGallery from '@/pages/admin/gallery';
import AdminMemberships from '@/pages/admin/memberships';
import AdminLogin from '@/pages/admin/login';

const queryClient = new QueryClient();

function MainRoutes() {
  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/membership" component={Membership} />
          <Route path="/enroll" component={Enroll} />
          <Route path="/program-enroll" component={ProgramEnroll} />
          <Route path="/programs" component={Programs} />
          <Route path="/programs/fitness" component={FitnessPrograms} />
          <Route path="/programs/kids-youth" component={KidsYouthPrograms} />
          <Route path="/programs/summer-camp" component={SummerCamp} />
          <Route path="/programs/academies" component={Academies} />
          <Route path="/programs/academies/soccer">
            <AcademyDetail academy="soccer" />
          </Route>
          <Route path="/programs/academies/tennis">
            <AcademyDetail academy="tennis" />
          </Route>
          <Route path="/programs/academies/swimming">
            <AcademyDetail academy="swimming" />
          </Route>
          <Route path="/programs/academies/basketball">
            <AcademyDetail academy="basketball" />
          </Route>
          <Route path="/gallery" component={Gallery} />
          <Route path="/blog" component={BlogList} />
          <Route path="/blog/:id" component={BlogPost} />
          <Route path="/book" component={Book} />
          <Route path="/contact" component={Contact} />
          <Route path="/about" component={About} />
          <Route path="/restaurant" component={Restaurant} />
          <Route path="/juice-bar" component={JuiceBar} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
    </MainLayout>
  );
}

function AdminRoutes() {
  const [authState, setAuthState] = useState<
    'checking' | 'authenticated' | 'signed-out'
  >('checking');

  useEffect(() => {
    let isCurrent = true;
    fetch('/api/auth/admin/session', { credentials: 'include' })
      .then((response) => {
        if (isCurrent) {
          setAuthState(response.ok ? 'authenticated' : 'signed-out');
        }
      })
      .catch(() => {
        if (isCurrent) setAuthState('signed-out');
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  if (authState === 'checking') {
    return (
      <div className="min-h-[100dvh] bg-secondary flex items-center justify-center text-primary">
        Checking admin session…
      </div>
    );
  }

  if (authState === 'signed-out') {
    return <AdminLogin onSuccess={() => setAuthState('authenticated')} />;
  }

  async function handleSignOut() {
    await fetch('/api/auth/admin/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setAuthState('signed-out');
  }

  return (
    <AdminLayout onSignOut={handleSignOut}>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/enrollments" component={AdminEnrollments} />
        <Route path="/admin/bookings" component={AdminBookings} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/gallery" component={AdminGallery} />
        <Route path="/admin/memberships" component={AdminMemberships} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={AdminRoutes} />
      <Route path="/admin/*" component={AdminRoutes} />
      <Route path="/*" component={MainRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
