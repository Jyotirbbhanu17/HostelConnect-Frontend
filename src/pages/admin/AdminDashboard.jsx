import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "../../services/adminService";
import StatCard from "../../components/admin/StatCard";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminDashboardStats();
        setStats(response?.data ?? response);
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);
        setError("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="dashboard-container">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-container">{error}</div>;
  }

  if (!stats) {
    return (
      <div className="dashboard-container">
        No dashboard data available.
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-stats">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
        />

        <StatCard
          title="Active Students"
          value={stats.activeStudents}
        />

        <StatCard
          title="Inactive Students"
          value={stats.inactiveStudents}
        />

        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints}
        />

        <StatCard
          title="Pending Complaints"
          value={stats.pendingComplaints}
        />

        <StatCard
          title="Resolved Complaints"
          value={stats.resolvedComplaints}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;