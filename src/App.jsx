import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Common
import ProtectedRoute from "./components/common/ProtectedRoute";

// Student Layout
import StudentLayout from "./layouts/StudentLayout";

// Student Pages
import Dashboard from "./pages/Dashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import MyComplaints from "./pages/MyComplaints";
import Notices from "./pages/Notices";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

// Warden Layout
import WardenLayout from "./layouts/WardenLayout";

// Warden Pages
import WardenDashboard from "./pages/warden/Dashboard";
import ManageComplaints from "./pages/warden/ManageComplaints";
import ComplaintDetails from "./pages/warden/ComplaintDetails";
import WardenNotices from "./pages/warden/Notices";
import WardenProfile from "./pages/warden/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ====================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* =====================================================
            STUDENT ROUTES
        ====================================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRole="STUDENT"
            />
          }
        >
          <Route element={<StudentLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/submit-complaint"
              element={<SubmitComplaint />}
            />

            <Route
              path="/my-complaints"
              element={<MyComplaints />}
            />

            <Route
              path="/notices"
              element={<Notices />}
            />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

          </Route>
        </Route>

        {/* =====================================================
            WARDEN ROUTES
        ====================================================== */}

        <Route
          path="/warden"
          element={
            <ProtectedRoute
              allowedRole="WARDEN"
            />
          }
        >
          <Route element={<WardenLayout />}>

            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<WardenDashboard />}
            />

            <Route
              path="complaints"
              element={<ManageComplaints />}
            />

            <Route
              path="complaints/:id"
              element={<ComplaintDetails />}
            />

            <Route
              path="notices"
              element={<WardenNotices />}
            />

            <Route
              path="profile"
              element={<WardenProfile />}
            />

          </Route>
        </Route>

        {/* =====================================================
            UNKNOWN ROUTES
        ====================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;