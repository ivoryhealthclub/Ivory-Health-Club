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
import Programs from '@/pages/programs';
import Gallery from '@/pages/gallery';
import BlogList from '@/pages/blog';
import BlogPost from '@/pages/blog-post';
import Book from '@/pages/book';
import Contact from '@/pages/contact';

// Admin Pages
import AdminDashboard from '@/pages/admin/dashboard';
import AdminEnrollments from '@/pages/admin/enrollments';
import AdminBookings from '@/pages/admin/bookings';
import AdminMessages from '@/pages/admin/messages';
import AdminBlog from '@/pages/admin/blog';
import AdminGallery from '@/pages/admin/gallery';
import AdminMemberships from '@/pages/admin/memberships';

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
          <Route path="/programs" component={Programs} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/blog" component={BlogList} />
          <Route path="/blog/:id" component={BlogPost} />
          <Route path="/book" component={Book} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
    </MainLayout>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
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
      <Route path="/admin*" component={AdminRoutes} />
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
