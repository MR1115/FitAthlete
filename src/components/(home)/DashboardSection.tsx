import React from "react";
import { Text, View } from "react-native";

import { dashboardStyles } from "@/styles/dashboard";

interface DashboardSectionProps {
  title: string;

  children: React.ReactNode;
}

export default function DashboardSection({
  title,
  children,
}: DashboardSectionProps) {
  return (
    <View style={dashboardStyles.section}>
      <Text style={dashboardStyles.sectionTitle}>
        {title}
      </Text>

      {children}
    </View>
  );
}

