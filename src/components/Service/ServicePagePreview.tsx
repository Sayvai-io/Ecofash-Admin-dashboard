import React, { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import Image from 'next/image'; // Import Image for displaying images
import DOMPurify from 'dompurify';

type ServicePagePreviewProps = { // Updated type name
    setIsEditService: (isEdit: boolean) => void; // Changed function name
    setServiceData: (data: any) => void; // Function to update the service data in the parent component
    serviceData?: any[]; // Changed prop name
    onDelete: (id: string) => void; // Changed function name
    onEdit: (service: any) => void; // Changed function name
};

const ServicePagePreview = ({ 
    setIsEditService, 
    setServiceData,
    serviceData = [], // Changed prop name
    onDelete, 
    onEdit 
}: ServicePagePreviewProps) => { // Updated props
    const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null); // State for dropdown
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [serviceToDelete, setServiceToDelete] = useState<any>(null); // State for the service to delete

    const handleDelete = () => {
        if (serviceToDelete) {
            onDelete(serviceToDelete.id); // Call the delete function passed as a prop
            setIsModalOpen(false); // Close the modal
        }
    };

    const handleEdit = (service: any) => {
        setIsEditService(true); // Show edit form
        setServiceData(service); // Pass the selected service data for editing
    };

    const sanitizeHTML = (html: string) => {
        return {
            __html: DOMPurify.sanitize(html)
        };
    };

    return (
        <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10 "> {/* Adjusted mt-20 for margin-top */}
            {serviceData.length === 0 ? (
                <p>No service data available.</p> // Message if no service data
            ) : (
                serviceData.map((service, index) => (
                    <>
                     <div className="border-b mb-4"> {/* Added border-bottom class */}
                        <h1 className="text-2xl text-gray-700 font-bold mb-5">Service Page Preview</h1> {/* Updated heading */}
                    </div>
                    <div key={index} className="mb-4 p-4 border-b flex justify-between items-start gap-10"> {/* Added gap-4 for spacing */}
                        
                        <div className="flex-1"> {/* Allow title and content to take available space */}
                            <h3 className="text-xl text-gray-700 font-semibold mb-4" dangerouslySetInnerHTML={sanitizeHTML(service.service_heading)}></h3> {/* Service heading */}
                            <p className="text-gray-700 text-lg mb-1" dangerouslySetInnerHTML={sanitizeHTML(service.service_content)}></p> {/* Service content */}
                            {service.service_image && ( // Display Service image if it exists
                                <Image 
                                    src={service.service_image} 
                                    alt="Service Image" 
                                    width={300}  
                                    height={200} 
                                    className="rounded-md mb-4" 
                                />
                            )}
                            <p className="text-gray-700 mb-1" dangerouslySetInnerHTML={sanitizeHTML(service.years_of_experience_title)}></p> {/* Years of experience title */}
                            <p className="text-gray-700 font-semibold text-xl mb-2">{service.years_of_experience}</p> {/* Years of experience */}
                            <p className="text-gray-700 mb-1" dangerouslySetInnerHTML={sanitizeHTML(service.satisfied_clients_title)}></p> {/* Satisfied clients title */}
                            <p className="text-gray-700 font-semibold text-xl mb-2">{service.satisfied_clients}</p> {/* Satisfied clients */}
                            <p className="text-gray-700 mb-1" dangerouslySetInnerHTML={sanitizeHTML(service.services_provided_title)}></p> {/* Services provided title */}
                            <p className="text-gray-700 font-semibold text-xl mb-2">{service.services_provided}</p> {/* Services provided */}
                            <p className="text-gray-700 mb-1" dangerouslySetInnerHTML={sanitizeHTML(service.business_portfolios_title)}></p> {/* Business portfolios title */}
                            <p className="text-gray-700 font-semibold text-xl mb-2">{service.business_portfolios}</p> {/* Business portfolios */}
                            <p className="text-gray-700 mb-1" dangerouslySetInnerHTML={sanitizeHTML(service.collection_heading)}></p> {/* Collection heading */}
                            <p className="text-gray-700 font-semibold text-xl mb-2" dangerouslySetInnerHTML={sanitizeHTML(service.collection_content)}></p> {/* Collection content */}
                            {service.collection_image && ( // Display Collection image if it exists
                                <Image 
                                    src={service.collection_image} 
                                    alt="Collection Image" 
                                    width={300}  
                                    height={200} 
                                    className="rounded-md mb-4" 
                                />
                            )}
                            <p className="text-gray-700 font-semibold text-xl mb-2" dangerouslySetInnerHTML={sanitizeHTML(service.service_provided_heading)}></p> {/* Collection content */}
                        </div>

                        {/* Dropdown Button */}
                        <div className="flex flex-col items-end"> {/* Align dropdown button to the right */}
                            <button 
                                className="text-gray-500 hover:text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md p-2" 
                                onClick={(e) => {
                                    // Toggle dropdown without preventing scroll
                                    setDropdownOpenIndex(dropdownOpenIndex === index ? null : index);
                                }}
                            >
                                <FaEllipsisV className="h-3 w-3" />
                            </button>
                            {/* Dropdown Menu */}
                            <div className={`mt-2 w-34 bg-gray-100 border rounded-md shadow-lg z-10 ${dropdownOpenIndex === index ? 'block' : 'hidden'}`}>
                                <ul className="py-1">
                                    <li className="px-3 py-1 text-gray-700 hover:bg-gray-200 cursor-pointer flex">
                                        <button
                                            className="flex items-center"
                                            onClick={() => {
                                                setIsEditService(true); // Changed function call
                                                setDropdownOpenIndex(null);
                                                onEdit(service); // Changed function call
                                            }}
                                        >
                                            <FaEdit className="mr-2" /> <span>Edit</span>
                                        </button>
                                    </li>
                                    <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"
                                        onClick={() => {
                                            setDropdownOpenIndex(null);
                                            setServiceToDelete(service); // Changed variable name
                                            setIsModalOpen(true); // Open the modal
                                        }}
                                    >
                                        <FaTrash className="mr-2" /> <span>Delete</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                   </> 
                ))
            )}

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-md shadow-lg">
                        <h2 className="text-lg font-bold">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this service data?</p> {/* Updated message */}
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

export default ServicePagePreview; // Updated export