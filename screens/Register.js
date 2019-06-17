import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions, Picker, AsyncStorage,
  KeyboardAvoidingView
} from 'react-native';
import { TextInput, BottomNavigation, Button, Title, Surface, Avatar, Caption, Subheading, Colors, Divider } from 'react-native-paper';
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons';

export default class Login extends React.Component {
  static naviagtionOptions = {
    headertitle: null
  }

  state = {
    email: '',
    password: '',
    confirmpassword: '',
    firstname: '',
    lastname: '',
    country: [],
    city: [],
    contactno: '',
    selectedcountry: null,
    selectedcity: null,
    emailerror: false,
    emailerrortext: null,

    passworderror: false,
    passworderrortext: null,

    firstnameeror: false,
    firstnameerrortext: null,

    confirmpassworderor: false,
    confirmpassworderortext: null,

    lastnameerror: false,
    lastnameerrortext: null,

    contactnoerror: false,
    contactnoerrortext: null
  };

  componentDidMount() {
  }

  validateform() {
    //Email Validation
    let emailtest =  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let number = /^[0-9]+$/;
    let lettersonly = /^[a-zA-Z ]+$/;

    if (this.state.email === "" || emailtest.test(this.state.email) === false) {
      this.setState({ emailerrortext: "Invalid Email" })
      this.setState({ emailerror: true })
    } 
    else {
      this.setState({ emailerrortext: null })
      this.setState({ emailerror: false })
    }

    //Password Validation
    if (this.state.password === "") {
      this.setState({ passworderrortext: "Invalid Password" })
      this.setState({ passworderror: true })
    }
    else {
      this.setState({ passworderrortext: null })
      this.setState({ passworderror: false })
    }

    if (this.state.password === "" || this.state.password !== this.state.confirmpassword) {
      this.setState({ confirmpassworderortext: "Passwords do not match" })
      this.setState({ confirmpassworderor: true })
    }
    else {
      this.setState({ confirmpassworderortext: null })
      this.setState({ confirmpassworderor: false })
    }


    //First Name Validation
    if (this.state.firstname === "" || lettersonly.test(this.state.firstName) === false) {
      this.setState({ firstnameerrortext: "Invalid Firstname" })
      this.setState({ firstnameeror: true })
    }
    else {
      this.setState({ firstnameerrortext: null })
      this.setState({ firstnameeror: false })
    }

    //Last Name Validation
    if (this.state.lastname === "" || lettersonly.test(this.state.lastname) === false) {
      this.setState({ lastnameerrortext: "Invalid Lastname" })
      this.setState({ lastnameerror: true })
    }
    else {
      this.setState({ lastnameerrortext: null })
      this.setState({ lastnameerror: false })
    }

    //Contact No. Validation
    if (this.state.contactno === "" || number.test(this.state.contactno) === false) {
      this.setState({ contactnoerrortext: "Invalid Lastname" })
      this.setState({ contactnoerror: true })
    }
    else {
      this.setState({ contactnoerrortext: null })
      this.setState({ contactnoerror: false })
    }

    if (this.state.passworderror === false && this.state.emailerror === false && this.state.confirmpassworderor === false
      && this.state.firstnameeror === false && this.state.lastnameerror === false && this.state.contactnoerror === false) {
      this.registeruser();
    }

    
  }

  registeruser() {
    const email = this.state.email;
    const password = this.state.password;
    const firstName = this.state.firstName;
    const lastname = this.state.lastname;
    const contactno = this.state.contactno;
    const country = this.state.selectedcountry;
    const city = this.state.selectedcity 

    fetch('http://Inkafoodapp.com/Api/Account/Register', {
      method: 'post',
      body: JSON.stringify({
        email: email, password: password, firstName: firstName, lastName: lastname, contactNo: contactno, country: country, city: city,
        userType: 1
      }),
      headers: {
        'content-type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        return res.json();
      })
      .then(result => {
        console.log(result)
        this.loginuser();
      })
      .catch(err => console.error(err));
  }

  getcountrylist = async () => {
    const value = await AsyncStorage.getItem('devicetoken');

    fetch('http://inkafoodapp.com/Api/Account/Country/List', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + value,
        'content-type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        return res.json();
      })
      .then(result => {
        this.setState({ country: result.countries })
      })
      .catch(err => console.error(err));
  }

