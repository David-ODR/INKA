import React from 'react';
import { StyleSheet, View, Text, ScrollView, AsyncStorage, RefreshControl, Image } from 'react-native';
import {
  TextInput, BottomNavigation, Button, Title, Surface, Avatar, Caption, Card, List, Divider, Colors, Paragraph,
  Appbar, Menu,
} from 'react-native-paper';
import defaultimage from '../assets/default-user.png';

export default class Profile extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    email: '',
    password: '',
    confirmpassword: '',
    token: "",
    userinfo: [],
    refreshing: false,
    visible: false,
    usertype: "",
    imgload: false,
    showDefault: true,
  };

 componentDidMount() {
    this.checkusertype(); 
  } 

  rerenderUserType= async () => {
  AsyncStorage.removeItem('devicetoken'); 
  AsyncStorage.setItem('usertype', 'NewUser');
  this.setState({usertype: "DefaultUser"})
  }

  checkusertype = async () => { 
    const usertype = await AsyncStorage.getItem('usertype') 
    if (usertype === "NewUser") {
      this.createdefaultusername();
      await AsyncStorage.setItem('usertype', 'OldUser');
      this.setState({ usertype: usertype })
    }
    else if (usertype === "OldUser" || usertype === "DefaultUser") {
      this.getprofile()
      this.setState({ usertype: usertype })
    }
  }

  createdefaultusername() {
    fetch('http://inkafoodapp.com/Api/Config/ControlNumber/Request/A663C3EE-F46C-4DA7-8BB0-2E4BF7B9F196', {
      method: 'post',
      body: JSON.stringify({}),
      headers: {
        'content-type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        return res.json();
      })
      .then(result => {  
        this.createdefaultuser(result)
      })
      .catch(err => console.log(err));
  }

  createdefaultuser(username) { 
    fetch('http://Inkafoodapp.com/Api/Account/Register', {
      method: 'post',
      body: JSON.stringify({ "email": username, "password": "WL[G;[LW8(cm\Vv", firstName: 'Default', lastName: 'User'}),
      headers: {
        'content-type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        return res.json();
      })
      .then(result => { 
        this.logindefaultuser(result.email)
      })
      .catch(err => console.error(err));
  }

  logindefaultuser(email) {
    fetch('http://Inkafoodapp.com/Api/token', {
      method: 'post',
      body: (`username=${email}&password=WL[G;[LW8(cm\Vv&grant_type=password`),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      }
    })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        return res.json();
      })
      .then(result => {
        this.setState({ token: result.access_token })
        this.storeData()
        this.getprofile();
      })
      .catch(err => console.error(err));
  }

  storeData = async () => {
    try {
      await AsyncStorage.setItem('devicetoken', this.state.token)
      await AsyncStorage.setItem('usertype', 'DefaultUser')
      await AsyncStorage.setItem('distance', '5')
    } catch (e) {
      console.log("token was not saved" + e)
    }
  }

  getprofile = async () => {
    const value = await AsyncStorage.getItem('devicetoken') 
    fetch('http://Inkafoodapp.com/Api/Account/Profile',
      {
        headers: {
          'Authorization': 'Bearer ' + value,
          'content-type': 'application/json',
        }
      })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        return res.json();
      })
      .then((result => {
        this.setState({ userinfo: result }) 

      }))
      .catch((error) => {
        console.log(error);
        alert(error)
      });
  }
  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });

  forcererender(){
    this.forceUpdate()
  }
  verifyemail= async () => { 
    const value = await AsyncStorage.getItem('devicetoken')
    fetch(`http://Inkafoodapp.com/Api/Account/Verify/${this.state.userinfo.email}/${value}`,
      {
        headers: {
          'Authorization': 'Bearer ' + value,
          'content-type': 'application/json',
        }
      })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        return res.json();
      })
      .then((result => {
        console.log(result);
      }))
      .catch((error) => {
        console.log(error);
        alert(error)
      });
  }


  render() {
    var image = !this.state.userinfo.imageUrl ? require('../assets/default-user.png') :  { uri: this.state.userinfo.imageUrl } ;
    if (this.state.usertype !== "DefaultUser")
    return (
      <View>
        <ScrollView
          refreshControl={<RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.getprofile}
          />}
        >
          <View style={{ backgroundColor: 'transparent', top: 0, right: 0, zIndex: 2, position: "absolute" }}>

            <Menu
              style={{ marginTop: 35, borderRadius: 15 }}
              visible={this.state.visible}
              onDismiss={this._closeMenu}
              anchor={
                <Appbar.Action color={Colors.white} icon="more-vert" onPress={() => this._openMenu()} />
              }
            >
              <Menu.Item onPress={() => {
                this.props.navigation.navigate("EditProfile", { profileinfo: this.state.userinfo, getprofile: this.getprofile.bind(this) });
                this._closeMenu();
              }
              } title="Edit Profile" />
              <Menu.Item onPress={() => this.rerenderUserType()} title="Logout" />
            </Menu>
          </View> 

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5, backgroundColor: '#E22539', padding: 20 }}>
            <Image style={{height: 100, width: 100, borderRadius: 200, marginBottom: 5, backgroundColor: '#f3f3f3' }} 
            source={image}  onLoadEnd={() => this.setState({showDefault: false})}
            /> 

            <Paragraph style={{ color: '#fff' }}>
              Name: {this.state.userinfo.firstName} {this.state.userinfo.lastName}
            </Paragraph>
          </View>

          <View>

            <Card>
              <Card.Title title="Basic Information" left={(props) => <Avatar.Icon {...props} icon="account-box" />} />
              <Divider />
              <Card.Content>
                <List.Item
                  title="Email"
                  titleStyle={styles.titlestyle}
                  description={this.state.userinfo.email}
                  left={props => <List.Icon {...props} icon="email" color={Colors.amber300} />}
                />
                <Divider />

                <List.Item
                  title="Contact No."
                  description={this.state.userinfo.contactNo}
                  titleStyle={styles.titlestyle}
                  left={props => <List.Icon {...props} icon="message" color={Colors.blueGrey600} />}
                />
                <Divider />

                <List.Item
                  title="Country"
                  description={this.state.userinfo.country}
                  titleStyle={styles.titlestyle}
                  left={props => <List.Icon {...props} icon="map" color={Colors.cyanA400} />}
                />
                <Divider />

                <List.Item
                  title="City"
                  description={this.state.userinfo.city}
                  titleStyle={styles.titlestyle}
                  left={props => <List.Icon {...props} icon="location-city" color={Colors.tealA600} />}
                />
                <Divider />
              </Card.Content>
            </Card> 

          </View>
          
        </ScrollView >
      </View>
    );
    else
      return (
        <View style={{ flex: 1, }}>
          <View>
            <Appbar.Header>
              <Appbar.Content title="User Settings" titleStyle={{fontSize: 30}} />
            </Appbar.Header>
          </View>

          <View style={{ flexDirection: "column", justifyContent: "center", padding: 15 }}>
            <Surface style={{ backgroundColor: '#f3f3f3', padding: 20, alignItems: "center", borderRadius: 20, marginTop: 20 }}>
              <Image style={{ height: 200, width: '100%' }} source={require('../assets/inkalogo.jpeg')} />
              <Caption style={{ fontFamily: 'HelveticaNeueBold', textAlign: "center", fontSize: 20 }}>
                Sign up and be a member of INKA!
                  </Caption>
              <Button mode="contained" style={{ margin: 10, width: '100%', borderRadius: 20, height: 40,}} onPress={() => this.props.navigation.navigate("Register", {getprofile: this.checkusertype.bind(this) })}>Sign Up</Button>

              <Caption style={{ textAlign: 'center', fontSize: 15, fontWeight: '900' }}>Or</Caption>

              <Button mode="outlined" onPress={() => this.props.navigation.navigate("Login", {getprofile: this.checkusertype.bind(this)} )} style={{ margin: 10, borderRadius: 20, height: 40, width: '100%' }}>Login</Button>
            
            </Surface>
          </View>
        </View>
      ); 
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 8,
    elevation: 6,
  },
  textinput: {
    margin: 10,
    height: 80,
    fontSize: 30
  },
  Loginbutton: {
    borderRadius: 50,
    margin: 10,
    height: 60
  },
  loginbtnsize: {
    fontSize: 30,
  },
  iconcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 20
  },
  captioncontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  cardcontainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 10,
  },
  cardstyle: {
    color: '#fff',
    margin: 10,
    elevation: 3,
    borderRadius: 10,
  },
  titlestyle: {
    color: '#CA2D40'
  },
  headerstyle: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0
  }
});
