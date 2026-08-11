import { createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import MainLayout from "./Layout/MainLayout";
import { SidebarProvider } from "./components/ui/sidebar";
import ProtAuth from "./Auth/ProtAuth";
import Login from "./components/Login/Login";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./Auth/ProtectedRoute";
import AuthLayout from "./Layout/AuthLayout";

import GatesList from "./Pages/Gates/GatesList";
import BeachesList from "./Pages/Beaches/BeachesList";
import PoolsList from "./Pages/Pools/PoolsList";
import InsideGatesList from "./Pages/InsideGates/InsideGatesList";
import Profile from "./Pages/Profile";

import GateDashboard from "./Pages/Gates/GateDashboard";
import GateVisitorsSearch from "./Pages/Gates/GateVisitorsSearch";
import GateUsersSearch from "./Pages/Gates/GateUsersSearch";
import BeachDashboard from "./Pages/Beaches/BeachDashboard";
import BeachUsersSearch from "./Pages/Beaches/BeachUsersSearch";
import PoolDashboard from "./Pages/Pools/PoolDashboard";
import PoolUsersSearch from "./Pages/Pools/PoolUsersSearch";
import InsideGateDashboard from "./Pages/InsideGates/InsideGateDashboard";
import InsideGateUsersSearch from "./Pages/InsideGates/InsideGateUsersSearch";
import InsideGateVisitorsSearch from "./Pages/InsideGates/InsideGateVisitorsSearch";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <ProtAuth>
            <Login />
          </ProtAuth>
        ),
      },
    ],
  },

  {
    element: (
      <SidebarProvider>
        <MainLayout />
      </SidebarProvider>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute permissionKey="Home">
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/gates",
        element: <GatesList />,
      },
      {
        path: "/beaches",
        element: <BeachesList />,
      },
      {
        path: "/pools",
        element: <PoolsList />,
      },
      {
        path: "/inside-gates",
        element: <InsideGatesList />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/gates/:id",
        element: <GateDashboard />,
      },
      {
        path: "/gates/:id/visitors",
        element: <GateVisitorsSearch />,
      },
      {
        path: "/gates/:id/users",
        element: <GateUsersSearch />,
      },
      {
        path: "/beaches/:id",
        element: <BeachDashboard />,
      },
      {
        path: "/beaches/:id/users",
        element: <BeachUsersSearch />,
      },
      {
        path: "/pools/:id",
        element: <PoolDashboard />,
      },
      {
        path: "/pools/:id/users",
        element: <PoolUsersSearch />,
      },
      {
        path: "/inside-gates/:id",
        element: <InsideGateDashboard />,
      },
      {
        path: "/inside-gates/:id/users",
        element: <InsideGateUsersSearch />,
      },
      {
        path: "/inside-gates/:id/visitors",
        element: <InsideGateVisitorsSearch />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
