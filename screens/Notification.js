import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Dimensions, FlatList, AsyncStorage } from 'react-native';
import { Appbar, Searchbar, Avatar, Subheading, Card, Paragraph, Caption, Button, ActivityIndicator, Colors } from 'react-native-paper';

export default class Notification extends React.Component {

  state = {
    data: [],
    pageloading: true
  };

  componentDidMount() {
    this.getlist();
  }

  getlist = async () => {
    this.setState({pageloading: true})
    const value = await AsyncStorage.getItem('devicetoken');
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ longitude: position.coords.longitude })
        this.setState({ latitude: position.coords.latitude })

        fetch("http://Inkafoodapp.com/Api/Consumer/Notification",
          {
            headers: {
              'Authorization': 'Bearer ' + value,
              'content-type': 'application/json',
            }
          })
          .then((response) => response.json())
          .then((result => {
            this.setState({ data: result })
            this.setState({pageloading: false})
          }))
          .catch((error) => {
            console.log(error);
            alert(error)
          });
      },
      error => alert(error.message),
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000
      }
    );

  }

  render() {
    if (this.state.pageloading === true)
    return(
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} animating={true} color={Colors.red800} /> 
      </View>
    )
    else
    return (
      <ScrollView> 
          {/* <FlatList
            style={{ marginBottom: 60, marginTop: 15, padding: 10 }}
            data={this.state.data.coupons}
            keyExtractor={item => item.imageUrl}
          initialNumToRender={6}
          removeClippedSubviews={true}
          ListEmptyComponent={() =>
            (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: screenwidth, height: 200 }}>
                <Avatar.Icon size={80} icon="notifications-paused" />
                <Subheading>Notifications List Empty</Subheading>
              </View>
            )}
          renderItem={({ item }) => (
            <List.Item
              title="First Item"
              description="Item description"
              left={props => <List.Icon {...props} icon="folder" />}
            />
          )}
        /> */}
      </ScrollView>
    );
  }
}
let screenwidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  searchbarstyle: {
    // width: screenwidth/1.1,  
    borderRadius: 10,
    shadowColor: "#000000",
    // height: 50,
    //  marginLeft: 15,
    //  marginRight:15,
    // marginTop: -10
    marginBottom: 10
  },
  searchcontainer: {
    flex: 1,
    flexDirection: 'row'
  },
  searchbarplaceholderstyle: {
    color: '#E8E8E8'
  },
  paragraphstyle: {
    fontWeight: 'bold',
    color: '#CA2D40'
  },
  cardstyle: {
    elevation: 2
  },
});
