import { Button } from "./button";
import { LoadingSpinner } from "./loading-spinner";
import React from "react";

export function FormActions({ loading, children }: { loading?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mt-8">
      <Button type="submit" disabled={loading}>
        {loading ? <LoadingSpinner size={20} className="mr-2" /> : null}
        {children}
      </Button>
    </div>
  );
}
