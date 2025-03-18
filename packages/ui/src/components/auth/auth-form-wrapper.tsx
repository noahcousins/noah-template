"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../card";

interface AuthFormWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const AuthFormWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial = true,
}: AuthFormWrapperProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{headerLabel}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
