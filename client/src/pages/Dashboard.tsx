import { useQuery } from '@tanstack/react-query';
import { BarChart3, DollarSign, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import type { Deal } from '@shared/schema';

interface PipelineSummary {
  totalDeals: number;
  totalValue: number;
  averageDealSize: number;
  byStage: Record<string, { count: number; value: number }>;
  weightedValue: number;
}

interface RevenueData {
  projectedRevenueFromDeals: number;
  monthlyProjections: Array<{
    month: string;
    projectedRevenue: number;
    actualRevenue: number;
  }>;
  totalProjectedRevenue: number;
  totalActualRevenue: number;
}

export default function Dashboard() {
  const { data: pipelineData, isLoading: pipelineLoading } = useQuery<PipelineSummary>({
    queryKey: ['/api/analytics/pipeline-summary'],
    queryFn: () => apiRequest('/api/analytics/pipeline-summary'),
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery<RevenueData>({
    queryKey: ['/api/analytics/revenue-forecast'],
    queryFn: () => apiRequest('/api/analytics/revenue-forecast'),
  });

  const { data: recentDeals, isLoading: dealsLoading } = useQuery<Deal[]>({
    queryKey: ['/api/deals'],
    queryFn: () => apiRequest('/api/deals'),
    select: (data) => data.slice(0, 5), // Get recent 5 deals
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'prospect': 'text-gray-600',
      'qualified': 'text-blue-600',
      'proposal': 'text-yellow-600',
      'negotiation': 'text-orange-600',
      'closed-won': 'text-green-600',
      'closed-lost': 'text-red-600',
    };
    return colors[stage] || 'text-gray-600';
  };

  if (pipelineLoading || revenueLoading || dealsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your sales pipeline and revenue forecasts
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pipelineData?.totalDeals || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active deals in pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pipelineData?.totalValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sum of all deal values
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weighted Pipeline</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pipelineData?.weightedValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Probability-adjusted value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pipelineData?.averageDealSize || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average value per deal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline by Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineData?.byStage && Object.entries(pipelineData.byStage).map(([stage, data]) => (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStageColor(stage)}`}></div>
                    <span className="capitalize font-medium">{stage.replace('-', ' ')}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{data.count} deals</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(data.value)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Forecast Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pipeline Revenue Forecast</span>
                <span className="font-semibold">
                  {formatCurrency(revenueData?.projectedRevenueFromDeals || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Projected Revenue</span>
                <span className="font-semibold">
                  {formatCurrency(revenueData?.totalProjectedRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Actual Revenue</span>
                <span className="font-semibold">
                  {formatCurrency(revenueData?.totalActualRevenue || 0)}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  Revenue accuracy: {
                    revenueData?.totalProjectedRevenue 
                      ? Math.round((revenueData.totalActualRevenue / revenueData.totalProjectedRevenue) * 100)
                      : 0
                  }%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDeals && recentDeals.length > 0 ? (
            <div className="space-y-4">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{deal.title}</div>
                    <div className="text-sm text-muted-foreground">{deal.clientName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(deal.value)}</div>
                    <div className={`text-sm capitalize ${getStageColor(deal.stage)}`}>
                      {deal.stage.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No deals found. <a href="/add-deal" className="text-primary hover:underline">Add your first deal</a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}