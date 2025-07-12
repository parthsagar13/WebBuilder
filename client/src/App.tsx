import { Route, Switch, Link, useLocation } from 'wouter';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Shield, 
  Home,
  PlusCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import pages
import Dashboard from './pages/Dashboard';
import PipelineManagement from './pages/PipelineManagement';
import RevenueForecasting from './pages/RevenueForecasting';
import AuditLogs from './pages/AuditLogs';
import AddDeal from './pages/AddDeal';

function App() {
  const [location] = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Sales Pipeline', href: '/pipeline', icon: BarChart3 },
    { name: 'Revenue Forecast', href: '/revenue', icon: TrendingUp },
    { name: 'Audit Logs', href: '/audit', icon: Shield },
    { name: 'Add Deal', href: '/add-deal', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-border">
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">HR Business Tool</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Sales Pipeline & Revenue Forecasting Tool
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen bg-muted/30">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/pipeline" component={PipelineManagement} />
            <Route path="/revenue" component={RevenueForecasting} />
            <Route path="/audit" component={AuditLogs} />
            <Route path="/add-deal" component={AddDeal} />
            <Route>
              <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
                  <p className="text-muted-foreground mt-2">The page you're looking for doesn't exist.</p>
                  <Link href="/">
                    <a className="text-primary hover:underline mt-4 inline-block">
                      Go back to Dashboard
                    </a>
                  </Link>
                </div>
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default App;