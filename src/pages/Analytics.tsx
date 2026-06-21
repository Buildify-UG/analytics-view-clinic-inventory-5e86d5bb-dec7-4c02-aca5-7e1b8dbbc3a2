import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, TrendingUp, Package, DollarSign, AlertCircle } from "lucide-react";

// Mock data - replace with real data from Supabase
const inventoryMetrics = {
  totalItems: 1247,
  lowStockItems: 23,
  outOfStock: 5,
  turnoverRate: 4.2,
};

const salesMetrics = {
  totalRevenue: 45230,
  totalTransactions: 342,
  avgTransactionValue: 132.25,
  topProduct: "Antiseptic Spray",
};

const inventoryTrendData = [
  { month: "Jan", inStock: 1100, sold: 240, restocked: 280 },
  { month: "Feb", inStock: 1150, sold: 260, restocked: 310 },
  { month: "Mar", inStock: 1200, sold: 280, restocked: 330 },
  { month: "Apr", inStock: 1180, sold: 270, restocked: 250 },
  { month: "May", inStock: 1220, sold: 290, restocked: 330 },
  { month: "Jun", inStock: 1247, sold: 310, restocked: 337 },
];

const categoryDistribution = [
  { name: "Medications", value: 420, percentage: 33.7 },
  { name: "Supplies", value: 380, percentage: 30.5 },
  { name: "Equipment", value: 250, percentage: 20.0 },
  { name: "Consumables", value: 197, percentage: 15.8 },
];

const categoryPerformance = [
  { category: "Medications", revenue: 18500, units: 145, growth: 12.5 },
  { category: "Supplies", revenue: 14200, units: 267, growth: 8.3 },
  { category: "Equipment", revenue: 8900, units: 28, growth: -2.1 },
  { category: "Consumables", revenue: 3630, units: 210, growth: 15.7 },
];

const lowStockItems = [
  { name: "Sterile Gloves L", quantity: 2, reorderPoint: 50, category: "Supplies" },
  { name: "Alcohol Wipes", quantity: 5, reorderPoint: 100, category: "Supplies" },
  { name: "Bandages (Large)", quantity: 8, reorderPoint: 75, category: "Supplies" },
  { name: "Ibuprofen 200mg", quantity: 3, reorderPoint: 100, category: "Medications" },
  { name: "Thermometer Tips", quantity: 12, reorderPoint: 50, category: "Equipment" },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const MetricCard = ({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  trendPositive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendPositive?: boolean;
}) => (
  <Card className="bg-gradient-to-br from-background to-muted border-border">
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {trend !== undefined && (
            <p
              className={`text-xs font-semibold ${
                trendPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trendPositive ? "+" : ""}{trend}% vs last month
            </p>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-3 text-primary">{Icon}</div>
      </div>
    </CardContent>
  </Card>
);

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("6m");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Clinic Analytics</h1>
          <p className="text-muted-foreground">
            Monitor inventory, sales, and performance metrics
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="medications">Medications</SelectItem>
                <SelectItem value="supplies">Supplies</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="consumables">Consumables</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<Package className="h-5 w-5" />}
            label="Total Items"
            value={inventoryMetrics.totalItems}
            unit="units"
            trend={3.2}
            trendPositive={true}
          />
          <MetricCard
            icon={<AlertCircle className="h-5 w-5" />}
            label="Low Stock Items"
            value={inventoryMetrics.lowStockItems}
            unit="items"
            trend={-12.5}
            trendPositive={true}
          />
          <MetricCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Turnover Rate"
            value={inventoryMetrics.turnoverRate}
            unit="x/month"
            trend={5.1}
            trendPositive={true}
          />
          <MetricCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Total Revenue"
            value={`$${(salesMetrics.totalRevenue / 1000).toFixed(1)}k`}
            trend={8.7}
            trendPositive={true}
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Inventory Trend</CardTitle>
                <CardDescription>
                  Stock levels, sales, and restocking over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={inventoryTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--muted)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="inStock"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sold"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="restocked"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Inventory by Category</CardTitle>
                  <CardDescription>Distribution of items</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Revenue and growth by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--muted)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="units" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Revenue distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" stroke="var(--muted-foreground)" />
                      <YAxis dataKey="category" type="category" stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--muted)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Category Growth Rate</CardTitle>
                  <CardDescription>Month-over-month growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--muted)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                        formatter={(value) => `${value}%`}
                      />
                      <Bar
                        dataKey="growth"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Low Stock Alert */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>
              {lowStockItems.length} items below reorder point
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-4 font-semibold text-foreground">
                      Item
                    </th>
                    <th className="text-left py-2 px-4 font-semibold text-foreground">
                      Category
                    </th>
                    <th className="text-center py-2 px-4 font-semibold text-foreground">
                      Current
                    </th>
                    <th className="text-center py-2 px-4 font-semibold text-foreground">
                      Reorder Point
                    </th>
                    <th className="text-center py-2 px-4 font-semibold text-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground">{item.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{item.category}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-muted-foreground">
                        {item.reorderPoint}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button size="sm" variant="outline">
                          Reorder
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
