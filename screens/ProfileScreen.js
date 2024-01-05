import { Image, ScrollView, StyleSheet, Text, Touchable, View, TouchableOpacity, Alert, Share, Button  } from 'react-native'
import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { UserType } from "../UserContext";
import { AntDesign, MaterialCommunityIcons , Feather, Entypo } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import Modal from "react-native-modal";

const ProfileScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [softId, setSoftId] = useState("")
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setUserId(token);
      const response = await axios.get(`http://192.168.136.159:4000/decode/${userId}`)
      setSoftId(response.data)
      console.log("softId: ", softId);
    };
    fetchUsers();
  }, []);

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      setUserId(token);

      const response = await axios.get(`http://192.168.136.159:4000/profile/${token}`);
      const posts = await axios.get(`http://192.168.136.159:4000/posts/${token}`)
      const userData = response.data;
      setPosts(posts.data)
      console.log("user: ", userData.data);
      console.log("post: ", posts.data);
      setUser(userData);
    } catch (error) {
      console.error("Error while getting user:", error);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const handleLike = async(postId) => {
    try {
      const response = await axios.put(`http://192.168.136.159:4000/posts/${postId}/${userId}/like`);
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
        `http://192.168.136.159:4000/posts/${postId}/${userId}/unlike`
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
    <ScrollView style={{backgroundColor: "white"}}>
      <View style={{marginTop: 40, padding: 10, flexDirection: "row", justifyContent: "space-between", }}>
        <View style={{flexDirection: "row", gap: 10}}>
          <Image style={{width: 40, height: 40, borderRadius: 20, resizeMode: "contain"}} source={{uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png"}} />
          <Text style={{marginTop: 10, fontSize: 16, fontWeight: "bold"}}>{user?.fullName}</Text>
        </View>
        <View>
          
            <TouchableOpacity onPress={toggleModal}>
              <Entypo name="dots-three-vertical" size={24} color="black" />
            </TouchableOpacity>

            <Modal isVisible={isModalVisible}>
              <View style={{ flex: .25 , backgroundColor: "white", width: "111%", marginLeft: -20, marginBottom: "-150%", borderTopLeftRadius: 25, borderTopRightRadius: 25}}>
                <Text>Hello!</Text>

                <Button title="Hide modal" onPress={toggleModal} />
              </View>
            </Modal>
        </View>
      </View>
      <View  style={{ flexDirection:"row", justifyContent: "space-around", marginTop: 15, }}>
        <View>
          <Text style={{fontSize: 17, fontWeight: "700", textAlign: "center"}}>Followers</Text>
          <Text style={{fontSize: 15, textAlign: "center"}}>{user?.followers?.length}</Text>
        </View>
        <View>
          <Text style={{fontSize: 15, fontWeight: "700", textAlign: "center"}}>Following</Text>
          <Text style={{fontSize: 17, textAlign: "center"}}>{user?.receviedFollowRequest?.length}</Text>
        </View>
      </View>
      <View style={{marginTop: 30, borderBottomWidth: 0.5}}>
      {posts?.map((post,index) => (
          <View style={{padding: 15,  borderColor: "#d0d0d0", borderTopWidth: 1, }} key={index}>
            <View style={{flexDirection: "row", gap: 10}}>
              <View style={{flexDirection: "row"}}>
                <Image style={{width: 40, height: 40, borderRadius: 20, resizeMode: "contain"}} source={{uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png"}} />
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

export default ProfileScreen

const styles = StyleSheet.create({})