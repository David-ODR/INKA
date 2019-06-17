import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';

export default class SearchHeaders extends React.Component {

  state = {
    email: '',
    password: '',
    confirmpassword: ''
  };

  render() { 
      return (
        <Appbar.Header>
          <Appbar.Action icon="filter-list" onPress={() => console.log('Pressed archive')} />
          <View style={styles.searchcontainer}>
            <Searchbar
              style={styles.searchbarstyle}
              placeholder="Search..."
              placeholderTextColor="#E8E8E8" 
            />
          </View>
          <Appbar.Action icon="add-location" onPress={() => console.log(this.props)} />
        </Appbar.Header>
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
});
