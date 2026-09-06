import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "../styles/profile.css";

function Profile() {
  const [student, setStudent] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest("/profile");

        setStudent(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Unable to load your profile. Please try again.");
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
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-loading">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-error">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="profile-header">

          <div className="profile-avatar">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              "👤"
            )}
          </div>

          <div>
            <h2>{student.fullName || "-"}</h2>
            <p>{student.email || "-"}</p>
          </div>

        </div>

        <div className="profile-details">

          <div className="profile-item">
            <span>Enrollment Number</span>
            <strong>
              {student.enrollmentNumber || "-"}
            </strong>
          </div>

          <div className="profile-item">
            <span>Hostel</span>
            <strong>
              {student.hostelName || "-"}
            </strong>
          </div>

          <div className="profile-item">
            <span>Year</span>
            <strong>
              {student.hostelYear || "-"}
            </strong>
          </div>

          <div className="profile-item">
            <span>Room</span>
            <strong>
              {student.roomNumber || "-"}
            </strong>
          </div>

          <div className="profile-item">
            <span>Phone</span>
            <strong>
              {student.phone || "-"}
            </strong>
          </div>

          <div className="profile-item">
            <span>Role</span>
            <strong>
              {student.role || "-"}
            </strong>
          </div>

        </div>

        <div className="profile-upload">
          <label>Profile Photo</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

      </div>
    </div>
  );
}

export default Profile;