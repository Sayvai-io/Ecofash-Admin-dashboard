"use client";
import React, { useState, useRef } from "react";

const Blog: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    }
  };

  const handlePublish = () => {
    console.log('Publishing blog:', { title, content, tags, image });
    // Implement actual publish logic here
  };

  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <div className="blog-creation">
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
              className="publish-button px-4 py-2 bg-green-500 text-white rounded"
              onClick={handlePublish}
            >
              Publish Blog
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
