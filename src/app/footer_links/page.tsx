import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Footer_Links from "@/components/Footer_Links";

export const metadata: Metadata = {
  title: "Ecofash Profile",
  description: "Ecofash profile page",
};

const Footer = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
       

        <Footer_Links />
      </div>
    </DefaultLayout>
  );
};

export default Footer;
