
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Brain, 
  Clock, 
  BarChart3, 
  Zap,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const ForecastModels = () => {
  const [selectedModel, setSelectedModel] = useState('chronos');
  const [retraining, setRetraining] = useState(false);

  const models = [
    {
      id: 'chronos',
      name: 'AWS Chronos',
      type: 'Transformer',
      status: 'active',
      accuracy: 94.2,
      lastTrained: '2024-01-15T06:00:00Z',
      trainingData: '5-min pricing data (90 days)',
      targets: ['energy_price', 'token_price', 'hash_price']
    },
    {
      id: 'deepar',
      name: 'DeepAR',
      type: 'RNN',
      status: 'standby',
      accuracy: 91.8,
      lastTrained: '2024-01-14T18:00:00Z',
      trainingData: '15-min aggregated data (180 days)',
      targets: ['energy_price', 'hash_price']
    },
    {
      id: 'prophet',
      name: 'Prophet',
      type: 'Traditional',
      status: 'backup',
      accuracy: 87.3,
      lastTrained: '2024-01-14T12:00:00Z',
      trainingData: 'Hourly data (365 days)',
      targets: ['energy_price']
    }
  ];

  const forecastData = {
    energy_price: {
      current: 0.045,
      forecast_1h: 0.052,
      forecast_4h: 0.048,
      forecast_24h: 0.041,
      confidence: 0.94,
      trend: 'increasing'
    },
    token_price: {
      current: 43250,
      forecast_1h: 44100,
      forecast_4h: 43800,
      forecast_24h: 45200,
      confidence: 0.87,
      trend: 'volatile'
    },
    hash_price: {
      current: 0.0234,
      forecast_1h: 0.0267,
      forecast_4h: 0.0245,
      forecast_24h: 0.0289,
      confidence: 0.91,
      trend: 'increasing'
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    // Simulate retraining process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setRetraining(false);
  };

  const getCurrentModel = () => models.find(m => m.id === selectedModel);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-golden mb-2">Forecast Models</h2>
        <p className="text-muted-foreground">
          AWS Chronos-powered prediction models for energy and crypto markets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Model Selection */}
        <Card className="metric-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-golden" />
            Active Models
          </h3>
          
          <div className="space-y-3">
            {models.map(model => (
              <div 
                key={model.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedModel === model.id 
                    ? 'border-golden bg-golden/10' 
                    : 'border-border hover:border-golden/50'
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{model.name}</span>
                  <Badge className={
                    model.status === 'active' ? 'bg-lime text-black' :
                    model.status === 'standby' ? 'bg-golden text-black' :
                    'bg-gray-500 text-white'
                  }>
                    {model.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div>Type: {model.type}</div>
                  <div>Accuracy: {model.accuracy}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Model Details */}
        <Card className="metric-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-golden" />
              {getCurrentModel()?.name} Details
            </h3>
            <Button 
              onClick={handleRetrain}
              disabled={retraining}
              className="bg-golden text-black hover:bg-golden/80"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${retraining ? 'animate-spin' : ''}`} />
              {retraining ? 'Retraining...' : 'Retrain Model'}
            </Button>
          </div>

          {getCurrentModel() && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Model Type</label>
                  <p className="font-medium">{getCurrentModel()?.type}</p>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Training Dataset</label>
                  <p className="font-medium text-sm">{getCurrentModel()?.trainingData}</p>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Last Trained</label>
                  <p className="font-mono text-sm">
                    {new Date(getCurrentModel()?.lastTrained || '').toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Accuracy</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={getCurrentModel()?.accuracy} className="flex-1" />
                    <span className="text-sm font-mono">{getCurrentModel()?.accuracy}%</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Forecast Targets</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getCurrentModel()?.targets.map(target => (
                      <Badge key={target} variant="outline" className="text-xs">
                        {target.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-lime" />
                    <span className="text-sm">Model ready for inference</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Forecast Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(forecastData).map(([key, data]) => (
          <Card key={key} className="metric-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold capitalize flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-golden" />
                {key.replace('_', ' ')}
              </h3>
              <Badge className={
                data.trend === 'increasing' ? 'bg-lime text-black' :
                data.trend === 'decreasing' ? 'bg-red-500 text-white' :
                'bg-golden text-black'
              }>
                {data.trend}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Current</label>
                <p className="text-xl font-bold text-golden">
                  {key === 'token_price' 
                    ? `$${data.current.toLocaleString()}` 
                    : `$${data.current.toFixed(4)}`}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <label className="text-xs text-muted-foreground">1h</label>
                  <p className="font-mono text-lime">
                    {key === 'token_price' 
                      ? `$${data.forecast_1h.toLocaleString()}` 
                      : `$${data.forecast_1h.toFixed(4)}`}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">4h</label>
                  <p className="font-mono">
                    {key === 'token_price' 
                      ? `$${data.forecast_4h.toLocaleString()}` 
                      : `$${data.forecast_4h.toFixed(4)}`}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">24h</label>
                  <p className="font-mono">
                    {key === 'token_price' 
                      ? `$${data.forecast_24h.toLocaleString()}` 
                      : `$${data.forecast_24h.toFixed(4)}`}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Model Confidence</label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={data.confidence * 100} className="flex-1" />
                  <span className="text-xs font-mono">{(data.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Mini forecast chart placeholder */}
              <div className="h-16 bg-secondary/30 rounded flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Forecast Trend</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Retrain History */}
      <Card className="metric-card p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-golden" />
          Retrain History
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2">Timestamp</th>
                <th className="text-left py-2">Model</th>
                <th className="text-left py-2">Trigger</th>
                <th className="text-left py-2">Duration</th>
                <th className="text-left py-2">Accuracy Change</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 font-mono text-xs">2024-01-15 06:00:00</td>
                <td className="py-3">AWS Chronos</td>
                <td className="py-3">Scheduled</td>
                <td className="py-3">18m 34s</td>
                <td className="py-3 text-lime">+2.1%</td>
                <td className="py-3">
                  <Badge className="bg-lime text-black">Success</Badge>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 font-mono text-xs">2024-01-14 18:00:00</td>
                <td className="py-3">DeepAR</td>
                <td className="py-3">Manual</td>
                <td className="py-3">12m 18s</td>
                <td className="py-3 text-golden">+0.8%</td>
                <td className="py-3">
                  <Badge className="bg-lime text-black">Success</Badge>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 font-mono text-xs">2024-01-14 12:00:00</td>
                <td className="py-3">Prophet</td>
                <td className="py-3">Drift Detection</td>
                <td className="py-3">8m 45s</td>
                <td className="py-3 text-red-400">-1.2%</td>
                <td className="py-3">
                  <Badge className="bg-red-500 text-white">Reverted</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ForecastModels;
