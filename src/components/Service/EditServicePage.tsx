"use client";
import React, { useEffect, useState, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ServicePagePreviewProps = { // Updated type name
    setIsEditService: (isEdit: boolean) => void; // Changed function name
    setServiceData: (data: any) => void; // Changed function name
};

const EditServicePage = ({ 
    setIsEditService, 
    setServiceData 
}: ServicePagePreviewProps) => { // Updated props
    const [serviceData, setServiceDataLocal] = useState<any>(null); // Updated state name
    const [editService, setEditService] = useState<any>(null); // Updated state name
    const [isDirty, setIsDirty] = useState(false);
    const [images, setImages] = useState<{ [key: string]: File | null }>({});
    const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({});
    const [imageUploadActive, setImageUploadActive] = useState<{ [key: string]: boolean }>({
        service_image: false,
        collection_image: false,
    });
    
    const fileInputRefs = {
        service_image: useRef<HTMLInputElement>(null), // Updated field name
        collection_image: useRef<HTMLInputElement>(null), // Updated field name
    };

    useEffect(() => {
        const fetchServiceData = async () => { // Updated function name
            const { data, error } = await supabase
                .from('service') // Updated table name
                .select('*');

            if (error) {
                console.error('Error fetching service data:', error);
                return;
            }

            setServiceDataLocal(data);
            if (data && data.length > 0) {
                setEditService(data[0]); // Updated state name
                setImagePreviews({
                    service_image: data[0].service_image, // Updated field name
                    collection_image: data[0].collection_image, // Updated field name
                });
            }
        };

        fetchServiceData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditService({ ...editService, [e.target.name]: e.target.value }); // Updated state name
        setIsDirty(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImages({ ...images, [field]: file });
            setImagePreviews({ ...imagePreviews, [field]: URL.createObjectURL(file) });
            setIsDirty(true);
            setImageUploadActive({ ...imageUploadActive, [field]: false }); // Deactivate upload button on image change
        }
    };

    const handleRemoveImage = (field: string) => {
        setImages({ ...images, [field]: null });
        setImagePreviews({ ...imagePreviews, [field]: null });
        setEditService({ ...editService, [field]: null });
        setIsDirty(true);
        setImageUploadActive({ ...imageUploadActive, [field]: true }); // Activate upload button on delete
    };

    const handleUpdateService = async () => { // Updated function name
        let updatedService = { ...editService };

        for (const field of ['service_image', 'collection_image']) { // Updated fields
            if (images[field]) {
                const uniqueFileName = `${Date.now()}_${images[field].name}`; // Append timestamp for uniqueness
                const { data, error } = await supabase.storage
                    .from('blog-images') // Updated storage name
                    .upload(`public/${uniqueFileName}`, images[field]);

                if (error) {
                    console.error(`Error uploading ${field}:`, error);
                    return;
                }

                const { data: publicData } = supabase.storage
                    .from('blog-images') // Updated storage name
                    .getPublicUrl(data.path);
                const publicURL = publicData.publicUrl;

                updatedService[field] = publicURL; // Update the URL in the updatedService object
            }
        }

        const { error } = await supabase
            .from('service') // Updated table name
            .update(updatedService)
            .eq('id', editService.id);

        if (error) {
            console.error('Error updating service:', error);
        } else {
            setServiceData((prevData: any) => prevData.map((service: any) => service.id === editService.id ? updatedService : service)); // Update local state
            setIsEditService(false); // Close the edit form
            setIsDirty(false);
        }
    };

    const handleCancel = () => {
        setIsEditService(false);
    };

    const handleBack = () => {
        setIsEditService(false);
    };

    if (!serviceData) return <div>Loading...</div>; // Updated loading state

    return (
        <div className="bg-white border rounded-lg shadow-lg p-6"> {/* Added classes for styling */}
            <div className="flex items-center gap-8 border-b pt-4 pb-4 mb-4"> {/* Added flex container with gap */}
                <button onClick={handleBack} className="flex items-center mb-2 w-8 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white"> 
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                </button>
                <h1 className="text-black text-2xl font-bold mb-2">Edit Service Page</h1> {/* Updated heading */}
            </div>
            {editService && (
                <form onSubmit={handleUpdateService}> {/* Updated form submission */}
                    <div className="mb-4"> {/* Service Heading Input */}
                        <label className="block mb-2 text-gray-500 font-semibold">Service Heading</label>
                        <input 
                            className="w-full px-4 py-2 border rounded" 
                            name="service_heading" 
                            value={editService.service_heading} // Updated field name
                            onChange={handleChange} 
                        /> {/* Service Heading input */}
                    </div>
                    <div className="mb-4"> {/* Service Content Input */}
                        <label className="block mb-2 text-gray-500 font-semibold">Service Content</label>
                        <textarea 
                            className="w-full px-4 py-2 border rounded" 
                            name="service_content" 
                            value={editService.service_content} // Updated field name
                            onChange={handleChange} 
                        /> {/* Service Content input */}
                    </div>
                    <div className="mb-4"> {/* Service Image Input */}
                        <label className="block mb-2 text-gray-500 font-semibold">Service Image</label>
                        {imagePreviews.service_image ? ( // Check if the service image preview exists
                            <div className="mb-2">
                                <Image 
                                    src={imagePreviews.service_image} 
                                    alt="Service Image" 
                                    width={300} 
                                    height={200} 
                                    className="rounded-md mb-4" 
                                />
                                <div className="flex gap-2 mt-2"> {/* Flex container for icons */}
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveImage('service_image')} 
                                        className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                        Replace Image {/* Button text */}
                                    </button>
                                </div>
                            </div>
                        ) : ( // No image box
                            <div 
                                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer ${imageUploadActive.service_image ? '' : 'opacity-50 cursor-not-allowed'}`} 
                                onClick={() => imageUploadActive.service_image && fileInputRefs.service_image.current?.click()} // Clickable area
                            >
                                <span className="text-gray-700">Upload Image</span>
                                <button 
                                    type="button" 
                                    className="flex items-center px-3 py-2 text-gray-700 rounded ml-2" // Added margin-left for spacing
                                    disabled={!imageUploadActive.service_image}
                                >
                                    <FontAwesomeIcon icon={faFileUpload} /> {/* File upload icon without margin */}
                                </button>
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
                    
                    <div className="mb-4"> 
                        <label className="block mb-2 text-gray-500 font-semibold">Years of Experience Title</label>
                        <input 
                            className="w-full px-4 py-2 border rounded" 
                            name="years_of_experience_title" 
                            value={editService.years_of_experience_title} // Updated field name
                            onChange={handleChange} 
                        /> 
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-gray-500 font-semibold">Years of Experience</label>
                        <input 
                            className="w-full px-4 py-2 border rounded" 
                            name="years_of_experience" 
                            value={editService.years_of_experience} // Updated field name
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-gray-500 font-semibold">Satisfied Clients Title</label>
                        <input 
                            className="w-full px-4 py-2 border rounded" 
                            name="satisfied_clients_title" 
                            value={editService.satisfied_clients_title} // Updated field name
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-gray-500 font-semibold">Satisfied Clients</label>
                        <input 
                            className="w-full px-4 py-2 border rounded" 
                            name="satisfied_clients" 
                            value={editService.satisfied_clients} // Updated field name
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-gray-500 font-semibold">Services Provided Title</label>
                        <input 
                            className="w-full px-4 py-2 border rounded" 
                            name="services_provided_title" 
                            value={editService.services_provided_title} // Updated field name
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-gray-500 font-semibold">Services Provided</label>
                        <input 
                            className="w-full px-4 py-2 border rounded" 
                            name="services_provided" 
                            value={editService.services_provided} // Updated field name
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-gray-500 font-semibold">Business Portfolios Title</label>
                        <input 
                            className="w-full px-4 py-2 border rounded" 
                            name="business_portfolios_title" 
                            value={editService.business_portfolios_title} // Updated field name
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-gray-500 font-semibold">Business Portfolios</label>
                        <input 
                            className="w-full px-4 py-2 border rounded" 
                            name="business_portfolios" 
                            value={editService.business_portfolios} // Updated field name
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="mb-4"> {/* Collection Heading Input */}
                        <label className="block mb-2 text-gray-500 font-semibold">Collection Heading</label>
                        <input 
                            className="w-full px-4 py-2 border rounded" 
                            name="collection_heading" 
                            value={editService.collection_heading} // Updated field name
                            onChange={handleChange} 
                        /> {/* Collection Heading input */}
                    </div>
                    <div className="mb-4"> {/* Collection Content Input */}
                        <label className="block mb-2 text-gray-500 font-semibold">Collection Content</label>
                        <textarea 
                            className="w-full px-4 py-2 border rounded" 
                            name="collection_content" 
                            value={editService.collection_content} // Updated field name
                            onChange={handleChange} 
                        /> {/* Collection Content input */}
                    </div>
                    <div className="mb-4"> {/* Collection Image Input */}
                        <label className="block mb-2 text-gray-500 font-semibold">Collection Image</label>
                        {imagePreviews.collection_image ? ( // Check if the collection image preview exists
                            <div className="mb-2">
                                <Image 
                                    src={imagePreviews.collection_image} 
                                    alt="Collection Image" 
                                    width={300} 
                                    height={200} 
                                    className="rounded-md mb-4" 
                                />
                                <div className="flex gap-2 mt-2"> {/* Flex container for icons */}
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveImage('collection_image')} 
                                        className="flex items-center px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                        Replace Image {/* Button text */}
                                    </button>
                                </div>
                            </div>
                        ) : ( // No image box
                            <div 
                                className={`w-[300px] h-[200px] bg-gray-200 rounded-md flex items-center justify-center mb-2 cursor-pointer ${imageUploadActive.collection_image ? '' : 'opacity-50 cursor-not-allowed'}`} 
                                onClick={() => imageUploadActive.collection_image && fileInputRefs.collection_image.current?.click()} // Clickable area
                            >
                                <span className="text-gray-700">Upload Image</span>
                                <button 
                                    type="button" 
                                    className="flex items-center px-3 py-2 text-gray-700 rounded ml-2" // Added margin-left for spacing
                                    disabled={!imageUploadActive.collection_image}
                                >
                                    <FontAwesomeIcon icon={faFileUpload} /> {/* File upload icon without margin */}
                                </button>
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

                    <div className="mb-4">
                        <label className="block mb-2 text-gray-500 font-semibold">Service Provided Heading</label>
                        <input 
                            className="w-full px-4 py-2 border rounded" 
                            name="service_provided_heading" 
                            value={editService.service_provided_heading} // Updated field name
                            onChange={handleChange} 
                        />
                    </div>

                    <button type="submit" className={`w-20 px-4 py-2 bg-[#609641] text-white rounded ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''} mt-4 mb-8`} disabled={!isDirty}>Update</button> {/* Update button */}
                    <button type="button" onClick={handleCancel} className="w-20 px-4 py-2 bg-gray-500 text-white rounded mt-4 mb-8">Cancel</button> {/* Cancel button */}
                </form>
            )}
        </div>
    );
};

export default EditServicePage; // Updated export