"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EditServiceProps = {
  setIsEditService: (isEdit: boolean) => void;
  setServiceData: (data: any) => void;
};

const EditServicePage = ({ 
  setIsEditService, 
  setServiceData 
}: EditServiceProps) => {
  const [serviceDataLocal, setServiceDataLocal] = useState<any>(null);
  const [editService, setEditService] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [images, setImages] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({});
  
  const fileInputRefs = {
    service_image: useRef<HTMLInputElement>(null),
    collection_image: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      const { data, error } = await supabase
        .from('service')
        .select('*');

      if (error) {
        console.error('Error fetching service data:', error);
        return;
      }

      setServiceDataLocal(data);
      if (data && data.length > 0) {
        setEditService(data[0]);
        setImagePreviews({
          service_image: data[0].service_image,
          collection_image: data[0].collection_image,
        });
      }
    };

    fetchServiceData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditService({ ...editService, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImages({ ...images, [field]: file });
      setImagePreviews({ ...imagePreviews, [field]: URL.createObjectURL(file) });
      setIsDirty(true);
    }
  };

  const handleRemoveImage = (field: string) => {
    setImages({ ...images, [field]: null });
    setImagePreviews({ ...imagePreviews, [field]: null });
    setEditService({ ...editService, [field]: null });
    setIsDirty(true);
  };

  const handleUpdateService = async () => {
    let updatedService = { ...editService };

    for (const field of ['service_image', 'collection_image']) {
      const file = images[field];
      if (file) {
        const uniqueFileName = `${Date.now()}_${file.name}`;
        
        // Upload the image
        const { data, error } = await supabase.storage
          .from('service-images')
          .upload(`public/${uniqueFileName}`, file);

        if (error) {
          console.error(`Error uploading ${field}:`, error);
          alert(`Failed to upload ${field}. Please try again.`);
          return;
        }

        const { data: publicData } = supabase.storage
          .from('service-images')
          .getPublicUrl(data.path);
        const publicURL = publicData.publicUrl;

        updatedService[field] = publicURL; // Update the URL in the updatedService object
      }
    }

    // Update the service data in the database
    const { error } = await supabase
      .from('service')
      .update(updatedService)
      .eq('id', editService.id);

    if (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service data. Please try again.');
    } else {
      setServiceData((prevData: any) => prevData.map((service: any) => service.id === editService.id ? updatedService : service));
      setIsEditService(false);
      setIsDirty(false);
    }
  };

  const handleCancel = () => {
    setIsEditService(false);
  };

  const handleBack = () => {
    setIsEditService(false);
  };

  if (!serviceDataLocal) return <div>Loading...</div>;

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4">
        <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        </button>
        <h1 className="text-black text-2xl font-bold mb-2">Edit Service Page</h1>
      </div>
      {editService && (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateService(); }} className="px-15">
          {/* Service Heading Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Service Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="service_heading" 
              value={editService.service_heading} 
              onChange={handleChange} 
            />
          </div>

          {/* Service Content Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Service Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="service_content" 
              value={editService.service_content} 
              onChange={handleChange} 
            />
          </div>

          {/* Service Image Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Service Image</label>
            {imagePreviews.service_image ? (
              <div className="mb-2">
                <Image 
                  src={imagePreviews.service_image} 
                  alt="Service Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('service_image')} 
                  className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                >
                  Replace Image
                </button>
              </div>
            ) : (
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => fileInputRefs.service_image.current?.click()}
              >
                <span className="text-gray-700">Upload Image</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, 'service_image')} 
              ref={fileInputRefs.service_image} 
              className="hidden" 
            />
          </div>

          {/* Years of Experience Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Years of Experience Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="years_of_experience_title" 
              value={editService.years_of_experience_title} 
              onChange={handleChange} 
            />
          </div>

          {/* Years of Experience Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Years of Experience</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="years_of_experience" 
              value={editService.years_of_experience} 
              onChange={handleChange} 
            />
          </div>

          {/* Satisfied Clients Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Satisfied Clients Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="satisfied_clients_title" 
              value={editService.satisfied_clients_title} 
              onChange={handleChange} 
            />
          </div>

          {/* Satisfied Clients Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Satisfied Clients</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="satisfied_clients" 
              value={editService.satisfied_clients} 
              onChange={handleChange} 
            />
          </div>

          {/* Services Provided Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Services Provided Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="services_provided_title" 
              value={editService.services_provided_title} 
              onChange={handleChange} 
            />
          </div>

          {/* Services Provided Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Services Provided</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="services_provided" 
              value={editService.services_provided} 
              onChange={handleChange} 
            />
          </div>

          {/* Business Portfolios Title Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Business Portfolios Title</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="business_portfolios_title" 
              value={editService.business_portfolios_title} 
              onChange={handleChange} 
            />
          </div>

          {/* Business Portfolios Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Business Portfolios</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="business_portfolios" 
              value={editService.business_portfolios} 
              onChange={handleChange} 
            />
          </div>

          {/* Collection Heading Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Collection Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="collection_heading" 
              value={editService.collection_heading} 
              onChange={handleChange} 
            />
          </div>

          {/* Collection Content Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Collection Content</label>
            <textarea 
              className="w-full px-4 py-2 border rounded" 
              name="collection_content" 
              value={editService.collection_content} 
              onChange={handleChange} 
            />
          </div>

          {/* Collection Image Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Collection Image</label>
            {imagePreviews.collection_image ? (
              <div className="mb-2">
                <Image 
                  src={imagePreviews.collection_image} 
                  alt="Collection Image" 
                  width={300} 
                  height={200} 
                  className="rounded-md mb-4" 
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage('collection_image')} 
                  className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                >
                  Replace Image
                </button>
              </div>
            ) : (
              <div 
                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer`} 
                onClick={() => fileInputRefs.collection_image.current?.click()}
              >
                <span className="text-gray-700">Upload Image</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, 'collection_image')} 
              ref={fileInputRefs.collection_image} 
              className="hidden" 
            />
          </div>

          {/* Service Provided Heading Input */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-500 font-semibold">Service Provided Heading</label>
            <input 
              className="w-full px-4 py-2 border rounded" 
              name="service_provided_heading" 
              value={editService.service_provided_heading} 
              onChange={handleChange} 
            />
          </div>

          <button type="submit" className={`w-20 px-4 py-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isDirty}>Update</button>
          <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4">Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditServicePage;