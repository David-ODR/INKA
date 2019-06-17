import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, FlatList, Dimensions, AsyncStorage, Geolocation, Picker, RefreshControl, Animated,
  BackHandler, PermissionsAndroid, ImageBackground
} from 'react-native';
import {
  TextInput, BottomNavigation, Button, Title, Surface, Avatar, Card, Appbar, Searchbar, Paragraph, Caption, FAB, Portal,
  ActivityIndicator, Divider, Subheading, Snackbar, TouchableRipple, Dialog, Drawer, Colors
} from 'react-native-paper';
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons';
import { Permissions, Location } from 'expo';

export default class Merchants extends React.Component {
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
    range: "5",
    visible: false,
    categoryvisible: false,
    category: "0",
    x: new Animated.Value(-500),
    keyword: "",
    draweropen: false,
    pageloading: true,
    categorylist: []
  };

  componentDidMount() {
    this.getlist()
    this.getcategorylist();
  } 

  getlist = async () => {
    this.setState({pageloading: true})
    const value = await AsyncStorage.getItem('devicetoken');
    const distance = await AsyncStorage.getItem('distance'); 
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ longitude: position.coords.longitude })
        this.setState({ latitude: position.coords.latitude })

        fetch(`http://Inkafoodapp.com/Api/Consumer/Business/NearMe/${position.coords.longitude},${position.coords.latitude}/${distance}`,
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
        timeout: 50000,
        maximumAge: 50000
      }
    );

  }

  getlistbycategory = async () => {
    this.setState({pageloading: true})
    const value = await AsyncStorage.getItem('devicetoken');
    const distance = await AsyncStorage.getItem('distance'); 
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ longitude: position.coords.longitude })
        this.setState({ latitude: position.coords.latitude })

        fetch(`http://Inkafoodapp.com/Api/Consumer/Business/Category/${this.state.category}/${position.coords.longitude},${position.coords.latitude}/${distance}?Country=Philippines`,
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

  getlistbykeyword = async (keyword) => {
    this.setState({pageloading: true})
    const value = await AsyncStorage.getItem('devicetoken');
    const distance = await AsyncStorage.getItem('distance'); 
    if(keyword.length === 0 )
    this.getlist();
    else 
    {
      navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ longitude: position.coords.longitude })
        this.setState({ latitude: position.coords.latitude })

        fetch(`http://Inkafoodapp.com/Api/Consumer/Business/Keywords/${keyword}/${position.coords.longitude},${position.coords.latitude}/${distance}?Country=Philippines`,
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
            this.setState({pageloading: false})
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
      }))
      .catch((error) => {
        console.log(error);
        alert(error)
      });
  }

  render() {
    let screenwidth = Dimensions.get('window').width;
    if (this.state.pageloading === true)
    return(
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} animating={true} color={Colors.red800} /> 
      </View>
    )
    else
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

          {/* VERTICAL SCROLLING CARDS */}

          <FlatList
            style={{ marginBottom: 70 }}
            data={this.state.data.branches}
            keyExtractor={item => item.branchProfileId.toString()} 
            initialNumToRender={6}
            removeClippedSubviews={true}
            ListEmptyComponent={() =>
              (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: screenwidth, height: 200 }}>
                  <Avatar.Icon size={80} icon="restaurant-menu" />
                  <Subheading>No Restaurants Available</Subheading>
                </View>
              )}
            renderItem={({ item }) => ( 
                <Card style={styles.cardstyle}>
                  <TouchableRipple
                    onPress={() => this.props.navigation.push("Merchantinfo", {
                      businessinfo: item,
                      longitude: this.state.longitude,
                      latitude: this.state.latitude,
                      businessId: item.businessProfileId
                    })}
                    rippleColor="rgba(0, 0, 0, .32)"
                  >
                    <ImageBackground style={{width: '100%', height: 240}} source={{ uri: item.coverPhotoUrl }} >
                    <Avatar.Image style={{margin: 15}} size={90} source={{uri: item.profileImageUrl}} />
                    </ImageBackground>
                  </TouchableRipple>  
                  <Card.Actions>
                    <Paragraph style={{color: "#E22539", marginRight: 'auto', flex: 1, flexDirection: 'column',  flexWrap: 'wrap', marginTop: -15}}>{item.businessName}</Paragraph>
                    <Button style={{marginLeft: 'auto', marginTop: -15}} icon="location-on">
                      <Paragraph style={{color: "#E22539"}}>{item.distanceToString} </Paragraph>
                    </Button> 
                    <Button  style={{marginTop: -15}}icon="favorite">
                    <Paragraph style={{color: "#E22539"}}>{item.reactionCount}</Paragraph>
                    </Button>                                  
                 
                  </Card.Actions>
                  <Card.Actions>
                  <Caption style={{marginTop: -30, marginBottom: 10}}>{item.internalAddress}</Caption>    
                  </Card.Actions>
                 
                </Card> 
            )}
          />

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
              <Button mode="text" onPress={() => this.closeDrawer()} style={{marginTop: 25}} icon="close"/>
            </View>
            <Divider />
            <Drawer.Item
              label="All"
              active={this.state.category === '0'}
              onPress={() => {
                this.setState({ category: '0' });
                this.getlist();
                this.closeDrawer();
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
    margin: 5
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
  },
  Dividerstyle: {
    marginTop: 20,
    marginBottom: 15
  },
  horizontalCardStyle: {
    borderWidth: 0,
    width: screenwidth / 1.3,
    margin: 5
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
