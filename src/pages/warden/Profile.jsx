import { useEffect, useState } from "react";
import { apiRequest, clearAuthToken } from "../../services/api";
import "../../styles/wardenProfile.css";

function Profile() {
  const [profileImage, setProfileImage] = useState(null);

  const [profile, setProfile] = useState(null);
  const [editForm, setEditForm] = useState({
    email: "",
    phone: "",
    hostelName: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest("/profile");

        setProfile(data);

        setEditForm({
          email: data.email || "",
          phone: data.phone || "",
          hostelName: data.hostelName || "",
        });
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

  const handleEdit = () => {
    setEditForm({
      email: profile.email || "",
      phone: profile.phone || "",
      hostelName: profile.hostelName || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditForm({
      email: profile.email || "",
      phone: profile.phone || "",
      hostelName: profile.hostelName || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const emailChanged = editForm.email !== profile.email;

      const updatedProfile = await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify({
          email: editForm.email,
          phone: editForm.phone,
          hostelName: editForm.hostelName,
        }),
      });

      setProfile(updatedProfile);

      setEditForm({
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || "",
        hostelName: updatedProfile.hostelName || "",
      });

      setIsEditing(false);

      // JWT still contains the old email, so force re-login
      if (emailChanged) {
        clearAuthToken();
        window.location.assign("/login");
        return;
      }

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile:", err);

      setError(
        err.message ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill in all password fields."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setIsChangingPassword(true);

      await apiRequest("/profile/password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordSuccess(
        "Password changed successfully."
      );
    } catch (err) {
      console.error("Failed to change password:", err);

      setPasswordError(
        err.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setIsChangingPassword(false);
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

  if (error && !profile) {
    return (
      <div className="warden-profile-page">
        <div className="warden-profile-card">
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="warden-profile-page">
        <div className="warden-profile-card">
          <h2>Profile not found.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="warden-profile-page">
      <div className="warden-profile-card">

        {/* Profile Header */}
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

        {/* Profile Messages */}
        {success && (
          <div className="profile-success-message">
            {success}
          </div>
        )}

        {error && (
          <div className="profile-error-message">
            {error}
          </div>
        )}

        {/* Profile Details */}
        <div className="warden-profile-details">

          {/* Email */}
          <div className="warden-profile-item">
            <span>Email</span>

            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleChange}
                className="profile-edit-input"
              />
            ) : (
              <strong>
                {profile.email || "-"}
              </strong>
            )}
          </div>

          {/* Phone */}
          <div className="warden-profile-item">
            <span>Phone</span>

            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleChange}
                className="profile-edit-input"
              />
            ) : (
              <strong>
                {profile.phone || "-"}
              </strong>
            )}
          </div>

          {/* Hostel */}
          <div className="warden-profile-item">
            <span>Hostel Assigned</span>

            {isEditing ? (
              <input
                type="text"
                name="hostelName"
                value={editForm.hostelName}
                onChange={handleChange}
                className="profile-edit-input"
              />
            ) : (
              <strong>
                {profile.hostelName || "-"}
              </strong>
            )}
          </div>

          {/* Hostel Year */}
          <div className="warden-profile-item">
            <span>Hostel Year</span>
            <strong>
              {profile.hostelYear || "-"}
            </strong>
          </div>

          {/* Room */}
          <div className="warden-profile-item">
            <span>Room Number</span>
            <strong>
              {profile.roomNumber || "-"}
            </strong>
          </div>

          {/* Role */}
          <div className="warden-profile-item">
            <span>Role</span>
            <strong>
              {profile.role || "-"}
            </strong>
          </div>

        </div>

        {/* Profile Picture */}
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

        {/* Edit / Save Buttons */}
        {!isEditing ? (
          <button
            className="edit-btn"
            type="button"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        ) : (
          <div className="profile-edit-actions">

            <button
              className="save-profile-btn"
              type="button"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              className="cancel-profile-btn"
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>

          </div>
        )}

        {/* Change Password */}
        <div className="change-password-section">

          <div className="change-password-header">
            <h3>Change Password</h3>
            <p>
              Update your account password securely.
            </p>
          </div>

          {passwordSuccess && (
            <div className="profile-success-message">
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div className="profile-error-message">
              {passwordError}
            </div>
          )}

          <div className="password-fields">

            {/* Current Password */}
            <div className="password-field">
              <label htmlFor="warden-current-password">
                Current Password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="warden-current-password"
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() =>
                    setShowCurrentPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showCurrentPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                >
                  {showCurrentPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="password-field">
              <label htmlFor="warden-new-password">
                New Password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="warden-new-password"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() =>
                    setShowNewPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showNewPassword
                      ? "Hide new password"
                      : "Show new password"
                  }
                >
                  {showNewPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="password-field">
              <label htmlFor="warden-confirm-password">
                Confirm New Password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="warden-confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

          </div>

          <button
            type="button"
            className="change-password-btn"
            onClick={handleChangePassword}
            disabled={isChangingPassword}
          >
            {isChangingPassword
              ? "Changing Password..."
              : "Change Password"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profile;