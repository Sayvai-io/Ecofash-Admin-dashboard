// components/EditBlog/index.tsx
"use client";
import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EditBlog: React.FC = () => {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      if (id) {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching blog details:', error);
          setError('Blog not found');
        } else {
          setTitle(data.title);
          setContent(data.content);
          setTags(data.tags);
          setImagePreview(data.image_url);
        }
        setIsLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  // Additional handling (image upload, form submission, etc.) goes here

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <form>
      <h1>Edit Blog</h1>
      <p>Editing Blog ID: {id}</p>
      {/* Add form fields for title, content, tags, and image upload */}
    </form>
  );
};

export default EditBlog;
