import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Surface } from 'react-native-paper';

const VerifyAccountScreen = ({ navigation }) => {
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [document, setDocument] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    address: '',
    phoneNumber: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentUpload = () => {
    Alert.alert(
      'Document Upload',
      'Please select a valid ID document (Passport, Driver\'s License, or National ID)',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Upload',
          onPress: () => {
            setDocument({ name: 'sample_document.jpg' });
          },
        },
      ]
    );
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.idNumber || !formData.address || !formData.phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!document) {
      Alert.alert('Error', 'Please upload a valid ID document');
      return;
    }

    Alert.alert(
      'Verification Submitted',
      'Your account verification request has been submitted. We will review your documents and update your status soon.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Your Account</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Surface style={styles.content}>
          <Text style={styles.sectionTitle}>Verification Requirements</Text>
          <View style={styles.requirementsList}>
            <Text style={styles.requirementItem}>• Valid government-issued ID</Text>
            <Text style={styles.requirementItem}>• Current address proof</Text>
            <Text style={styles.requirementItem}>• Active phone number</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>ID Number</Text>
            <TextInput
              style={styles.input}
              value={formData.idNumber}
              onChangeText={(value) => handleInputChange('idNumber', value)}
              placeholder="Enter your ID number"
              keyboardType="numeric"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="Enter your current address"
              multiline
              numberOfLines={3}
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#666"
            />

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleDocumentUpload}
            >
              <Ionicons name="cloud-upload" size={24} color="#007AFF" />
              <Text style={styles.uploadButtonText}>
                {document ? 'Change Document' : 'Upload ID Document'}
              </Text>
            </TouchableOpacity>

            {document && (
              <View style={styles.documentPreview}>
                <Text style={styles.documentName}>{document.name}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Verification</Text>
            </TouchableOpacity>
          </View>
        </Surface>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 70,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    margin: 16,
    borderRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  requirementsList: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  requirementItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  uploadButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 8,
  },
  documentPreview: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  documentName: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#87CEEB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyAccountScreen; 