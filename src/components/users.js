import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const REACT_API_URL = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${REACT_API_URL}/users/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [REACT_API_URL]);

  return (
    <div>
      <h2>All Users</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
