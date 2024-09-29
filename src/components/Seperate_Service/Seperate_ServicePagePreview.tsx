"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "@/utils/supabaseClient";
import { FaEllipsisV, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

type ServiceProvidedPagePreviewProps = {
  setIsEditService: (isEdit: boolean) => void;
  setServiceId: (id: any) => void; // Updated to reflect service ID
  serviceData?: any[]; // Updated prop name
  onDelete: (id: string) => void;
  onEdit: (service: any) => void;
  onAddServiceToggle: () => void; // Updated to reflect service addition
};

const Seperate_ServicePagePreview = ({ 
  setIsEditService,
  setServiceId,
  serviceData,
  onDelete,
  onEdit,
  onAddServiceToggle // Pass the toggle function
}: ServiceProvidedPagePreviewProps) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false); // State to manage Add Service form visibility

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("seperate_service") // Change to your table name
        .select("*");

      if (error) {
        console.error("Error fetching services:", error);
      } else {
        setServices(data);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  const handleDelete = async () => {
    if (selectedServiceId) {
      const { error } = await supabase
        .from("seperate_service") // Change to your table name
        .delete()
        .eq("id", selectedServiceId);

      if (error) {
        console.error("Error deleting service:", error);
      } else {
        setServices(services.filter(service => service.id !== selectedServiceId));
      }
      setIsModalOpen(false);
    }
  };

  const handleAddServiceSubmit = (newService: any) => {
    setServices([...services, newService]); // Add the new service to the list
    setIsAddServiceOpen(false); // Close the Add Service form
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10 ">
      <div className="flex border-b mb-8 mt-4 justify-between items-center">
        <h1 className="text-2xl text-gray-700 font-bold mb-4">Services Provided Preview</h1>
        <button 
          className="flex items-center bg-[#609641] text-white mb-4 px-2 py-1 rounded-md hover:bg-[#609641] transition duration-200"
          onClick={onAddServiceToggle} // Use the passed toggle function
        >
          <FaPlus className="mr-2" /> Add Service
        </button>
      </div>

      <div className="grid gap-4">
        {services.map((service, index) => (
          <div key={service.id} className="flex p-4 border rounded-md bg-white shadow-md dark:bg-gray-dark dark:shadow-card hover:shadow-lg transition-shadow duration-300">
            <div className="flex-shrink-0">
              {service.why_content_image ? (
                <Image
                  src={service.why_content_image}
                  alt={service.title}
                  width={150}
                  height={100}
                  style={{ width: "150px", height: "100px" }} // Maintain aspect ratio
                  className="rounded-md"
                />
              ) : (
                <div className="w-[150px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <div className="ml-4 flex-grow">
              <h2 className="text-xl font-bold">{service.title}</h2>
              <p className="text-gray-700">{service.heading}</p>
              <p className="text-gray-700">{service.content}</p>
              <p className="text-gray-700">{service.significance}</p>
              <p className="text-gray-700">{service.plan_of_action}</p>
              <p className="text-gray-700">{service.significance_title}</p>
              <p className="text-gray-700">{service.plan_of_action_title}</p>
            </div>
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md p-2" onClick={() => setDropdownOpenIndex(dropdownOpenIndex === index ? null : index)}>
                <FaEllipsisV className="h-3 w-3" />
              </button>
              <div className={`absolute right-0 mt-2 w-34 bg-gray-100 border rounded-md shadow-lg z-10 ${dropdownOpenIndex === index ? 'block' : 'hidden'}`}>
                <ul className="py-1">
                  <li className="px-3 py-1 text-gray-700 hover:bg-gray-200 cursor-pointer flex">
                    <button
                      className="flex items-center"
                      onClick={() => {
                        setDropdownOpenIndex(null);
                        setServiceId(service.id);
                        setIsEditService(true);
                      }}
                    >
                      <FaEdit className="mr-2" /> <span>Edit</span>
                    </button>
                  </li>
                  <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setIsModalOpen(true);
                    }}>
                    <FaTrash className="mr-2" /> <span>Delete</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <h2 className="text-lg font-bold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this service?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsModalOpen(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seperate_ServicePagePreview;