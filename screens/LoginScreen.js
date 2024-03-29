import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView,TextInput, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";




const LoginScreen = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigation = useNavigation()
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setTimeout(() => {
            navigation.replace("Main")
          }, 400);
        }
        
      } catch (error) {
        console.log(error);
      }
    };
    checkLoginStatus()
  }, [])
  const handleLogin = async () => {
    const user = {
      email: email,
      password: password
    };
    try {
      const response = await axios.post("https://threads-backend-c6ms.onrender.com/login", user);
      console.log(response);
      const token = response.data.token;
      AsyncStorage.setItem("authToken", token)
      navigation.navigate("Main")
    } catch (error) {
      Alert.alert("Login failed");
      console.log("error: ", error);
    }
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ marginTop: 70 }}>
        <Image
          style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://media1.giphy.com/media/lSIsAbuVAs6yKnJoKX/200w.gif?cid=6c09b952j3hoqfvo0p8k7kzev8acw2a2gh3ulph2e7eb9s4k&ep=v1_gifs_search&rid=200w.gif&ct=g",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{alignItems: "center", justifyContent: "center"}}>
            <Text style={{fontSize: 17, fontWeight: "bold", marginTop: 25}}>Login to your Account</Text>
        </View>
        <View style={{marginTop: 40}}>
          <View style={{width: 350, flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5}}>
          <Ionicons name="person" size={24} color="gray"  style={{marginLeft:15}} />
            <TextInput value={email} onChangeText={(text) => setEmail(text)} style={{width:300, color: "gray", marginVertical: 10}} placeholder='enter your email'/>
          </View>

          <View style={{marginTop: 20,width: 350, flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5}}>
            <MaterialIcons name="vpn-key" size={24} color="gray" style={{marginLeft:15}} />
            <TextInput secureTextEntry={true} value={password} onChangeText={(text) => setPassword(text)} style={{width:300, color: "gray", marginVertical: 10}} placeholder='enter your password'/>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: "space-between", marginVertical: 12, textAlign: "center"}}>
          <Text>Keep me logged in</Text>
          <Text style={{fontWeight: "500", color: "#007FFF"}}>Forgot Password</Text>
        </View>

        <View>
          <Pressable onPress={handleLogin} style={{ backgroundColor: "black", marginVertical: 10, borderRadius: 10}}>
            <Text style={{color: "white", textAlign: "center", paddingVertical:20}}>Login</Text>
          </Pressable>
        </View>

        <View>
          <Pressable style={{ marginVertical: 10}}>
            <Text style={{color: "black", textAlign: "center", paddingVertical:10, fontSize: 16}}>Don't have an account? <Text onPress={()=> navigation.navigate('Register')} style={{fontWeight: "500", color: "#007FFF"}}>Sign up</Text></Text>
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})