'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Camera, Save, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../wrapper/store/authStore';
import { getImageUrl, userAPI } from '../../../wrapper/lib/api';
import Image from 'next/image';

function ProfileContent() {
  const router = useRouter();
  const { user, setAuth, token } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const response = await userAPI.uploadProfileImage(selectedFile);
      
      // Update user in store
      if (user && token) {
        setAuth({ ...user, profileImage: response.profileImage }, token);
      }
      
      toast.success('Profile image updated!');
      setPreview(null);
      setSelectedFile(null);
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h1>

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-4xl overflow-hidden border-4 border-gray-200">
                {preview ? (
                  <Image src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : user?.profileImage ? (
                  <Image src={getImageUrl(user.profileImage)} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  user?.username.charAt(0).toUpperCase()
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
                <Camera className="w-5 h-5" />
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
            </div>

            {preview && (
              <div className="mt-4 flex items-center space-x-3">
                <button onClick={handleUpload} disabled={uploading} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Image</span>
                    </>
                  )}
                </button>
                <button onClick={() => { setPreview(null); setSelectedFile(null); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-4">Click the camera icon to upload a new profile picture</p>
          </div>

          {/* User Info */}
          <div className="border-t pt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                {user?.username}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                {user?.email}
              </div>
            </div>
          </div>

          <button onClick={() => router.push('/dashboard')} className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}