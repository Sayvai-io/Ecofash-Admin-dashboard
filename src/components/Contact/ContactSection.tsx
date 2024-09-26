"use client";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import ContactForm from "./ContactForm";
import Contactpagepreview from "./Contactpagepreview";
import EditContact from "./EditContact"; // Assuming EditContact is imported from somewhere

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ContactSection = () => {
    const [contacts, setContacts] = useState<any[]>([]); // State to hold contact data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [isContact, setIsContact] = useState(false);
    const [isEditContact, setIsEditContact] = useState(false); // State for EditContact visibility
    const [selectedContact, setSelectedContact] = useState<any | null>(null); // State to hold the selected contact for editing

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true); // Set loading to true before fetching
            const { data, error } = await supabase
                .from("contact") // Replace with your table name
                .select("*"); // Fetch all columns

            if (error) {
                console.error("Error fetching contacts:", error);
                setError("Failed to fetch contacts."); // Set error message
            } else {
                console.log("Fetched contacts:", data); // Log the fetched data to the console
                setContacts(data); // Set the fetched data to state
            }
            setLoading(false); 
            data?.length === 0 ? setIsContact(true) : setIsContact(false); // Determine if to show form or preview
        };

        fetchContacts();
    }, []); // Empty dependency array means this runs once on mount

    const handleFormSubmit = async (formData: any) => {
        const { error } = await supabase
            .from("contact") // Replace with your table name
            .insert([formData]); // Insert the new contact data

        if (error) {
            console.error("Error adding contact:", error);
            setError("Failed to add contact."); // Set error message
        } else {
            setContacts([...contacts, formData]); // Update contacts state
            setIsContact(false); // Show contact preview after adding
        }
    };

    const handleDelete = (id: string) => {
        // Logic to delete the contact by id
    };

    const handleEditContact = (contact: any) => {
        setSelectedContact(contact); // Set the selected contact for editing
        setIsEditContact(true); // Show EditContact
    };

    const handleSave = () => {
        setIsEditContact(false); // Hide EditContact and show preview
        setSelectedContact(null); // Clear selected contact
    };

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Display error message if any
    }

    return (
        <div>
            {contacts.length === 0 ? (
                <ContactForm onSubmit={handleFormSubmit} /> // Show ContactForm if no contacts
            ) : isEditContact ? (
                <EditContact/> // Pass selected contact to EditContact
            ) : (
                <Contactpagepreview 
                    contacts={contacts} 
                    onDelete={handleDelete} 
                    onEdit={handleEditContact} // Pass handleEditContact
                />
            )}
        </div>
    );
}

export default ContactSection;