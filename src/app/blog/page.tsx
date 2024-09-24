import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Blog from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Ecofash Profile",
  description: "Ecofash profile page",
};

const Dashboard = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
       

        <Blog />
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
