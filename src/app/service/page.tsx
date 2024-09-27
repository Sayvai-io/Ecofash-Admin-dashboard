import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ServiceSection from "@/components/Service/ServiceSection";

export const metadata: Metadata = {
  title: "Service Section",
  description: "Service Page",
};

const ServicePage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <ServiceSection />
      </div>
    </DefaultLayout>
  );
};

export default ServicePage;
