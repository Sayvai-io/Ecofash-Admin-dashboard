import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TeamsSection from "@/components/Teams/TeamsSection";

export const metadata: Metadata = {
  title: "Teams Section",
  description: "Teams Page",
};

const TeamsPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <TeamsSection />
      </div>
    </DefaultLayout>
  );
};

export default TeamsPage;
