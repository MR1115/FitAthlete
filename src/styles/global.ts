import { StyleSheet } from 'react-native';

export const colors = {
  background: '#02020242',
  header: '#242444',
  surface: '#2a2a4a',
  primary: '#ffffff',
  text: '#000000',
  textSecondary: '#202020cc',
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
    backgroundColor: '#525252b2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: colors.header,
  },
  space: {
    flexDirection: 'row',
    padding: 24,
  },
});