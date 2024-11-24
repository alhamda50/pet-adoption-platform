import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosinterceptor";
import { useNavigate, useParams } from "react-router-dom"; // For navigating to the edit page

const EditUserAdmin = () => {
  const [user, setUser] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    username: '',
    userEmail: '',
    phone: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const { id } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate(); // Using useNavigate for navigation

  useEffect(() => {
    // Fetch user details for editing
    axiosInstance.get(`user/users/${id}`)
      .then(response => {
        if (response.data) {
          setUser(response.data);
          setUpdatedData({
            username: response.data.username,
            userEmail: response.data.userEmail,
            phone: response.data.phone
          });
        }
      })
      .catch(err => {
        console.error("Error fetching user:", err);
        setErrorMessage("Error fetching user data.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({
      ...updatedData,
      [name]: value
    });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    axiosInstance.put(`/user/put/${id}`, updatedData)
      .then(response => {
        alert("User updated successfully");
        navigate('/manage-users'); // Redirect to the user list page after successful update
      })
      .catch(err => {
        console.error("Error updating user:", err);
        setErrorMessage("Error updating user data.");
      });
  };

  return (
    <div className="edit-user">
      <h2>Edit User</h2>
      {user ? (
        <form onSubmit={handleUpdateUser}>
          <label>
            Username: <br />
            <input
              type="text"
              name="username"
              value={updatedData.username}
              onChange={handleChange}
            />
          </label>
          <label>
            Email: <br />
            <input
              type="email"
              name="userEmail"
              value={updatedData.userEmail}
              onChange={handleChange}
            />
          </label>
          <label>
            Phone: <br />
            <input
              type="text"
              name="phone"
              value={updatedData.phone}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="update-btn">Update</button>
        </form>
      ) : (
        <p>Loading user data...</p>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Simple internal CSS */}
      <style jsx>{`
        .edit-user {
          padding: 20px;
          max-width: 600px;
          margin: 30px auto;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          color: #333;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          align-items: center;
         
        }

        label {
          font-size: 16px;
          color: #555;
        }

        input {
          padding: 10px;
          font-size: 14px;
          border-radius: 5px;
          border: 1px solid #ccc;
          width: 500px
          
        }

        input:focus {
          border-color: #4CAF50;
          outline: none;
        }

        .update-btn {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }

        .update-btn:hover {
          background-color: #45a049;
        }

        .error-message {
          color: red;
          font-weight: bold;
          text-align: center;
          margin-top: 15px;
        }

      `}</style>
    </div>
  );
};

export default EditUserAdmin;
