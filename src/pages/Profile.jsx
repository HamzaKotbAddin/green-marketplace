import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = ({ setCurrentPage }) => {
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch the current username when component mounts
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(
            doc(db, "userData", auth.currentUser.uid)
          );
          if (userDoc.exists() && userDoc.data().username) {
            setUsername(userDoc.data().username);
          }
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);

  const handleUsernameUpdate = async () => {
    try {
      if (!auth.currentUser) {
        setStatusMessage("You must be logged in to update your username");
        return;
      }

      if (!username.trim()) {
        setStatusMessage("Username cannot be empty");
        return;
      }

      const userRef = doc(db, "userData", auth.currentUser.uid);
      await updateDoc(userRef, { username });

      setIsEditing(false);
      setStatusMessage("Username updated successfully!");

      setTimeout(() => setStatusMessage(""), 3000);
    } catch (error) {
      console.error("Error updating username:", error);
      setStatusMessage(`Failed to update: ${error.message}`);
    }
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>

      <div className="username-section">
        <label>Username: </label>
        {isEditing ? (
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        ) : (
          <span>{username || "No username set"}</span>
        )}
      </div>

      <div className="button-section">
        {isEditing ? (
          <>
            <button onClick={handleUsernameUpdate}>Save</button>
            <button
              onClick={() => {
                setIsEditing(false);
                // Reset to original value if cancel is clicked
                const fetchUsername = async () => {
                  try {
                    if (auth.currentUser) {
                      const userDoc = await getDoc(
                        doc(db, "userData", auth.currentUser.uid)
                      );
                      if (userDoc.exists() && userDoc.data().username) {
                        setUsername(userDoc.data().username);
                      }
                    }
                  } catch (error) {
                    console.error("Error fetching username:", error);
                  }
                };
                fetchUsername();
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit Username</button>
        )}
      </div>

      {statusMessage && <div className="status-message">{statusMessage}</div>}

      <button className="back-button" onClick={() => setCurrentPage("home")}>
        Back to Home
      </button>
    </div>
  );
};

export default Profile;