  getcity = async () => {
    const value = await AsyncStorage.getItem('devicetoken');
    fetch(`http://inkafoodapp.com/Api/Account/City/List/${this.state.selectedcountry}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + value,
        'content-type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        return res.json();
      })
      .then(result => {
        this.setState({ city: result.cities })
      })
      .catch(err => console.error(err));
  }

  loginuser = async () => { 
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
      <View>
        {/* <ImageBackground blurRadius={3} source={require('../assets/loginbg5.jpg')}
         style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, height: screenheight, width: screenwidth }} /> */}
        <KeyboardAvoidingView behavior="padding" enabled>
          <ScrollView contentContainerStyle={styles.parentcontainer} keyboardDismissMode='on-drag'>

            <View style={{ alignItems: "center" }}>
              <Image style={{ height: 150, width: 200 }} source={require('../assets/inkalogo.jpeg')} />
            </View>
            <Caption style={styles.titlecontainerstyle}>Sign up with your email</Caption>

            <Title style={styles.Categorystyle}>Account Credentials</Title>

            <TextInput
              label='Email'
              mode='flat'
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              style={styles.textinput}
              returnKeyType={"next"}
              onSubmitEditing={() => { this.passwordinput.focus(); }}
              blurOnSubmit={false}
              error={this.state.emailerror}
            />
            <Text style={{ color: '#bb0000', fontSize: 12, marginLeft: 10 }}>{this.state.emailerrortext}</Text>

            <TextInput
              label='Password'
              mode='flat'
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
              style={styles.textinput}
              secureTextEntry={true}
              returnKeyType={"next"}
              onSubmitEditing={() => { this.confirmpasswordinput.focus(); }}
              blurOnSubmit={false}
              ref={(input) => { this.passwordinput = input; }}
              error={this.state.passworderror}
            />
            <Text style={{ color: '#bb0000', fontSize: 12, marginLeft: 10 }}>{this.state.passworderrortext}</Text>

            <TextInput
              label='Confirm Password'
              mode='flat'
              value={this.state.confirmpassword}
              onChangeText={confirmpassword => this.setState({ confirmpassword })}
              style={styles.textinput}
              secureTextEntry={true}
              returnKeyType={"next"}
              onSubmitEditing={() => { this.fnameinput.focus(); }}
              blurOnSubmit={false}
              ref={(input) => { this.confirmpasswordinput = input; }}
              error={this.state.confirmpassworderor}
            />
            <Text style={{ color: '#bb0000', fontSize: 12, marginLeft: 10 }}>{this.state.confirmpassworderortext}</Text>
            <Divider />
            <Title style={styles.Categorystyle}>Basic Information</Title>

            <TextInput
              label='First Name'
              mode='flat'
              value={this.state.firstName}
              onChangeText={firstName => this.setState({ firstName })}
              style={styles.textinput}
              returnKeyType={"next"}
              onSubmitEditing={() => { this.lnameinput.focus(); }}
              blurOnSubmit={false}
              ref={(input) => { this.fnameinput = input; }}
              error={this.state.firstnameeror}
            />
            <Text style={{ color: '#bb0000', fontSize: 12, marginLeft: 10 }}>{this.state.firstnameerrortext}</Text>

            <TextInput
              label='Last Name'
              mode='flat'
              value={this.state.lastname}
              onChangeText={lastname => this.setState({ lastname })}
              style={styles.textinput}
              returnKeyType={"next"}
              onSubmitEditing={() => { this.contactinput.focus(); }}
              blurOnSubmit={false}
              ref={(input) => { this.lnameinput = input; }}
              error={this.state.lastnameerror}
            />
            <Text style={{ color: '#bb0000', fontSize: 12, marginLeft: 10 }}>{this.state.lastnameerrortext}</Text>

            <TextInput
              label='Contact No.'
              mode='flat'
              value={this.state.contactno}
              onChangeText={contactno => this.setState({ contactno })}
              style={styles.textinput}
              ref={(input) => { this.contactinput = input; }}
              error={this.state.contactnoerror}
            />
            <Text style={{ color: '#bb0000', fontSize: 12, marginLeft: 10 }}>{this.state.passworderrortext}</Text>

            {/* <Picker
              selectedValue={this.state.selectedcountry}
              style={{ height: 50, width: '100%', borderWidth: 20 }}
              on
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ selectedcountry: itemValue })
                this.getcity()
              }
              }>
              <Picker.Item label="Country" value={0} />
              {this.state.country.map((item, key) =>
                <Picker.Item key={key} label={item.countryName} value={item.countryId} />
              )}
            </Picker>


            <Picker
              selectedValue={this.state.selectedcity}
              style={{ height: 50, width: '100%' }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selectedcity: itemValue })
              }>
              <Picker.Item label="City" value={0} />
              {this.state.city.map((item, key) =>
                <Picker.Item key={key} label={item.cityName} value={item.cityId} />
              )}
            </Picker> */}

            <Button style={styles.Loginbutton} mode="contained" onPress={() => this.validateform()}>
              Sign Up
          </Button>
            <Button icon={() => <MaterialIcon size={20} name="facebook-box" color={Colors.white} />} style={{ backgroundColor: '#3b5998', borderRadius: 50, }}>
              <Text style={{ color: 'white' }}>CONTINUE WITH FACEBOOK</Text></Button>
            <Button contentStyle={{ color: '#fff' }} style={styles.Loginbutton} mode="outlined" onPress={() => this.props.navigation.navigate("Login")}>
              Already a member of INKA? Login now
          </Button>

          </ScrollView>

        </KeyboardAvoidingView>

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
    fontSize: 30,
    backgroundColor: '#f3f3f3',
    opacity: 0.8
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
    margin: 10,
    padding: 10,
    borderRadius: 25,
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
