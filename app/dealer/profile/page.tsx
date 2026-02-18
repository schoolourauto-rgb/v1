
"use client";
import Image from "next/image";
import { useState, useRef } from "react";

const initialProfile = {
  name: "",
  bio: "",
  location: "",
  website: "",
  cover: "",
  avatar: "",
  stats: { listings: 0, leads: 0, earnings: 0 },
};

export default function DealerProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [coverPreview, setCoverPreview] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Handle cover upload
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      // TODO: Upload to Supabase and setProfile({ ...profile, cover: url })
    }
  };
  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      // TODO: Upload to Supabase and setProfile({ ...profile, avatar: url })
    }
  };

  // Handle edit profile
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Save profile to Supabase
    setTimeout(() => {
      setLoading(false);
      setEditOpen(false);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      {/* Cover Image */}
      <div className="relative h-56 rounded-t-2xl overflow-hidden bg-zinc-800 flex items-center justify-center">
        {coverPreview || profile.cover ? (
          <Image
            src={coverPreview || profile.cover}
            alt="cover"
            width={800}
            height={200}
            className="object-cover w-full h-full"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">Upload cover image</div>
        )}
        <button
          className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-xl text-xs hover:bg-black/90 transition"
          onClick={() => coverInputRef.current?.click()}
        >
          Change Cover
        </button>
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>
      {/* Avatar */}
      <div className="relative flex justify-center -mt-16">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-zinc-200 overflow-hidden shadow-lg flex items-center justify-center">
            {avatarPreview || profile.avatar ? (
              <Image
                src={avatarPreview || profile.avatar}
                alt="avatar"
                width={128}
                height={128}
                className="object-cover w-full h-full"
                sizes="128px"
              />
            ) : (
              <span className="text-zinc-400">Upload avatar</span>
            )}
          </div>
          <button
            className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs hover:bg-black/90 transition"
            onClick={() => avatarInputRef.current?.click()}
          >
            Change
          </button>
          <input
            type="file"
            accept="image/*"
            ref={avatarInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />
      </div>
        </div> {/* Closing div for Avatar section */}
      {/* Dealer Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-b-2xl p-4 sm:p-6 pt-20 -mt-12 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">{profile.name || "Business Name"}</h2>
        <div className="text-zinc-400 mb-2">{profile.bio || "Your bio goes here."}</div>
        <div className="flex justify-center gap-4 mb-2">
          <span className="text-zinc-400">{profile.location || "Location"}</span>
          {profile.website && (
            <a href={profile.website} className="text-yellow-500 hover:underline" target="_blank" rel="noopener noreferrer">Website</a>
          )}
        </div>
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl px-6 py-2 font-semibold mt-2 transition-all duration-200"
          onClick={() => setEditOpen(true)}
        >
          Edit Profile
        </button>

        {/* Stats Row */}
        <div className="flex justify-center gap-8 mt-8">
          <div className="text-center">
            <div className="text-xl font-bold text-zinc-100">{profile.stats.listings}</div>
            <div className="text-zinc-400 text-xs">Listings</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-zinc-100">{profile.stats.leads}</div>
            <div className="text-zinc-400 text-xs">Active Leads</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">₹{profile.stats.earnings}</div>
            <div className="text-zinc-400 text-xs">Referral Earnings</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-lg space-y-4"
            onSubmit={handleEdit}
          >
            <h3 className="text-xl font-bold mb-2 text-zinc-100">Edit Profile</h3>
            <input
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none"
              placeholder="Business Name"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              required
            />
            <textarea
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none min-h-[80px]"
              placeholder="Bio"
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              required
            />
            <input
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none"
              placeholder="Location"
              value={profile.location}
              onChange={e => setProfile({ ...profile, location: e.target.value })}
              required
            />
            <input
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:ring-2 focus:ring-yellow-500 outline-none"
              placeholder="Website (optional)"
              value={profile.website}
              onChange={e => setProfile({ ...profile, website: e.target.value })}
            />
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                className="flex-1 bg-zinc-700 text-zinc-200 rounded-xl py-2 hover:bg-zinc-600 transition"
                onClick={() => setEditOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl py-2 font-semibold transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}