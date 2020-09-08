import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity, ImageBackground, PlatForm } from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import { Avatar } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from  'expo-permissions'

import db from '../config'
import firebase from 'firebase';

import { RFValue } from 'react-native-responsive-fontsize'

export default class CustomSideBarMenu extends Component{
  constructor() {
    super()

    this.state = { 
      userId: firebase.auth().currentUser.email,
      image: '#',
      name: '',
      docId: ''
    }
  }

  getUserProfile = () => {
    db.collection('Users').where('user_email', '==', this.state.userId).onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        this.setState({ name: doc.data().first_name + ' ' + doc.data().last_name })
      })
    })
  }

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageName)
      
      storageRef.getDownloadURL()
        .then(url => {
          this.setState({ image: url })
        })
        .catch(err => {
          this.setState({ image: '#' })
        })
  }

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri)
    var blob = await response.blob()
    var ref = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageName)
      return ref.put(blob)
        .then(response => {
          this.fetchImage(imageName)
        })
  }

  selectPicture = async () => {
    const { cancel, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1
    })
    if(!cancel) {
      this.uploadImage(uri, this.state.userId)
    }
  }

  componentDidMount() {
    this.fetchImage(this.state.userId)
    this.getUserProfile()
  }

  render(){
    return(
      <View style={{flex:1}}>
        <View style={{flex: 0.5, alignItems:'center', backgroundColor:'#fff'}}> 
          <Avatar 
            rounded
            source={{uri: this.state.image}}
            size="large"
            onPress={() => {
              this.selectPicture()
            }}
            containerStyle={styles.imgContainer}
            showEditButton
          />
          <Text style={{fontSize: 20, fontWeight:'bold', paddingTop: 10, color: '#000' }}>{this.state.name}</Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text style={{fontSize: RFValue(15), fontWeight: 'bold', marginLeft: RFValue(30) }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: 30,
    alignItems: 'center'
  },
  logOutButton : {
    height: 50, 
        width: 200, 
        borderWidth: 2, 
        marginTop: 20, 
        paddingTop: 5, 
        borderRadius: 15,
        backgroundColor: 'orange',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.3,
        shadowRadius: 10.32,
        elevation: 16
  },
  logOutText:{
    color: 'white',
    fontWeight: '200',
    fontSize: 20,
    marginLeft: 70,
    marginTop: 5
  },
  imgContainer: {
    marginTop: 50
  }
})
