import { Image, ScrollView, StyleSheet, Text, Touchable, View, TouchableOpacity, Alert, Share, Button , Dimensions, Pressable  } from 'react-native'
import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { UserType } from "../UserContext";
import { AntDesign, MaterialCommunityIcons , Feather, Entypo } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import Modal from "react-native-modal";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Push from '../components/Push';
const ProfileScreen = ({navigation}) => {
  const { userId, setUserId } = useContext(UserType);
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [softId, setSoftId] = useState("")
  const [isModalVisible, setModalVisible] = useState(false);
  const { width, height } = Dimensions.get('window');
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    
  };
  useEffect(()=> {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setUserId(token);
      const response = await axios.get(`https://threads-backend-c6ms.onrender.com/decode/${userId}`)
      setSoftId(response.data)
      console.log("softId: ", softId);
    };
    fetchUsers();
  }, []);
  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      setUserId(token);
      const response = await axios.get(`https://threads-backend-c6ms.onrender.com/profile/${token}`);
      const posts = await axios.get(`https://threads-backend-c6ms.onrender.com/posts/${token}`)
      const userData = response.data;
      setPosts(posts.data)
      console.log("user: ", userData);
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
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const logOut = async () => {
    AsyncStorage.clear();
    console.log(await AsyncStorage.getItem("authToken"));
    navigation.navigate('Login');
  };
  return (
    <ScrollView style={{backgroundColor: "white"}}>
      <View style={{marginTop: 40, padding: 10, flexDirection: "row", justifyContent: "space-between", }}>
        <View style={{flexDirection: "row", gap: 10}}>
          <Image style={{width: 40, height: 40, borderRadius: 20, resizeMode: "contain"}} source={{uri: user?.profilePicture}} />
          <Text style={{marginTop: 10, fontSize: 16, fontWeight: "bold"}}>{user?.fullName}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={toggleModal}>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </TouchableOpacity>
          <Modal isVisible={isModalVisible}>
            <View style={{ flex: 1, width: width, height: height /3, position: 'absolute', bottom: -20, left: -20, backgroundColor: "white",   borderTopLeftRadius: 25, borderTopRightRadius: 25}}>
              <View style={{marginVertical: 20, flexDirection: "row", justifyContent: 'space-between', borderBottomWidth: .5}}>
                <Text style={{ fontSize: 17, fontWeight: "bold", padding: 10}}>Settings</Text>
                <AntDesign name="closecircleo" size={24} color="red"  style={{padding: 10}} onPress={toggleModal}/>
              </View>
              <View>
              <Pressable onPress={() => navigation.navigate('EditProfile')}>
                  <Text style={{fontSize: 16, fontWeight: "900", color: "#1877f2", padding: 10}}>Edit Profile</Text>
                </Pressable>
                <Pressable onPress={logOut}>
                  <Text style={{fontSize: 16, fontWeight: "900", color: "red", padding: 10}}>Logout</Text>
                </Pressable>
                
              </View>
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
                <AntDesign onPress={() => handleDislike(post?._id)} name="heart" size={22} color="red" />
                ) : (
                <AntDesign onPress={() => handleLike(post?._id)} name="hearto" size={22} color="black" />
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
      <Push />
    </ScrollView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})