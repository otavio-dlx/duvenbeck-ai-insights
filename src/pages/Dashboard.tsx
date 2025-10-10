import { DataViewer } from "@/components/DataViewer";
import { FilterPanel } from "@/components/FilterPanel";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { PrioritizationMatrix } from "@/components/PrioritizationMatrix";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { participantsData } from "@/data/participants";
import { getIdeasFor, listDataKeys } from "@/lib/data";
import { Building2, Lightbulb, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Dashboard = () => {
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedDay, setSelectedDay] = useState("all");

  // Extract unique departments
  const departments = useMemo(() => {
    const depts = [...new Set(participantsData.map((p) => p.groupName))];
    return depts.sort();
  }, []);

  // Filter participants based on selections
  const filteredParticipants = useMemo(() => {
    return participantsData.filter((p) => {
      const deptMatch =
        selectedDepartment === "all" || p.groupName === selectedDepartment;
      const dayMatch =
        selectedDay === "all" ||
        (selectedDay === "day1" && p.day1) ||
        (selectedDay === "day2" && p.day2) ||
        (selectedDay === "day3" && p.day3);
      return deptMatch && dayMatch;
    });
  }, [selectedDepartment, selectedDay]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalIdeas = filteredParticipants.length * 3; // Assuming avg 3 ideas per participant
    const uniqueDepts = new Set(filteredParticipants.map((p) => p.groupName))
      .size;

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
      { name: t("common.day1"), value: day1Count },
      { name: t("common.day2"), value: day2Count },
      { name: t("common.day3"), value: day3Count },
    ];
  }, [t]);

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
  ];

  const handleReset = () => {
    setSelectedDepartment("all");
    setSelectedDay("all");
  };

  // ...existing code...

  // ...existing code...
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />

      <main className="container py-6 space-y-6">
        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t("metrics.totalIdeas")}
            value={metrics.totalIdeas}
            icon={Lightbulb}
          />
          <MetricCard
            title={t("metrics.totalParticipants")}
            value={metrics.totalParticipants}
            icon={Users}
          />
          <MetricCard
            title={t("metrics.departments")}
            value={metrics.departments}
            icon={Building2}
          />
          <MetricCard
            title={t("metrics.avgPriority")}
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
                <TabsTrigger value="overview">{t("nav.overview")}</TabsTrigger>
                <TabsTrigger value="startseite">
                  {t("nav.startseite")}
                </TabsTrigger>
                <TabsTrigger value="prioritization">
                  {t("nav.prioritization")}
                </TabsTrigger>
                <TabsTrigger value="participants">
                  {t("nav.participants")}
                </TabsTrigger>
                <TabsTrigger value="datasets">Datasets</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {t("charts.ideasByDepartment")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                          />
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
                              backgroundColor: "hsl(var(--popover))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "var(--radius)",
                            }}
                          />
                          <Bar
                            dataKey="value"
                            fill="hsl(var(--primary))"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {t("charts.participantsByDay")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={dayData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="hsl(var(--primary))"
                            dataKey="value"
                          >
                            {dayData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--popover))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "var(--radius)",
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
                    <CardTitle>{t("nav.startseite")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">
                        Workshop Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        The AI Workshop took place from October 6-8, 2025 with
                        participants from various departments across Duvenbeck.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Collaboards</h3>
                      <div className="space-y-2">
                        {/* Dynamically render collaboard links discovered from data files */}
                        {/** We'll load keys and then attempt to read a workbook/link from Startseite */}
                        <DynamicCollaboards />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prioritization" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("nav.prioritization")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PrioritizationMatrix />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="participants" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("nav.participants")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filteredParticipants.map((participant, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {participant.groupName} •{" "}
                              {participant.organisationalUnit}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {participant.day1 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-chart-1/20 text-chart-1">
                                D1
                              </span>
                            )}
                            {participant.day2 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-chart-2/20 text-chart-2">
                                D2
                              </span>
                            )}
                            {participant.day3 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-chart-3/20 text-chart-3">
                                D3
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="datasets" className="space-y-6 mt-6">
                <DataViewer />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

// Top-level component to discover collaboard links from datasets
export function DynamicCollaboards(): JSX.Element {
  const [links, setLinks] = useState<Array<{ key: string; url: string }>>([]);

  useEffect(() => {
    let mounted = true;

    async function discover() {
      const keys = await listDataKeys();
      const found: Array<{ key: string; url: string }> = [];

      for (const k of keys) {
        try {
          const data = await getIdeasFor(k);
          if (!data) continue;
          const startseite = (data as any)["Startseite"];
          if (!Array.isArray(startseite)) continue;

          let url: string | null = null;
          for (const row of startseite) {
            for (const val of Object.values(row)) {
              if (typeof val === "string" && val.startsWith("http")) {
                url = val;
                break;
              }
            }
            if (url) break;
          }

          if (url) found.push({ key: k, url });
        } catch (err) {
          console.warn(`Failed to read dataset ${k}:`, err);
        }
      }

      if (mounted) setLinks(found);
    }

    discover();

    return () => {
      mounted = false;
    };
  }, []);

  if (links.length === 0)
    return (
      <p className="text-sm text-muted-foreground">No collaboards found.</p>
    );

  return (
    <div className="space-y-2">
      {links.map((l) => (
        <a
          key={l.key}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-3 py-2 border rounded-md hover:bg-muted/50"
        >
          {l.key} Collaboard
        </a>
      ))}
    </div>
  );
}
