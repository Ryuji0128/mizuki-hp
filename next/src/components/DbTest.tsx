"use client";

// Todo:テスト中

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";

interface User {
  id: number;
  name: string;
  email: string;
}

const DbTest: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Fetch users (GET)
  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Add user (POST)
  const addUser = async (): Promise<void> => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        setName("");
        setEmail("");
        await fetchUsers(); // Refresh the user list
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add user");
      }
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  // Delete user (DELETE)
  const deleteUser = async (): Promise<void> => {
    try {
      const response = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: parseInt(userId, 10) }),
      });

      if (response.ok) {
        setUserId("");
        await fetchUsers(); // Refresh the user list
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Database Test
      </Typography>

      {/* Fetch Users */}
      <Button variant="contained" onClick={fetchUsers} sx={{ mb: 2 }}>
        Refresh Users
      </Button>
      <List>
        {users.map((user) => (
          <React.Fragment key={user.id}>
            <ListItem>
              <ListItemText primary={`${user.name} (${user.email})`} secondary={`ID: ${user.id}`} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <Box mt={4}>
        {/* Add User */}
        <Typography variant="h6">Add User</Typography>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={addUser}>
          Add User
        </Button>
      </Box>

      <Box mt={4}>
        {/* Delete User */}
        <Typography variant="h6">Delete User</Typography>
        <TextField
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="error" onClick={deleteUser}>
          Delete User
        </Button>
      </Box>
    </Container>
  );
};

export default DbTest;