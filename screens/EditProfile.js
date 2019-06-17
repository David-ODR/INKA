import React from 'react';
import { StyleSheet, View, Text, ScrollView, AsyncStorage, ImageBackground, TouchableOpacity, Image, KeyboardAvoidingView, Picker } from 'react-native';
import { TextInput, BottomNavigation, Button, Title, Surface, Avatar, Caption, Card, List, Divider, Colors, Paragraph } from 'react-native-paper';
import { ImagePicker, } from 'expo';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';


export default class EditProfile extends React.Component {
  static navigationOptions = {
    headerTitle: 'EditProfile',
  };

  state = {
    fname: this.props.navigation.state.params.profileinfo.firstName,
    lname: this.props.navigation.state.params.profileinfo.lastName,
    contactno: this.props.navigation.state.params.profileinfo.contactNo,
    country: this.props.navigation.state.params.profileinfo.country,
    city: this.props.navigation.state.params.profileinfo.city,
    email: this.props.navigation.state.params.profileinfo.email,
    token: "",
    usertype: AsyncStorage.getItem('devicetoken'),
    userinfo: this.props.navigation.state.params.profileinfo,
    image: null,
    password: "",
    confirmpassword: "",
    error: false,
    errortext: "",
    selectedcountry: null,
    selectedcity: null,
    cityarray: [],
    countryarray: []
  };
  componentDidMount() {
    this.getcountrylist();
  }

