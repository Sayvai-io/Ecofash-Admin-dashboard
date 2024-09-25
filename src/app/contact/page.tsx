import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ContactSection from "@/components/Contact/ContactSection";

export const metadata: Metadata = {
  title: "Contact Section",
  description: "Contact Page",
};

const ConactPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <ContactSection />
      </div>
    </DefaultLayout>
  );
};

export default ConactPage;
