"use client";

import React from "react";
import Login from "@/components/Login/page";
import { useState } from 'react';

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <Login setShowSignup={setShowSignup} />
    </>
  );
}
