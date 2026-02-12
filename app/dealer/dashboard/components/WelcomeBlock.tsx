import React from "react";

interface WelcomeBlockProps {
  profile?: { owner_name?: string };
  activeCars?: number;
}

export default function WelcomeBlock({ profile, activeCars }: WelcomeBlockProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome back{profile?.owner_name ? `, ${profile.owner_name}` : ""} 👋
      </h1>
      <p className="text-muted-foreground mt-1">
        {typeof activeCars === "number"
          ? `You currently have ${activeCars} active listing${activeCars === 1 ? "" : "s"}.`
          : "Manage your listings and profile from here."}
      </p>
    </div>
  );
}
