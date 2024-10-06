"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


type EditTeamPageProps = {
  setIsEditTeam: (isEdit: boolean) => void; // Function to set edit state
  teamId: string; // ID of the team to edit
  setTeamData: (data: any) => void; // This should be a function
};


const EditTeamsPage = ({ 
  setIsEditTeam, 
  teamId,
  setTeamData = () => {} // Default to a no-op function
}: EditTeamPageProps) => {
  const [teamData, setTeamDataLocal] = useState<any>(null);
  const [editTeam, setEditTeam] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploadActive, setImageUploadActive] = useState<{ [key: string]: boolean }>({
    profile_image: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      const { data, error } = await supabase
        .from('teams') // Change to your table name
        .select('*')
        .eq('id', teamId)
        .single();

      if (error) {
        console.error('Error fetching team data:', error);
        return;
      }

      setTeamDataLocal(data);
      setEditTeam(data);
      setImagePreview(data.profile_image);
    };

    fetchTeamData();
  }, [teamId]);

  const handleQuillChange = (value: string, field: string) => {
    setEditTeam((prevEditTeam: any) => ({ ...prevEditTeam, [field]: value })); // Specify type for prevEditTeam
    setIsDirty(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditTeam({ ...editTeam, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsDirty(true);
      setImageUploadActive({ ...imageUploadActive, profile_image: true }); // Activate upload button
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setEditTeam({ ...editTeam, profile_image: null });
    setIsDirty(true);
    setImageUploadActive({ ...imageUploadActive, profile_image: false }); // Deactivate upload button
  };

  const handleUpdate = async () => {
    // Check if setTeamData is a function
    if (typeof setTeamData !== 'function') {
        console.error('setTeamData is not a function');
        return;
    }

    let updatedTeam = { ...editTeam };
    let imageUrl = editTeam.profile_image; // Default to existing image

    if (image) {
      const uniqueFileName = `${Date.now()}_${image.name}`; // Append timestamp for uniqueness
      const { data, error } = await supabase.storage
        .from('blog-images') // Change to your storage bucket name
        .upload(`public/${uniqueFileName}`, image);

      if (error) {
        if (error.message === "The resource already exists") {
          console.error('Image already exists. Please choose a different image.');
          return; // Handle the duplicate error
        }
        console.error('Error uploading image:', error);
        return;
      }

      const { data: publicData } = supabase.storage
        .from('blog-images') // Change to your storage bucket name
        .getPublicUrl(data.path);
      imageUrl = publicData.publicUrl; // Update imageUrl to new image URL
    } else if (editTeam.profile_image === null) {
      // If the image was removed, set imageUrl to null
      imageUrl = null;
    }

    updatedTeam.profile_image = imageUrl; // Update the profile_image in the updatedTeam object

    const { error } = await supabase
      .from('teams') // Change to your table name
      .update(updatedTeam)
      .eq('id', teamId); // Ensure you are using teamId here

    if (error) {
      console.error('Error updating team:', error);
    } else {
      setTeamData((prevData: any) => 
        prevData.map((team: any) => team.id === updatedTeam.id ? updatedTeam : team)
      ); // Update local state
      setIsEditTeam(false); // Exit edit mode
    }
  };

  const handleCancel = () => {
    setIsEditTeam(false);
  };

  const handleBack = () => {
    setIsEditTeam(false);
  };

  if (!teamData) return <div>Loading...</div>;

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6"> {/* Added classes for styling */}
      <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4"> {/* Added flex container with gap */}
        <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="text-black text-2xl font-bold mb-2">Edit Team Member</h1> {/* Updated title */}
      </div>
      {editTeam && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-20">
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Name</label>
            <ReactQuill
              value={editTeam.name}
              onChange={(content) =>
                handleQuillChange(content, "name")
              }
              
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Role</label>
            <ReactQuill
              value={editTeam.role}
              onChange={(content) =>
                handleQuillChange(content, "role")
              }
              
            />
          </div>
          <div className="mb-4"> {/* Profile Image Display */}
            <label className="block mb-2 text-gray-500 font-semibold">Profile Image</label>
            {imagePreview ? ( // Check if the image preview exists
              <div className="mb-2">
                <Image 
                  src={imagePreview} 
                  alt="Profile Image" 
                  width={150} 
                  height={100} 
                  className="rounded-md mb-4" 
                />
                <div className="flex gap-2 mt-2"> {/* Flex container for icons */}
                  <button 
                    type="button" 
                    onClick={handleRemoveImage} 
                    className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                  >
                   Replace Image {/* Button text */}
                  </button>
                </div>
              </div>
            ) : ( // No image box
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => fileInputRef.current?.click()} // Clickable area
              >
                <span className="text-gray-700">Upload Image</span>
                <button 
                  type="button" 
                  className="flex items-center px-3 py-2 text-gray-700 rounded ml-2" // Added margin-left for spacing
                >
                  <FontAwesomeIcon icon={faFileUpload} /> {/* File upload icon without margin */}
                </button>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              ref={fileInputRef} 
              className="hidden" 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Profile Content</label>
            <ReactQuill
              value={editTeam.profile_content}
              onChange={(content) =>
                handleQuillChange(content, "profile_content")
              }
              
            />
          </div>
          <button type="submit" className={`w-20 px-4 py-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''} mt-4 mb-8`} disabled={!isDirty}>Update</button> {/* Update button */}
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4 mb-8">Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditTeamsPage;