"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import ContactForm from "./ContactForm"; // Updated import
import EditContact from "./EditContact"; // Updated import
import ContactPagePreview from "./ContactPagePreview";


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ContactSection = () => { // Updated component name
    const [contactData, setContactData] = useState<any[]>([]); // Updated state name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isContactEmpty, setIsContactEmpty] = useState(false); // Updated state name
    const [isEditContact, setIsEditContact] = useState(false); // Updated state name
    const [selectedContact, setSelectedContact] = useState<any | null>(null); // Updated state name

    useEffect(() => {
        const fetchContactData = async () => { // Updated function name
            setLoading(true);
            const { data, error } = await supabase
                .from("contact") // Updated table name
                .select("*");

            if (error) {
                console.error("Error fetching contact data:", error); // Updated log message
                setError("Failed to fetch contact data."); // Updated error message
            } else {
                console.log("Fetched contact data:", data); // Updated log message
                setContactData(data); // Updated state
            }
            setLoading(false);
            data?.length === 0 ? setIsContactEmpty(true) : setIsContactEmpty(false); // Updated condition
        };

        fetchContactData();
    }, []);

    const handleContactFormSubmit = async (formData: any) => { // Updated function name
        const { error } = await supabase
            .from("contact") // Updated table name
            .insert([formData]);

        if (error) {
            console.error("Error adding contact data:", error); // Updated log message
            setError("Failed to add contact data."); // Updated error message
        } else {
            setContactData([...contactData, formData]); // Updated state
            setIsContactEmpty(false); // Updated state
        }
    };

    const handleDeleteContact = (id: string) => { // Updated function name
        // Logic to delete the contact data by id
    };

    const handleEditContact = (contact: any) => { // Updated function name
        setSelectedContact(contact); // Updated state name
        setIsEditContact(true); // Updated state name
        setContactData((prevData) => prevData.map((item) => item.id === contact.id ? contact : item)); // Updated state
    };

    const handleSaveContact = () => { // Updated function name
        setIsEditContact(false); // Updated state name
        setSelectedContact(null); // Updated state name
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {contactData.length === 0 ? (
                <ContactForm onSubmit={handleContactFormSubmit} /> // Updated component
            ) : isEditContact ? (
                <EditContact 
                setIsEditContact={setIsEditContact}
                setContactData={setContactData} // Updated prop
                />
            ) : (
                <ContactPagePreview
                    setIsEditContact={setIsEditContact}
                    contactData={contactData} // Updated prop
                    onDelete={handleDeleteContact} // Updated prop
                    setContactData={setContactData} // Updated prop
                    onEdit={handleEditContact} // Updated prop
                />
            )}
        </div>
    );
}

export default ContactSection; // Updated export