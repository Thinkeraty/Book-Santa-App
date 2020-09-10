import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Image,
    Alert,
    Modal,
    ScrollView
} from 'react-native'

import { ListItem } from 'react-native-elements'

import db from '../config';
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'

export default class RecievedBookScreen extends React.Component {
    constructor() {
        super()

        this.state = {
            userId: firebase.auth().currentUser.email,
            recievedBooksList: []
        }
        this.requestRef = null
    }

    getRecievedBooksList = () => {
        this.requestRef = db.collection('Requested_Books').where('user_id', '==', this.state.userId).where('book_status', '==', 'recieved').get()
            .onSnapshot(snapshot => {
                var recievedBooksList = snapshot.docS.map(doc => {
                    doc.data()
                    this.setState({
                        recievedBooksList: recievedBooksList
                    })
                })
            })
    }

    componentDidMount () {
        this.getRecievedBooksList()
    }

    componentWillUnmount() {
        this.requestRef()
    }

    keyExtractor = (item, index) => index.toString()
    renderItem = (item, index) => {
        <ListItem
            key={i}
            title={item.book_name}
            subtitle={item.book_status}
            titleStyle={{color: 'black', fontWeight: 'bold'}}
            bottomDivider
        />
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <MyHeader
                    title="Recieved Books"
                    navigation={this.props.navigation}
                />
                <View style={{flex: 1}}>
                    {this.state.recievedBooksList.length == 0 ? (
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text>List of Recieved Books:</Text>
                        </View>
                    ) : (
                        <View style={{flex: 1}}>
                            <FlatList 
                                keyExtractor = {this.keyExtractor}
                                data = {this.state.recievedBooksList}
                                renderItem = {this.renderItem}
                            />
                        </View>
                    )}
                </View>
            </View>
        )
    }
}