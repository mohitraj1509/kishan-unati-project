'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Scheme {
  _id: string;
  title: string;
  description: string;
  category: string;
  eligibility: string;
  benefits: string;
  status: string;
  applicants: number;
}

export default function SchemesManagement() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    eligibility: '',
    benefits: '',
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/');
      return;
    }

    fetchSchemes(token);
  }, [router]);

  const fetchSchemes = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/schemes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSchemes(data.schemes || []);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch('http://localhost:3001/api/admin/schemes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddForm(false);
        setFormData({ title: '', description: '', category: '', eligibility: '', benefits: '' });
        fetchSchemes(token!);
      }
    } catch (error) {
      console.error('Error adding scheme:', error);
    }
  };

  const handleStatusChange = async (schemeId: string, newStatus: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`http://localhost:3001/api/admin/schemes/${schemeId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchSchemes(token!);
    } catch (error) {
      console.error('Error updating scheme:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-green-600 hover:text-green-700">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Schemes Management</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add New Scheme
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {/* Add Scheme Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Add New Scheme</h2>
              <form onSubmit={handleAddScheme} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Eligibility</label>
                  <textarea
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Benefits</label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    rows={2}
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Add Scheme
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schemes List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-8">Loading schemes...</div>
          ) : schemes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No schemes found</div>
          ) : (
            schemes.map((scheme) => (
              <div key={scheme._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{scheme.title}</h3>
                    <p className="text-gray-600 mb-3">{scheme.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Category:</span> {scheme.category}
                      </div>
                      <div>
                        <span className="font-medium">Applicants:</span> {scheme.applicants || 0}
                      </div>
                      <div>
                        <span className="font-medium">Eligibility:</span> {scheme.eligibility}
                      </div>
                      <div>
                        <span className="font-medium">Benefits:</span> {scheme.benefits}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <select
                      value={scheme.status}
                      onChange={(e) => handleStatusChange(scheme._id, e.target.value)}
                      className={`border rounded px-3 py-1 text-sm ${
                        scheme.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
