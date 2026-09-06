import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "../styles/notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setError("");

      const data = await apiRequest("/notifications");

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Unable to load notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    // Already read — nothing to do
    if (notification.read === true) {
      return;
    }

    try {
      await apiRequest(`/notifications/${notification.id}/read`, {
        method: "PUT",
      });

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item
        )
      );

      // Tell the header to refresh its unread badge.
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const formatTime = (createdAt) => {
    if (!createdAt) {
      return "";
    }

    return new Date(createdAt).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="notifications-page">
        <div className="notification-empty">
          Loading notifications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-page">
        <div className="notification-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      {notifications.length === 0 ? (
        <div className="notification-empty">
          <div className="notification-empty-icon">🔔</div>
          <p>No notifications yet.</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            className={`notification-card ${
              notification.read ? "notification-read" : "notification-unread"
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="notification-icon">
              🔔
            </div>

            <div className="notification-content">
              <p>{notification.message}</p>

              <span>
                {formatTime(notification.createdAt)}
              </span>
            </div>

            {!notification.read && (
              <span className="notification-dot" />
            )}
          </button>
        ))
      )}
    </div>
  );
}

export default Notifications;