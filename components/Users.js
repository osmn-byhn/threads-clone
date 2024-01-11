import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect, useContext } from "react";
import { UserType } from "../UserContext";

const Users = ({item}) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false)
  const sendFollow = async (currentUserId, selectedUserId) => {
    try {
        const response = await fetch(`http://192.168.1.39:4000/follow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({currentUserId, selectedUserId})
        })
        console.log(currentUserId);
        if (response.ok) {
            setRequestSent(true)
        }
    } catch (error) {
        console.log("error message: ",error);
    }
  }
  const handleUnfollow = async (targetId) => {
    try {
        const response = await fetch(`http://192.168.1.39:4000/users/unfollow`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                loggedInUserId: userId,
                targetUserId: targetId
            })
        })
        if (response.ok) {
            setRequestSent(false);
            console.log("unfollowed successfully");
        }
    } catch (error) {
        console.log("Error: ", error);
        ;
    }
  }
  return (
    <View>
        <View style={{flexDirection: "row", justifyContent: 'space-between', marginBottom: 10}}>
            <View style={{flexDirection: "row"}}>
                <Image style={{width: 40, height: 40, borderRadius: 20, resizeMode: "contain"}} source={{uri: item?.profilePicture}} />
                <Text style={{fontSize: 17, fontWeight: "500", marginLeft: 15,marginTop:10 }}>{item?.fullName}</Text>
            </View>
            {requestSent || item?.followers?.includes(userId) ? (
                <Pressable onPress={() => handleUnfollow(item._id)} style={{backgroundColor: "black", borderWidth: 1, padding: 10, marginLeft: 10, width: 100, borderRadius: 7}}>
                    <Text style={{color: "white", fontSize: 15, fontWeight: "500", textAlign: "center"}}>Following</Text>
                </Pressable>
            ) : (
                <Pressable onPress={() => sendFollow(userId, item._id)} style={{backgroundColor: "black", borderWidth: 1, padding: 10, marginLeft: 10, width: 100, borderRadius: 7}}>
                    <Text style={{color: "white", fontSize: 15, fontWeight: "500", textAlign: "center"}}>Follow</Text>
                </Pressable>
            )}
            
        </View>
    </View>
  )
}

export default Users

const styles = StyleSheet.create({})