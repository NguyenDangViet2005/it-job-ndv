"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, Briefcase } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const StatsChart = () => {
  const applicationData = [
    { name: "Mon", applications: 45, interviews: 12 },
    { name: "Tue", applications: 52, interviews: 15 },
    { name: "Wed", applications: 38, interviews: 10 },
    { name: "Thu", applications: 65, interviews: 18 },
    { name: "Fri", applications: 72, interviews: 22 },
    { name: "Sat", applications: 28, interviews: 8 },
    { name: "Sun", applications: 15, interviews: 4 },
  ];

  const jobPostingData = [
    { month: "Jan", jobs: 12, filled: 8 },
    { month: "Feb", jobs: 19, filled: 14 },
    { month: "Mar", jobs: 15, filled: 11 },
    { month: "Apr", jobs: 25, filled: 18 },
    { month: "May", jobs: 22, filled: 16 },
    { month: "Jun", jobs: 30, filled: 22 },
  ];

  const userGrowthData = [
    { week: "Week 1", users: 120, active: 95 },
    { week: "Week 2", users: 145, active: 118 },
    { week: "Week 3", users: 132, active: 105 },
    { week: "Week 4", users: 168, active: 142 },
  ];

  const departmentData = [
    { name: "Engineering", value: 45, color: "#3b82f6" },
    { name: "Design", value: 25, color: "#8b5cf6" },
    { name: "Marketing", value: 15, color: "#ec4899" },
    { name: "Sales", value: 10, color: "#10b981" },
    { name: "Others", value: 5, color: "#f59e0b" },
  ];

  return (
    <Card className="cursor-target">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Statistics Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications" className="gap-2 cursor-target">
              <TrendingUp className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2 cursor-target">
              <Briefcase className="h-4 w-4" />
              Job Postings
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 cursor-target">
              <Users className="h-4 w-4" />
              User Growth
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-2 cursor-target">
              <BarChart3 className="h-4 w-4" />
              Departments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Weekly Applications & Interviews</h3>
                  <p className="text-sm text-muted-foreground">Last 7 days performance</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-500">315</p>
                  <p className="text-xs text-muted-foreground">Total this week</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={applicationData}>
                  <defs>
                    <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorApplications)"
                    name="Applications"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interviews" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorInterviews)"
                    name="Interviews"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Monthly Job Postings</h3>
                  <p className="text-sm text-muted-foreground">Last 6 months</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-500">123</p>
                  <p className="text-xs text-muted-foreground">Total jobs posted</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobPostingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="jobs" fill="#8b5cf6" name="Total Jobs" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="filled" fill="#10b981" name="Filled Positions" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">User Growth Trend</h3>
                  <p className="text-sm text-muted-foreground">Last 4 weeks</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-500">565</p>
                  <p className="text-xs text-muted-foreground">New users this month</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Total Users"
                    dot={{ fill: '#10b981', r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Active Users"
                    dot={{ fill: '#3b82f6', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Job Distribution by Department</h3>
                  <p className="text-sm text-muted-foreground">Current breakdown</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {departmentData.map((dept, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: dept.color }}
                    />
                    <div>
                      <p className="text-sm font-medium">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">{dept.value} jobs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatsChart;
