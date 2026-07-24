import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";

import { dashboardStyles } from "@/styles/dashboard";
import { colors } from "@/styles/global";

interface DashboardCardProps {
  title: string;

  subtitle?: string;

  icon?: keyof typeof Ionicons.glyphMap;

  children: React.ReactNode;

  rightComponent?: React.ReactNode;

  style?: StyleProp<ViewStyle>;
}

export default function DashboardCard({
  title,
  subtitle,
  icon,
  children,
  rightComponent,
  style,
}: DashboardCardProps) {
  return (
    <View style={[dashboardStyles.card, style]}>
      <View style={dashboardStyles.cardHeader}>
        <View>
          <View style={dashboardStyles.cardTitleContainer}>
            {icon && (
              <Ionicons
                name={icon}
                size={22}
                color={colors.primary}
              />
            )}

            <Text style={dashboardStyles.cardTitle}>
              {title}
            </Text>
          </View>

          {subtitle && (
            <Text style={dashboardStyles.cardSubtitle}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightComponent}
      </View>

      {children}
    </View>
  );
}