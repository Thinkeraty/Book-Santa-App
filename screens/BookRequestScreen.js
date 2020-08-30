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

import db from '../config';
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'

export default class BookRequest extends React.Component {
    constructor() {
        super()

        this.state = {
            userId: firebase.auth().currentUser.email,
            bookName: '',
            reasonToRequest: '',
            requestId: '',
            requestedBookName: '',
            docId: '',
            bookStatus: '',
            bookRequestStatus: ''
        }
    }

    getBookRequest = () => {
        var bookRequest = db.collection('Requested_Books').where('user_id', '==', this.state.userId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    if(doc.data().book_status !== "recieved") {
                        this.setState({
                            requestId: doc.data().request_id,
                            requestedBookName: doc.data().book_name,
                            bookStatus: doc.data().book_status,
                            docId: doc.id
                        })
                    }
                })
            })
    }

    getIsBookRequestActive = () => {
        db.collection('Users').where('email_id', '==', this,state.userId).get()
            .onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({
                        bookRequestStatus: doc.data().isBookRequestActive,
                        docId: doc.id
                    })
                })
            })
    }

    createUniqueId() {
        return Math.random().toString(36).substring(7)
    }

    addRequest = async (bookName,reasonToRequest)=>{
        var userId = this.state.userId
        var randomRequestId = this.createUniqueId()
        db.collection('Requested_Books').add({
            "user_id": userId,
            "book_name":bookName,
            "reason_to_request":reasonToRequest,
            "request_id"  : randomRequestId,
            "book_status": "Requested",
            "date": firebase.firestore.FieldValue.serverTimestamp()
        })
    
        await this.getBookRequest()
        db.collection('Users').where('email_id', '==', userId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    db.collection('Users').doc(doc.id).update({
                        isBookRequestActive: true
                    })
                })
            })

        this.setState({
            bookName :'',
            reasonToRequest : ''
        })
    
        return Alert.alert("Book Requested Successfully")
      }

    
    updateBookStatus = () => {
        db.collection('Requested_Books').doc(this.state.docId).update({
            book_status: "Recieved"
        })

        db.collection('Users').where('email_id', '==', this.state.userId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    db.collection('Users').doc(doc.id).update({
                        isBookRequestActive: false
                    })
                })
            })
    }

    sendNotification = () => {
        db.collection('Users').where('email_id', '==', this.state.userId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    var name = doc.data().first_name + ' ' + doc.data().last_name;
                    db.collection('all_notifications').where('request_id', '==', this.state.requestId).get()
                        .then(snapshot => {
                            snapshot.forEach(doc => {
                                var donorId = doc.data().donor_id
                                var bookName = doc.data().book_name

                                db.collection('all_notifications').add({
                                    "targeted_user_id": donor_id,
                                    "message": name + ' ' + "has recieved the book:" + ' ' + bookName,
                                    "notification_status": "unread",
                                    "book_name": bookName
                                })
                            })
                        })
                })
            })
    }


    render() {

        if(this.state.bookRequestStatus == true) {
            return(
                <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
                    <View style={{borderColor: "#ccc", borderWidth: 2}}>
                        <Text>Book Name:</Text>
                        <Text>{this.state.bookName}</Text>
                    </View>
                    <View style={{borderColor: "#ccc", borderWidth: 2}}>
                        <Text>Book Status:</Text>
                        <Text>{this.state.bookRequestStatus}</Text>
                    </View>
                    <TouchableOpacity style={styles.btn} onPress={() => {
                        this.updateBookStatus()
                    }}>
                        <Text style={styles.btnText}>I have recieved the book</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{flex: 1}}>
                    <MyHeader title="Book Request" navigation ={this.props.navigation} />
                    <ScrollView>
                        {/* <Text style={{textAlign: 'center', fontSize: 30, marginTop: 50}}>Request A Book Here!</Text> */}
                        <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
                            <TextInput style={styles.inputBox} placeholder={"Book Name"}
                                onChangeText={text => {
                                    this.setState({bookName: text})
                                }}
                                value={this.state.bookName}
                            />
                            <TextInput style={styles.inputBox} placeholder={"Reason To Request"}
                                onChangeText={text => {
                                    this.setState({reasonToRequest: text})
                                }}
                                value={this.state.reasonToRequest}
                            />
                            <TouchableOpacity style={[styles.btn, {marginBottom: 20, marginTop: 20}]} onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}>
                                <Text style={styles.btnText}>Request</Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    KeyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    inputBox: {
        width: 300,
        height: 60,
        borderWidth: 2,
        marginTop: 40,
        paddingLeft: 5,
        borderRadius: 10
    },

    btn: {
        height: 50, 
        width: 300, 
        borderWidth: 2, 
        marginTop: 20, 
        paddingTop: 5, 
        borderRadius: 25,
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
    btnText: {
        color: 'white',
        fontWeight: '200',
        fontSize: 20,
        marginLeft: 120,
        marginTop: 5
    }
})