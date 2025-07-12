import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { revenueProjectionInsertSchema, type RevenueProjectionInsert, type RevenueProjection } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface RevenueData {
  projectedRevenueFromDeals: number;
  monthlyProjections: RevenueProjection[];
  totalProjectedRevenue: number;
  totalActualRevenue: number;
}

export default function RevenueForecasting() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: projections, isLoading: projectionsLoading } = useQuery<RevenueProjection[]>({
    queryKey: ['/api/revenue-projections'],
    queryFn: () => apiRequest('/api/revenue-projections'),
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery<RevenueData>({
    queryKey: ['/api/analytics/revenue-forecast'],
    queryFn: () => apiRequest('/api/analytics/revenue-forecast'),
  });

  const form = useForm<RevenueProjectionInsert>({
    resolver: zodResolver(revenueProjectionInsertSchema),
    defaultValues: {
      month: '',
      projectedRevenue: 0,
      actualRevenue: 0,
      confidence: 75,
    },
  });

  const createProjectionMutation = useMutation({
    mutationFn: (projectionData: RevenueProjectionInsert) => 
      apiRequest('/api/revenue-projections', {
        method: 'POST',
        body: JSON.stringify(projectionData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/revenue-projections'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/revenue-forecast'] });
      setShowAddForm(false);
      form.reset();
    },
  });

  const onSubmit = async (data: RevenueProjectionInsert) => {
    try {
      await createProjectionMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to create revenue projection:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const getAccuracyColor = (projected: number, actual: number) => {
    if (projected === 0) return 'text-gray-500';
    const accuracy = (actual / projected) * 100;
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyText = (projected: number, actual: number) => {
    if (projected === 0) return 'N/A';
    const accuracy = (actual / projected) * 100;
    return `${Math.round(accuracy)}%`;
  };

  // Sort projections by month
  const sortedProjections = projections?.sort((a, b) => b.month.localeCompare(a.month));

  if (projectionsLoading || revenueLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Revenue Forecasting</h1>
          <p className="text-muted-foreground">
            Track and forecast your revenue projections
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Projection
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Revenue Forecast</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenueData?.projectedRevenueFromDeals || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on current deals in pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projected Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenueData?.totalProjectedRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sum of all monthly projections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueData?.totalProjectedRevenue 
                ? Math.round((revenueData.totalActualRevenue / revenueData.totalProjectedRevenue) * 100)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Actual vs projected revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Projection Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Revenue Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Month *</Label>
                  <Input
                    id="month"
                    type="month"
                    {...form.register('month')}
                  />
                  {form.formState.errors.month && (
                    <p className="text-sm text-destructive">{form.formState.errors.month.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectedRevenue">Projected Revenue ($) *</Label>
                  <Input
                    id="projectedRevenue"
                    type="number"
                    step="0.01"
                    {...form.register('projectedRevenue', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {form.formState.errors.projectedRevenue && (
                    <p className="text-sm text-destructive">{form.formState.errors.projectedRevenue.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actualRevenue">Actual Revenue ($) *</Label>
                  <Input
                    id="actualRevenue"
                    type="number"
                    step="0.01"
                    {...form.register('actualRevenue', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {form.formState.errors.actualRevenue && (
                    <p className="text-sm text-destructive">{form.formState.errors.actualRevenue.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confidence">Confidence (%) *</Label>
                  <Input
                    id="confidence"
                    type="number"
                    min="0"
                    max="100"
                    {...form.register('confidence', { valueAsNumber: true })}
                    placeholder="75"
                  />
                  {form.formState.errors.confidence && (
                    <p className="text-sm text-destructive">{form.formState.errors.confidence.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createProjectionMutation.isPending}
                >
                  {createProjectionMutation.isPending ? 'Adding...' : 'Add Projection'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projections Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Revenue Projections ({sortedProjections?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedProjections && sortedProjections.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Projected Revenue</TableHead>
                  <TableHead>Actual Revenue</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Variance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProjections.map((projection) => {
                  const variance = projection.actualRevenue - projection.projectedRevenue;
                  return (
                    <TableRow key={projection.id}>
                      <TableCell className="font-medium">
                        {formatMonth(projection.month)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(projection.projectedRevenue)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(projection.actualRevenue)}
                      </TableCell>
                      <TableCell>{projection.confidence}%</TableCell>
                      <TableCell 
                        className={getAccuracyColor(projection.projectedRevenue, projection.actualRevenue)}
                      >
                        {getAccuracyText(projection.projectedRevenue, projection.actualRevenue)}
                      </TableCell>
                      <TableCell 
                        className={variance >= 0 ? 'text-green-600' : 'text-red-600'}
                      >
                        {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No revenue projections found</div>
              <Button 
                className="mt-4" 
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Projection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}