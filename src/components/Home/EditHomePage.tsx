"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFileUpload } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type HomePagePreviewProps = {
  // Updated type name
  setIsEditHome: (isEdit: boolean) => void; // Changed function name
  setHomeData: (data: any) => void; // Changed function name
};

const EditHomePage = ({ setIsEditHome, setHomeData }: HomePagePreviewProps) => {
  // Updated props
  const [homeData, setHomeDataLocal] = useState<any>(null); // Updated state name
  const [editHome, setEditHome] = useState<any>(null); // Updated state name
  const [isDirty, setIsDirty] = useState(false);
  const [images, setImages] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{
    [key: string]: string | null;
  }>({});
  const [imageUploadActive, setImageUploadActive] = useState<{
    [key: string]: boolean;
  }>({
    head_image: false,
    logo_image: false,
    about_image: false,
    contact_image: false,
    services_image: false,
  });

  const fileInputRefs = {
    head_image: useRef<HTMLInputElement>(null), // Updated field name
    logo_image: useRef<HTMLInputElement>(null), // Updated field name
    about_image: useRef<HTMLInputElement>(null), // Updated field name
    contact_image: useRef<HTMLInputElement>(null), // Updated field name
    services_image: useRef<HTMLInputElement>(null), // Updated field name
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      // Updated function name
      const { data, error } = await supabase
        .from("home") // Updated table name
        .select("*");

      if (error) {
        console.error("Error fetching home data:", error);
        return;
      }

      setHomeDataLocal(data);
      if (data && data.length > 0) {
        setEditHome(data[0]); // Updated state name
        setImagePreviews({
          head_image: data[0].head_image, // Updated field name
          logo_image: data[0].logo_image, // Updated field name
          about_image: data[0].about_image, // Updated field name
          contact_image: data[0].contact_image, // Updated field name
          services_image: data[0].services_image, // Updated field name
        });
      }
    };

    fetchHomeData();
  }, []);

  const handleQuillChange = (value: string, field: string) => {
    setEditHome({ ...editHome, [field]: value });
    setIsDirty(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditHome({ ...editHome, [e.target.name]: e.target.value }); // Updated state name
    setIsDirty(true);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImages({ ...images, [field]: file });
      setImagePreviews({
        ...imagePreviews,
        [field]: URL.createObjectURL(file),
      });
      setIsDirty(true);
      setImageUploadActive({ ...imageUploadActive, [field]: false }); // Deactivate upload button on image change
    }
  };

  const handleRemoveImage = (field: string) => {
    setImages({ ...images, [field]: null });
    setImagePreviews({ ...imagePreviews, [field]: null });
    setEditHome({ ...editHome, [field]: null }); // Updated state name
    setIsDirty(true);
    setImageUploadActive({ ...imageUploadActive, [field]: true }); // Activate upload button on delete
  };

  const handleUpdateHome = async () => {
    // Updated function name
    let updatedHome = { ...editHome }; // Updated state name

    for (const field of [
      "head_image",
      "logo_image",
      "about_image",
      "contact_image",
      "services_image",
    ]) {
      // Updated fields
      if (images[field]) {
        const uniqueFileName = `${Date.now()}_${images[field].name}`; // Append timestamp for uniqueness
        const { data, error } = await supabase.storage
          .from("blog-images") // Updated storage name
          .upload(`public/${uniqueFileName}`, images[field]);

        if (error) {
          console.error(`Error uploading ${field}:`, error);
          return;
        }

        const { data: publicData } = supabase.storage
          .from("blog-images") // Updated storage name
          .getPublicUrl(data.path);
        const publicURL = publicData.publicUrl;

        updatedHome[field] = publicURL; // Update the URL in the updatedHome object
      }
    }

    const { error } = await supabase
      .from("home") // Updated table name
      .update(updatedHome)
      .eq("id", editHome.id); // Updated state name

    if (error) {
      console.error("Error updating home:", error);
    } else {
      setHomeData((prevData: any) =>
        prevData.map((home: any) =>
          home.id === editHome.id ? updatedHome : home,
        ),
      ); // Update local state
      setIsEditHome(false); // Close the edit form
      setIsDirty(false);
    }
  };

  const handleCancel = () => {
    setIsEditHome(false);
  };

  const handleBack = () => {
    setIsEditHome(false);
  };

  if (!homeData) return <div>Loading...</div>; // Updated loading message

  return (
    <div className="rounded-lg border bg-white p-6 shadow-lg">
      {" "}
      {/* Added classes for styling */}
      <div className="mb-4 flex items-center gap-8 border-b pb-4 pt-4">
        {" "}
        {/* Added flex container with gap */}
        <button
          onClick={handleBack}
          className="mb-2 flex w-8 items-center rounded-lg bg-gray-200 px-2 py-2 text-gray-700 hover:bg-gray-400 hover:text-white"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="mb-2 text-2xl font-bold text-black">Edit Home Page</h1>{" "}
        {/* Updated heading */}
      </div>
      {editHome && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateHome();
          }}
          className="px-15"
        >
          <div className="mb-4">
            {" "}
            {/* Head Image Display */}
            <label className="mb-2 block font-semibold text-gray-500">
              Logo Image
            </label>
            {imagePreviews.logo_image ? ( // Check if the head image preview exists
              <div className="mb-2">
                <Image
                  src={imagePreviews.logo_image} // Updated field name
                  alt="Logo Image"
                  width={300}
                  height={200}
                  className="mb-4 rounded-md"
                />
                <div className="mt-2 flex gap-2">
                  {" "}
                  {/* Flex container for icons */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage("logo_image")} // Updated field name
                    className="flex items-center rounded bg-red-500 px-2 py-1 text-white"
                  >
                    Replace Image {/* Trash icon without margin */}
                  </button>
                </div>
              </div>
            ) : (
              // No image box
              <div
                className={`mb-2 flex h-[200px] w-[300px] cursor-pointer items-center justify-center rounded-md bg-gray-200 ${imageUploadActive.logo_image ? "" : "cursor-not-allowed opacity-50"}`} // Updated field name
                onClick={() =>
                  imageUploadActive.logo_image &&
                  fileInputRefs.logo_image.current?.click()
                } // Clickable area
              >
                <span className="text-gray-700">Upload Image</span>
                <button
                  type="button"
                  className="ml-2 flex items-center rounded px-3 py-2 text-gray-700" // Added margin-left for spacing
                  disabled={!imageUploadActive.logo_image}
                >
                  <FontAwesomeIcon icon={faFileUpload} />{" "}
                  {/* File upload icon without margin */}
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "logo_image")} // Updated field name
              ref={fileInputRefs.logo_image} // Updated field name
              className="hidden"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-semibold text-gray-500">
              Heading
            </label>
            <input
              className="w-full rounded border px-4 py-2"
              name="logo_heading" // Updated field name
              value={editHome.logo_heading} // Updated state name
              onChange={handleChange}
            />{" "}
            {/* Heading input */}
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-semibold text-gray-500">
              Heading Content
            </label>
            <input
              className="w-full rounded border px-4 py-2"
              name="logo_content" // Updated field name
              value={editHome.logo_content} // Updated state name
              onChange={handleChange}
            />{" "}
            {/* Heading input */}
          </div>
          <div className="mb-4">
            {" "}
            {/* Head Image Display */}
            <label className="mb-2 block font-semibold text-gray-500">
              Head Image
            </label>
            {imagePreviews.head_image ? ( // Check if the head image preview exists
              <div className="mb-2">
                <Image
                  src={imagePreviews.head_image} // Updated field name
                  alt="Head Image"
                  width={300}
                  height={200}
                  className="mb-4 rounded-md"
                />
                <div className="mt-2 flex gap-2">
                  {" "}
                  {/* Flex container for icons */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage("head_image")} // Updated field name
                    className="flex items-center rounded bg-red-500 px-2 py-1 text-white"
                  >
                    Replace Image {/* Trash icon without margin */}
                  </button>
                </div>
              </div>
            ) : (
              // No image box
              <div
                className={`mb-2 flex h-[200px] w-[300px] cursor-pointer items-center justify-center rounded-md bg-gray-200 ${imageUploadActive.head_image ? "" : "cursor-not-allowed opacity-50"}`} // Updated field name
                onClick={() =>
                  imageUploadActive.head_image &&
                  fileInputRefs.head_image.current?.click()
                } // Clickable area
              >
                <span className="text-gray-700">Upload Image</span>
                <button
                  type="button"
                  className="ml-2 flex items-center rounded px-3 py-2 text-gray-700" // Added margin-left for spacing
                  disabled={!imageUploadActive.head_image}
                >
                  <FontAwesomeIcon icon={faFileUpload} />{" "}
                  {/* File upload icon without margin */}
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "head_image")} // Updated field name
              ref={fileInputRefs.head_image} // Updated field name
              className="hidden"
            />
          </div>
          <div className="mb-4">
            {" "}
            {/* About Title Input */}
            <label className="mb-2 block font-semibold text-gray-500">
              About Title
            </label>
            <input
              className="w-full rounded border px-4 py-2"
              name="about_title"
              value={editHome.about_title} // Updated state name
              onChange={handleChange}
            />{" "}
            {/* About Title input */}
          </div>
          <div className="mb-4">
            {" "}
            {/* About Heading Input */}
            <label className="mb-2 block font-semibold text-gray-500">
              About Heading
            </label>
            <input
              className="w-full rounded border px-4 py-2"
              name="about_heading"
              value={editHome.about_heading} // Updated state name
              onChange={handleChange}
            />{" "}
            {/* About Heading input */}
          </div>
          <div className="mb-4">
            {" "}
            {/* About Content Input */}
            <label className="mb-2 block font-semibold text-gray-500">
              About Content
            </label>
            <ReactQuill
              value={editHome.about_content}
              onChange={(content) =>
                handleQuillChange(content, "about_content")
              }
              className="mb-12 h-64"
            />{" "}
            {/* About Content input */}
          </div>
          <div className="mb-4">
            {" "}
            {/* About Image Display */}
            <label className="mb-2 block font-semibold text-gray-500">
              About Image
            </label>
            {imagePreviews.about_image ? ( // Check if the about image preview exists
              <div className="mb-2">
                <Image
                  src={imagePreviews.about_image}
                  alt="About Image"
                  width={300}
                  height={200}
                  className="mb-4 rounded-md"
                />
                <div className="mt-2 flex gap-2">
                  {" "}
                  {/* Flex container for icons */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage("about_image")}
                    className="flex items-center rounded bg-red-500 px-2 py-1 text-white"
                  >
                    Replace Image {/* Trash icon without margin */}
                  </button>
                </div>
              </div>
            ) : (
              // No image box
              <div
                className={`mb-2 flex h-[200px] w-[300px] cursor-pointer items-center justify-center rounded-md bg-gray-200 ${imageUploadActive.about_image ? "" : "cursor-not-allowed opacity-50"}`}
                onClick={() =>
                  imageUploadActive.about_image &&
                  fileInputRefs.about_image.current?.click()
                } // Clickable area
              >
                <span className="text-gray-700">Upload Image</span>
                <button
                  type="button"
                  className="ml-2 flex items-center rounded px-3 py-2 text-gray-700" // Added margin-left for spacing
                  disabled={!imageUploadActive.about_image}
                >
                  <FontAwesomeIcon icon={faFileUpload} />{" "}
                  {/* File upload icon without margin */}
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "about_image")}
              ref={fileInputRefs.about_image}
              className="hidden"
            />
          </div>
          <div className="mb-4">
            {" "}
            {/* About Image Display */}
            <label className="mb-2 block font-semibold text-gray-500">
              Services Image
            </label>
            {imagePreviews.services_image ? ( // Check if the about image preview exists
              <div className="mb-2">
                <Image
                  src={imagePreviews.services_image}
                  alt="Services Image"
                  width={300}
                  height={200}
                  className="mb-4 rounded-md"
                />
                <div className="mt-2 flex gap-2">
                  {" "}
                  {/* Flex container for icons */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage("services_image")}
                    className="flex items-center rounded bg-red-500 px-2 py-1 text-white"
                  >
                    Replace Image {/* Trash icon without margin */}
                  </button>
                </div>
              </div>
            ) : (
              // No image box
              <div
                className={`mb-2 flex h-[200px] w-[300px] cursor-pointer items-center justify-center rounded-md bg-gray-200 ${imageUploadActive.services_image ? "" : "cursor-not-allowed opacity-50"}`}
                onClick={() =>
                  imageUploadActive.services_image &&
                  fileInputRefs.services_image.current?.click()
                } // Clickable area
              >
                <span className="text-gray-700">Upload Image</span>
                <button
                  type="button"
                  className="ml-2 flex items-center rounded px-3 py-2 text-gray-700" // Added margin-left for spacing
                  disabled={!imageUploadActive.services_image}
                >
                  <FontAwesomeIcon icon={faFileUpload} />{" "}
                  {/* File upload icon without margin */}
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "services_image")}
              ref={fileInputRefs.services_image}
              className="hidden"
            />
          </div>
          <div className="mb-4">
            {" "}
            {/* Contact Heading Input */}
            <label className="mb-2 block font-semibold text-gray-500">
              Contact Heading
            </label>
            <input
              className="w-full rounded border px-4 py-2"
              name="contact_heading"
              value={editHome.contact_heading} // Updated state name
              onChange={handleChange}
            />{" "}
            {/* Contact Heading input */}
          </div>
          <div className="mb-4">
            {" "}
            {/* Contact Content Input */}
            <label className="mb-2 block font-semibold text-gray-500">
              Contact Content
            </label>
            <textarea
              className="w-full rounded border px-4 py-2"
              name="contact_content"
              value={editHome.contact_content} // Updated state name
              onChange={handleChange}
            />{" "}
            {/* Contact Content input */}
          </div>
          <div className="mb-4">
            {" "}
            {/* Contact Image Display */}
            <label className="mb-2 block font-semibold text-gray-500">
              Contact Image
            </label>
            {imagePreviews.contact_image ? ( // Check if the contact image preview exists
              <div className="mb-2">
                <Image
                  src={imagePreviews.contact_image}
                  alt="Contact Image"
                  width={300}
                  height={200}
                  className="mb-4 rounded-md"
                />
                <div className="mt-2 flex gap-2">
                  {" "}
                  {/* Flex container for icons */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage("contact_image")}
                    className="flex items-center rounded bg-red-500 px-2 py-1 text-white"
                  >
                    Replace Image {/* Trash icon without margin */}
                  </button>
                </div>
              </div>
            ) : (
              // No image box
              <div
                className={`mb-2 flex h-[200px] w-[300px] cursor-pointer items-center justify-center rounded-md bg-gray-200 ${imageUploadActive.contact_image ? "" : "cursor-not-allowed opacity-50"}`}
                onClick={() =>
                  imageUploadActive.contact_image &&
                  fileInputRefs.contact_image.current?.click()
                } // Clickable area
              >
                <span className="text-gray-700">Upload Image</span>
                <button
                  type="button"
                  className="ml-2 flex items-center rounded px-3 py-2 text-gray-700" // Added margin-left for spacing
                  disabled={!imageUploadActive.contact_image}
                >
                  <FontAwesomeIcon icon={faFileUpload} />{" "}
                  {/* File upload icon without margin */}
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "contact_image")}
              ref={fileInputRefs.contact_image}
              className="hidden"
            />
          </div>
          <button
            type="submit"
            className={`w-20 rounded bg-[#609641] px-4 py-2 text-white ${!isDirty ? "cursor-not-allowed opacity-50" : ""} mb-8 mt-4`}
            disabled={!isDirty}
          >
            Update
          </button>{" "}
          {/* Update button */}
          <button
            type="button"
            onClick={handleCancel}
            className="mb-8 mt-4 w-20 rounded bg-gray-500 px-4 py-2 text-white"
          >
            Cancel
          </button>{" "}
          {/* Cancel button */}
        </form>
      )}
    </div>
  );
};

export default EditHomePage; // Updated export
