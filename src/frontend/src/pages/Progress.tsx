import { Clock, Flame, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { UserProfile } from "../hooks/useProfile";
import { useProgress } from "../hooks/useProgress";
import type { WorkoutLogEntry } from "../hooks/useWorkoutLog";

interface Props {
  log: WorkoutLogEntry[];
  profile: UserProfile | null;
}

export default function ProgressPage({ log, profile }: Props) {
  const stats = useProgress(log, profile);

  const heatmap = useMemo(() => {
    const workoutDates = new Set(log.map((e) => e.date));
    const days: { date: string; active: boolean }[] = [];
    for (let i = 34; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, active: workoutDates.has(key) });
    }
    return days;
  }, [log]);

  const radialData = [
    { name: "Consistency", value: stats.consistencyPct, fill: "#32E36B" },
  ];

  const statCards = [
    {
      icon: Trophy,
      label: "Total Workouts",
      value: stats.totalWorkouts,
      color: "text-neon",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${stats.streak}d`,
      color: "text-orange-400",
    },
    {
      icon: Clock,
      label: "Avg Duration",
      value: `${stats.avgDuration}min`,
      color: "text-blue-400",
    },
    {
      icon: Zap,
      label: "Total Calories",
      value: `${stats.totalCalories}kcal`,
      color: "text-amber-fit",
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto pb-24 md:pb-6">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold mb-6"
      >
        Your Progress
      </motion.h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            data-ocid={`progress.stat.item.${i + 1}`}
            className="glass-card rounded-xl p-4"
          >
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5"
          data-ocid="progress.line_chart.card"
        >
          <h2 className="text-base font-semibold mb-4">Workouts Per Week</h2>
          {stats.weeks.length === 0 ? (
            <div
              className="h-40 flex items-center justify-center text-muted-foreground text-sm"
              data-ocid="progress.line_chart.empty_state"
            >
              No data yet. Start working out!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stats.weeks}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.25 0.04 240)"
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.04 240)",
                    border: "1px solid oklch(0.96 0 0 / 0.1)",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                  itemStyle={{ color: "#32E36B" }}
                />
                <Line
                  type="monotone"
                  dataKey="workouts"
                  stroke="#32E36B"
                  strokeWidth={2}
                  dot={{ fill: "#32E36B", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-5"
          data-ocid="progress.bar_chart.card"
        >
          <h2 className="text-base font-semibold mb-4">Weekly Volume (Sets)</h2>
          {stats.weeks.length === 0 ? (
            <div
              className="h-40 flex items-center justify-center text-muted-foreground text-sm"
              data-ocid="progress.bar_chart.empty_state"
            >
              No data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.weeks}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.25 0.04 240)"
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.04 240)",
                    border: "1px solid oklch(0.96 0 0 / 0.1)",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                  itemStyle={{ color: "#3B82F6" }}
                />
                <Bar dataKey="volume" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                  {stats.weeks.map((week, i) => (
                    <Cell
                      key={week.week}
                      fill={
                        i === stats.weeks.length - 1 ? "#32E36B" : "#3B82F6"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-5"
          data-ocid="progress.consistency.card"
        >
          <h2 className="text-base font-semibold mb-4">Monthly Consistency</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <ResponsiveContainer width={120} height={120}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  startAngle={90}
                  endAngle={-270}
                  data={radialData}
                >
                  <RadialBar
                    dataKey="value"
                    background={{ fill: "oklch(0.22 0.04 240)" }}
                    cornerRadius={6}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-neon">
                  {stats.consistencyPct}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-neon">
                {stats.workoutDaysThisMonth}
              </p>
              <p className="text-sm text-muted-foreground">
                of {stats.plannedDaysThisMonth} planned
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                workouts this month
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card rounded-2xl p-5"
          data-ocid="progress.heatmap.card"
        >
          <h2 className="text-base font-semibold mb-4">
            Activity (Last 35 Days)
          </h2>
          <div className="grid grid-cols-7 gap-1.5">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="text-center text-xs text-muted-foreground pb-1"
              >
                {d}
              </div>
            ))}
            {heatmap.map((day) => (
              <div
                key={day.date}
                data-ocid="progress.heatmap.item.1"
                title={day.date}
                className={`aspect-square rounded-sm transition-colors ${
                  day.active ? "bg-neon shadow-neon" : "bg-secondary"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
