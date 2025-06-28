import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PlusCircle, 
  Trash2, 
  Save,
  Download,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Chart from 'react-apexcharts';
import { useSimulatorStore } from '../../lib/store';
import type { FinancialItem } from '../../lib/types/simulators';
import { REVENUE_CATEGORIES, EXPENSE_CATEGORIES } from '../../lib/types/simulators';

interface FinancialItemFormProps {
  item: FinancialItem;
  onChange: (item: FinancialItem) => void;
  onDelete: () => void;
  categories: readonly string[];
}

function FinancialItemForm({ item, onChange, onDelete, categories }: FinancialItemFormProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={item.name}
            onChange={(e) => onChange({ ...item, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            value={item.amount}
            onChange={(e) => onChange({ ...item, amount: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
          <select
            value={item.frequency}
            onChange={(e) => onChange({ ...item, frequency: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="one-time">One-time</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={item.category}
            onChange={(e) => onChange({ ...item, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onDelete}
            className="px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FinancialProjections() {
  const { financial, updateFinancials } = useSimulatorStore();
  const [showProjections, setShowProjections] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  const addRevenue = () => {
    const newRevenue: FinancialItem = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      frequency: 'monthly',
      category: REVENUE_CATEGORIES[0],
      startDate: new Date().toISOString()
    };
    updateFinancials({
      revenues: [...financial.revenues, newRevenue]
    });
  };

  const addExpense = () => {
    const newExpense: FinancialItem = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      frequency: 'monthly',
      category: EXPENSE_CATEGORIES[0],
      startDate: new Date().toISOString()
    };
    updateFinancials({
      expenses: [...financial.expenses, newExpense]
    });
  };

  const calculateProjections = () => {
    setIsCalculating(true);
    setTimeout(() => {
      // Calculate total revenue
      const annualRevenue = financial.revenues.reduce((total, rev) => {
        const multiplier = 
          rev.frequency === 'monthly' ? 12 :
          rev.frequency === 'quarterly' ? 4 :
          rev.frequency === 'yearly' ? 1 : 1;
        return total + (rev.amount * multiplier);
      }, 0);

      // Calculate total expenses
      const annualExpenses = financial.expenses.reduce((total, exp) => {
        const multiplier = 
          exp.frequency === 'monthly' ? 12 :
          exp.frequency === 'quarterly' ? 4 :
          exp.frequency === 'yearly' ? 1 : 1;
        return total + (exp.amount * multiplier);
      }, 0);

      // Update metrics
      updateFinancials({
        metrics: {
          revenueGrowth: 10,
          profitMargin: ((annualRevenue - annualExpenses) / annualRevenue) * 100,
          breakEvenPoint: annualExpenses,
          cashFlow: annualRevenue - annualExpenses
        }
      });

      setIsCalculating(false);
      setShowProjections(true);
    }, 1500);
  };

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#4F46E5', '#E11D48'],
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `₹${value.toLocaleString()}`
      }
    }
  };

  const series = [
    {
      name: 'Revenue',
      data: Array(12).fill(0).map((_, i) => {
        const monthlyRevenue = financial.revenues
          .filter(rev => rev.frequency === 'monthly')
          .reduce((sum, rev) => sum + rev.amount, 0);
        
        const quarterlyRevenue = financial.revenues
          .filter(rev => rev.frequency === 'quarterly')
          .reduce((sum, rev) => sum + rev.amount / 3, 0);
        
        const yearlyRevenue = financial.revenues
          .filter(rev => rev.frequency === 'yearly')
          .reduce((sum, rev) => sum + rev.amount / 12, 0);
        
        return Math.round(monthlyRevenue + quarterlyRevenue + yearlyRevenue);
      })
    },
    {
      name: 'Expenses',
      data: Array(12).fill(0).map((_, i) => {
        const monthlyExpenses = financial.expenses
          .filter(exp => exp.frequency === 'monthly')
          .reduce((sum, exp) => sum + exp.amount, 0);
        
        const quarterlyExpenses = financial.expenses
          .filter(exp => exp.frequency === 'quarterly')
          .reduce((sum, exp) => sum + exp.amount / 3, 0);
        
        const yearlyExpenses = financial.expenses
          .filter(exp => exp.frequency === 'yearly')
          .reduce((sum, exp) => sum + exp.amount / 12, 0);
        
        return Math.round(monthlyExpenses + quarterlyExpenses + yearlyExpenses);
      })
    }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Streams</h3>
          <button
            onClick={addRevenue}
            className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Revenue</span>
          </button>
        </div>
        <div className="space-y-4">
          {financial.revenues.map((revenue) => (
            <FinancialItemForm
              key={revenue.id}
              item={revenue}
              onChange={(updated) => {
                const revenues = financial.revenues.map(rev =>
                  rev.id === updated.id ? updated : rev
                );
                updateFinancials({ revenues });
              }}
              onDelete={() => {
                const revenues = financial.revenues.filter(rev => rev.id !== revenue.id);
                updateFinancials({ revenues });
              }}
              categories={REVENUE_CATEGORIES}
            />
          ))}
          {financial.revenues.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No revenue streams added yet. Click "Add Revenue" to get started.
            </div>
          )}
        </div>
      </div>

      {/* Expenses Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Expenses</h3>
          <button
            onClick={addExpense}
            className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Expense</span>
          </button>
        </div>
        <div className="space-y-4">
          {financial.expenses.map((expense) => (
            <FinancialItemForm
              key={expense.id}
              item={expense}
              onChange={(updated) => {
                const expenses = financial.expenses.map(exp =>
                  exp.id === updated.id ? updated : exp
                );
                updateFinancials({ expenses });
              }}
              onDelete={() => {
                const expenses = financial.expenses.filter(exp => exp.id !== expense.id);
                updateFinancials({ expenses });
              }}
              categories={EXPENSE_CATEGORIES}
            />
          ))}
          {financial.expenses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No expenses added yet. Click "Add Expense" to get started.
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={calculateProjections}
          disabled={isCalculating}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isCalculating ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5" />
              <span>Calculate Projections</span>
            </>
          )}
        </button>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Projections */}
      {showProjections && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Revenue Growth</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                {financial.metrics.revenueGrowth}%
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Profit Margin</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                {financial.metrics.profitMargin.toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Break-even Point</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                ₹{financial.metrics.breakEvenPoint.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Cash Flow</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                ₹{financial.metrics.cashFlow.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">12-Month Projection</h3>
              <button
                onClick={() => setShowProjections(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            </div>
            <Chart
              options={chartOptions}
              series={series}
              type="area"
              height={350}
            />
          </div>
        </div>
      )}
    </div>
  );
}