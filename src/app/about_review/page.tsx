import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import About_ReviewSection from "@/components/About_Review/About_ReviewSection";

export const metadata: Metadata = {
  title: "About Review Section",
  description: "About Review Page",
};

const About_ReviewPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <About_ReviewSection />
      </div>
    </DefaultLayout>
  );
};

export default About_ReviewPage;
