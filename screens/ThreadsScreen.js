import { Image, SafeAreaView, StyleSheet, Text, TextInput, View, Button } from 'react-native'
import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { UserType } from "../UserContext";


const ThreadsScreen = () => {
  const [content, setContent] = useState("");
  const { userId, setUserId } = useContext(UserType);

  const handlePostSubmit = () => {
    const postData = {
      userId,
    }
    if (content) {
      postData.content = content
    }

    axios.post(`https://threads-backend-c6ms.onrender.com/create-post/`,postData).then((response) => {
      console.log(response);
      setContent("")
    }).catch((error) => {
      console.log("error: ", error);
    })
  }
  return (
    <SafeAreaView style={{ padding: 10, marginTop: 20}}>
      <View style={{flexDirection: "row", alignItems: "center", gap: 10, padding: 10}}>
        <Image style={{width: 40, height: 40, borderRadius: 20, resizeMode: "contain"}} source={{uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png"}} />
        <Text style={{fontSize: 16, fontWeight: "bold"}}>Create Post</Text>
      </View>
      <View style={{flexDirection: "row", marginLeft: 10, marginTop: 12}}>
        <TextInput value={content} onChangeText={(text) => setContent(text)} placeholder='Type your message...' multiline />
      </View>
      <View style={{marginTop: 20, flexDirection: "row"}}>
        <Button onPress={handlePostSubmit} title="Share Post" />
      </View>
      
    </SafeAreaView>
    
  )
}

export default ThreadsScreen

const styles = StyleSheet.create({})