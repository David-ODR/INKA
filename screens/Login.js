import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, Dimensions, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { TextInput, BottomNavigation, Button, Title, Surface, Subheading, Divider, Caption, IconButton, FAB, Colors } from 'react-native-paper';
import { LinearGradient } from 'expo';
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons';

export default class Login extends React.Component {
  static navigationOptions = {
    title: null
  }

  state = {
    email: '',
    password: '',
    token: '',
    emailerror: false,
    emailerrortext: null,
    passworderror: false,
    passworderrortext: null
  };

  validateform() {
    let reg =  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (this.state.email === "" || reg.test(this.state.email) === false) {
      this.setState({ emailerrortext: "Invalid Email" })
      this.setState({ emailerror: true })
    } 
    else {
      this.setState({ emailerrortext: null })
      this.setState({ emailerror: false })
    }
    if (this.state.password === "") {
      this.setState({ passworderrortext: "Invalid Password" })
      this.setState({ passworderror: true })
    }
    else {
      this.setState({ passworderrortext: null })
      this.setState({ passworderror: false })
    }
    if (this.state.passworderror === false && this.state.emailerror === false) {
      this.loginuser();
    }
  }

  loginuser = async () => {
    const value = await AsyncStorage.getItem('devicetoken');
    const email = this.state.email;
    const password = this.state.password;
    
    "localhost:55828/token",
      "userName=" + encodeURIComponent(email) +
      "&password=" + encodeURIComponent(password) +
      "&grant_type=password"
    fetch('http://Inkafoodapp.com/Api/token', {
      method: 'post',
      body: (`username=${email}&password=${password}&grant_type=password`),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      }
    })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        console.log("login success");
        
        return res.json();
      })
      .then(result => {
        this.setState({ token: result.access_token });
        this.storeData(); 
        
      })
      .catch(err => console.error(err));
  }


  storeData = async () => {
    try {
      await AsyncStorage.setItem('devicetoken', this.state.token)
      await AsyncStorage.setItem('usertype', 'OldUser')
      await AsyncStorage.setItem('distance', '5')
    } catch (e) {
      console.log("token was not saved" + e)
    }
    const {params} = this.props.navigation.state; 

    await AsyncStorage.setItem('usertype', 'OldUser'); 
    params.getprofile();
    this.props.navigation.navigate("Settings");
  }

  render() {
    let screenwidth = Dimensions.get('window').width;
    let screenheight = Dimensions.get('window').height;
    return (
      <ScrollView contentContainerStyle={styles.parentcontainer} keyboardDismissMode='on-drag'>

        <View style={{ alignItems: "center", }}>
          <Image style={{ height: 150, width: 200 }} source={require('../assets/inkalogo.jpeg')} />
        </View>

        <Caption style={styles.titlecontainerstyle}>Login with your email</Caption>

        <KeyboardAvoidingView behavior="padding" enabled>
        <TextInput
          label='Email'
          mode='outlined'
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          style={styles.textinput}
          returnKeyType={"next"}
          onSubmitEditing={() => { this.passwordinput.focus(); }}
          blurOnSubmit={false}
          error={this.state.emailerror}
        />
        <Text style={{ color: '#bb0000', fontSize: 12, marginLeft: 10}}>{this.state.emailerrortext}</Text>

        <TextInput
          label='Password'
          mode='outlined'
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          style={styles.textinput}
          secureTextEntry={true}
          returnKeyType={"done"}
          blurOnSubmit={false}
          ref={(input) => { this.passwordinput = input; }}
          error={this.state.passworderror}
          onSubmitEditing={() => this.validateform()}
        />
        <Text style={{ color: '#bb0000', fontSize: 12, marginLeft: 10}}>{this.state.passworderrortext}</Text>
        </KeyboardAvoidingView>

        <Button style={styles.Loginbutton} mode="contained" onPress={() => this.validateform()}>
          Login
            </Button>
        <Divider />
        <Button icon={() => <MaterialIcon size={20} name="facebook-box" color={Colors.white} />} style={{ backgroundColor: '#3b5998', borderRadius: 50, }}>
          <Text style={{ color: 'white' }}>LOGIN WITH FACEBOOK</Text></Button>

        <Button style={styles.Loginbutton} mode="outlined" onPress={() => this.props.navigation.navigate("Register")}>
          <Text>New to INKA? Sign Up now</Text>
        </Button>
      </ScrollView>
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
    fontSize: 30
  },
  Loginbutton: {
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
    height: 40,
  },
  loginbtnsize: {
    fontSize: 26,
    textAlign: 'center'
  },
  iconcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginRight: 20,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20
  },
  captioncontainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  ButtonContainer: {
    borderRadius: 30,
    fontSize: 24
  },
  parentcontainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    marginBottom: 20
  },
  socialbuttonstyle: {
    height: 100,
    width: 100,
    borderRadius: 200,
  },
  logincontainer: {
    padding: 8,
    margin: 10,
    elevation: 4,
    borderRadius: 25,
    opacity: 0.85
  },
  titlecontainerstyle: {
    textAlign: 'center',
    fontFamily: 'HelveticaNeueBold',
    fontSize: 15,
  },
  Categorystyle: {
    fontFamily: 'HelveticaNeueBold',
    fontSize: 20,
  }
});
