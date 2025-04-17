import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = ({ user, setCurrentPage }) => {
  const [userInfo, setUserInfo] = useState({});
  const [newName, setNewName] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [salesData, setSalesData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserInfo(data);
          setNewName(data.name); // Pre-fill with current name
          if (data.userType === "seller") {
            setCertifications(data.certifications || []); // Fetch certifications if it's a vendor
            setSalesData(data.salesData || {}); // Fetch sales performance data
          }
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  // Handle profile updates
  const handleProfileUpdate = async () => {
    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        name: newName,
        certifications: certifications, // Save the certifications as well
        salesData: salesData, // Save the sales data as well
      });
      setIsEditing(false); // Stop editing mode after updating
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle adding a new certification
  const handleAddCertification = (newCert) => {
    if (!certifications.includes(newCert)) {
      setCertifications([...certifications, newCert]);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <button className="back-btn" onClick={() => setCurrentPage("home")}>
          Back to Home
        </button>
      </div>

      <div className="profile-info">
        <div className="profile-item">
          <label>Name:</label>
          {isEditing ? (
            <input
              className="profile-input"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          ) : (
            <span>{userInfo.name}</span>
          )}
        </div>

        <div className="profile-item">
          <label>Email:</label>
          <span>{userInfo.email}</span>
        </div>

        {userInfo.userType === "buyer" && (
          <div className="profile-item">
            <h3>Order History:</h3>
            <ul>
              {userInfo.orderHistory && userInfo.orderHistory.length > 0 ? (
                userInfo.orderHistory.map((order, index) => (
                  <li key={index}>{order}</li>
                ))
              ) : (
                <li>No orders yet.</li>
              )}
            </ul>
          </div>
        )}

        {userInfo.userType === "seller" && (
          <div className="seller-dashboard">
            <h3>Your Dashboard</h3>

            <div className="sales-performance">
              <h4>Sales Performance</h4>
              <div>
                <span>Total Sales: </span>
                <strong>{salesData.totalSales}</strong>
              </div>
              <div>
                <span>Monthly Sales: </span>
                <strong>{salesData.monthlySales}</strong>
              </div>
              <div>
                <span>Top-selling Product: </span>
                <strong>{salesData.topSellingProduct}</strong>
              </div>
            </div>

            <div className="customer-feedback">
              <h4>Customer Feedback</h4>
              {userInfo.feedback && userInfo.feedback.length > 0 ? (
                userInfo.feedback.map((feedback, index) => (
                  <div key={index} className="feedback-item">
                    <span>
                      Rating: {feedback.rating} - {feedback.comment}
                    </span>
                  </div>
                ))
              ) : (
                <div>No feedback yet.</div>
              )}
            </div>

            <div className="sustainability-milestones">
              <h4>Sustainability Milestones</h4>
              {certifications.length > 0 ? (
                certifications.map((cert, index) => (
                  <span key={index} className="badge">
                    {cert}
                  </span>
                ))
              ) : (
                <span>No sustainability certifications yet.</span>
              )}
            </div>

            <h3>Your Products:</h3>
            <ul>
              {userInfo.productData && userInfo.productData.length > 0 ? (
                userInfo.productData.map((product, index) => (
                  <li key={index}>
                    {product.name} - {product.sales} sales
                  </li>
                ))
              ) : (
                <li>No products added yet.</li>
              )}
            </ul>

            {isEditing && (
              <div>
                <button
                  onClick={() => handleAddCertification("Organic")}
                  className="add-cert-btn"
                >
                  Add Organic Certification
                </button>
                <button
                  onClick={() => handleAddCertification("Fair Trade")}
                  className="add-cert-btn"
                >
                  Add Fair Trade Certification
                </button>
                <button
                  onClick={() => handleAddCertification("Carbon Neutral")}
                  className="add-cert-btn"
                >
                  Add Carbon Neutral Certification
                </button>
              </div>
            )}
          </div>
        )}

        {isEditing ? (
          <button className="save-btn" onClick={handleProfileUpdate}>
            Save Changes
          </button>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
