"use client"; // Mark this component as a client component

import React, { useEffect, useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import Image from 'next/image'; // Import Image for displaying images
import DOMPurify from 'dompurify';
import supabase from "@/utils/supabaseClient"; // Import your Supabase client

const ContactForm_Preview = () => {
    const [formData, setFormData] = useState<any[]>([]); // State to hold fetched data

    useEffect(() => {
        const fetchContactForms = async () => {
            const { data, error } = await supabase
                .from('contact_form')
                .select('*');

            if (error) {
                console.error("Error fetching contact forms:", error);
            } else {
                setFormData(data);
            }
        };

        fetchContactForms();
    }, []);

    return (
        <div className="max-w-5xl mx-auto pb-6 mt-2 bg-white border rounded-lg shadow-lg p-4 sm:p-6 lg:p-10">
            <h2 className="text-xl font-bold mb-4">Contact Us Form Details </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2 text-left">ID</th>
                            <th className="border border-gray-300 p-2 text-left">Name</th>
                            <th className="border border-gray-300 p-2 text-left">Email</th>
                            <th className="border border-gray-300 p-2 text-left">Phone Number</th>
                            <th className="border border-gray-300 p-2 text-left">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.length > 0 ? (
                            formData.map((form) => (
                                <tr key={form.id} className="border-b">
                                    <td className="border border-gray-300 p-2">{form.id}</td>
                                    <td className="border border-gray-300 p-2">{form.name}</td>
                                    <td className="border border-gray-300 p-2">{form.email}</td>
                                    <td className="border border-gray-300 p-2">{form.phone_number}</td>
                                    <td className="border border-gray-300 p-2">{form.message}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="border border-gray-300 p-2 text-center">
                                    No contact forms available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContactForm_Preview; // Updated export