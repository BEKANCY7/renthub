"use client";

import { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// This would be fetched from your database in a real app
const generateMockData = () => {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const currentMonth = new Date().getMonth();

    return Array(6)
        .fill(0)
        .map((_, i) => {
            const monthIndex = (currentMonth - 5 + i + 12) % 12;
            return {
                month: months[monthIndex],
                income: Math.floor(Math.random() * 5000) + 2000,
                expenses: Math.floor(Math.random() * 1000) + 500,
                profit: Math.floor(Math.random() * 4000) + 1000,
            };
        });
};

interface IncomeChartProps {
    userId: string;
}

export function IncomeChart({ userId }: IncomeChartProps) {
    const data = useMemo(() => generateMockData(), []);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                    formatter={(value) => [`$${value}`, undefined]}
                    labelFormatter={(label) => `Month: ${label}`}
                />
                <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Income"
                />
                <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    name="Profit"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
} 