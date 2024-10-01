"use client";
import React, { useState } from "react";
import supabase from "@/utils/supabaseClient";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const ProfileBox = () => {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // New state for current password
  const [newPassword, setNewPassword] = useState(""); // New state for new password
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Check if the current password is correct
      const { data, error: loginError } = await supabase.rpc('login', {
        username_input: username,
        password_input: currentPassword
      });

      if (loginError || !data) {
        setError('Invalid username or current password');
        return;
      }

      // Successful login, now update the password
      const { error: updateError } = await supabase
        .from('user_credentials')
        .update({ password_hash: newPassword }) // Update with the new password
        .eq('username', username); // Ensure you update the correct user

      if (updateError) {
        setError(updateError.message);
      } else {
        // Password updated successfully
        setError(null);
        alert('Password updated successfully!');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Update error:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <Typography variant="h5" component="h1" className="mb-12 text-center">
              Change Password
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
                label="Current Password" // New input for current password
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="New Password" // New input for new password
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProfileBox;