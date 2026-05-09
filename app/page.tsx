"use client";

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

// Define the type for a college
interface College {
  id: number;
  name: string;
  location: string;
  fees: number;
}


export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search

  useEffect(() => {
    // Update your fetch function to filter
    async function fetchColleges() {
      let query = supabase.from('colleges').select('*');

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`); // This filters by name
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setColleges(data as College[]);
      }
    }
    fetchColleges();
  }, [searchTerm]); // Re-run when searchTerm changes

  if (error) return <div className="p-10 text-red-500">Error: {error}</div>;

  return (
  <main className="min-h-screen bg-gray-100 p-4 md:p-8">
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">
          College Discovery Platform
        </h1>
        <p className="text-gray-600">Find the best engineering institutes in Maharashtra</p>
      </div>

      {/* Search Bar Section */}
      <div className="relative mb-10">
        <input 
          type="text" 
          placeholder="Search by college name (e.g. MIT, VIT)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-6 text-lg border-none rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Results Grid */}
      <div className="grid gap-6">
        {colleges.length > 0 ? (
          colleges.map((college) => (
            <div key={college.id} className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-blue-600 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{college.name}</h2>
                  <p className="text-gray-500 flex items-center mt-2">
                    <span className="mr-2">📍</span> {college.location}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  Engineering
                </span>
              </div>
              
              <div className="mt-6 flex justify-between items-center border-t pt-4">
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Annual Fees</p>
                  <p className="text-2xl font-bold text-blue-700">₹{college.fees.toLocaleString('en-IN')}</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No colleges found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  </main>
);
}