import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AboutSection from "@/components/About/AboutSection";

export const metadata: Metadata = {
  title: "About Section",
  description: "About Page",
};

const AboutPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <AboutSection />
      </div>
    </DefaultLayout>
  );
};

export default AboutPage;
