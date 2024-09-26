import React, { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa"; // Import icons

type ContactPagePreviewProps = {
    setIsEditContact: (isEdit: boolean) => void;
    contacts?: any[];
    onDelete: (id: string) => void;
    onEdit: (contact: any) => void;
  };
  
  const Contactpagepreview = ({ 
    setIsEditContact, 
    contacts = [], 
    onDelete, 
    onEdit 
  }: ContactPagePreviewProps) => { // Accept contacts prop and onDelete function
    const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null); // State for dropdown
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [contactToDelete, setContactToDelete] = useState<any>(null); // State for the contact to delete

    const handleDelete = () => {
        if (contactToDelete) {
            onDelete(contactToDelete.id); // Call the delete function passed as a prop
            setIsModalOpen(false); // Close the modal
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 border rounded-md shadow-md pb-6"> {/* Increased width */}
            {contacts.length === 0 ? (
                <p>No contacts available.</p> // Message if no contacts
            ) : (
                contacts.map((contact, index) => (
                    <div key={index} className="mb-4 p-4 border-b relative"> {/* Add bottom margin and padding */}
                        <h3 className="text-lg font-semibold mb-2">{contact.title}</h3> {/* Added mb-2 for bottom margin */}
                        <p className="text-gray-700 mb-1">{contact.subquotes}</p> {/* Added mb-1 for bottom margin */}
                        <p className="text-gray-500 mb-1">{contact.bg_image}</p> {/* Added mb-1 for bottom margin */}
                        <p className="text-gray-700 mb-1">{contact.email}</p> {/* Added mb-1 for bottom margin */}
                        <p className="text-gray-700 mb-1">{contact.contact_title}</p> {/* Added mb-1 for bottom margin */}
                        <p className="text-gray-700 mb-1">{contact.contact_content}</p> {/* Added mb-1 for bottom margin */}
                        <p className="text-gray-700 mb-1">{contact.contact_phone}</p> {/* Added mb-1 for bottom margin */}
                        <p className="text-gray-700 mb-1">{contact.contactContent}</p> {/* Added mb-1 for bottom margin */}
                        <p className="text-gray-700 mb-1">{contact.email_title}</p> {/* Added mb-1 for bottom margin */}
                        <p className="text-gray-700 mb-1">{contact.email_content}</p> {/* Added mb-1 for bottom margin */}

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
                                                setIsEditContact(true)
                                                setDropdownOpenIndex(null);
                                                onEdit(contact); // Pass the contact to onEdit
                                            }}
                                        >
                                            <FaEdit className="mr-2" /> <span>Edit</span>
                                        </button>
                                    </li>
                                    <li className="px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-200 cursor-pointer flex"
                                        onClick={() => {
                                            setDropdownOpenIndex(null);
                                            setContactToDelete(contact); // Set the contact to delete
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
                        <p>Are you sure you want to delete this contact?</p>
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

export default Contactpagepreview;