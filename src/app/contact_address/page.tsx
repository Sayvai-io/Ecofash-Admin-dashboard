import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Contact_Address_Section from "@/components/Contact/Contact_address/Contact_Address_Section";

export const metadata: Metadata = {
  title: "Contact Section",
  description: "Contact Page",
};

const ConactPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Contact_Address_Section />
      </div>
    </DefaultLayout>
  );
};

export default ConactPage;
