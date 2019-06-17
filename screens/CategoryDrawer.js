import React from 'react';
import { StyleSheet, View, ScrollView, FlatList, Dimensions, Image } from 'react-native';
import { Surface, Text, Banner, IconButton, Colors, Drawer } from 'react-native-paper';

export default class CategoryDrawer extends React.Component { 

  state = {
    email: '',
    password: '',
    confirmpassword: '',
    loading: false,
    data: [],
    page: 1,
    seed: 1,
    error: null,
    refreshing: false,
    active: ""
  };



  render() {
    let screenwidth = Dimensions.get('window').width;
    let screenheight = Dimensions.get('window').height;

    return (
      <View> 
      </View>
    );
  }
}

const styles = StyleSheet.create({ 
});
