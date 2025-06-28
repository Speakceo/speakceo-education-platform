import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Upload, 
  Video, 
  FileText, 
  Link as LinkIcon,
  HelpCircle,
  Plus,
  Eye
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export interface Lesson {
  id: string;
  title: string;
  type: string;
  content: string | null;
  duration: string;
  description?: string;
  module_id: string;
  order?: number;
  order_index?: number;
  status: string;
  points: number;
  url: string | null;
}

interface ContentEditorProps {
  lessonId: string;
  onClose: () => void;
  onSave: (updatedLesson: Lesson) => void;
}

export default function CourseContentEditor({ lessonId, onClose, onSave }: ContentEditorProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [contentType, setContentType] = useState<'text' | 'url' | 'file'>('text');
  const [previewActive, setPreviewActive] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      
      if (error) throw error;
      
      setLesson(data);
      setContent(data.content || '');
      setUrl(data.url || '');
      
      // Determine content type
      if (data.content) {
        setContentType('text');
      } else if (data.url) {
        setContentType('url');
      } else {
        setContentType('text');
      }

      console.log("Fetched lesson data:", data);
    } catch (error: any) {
      console.error('Error fetching lesson:', error);
      setError(error.message || 'Failed to fetch lesson');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lesson) return;
    
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setError(null);
      
      // Determine which fields to update based on content type
      const updateData: Record<string, any> = {
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        duration: lesson.duration,
        description: lesson.description,
        module_id: lesson.module_id,
        status: lesson.status,
        points: lesson.points || 0
      };

      // Add order field using either order or order_index
      if (lesson.order !== undefined) {
        updateData.order = lesson.order;
      } else if (lesson.order_index !== undefined) {
        updateData.order = lesson.order_index;
      }
      
      // Set content or URL based on content type
      if (contentType === 'text') {
        updateData.content = content;
        updateData.url = null;
      } else if (contentType === 'url') {
        updateData.content = null;
        updateData.url = url;
      }
      
      console.log('Updating lesson with data:', updateData);
      
      const { error } = await supabase
        .from('lessons')
        .update(updateData)
        .eq('id', lesson.id);
      
      if (error) throw error;
      
      // Create updated lesson object for parent component
      const updatedLesson: Lesson = {
        ...lesson,
        content: contentType === 'text' ? content : null,
        url: contentType === 'url' ? url : null
      };
      
      setSaveSuccess(true);
      onSave(updatedLesson);

      // Refresh the lesson data to ensure we display the latest content
      fetchLesson();
    } catch (error: any) {
      console.error('Error saving lesson content:', error);
      setError(error.message || 'Failed to save lesson content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !lesson) return;
    
    try {
      setUploadProgress(0);
      setError(null);
      
      // Determine file type for storage path
      let fileType = 'documents';
      if (file.type.startsWith('video/')) {
        fileType = 'videos';
      } else if (file.type.startsWith('image/')) {
        fileType = 'images';
      }
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
      const filePath = `${fileType}/${fileName}`;
      
      // Upload progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null || prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      // Upload the file using Supabase
      const { data, error } = await supabase.storage
        .from('course-content')
        .upload(filePath, file);
      
      clearInterval(progressInterval);
      
      if (error) throw error;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-content')
        .getPublicUrl(filePath);
      
      // Update the lesson with the file URL
      setUrl(publicUrl);
      setContentType('url');
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadProgress(null);
      }, 1000);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setError(error.message || 'Failed to upload file');
      setUploadProgress(null);
    }
  };

  // Function to render content preview when the preview button is clicked
  const renderContentPreview = () => {
    if (!previewActive) return null;
    
    if (contentType === 'text' && content) {
      return (
        <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Preview</h3>
          <div className="prose max-w-none">
            {content}
          </div>
        </div>
      );
    } else if (contentType === 'url' && url) {
      // Determine if it's a video, PDF, or other type
      const isVideo = /\.(mp4|webm|ogg)$/i.test(url) || url.includes('youtube.com') || url.includes('youtu.be');
      const isPdf = /\.pdf$/i.test(url);
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
      
      return (
        <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Preview</h3>
          {isVideo && (
            <div>
              {url.includes('youtube.com') || url.includes('youtu.be') ? (
                <iframe 
                  src={url.replace('watch?v=', 'embed/')} 
                  className="w-full aspect-video rounded-md" 
                  allowFullScreen
                ></iframe>
              ) : (
                <video controls className="w-full max-h-96 rounded-md">
                  <source src={url} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          {isPdf && (
            <div>
              <p>PDF document: <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url.split('/').pop()}</a></p>
              <iframe src={url} className="w-full h-96 rounded-md mt-2"></iframe>
            </div>
          )}
          {isImage && (
            <img src={url} alt="Content preview" className="max-w-full max-h-96 rounded-md" />
          )}
          {!isVideo && !isPdf && !isImage && (
            <div>
              <p>External content: <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a></p>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  const renderContentEditor = () => {
    if (contentType === 'text') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={12}
            placeholder="Enter lesson content in Markdown format..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Markdown formatting is supported. You can use # for headers, ** for bold, * for italic, etc.
          </p>
          {content && (
            <button
              onClick={() => setPreviewActive(!previewActive)}
              className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            >
              <Eye className="h-4 w-4 mr-1" />
              {previewActive ? 'Hide Preview' : 'Show Preview'}
            </button>
          )}
        </div>
      );
    } else if (contentType === 'url') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content URL
          </label>
          <div className="flex">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
              placeholder="https://example.com/video.mp4"
            />
            <button
              onClick={() => {
                const testUrl = window.open(url, '_blank');
                if (testUrl) testUrl.focus();
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md"
              disabled={!url}
            >
              Test
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Enter a URL for your video, document, or other external content.
          </p>
          {url && (
            <button
              onClick={() => setPreviewActive(!previewActive)}
              className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            >
              <Eye className="h-4 w-4 mr-1" />
              {previewActive ? 'Hide Preview' : 'Show Preview'}
            </button>
          )}
        </div>
      );
    } else {
      // File upload option
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, MP4, JPG, PNG up to 100MB
              </p>
            </div>
          </div>
          {uploadProgress !== null && (
            <div className="mt-2">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                      Uploading
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-indigo-600">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  ></div>
                </div>
              </div>
            </div>
          )}
          {url && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Current file:</p>
              <div className="mt-1 text-sm text-blue-600 break-all">
                <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {url.split('/').pop() || url}
                </a>
                <button
                  onClick={() => setPreviewActive(!previewActive)}
                  className="ml-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {previewActive ? 'Hide Preview' : 'Preview'}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // Add a new function to render the existing content preview more prominently
  const renderExistingContent = () => {
    if (!lesson) return null;
    
    // Create a title based on what content exists
    let title = "";
    let content = null;
    
    if (lesson.content) {
      title = "Existing Text Content";
      content = (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="prose max-w-none">
            {lesson.content}
          </div>
        </div>
      );
    } else if (lesson.url) {
      title = "Existing Media Content";
      
      // Determine content type for display
      const isVideo = /\.(mp4|webm|ogg)$/i.test(lesson.url) || lesson.url.includes('youtube.com') || lesson.url.includes('youtu.be');
      const isPdf = /\.pdf$/i.test(lesson.url);
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(lesson.url);
      
      content = (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          {isVideo && (
            <div>
              <p className="mb-2 font-medium">Video:</p>
              {lesson.url.includes('youtube.com') || lesson.url.includes('youtu.be') ? (
                <div>
                  <p className="break-all text-blue-600">
                    <a href={lesson.url} target="_blank" rel="noopener noreferrer" className="underline">{lesson.url}</a>
                  </p>
                  <div className="mt-2 aspect-video">
                    <iframe 
                      src={lesson.url.replace('watch?v=', 'embed/')} 
                      className="w-full h-full rounded-md" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="break-all text-blue-600">
                    <a href={lesson.url} target="_blank" rel="noopener noreferrer" className="underline">{lesson.url}</a>
                  </p>
                  <video controls className="w-full max-h-80 mt-2 rounded-md">
                    <source src={lesson.url} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          )}
          
          {isPdf && (
            <div>
              <p className="mb-2 font-medium">PDF Document:</p>
              <p className="break-all text-blue-600">
                <a href={lesson.url} target="_blank" rel="noopener noreferrer" className="underline">{lesson.url}</a>
              </p>
              <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
                <iframe src={lesson.url} className="w-full h-80"></iframe>
              </div>
            </div>
          )}
          
          {isImage && (
            <div>
              <p className="mb-2 font-medium">Image:</p>
              <p className="break-all text-blue-600">
                <a href={lesson.url} target="_blank" rel="noopener noreferrer" className="underline">{lesson.url}</a>
              </p>
              <div className="mt-2">
                <img src={lesson.url} alt="Lesson content" className="max-w-full max-h-80 rounded-md" />
              </div>
            </div>
          )}
          
          {!isVideo && !isPdf && !isImage && (
            <div>
              <p className="mb-2 font-medium">External Resource:</p>
              <p className="break-all text-blue-600">
                <a href={lesson.url} target="_blank" rel="noopener noreferrer" className="underline">{lesson.url}</a>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Open the link to view this content. It appears to be a file or resource not previewable in the editor.
              </p>
            </div>
          )}
        </div>
      );
    }
    
    if (!content) return null;
    
    return (
      <div className="mb-6 border-l-4 border-indigo-500 pl-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {content}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading lesson content...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-8 text-center text-red-600">
        <HelpCircle className="h-12 w-12 mx-auto mb-4" />
        <p>Lesson not found. Please try again or select a different lesson.</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Content: {lesson.title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 mb-4 bg-green-100 border border-green-400 text-green-800 rounded-md">
          Content saved successfully! Changes will be immediately visible to all users.
        </div>
      )}

      {/* Display existing content preview */}
      {renderExistingContent()}

      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setContentType('text')}
              className={`flex items-center px-4 py-2 rounded-md ${
                contentType === 'text'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              Text Content
            </button>
            <button
              onClick={() => setContentType('url')}
              className={`flex items-center px-4 py-2 rounded-md ${
                contentType === 'url'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <LinkIcon className="h-5 w-5 mr-2" />
              URL Link
            </button>
            <button
              onClick={() => setContentType('file')}
              className={`flex items-center px-4 py-2 rounded-md ${
                contentType === 'file'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload File
            </button>
          </div>

          {renderContentEditor()}
          {renderContentPreview()}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center px-4 py-2 rounded-md ${
                isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Content
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 