import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import BlogDetailsBox from "@/components/Blogdetailsbox/intex";

export const metadata: Metadata = {
  title: "Ecofash Profile",
  description: "Ecofash profile page",
};

const BlogDetails = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
       

        <BlogDetailsBox />
      </div>
    </DefaultLayout>
  );
};

export default BlogDetails;
