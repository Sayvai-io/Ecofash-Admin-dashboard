"use client";

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import supabase from "@/utils/supabaseClient";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => { // Accept onLogin prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.rpc('login', {
        username_input: username,
        password_input: password
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data) {
        // Successful login
        onLogin(); // Call onLogin to notify parent component
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <Typography variant="h5" component="h1" className="mb-12 text-center">
            Sign in to your account
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <TextField
              fullWidth
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#609641",
                "&:hover": {
                  backgroundColor: "#609641",
                },
              }}
            >
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;