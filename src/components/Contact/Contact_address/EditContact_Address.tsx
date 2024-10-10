"use client";
import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EditAddressProps = {
  setIsEditAddress: (isEdit: boolean) => void; // Function to set edit state
  addressId: string; // ID of the address to edit
  setAddressData: (data: any) => void; // Function to update address data in parent component
};

const EditAddress = ({  
  setIsEditAddress, 
  addressId,
  setAddressData = () => {} // Default to a no-op function
}: EditAddressProps) => {
  const [addressData, setAddressDataLocal] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [countryName, setCountryName] = useState<string>(''); // State to hold country name

  useEffect(() => {
    const fetchAddressData = async () => {
      const { data, error } = await supabase
        .from('address')
        .select('*')
        .eq('id', addressId)
        .single();

      if (error) {
        console.error('Error fetching address data:', error);
        return;
      }

      setAddressDataLocal(data);

      // Fetch country name based on country_id
      const countryResponse = await supabase
        .from('country')
        .select('country_name')
        .eq('id', data.country_id)
        .single();

      if (countryResponse.error) {
        console.error('Error fetching country name:', countryResponse.error);
      } else {
        setCountryName(countryResponse.data.country_name);
      }
    };

    fetchAddressData();
  }, [addressId]);

  const handleQuillChange = (value: string, field: string) => {
    // Only update if the value has changed
    if (addressData && addressData[field] !== value) {
      setAddressDataLocal((prevEditReview: any) => ({ ...prevEditReview, [field]: value }));
      setIsDirty(true);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddressDataLocal({ ...addressData, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountryName(e.target.value);
    setIsDirty(true);
  };

  const handleUpdate = async () => {
    // Check if setAddressData is a function
    if (typeof setAddressData !== 'function') {
        console.error('setAddressData is not a function');
        return;
    }

    // Update the address
    const { error: addressError } = await supabase
      .from('address')
      .update({
        full_address: addressData.full_address, // Ensure you are updating the correct fields
        email: addressData.email,
        contact_no: addressData.contact_no,
        country_id: addressData.country_id // Assuming you have a country_id in addressData
      })
      .eq('id', addressId); // Ensure you are using addressId here

    if (addressError) {
      console.error('Error updating address:', addressError);
    } else {
      // Update the country name in the country table
      const { error: countryError } = await supabase
        .from('country')
        .update({ country_name: addressData.country_name }) // Update the country name based on the country_id
        .eq('id', addressData.country_id); // Update the country based on the country_id

      if (countryError) {
        console.error('Error updating country name:', countryError);
      }

      setAddressData((prevData: any) => 
        prevData.map((address: any) => address.id === addressData.id ? addressData : address)
      ); // Update local state
      setIsEditAddress(false); // Exit edit mode
    }
  };

  const handleCancel = () => {
    setIsEditAddress(false);
  };

  const handleBack = () => {
    setIsEditAddress(false);
  };

  if (!addressData) return <div>Loading...</div>;

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6"> {/* Added classes for styling */}
      <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4"> {/* Added flex container with gap */}
        <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="text-black text-2xl font-bold mb-2">Edit Address</h1> {/* Removed margin-top since gap is applied */}
      </div>
      {addressData && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-20">
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Full Address</label>
            <ReactQuill
              value={addressData.full_address}
              onChange={(content: string) =>
                handleQuillChange(content, "full_address")
              }
              
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Email</label>
            <ReactQuill
              value={addressData.email}
              onChange={(content: string) =>  
                handleQuillChange(content, "email")
              }
              
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Contact No</label>
            <ReactQuill
              value={addressData.contact_no}
              onChange={(content: string) =>
                handleQuillChange(content, "contact_no")
              }
              
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Country</label>
            <ReactQuill
              value={countryName}
              onChange={(content: string) =>
                handleQuillChange(content, "country_name")
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

export default EditAddress;