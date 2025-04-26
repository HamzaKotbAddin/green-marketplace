import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";

const Profile = ({ setCurrentPage }) => {
  const [email, setEmail]                   = useState("");
  const [username, setUsername]             = useState("");
  const [fullName, setFullName]             = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing]           = useState(false);
  const [statusMessage, setStatusMessage]   = useState("");

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      setEmail(user.email || "");
      try {
        const userRef = doc(db, "users", user.uid);
        const snap    = await getDoc(userRef);
        if (snap.exists()) {
          setUsername(snap.data().username || "");
          setFullName(snap.data().fullName  || "");
        }
      } catch (e) {
        console.error("Error fetching profile:", e);
      }
    };
    fetchProfile();
  }, []);

  // Save both names and optionally password
  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    if (!user) {
      setStatusMessage("You must be logged in");
      return;
    }
    if (!username.trim()) {
      setStatusMessage("Username cannot be empty");
      return;
    }
    if (!fullName.trim()) {
      setStatusMessage("Full name cannot be empty");
      return;
    }
    if (password && password !== confirmPassword) {
      setStatusMessage("Passwords do not match");
      return;
    }

    try {
      // 1) Update Firestore user doc
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { username, fullName });

      // 2) If password provided, update it in Auth
      if (password) {
        try {
          await updatePassword(user, password);
        } catch (err) {
          if (err.code === "auth/requires-recent-login") {
            setStatusMessage(
              "Password change requires recent login. Please sign out and sign in again."
            );
          } else {
            setStatusMessage(`Password change failed: ${err.message}`);
          }
          return;
        }
      }

      // Success
      setIsEditing(false);
      setPassword("");
      setConfirmPassword("");
      setStatusMessage("Profile updated successfully!");
    } catch (e) {
      console.error("Error saving profile:", e);
      setStatusMessage(`Failed to save: ${e.message}`);
    }

    setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>

      {statusMessage && (
        <div className="mb-4 text-center text-green-600">{statusMessage}</div>
      )}

      {/* Email (read-only) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Email:</label>
        <p className="text-gray-900">{email}</p>
      </div>

      {/* Username */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Username:</label>
        {isEditing ? (
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <p className="text-gray-900">{username || "—"}</p>
        )}
      </div>

      {/* Full Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Full Name:</label>
        {isEditing ? (
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <p className="text-gray-900">{fullName || "—"}</p>
        )}
      </div>

      {/* Password Change (edit mode only) */}
      {isEditing && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              New Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setPassword("");
                setConfirmPassword("");
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Back to Home */}
      <button
        className="w-full mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
        onClick={() => setCurrentPage("home")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Profile;
