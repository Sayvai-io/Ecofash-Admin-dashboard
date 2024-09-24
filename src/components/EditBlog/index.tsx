// // components/EditBlog/index.tsx
// "use client";
// import React, { useState, useEffect } from "react";
// import { createClient } from '@supabase/supabase-js';
// import { useParams } from 'next/navigation';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// const EditBlog: React.FC = () => {
//   const { id } = useParams();

//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [tags, setTags] = useState<string[]>([]);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchBlogDetails = async () => {
//       if (id) {
//         setIsLoading(true);
//         const { data, error } = await supabase
//           .from('blogs')
//           .select('*')
//           .eq('id', id)
//           .single();

//         if (error) {
//           console.error('Error fetching blog details:', error);
//           setError('Blog not found');
//         } else {
//           setTitle(data.title);
//           setContent(data.content);
//           setTags(data.tags);
//           setImagePreview(data.image_url);
//         }
//         setIsLoading(false);
//       }
//     };

//     fetchBlogDetails();
//   }, [id]);

//   // Additional handling (image upload, form submission, etc.) goes here

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <form>
//       <h1>Edit Blog</h1>
//       <p>Editing Blog ID: {id}</p>
//       {/* Add form fields for title, content, tags, and image upload */}
//     </form>
//   );
// };

// export default EditBlog;
"use client";
import React, { useState, useEffect, useRef } from "react";
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
  const [inputValue, setInputValue] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddTag = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setRemoveExistingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setRemoveExistingImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File) => {
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(`public/${file.name}`, file);

    if (error) {
      throw error;
    }

    const { data: publicUrl } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  const updateBlogPost = async (title: string, content: string, imageUrl: string | null, tags: string[]) => {
    const { data, error } = await supabase
      .from('blogs')
      .update({ title, content, image_url: imageUrl, tags })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return data;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let imageUrl = removeExistingImage ? null : imagePreview;

      if (image) {
        imageUrl = await uploadImage(image);
      }

      await updateBlogPost(title, content, imageUrl, tags);
      
      alert('Blog post updated successfully!');
      window.location.reload(); // Refresh the page to show updated content
    } catch (error) {
      console.error('Error updating blog post:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
      <div className="col-span-12 xl:col-span-8">
        <form onSubmit={handleSubmit}>
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
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
              Choose Image
            </button>
            {(imagePreview || image) && (
              <button 
                type="button"
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Remove Image
              </button>
            )}
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

          {/* Update Button */}
          <button 
            type="submit"
            className="update-button px-4 py-2 bg-green-500 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Blog'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;