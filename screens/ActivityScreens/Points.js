import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Dimensions, AsyncStorage, ImageBackground, Linking } from 'react-native';
import { Appbar, Searchbar, Surface, Avatar, Divider, Button, ActivityIndicator, Colors } from 'react-native-paper';

export default class Points extends React.Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        data: [],
        userinfo: [],
        points: 100,
        pageloading: true
    };

    componentDidMount() {
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
            <View style={styles.container}> 
                <Surface style={styles.surface}>
                    <Text style={{ fontFamily: 'HelveticaNeueBold', fontWeight: 'bold', fontSize: 45, textAlign: 'center', }}>
                        {this.state.data.points}</Text>

                    <Text style={{ fontFamily: 'HelveticaNeueBold', fontWeight: 'bold', fontSize: 25, color: '#E22539', textAlign: 'center' }}>
                        Total Points!</Text> 
                </Surface>

                <Button style={{marginTop: 20, borderRadius: 15}} mode="contained" onPress={() => Linking.openURL(this.state.data.rewardsLink)}>Show Rewards</Button>
            </View>
        );
    }
}
let screenwidth = Dimensions.get('window').width;
let screenheight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        //  backgroundColor: '#E9F1F7',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8

    },
    surface: {
        padding: 8,
        height: 200,
        width: 300,
        // alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        borderRadius: 20
    },
});
