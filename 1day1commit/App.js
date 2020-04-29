import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Kohana } from 'react-native-textinput-effects';
import { iOSUIKit,iOSColors  } from 'react-native-typography'
import { render } from 'react-dom';

export default class App extends Component {
  state = {
    username: "",
    events: [],
    recent_commit: "",
    isinitialized: false,
  };
  
  _getUserEvents = (username) => {
    username = username.toLowerCase().trim();
    const url = `https://api.github.com/users/${username}/events`;
    return fetch(url).then((res) => res.json());
  };

  _inputChange = (evt) => {
    this.setState({
      username : evt.nativeEvent.text
    });
  };

  _getResult = () => {
    this._getUserEvents(this.state.username)
      .then((res) => {
        this.setState({events: res});
        try{
          var s = JSON.stringify(this.state.events[0].id);
          this.state.isinitialized = true;
        } catch(error) {
          Alert.alert("no username");
          this.state.events = [];
          this.state.isinitialized = false;
        }
      });
  };

  _renderEvents = () => {
    if(this.state.isinitialized) {
      this.state.isinitialized = false;
      return (
        <ScrollView>
          {
            this.state.events.map((event, i) => {
              if(i==0) {
                  this.state.recent_commit = JSON.stringify(event.created_at);
                };
                return (
                  <View key={i}>
                    <Text>{i}, {JSON.stringify(event.repo.name)},  {JSON.stringify(event.type)}, {JSON.stringify(event.created_at)}</Text>
                  </View>
                );
            })
          }
        </ScrollView>
      )
    }
  };

  _getRecentCommitDate = () => {
    return (
    <Text> {this.state.recent_commit} </Text>
    );
  };
  
  render() {
    return (
      <View style={styles.container}>
        <Text style = {styles.title}>
        1day 1commit</Text>
        <Kohana
          label={'Enter your Github username'}
          iconClass={FontAwesomeIcon}
          iconName={'github'}
          iconColor={'#f4d29a'}
          inputPadding={25}
          labelStyle={{ color: '#91627b' }}
          inputStyle={{ color: '#000' }}
          iconContainerStyle={{ padding: 20 }}
          useNativeDriver
          style = {styles.text_input}
          onChangeText={(text) => { this.setState({username: text})}}
        />
        <Button title = "확인" onPress = {() => this._getResult()} style = {styles.submit_button}/>
        <View  style = {styles.result_view}>
          { this._renderEvents() }
        </View>
        <View style = {styles.recent_commit}>
          {this._getRecentCommitDate()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AACFB6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...iOSUIKit.largeTitleEmphasizedObject,
    flex: 1,
    textAlign: "center",
    marginTop: 30,
    fontSize: 40,
    color: "#ff9",
  },
  text_input: {
    width:"80%",
    flex: 1,
  },
  submit_button: {
    
  },  
  result_view: {
    flex: 6,
  },
  recent_commit: {
    flex:1.5,
  }
});
