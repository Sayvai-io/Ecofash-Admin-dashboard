
"use client";
import React, { useState, useRef, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Blog: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Debugging Supabase client setup
  useEffect(() => {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set');
    console.log('Supabase client initialized:', !!supabase);
  }, []);

  // Tag management
  const handleAddTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle image file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File) => {
    console.log('Uploading image...');
    try {
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(`public/${file.name}`, file);

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      console.log('Image uploaded successfully, data:', data);
      const { data:publicUrl } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);

      console.log('Public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  };

  // Insert blog post into Supabase database
  const addBlogPost = async (title: string, content: string, imageUrl: string, tags: string[]) => {
    console.log('Adding blog post...', { title, content, imageUrl, tags });
    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert([{ title, content, image_url: imageUrl, tags }]);

      if (error) {
        console.error('Error adding blog post:', error);
        throw error;
      }

      console.log('Blog post added successfully, data:', data);
      return data;
    } catch (error) {
      console.error('Error in addBlogPost:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted', { title, content, tags, image });
    setError(null);
    setIsLoading(true);

    try {
      if (!image) {
        throw new Error('Please select an image');
      }

      // Upload image and get the URL
      const imageUrl = await uploadImage(image);
      console.log('Image uploaded, URL:', imageUrl);
      
      // Add blog post
      const result = await addBlogPost(title, content, imageUrl.publicUrl, tags);
      console.log('Blog post added, result:', result);
      
      alert('Blog post added successfully!');
      // Reset form
      setTitle('');
      setContent('');
      setTags([]);
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting blog post:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
      <div className="col-span-12 xl:col-span-8">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="blog-creation">
          {/* Blog Title Input */}
          <div className="blog-title-input mb-4">
            <label htmlFor="blog-title" className="block mb-2">Blog Title</label>
            <input
              id="blog-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog title"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Blog Content Editor */}
          <div className="blog-content-editor mb-4">
            <label htmlFor="blog-content" className="block mb-2">Blog Content</label>
            <textarea
              id="blog-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              rows={10}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="image-upload mb-4">
            <label htmlFor="blog-image" className="block mb-2">Blog Image</label>
            <input
              type="file"
              id="blog-image"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
              required
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Choose Image
            </button>
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="max-w-xs" />
              </div>
            )}
          </div>

          {/* Tag Input */}
          <div className="tag-input mb-4">
            <label htmlFor="blog-tag" className="block mb-2">Tags</label>
            <div className="flex mb-2">
              <input
                id="blog-tag"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a tag"
                className="flex-grow px-4 py-2 border rounded-l"
              />
              <button 
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-r"
              >
                Add
              </button>
            </div>
            <div className="tags-list flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="tag bg-gray-200 px-2 py-1 rounded flex items-center">
                  {tag}
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Publish Button */}
          <button 
            type="submit"
            className="publish-button px-4 py-2 bg-green-500 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Publishing...' : 'Publish Blog'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Blog;