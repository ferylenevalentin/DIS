import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";
import Sidebar from "./Sidebar";
import "./UserList.css";

function UserList() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch users from the database
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:1337/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Handle delete user
    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:1337/users/${id}`);
                alert("User deleted successfully!");
                fetchUsers(); // Refresh the user list
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    // Handle edit user
    const handleEditUser = (user) => {
        setEditUser(user);
        setOpenEditDialog(true);
    };

    // Handle update user
    const handleUpdateUser = async () => {
        try {
            await axios.put(`http://localhost:1337/users/${editUser._id}`, {
                username: editUser.username,
                role: editUser.role,
            });
            alert("User updated successfully!");
            setOpenEditDialog(false);
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="content">
                <h2>User List</h2>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEditUser(user)}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteUser(user._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Edit User Dialog */}
                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editUser?.username || ""}
                            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                        />
                        <TextField
                            select
                            label="Role"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editUser?.role || ""}
                            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                        >
                            <MenuItem value="staff">Staff</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateUser} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default UserList;