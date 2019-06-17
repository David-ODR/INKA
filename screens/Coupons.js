import React from 'react';
import { StyleSheet, View, ScrollView, FlatList, Dimensions, AsyncStorage } from 'react-native';
import { Surface, Text, Banner, IconButton, Colors, Appbar, ActivityIndicator  } from 'react-native-paper';

export default class Coupons extends React.Component {
  static navigationOptions = {
    headerTitle: 'Coupons',
  };

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
    pageloading: true
  };

  componentDidMount(){
    this.getpoints();
  }

  getpoints = async () => {
    this.setState({pageloading: true})
    const value = await AsyncStorage.getItem('devicetoken');
    fetch('http://Inkafoodapp.com/Api/Consumer/Coupon/CountsAndPoints',
    {  
      headers: {
        'Authorization': 'Bearer ' + value,
        'content-type': 'application/json', 
      }})
    .then((response) => response.json())
    .then((result => {
      this.setState({data: result})
      this.setState({pageloading: false})
    }))
    .catch((error) => {
      console.log(error);
      alert(error)
    });
  }

  render() {
    let screenwidth = Dimensions.get('window').width;
    let screenheight = Dimensions.get('window').height;
    if (this.state.pageloading === true)
    return(
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} animating={true} color={Colors.red800} /> 
      </View>
    )
    else
    return (
      <View> 

        <Appbar.Header style={{padding: 10, justifyContent: 'center', elevation: 3}}> 
        <Text style={{ fontFamily: 'HelveticaNeue-Black', color: 'white', fontWeight: 'bold', fontSize: 25}}>TOTAL POINTS: </Text>
        <Text style={{ fontFamily: 'HelveticaNeue-Black', color: 'white', fontWeight: 'bold', fontSize: 25}}>{this.state.data.points}</Text>
      </Appbar.Header>

        <View style={styles.container}>

          <Surface style={styles.surface}>
            <IconButton
              icon="beenhere"
              color={Colors.green700}
              size={30}
              onPress={() => console.log('Pressed')}  
            /> 
            <Text style={styles.textStyle}>{this.state.data.points}</Text>
          </Surface>

          <Surface style={styles.surface}>
          <IconButton
              icon="attach-money"
              color={Colors.yellowA700}
              size={30}
              onPress={() => console.log('Pressed')}  
            /> 

            <Text style={styles.textStyle}>600 Credits</Text>
          </Surface>

          <Surface style={styles.surface}>
          <IconButton
              icon="warning"
              color={Colors.red700}
              size={30}
              onPress={() => console.log('Pressed')}  
            /> 

            <Text style={styles.textStyle}>Expiry</Text>
          </Surface>

          <Surface style={styles.surface}>

          <IconButton
              icon="add"
              color={Colors.black}
              size={30}
              onPress={() => console.log('Pressed')}  
            /> 
            <Text style={styles.textStyle}>{this.state.data.redeemed}</Text>
          </Surface>

        </View>

        <View style={styles.container}>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',  
    alignItems: "center"
  },
  surface: {
    padding: 8,
    height: 100,
    width: 370, 
    elevation: 2,
    margin: 10, 
  },
  textStyle: {
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center'
  }
});
