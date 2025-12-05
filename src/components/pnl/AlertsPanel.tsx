import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertSeverity } from "@/types/pnl";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Bell } from "lucide-react";

interface AlertsPanelProps {
  alerts: Alert[];
}

const severityConfig: Record<AlertSeverity, { 
  icon: typeof AlertTriangle; 
  className: string;
  bgClass: string;
}> = {
  CRITICAL: { 
    icon: AlertTriangle, 
    className: "text-red-400",
    bgClass: "bg-red-500/10 border-red-500/20"
  },
  WARNING: { 
    icon: AlertCircle, 
    className: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/20"
  },
  INFO: { 
    icon: Info, 
    className: "text-blue-400",
    bgClass: "bg-blue-500/10 border-blue-500/20"
  },
  SUCCESS: { 
    icon: CheckCircle, 
    className: "text-emerald-400",
    bgClass: "bg-emerald-500/10 border-emerald-500/20"
  }
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
            <span className="text-sm">No active alerts</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by severity
  const sortedAlerts = [...alerts].sort((a, b) => {
    const order: AlertSeverity[] = ["CRITICAL", "WARNING", "INFO", "SUCCESS"];
    return order.indexOf(a.severity) - order.indexOf(b.severity);
  });

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          Alerts
          <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full ml-auto">
            {alerts.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedAlerts.map((alert, index) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          
          return (
            <div 
              key={index}
              className={`p-3 rounded-lg border ${config.bgClass} animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.className}`} />
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
