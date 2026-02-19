import React from "react";
import { Card } from "./card";

export function DashboardWelcome({ name }: { name: string }) {
  return (
    <Card className="mb-8 text-center">
      <div className="text-2xl font-bold mb-2">Welcome, {name}!</div>
      <div className="text-gray-500 dark:text-gray-400">Here’s your dealer dashboard overview.</div>
    </Card>
  );
}
