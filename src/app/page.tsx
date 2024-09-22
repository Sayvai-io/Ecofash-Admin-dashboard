import Blog from "@/components/Dashboard/Blog";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

export const metadata: Metadata = {
  title:
    "Ecofash Dashboard",
  description: "Ecofash admin dashboard",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Blog />
      </DefaultLayout>
    </>
  );
}
