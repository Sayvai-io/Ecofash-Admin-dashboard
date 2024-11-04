import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AIChatbot from "@/components/AIChatbot";

export const metadata: Metadata = {
  title: "AIChatbot Section",
  description: "AIChatbot Page",
};

const AIChatbotPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <AIChatbot />
      </div>
    </DefaultLayout>
  );
};

export default AIChatbotPage;
