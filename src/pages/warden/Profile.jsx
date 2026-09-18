import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/wardenProfile.css";

function Profile() {
  const [profileImage, setProfileImage] = useState(null);

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest("/profile");

        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);

        setError(
          err.message ||
            "Unable to load profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  if (isLoading) {
    return (
      <div className="warden-profile-page">
        <div className="warden-profile-card">
          <h2>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="warden-profile-page">
        <div className="warden-profile-card">
          <h2>{error || "Profile not found."}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="warden-profile-page">
      <div className="warden-profile-card">

        <div className="warden-profile-header">

          <div className="warden-profile-avatar">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="warden-profile-image"
              />
            ) : (
              "👨‍💼"
            )}
          </div>

          <div>
            <h2>{profile.fullName}</h2>
            <p>{profile.role}</p>
          </div>

        </div>

        <div className="warden-profile-details">

          <div className="warden-profile-item">
            <span>Email</span>
            <strong>{profile.email || "-"}</strong>
          </div>

          <div className="warden-profile-item">
            <span>Phone</span>
            <strong>{profile.phone || "-"}</strong>
          </div>

          <div className="warden-profile-item">
            <span>Hostel Assigned</span>
            <strong>{profile.hostelName || "-"}</strong>
          </div>

          <div className="warden-profile-item">
            <span>Hostel Year</span>
            <strong>{profile.hostelYear || "-"}</strong>
          </div>

          <div className="warden-profile-item">
            <span>Room Number</span>
            <strong>{profile.roomNumber || "-"}</strong>
          </div>

          <div className="warden-profile-item">
            <span>Role</span>
            <strong>{profile.role || "-"}</strong>
          </div>

        </div>

        <div className="warden-profile-upload">

          <label
            htmlFor="profile-upload"
            className="upload-btn"
          >
            Change Profile Picture
          </label>

          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />

        </div>

        <button
          className="edit-btn"
          type="button"
          onClick={() =>
            alert("Profile editing will be added later.")
          }
        >
          Edit Profile
        </button>

      </div>
    </div>
  );
}

export default Profile;