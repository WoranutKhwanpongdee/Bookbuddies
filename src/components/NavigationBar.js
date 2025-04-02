import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const NavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons 
            name="home" 
            size={24} 
            color={route.name === 'Home' ? '#87CEEB' : '#666'} 
          />
          <Text 
            style={[styles.bottomNavText, route.name === 'Home' && styles.activeText]}
          >
            HOME
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('BookListing')}
        >
          <Ionicons 
            name="compass-outline" 
            size={24} 
            color={route.name === 'BookListing' ? '#87CEEB' : '#666'} 
          />
          <Text 
            style={[styles.bottomNavText, route.name === 'BookListing' && styles.activeText]}
          >
            EXPLORE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons 
            name="person-outline" 
            size={24} 
            color={route.name === 'Profile' ? '#87CEEB' : '#666'} 
          />
          <Text 
            style={[styles.bottomNavText, route.name === 'Profile' && styles.activeText]}
          >
            PROFILE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('Contact')}
        >
          <Ionicons 
            name="help-circle-outline" 
            size={24} 
            color={route.name === 'Contact' ? '#87CEEB' : '#666'} 
          />
          <Text 
            style={[styles.bottomNavText, route.name === 'Contact' && styles.activeText]}
          >
            CONTACT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    width: '80%', // Reduced width
    alignSelf: 'center', // Center the navbar
  },
  bottomNavItem: {
    alignItems: 'center',
  },
  bottomNavText: {
    fontSize: 10,
    marginTop: 8,
    color: '#666',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#87CEEB',
  },
});


export default NavigationBar; 