import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !message) {
      setError('Please fill in all fields');
      return;
    }
    setShowModal(true);
  };

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <ScrollView style={styles.scrollView}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Contact Us</Text>
          <Text style={styles.subheader}>We'd love to hear from you!</Text>
        </View>

        <View style={styles.contactInfoContainer}>
          <View style={styles.contactItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={24} color="#87CEEB" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>support@bookbuddies.com</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="call-outline" size={24} color="#87CEEB" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+012 345 678</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={24} color="#87CEEB" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>999 Wall Maria, Paradise Island</Text>
            </View>
          </View>
      </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Send us a Message</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
              placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#666"
        />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Email</Text>
        <TextInput
          style={styles.input}
              placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#666"
        />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
              placeholder="Type your message here..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          placeholderTextColor="#666"
        />
          </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity 
            style={styles.submitButton}
          onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Send Message</Text>
            <Ionicons name="send-outline" size={20} color="#fff" style={styles.submitIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={60} color="#87CEEB" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Message Sent!</Text>
            <Text style={styles.modalText}>Thank you for contacting us. We'll get back to you soon.</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setShowModal(false);
                setName('');
                setEmail('');
                setMessage('');
                setError('');
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    marginTop: 60,
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  contactInfoContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    margin: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    margin: 20,
    marginBottom: 120,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#87CEEB',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitIcon: {
    marginLeft: 8,
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 16,
    fontSize: 14,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#87CEEB',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactScreen; 