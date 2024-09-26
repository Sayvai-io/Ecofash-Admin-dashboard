"use client";
import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router'; // Import useRouter

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EditContact: React.FC = ({contacts:any}) => {
  const router = useRouter(); // Initialize router
  const { id, title, subquotes, bg_image, email, contact_title, contact_content, contact_phone, email_title, email_content } = router.query; // Get query parameters

  const [contactData, setContactData] = useState({
    title: title || '',
    subquotes: subquotes || '',
    bgImage: bg_image || '',
    email: email || '',
    contactTitle: contact_title || '',
    contactContent: contact_content || '',
    contactPhone: contact_phone || '',
    emailTitle: email_title || '',
    emailContent: email_content || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setContactData({
        title: title || '',
        subquotes: subquotes || '',
        bgImage: bg_image || '',
        email: email || '',
        contactTitle: contact_title || '',
        contactContent: contact_content || '',
        contactPhone: contact_phone || '',
        emailTitle: email_title || '',
        emailContent: email_content || '',
      });
    }
  }, [contactData]);

  const updateContactDetails = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact')
        .update({
          title: contactData.title,
          subquotes: contactData.subquotes,
          bg_image: contactData.bgImage,
          email: contactData.email,
          contact_title: contactData.contactTitle,
          contact_content: contactData.contactContent,
          contact_phone: contactData.contactPhone,
          email_title: contactData.emailTitle,
          email_content: contactData.emailContent,
        })
        .eq('id', id);

      if (error) {
        throw error;
      }
      
      alert('Contact updated successfully!');
    } catch (error) {
      console.error('Error updating contact details:', error);
      setError('Failed to update contact');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    await updateContactDetails();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
      <div className="col-span-12 xl:col-span-8">
        <form onSubmit={handleSubmit}>
          {/* Contact Title Input */}
          <div className="mb-4">
            <label htmlFor="contact-title" className="block mb-2">Title</label>
            <input
              id="contact-title"
              type="text"
              value={contactData.title}
              onChange={(e) => setContactData({ ...contactData, title: e.target.value })}
              placeholder="Enter title"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Subquotes Input */}
          <div className="mb-4">
            <label htmlFor="subquotes" className="block mb-2">Subquotes</label>
            <input
              id="subquotes"
              type="text"
              value={contactData.subquotes}
              onChange={(e) => setContactData({ ...contactData, subquotes: e.target.value })}
              placeholder="Enter subquotes"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Background Image Input */}
          <div className="mb-4">
            <label htmlFor="bg-image" className="block mb-2">Background Image</label>
            <input
              id="bg-image"
              type="text"
              value={contactData.bgImage}
              onChange={(e) => setContactData({ ...contactData, bgImage: e.target.value })}
              placeholder="Enter background image URL"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={contactData.email}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Contact Title Input */}
          <div className="mb-4">
            <label htmlFor="contact-title" className="block mb-2">Contact Title</label>
            <input
              id="contact-title"
              type="text"
              value={contactData.contactTitle}
              onChange={(e) => setContactData({ ...contactData, contactTitle: e.target.value })}
              placeholder="Enter contact title"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Contact Content Input */}
          <div className="mb-4">
            <label htmlFor="contact-content" className="block mb-2">Contact Content</label>
            <textarea
              id="contact-content"
              value={contactData.contactContent}
              onChange={(e) => setContactData({ ...contactData, contactContent: e.target.value })}
              placeholder="Enter contact content"
              rows={5}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Contact Phone Input */}
          <div className="mb-4">
            <label htmlFor="contact-phone" className="block mb-2">Contact Phone</label>
            <input
              id="contact-phone"
              type="text"
              value={contactData.contactPhone}
              onChange={(e) => setContactData({ ...contactData, contactPhone: e.target.value })}
              placeholder="Enter contact phone"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Email Title Input */}
          <div className="mb-4">
            <label htmlFor="email-title" className="block mb-2">Email Title</label>
            <input
              id="email-title"
              type="text"
              value={contactData.emailTitle}
              onChange={(e) => setContactData({ ...contactData, emailTitle: e.target.value })}
              placeholder="Enter email title"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Email Content Input */}
          <div className="mb-4">
            <label htmlFor="email-content" className="block mb-2">Email Content</label>
            <textarea
              id="email-content"
              value={contactData.emailContent}
              onChange={(e) => setContactData({ ...contactData, emailContent: e.target.value })}
              placeholder="Enter email content"
              rows={5}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Update Button */}
          <button 
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Contact'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditContact;
