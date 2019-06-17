import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, Picker, Image, Dimensions, Slider, AsyncStorage } from 'react-native';
import { Searchbar, Divider, Button, Dialog, Portal, Chip, Surface, Appbar, List } from 'react-native-paper';

import { MapView, Permissions, Location } from 'expo'; 

export default class Nearby extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        email: '',
        password: '',
        confirmpassword: '',
        distance: 5,
        visible: false,
        latitude: 0,
        longitude: 0, 
    };

    componentDidMount() {
        this._getLocationAsync();
    }

    storedata = async () => {
        console.log("storedata")
        await AsyncStorage.setItem('distance', this.state.distance.toString())
        const {params} = this.props.navigation.state; 
        params.getlist();
        this.props.navigation.goBack()
      }  

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                locationResult: 'Permission to access location was denied',
                location,
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ latitude: location.coords.latitude });
        this.setState({ longitude: location.coords.longitude });
    };

    render() {
        let screenwidth = Dimensions.get('window').width;
        let screenheight = Dimensions.get('window').height;
        return (
            <View style={styles.container}>
                <Appbar.Header style={{ width: screenwidth }}>
                    <Appbar.BackAction
                        onPress={() => this.props.navigation.goBack()}
                    />
                    <Appbar.Content
                        title={this.state.distance + "KM"} 
                    /> 
                   <Appbar.Action icon="done-all" onPress={() => this.storedata()}/>
                </Appbar.Header>
                <MapView
                    showsUserLocation={true}
                    style={{ flex: 1, width: screenwidth, height: screenheight }}
                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.15,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <MapView.Circle
                        center={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                        }}
                        radius={this.state.distance * 1000}
                        strokeWidth={1}
                        strokeColor={'#1a66ff'}
                        fillColor={'rgba(230,238,255,0.5)'}
                    />
                </MapView>
                <View style={{
                    width: screenwidth, bottom: 0, zIndex: 2, position: 'absolute', flex: 1, backgroundColor: '#fff', padding: 10,
                    flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
                    <Text style={{ fontFamily: 'HelveticaNeueBold', fontSize: 15,}}>1 KM</Text>

                    <Slider
                        style={{ width: 240 }}
                        step={1}
                        minimumValue={1}
                        maximumValue={10}
                        value={5}
                        onValueChange={val => this.setState({ distance: val })}
                    />

                    <Text style={{ fontFamily: 'HelveticaNeueBold', fontSize: 15,}}>10 KM</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
    },
});
