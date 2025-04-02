import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showTooltip, setShowTooltip] = useState(null);
  const { signup } = useAuth();
  const navigation = useNavigation();

  const tooltips = {
    name: "Enter your full name as it appears on your official documents",
    email: "Use a valid email address that you have access to",
    password: "Password must be at least 8 characters long and include numbers and letters",
    confirmPassword: "Re-enter your password to confirm it matches"
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await signup(name, email, password);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Create Account</Text>
          <Text style={styles.subheader}>Join BookBuddies today</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TouchableOpacity 
                onPress={() => setShowTooltip(showTooltip === 'name' ? null : 'name')}
                style={styles.helpIcon}
              >
                <Ionicons name="help-circle-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            {showTooltip === 'name' && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>{tooltips.name}</Text>
              </View>
            )}
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Email</Text>
              <TouchableOpacity 
                onPress={() => setShowTooltip(showTooltip === 'email' ? null : 'email')}
                style={styles.helpIcon}
              >
                <Ionicons name="help-circle-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            {showTooltip === 'email' && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>{tooltips.email}</Text>
              </View>
            )}
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity 
                onPress={() => setShowTooltip(showTooltip === 'password' ? null : 'password')}
                style={styles.helpIcon}
              >
                <Ionicons name="help-circle-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            {showTooltip === 'password' && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>{tooltips.password}</Text>
              </View>
            )}
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TouchableOpacity 
                onPress={() => setShowTooltip(showTooltip === 'confirmPassword' ? null : 'confirmPassword')}
                style={styles.helpIcon}
              >
                <Ionicons name="help-circle-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            {showTooltip === 'confirmPassword' && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>{tooltips.confirmPassword}</Text>
              </View>
            )}
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity 
            style={styles.signupButton}
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 40,
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
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  helpIcon: {
    marginLeft: 8,
  },
  tooltip: {
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tooltipText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#87CEEB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#87CEEB',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupScreen; 