import React, { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import Image from 'next/image'; // Import Image for displaying images

type ContactPagePreviewProps = { // Updated type name
    setIsEditContact: (isEdit: boolean) => void; // Changed function name
    setContactData: (data: any) => void; // Changed function name
    contactData?: any[]; // Changed prop name
    onDelete: (id: string) => void; // Changed function name
    onEdit: (contact: any) => void; // Changed function name
};

const ContactPagePreview = ({ 
    setIsEditContact, 
    setContactData,
    contactData = [], // Changed prop name
    onDelete, 
    onEdit 
}: ContactPagePreviewProps) => {
    const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null); // State for dropdown
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [contactToDelete, setContactToDelete] = useState<any>(null); // State for the contact to delete

    const handleDelete = () => { // Changed function name
        if (contactToDelete) {
             onDelete(contactToDelete.id); // Changed function call
            setIsModalOpen(false); // Close the modal
        }
    };

    const handleEdit = (contact: any) => { // Changed function name
        setIsEditContact(true); // Show edit form
        setContactData(contact); // Pass the selected contact data for editing
    };

    return (
        <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-10 "> {/* Adjusted mt-20 for margin-top */}
            {contactData.length === 0 ? ( // Changed data check
                <p>No contact data available.</p> // Updated message
            ) : (
                contactData.map((contact, index) => ( // Changed variable name
                    <>
                     <div className="border-b mb-4"> {/* Added border-bottom class */}
                        <h1 className="text-2xl text-gray-700 font-bold mb-5">Contact Page Preview</h1> {/* Updated heading */}
                    </div>
                    <div key={index} className="mb-4 p-4 border-b flex justify-between items-start gap-10"> {/* Added gap-4 for spacing */}
                        
                        <div className="flex-1"> {/* Allow title and content to take available space */}
                            <h3 className="text-xl text-gray-700 font-semibold mb-4">{contact.title}</h3> {/* Title */}
                            <h3 className="text-xl text-gray-700 font-semibold mb-4">{contact.subquotes}</h3> {/* Subquote */}
                            {contact.bg_image && ( // Updated property name
                                <Image 
                                    src={contact.bg_image} // Updated property name
                                    alt="Background Image" 
                                    width={300}  
                                    height={200} 
                                    className="rounded-md mb-4" 
                                />
                            )}
                            <p className="text-gray-700 mb-4">{contact.email_title}</p> {/* Updated property name */}
                            <p className="text-gray-700 mb-4">{contact.email_content}</p> {/* Updated property name */}
                            <p className="text-gray-700 mb-4">{contact.email}</p> {/* Updated property name */} 
                            <p className="text-gray-700 mb-4">{contact.contact_title}</p> {/* Updated property name */}
                            <p className="text-gray-700 mb-4">{contact.contact_content}</p> {/* Updated property name */}
                            <p className="text-gray-700 mb-4">{contact.contact_phone}</p> {/* Updated property name */}
                        </div>

                        {/* Dropdown Button */}
                        <div className="flex flex-col items-end"> {/* Align dropdown button to the right */}
                            <button 
                                className="text-gray-500 hover:text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md p-2" 
                                onClick={(e) => {
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
                                                setIsEditContact(true); // Changed function call
                                                setDropdownOpenIndex(null);
                                                onEdit(contact); // Changed function call
                                            }}
                                        >
                                            <FaEdit className="mr-2" /> <span>Edit</span>
                                        </button>
                                    </li>
                                    <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"
                                        onClick={() => {
                                            setDropdownOpenIndex(null);
                                            setContactToDelete(contact); // Changed variable name
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
                        <p>Are you sure you want to delete this contact data?</p> {/* Updated message */}
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setIsModalOpen(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button> {/* Changed function call */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPagePreview; // Updated export