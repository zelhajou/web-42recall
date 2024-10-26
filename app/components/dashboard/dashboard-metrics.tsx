'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Code2, GitBranch, Circle, Target, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function DashboardMetrics() {
  const studyProgress = [
    { date: '2024-01', xp: 4200 },
    { date: '2024-02', xp: 7840 },
    { date: '2024-03', xp: 9650 },
    { date: '2024-04', xp: 12480 },
  ];
  const commonCircles = [
    "42cursus",
    "Inner Circle",
    "Outer Circle",
    "Unix",
    "Graphics",
    "Algorithms",
    "Web"
  ];
  return (
    <div className="space-y-6">
      {}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level 7.42</div>
            <p className="text-xs text-muted-foreground">42% to next level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Project</CardTitle>
            <Code2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">minishell</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">Keep pushing!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blackhole</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 days</div>
            <p className="text-xs text-muted-foreground">Time remaining</p>
          </CardContent>
        </Card>
      </div>
      {}
      <Card>
        <CardHeader>
          <CardTitle>XP Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studyProgress}>
                <XAxis 
                  dataKey="date" 
                  stroke="#888888"
                  fontSize={12}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="xp"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      {}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Study Circles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonCircles.map((circle, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <span>{circle}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Study Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Completed session", project: "ft_printf functions", time: "2h ago" },
                { action: "Added cards", project: "System calls list", time: "5h ago" },
                { action: "Mastered topic", project: "Linked Lists", time: "1d ago" },
                { action: "Started studying", project: "Shell Commands", time: "2d ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.project}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
