import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import EditBlog from "@/components/EditBlog";

export const metadata: Metadata = {
  title: "Ecofash Profile",
  description: "Ecofash profile page",
};

const EditBlogpage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <EditBlog />
      </div>
    </DefaultLayout>
  );
};

export default EditBlogpage;
