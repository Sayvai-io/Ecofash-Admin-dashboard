
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "@/utils/supabaseClient";
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';

type ServicePagePreviewProps = {
  setIsEditService: (isEdit: boolean) => void;
  setServiceId: (id: any) => void;
  serviceData?: any[];
  onDelete: (id: string) => void;
  onEdit: (service: any) => void;
};

const Seperate_ServicePagePreview = ({ 
  setIsEditService,
  setServiceId,
  serviceData,
  onDelete,
  onEdit
}: ServicePagePreviewProps) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="grid gap-4">
        {services.map((service, index) => (
          <div key={service.id} className="flex p-4 border rounded-md bg-white shadow-md">
            <div className="flex-shrink-0">
              {service.why_content_image ? (
                <Image
                  src={service.why_content_image}
                  alt={service.title}
                  width={150}
                  height={100}
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
              <p className="text-gray-500">Significance: {service.significance}</p>
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
    </>
  );
};

export default Seperate_ServicePagePreview;