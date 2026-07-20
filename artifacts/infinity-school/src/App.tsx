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
import Disclosure from "@/pages/disclosure";
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
import TeacherTimetable from "@/pages/teacher/timetable";
import TeacherTasks from "@/pages/teacher/tasks";
import TeacherLeave from "@/pages/teacher/leave";

// Admin panel pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminTeachers from "@/pages/admin/teachers";
import AdminNotices from "@/pages/admin/notices";
import AdminStudents from "@/pages/admin/students";
import AdminAdmissions from "@/pages/admin/admissions";
import AdminLeave from "@/pages/admin/leave";
import AdminTimetable from "@/pages/admin/timetable";
import AdminTeacherTasks from "@/pages/admin/teacher-tasks";
import AdminDisclosures from "@/pages/admin/disclosures";

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
      <Route path="/teacher/timetable" component={TeacherTimetable} />
      <Route path="/teacher/tasks" component={TeacherTasks} />
      <Route path="/teacher/leave" component={TeacherLeave} />
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
      <Route path="/admin/notices" component={AdminNotices} />
      <Route path="/admin/students" component={AdminStudents} />
      <Route path="/admin/admissions" component={AdminAdmissions} />
      <Route path="/admin/leave" component={AdminLeave} />
      <Route path="/admin/timetable" component={AdminTimetable} />
      <Route path="/admin/teacher-tasks" component={AdminTeacherTasks} />
      <Route path="/admin/disclosures" component={AdminDisclosures} />
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
        <Route path="/disclosure" component={Disclosure} />
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
