import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Seperate_ServiceSection from "@/components/Seperate_Service/Seperate_ServiceSection";

export const metadata: Metadata = {
  title: "Seperate Service Section",
  description: "Seperate Service Page",
};

const Seperate_ServicePage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Seperate_ServiceSection />
      </div>
    </DefaultLayout>
  );
};

export default Seperate_ServicePage;
