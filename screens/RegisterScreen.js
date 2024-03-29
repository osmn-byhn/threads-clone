import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView,TextInput, Pressable, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, Ionicons, AntDesign  } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const LoginScreen = () => {
  const [fullname, setFullname] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigation = useNavigation()
  const handleRegister = async () => {
    const user = {
      fullName: fullname,
      username: username,
      email: email,
      password: password
    };
  
    try {
      const response = await axios.post("https://threads-backend-c6ms.onrender.com/register", user);
      console.log(response);
      Alert.alert("Registration successful. You have been registered successfully");
      setFullname("");
      setEmail("");
      setUsername("")
      setPassword("");
    } catch (error) {
      Alert.alert("Registration failed. An error occurred during registration");
      console.log("error: ", error);
    }
  };
  
  return (
    <ScrollView>
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

      <KeyboardAvoidingView behavior="padding">
        <View style={{alignItems: "center", justifyContent: "center"}}>
            <Text style={{fontSize: 17, fontWeight: "bold", marginTop: 25}}>Register to your Account</Text>
        </View>
        <View style={{marginTop: 40}}>

          <View style={{width: 350, flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5}}>
            <Ionicons name="person" size={24} color="gray"  style={{marginLeft:15}} />
            <TextInput value={fullname} onChangeText={(text) => setFullname(text)} style={{width:300, color: "gray", marginVertical: 10}} placeholder='enter your fullname'/>
          </View>
          <View style={{width: 350, flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5, marginTop: 20}}>
            <AntDesign name="idcard" size={24} color="gray"  style={{marginLeft:15}} />
            <TextInput value={username} onChangeText={(text) => setUsername(text)} style={{width:300, color: "gray", marginVertical: 10}} placeholder='enter your username'/>
          </View>
          <View style={{width: 350, flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5,marginTop: 20}}>
            <MaterialIcons name="email" size={24} color="gray"  style={{marginLeft:15}} />
            <TextInput value={email} onChangeText={(text) => setEmail(text)} style={{width:300, color: "gray", marginVertical: 10}} placeholder='enter your email'/>
          </View>

          <View style={{marginTop: 20,width: 350, flexDirection: "row", alignItems: "center", gap: 5, borderColor: "#d0d0d0", borderWidth: 1, paddingVertical:5, borderRadius:5}}>
            <MaterialIcons name="vpn-key" size={24} color="gray" style={{marginLeft:15}} />
            <TextInput secureTextEntry={true} value={password} onChangeText={(text) => setPassword(text)} style={{width:300, color: "gray", marginVertical: 10}} placeholder='enter your password'/>
          </View>
        </View>

        <View>
          <Pressable onPress={handleRegister} style={{ backgroundColor: "black", marginTop: 30, borderRadius: 10}}>
            <Text style={{color: "white", textAlign: "center", paddingVertical:20}}>Register</Text>
          </Pressable>
        </View>

        <View>
          <Pressable style={{ marginVertical: 10}}>
            <Text style={{color: "black", textAlign: "center", paddingVertical:10, fontSize: 16}}>Do you have an account? <Text onPress={()=> navigation.navigate('Login')} style={{fontWeight: "500", color: "#007FFF"}}>Login</Text></Text>
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
    </ScrollView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})