  updateprofile = async () => {
    const value = await AsyncStorage.getItem('devicetoken');

    const fname = this.state.fname
    const lname = this.state.lname
    const email = this.state.email
    const contactno = this.state.contactno
    const country = this.state.selectedcountry
    const city = this.state.selectedcity
    const image = this.state.image
    const { params } = this.props.navigation.state;

    console.log(city)
    console.log(country)

    fetch('http://inkafoodapp.com/Api/Account/Profile/Update', {
      method: 'PUT',
      body: JSON.stringify({
        firstName: fname, lastName: lname, email: email, contactNo: contactno, countryId: country, cityId: city, base64Image: image
      }),
      headers: {
        'Authorization': 'Bearer ' + value,
        'content-type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        console.log("update profile done");
        params.getprofile();
        this.props.navigation.goBack();
        return res.json();
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
        this.setState({ countryarray: result.countries })
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
        this.setState({ cityarray: result.cities })
      })
      .catch(err => console.error(err));
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  updatepassword = async () => {
    if (this.state.password !== this.state.confirmpassword) {
      this.setState({ error: !this.state.error })
      this.setState({ errortext: "Error: Passwords do not match" })
    }
    else if (this.state.password === "" || this.state.confirmpassword === "") {
      this.setState({ error: !this.state.error })
      this.setState({ errortext: "Error: Password Inputs are empty!" })
    }
    else {
      this.setState({ error: !this.state.error })
      this.setState({ errortext: "" })
    }
    const value = await AsyncStorage.getItem('devicetoken');

    const email = this.state.email;
    const password = this.state.password;

    fetch('http://inkafoodapp.com/Api/Account/Profile/Password', {
      method: 'POST',
      body: JSON.stringify({
        newPassword: password, currentPassword: email
      }),
      headers: {
        'Authorization': 'Bearer ' + value,
        'content-type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        console.log("done");
        this.props.navigation.goBack();
        return res.json();
      })
      .catch(err => console.error(err));
  }

  resetpassword = async () => {
    const value = await AsyncStorage.getItem('devicetoken');

    const email = this.state.email;
    const password = this.state.password;

    fetch('http://inkafoodapp.com/Api/Account/ResetPassword', {
      method: 'POST',
      body: JSON.stringify({
        email: email, password: password, token: value
      }),
      headers: {
        'Authorization': 'Bearer ' + value,
        'content-type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        console.log("done");
        this.props.navigation.goBack();
        return res.json();
      })
      .catch(err => console.error(err));
  }

  forgotpassword = async () => {
    const value = await AsyncStorage.getItem('devicetoken');

    const email = this.state.email;

    fetch('http://inkafoodapp.com/Api/Account/ForgotPassword', {
      method: 'POST',
      body: JSON.stringify({
        email: email
      }),
      headers: {
        'Authorization': 'Bearer ' + value,
        'content-type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) return Promise.reject(new Error(`HTTP Error ${res.status}`));
        console.log("done");
        this.props.navigation.goBack();
        return res.json();
      })
      .catch(err => console.error(err));
  }

  render() {
    var image = !this.props.navigation.state.params.profileinfo.imageUrl ? require('../assets/default-user.png') :
      { uri: this.state.image };
    return (

      <ScrollView>
        <KeyboardAvoidingView behavior="padding" enabled>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5, padding: 20, backgroundColor: 'rgb(238, 238, 238)' }}>
            <Button onPress={this._pickImage} style={{ position: "absolute", zIndex: 2, top: 10, right: 10 }} icon="mode-edit">Edit</Button>

            <TouchableOpacity onPress={this._pickImage}>
              <Image style={{ height: 100, width: 100, borderRadius: 50, marginBottom: 5, backgroundColor: '#d3d3d3', justifyContent: 'center', alignItems: 'center' }}
                size={100} source={{ uri: this.state.image}} />
            </TouchableOpacity >
            <Text>Profile Photo</Text>
          </View>

          <View style={styles.textcontainer}>
            <Title>Basic Information</Title>
            <TextInput
              style={styles.textstyle}
              mode={"outlined"}
              label='First Name'
              value={this.state.fname}
              onChangeText={fname => this.setState({ fname })}
              id="Editprofile-firstname"
              returnKeyType={"next"}
              onSubmitEditing={() => { this.lastnameinput.focus(); }}
              blurOnSubmit={false}
            />

            <TextInput
              onSubmitEditing={() => { this.emailinput.focus(); }}
              blurOnSubmit={false}
              ref={(input) => { this.lastnameinput = input; }}
              style={styles.textstyle}
              mode={"outlined"}
              label='Last Name'
              value={this.state.lname}
              onChangeText={lname => this.setState({ lname })}
              id="Editprofile-lastname"
              returnKeyType={"next"}
            />

            <TextInput
              style={styles.textstyle}
              mode={"outlined"}
              label='Email'
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              id="Editprofile-email"
              returnKeyType={"next"}
              onSubmitEditing={() => { this.contactinput.focus(); }}
              blurOnSubmit={false}
              ref={(input) => { this.emailinput = input; }}
            />

            <TextInput
              style={styles.textstyle}
              mode={"outlined"}
              label='Contact No.'
              value={this.state.contactno}
              onChangeText={contactno => this.setState({ contactno })}
              id="Editprofile-contactno"
              returnKeyType={"next"}
              blurOnSubmit={false}
              ref={(input) => { this.contactinput = input; }}
            />

            <Picker
              selectedValue={this.state.selectedcountry}
              style={{ height: 50, width: '100%', borderWidth: 20 }}
              on
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ selectedcountry: itemValue })
                this.getcity()
              }
              }>
              <Picker.Item label="Country" value={0} />
              {this.state.countryarray.map((item, key) =>
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
              {this.state.cityarray.map((item, key) =>
                <Picker.Item key={key} label={item.cityName} value={item.cityId} />
              )}
            </Picker>

            <Button style={{ borderRadius: 20 }} mode="contained" onPress={() => this.updateprofile()}>Done</Button>
          </View>

          <Divider />

          <View style={styles.textcontainer}>
            <Title>Account</Title>
            <TextInput
              style={styles.textstyle}
              mode={"outlined"}
              label='New Password'
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
              secureTextEntry={true}
              error={this.state.error}
            />

            <TextInput
              style={styles.textstyle}
              mode={"outlined"}
              label='Confirm Password'
              value={this.state.confirmpassword}
              onChangeText={confirmpassword => this.setState({ confirmpassword })}
              error={this.state.error}
              secureTextEntry={true}
            />
            <Text style={{ color: '#bb0000', fontSize: 12, margin: 10 }}>{this.state.errortext}</Text>

            <Button style={{ borderRadius: 20 }} mode="contained" onPress={() => this.updatepassword()}>Change Password</Button>
          </View>

          <Divider />
          <Button style={{ borderRadius: 20 }} mode="text" onPress={() => this.forgotpassword()}>Forgot Password</Button>
          <Button style={{ borderRadius: 20 }} mode="text" onPress={() => this.resetpassword()}>Reset Password</Button>

        </KeyboardAvoidingView>
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  textstyle: {
    backgroundColor: '#fff',
    margin: 10
  },
  textcontainer: {
    padding: 10
  }
});
