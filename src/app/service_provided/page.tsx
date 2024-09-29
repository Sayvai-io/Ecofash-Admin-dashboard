import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ServiceProvidedSection from "@/components/Service_Provided/Service_ProvidedSection";

export const metadata: Metadata = {
  title: "Service Provided Section",
  description: "Service Provided Page",
};

const ServiceProvidedPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <ServiceProvidedSection />
      </div>
    </DefaultLayout>
  );
};

export default ServiceProvidedPage;
