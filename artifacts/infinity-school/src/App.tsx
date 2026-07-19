import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import Admission from "@/pages/admission";
import About from "@/pages/about";
import Faculty from "@/pages/faculty";
import Gallery from "@/pages/gallery";
import Hostel from "@/pages/hostel";
import Blog from "@/pages/blog";

// Teacher portal pages
import TeacherLogin from "@/pages/teacher/login";
import TeacherDashboard from "@/pages/teacher/dashboard";
import LessonPlans from "@/pages/teacher/lesson-plans";
import Homework from "@/pages/teacher/homework";
import StudyMaterial from "@/pages/teacher/study-material";
import Notices from "@/pages/teacher/notices";
import Profile from "@/pages/teacher/profile";

// Admin panel pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminTeachers from "@/pages/admin/teachers";

const queryClient = new QueryClient();

function TeacherRoutes() {
  return (
    <Switch>
      <Route path="/teacher/login" component={TeacherLogin} />
      <Route path="/teacher/dashboard" component={TeacherDashboard} />
      <Route path="/teacher/lesson-plans" component={LessonPlans} />
      <Route path="/teacher/homework" component={Homework} />
      <Route path="/teacher/study-material" component={StudyMaterial} />
      <Route path="/teacher/notices" component={Notices} />
      <Route path="/teacher/profile" component={Profile} />
      <Route path="/teacher" component={TeacherLogin} />
    </Switch>
  );
}

function AdminRoutes() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/teachers" component={AdminTeachers} />
      <Route path="/admin" component={AdminLogin} />
    </Switch>
  );
}

function PublicRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/faculty" component={Faculty} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/hostel" component={Hostel} />
        <Route path="/admission" component={Admission} />
        <Route path="/faq" component={FAQ} />
        <Route path="/contact" component={Contact} />
        <Route path="/blog" component={Blog} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin panel — own layout */}
      <Route path="/admin/:rest*" component={AdminRoutes} />
      <Route path="/admin" component={AdminRoutes} />

      {/* Teacher portal — own layout with sidebar */}
      <Route path="/teacher/:rest*" component={TeacherRoutes} />
      <Route path="/teacher" component={TeacherRoutes} />

      {/* Public school website */}
      <Route component={PublicRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
