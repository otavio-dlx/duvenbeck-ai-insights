import { FilterPanel } from "@/components/FilterPanel";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { PrioritizationMatrix } from "@/components/PrioritizationMatrix";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { participantsData } from "@/data/participants";
import { getIdeasFor, listDataKeys } from "@/lib/data";
import {
  Building2,
  Lightbulb,
  PanelLeft,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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

  // Calculate metrics and department data
  const { metrics, departmentData } = useMemo(() => {
    const departments = [...new Set(participantsData.map((p) => p.groupName))];
    const ideasByDept: { [key: string]: number } = {};
    let totalIdeasCount = 0;

    // Load ideas for each department
    departments.forEach((dept) => {
      try {
        // Mapeamento explícito de todos os departamentos para seus arquivos de dados
        const deptMappings: { [key: string]: string[] } = {
          ESG: ["esg"],
          HR: ["hr"],
          "Marketing & Communication": ["marketing_communications"],
          "Corporate Development": ["corp_dev"],
          Compliance: ["compliance"],
          Legal: ["legal"],
          Controlling: ["controlling"],
          "Group Accounting I": ["group_accounting"],
          "Business Solution PCL": ["business_solution_pcl"],
          "Road Sales SE": ["road_sales_se"],
          "IT Shared Services": ["it_shared_services"],
          "Solution Design": ["solution_design"],
          "Platform Services / Digital Workplace": ["platform_services"],
          "Security Management": ["security_management"],
          "Contract Logistics": ["contract_logistics"],
          "Information Security": ["information_security"],
          "Strategic KAM": ["strategic_kam"],
          CRM: ["crm"],
          QEHS: ["qehs"],
          Insurance: ["insurance"],
          "Central Solution Design": ["central_solution_design"],
        };

        const deptKeys = deptMappings[dept] || [
          dept.toLowerCase().replace(/[^a-z0-9]/g, "_"),
        ];
        const deptData = import.meta.glob("../data/*.ts", { eager: true });
        const deptFiles = Object.entries(deptData).filter(([path]) =>
          deptKeys.some((key) => path.toLowerCase().includes(key))
        );

        deptFiles.forEach(([_, module]) => {
          // Define a type for the expected module structure
          type IdeasModule = {
            ideas?: {
              home?: unknown[];
              ideas?: Array<{ finalPrio?: string | number; ideaKey?: string }>;
            };
          };
          const moduleData = (module as IdeasModule).ideas;
          const ideas = moduleData?.ideas;

          // Check for new format first (structured ideas array)
          if (Array.isArray(ideas)) {
            const validIdeas = ideas.filter(
              (item) =>
                item &&
                typeof item === "object" &&
                "ideaKey" in item &&
                item.ideaKey
            );
            const count = validIdeas.length;
            ideasByDept[dept] = (ideasByDept[dept] || 0) + count;
            totalIdeasCount += count;
            return; // Skip old format processing
          }

          // Fall back to old format (Priorisierungsmatrix) - check the full module data
          const fullModuleData = moduleData as Record<string, unknown>;
          if (
            fullModuleData &&
            typeof fullModuleData === "object" &&
            "Priorisierungsmatrix" in fullModuleData &&
            Array.isArray(fullModuleData.Priorisierungsmatrix)
          ) {
            // Count ideas from the Priorisierungsmatrix
            const matrixIdeas = (
              fullModuleData.Priorisierungsmatrix as Record<string, unknown>[]
            ).filter((item: Record<string, unknown>) => {
              if (!item || typeof item !== "object") return false;

              // Skip empty rows
              if (Object.values(item).every((val) => !val)) return false;

              // Skip header rows
              if (
                Object.values(item).some(
                  (val) =>
                    typeof val === "string" &&
                    ["Priorisierungsmatrix", "Titel"].includes(val)
                )
              )
                return false;

              // Check for Problem and/or Solution fields
              const hasValidContent = Object.entries(item).some(
                ([key, value]) => {
                  if (
                    !value ||
                    typeof value !== "string" ||
                    value.trim().length === 0
                  )
                    return false;

                  const problemField =
                    key === "Problem" ||
                    key.toLowerCase().includes("problem") ||
                    key === "Unnamed: 1";

                  const solutionField =
                    key === "Lösung" ||
                    key === "Lösung." ||
                    key.toLowerCase().includes("losung") ||
                    key.toLowerCase().includes("solution") ||
                    key === "Unnamed: 2";

                  return (
                    (problemField || solutionField) && value.trim().length > 0
                  );
                }
              );

              return hasValidContent;
            });

            const count = matrixIdeas.length;
            ideasByDept[dept] = (ideasByDept[dept] || 0) + count;
            totalIdeasCount += count;
          }
        });
      } catch (error) {
        console.warn(`Error processing department ${dept}:`, error);
      }
    });

    const uniqueDepts = new Set(filteredParticipants.map((p) => p.groupName))
      .size;

    const metrics = {
      totalIdeas: totalIdeasCount,
      totalParticipants: filteredParticipants.length,
      departments: uniqueDepts,
      avgPriority: 7.5, // Mock data
    };

    const departmentData = Object.entries(ideasByDept)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return { metrics, departmentData };
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
    "hsl(var(--chart-4, 280 65% 65%))",
    "hsl(var(--chart-5, 200 65% 65%))",
    "hsl(var(--chart-6, 150 65% 65%))",
    "hsl(var(--chart-7, 30 65% 65%))",
    "hsl(var(--chart-8, 320 65% 65%))",
    "hsl(var(--chart-9, 180 65% 65%))",
    "hsl(var(--chart-10, 60 65% 65%))",
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
            <Tabs defaultValue="processes" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-muted">
                <TabsTrigger value="overview">{t("nav.overview")}</TabsTrigger>
                <TabsTrigger value="processes">
                  {t("nav.processes")}
                </TabsTrigger>
                <TabsTrigger value="prioritization">
                  {t("nav.prioritization")}
                </TabsTrigger>
                <TabsTrigger value="participants">
                  {t("nav.participants")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {t("charts.ideasByDepartment")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={departmentData}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 40,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--border))"
                                opacity={0.2}
                              />
                              <XAxis dataKey="name" hide={true} />
                              <YAxis
                                stroke="hsl(var(--foreground))"
                                tick={{
                                  fill: "hsl(var(--foreground))",
                                  fontSize: 12,
                                }}
                                tickMargin={10}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "hsl(var(--popover))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: "var(--radius)",
                                  color: "hsl(var(--foreground))",
                                }}
                                cursor={{
                                  fill: "hsl(var(--muted))",
                                  opacity: 0.2,
                                }}
                              />
                              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {departmentData.map((entry, index) => (
                                  <Cell
                                    key={entry.name}
                                    fill={COLORS[index]}
                                    stroke="hsl(var(--background))"
                                    strokeWidth={2}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                          {departmentData.map((entry, index) => (
                            <div
                              key={entry.name}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: COLORS[index],
                                  border: "2px solid hsl(var(--background))",
                                }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {entry.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {t("charts.participantsByDay")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 60,
                            }}
                          >
                            <Pie
                              data={dayData}
                              cx="50%"
                              cy="45%"
                              outerRadius={100}
                              fill="hsl(var(--primary))"
                              dataKey="value"
                              nameKey="name"
                            >
                              {dayData.map((entry, index) => (
                                <Cell
                                  key={entry.name}
                                  fill={COLORS[index % COLORS.length]}
                                  stroke="hsl(var(--background))"
                                  strokeWidth={2}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--popover))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                                color: "hsl(var(--foreground))",
                              }}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              formatter={(value) => (
                                <span
                                  style={{ color: "hsl(var(--foreground))" }}
                                >
                                  {value}
                                </span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="processes" className="space-y-6 mt-6">
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
          const startseite = (data as Record<string, unknown>)["Startseite"];
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

  // Function to format the department name formally
  const formatDepartmentName = (key: string): string => {
    const nameMap: Record<string, string> = {
      central_solution_design: "Central Solution Design",
      compliance: "Compliance",
      contract_logistics: "Contract Logistics",
      corp_dev: "Corporate Development",
      esg: "Environmental, Social & Governance",
      hr: "Human Resources",
      marketing_communications: "Marketing & Communications",
      qehs: "Quality, Environment, Health & Safety",
    };
    return (
      nameMap[key] ||
      key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  return (
    <div className="space-y-2">
      {links.map((l) => (
        <a
          key={l.key}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 w-full px-3 py-2 border rounded-md hover:bg-muted/50 transition-colors"
        >
          <PanelLeft className="h-4 w-4" />
          <span>{formatDepartmentName(l.key)}</span>
        </a>
      ))}
    </div>
  );
}
