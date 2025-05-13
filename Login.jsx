import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loginAttempts, setLoginAttempts] = useState(0); // Track login attempts
    const [isLocked, setIsLocked] = useState(false); // Lock the login after 3 attempts
    const [openSignUp, setOpenSignUp] = useState(false); // State to control Sign Up dialog
    const [signUpUsername, setSignUpUsername] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
    const [signUpRole, setSignUpRole] = useState("staff"); // Default role is "staff"
    const [signUpError, setSignUpError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Check for empty fields
        if (!username && !password) {
            setError("Username and password are required");
            return;
        }
        if (!username) {
            setError("Username is required");
            return;
        }
        if (!password) {
            setError("Password is required");
            return;
        }

        // Check if login is locked
        if (isLocked) {
            setError("Too many failed attempts. Please try again later.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:1337/login", { username, password });
            const { token, role } = response.data;

            // Save token and role in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            // Navigate to the dashboard
            navigate("/dashboard");
        } catch (err) {
            setLoginAttempts((prev) => prev + 1); // Increment login attempts
            if (loginAttempts + 1 >= 3) {
                setIsLocked(true); // Lock the login after 3 failed attempts
                setError("Too many failed attempts. Please try again later.");
            } else {
                setError("Invalid username or password");
            }
        }
    };

    const handleSignUp = async () => {
        // Validate Sign Up fields
        if (!signUpUsername || !signUpPassword || !signUpConfirmPassword) {
            setSignUpError("All fields are required");
            return;
        }
        if (signUpPassword !== signUpConfirmPassword) {
            setSignUpError("Passwords do not match");
            return;
        }

        try {
            await axios.post("http://localhost:1337/signup", {
                username: signUpUsername,
                password: signUpPassword,
                role: signUpRole,
            });
            alert("Sign up successful! You can now log in.");
            setOpenSignUp(false); // Close the dialog
            setSignUpUsername("");
            setSignUpPassword("");
            setSignUpConfirmPassword("");
            setSignUpRole("staff");
            setSignUpError("");
        } catch (err) {
            console.error("Error signing up:", err);
            setSignUpError(err.response?.data?.message || "Failed to sign up. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLocked}>
                    Login
                </Button>
                <Button
                    variant="text"
                    color="secondary"
                    fullWidth
                    onClick={() => setOpenSignUp(true)} // Open Sign Up dialog
                >
                    Sign Up
                </Button>
            </form>

            {/* Sign Up Dialog */}
            <Dialog open={openSignUp} onClose={() => setOpenSignUp(false)}>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent>
                    {signUpError && <p className="error">{signUpError}</p>}
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={signUpUsername}
                        onChange={(e) => setSignUpUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        required
                    />
                    <TextField
                        select
                        label="Role"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={signUpRole}
                        onChange={(e) => setSignUpRole(e.target.value)}
                        required
                    >
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSignUp(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSignUp} color="primary">
                        Sign Up
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Login;