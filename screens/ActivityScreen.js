import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { UserType } from "../UserContext";
import Users from '../components/Users';

const ActivityScreen = () => {
    const [selectedButton, setSelctedButton] = useState("people");
    const [content, setContent] = useState("People Content");
    const [users, setUsers] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const handleButtonClick = (buttonName) => {
      setSelctedButton(buttonName);
    };
    useEffect(() => {
      const fetchUsers = async () => {
        const token = await AsyncStorage.getItem("authToken");
        setUserId(token);
        axios
          .get(`http://192.168.1.39:4000/user/${userId}`)
          .then((response) => {
            setUsers(response.data);
          })
          .catch((error) => {
            console.log("error: ", error);
          });
      };
  
      fetchUsers();
    }, []);
    console.log("users:", users);
    return (
        <ScrollView style={{ marginTop: 20 }}>
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Activity</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 15, marginTop: 12 }}>
                    <TouchableOpacity
                        onPress={() => handleButtonClick("people")}
                        style={[
                            {
                                flex: 1,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                backgroundColor: "white",
                                borderColor: "#d0d0d0",
                                borderRadius: 6,
                                borderWidth: 0.7
                            },
                            selectedButton === "people" ? { backgroundColor: "black" } : null,
                        ]}>
                        <Text style={[
                            { textAlign: "center", fontWeight: "bold" }, selectedButton === "people" ? { color: "white" } : { color: "black" }
                        ]}>People</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleButtonClick("all")}
                        style={[
                            {
                                flex: 1,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                backgroundColor: "white",
                                borderColor: "#d0d0d0",
                                borderRadius: 6,
                                borderWidth: 0.7
                            },
                            selectedButton === "all" ? { backgroundColor: "black" } : null,
                        ]}>
                        <Text style={[
                            { textAlign: "center", fontWeight: "bold" }, selectedButton === "all" ? { color: "white" } : { color: "black" }
                        ]}>All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleButtonClick("requests")}
                        style={[
                            {
                                flex: 1,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                backgroundColor: "white",
                                borderColor: "#d0d0d0",
                                borderRadius: 6,
                                borderWidth: 0.7
                            },
                            selectedButton === "requests" ? { backgroundColor: "black" } : null,
                        ]}>
                        <Text style={[
                            { textAlign: "center", fontWeight: "bold" }, selectedButton === "requests" ? { color: "white" } : { color: "black" }
                        ]}>Requests</Text>
                    </TouchableOpacity>
                </View>


                <View>
                    {selectedButton ==="people" && (
                        <View style={{marginTop: 20}}>
                            {users?.map((item, index) => (
                                <Users key={index} item={item} />
                            ))}
                        </View>
                    )}
                </View>
            </View>

        </ScrollView>
    )
}

export default ActivityScreen

const styles = StyleSheet.create({})