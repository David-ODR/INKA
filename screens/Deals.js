import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, FlatList, Dimensions, AsyncStorage, Geolocation, Picker, RefreshControl, Animated,
  BackHandler, PermissionsAndroid
} from 'react-native';
import {
  TextInput, BottomNavigation, Button, Title, Surface, Avatar, Card, Appbar, Searchbar, Paragraph, Caption, FAB, Portal,
  ActivityIndicator, Divider, Subheading, Snackbar, TouchableRipple, Dialog, Drawer, Colors
} from 'react-native-paper';
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons';
import { Permissions, Location } from 'expo';

export default class Deals extends React.Component {
  static navigationOptions = {
    //header: <SearchHeaders pageview={"Deals"} />
    header: null,
  };

  state = {
    status: null,
    email: '',
    password: '',
    confirmpassword: '',
    loading: false,
    data: [],
    error: null,
    refreshing: false,
    visible: false,
    longitude: 0,
    latitude: 0,
    range: 5,
    visible: false,
    categoryvisible: false,
    category: "0",
    x: new Animated.Value(-500),
    keyword: "",
    draweropen: false,
    categorylist: [],
    pageloading: true
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    this.permissionFlow();
    this.getcategorylist();
  }

  permissionFlow = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    this.setState({ status });

    if (status !== 'granted') {
      alert('Please allow Location permission in the settings and enable your location')
      Linking.openURL('app-settings:');
      return;
    }
    else {
      return this.checktoken();
    }
  };

  checktoken = async () => {
    const value = await AsyncStorage.getItem('devicetoken');
    if (value !== null)
      this.loginuser(value)
    else {
      await AsyncStorage.setItem('usertype', "NewUser").then(this.props.navigation.navigate("Settings"))

    }
  }

  loginuser(value) {
    this.getlist();
  }

  getlist = async () => { 
     
    this.setState({ pageloading: true })
    const value = await AsyncStorage.getItem('devicetoken');
    const distance = await AsyncStorage.getItem('distance');
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ longitude: position.coords.longitude })
        this.setState({ latitude: position.coords.latitude })

        fetch(`http://Inkafoodapp.com/Api/Consumer/Coupon/NearMe/${position.coords.longitude},${position.coords.latitude}/${distance}?Country=Philippines`,
          {
            headers: {
              'Authorization': 'Bearer ' + value,
              'content-type': 'application/json',
            }
          })
          .then((response) => response.json())
          .then((result => {
            console.log("Success loading default coupons")
            this.setState({ data: result })
            this.setState({ pageloading: false })
            this.closeDrawer(); 
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

  getlistbycategory = async () => {

    const value = await AsyncStorage.getItem('devicetoken');
    const distance = await AsyncStorage.getItem('distance');
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ longitude: position.coords.longitude })
        this.setState({ latitude: position.coords.latitude })

        fetch(`http://Inkafoodapp.com/Api/Consumer/Coupon/Category/${this.state.category}/${position.coords.longitude},${position.coords.latitude}/${distance}?Country=Philippines`,
          {
            headers: {
              'Authorization': 'Bearer ' + value,
              'content-type': 'application/json',
            }
          })
          .then((response) => response.json())
          .then((result => {
            this.setState({ data: result })
            this.setState({ pageloading: false })
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

  getlistbykeyword = async (keyword) => {
    this.setState({ pageloading: true })
    const value = await AsyncStorage.getItem('devicetoken');
    const distance = await AsyncStorage.getItem('distance');
    if (keyword.length === 0)
      this.getlist();
    else {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({ longitude: position.coords.longitude })
          this.setState({ latitude: position.coords.latitude })

          fetch(`http://Inkafoodapp.com/Api/Consumer/Coupon/${keyword}/${position.coords.longitude},${position.coords.latitude}/${distance}?Country=Philippines`,
            {
              headers: {
                'Authorization': 'Bearer ' + value,
                'content-type': 'application/json',
              }
            })
            .then((response) => response.json())
            .then((result => {
              console.log("Success loading default coupons")
              this.setState({ data: result })
              this.setState({ pageloading: false })
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

  }

  scrolltotop() {
    this.refs.listref.scrollTo(0)
  }

  _showDialog = () => this.setState({ visible: true });
  _hideDialog = () => {
    this.setState({ visible: false });
    this.getlist();
  };
  canceldialog = () => {
    this.setState({ visible: false });
  }

  showcategory = () => {
    this.setState({ categoryvisible: true });
  }
  slide = () => {
    Animated.spring(this.state.x, {
      toValue: 0,
    }).start();
    this.props.navigation.openDrawer();
    this.setState({ draweropen: true })
  };

  slideback = () => {
    Animated.spring(this.state.x, {
      toValue: -500,
    }).start();
    this.getlistbycategory();
    this.props.navigation.closeDrawer();
    this.setState({ draweropen: false })
    if (this.state.x === -500)
    this.setState({ pageloading: true })
  };

  allselect = () => { 
    this.getlist();
    this.props.navigation.closeDrawer();
  }

  closeDrawer = () => {
    Animated.spring(this.state.x, {
      toValue: -500,
    }).start();
    this.props.navigation.closeDrawer();  
  }

  handleBackButton() {
    if (this.state.draweropen === true) {
      Animated.spring(this.state.x, {
        toValue: -500,
      }).start();
      this.props.navigation.closeDrawer();
      return true;
    }
    else
      return false
  }

  getcategorylist = async () => {
    const value = await AsyncStorage.getItem('devicetoken');
    fetch("http://Inkafoodapp.com/Api/Consumer/Coupon/Category",
      {
        headers: {
          'Authorization': 'Bearer ' + value,
          'content-type': 'application/json',
        }
      })
      .then((response) => response.json())
      .then((result => {
        this.setState({ categorylist: result })
        this.closeDrawer();
      }))
      .catch((error) => {
        console.log(error);
        alert(error)
      });
  }

  render() {
    let screenwidth = Dimensions.get('window').width;

    if (this.state.pageloading === true)
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size={"large"} animating={true} color={Colors.red800} />
        </View>
      );

    return (
      <View>
        <Appbar.Header>

          <Appbar.Action icon={() => <MaterialIcon size={26} name="filter-outline" color={Colors.white} />} onPress={() => this.slide()} />
          <View style={styles.searchcontainer}>
            <Searchbar
              style={styles.searchbarstyle}
              placeholder="Search..."
              placeholderTextColor="#E8E8E8"
              onChangeText={text => this.getlistbykeyword(text)}
            />
          </View>
          <Appbar.Action icon="add-location" icon={() => <MaterialIcon size={26} name="map-marker-circle" color={Colors.white} />}
            onPress={() => this.props.navigation.navigate("Nearby", { getlist: this.getlist.bind(this) })} />
        </Appbar.Header>

        <ScrollView style={styles.container} ref="_scrollView"
          refreshControl={<RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.getlist}
          />}
        >
          <Subheading>Featured Coupons</Subheading>
          <View style={{
            width: screenwidth,
            flex: 1,
            justifyContent: "center",
            alignItems: 'center'
          }}>
            {/* HORIZONTAL SCROLLING CARDS */}
            <FlatList
              data={this.state.data.featuredCoupons}
              keyExtractor={item => item.couponId.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              initialNumToRender={4}
              removeClippedSubviews={true}
              ListEmptyComponent={() =>
                (
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: screenwidth, height: 200 }}>
                    <Avatar.Icon size={80} icon="location-off" />
                    <Subheading>No Featured Coupons Available</Subheading>
                  </View>
                )}

              renderItem={({ item }) =>
                (
                  <Card style={styles.horizontalCardStyle} elevation={0} >
                    <TouchableRipple
                      onPress={() => this.props.navigation.push("Dealinfo", {
                        couponinfo: item,
                        longitude: this.state.longitude,
                        latitude: this.state.latitude,
                      })}
                      rippleColor="rgba(0, 0, 0, .32)"
                    >
                      <Card.Cover source={{ uri: item.imageUrl }} />
                    </TouchableRipple>
                    <Card.Content>
                      <Paragraph style={styles.paragraphstyle}>{item.name}</Paragraph>
                      <Caption>{item.businessName}</Caption>
                    </Card.Content>
                    <Card.Actions>
                      <Button icon="location-on">
                        {item.distanceToString}
                      </Button>
                      <Caption>|</Caption>
                      <Button icon="favorite">
                        {item.likes}
                      </Button>
                    </Card.Actions>
                  </Card>
                )}
            />
          </View>
          <Divider style={styles.Dividerstyle} />
          <Subheading>All Coupons</Subheading>

          {/* VERTICAL SCROLLING CARDS */}
          <View style={styles.cardrender}>
            <FlatList
              style={{ marginBottom: 70 }}
              data={this.state.data.coupons}
              keyExtractor={item => item.couponId.toString()}
              numColumns={2}
              initialNumToRender={6}
              removeClippedSubviews={true}
              ListEmptyComponent={() =>
                (
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: screenwidth, height: 200 }}>
                    <Avatar.Icon size={80} icon="location-off" />
                    <Subheading>No Coupons Available</Subheading>
                  </View>
                )}
              renderItem={({ item }) => (

                <Card style={styles.cardstyle} >
                  <TouchableRipple
                    onPress={() => this.props.navigation.push("Dealinfo", {
                      couponinfo: item,
                      longitude: this.state.longitude,
                      latitude: this.state.latitude,
                    })}
                    rippleColor="rgba(0, 0, 0, .32)"
                  >
                    <Card.Cover source={{ uri: item.imageUrl }} />
                  </TouchableRipple>
                  <Card.Content>
                    <Paragraph style={styles.paragraphstyle}>{item.name}</Paragraph>
                    <Caption>{item.businessName}</Caption>
                  </Card.Content>
                  <Card.Actions>
                    <Button icon="location-on">
                      {item.distanceToString}
                    </Button>
                    <Caption>|</Caption>
                    <Button icon="favorite">
                      {item.likes}
                    </Button>
                  </Card.Actions>
                </Card>

              )}
            />
          </View>

        </ScrollView>
        {/* {<Portal>
          <FAB
            style={styles.fab}
            icon="keyboard-arrow-up"
            onPress={() => { this.refs._scrollView.scrollTo({ y: 0, animated: true }); }}
          />
        </Portal>} */}

        <Portal style={{ backgroundColor: '#fff' }}>

          {/* CATEGORY DRAWER */}
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            style={[{ backgroundColor: 'white', width: 260 }, {
              transform: [
                {
                  translateX: this.state.x
                }
              ]
            }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'HelveticaNeue-Black', fontWeight: 'bold', fontSize: 25, margin: 15 }}>Category</Text>
              <Button mode="text" onPress={() => this.closeDrawer()} style={{ marginTop: 25 }} icon="close" />
            </View>
            <Divider />

            <Drawer.Item
              label="All"
              active={this.state.category === '0'}
              onPress={() => {
                this.setState({ category: '0' });
                this.allselect();
              }}
            />

            <FlatList
              data={this.state.categorylist.categories}
              keyExtractor={item => item.categoryId.toString()}
              renderItem={({ item }) =>
                <Drawer.Item
                  label={item.categoryName}
                  active={this.state.category === item.categoryId}
                  onPress={() => {
                    this.setState({ category: item.categoryId });
                    this.slideback();
                  }}
                />
              }
            />


          </Animated.ScrollView>

        </Portal>
      </View>

    );
  }
}
let screenwidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },

  appbarstyle: {
    height: 80
  },
  cardrender: {
    flex: 1,
    padding: 5
  },
  fab: {
    borderRadius: 30,
    backgroundColor: '#262626',
    position: 'absolute',
    bottom: 60,
    right: 10
  },
  searchbarstyle: {
    borderRadius: 10,
  },
  scrollviewcontainer: {
    marginBottom: 40
  },
  loadingcontainerstyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardstyle: {
    elevation: 2,
    margin: 5,
    flex: 1,
    height: 'auto',
    width: 200
  },
  Dividerstyle: {
    marginTop: 20,
    marginBottom: 15
  },
  horizontalCardStyle: {
    width: screenwidth / 1.3,
    margin: 5,
    elevation: 1
  },
  paragraphstyle: {
    fontWeight: 'bold',
    color: '#CA2D40'
  },
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
});
