import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  User, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  BarChart2, 
  PieChart, 
  TrendingUp 
} from 'lucide-react';
import Chart from 'react-apexcharts';
import { supabase } from '../../lib/supabase';
import { format, subDays } from 'date-fns';

interface Payment {
  id: string;
  student_name: string;
  student_email: string;
  student_avatar: string;
  amount: number;
  course_type: 'Basic' | 'Premium';
  payment_method: 'credit_card' | 'bank_transfer' | 'upi' | 'paypal';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transaction_id: string;
  created_at: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    successRate: 0,
    averageOrderValue: 0,
    revenueByPlan: { Basic: 0, Premium: 0 },
    revenueByMonth: [] as { month: string; revenue: number }[],
    paymentMethodDistribution: {} as Record<string, number>
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...payments];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(payment => payment.status === statusFilter);
    }
    
    // Apply course filter
    if (courseFilter !== 'all') {
      result = result.filter(payment => payment.course_type === courseFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let cutoffDate: Date;
      
      switch (dateFilter) {
        case 'today':
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          cutoffDate = subDays(now, 7);
          break;
        case 'month':
          cutoffDate = subDays(now, 30);
          break;
        case 'year':
          cutoffDate = subDays(now, 365);
          break;
        default:
          cutoffDate = new Date(0); // Beginning of time
      }
      
      result = result.filter(payment => new Date(payment.created_at) >= cutoffDate);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(payment => 
        payment.student_name.toLowerCase().includes(query) || 
        payment.student_email.toLowerCase().includes(query) ||
        payment.transaction_id.toLowerCase().includes(query)
      );
    }
    
    setFilteredPayments(result);
    
    // Calculate analytics
    if (result.length > 0) {
      const totalRevenue = result.reduce((sum, payment) => 
        payment.status === 'completed' ? sum + payment.amount : sum, 0);
      
      const successfulPayments = result.filter(payment => payment.status === 'completed');
      const successRate = (successfulPayments.length / result.length) * 100;
      
      const averageOrderValue = successfulPayments.length > 0 
        ? totalRevenue / successfulPayments.length 
        : 0;
      
      // Revenue by plan
      const revenueByPlan = {
        Basic: successfulPayments
          .filter(payment => payment.course_type === 'Basic')
          .reduce((sum, payment) => sum + payment.amount, 0),
        Premium: successfulPayments
          .filter(payment => payment.course_type === 'Premium')
          .reduce((sum, payment) => sum + payment.amount, 0)
      };
      
      // Revenue by month (last 6 months)
      const revenueByMonth = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = format(month, 'MMM');
        
        const monthRevenue = successfulPayments
          .filter(payment => {
            const paymentDate = new Date(payment.created_at);
            return paymentDate.getMonth() === month.getMonth() && 
                   paymentDate.getFullYear() === month.getFullYear();
          })
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        revenueByMonth.push({ month: monthName, revenue: monthRevenue });
      }
      
      // Payment method distribution
      const paymentMethodDistribution: Record<string, number> = {};
      successfulPayments.forEach(payment => {
        const method = payment.payment_method;
        paymentMethodDistribution[method] = (paymentMethodDistribution[method] || 0) + 1;
      });
      
      // Monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = successfulPayments
        .filter(payment => {
          const paymentDate = new Date(payment.created_at);
          return paymentDate.getMonth() === currentMonth && 
                 paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      setAnalyticsData({
        totalRevenue,
        monthlyRevenue,
        successRate,
        averageOrderValue,
        revenueByPlan,
        revenueByMonth,
        paymentMethodDistribution
      });
    }
  }, [payments, statusFilter, courseFilter, dateFilter, searchQuery]);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock payments
      const mockPayments: Payment[] = Array.from({ length: 50 }, (_, i) => {
        const courseType = i % 3 === 0 ? 'Premium' : 'Basic';
        const amount = courseType === 'Premium' ? 80000 : 40000;
        const status = i % 10 === 0 ? 'failed' : 
                      i % 15 === 0 ? 'pending' : 
                      i % 20 === 0 ? 'refunded' : 'completed';
        
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 180)); // Last 6 months
        
        const paymentMethods = ['credit_card', 'bank_transfer', 'upi', 'paypal'];
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)] as Payment['payment_method'];
        
        return {
          id: `payment-${i + 1}`,
          student_name: [
            'Arjun Patel',
            'Priya Sharma',
            'Rahul Singh',
            'Ananya Gupta',
            'Vikram Mehta',
            'Neha Kapoor',
            'Sanjay Kumar',
            'Meera Reddy',
            'Aditya Shah',
            'Kavita Verma'
          ][i % 10],
          student_email: `student${i + 1}@example.com`,
          student_avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 10}?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80`,
          amount,
          course_type: courseType as 'Basic' | 'Premium',
          payment_method,
          status: status as Payment['status'],
          transaction_id: `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          created_at: createdDate.toISOString()
        };
      });
      
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to load payments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (paymentId: string, status: Payment['status']) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would update in Supabase
      // For now, we'll just update the local state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPayments(payments.map(payment => 
        payment.id === paymentId ? { ...payment, status } : payment
      ));
      
      setSuccess(`Payment status updated to ${status}!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Failed to update payment status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Failed
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Refunded
          </span>
        );
    }
  };

  const getPaymentMethodIcon = (method: Payment['payment_method']) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'bank_transfer':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'upi':
        return <DollarSign className="h-4 w-4 text-purple-500" />;
      case 'paypal':
        return <DollarSign className="h-4 w-4 text-indigo-500" />;
    }
  };

  // Chart options for revenue by month
  const revenueChartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#4F46E5'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: analyticsData.revenueByMonth.map(item => item.month)
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `₹${(value / 1000).toFixed(0)}K`
      }
    }
  };

  const revenueChartSeries = [
    {
      name: 'Revenue',
      data: analyticsData.revenueByMonth.map(item => item.revenue)
    }
  ];

  // Chart options for payment method distribution
  const paymentMethodChartOptions = {
    chart: {
      type: 'pie',
      toolbar: { show: false }
    },
    labels: Object.keys(analyticsData.paymentMethodDistribution).map(method => 
      method === 'credit_card' ? 'Credit Card' :
      method === 'bank_transfer' ? 'Bank Transfer' :
      method === 'upi' ? 'UPI' : 'PayPal'
    ),
    colors: ['#4F46E5', '#10B981', '#8B5CF6', '#F59E0B'],
    legend: {
      position: 'bottom'
    }
  };

  const paymentMethodChartSeries = Object.values(analyticsData.paymentMethodDistribution);

  // Chart options for revenue by plan
  const planChartOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false }
    },
    labels: ['Basic', 'Premium'],
    colors: ['#4F46E5', '#8B5CF6'],
    legend: {
      position: 'bottom'
    }
  };

  const planChartSeries = [
    analyticsData.revenueByPlan.Basic,
    analyticsData.revenueByPlan.Premium
  ];

  if (isLoading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all payments</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BarChart2 className="h-5 w-5" />
            <span>{showAnalytics ? 'Hide Analytics' : 'Show Analytics'}</span>
          </button>
          <button
            onClick={fetchPayments}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Payment Analytics */}
      {showAnalytics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Total Revenue</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                ₹{(analyticsData.totalRevenue / 100000).toFixed(2)}L
              </p>
              <p className="mt-1 text-sm flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                12.5% from last month
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Monthly Revenue</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                ₹{(analyticsData.monthlyRevenue / 100000).toFixed(2)}L
              </p>
              <p className="mt-1 text-sm flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                8.3% from last month
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Success Rate</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                {analyticsData.successRate.toFixed(1)}%
              </p>
              <p className="mt-1 text-sm flex items-center text-red-600">
                <ArrowDown className="h-4 w-4 mr-1" />
                2.1% from last month
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Avg. Order Value</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                ₹{(analyticsData.averageOrderValue / 1000).toFixed(1)}K
              </p>
              <p className="mt-1 text-sm flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                5.4% from last month
              </p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <Chart
                options={revenueChartOptions}
                series={revenueChartSeries}
                type="area"
                height={300}
              />
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <Chart
                options={paymentMethodChartOptions}
                series={paymentMethodChartSeries}
                type="pie"
                height={300}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Chart
                  options={planChartOptions}
                  series={planChartSeries}
                  type="donut"
                  height={250}
                />
              </div>
              <div className="md:col-span-2">
                <div className="h-full flex flex-col justify-center">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-4 w-4 bg-indigo-600 rounded-full mr-2"></div>
                          <span className="text-gray-700">Basic Plan</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          ₹{(analyticsData.revenueByPlan.Basic / 100000).toFixed(2)}L
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(analyticsData.revenueByPlan.Basic / 
                              (analyticsData.revenueByPlan.Basic + analyticsData.revenueByPlan.Premium)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-4 w-4 bg-purple-600 rounded-full mr-2"></div>
                          <span className="text-gray-700">Premium Plan</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          ₹{(analyticsData.revenueByPlan.Premium / 100000).toFixed(2)}L
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(analyticsData.revenueByPlan.Premium / 
                              (analyticsData.revenueByPlan.Basic + analyticsData.revenueByPlan.Premium)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="all">All Courses</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={payment.student_avatar} alt={payment.student_name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{payment.student_name}</div>
                        <div className="text-sm text-gray-500">{payment.student_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      TXN: {payment.transaction_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.course_type === 'Premium' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {payment.course_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(payment.payment_method)}
                      <span className="ml-1.5 text-sm text-gray-700 capitalize">
                        {payment.payment_method.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(payment.created_at), 'MMM d, yyyy')}
                    <div className="text-xs text-gray-400">
                      {format(new Date(payment.created_at), 'h:mm a')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      {payment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdatePaymentStatus(payment.id, 'completed')}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUpdatePaymentStatus(payment.id, 'failed')}
                            className="text-red-600 hover:text-red-900"
                            title="Mark as Failed"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {payment.status === 'completed' && (
                        <button
                          onClick={() => handleUpdatePaymentStatus(payment.id, 'refunded')}
                          className="text-gray-600 hover:text-gray-900"
                          title="Refund Payment"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      )}
                      <a 
                        href="#" 
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No payments found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}