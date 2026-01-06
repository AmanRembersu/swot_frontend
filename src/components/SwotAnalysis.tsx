import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiService, type SwotData, type User } from '@/lib/api';
import { LogOut, Save, Trash2, RefreshCw } from 'lucide-react';

interface SwotAnalysisProps {
  user: User;
  onLogout: () => void;
}

export const SwotAnalysis: React.FC<SwotAnalysisProps> = ({ user, onLogout }) => {
  const [swotData, setSwotData] = useState<SwotData>({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasExistingData, setHasExistingData] = useState(false);

  // Form state for text inputs
  const [formInputs, setFormInputs] = useState({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
  });

  useEffect(() => {
    loadSwotData();
  }, []);

  const loadSwotData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSwot();
      setSwotData(response.swot);
      setHasExistingData(true);
      
      // Convert arrays to text for form inputs
      setFormInputs({
        strengths: response.swot.strengths.join('\n'),
        weaknesses: response.swot.weaknesses.join('\n'),
        opportunities: response.swot.opportunities.join('\n'),
        threats: response.swot.threats.join('\n'),
      });
    } catch (err) {
      // If no SWOT data exists, that's okay
      if (err instanceof Error && err.message.includes('not found')) {
        setHasExistingData(false);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load SWOT data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formInputs, value: string) => {
    setFormInputs({
      ...formInputs,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Convert text inputs to arrays (split by newlines and filter empty)
      const swotPayload: Partial<SwotData> = {
        strengths: formInputs.strengths.split('\n').filter(item => item.trim() !== ''),
        weaknesses: formInputs.weaknesses.split('\n').filter(item => item.trim() !== ''),
        opportunities: formInputs.opportunities.split('\n').filter(item => item.trim() !== ''),
        threats: formInputs.threats.split('\n').filter(item => item.trim() !== ''),
      };

      const response = await apiService.createOrUpdateSwot(swotPayload);
      setSwotData(response.swot);
      setHasExistingData(true);
      setSuccess('SWOT analysis saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save SWOT analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your SWOT analysis? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await apiService.deleteSwot();
      
      // Reset form
      setSwotData({
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
      });
      setFormInputs({
        strengths: '',
        weaknesses: '',
        opportunities: '',
        threats: '',
      });
      setHasExistingData(false);
      setSuccess('SWOT analysis deleted successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete SWOT analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCertificate = () => {
 try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    // Your backend PayPal page endpoint
    const backendUrl = "https://swot-backend.onrender.com";

    // Redirect to backend with token as query parameter (secure enough for redirect)
    window.location.href = `${backendUrl}?token=${encodeURIComponent(token)}`;
  } catch (err) {
    console.error("Failed to redirect to backend page:", err);
    setError("Unable to open certificate page. Please try again.");
  }
};


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SWOT Analysis</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={loadSwotData} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {/* SWOT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Strengths</h3>
            <Textarea
              placeholder="Enter your strengths (one per line)&#10;Example:&#10;Strong leadership skills&#10;Good communication&#10;Technical expertise"
              value={formInputs.strengths}
              onChange={(e) => handleInputChange('strengths', e.target.value)}
              className="min-h-[150px] resize-none"
            />
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Weaknesses</h3>
            <Textarea
              placeholder="Enter your weaknesses (one per line)&#10;Example:&#10;Time management issues&#10;Public speaking anxiety&#10;Limited experience in certain areas"
              value={formInputs.weaknesses}
              onChange={(e) => handleInputChange('weaknesses', e.target.value)}
              className="min-h-[150px] resize-none"
            />
          </div>

          {/* Opportunities */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-4"> Opportunities</h3>
            <Textarea
              placeholder="Enter opportunities (one per line)&#10;Example:&#10;Growing market demand&#10;New technology trends&#10;Networking events&#10;Professional development programs"
              value={formInputs.opportunities}
              onChange={(e) => handleInputChange('opportunities', e.target.value)}
              className="min-h-[150px] resize-none"
            />
          </div>

          {/* Threats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-orange-700 mb-4">Threats</h3>
            <Textarea
              placeholder="Enter threats (one per line)&#10;Example:&#10;Increased competition&#10;Economic uncertainty&#10;Rapid technological changes&#10;Market saturation"
              value={formInputs.threats}
              onChange={(e) => handleInputChange('threats', e.target.value)}
              className="min-h-[150px] resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={handleSave} disabled={loading} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save SWOT Analysis'}
          </Button>
          
          {hasExistingData && (
            <Button onClick={handleDelete} variant="destructive" disabled={loading} size="lg">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Analysis
            </Button>
          )}
            <Button onClick={handleBuyCertificate} disabled={loading} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'loading...' : 'Buy certificate'}
          </Button>
          
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Enter each point on a new line. Your SWOT analysis will be automatically saved to your account.
            {hasExistingData && (
              <span className="block mt-1">
                Last updated: {swotData.updatedAt ? new Date(swotData.updatedAt).toLocaleString() : 'Unknown'}
              </span>
            )}
          </p>
        </div>
      </main>
    </div>
  );
};