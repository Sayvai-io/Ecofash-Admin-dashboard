"use client";

import React, { useState, useEffect } from "react";
import Login from "@/components/Login/page";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import supabase from "@/utils/supabaseClient";
import HomeSection from "@/components/Home/HomeSection"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      }
    };
    checkSession();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return (
      <DefaultLayout>
        <HomeSection />
      </DefaultLayout>
    );
  }

  return (
    <>
      <Login onLogin={handleLogin} />
    </>
  );
}
