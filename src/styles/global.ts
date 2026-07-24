import { StyleSheet } from 'react-native';

export const colors = {
  background: '#ffffff',
  header: '#242444',
  surface: '#ffffff',
  primary: '#4fc3f7',
  text: '#464646',
  textSecondary: '#8b8b99',
  alert: '#ff5252',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 30,
    marginBottom: 16,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});