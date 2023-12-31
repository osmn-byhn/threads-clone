import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Users = ({item}) => {
  return (
    <View>
        <View style={{flexDirection: "row", justifyContent: 'space-between'}}>
            <View style={{flexDirection: "row"}}>
                <Image style={{width: 40, height: 40, borderRadius: 20, resizeMode: "contain"}} source={{uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png"}} />
                <Text style={{fontSize: 17, fontWeight: "500", marginLeft: 15,marginTop:10 }}>{item?.fullName}</Text>
            </View>
            <Pressable style={{backgroundColor: "black", borderWidth: 1, padding: 10, marginLeft: 10, width: 100, borderRadius: 7}}>
                <Text style={{color: "white", fontSize: 15, fontWeight: "500", textAlign: "center"}}>Follow</Text>
            </Pressable>
        </View>
    </View>
  )
}

export default Users

const styles = StyleSheet.create({})