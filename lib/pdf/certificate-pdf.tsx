import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#EA4335',
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#FBBC04',
  },
  innerBorder: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    border: '2px solid #e8eaed',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  googleText: {
    fontSize: 42,
    fontWeight: 700,
    letterSpacing: -1,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  g1: { color: '#EA4335' },
  o1: { color: '#FBBC04' },
  o2: { color: '#34A853' },
  g2: { color: '#4285F4' },
  l: { color: '#EA4335' },
  e: { color: '#FBBC04' },
  developers: {
    fontSize: 12,
    color: '#F09300',
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  content: {
    textAlign: 'center',
    paddingHorizontal: 60,
  },
  certificateTitle: {
    fontSize: 28,
    fontWeight: 300,
    color: '#202124',
    marginTop: 30,
    marginBottom: 15,
    letterSpacing: 1,
  },
  presentedTo: {
    fontSize: 12,
    color: '#5f6368',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
    fontWeight: 500,
  },
  recipientName: {
    fontSize: 48,
    fontWeight: 700,
    color: '#EA4335',
    marginVertical: 20,
  },
  description: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 1.6,
    marginVertical: 25,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
    marginVertical: 30,
  },
  detailBox: {
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: 10,
    color: '#80868b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: '#202124',
    fontWeight: 500,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 60,
    right: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signature: {
    textAlign: 'left',
  },
  signatureLine: {
    width: 200,
    height: 1,
    backgroundColor: '#dadce0',
    marginBottom: 8,
  },
  signatureName: {
    fontSize: 24,
    fontStyle: 'italic',
    color: '#000',
    marginBottom: 5,
  },
  signatureTitle: {
    fontSize: 11,
    color: '#5f6368',
    lineHeight: 1.5,
  },
  date: {
    textAlign: 'right',
  },
  dateLabel: {
    fontSize: 10,
    color: '#80868b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  dateValue: {
    fontSize: 14,
    color: '#202124',
    fontWeight: 500,
  },
  stamp: {
    position: 'absolute',
    right: -80,
    top: -10,
    width: 90,
    height: 90,
    border: '3px solid rgba(234, 67, 53, 0.7)',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'rotate(-12deg)',
  },
  stampText: {
    fontSize: 11,
    fontWeight: 800,
    color: '#EA4335',
    letterSpacing: 2,
  },
  stampIcon: {
    fontSize: 20,
    color: '#EA4335',
    marginVertical: 3,
  },
});

interface CertificatePDFProps {
  name: string;
  team: string;
  track: string;
  certificateName: string;
}

export const CertificatePDF = ({ name, team, track, certificateName }: CertificatePDFProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.borderTop} />
      <View style={styles.borderBottom} />
      <View style={styles.innerBorder} />

      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={[styles.googleText, styles.g1]}>G</Text>
          <Text style={[styles.googleText, styles.o1]}>o</Text>
          <Text style={[styles.googleText, styles.o2]}>o</Text>
          <Text style={[styles.googleText, styles.g2]}>g</Text>
          <Text style={[styles.googleText, styles.l]}>l</Text>
          <Text style={[styles.googleText, styles.e]}>e</Text>
        </View>
        <Text style={styles.developers}>d e v e l o p e r s</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.certificateTitle}>{certificateName}</Text>
        <Text style={styles.presentedTo}>This is to certify that</Text>
        <Text style={styles.recipientName}>{name}</Text>
        <Text style={styles.description}>
          has successfully participated in the GDG @ Penn State Solution Challenge 2026,
          demonstrating creativity, technical excellence, and commitment to building
          innovative solutions for real-world challenges.
        </Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Team</Text>
            <Text style={styles.detailValue}>{team}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Track</Text>
            <Text style={styles.detailValue}>{track}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>Event</Text>
            <Text style={styles.detailValue}>April 11-12, 2026</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.signature}>
          <View style={styles.stamp}>
            <Text style={styles.stampText}>VERIFIED</Text>
            <Text style={styles.stampIcon}>✓</Text>
            <Text style={[styles.stampText, { fontSize: 8 }]}>GDG PSU</Text>
          </View>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>Tejas</Text>
          <Text style={styles.signatureTitle}>
            President{'\n'}Google Developer Groups @ Penn State
          </Text>
        </View>

        <View style={styles.date}>
          <Text style={styles.dateLabel}>Date Issued</Text>
          <Text style={styles.dateValue}>April 12, 2026</Text>
        </View>
      </View>
    </Page>
  </Document>
);
