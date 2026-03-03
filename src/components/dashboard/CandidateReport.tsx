import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BrainCircuit, MessageSquare, ShieldAlert } from "lucide-react";

export const CandidateReport: React.FC = () => {
  const { id } = useParams();

  // Mock Data for Radar Chart (Skills)
  const skillsData = [
    { subject: "Frontend", A: 90, fullMark: 100 },
    { subject: "Backend", A: 65, fullMark: 100 },
    { subject: "DevOps", A: 50, fullMark: 100 },
    { subject: "Soft Skills", A: 85, fullMark: 100 },
    { subject: "Experience", A: 80, fullMark: 100 },
  ];

  // Mock Data for Emotion Timeline
  const emotionData = [
    { time: "00:00", confidence: 60, focus: 80 },
    { time: "05:00", confidence: 75, focus: 85 },
    { time: "10:00", confidence: 85, focus: 90 },
    { time: "15:00", confidence: 40, focus: 95 }, // Struggled with question
    { time: "20:00", confidence: 65, focus: 85 },
    { time: "25:00", confidence: 90, focus: 80 },
    { time: "30:00", confidence: 85, focus: 75 },
    { time: "35:00", confidence: 95, focus: 85 },
  ];

  // Mock Q&A Data
  const qaData = [
    {
      id: "q1",
      question:
        "Can you explain React Server Components and how they differ from traditional SSR?",
      answer:
        "Server components run exclusively on the server and ship zero JavaScript to the client. This differs from SSR, which still sends JS to hydrate the component on the client.",
      score: 95,
      aiFeedback:
        "Excellent technical accuracy. Candidate clearly distinguished between shipping HTML vs hydrating JS.",
    },
    {
      id: "q2",
      question:
        "How would you optimize a large list rendering in a React application?",
      answer:
        "I would use pagination mostly, or maybe try to not load everything at once from the API.",
      score: 45,
      aiFeedback:
        "Missed core frontend patterns. Failed to mention virtualization (e.g., react-window) or layout thrashing avoidance.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
              Sarah Jenkins
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-sm font-medium border border-zinc-700">
              {id || "INT-001"}
            </span>
          </div>
          <p className="text-zinc-400 mt-1 flex items-center gap-2">
            Senior Frontend Engineer <span className="text-zinc-600">•</span>{" "}
            Completed 2 hours ago
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-zinc-400 uppercase tracking-widest font-semibold">
            Total Fit Score
          </div>
          <div className="text-4xl font-bold text-emerald-400 mt-1">82%</div>
        </div>
      </div>

      {/* KPI Header Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-zinc-900/50 border-zinc-800 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <BrainCircuit className="w-24 h-24" />
          </div>
          <div className="text-zinc-400 text-sm font-medium">Technical</div>
          <div className="text-4xl font-light text-zinc-100 flex items-baseline gap-2">
            88<span className="text-lg text-zinc-500">/100</span>
          </div>
        </Card>

        <Card className="p-6 bg-zinc-900/50 border-zinc-800 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <MessageSquare className="w-24 h-24" />
          </div>
          <div className="text-zinc-400 text-sm font-medium">Communication</div>
          <div className="text-4xl font-light text-zinc-100 flex items-baseline gap-2">
            92<span className="text-lg text-zinc-500">/100</span>
          </div>
        </Card>

        <Card className="p-6 bg-zinc-900/50 border-zinc-800 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldAlert className="w-24 h-24" />
          </div>
          <div className="text-zinc-400 text-sm font-medium">
            Problem Solving
          </div>
          <div className="text-4xl font-light text-zinc-100 flex items-baseline gap-2">
            75<span className="text-lg text-zinc-500">/100</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <Card className="p-6 bg-zinc-900/40 border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6">
            Skill Map Mapping
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Candidate"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Emotion Timeline Line Chart */}
        <Card className="p-6 bg-zinc-900/40 border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">
            Emotion & Focus Timeline
          </h3>
          <p className="text-xs text-zinc-500 mb-6">
            Click graph points to jump video to timestamp (Interactive mock)
          </p>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={emotionData}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke="#71717a"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis stroke="#71717a" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#f4f4f5" }}
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  name="Confidence"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="focus"
                  name="Task Focus"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Q&A Accordion */}
      <h3 className="text-xl font-bold text-zinc-100 mt-4 border-b border-zinc-800 pb-2">
        Interview Breakdown (Q&A)
      </h3>
      <Accordion type="multiple" className="w-full flex flex-col gap-3">
        {qaData.map((qa, index) => (
          <AccordionItem
            key={qa.id}
            value={qa.id}
            className="border border-zinc-800 bg-zinc-900/30 rounded-lg px-4 overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-start text-left gap-4 pr-4">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-zinc-200 font-medium leading-relaxed">
                    {qa.question}
                  </p>
                </div>
                <div
                  className={`px-2.5 py-1 rounded text-xs font-bold border shrink-0 ${
                    qa.score >= 80
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : qa.score >= 60
                        ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  {qa.score}/100
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-zinc-300 pb-6 pt-2 pl-12 pr-4 flex flex-col gap-4">
              <div>
                <strong className="text-xs uppercase text-zinc-500 tracking-wider">
                  Candidate Answer:
                </strong>
                <p className="mt-1 text-sm bg-zinc-950 p-3 rounded-md border border-zinc-800 relative">
                  <span className="text-zinc-600 absolute -left-2 top-2 text-2xl">
                    "
                  </span>
                  {qa.answer}
                  <span className="text-zinc-600 absolute -right-2 bottom-0 text-2xl">
                    "
                  </span>
                </p>
              </div>
              <div>
                <strong className="text-xs uppercase text-zinc-500 tracking-wider flex items-center gap-1.5 text-blue-400">
                  <BrainCircuit className="w-3.5 h-3.5" /> AI Feedback:
                </strong>
                <p className="mt-1 text-sm text-zinc-400 leading-relaxed font-mono">
                  &gt; {qa.aiFeedback}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
