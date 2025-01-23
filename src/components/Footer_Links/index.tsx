"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";



interface FooterLink {
  id: number;
  Resource1: string;
  Resource1_link: string;
  Resource2: string;
  Resource2_link: string;
  Resource3: string;
  Resource3_link: string;
  Resource4: string;
  Resource4_link: string;
  Resource5: string;
  Resource5_link: string;
  Youtube: string;
  Facebook: string;
  Instagram: string;
  Twitter: string;
  Linkedin: string;
  Privacy_Policy: string;
}

const Footer_Links = () => {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [originalLinks, setOriginalLinks] = useState<FooterLink[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      const { data, error } = await supabase
        .from('footer_links')
        .select('*');

      if (error) {
        console.error("Error fetching links:", error);
        return;
      }

      setLinks(data);
      setOriginalLinks(data);
    };

    fetchLinks();
  }, []);

  const handleChange = (index: number, field: keyof FooterLink, value: string) => {
    const updatedLinks = links.map((link, idx) => idx === index ? { ...link, [field]: value } : link);
    setLinks(updatedLinks);
    setIsDirty(true);
  };

  const handleUpdate = async (id: number) => {
    const { error } = await supabase
      .from('footer_links')
      .update(links.find(link => link.id === id))
      .eq('id', id);

    if (error) {
      console.error("Error updating link:", error);
    } else {
      console.log("Link updated successfully");
      alert("Updated successfully!");
      setOriginalLinks(links);
      setIsDirty(false);
    }
  };

  const handleCancel = () => {
    setLinks(originalLinks);
    setIsDirty(false);
  };

  return (
    <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10">
      {links.map((link, index) => (
        <div key={link.id} className="mb-4">
          <h3 className="font-bold text-lg mb-2">Resources</h3>
          {['Resource1', 'Resource2', 'Resource3', 'Resource4', 'Resource5'].map((resource, idx) => (
            <div key={idx} className="mb-2">
              <input
                type="text"
                value={link[resource as keyof FooterLink]}
                onChange={(e) => handleChange(index, resource as keyof FooterLink, e.target.value)}
                className="border p-1 mb-1 mr-4"
                placeholder={`${resource} Name`}
              />
              <input
                type="text"
                value={link[`${resource}_link` as keyof FooterLink]}
                onChange={(e) => handleChange(index, `${resource}_link` as keyof FooterLink, e.target.value)}
                className="border p-1 mb-2 w-2/3"
                placeholder={`${resource} Link`}
              />
            </div>
          ))}
          
          <h3 className="font-bold text-lg mt-4">Social Links</h3>
          {['Youtube', 'Facebook', 'Instagram', 'Twitter', 'Linkedin'].map((social, idx) => (
            <div key={idx} className="mb-2">
              <label className="block font-medium mb-2">{social}:</label>
              <input
                type="text"
                value={link[social as keyof FooterLink]}
                onChange={(e) => handleChange(index, social as keyof FooterLink, e.target.value)}
                className="border p-1 mb-1 w-2/3"
                placeholder={`${social} Link`}
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block font-medium mb-2">Privacy Policy:</label>
            <ReactQuill 
              value={link.Privacy_Policy} 
              onChange={(value) => handleChange(index, 'Privacy_Policy' as keyof FooterLink, value)} 
              className="border mb-1 w-full"
            />
          </div>

          <div className="mt-4">
            <button 
              onClick={() => handleUpdate(link.id)} 
              className={`w-20 px-4 py-2 mr-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} 
              disabled={!isDirty}
            >
              Update
            </button>
            <button 
              type="button" 
              onClick={handleCancel} 
              className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Footer_Links;