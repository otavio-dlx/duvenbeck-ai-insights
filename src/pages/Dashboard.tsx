import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { FilterPanel } from '@/components/FilterPanel';
import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { participantsData } from '@/data/participants';
import { Lightbulb, Users, Building2, TrendingUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const Dashboard = () => {
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');

  // Extract unique departments
  const departments = useMemo(() => {
    const depts = [...new Set(participantsData.map((p) => p.groupName))];
    return depts.sort();
  }, []);

  // Filter participants based on selections
  const filteredParticipants = useMemo(() => {
    return participantsData.filter((p) => {
      const deptMatch = selectedDepartment === 'all' || p.groupName === selectedDepartment;
      const dayMatch =
        selectedDay === 'all' ||
        (selectedDay === 'day1' && p.day1) ||
        (selectedDay === 'day2' && p.day2) ||
        (selectedDay === 'day3' && p.day3);
      return deptMatch && dayMatch;
    });
  }, [selectedDepartment, selectedDay]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalIdeas = filteredParticipants.length * 3; // Assuming avg 3 ideas per participant
    const uniqueDepts = new Set(filteredParticipants.map((p) => p.groupName)).size;
    
    return {
      totalIdeas,
      totalParticipants: filteredParticipants.length,
      departments: uniqueDepts,
      avgPriority: 7.5, // Mock data
    };
  }, [filteredParticipants]);

  // Prepare chart data
  const departmentData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    filteredParticipants.forEach((p) => {
      counts[p.groupName] = (counts[p.groupName] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredParticipants]);

  const dayData = useMemo(() => {
    const day1Count = participantsData.filter((p) => p.day1).length;
    const day2Count = participantsData.filter((p) => p.day2).length;
    const day3Count = participantsData.filter((p) => p.day3).length;
    
    return [
      { name: t('common.day1'), value: day1Count },
      { name: t('common.day2'), value: day2Count },
      { name: t('common.day3'), value: day3Count },
    ];
  }, [t]);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

  const handleReset = () => {
    setSelectedDepartment('all');
    setSelectedDay('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t('metrics.totalIdeas')}
            value={metrics.totalIdeas}
            icon={Lightbulb}
          />
          <MetricCard
            title={t('metrics.totalParticipants')}
            value={metrics.totalParticipants}
            icon={Users}
          />
          <MetricCard
            title={t('metrics.departments')}
            value={metrics.departments}
            icon={Building2}
          />
          <MetricCard
            title={t('metrics.avgPriority')}
            value={metrics.avgPriority}
            icon={TrendingUp}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filters */}
          <div className="lg:col-span-1">
            <FilterPanel
              departments={departments}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
              selectedDay={selectedDay}
              onDayChange={setSelectedDay}
              onReset={handleReset}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-muted">
                <TabsTrigger value="overview">{t('nav.overview')}</TabsTrigger>
                <TabsTrigger value="startseite">{t('nav.startseite')}</TabsTrigger>
                <TabsTrigger value="prioritization">{t('nav.prioritization')}</TabsTrigger>
                <TabsTrigger value="participants">{t('nav.participants')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('charts.ideasByDepartment')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            stroke="hsl(var(--foreground))"
                          />
                          <YAxis stroke="hsl(var(--foreground))" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: 'var(--radius)',
                            }}
                          />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t('charts.participantsByDay')}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={dayData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="hsl(var(--primary))"
                            dataKey="value"
                          >
                            {dayData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: 'var(--radius)',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="startseite" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('nav.startseite')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Workshop Information</h3>
                      <p className="text-sm text-muted-foreground">
                        The AI Workshop took place from October 6-8, 2025 with participants from various departments across Duvenbeck.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Collaboards</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-between" asChild>
                          <a href="https://collaboard.app" target="_blank" rel="noopener noreferrer">
                            Compliance Collaboard
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="outline" className="w-full justify-between" asChild>
                          <a href="https://collaboard.app" target="_blank" rel="noopener noreferrer">
                            Corporate Development Collaboard
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prioritization" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('nav.prioritization')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Prioritization matrix and scorecard analysis coming soon. This section will display ideas ranked by impact vs. effort.
                    </p>
                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Chart visualization in development</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="participants" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('nav.participants')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filteredParticipants.slice(0, 10).map((participant, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-sm text-muted-foreground">{participant.groupName} • {participant.organisationalUnit}</p>
                          </div>
                          <div className="flex gap-2">
                            {participant.day1 && <span className="px-2 py-1 text-xs rounded-full bg-chart-1/20 text-chart-1">D1</span>}
                            {participant.day2 && <span className="px-2 py-1 text-xs rounded-full bg-chart-2/20 text-chart-2">D2</span>}
                            {participant.day3 && <span className="px-2 py-1 text-xs rounded-full bg-chart-3/20 text-chart-3">D3</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};
