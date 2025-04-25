import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = ({ setCurrentPage }) => {
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (auth.currentUser) {
          // Fetch from 'users' collection instead of 'userData'
          const userDoc = await getDoc(
            doc(db, "users", auth.currentUser.uid)
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

      // Update in 'users' collection instead of 'userData'
      const userRef = doc(db, "users", auth.currentUser.uid);
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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Profile</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Username:
        </label>
        {isEditing ? (
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <span className="text-gray-900 text-lg">
            {username || "No username set"}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mb-4 gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUsernameUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                // Refetch original from 'users'
                const fetchUsername = async () => {
                  try {
                    if (auth.currentUser) {
                      const userDoc = await getDoc(
                        doc(db, "users", auth.currentUser.uid)
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
            Edit Username
          </button>
        )}
      </div>

      {statusMessage && (
        <div className="text-sm text-center text-green-600 mb-4">
          {statusMessage}
        </div>
      )}

      <button
        className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
        onClick={() => setCurrentPage("home")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Profile;