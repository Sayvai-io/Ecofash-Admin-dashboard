import React, { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa"; // Import icons

type ServicePagePreviewProps = {
    setIsEditService: (isEdit: boolean) => void; // Changed function name
    serviceData?: any[]; // Changed prop name
    onDelete: (id: string) => void; // Changed function name
    onEdit: (service: any) => void; // Changed function name
};

const ServicePagePreview = ({ 
    setIsEditService, 
    serviceData = [], // Changed prop name
    onDelete, 
    onEdit 
}: ServicePagePreviewProps) => { // Accept serviceData prop and onDeleteService function
    const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null); // State for dropdown
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [serviceToDelete, setServiceToDelete] = useState<any>(null); // State for the service to delete

    const handleDelete = () => {
        if (serviceToDelete) {
            onDelete(serviceToDelete.id); // Call the delete function passed as a prop
            setIsModalOpen(false); // Close the modal
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 border rounded-md shadow-md pb-6"> {/* Increased width */}
            {serviceData.length === 0 ? (
                <p>No service data available.</p> // Message if no service data
            ) : (
                serviceData.map((service, index) => (
                    <div key={index} className="mb-4 p-4 border-b relative"> {/* Add bottom margin and padding */}
                        <h3 className="text-lg font-semibold mb-2">{service.service_heading}</h3> {/* Service Heading */}
                        <p className="text-gray-500 mb-1">{service.service_image}</p> {/* Service Image */}
                        <p className="text-gray-700 mb-1">{service.service_content}</p> {/* Service Content */}
                        <p className="text-gray-700 mb-1">{service.years_of_experience_title}</p> {/* Years of Experience Title */}
                        <p className="text-gray-700 mb-1">{service.years_of_experience}</p> {/* Years of Experience */}
                        <p className="text-gray-700 mb-1">{service.satisfied_clients_title}</p> {/* Satisfied Clients Title */}
                        <p className="text-gray-700 mb-1">{service.satisfied_clients}</p> {/* Satisfied Clients */}
                        <p className="text-gray-700 mb-1">{service.services_provided_title}</p> {/* Services Provided Title */}
                        <p className="text-gray-700 mb-1">{service.services_provided}</p> {/* Services Provided */}
                        <p className="text-gray-700 mb-1">{service.business_portfolios_title}</p> {/* Business Portfolios Title */}
                        <p className="text-gray-700 mb-1">{service.business_portfolios}</p> {/* Business Portfolios */}
                        <p className="text-gray-700 mb-1">{service.collection_heading}</p> {/* Collection Heading */}
                        <p className="text-gray-700 mb-1">{service.collection_content}</p> {/* Collection Content */}
                        <p className="text-gray-500 mb-1">{service.collection_image}</p> {/* Collection Image */}
                        <p className="text-gray-700 mb-1">{service.service_provided_heading}</p> {/* Service Provided Heading */}

                        {/* Dropdown Button */}
                        <div className="absolute top-2 right-2">
                            <button 
                                className="text-gray-500 hover:text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md p-2" 
                                onClick={() => setDropdownOpenIndex(dropdownOpenIndex === index ? null : index)}
                            >
                                <FaEllipsisV className="h-3 w-3" />
                            </button>
                            {/* Dropdown Menu */}
                            <div className={`absolute right-0 mt-2 w-34 bg-gray-100 border rounded-md shadow-lg z-10 ${dropdownOpenIndex === index ? 'block' : 'hidden'}`}>
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

export default ServicePagePreview;