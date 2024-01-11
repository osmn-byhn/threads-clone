import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, Share } from 'react-native'
import React, { useState, useEffect, useContext, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, MaterialCommunityIcons , Feather } from '@expo/vector-icons';
import axios from "axios";
import { UserType } from "../UserContext";
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [softId, setSoftId] = useState("")
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setUserId(token);
      const response = await axios.get(`https://threads-backend-c6ms.onrender.com/decode/${userId}`)
      setSoftId(response.data)
      console.log("softId: ", softId);
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    fetchPost();
  },[])
  useFocusEffect(
    useCallback(() => {
      fetchPost();
    }, [])
  )
  const fetchPost = async() => {
    try {
      const response = await axios.get("https://threads-backend-c6ms.onrender.com/get-posts/")
      setPosts(response.data)
    } catch (error) {
      console.log("error fetching posts: ", error);
    }
  }
  console.log("posts: ", posts);
  const handleLike = async(postId) => {
    try {
      const response = await axios.put(`https://threads-backend-c6ms.onrender.com/posts/${postId}/${userId}/like`);
      const updatedPost = response.data;
      const updatedPosts = posts?.map((post) => post?._id === updatedPost._id ? updatedPost : post);
      setPosts(updatedPosts)
    } catch (error) {
      console.log("Error liking the post: ", error);
    }
  }

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `https://threads-backend-c6ms.onrender.com/posts/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      // Update the posts array with the updated post
      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      console.log("updated ",updatedPosts)
    
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'link',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "white"}}>
      <View style={{alignItems: "center", marginTop: 20}}>
        <Image style={{width: 60, height:40, resizeMode: "contain"}} source={{uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png"}} />
      </View>
      <View style={{marginTop: 20}}>
        {posts?.map((post,index) => (
          <View style={{padding: 15,  borderColor: "#d0d0d0", borderTopWidth: 1, }} key={index}>
            <View style={{flexDirection: "row", gap: 10}}>
              <View style={{flexDirection: "row"}}>
                <Image style={{width: 40, height: 40, borderRadius: 20, resizeMode: "contain"}} source={{uri: post?.user?.profilePicture}} />
              </View>
              <View>
                <Text style={{fontWeight: "700", fontSize: 16}}>{post?.user?.fullName}</Text>
                <Text>{post?.content}</Text>
              </View>
            </View>
            <View style={{flexDirection: "row", gap: 10, marginTop: 15}}>
              {post?.likes?.includes(softId) ?  (
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
              <MaterialCommunityIcons name="comment-outline" size={22} color="black" />
              <TouchableOpacity  onPress={onShare}>
                <Feather name="share" size={22} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={{ marginTop: 7, color: "gray" }}>
              {post?.likes?.length} likes • {post?.replies?.length} reply
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
export default HomeScreen

const styles = StyleSheet.create({})