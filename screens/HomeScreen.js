import "react-native-gesture-handler";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, Share, Touchable, Button, Pressable, Switch, useWindowDimensions, TextInput } from 'react-native'
import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, MaterialCommunityIcons, Feather, Entypo } from '@expo/vector-icons';
import axios from "axios";
import { UserType } from "../UserContext";
import { useFocusEffect } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from "expo-status-bar";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const HomeScreen = ({ navigation }) => {
  const [darkmode, setDarkmode] = useState(false);
  const [device, setDevice] = useState(false);
  const { width } = useWindowDimensions();
  const [theme, setTheme] = useState("dim");
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["25%", "48%", "75%"];
  const [replies, setReplies] = useState([])
  const { userId, setUserId } = useContext(UserType);
  const [softId, setSoftId] = useState("")
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        setUserId(token);
        const response = await axios.get(`https://threads-backend-c6ms.onrender.com/decode/${token}`);
        setSoftId(response.data);
      } catch (error) {
        console.log("Error fetching user data: ", error);
      }
    };

    fetchData();
    fetchPost(); // İlk render'da postları da çekelim.
  }, [userId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get("https://threads-backend-c6ms.onrender.com/get-posts/");
      setPosts(response.data);
    } catch (error) {
      console.log("Error fetching posts: ", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(`https://threads-backend-c6ms.onrender.com/posts/${postId}/${userId}/like`);
      const updatedPost = response.data;
      const updatedPosts = posts?.map((post) => (post?._id === updatedPost._id ? updatedPost : post));
      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error liking the post: ", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `https://threads-backend-c6ms.onrender.com/posts/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      const updatedPosts = posts.map((post) => (post._id === updatedPost._id ? updatedPost : post));
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "link",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const getReplies = async (postId) => {
    try {
      const response = await axios.get(`https://threads-backend-c6ms.onrender.com/get-replies/${postId}`);
      setReplies(response.data);
      handlePresentModal();
      console.log("response: ", response.data);
    } catch (error) {
      console.log("Error fetching replies: ", error);
    }
  };
  

  const handlePresentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setIsOpen(true);
  }, []);

  const handleCommentPress = (postId) => {
    getReplies(postId);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ScrollView  style={{ backgroundColor: isOpen ? "gray" : "white" }}>
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Image style={{ width: 60, height: 40, resizeMode: "contain" }} source={{ uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png" }} />
          </View>
          <View style={{ marginTop: 20 }}>
            {posts?.map((post, index) => (
              <View style={{ padding: 15, borderColor: "#d0d0d0", borderTopWidth: 1, }} key={index}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image style={{ width: 40, height: 40, borderRadius: 20, resizeMode: "contain" }} source={{ uri: post?.user?.profilePicture }} />
                  </View>
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>{post?.user?.fullName}</Text>
                    <Text>{post?.content}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 15 }}>
                  {post?.likes?.includes(softId) ? (
                    <AntDesign
                      onPress={() => handleDislike(post?._id)}
                      name="heart"
                      size={22}
                      color="red"
                    />
                  ) : (
                    <AntDesign
                      onPress={() => handleLike(post?._id)}
                      name="hearto"
                      size={22}
                      color="black"
                    />
                  )}
                  <TouchableOpacity onPress={() => handleCommentPress(post?._id)} >
                    <MaterialCommunityIcons name="comment-outline" size={22} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onShare}>
                    <Feather name="share" size={22} color="black" />
                  </TouchableOpacity>
                </View>
                <Text style={{ marginTop: 7, color: "gray" }}>
                  {post?.likes?.length} likes • {post?.replies?.length} reply
                </Text>
              </View>
            ))}
          </View>
          <BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={snapPoints} backgroundStyle={{ borderRadius: 30 }} onDismiss={() => setIsOpen(false)} >
          <ScrollView style={{padding: 15}}>
            <View style={{borderBottomWidth: 0.5, flexDirection: "row", justifyContent: "space-between"}}>
              <TextInput placeholder="Entry a comment" style={{padding: 10}} />
              <MaterialCommunityIcons name="send-circle" size={30} color="black" style={{padding: 10}}/>
            </View>
            <View style={{marginTop: 15}}>
              {replies.length === 0 ? (
                <Text style={{fontSize: 15, fontWeight: "500"}}>There are no comments. Do the first to comment</Text>
              ) : (
                replies.map((reply, index) => (
                  <View key={index}>
                    <Text>{reply.content}</Text>
                    <Text>{reply.content}</Text>
                    
                  </View>
                ))
              )}
            </View>
          </ScrollView>
          </BottomSheetModal>
        </ScrollView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
export default HomeScreen

const styles = StyleSheet.create({})