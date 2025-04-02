import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Surface } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [error, setError] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem(`userProfile_${user.id}`);
      if (profile) {
        const { phone, address } = JSON.parse(profile);
        setPhoneNumber(phone || '');
        setAddress(address || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveUserProfile = async () => {
    try {
      setLoading(true);
      await AsyncStorage.setItem(`userProfile_${user.id}`, JSON.stringify({
        phone: phoneNumber,
        address: address
      }));
      setIsEditingPhone(false);
      setIsEditingAddress(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    const result = await updateProfile(name, profileImage);
    if (result.success) {
      setIsEditing(false);
      setError('');
    } else {
      setError(result.error);
    }
  };

  const menuOptions = [
    { label: "Book Management", icon: "book-outline" },
    { label: "Exchanging History", icon: "swap-horizontal-outline" },
    { label: "Post Book(s) to Sell", icon: "cart-outline" },
    { label: "Verify Account", icon: "pricetag-outline" },
  ];

  return (
    <LinearGradient colors={['#87CEEB', '#FFFFFF']} style={styles.gradientContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>My Profile</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Surface style={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarImage}>
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : { uri: 'https://via.placeholder.com/100' }
                  }
                  style={styles.avatar}
                />
              </View>
              {isEditing && (
                <Button
                  mode="contained"
                  onPress={pickImage}
                  style={styles.changePhotoButton}
                >
                  Change Photo
                </Button>
              )}
            </View>
            <Text style={styles.name}>{name || 'User'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#666"
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={[styles.button, { flex: 1, marginRight: 8 }]}
                  labelStyle={styles.buttonText}
                >
                  Save
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setIsEditing(false);
                    setName(user?.name || '');
                    setProfileImage(user?.profileImage || null);
                    setError('');
                  }}
                  style={[styles.button, { flex: 1, marginLeft: 8 }]}
                  labelStyle={styles.buttonText}
                >
                  Cancel
                </Button>
              </View>
            </>
          ) : (
            <Button
              mode="contained"
              onPress={() => setIsEditing(true)}
              style={styles.button}
              labelStyle={styles.buttonText}
            >
              Edit Profile
            </Button>
          )}

          <View style={styles.infoContainer}>
            <View style={styles.verificationInfo}>
              <View style={styles.verificationIconContainer}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
              </View>
              <View style={styles.verificationContent}>
                <Text style={styles.infoText}>Verification Status</Text>
                <View style={styles.verificationTag}>
                  <View style={styles.verificationDot} />
                  <Text style={styles.verificationTagText}>unverified</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <TouchableOpacity 
                  onPress={() => {
                    if (isEditingPhone) {
                      saveUserProfile();
                    } else {
                      setIsEditingPhone(true);
                    }
                  }}
                  style={styles.editButton}
                >
                  <Ionicons 
                    name={isEditingPhone ? "checkmark-circle" : "pencil"} 
                    size={20} 
                    color="#87CEEB" 
                  />
                </TouchableOpacity>
              </View>
              {isEditingPhone ? (
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor="#666"
                />
              ) : (
                <Text style={styles.infoValue}>{phoneNumber || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoLabel}>Address</Text>
                <TouchableOpacity 
                  onPress={() => {
                    if (isEditingAddress) {
                      saveUserProfile();
                    } else {
                      setIsEditingAddress(true);
                    }
                  }}
                  style={styles.editButton}
                >
                  <Ionicons 
                    name={isEditingAddress ? "checkmark-circle" : "pencil"} 
                    size={20} 
                    color="#87CEEB" 
                  />
                </TouchableOpacity>
              </View>
              {isEditingAddress ? (
                <TextInput
                  style={[styles.input, styles.addressInput]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter address"
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#666"
                />
              ) : (
                <Text style={styles.infoValue}>{address || 'Not set'}</Text>
              )}
            </View>
          </View>

          {menuOptions.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => {
                switch (item.label) {
                  case "Verify Account":
                    navigation.navigate('VerifyAccount');
                    break;
                  case "Book Management":
                    navigation.navigate('BookManagement');
                    break;
                  case "Exchanging History":
                    navigation.navigate('ExchangeHistory');
                    break;
                  case "Post Book(s) to Sell":
                    navigation.navigate('PostBook');
                    break;
                }
              }}
            >
              <Ionicons name={item.icon} size={20} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}

          <Button
            mode="outlined"
            onPress={handleLogout}
            style={[styles.button, styles.logoutButton]}
            labelStyle={[styles.buttonText, { color: 'red' }]}
          >
            Logout
          </Button>
        </Surface>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    paddingBottom: 100,
  },
  headerContainer: {
    padding: 16,
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  header: {
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#87CEEB',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  changePhotoButton: {
    marginTop: 10,
    width: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#87CEEB',
  },
  buttonText: {
    fontSize: 16,
  },
  logoutButton: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  verificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  verificationContent: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  verificationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: 'center',
  },
  verificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffa726',
    marginRight: 8,
  },
  verificationTagText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  verificationDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  editButton: {
    padding: 4,
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen; 