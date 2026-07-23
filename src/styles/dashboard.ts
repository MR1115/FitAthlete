import { StyleSheet } from "react-native";
import { colors } from "./global";

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
};

export const dashboardStyles = StyleSheet.create({
  page: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },

  section: {
    marginTop: spacing.lg,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },

  //------------------------------------
  // Generic Card
  //------------------------------------

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,

    padding: spacing.md,

    borderWidth: 1,
    borderColor: "#44446A",

    shadowColor: "#000",

    shadowOpacity: 0.25,
    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 8,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  //------------------------------------
  // Action Buttons
  //------------------------------------

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  actionButton: {
    flex: 1,

    backgroundColor: "#35355A",

    borderRadius: radius.md,

    paddingVertical: 18,

    alignItems: "center",

    borderWidth: 1,
    borderColor: "#4B4B70",
  },

  actionIcon: {
    marginBottom: 8,
  },

  actionLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  //------------------------------------
  // Stats
  //------------------------------------

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 24,
    color: colors.text,
    fontWeight: "800",
  },

  statLabel: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSecondary,
  },
});