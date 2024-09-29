import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import HomeSection from "@/components/Home/HomeSection";

export const metadata: Metadata = {
  title: "Home Section",
  description: "Home Page",
};

const HomePage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <HomeSection />
      </div>
    </DefaultLayout>
  );
};

export default HomePage;
