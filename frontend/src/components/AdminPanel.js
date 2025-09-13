import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Moon,
  Sun,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Archive,
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import KanbanBoardNew from './KanbanBoardNew';
import AnalyticsDashboard from './AnalyticsDashboard';
import CommunicationCenter from './CommunicationCenter';
import AIAnalytics from './AIAnalytics';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://geo-site-runner.preview.emergentagent.com';

const AdminPanel = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('admin-dark-mode');
    return saved ? JSON.parse(saved) : true;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [serviceRequests, setServiceRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('admin-dark-mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [requestsRes, messagesRes, testimonialsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/service-requests/`),
        axios.get(`${BACKEND_URL}/api/contact/`),
        axios.get(`${BACKEND_URL}/api/testimonials/`)
      ]);

      setServiceRequests(requestsRes.data);
      setContactMessages(messagesRes.data);
      setTestimonials(testimonialsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateServiceRequest = async (id, updates) => {
    try {
      await axios.put(`${BACKEND_URL}/api/service-requests/${id}`, updates);
      await fetchAllData();
    } catch (error) {
      console.error('Error updating service request:', error);
    }
  };

  const updateContactMessage = async (id, updates) => {
    try {
      await axios.put(`${BACKEND_URL}/api/contact/${id}`, updates);
      await fetchAllData();
    } catch (error) {
      console.error('Error updating contact message:', error);
    }
  };

  const DashboardOverview = () => {
    const stats = {
      totalRequests: serviceRequests.length,
      pendingRequests: serviceRequests.filter(r => r.status === 'pending').length,
      completedRequests: serviceRequests.filter(r => r.status === 'completed').length,
      totalMessages: contactMessages.length,
      unreadMessages: contactMessages.filter(m => m.status === 'new').length,
      totalRevenue: serviceRequests.reduce((sum, r) => sum + (r.price || 0), 0)
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                სერვისის მოთხოვნები
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalRequests}
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {stats.pendingRequests} მომლოდინე
              </p>
            </CardContent>
          </Card>

          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                შეტყობინებები
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalMessages}
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {stats.unreadMessages} ახალი
              </p>
            </CardContent>
          </Card>

          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                შემოსავალი
              </CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalRevenue.toLocaleString()}₾
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                მთლიანი შემოსავალი
              </p>
            </CardContent>
          </Card>

          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                დასრულებული
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stats.completedRequests}
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                დასრულებული საქმეები
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : 'text-gray-800'}>
                ბოლო სერვისის მოთხოვნები
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {request.name}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {request.case_id} - {request.device_type}
                      </p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(request.status)}>
                      {getStatusText(request.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : 'text-gray-800'}>
                ბოლო შეტყობინებები
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactMessages.slice(0, 5).map((message) => (
                  <div key={message.id} className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {message.name}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {message.subject}
                      </p>
                    </div>
                    <Badge variant="outline" className={getMessageStatusColor(message.status)}>
                      {getMessageStatusText(message.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'border-orange-500 text-orange-500';
      case 'in_progress': return 'border-blue-500 text-blue-500';
      case 'completed': return 'border-green-500 text-green-500';
      case 'picked_up': return 'border-purple-500 text-purple-500';
      case 'archived': return 'border-gray-500 text-gray-500';
      default: return 'border-gray-500 text-gray-500';
    }
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: 'მომლოდინე',
      in_progress: 'მუშავდება',
      completed: 'დასრულებული',
      picked_up: 'გატანილი',
      archived: 'არქივი'
    };
    return statusTexts[status] || 'უცნობი';
  };

  const getMessageStatusColor = (status) => {
    switch (status) {
      case 'new': return 'border-red-500 text-red-500';
      case 'read': return 'border-blue-500 text-blue-500';
      case 'replied': return 'border-green-500 text-green-500';
      default: return 'border-gray-500 text-gray-500';
    }
  };

  const getMessageStatusText = (status) => {
    const statusTexts = {
      new: 'ახალი',
      read: 'წაკითხული',
      replied: 'პასუხგაცემული'
    };
    return statusTexts[status] || 'უცნობი';
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={darkMode ? 'text-white' : 'text-gray-900'}>იტვირთება...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🛠️ ადმინისტრაციის პანელი
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              DataLab Georgia - მართვის სისტემა
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className={`${
                darkMode 
                  ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                  : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className={`${
                darkMode 
                  ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
                  : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
              }`}
            >
              მთავარ გვერდზე დაბრუნება
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full grid-cols-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <TabsTrigger 
              value="dashboard" 
              className={`${darkMode ? 'text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700' : 'text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:bg-white'}`}
            >
              📊 დაშბორდი
            </TabsTrigger>
            <TabsTrigger 
              value="kanban"
              className={`${darkMode ? 'text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700' : 'text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:bg-white'}`}
            >
              📋 კანბანი
            </TabsTrigger>
            <TabsTrigger 
              value="messages"
              className={`${darkMode ? 'text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700' : 'text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:bg-white'}`}
            >
              💬 შეტყობინებები
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className={`${darkMode ? 'text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700' : 'text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:bg-white'}`}
            >
              📈 ანალიტიკა
            </TabsTrigger>
            <TabsTrigger 
              value="communication"
              className={`${darkMode ? 'text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700' : 'text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:bg-white'}`}
            >
              📨 კომუნიკაცია
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="kanban">
            <KanbanBoardNew 
              serviceRequests={serviceRequests}
              updateServiceRequest={updateServiceRequest}
              darkMode={darkMode}
            />
          </TabsContent>

          <TabsContent value="messages">
            <ContactMessagesPanel />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard 
              serviceRequests={serviceRequests}
              contactMessages={contactMessages}
              testimonials={testimonials}
              darkMode={darkMode}
            />
          </TabsContent>

          <TabsContent value="communication">
            <CommunicationCenter 
              serviceRequests={serviceRequests}
              contactMessages={contactMessages}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  function ContactMessagesPanel() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredMessages = contactMessages.filter(message => {
      const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           message.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const handleStatusUpdate = async (messageId, newStatus) => {
      try {
        await updateContactMessage(messageId, { status: newStatus });
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📬 კონტაქტის შეტყობინებები
          </h2>
          <div className="flex gap-4">
            <Input
              placeholder="ძიება..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={`w-40 ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                <SelectValue placeholder="სტატუსი" />
              </SelectTrigger>
              <SelectContent className={darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white'}>
                <SelectItem value="all">ყველა</SelectItem>
                <SelectItem value="new">ახალი</SelectItem>
                <SelectItem value="read">წაკითხული</SelectItem>
                <SelectItem value="replied">პასუხგაცემული</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} hover:shadow-md transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {message.name}
                      </h3>
                      <Badge variant="outline" className={getMessageStatusColor(message.status)}>
                        {getMessageStatusText(message.status)}
                      </Badge>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      {message.email} • {message.phone}
                    </p>
                    <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      {message.subject}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                      {message.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(message.created_at).toLocaleDateString('ka-GE')}
                  </span>
                  <div className="flex gap-2">
                    {message.status === 'new' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(message.id, 'read')}
                        className={`${darkMode ? 'border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white' : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'}`}
                      >
                        წაკითხვა
                      </Button>
                    )}
                    {(message.status === 'new' || message.status === 'read') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(message.id, 'replied')}
                        className={`${darkMode ? 'border-green-500 text-green-400 hover:bg-green-500 hover:text-white' : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'}`}
                      >
                        პასუხი
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
};

export default AdminPanel;