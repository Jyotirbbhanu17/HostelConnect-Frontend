import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "../styles/profile.css";

function Profile() {
  const [student, setStudent] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");

        const data = await apiRequest("/profile");

        setStudent(data);
        setPhone(data.phone || "");
      } catch (err) {
        console.error("Failed to load profile:", err);

        setError(
          err.message ||
            "Unable to load your profile. Please try again."
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
    setPhone(student.phone || "");
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setPhone(student.phone || "");
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const updatedProfile = await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify({
          phone: phone,
        }),
      });

      setStudent(updatedProfile);
      setPhone(updatedProfile.phone || "");

      setIsEditing(false);
      setSuccess("Phone number updated successfully.");
    } catch (err) {
      console.error("Failed to update profile:", err);

      setError(
        err.message ||
          "Unable to update your profile. Please try again."
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
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-loading">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (error && !student) {
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

  if (!student) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-error">
            Profile not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* Profile Header */}
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

        {/* Profile Update Messages */}
        {success && (
          <div className="profile-success">
            {success}
          </div>
        )}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {/* Profile Details */}
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

            {isEditing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="profile-edit-input"
                placeholder="Enter phone number"
              />
            ) : (
              <strong>
                {student.phone || "-"}
              </strong>
            )}
          </div>

          <div className="profile-item">
            <span>Role</span>
            <strong>
              {student.role || "-"}
            </strong>
          </div>

        </div>

        {/* Profile Photo */}
        <div className="profile-upload">
          <label>Profile Photo</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Edit Profile */}
        {!isEditing ? (
          <button
            type="button"
            className="profile-edit-btn"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        ) : (
          <div className="profile-edit-actions">

            <button
              type="button"
              className="profile-save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              className="profile-cancel-btn"
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
            <div className="profile-success">
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div className="profile-error">
              {passwordError}
            </div>
          )}

          <div className="password-fields">

            <div className="password-field">
              <label htmlFor="current-password">
                Current Password
              </label>

              <div className="password-input-wrapper">
  <input
    id="current-password"
    type={showCurrentPassword ? "text" : "password"}
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
      setShowCurrentPassword((prev) => !prev)
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

            <div className="password-field">
              <label htmlFor="new-password">
                New Password
              </label>

             <div className="password-input-wrapper">
  <input
    id="new-password"
    type={showNewPassword ? "text" : "password"}
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
      setShowNewPassword((prev) => !prev)
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

            <div className="password-field">
              <label htmlFor="confirm-password">
                Confirm New Password
              </label>

              <div className="password-input-wrapper">
  <input
    id="confirm-password"
    type={showConfirmPassword ? "text" : "password"}
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
      setShowConfirmPassword((prev) => !prev)
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