import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, AntDesign, Ionicons    } from '@expo/vector-icons';
import ActivityScreen from './screens/ActivityScreen';
import ThreadsScreen from './screens/ThreadsScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfile from './screens/EditProfile';
import Deneme from './screens/Deneme';
const StackNavigator = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen 
          name='Home' 
          component={HomeScreen} 
            options={{
              tabBarLabel: "", 
              tabBarLabelStyle:{color:"black"}, 
              headerShown: false, 
              tabBarIcon:({focused}) => focused ? (
                <Entypo name="home" size={24} color="black" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              )
            }
          } 
        />
        <Tab.Screen 
          name='Thread' 
          component={ThreadsScreen} 
            options={{
              tabBarLabel: "", 
              tabBarLabelStyle:{color:"black"}, 
              headerShown: false, 
              tabBarIcon:({focused}) => focused ? (
                <Ionicons name="create" size={24} color="black" />
              ) : (
                <Ionicons name="create-outline" size={24} color="black" />
              )
            }
          } 
        />
        <Tab.Screen 
          name='Activity' 
          component={ActivityScreen} 
            options={{
              tabBarLabel: "", 
              tabBarLabelStyle:{color:"black"}, 
              headerShown: false, 
              tabBarIcon:({focused}) => focused ? (
                <AntDesign name="heart" size={24} color="black" />
              ) : (
                <AntDesign name="hearto" size={24} color="black" />
              )
            }
          } 
        />
        <Tab.Screen 
          name='Profile' 
          component={ProfileScreen} 
            options={{
              tabBarLabel: "", 
              tabBarLabelStyle:{color:"black"}, 
              headerShown: false, 
              tabBarIcon:({focused}) => focused ? (
                <Ionicons name="person" size={24} color="black" />
              ) : (
                <Ionicons name="person-outline" size={24} color="black" />
              )
            }
          } 
        />
      </Tab.Navigator>
    )
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
        <Stack.Screen name="Main" component={BottomTabs} options={{headerShown: false}} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown: false}} />
        <Stack.Screen name="Deneme" component={Deneme} options={{headerShown: false}} />

        <Stack.Screen name="ProfileScreen" component={BottomTabs} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNavigator;
