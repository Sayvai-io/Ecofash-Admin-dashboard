import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ContactForm_Preview from "@/components/Contact/Contact_Form/ContactForm_Preview";

export const metadata: Metadata = {
  title: "Contact Section",
  description: "Contact Page",
};

const ContactFormPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <ContactForm_Preview />
      </div>
    </DefaultLayout>
  );
};

export default ContactFormPage;
