import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/users.css";
import * as bootstrap from "bootstrap";

const Users = () => {
  const REACT_API_URL = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedId, setSelectedId] = useState(0);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobile: "",
  });
  const [addFormData, setAddFormData] = useState({
    userName: "",
    email: "",
    mobile: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [REACT_API_URL]);

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

  const handleEdit = (user) => {
    console.log("what is selected", user);
    setSelectedId(user.userId);
    setSelectedUser(user);
    setFormData({
      userName: user.userName,
      email: user.email,
      mobile: user.mobile,
    });
    console.log("what is selected", selectedId);
    // const offcanvas = new bootstrap.Offcanvas("#editOffcanvas");
    const offcanvas = new bootstrap.Offcanvas("#editOffcanvas", {
      backdrop: true,
    });

    offcanvas.show();
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${REACT_API_URL}/users/update?id=${selectedId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User updated successfully!");
      setSelectedUser(null);
      setSelectedId(0);
      await fetchUsers();
      const offcanvasEl = document.getElementById("editOffcanvas");
      const bsOffcanvas =
        bootstrap.Offcanvas.getInstance(offcanvasEl) ||
        new bootstrap.Offcanvas(offcanvasEl);
      bsOffcanvas.hide();
    } catch (error) {
      alert("Update failed: " + (error?.response?.data || "Server error"));
    }
  };
  const handleAddInputChange = (e) => {
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${REACT_API_URL}/users/add`, addFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("User added successfully!");
      setAddFormData({ userName: "", email: "", mobile: "", password: "" });
      await fetchUsers();
      const offcanvasEl = document.getElementById("addUserOffcanvas");
      const bsOffcanvas =
        bootstrap.Offcanvas.getInstance(offcanvasEl) ||
        new bootstrap.Offcanvas(offcanvasEl);
      bsOffcanvas.hide();
    } catch (error) {
      alert("Add failed: " + (error?.response?.data || "Server error"));
    }
  };
  const handleDelete = async (user) => {
    const userId = user.userId;
    const REACT_API_URL = process.env.REACT_APP_API_URL;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${REACT_API_URL}/users/delete?id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("User deleted successfully!");
      await fetchUsers();
    } catch (error) {
      alert("Delete failed: " + (error?.response?.data || "Server error"));
    }
  };

  const columns = [
    {
      name: "User Name",
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <FaEdit
            style={{ color: "blue", cursor: "pointer" }}
            title="Edit"
            onClick={() => handleEdit(row)}
          />
          <FaTrash
            style={{ color: "red", cursor: "pointer" }}
            title="Delete"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="users" style={{ padding: "20px" }}>
      <div className="header d-flex justify-content-between align-items-center mb-3">
        <h5 style={{ fontSize: "15px" }}>Users</h5>
        <button
          className="btn btn-primary button"
          type="button"
          // data-bs-toggle="offcanvas"
          // data-bs-target="#addUserOffcanvas"
          aria-controls="addUserOffcanvas"
          onClick={() => {
            const el = document.getElementById("addUserOffcanvas");
            let canvas = bootstrap.Offcanvas.getInstance(el);
            if (!canvas) {
              canvas = new bootstrap.Offcanvas(el, {
                backdrop: true,
                keyboard: true,
              });
            }
            canvas.show();
          }}
        >
          Add
        </button>
      </div>
      <DataTable
        columns={columns}
        data={users}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 25, 50]}
        highlightOnHover
        responsive
        striped
        noDataComponent="No users found"
      />

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="addUserOffcanvas"
        aria-labelledby="addUserOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 id="addUserOffcanvasLabel">Add User</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleAddUser} className="form-l">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                name="userName"
                value={addFormData.userName}
                onChange={handleAddInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                name="email"
                type="email"
                value={addFormData.email}
                onChange={handleAddInputChange}
                required
              />
            </div>
            <div className="mb-3 ">
              <label className="form-label">Mobile</label>
              <input
                className="form-control"
                name="mobile"
                type="tel"
                value={addFormData.mobile}
                onChange={handleAddInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                name="password"
                type="password"
                value={addFormData.password}
                onChange={handleAddInputChange}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Add User
            </button>
          </form>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="editOffcanvas"
        aria-labelledby="editOffcanvasLabel"
        data-bs-backdrop="true"
      >
        <div className="offcanvas-header">
          <h5 id="editOffcanvasLabel">Edit User</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body">
          {selectedUser ? (
            <form onSubmit={handleUpdate} className="form-l">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mobile</label>
                <input
                  className="form-control"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button className="btn btn-success" type="submit">
                Update
              </button>
            </form>
          ) : (
            <p>No user selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
