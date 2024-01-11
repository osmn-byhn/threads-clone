import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions, TextInput, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const EditProfile = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [biography, setBiography] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  const [selectedImage, setSelectedImage] = useState('');
  const [base64Value, setBase64Value] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setUserId(token);
        console.log(userId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://threads-backend-c6ms.onrender.com/profile/${userId}`);
        const userData = response.data;
        setUsername(userData.username);
        setFullname(userData.fullName);
        setBiography(userData.biography);
        setPassword(userData.password);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const cancelPage = () => {
    setUsername(user.username);
    setFullname(user.fullName);
    setBiography(user.biography);
    setPassword(user.password);
    setSelectedImage(user.profilePicture);
    navigation.navigate('ProfileScreen');
  };


  function convertToBase64(file){
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result)
    };
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
  
      if (!result.cancelled) {
        setSelectedImage(result.uri);
          const base64 = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setBase64Value("data:image/jpeg;base64,"+base64);
        console.log(base64Value);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  
  const editUser = async () => {
    const editedUser = {
      fullName: fullname,
      username: username,
      password: password,
      biography: biography,
      profilePicture: base64Value,
    };
  
    try {
      const response = await axios.put(`https://threads-backend-c6ms.onrender.com/edit-profile/${userId}`, editedUser);
      console.log(response);
      Alert.alert('Editing successful. You have edited your account successfully');
    } catch (error) {
      console.log('Axios Error Details:', error.response || error.request || error.message);
      Alert.alert('Editing failed. An error occurred during editing');
    }
  };

  return (
    <ScrollView>
      <View style={{ marginVertical: 35, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Pressable onPress={cancelPage}>
          <Text style={{ color: 'red', fontSize: 15, fontWeight: 'bold', padding: 15 }}>Cancel</Text>
        </Pressable>
        <Pressable onPress={editUser}>
          <Text style={{ color: '#1877f2', fontSize: 15, fontWeight: 'bold', padding: 15 }}>Done</Text>
        </Pressable>
      </View>
      <View>
        <Image
          style={{ width: 90, height: 90, resizeMode: 'contain', borderRadius: 50, marginLeft: Dimensions.get('window').width / 2.6 }}
          source={{ uri: selectedImage ? selectedImage : user?.profilePicture }}
        />
        <Pressable onPress={pickImage}>
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 50,
              backgroundColor: 'gray',
              opacity: 0.5,
              marginTop: -90,
              textAlign: 'center',
              marginLeft: Dimensions.get('window').width / 2.6,
            }}
          >
            <FontAwesome name="camera" size={24} color="black" style={{ opacity: 1, flex: 1, justifyContent: 'center', textAlign: 'center', marginTop: 31 }} />
          </View>
        </Pressable>
      </View>
      <View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', padding: '5%', paddingBottom: '2%' }}>Username</Text>
          <TextInput
            value={username}
            onChangeText={(text) => setUsername(text)}
            style={{ borderWidth: 0.5, padding: 10, width: '90%', marginLeft: '5%', borderRadius: 5 }}
          />
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', padding: '5%', paddingBottom: '2%' }}>Fullname</Text>
          <TextInput
            value={fullname}
            onChangeText={(text) => setFullname(text)}
            placeholder={user?.fullName}
            style={{ borderWidth: 0.5, padding: 10, width: '90%', marginLeft: '5%', borderRadius: 5 }}
          />
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', padding: '5%', paddingBottom: '2%' }}>Biography</Text>
          <TextInput
            value={biography}
            onChangeText={(text) => setBiography(text)}
            style={{ borderWidth: 0.5, padding: 10, width: '90%', marginLeft: '5%', borderRadius: 5 }}
          />
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', padding: '5%', paddingBottom: '2%' }}>Password</Text>
          <TextInput
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder={user?.password}
            style={{ borderWidth: 0.5, padding: 10, width: '90%', marginLeft: '5%', borderRadius: 5 }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
