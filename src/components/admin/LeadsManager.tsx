import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  Tag, 
  Filter,
  Download,
  Search,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { 
  Lead, 
  LeadStatus, 
  LeadSource, 
  getAllLeads, 
  updateLeadStatus,
  getLeadSourceLabel 
} from '../../lib/leads';

const LeadsManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      
      // Always show sample data for demo purposes
      const sampleLeads: Lead[] = [
        {
          id: 'lead-001',
          email: 'sarah.parent@gmail.com',
          name: 'Sarah Johnson',
          phone: '+1 (555) 123-4567',
          child_name: 'Emma Johnson',
          child_age: 14,
          source: LeadSource.ENROLLMENT_POPUP,
          status: LeadStatus.NEW,
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_campaign: 'summer-2024',
          notes: 'Interested in summer program for daughter',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          next_follow_up: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'lead-002',
          email: 'mike.wilson@yahoo.com',
          name: 'Mike Wilson',
          phone: '+1 (555) 987-6543',
          child_name: 'Alex Wilson',
          child_age: 16,
          source: LeadSource.CAREER_GUIDE,
          status: LeadStatus.CONTACTED,
          utm_source: 'facebook',
          utm_medium: 'social',
          utm_campaign: 'career-guide-download',
          notes: 'Downloaded career guide, showed strong interest',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          last_contacted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          next_follow_up: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'lead-003',
          email: 'jennifer.clark@outlook.com',
          name: 'Jennifer Clark',
          phone: '+1 (555) 456-7890',
          child_name: 'Ryan Clark',
          child_age: 15,
          source: LeadSource.NEWSLETTER,
          status: LeadStatus.QUALIFIED,
          utm_source: 'organic',
          utm_medium: 'search',
          notes: 'Very engaged with newsletter content, ready to enroll',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          last_contacted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          next_follow_up: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'lead-004',
          email: 'david.smith@gmail.com',
          name: 'David Smith',
          phone: '+1 (555) 234-5678',
          child_name: 'Sophia Smith',
          child_age: 13,
          source: LeadSource.REFERRAL,
          status: LeadStatus.INTERESTED,
          utm_source: 'referral',
          utm_medium: 'word-of-mouth',
          notes: 'Referred by existing student parent - Jennifer Clark',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          last_contacted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          next_follow_up: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'lead-005',
          email: 'lisa.garcia@hotmail.com',
          name: 'Lisa Garcia',
          phone: '+1 (555) 345-6789',
          child_name: 'Miguel Garcia',
          child_age: 17,
          source: LeadSource.PAID_ADS,
          status: LeadStatus.ENROLLED,
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_campaign: 'teen-entrepreneur',
          notes: 'Successfully enrolled in premium program',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          last_contacted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'lead-006',
          email: 'mark.brown@gmail.com',
          name: 'Mark Brown',
          phone: '+1 (555) 567-8901',
          child_name: 'Olivia Brown',
          child_age: 14,
          source: LeadSource.SOCIAL_MEDIA,
          status: LeadStatus.NOT_INTERESTED,
          utm_source: 'instagram',
          utm_medium: 'social',
          utm_campaign: 'young-ceo-stories',
          notes: 'Not interested at this time, child too busy with school',
          created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          last_contacted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'lead-007',
          email: 'amanda.taylor@icloud.com',
          name: 'Amanda Taylor',
          phone: '+1 (555) 678-9012',
          child_name: 'Ethan Taylor',
          child_age: 16,
          source: LeadSource.WEBSITE,
          status: LeadStatus.NEW,
          utm_source: 'direct',
          notes: 'Just submitted contact form, awaiting initial contact',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          next_follow_up: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'lead-008',
          email: 'robert.jones@yahoo.com',
          name: 'Robert Jones',
          phone: '+1 (555) 789-0123',
          child_name: 'Ava Jones',
          child_age: 15,
          source: LeadSource.ORGANIC_SEARCH,
          status: LeadStatus.CONTACTED,
          utm_source: 'google',
          utm_medium: 'organic',
          notes: 'Found us through Google search, very interested',
          created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          last_contacted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          next_follow_up: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'lead-009',
          email: 'karen.white@gmail.com',
          name: 'Karen White',
          phone: '+1 (555) 890-1234',
          child_name: 'Noah White',
          child_age: 13,
          source: LeadSource.CONTACT_FORM,
          status: LeadStatus.QUALIFIED,
          utm_source: 'newsletter',
          utm_medium: 'email',
          notes: 'High-quality lead, ready to start immediately',
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          last_contacted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          next_follow_up: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'lead-010',
          email: 'paul.miller@outlook.com',
          name: 'Paul Miller',
          phone: '+1 (555) 901-2345',
          child_name: 'Isabella Miller',
          child_age: 17,
          source: LeadSource.ENROLLMENT_POPUP,
          status: LeadStatus.INTERESTED,
          utm_source: 'bing',
          utm_medium: 'cpc',
          utm_campaign: 'teen-business',
          notes: 'Daughter is very motivated to start her own business',
          created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          last_contacted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          next_follow_up: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setLeads(sampleLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      await loadLeads(); // Refresh the list
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSource = filterSource === 'all' || lead.source === filterSource;
    const matchesSearch = searchTerm === '' || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.child_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSource && matchesSearch;
  });

  const getStatusColor = (status: LeadStatus) => {
    const colors = {
      [LeadStatus.NEW]: 'bg-blue-100 text-blue-800',
      [LeadStatus.CONTACTED]: 'bg-yellow-100 text-yellow-800',
      [LeadStatus.QUALIFIED]: 'bg-purple-100 text-purple-800',
      [LeadStatus.INTERESTED]: 'bg-orange-100 text-orange-800',
      [LeadStatus.ENROLLED]: 'bg-green-100 text-green-800',
      [LeadStatus.NOT_INTERESTED]: 'bg-gray-100 text-gray-800',
      [LeadStatus.LOST]: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const exportLeads = () => {
    const csvContent = [
      ['Email', 'Name', 'Child Name', 'Child Age', 'Phone', 'Source', 'Status', 'Created At'],
      ...filteredLeads.map(lead => [
        lead.email,
        lead.name || '',
        lead.child_name || '',
        lead.child_age || '',
        lead.phone || '',
        getLeadSourceLabel(lead.source as LeadSource),
        lead.status,
        new Date(lead.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600">Manage and track all your leads</p>
        </div>
        <button
          onClick={exportLeads}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              {Object.values(LeadStatus).map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Sources</option>
              {Object.values(LeadSource).map(source => (
                <option key={source} value={source}>
                  {getLeadSourceLabel(source)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterSource('all');
                setSearchTerm('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Tag className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">New Leads</h3>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.status === LeadStatus.NEW).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Enrolled</h3>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.status === LeadStatus.ENROLLED).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Filter className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
              <p className="text-2xl font-bold text-gray-900">
                {leads.length > 0 ? Math.round((leads.filter(l => l.status === LeadStatus.ENROLLED).length / leads.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Child Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {lead.name || 'No name'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {lead.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {lead.child_name || 'No child name'}
                    </div>
                    {lead.child_age && (
                      <div className="text-sm text-gray-500">
                        Age: {lead.child_age}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getLeadSourceLabel(lead.source as LeadSource)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusUpdate(lead.id, e.target.value as LeadStatus)}
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status as LeadStatus)}`}
                    >
                      {Object.values(LeadStatus).map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No leads match your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadsManager;
