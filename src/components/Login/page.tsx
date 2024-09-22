"use client";

import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

import supabase from "@/utils/supabaseClient";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Blog from "../Dashboard/Blog";

const Login: React.FC<{ setShowSignup: (show: boolean) => void }> = ({
  setShowSignup,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("supabaseSession");
    if (session) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      localStorage.setItem("supabaseSession", JSON.stringify(data.session));
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
    return (
      <DefaultLayout>
        <Blog />
      </DefaultLayout>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <Typography variant="h5" component="h1" className="mb-6 text-center">
            Sign in to your account
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                backgroundColor: "#16C3A6",
                "&:hover": {
                  backgroundColor: "#14a89d",
                },
              }}
            >
              Log In
            </Button>
          </form>
          <Typography variant="body2" className="mt-4 text-center">
            New on our platform?{" "}
            <Button
              color="primary"
              onClick={() => setShowSignup(true)}
              sx={{ textTransform: "none" }}
            >
              Create an account
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
