import React from 'react';
import { StatusBar, StyleSheet, Text, ScrollView } from 'react-native';
import Login from './screens/Login';
import Register from './screens/Register';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createDrawerNavigator, createMaterialTopTabNavigator, } from "react-navigation";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Deals from './screens/Deals';
import Coupons from './screens/Coupons';
import Profile from './screens/Profile';
import Merchants from './screens/Merchants';
import Merchantinfo from './screens/Merchantinfo';
import Notification from './screens/Notification';
import Icon from '@expo/vector-icons/MaterialCommunityIcons'; 
import Nearby from './screens/Nearby'; 
import EditProfile from './screens/EditProfile';
import Dealinfo from './screens/Dealinfo';
import CategoryDrawer from './screens/CategoryDrawer'; 
import Points from './screens/ActivityScreens/Points';
import Grabbed from './screens/ActivityScreens/Grabbed';
import Redeemed from './screens/ActivityScreens/Redeemed';
import Favorites from './screens/ActivityScreens/Favorites';
import LikedRestaurant from './screens/ActivityScreens/LikedRestaurant';

const dealsstacknav = createStackNavigator({
  
  Deals: Deals,    
  Nearby: Nearby, 
  Dealinfo: Dealinfo, 
  Merchantinfo: Merchantinfo
 
})

const Merchantsstacknav = createStackNavigator({
  Restaurants: Merchants, 
  Merchantinfo: Merchantinfo,
  Nearby: Nearby,
  Dealinfo: Dealinfo, 
})

const Profilestacknav = createStackNavigator({
  Settings: Profile,
  EditProfile: EditProfile,
  Login: Login,
  Register: Register

},{
  defaultNavigationOptions: {  
    headerStyle: {
      backgroundColor: '#E22539',
      elevation: 0, // remove shadow on Android
      shadowOpacity: 0, // remove shadow on iOS     
    },
    headerTintColor: '#fff', 
  }
})

const grabbedstacknav = createStackNavigator({
  Grabbed: Grabbed,
  Dealinfo: Dealinfo,
})

const redeemedstacknav = createStackNavigator({
  Redeemed: Redeemed,
  Dealinfo: Dealinfo
})

const favoritestacknav = createMaterialTopTabNavigator({
  Coupons: {
    screen: Favorites,
    navigationOptions: {
      tabBarIcon: ({ tintcolor }) => (
        <Icon name="thumb-up-outline" size={24} />
      ), 
    }
  }, 
  Restaurant: {
    screen: Favorites,
    navigationOptions: {
      tabBarIcon: ({ tintcolor }) => (
        <Icon name="thumb-up-outline" size={24} />
      ), 
    }},
},{tabBarOptions: {   
  style: {
    backgroundColor: '#fff',
  },
  indicatorStyle:{ 
    backgroundColor: '#fff', 
  }, 
  activeTintColor: '#E22539',
  inactiveTintColor: 'rgba(149, 165, 166, 0.3)'
}
})

const activitytopnav = createMaterialTopTabNavigator({
  Points: Points,
  Grabbed: grabbedstacknav,
  Redeemed: redeemedstacknav,
  Favorites: Favorites,
},
{tabBarOptions: {   
  style: {
    backgroundColor: '#E22539',
  },
  indicatorStyle:{ 
    backgroundColor: '#fff', 
  },
  labelStyle: {
    fontSize: 11,
  },
  activeTintColor: '#fff',
  inactiveTintColor: 'rgba(255, 255, 255, 0.5)'
},lazy: true
}
)

const activitytopstack = createStackNavigator({
  Activity: activitytopnav
},{
  defaultNavigationOptions: { 
    headerTitle:"Your Activity",
    headerStyle: {
      backgroundColor: '#E22539',
      elevation: 0, // remove shadow on Android
      shadowOpacity: 0, // remove shadow on iOS     
    },
    headerTintColor: '#fff',
    headerTitleStyle:{
      fontSize: 30, 
    }
  }, 
})

const notificationstack = createStackNavigator({
  Notification: Notification
}, {defaultNavigationOptions: { 
  headerTitle:"Notifications",
  headerStyle: {
    backgroundColor: '#E22539',     
  },
  headerTitleStyle:{
    fontSize: 30, 
  },
  headerTintColor: '#fff',
}})

const materialbottomtabnav = createMaterialBottomTabNavigator({
  Nearme : {
    screen: dealsstacknav,
    navigationOptions: {
      tabBarIcon: ({ tintcolor }) => (
        <Icon size={24} name="compass-outline" color={'white'} />
      ),
      header: null, 
    }
  },
  Activity : {
    screen: activitytopstack,
    navigationOptions: {
      tabBarIcon: ({ tintcolor }) => (
        <Icon size={24} name="tag-outline" color={'white'} />
      ),
      header: null, 
    }
  },
  Restaurants: {
    screen: Merchantsstacknav,
    navigationOptions: {
      tabBarIcon: ({ tintcolor }) => (
        <Icon size={24} name="store" color={'white'} />
      ),
      header: null, 
    }
  },
  Notification: {
    screen: notificationstack,
    navigationOptions: {
      tabBarIcon: ({ tintcolor }) => (
        <Icon size={24} name="bell" color={'white'} />
      ),
      header: null, 
    }
  },
  Settings: {
    screen: Profilestacknav,

    navigationOptions: {
      tabBarIcon: ({ tintcolor }) => (
        <Icon size={24} name="account" color={'white'} />
      ),
      header: null, 
    }
  }
}, {
    initialRouteName: 'Nearme',
    activeTintColor: '#fff',
    inactiveTintColor: '#8E8E93',
  }
);

const bottomstack = createStackNavigator({
  Mainpage: {
    screen: materialbottomtabnav,
    navigationOptions: {
      header: null
    }
  }
})

const bottomdrawer = createDrawerNavigator({
  Mainpage: bottomstack
},
{
  contentComponent: CategoryDrawer,
  drawerLockMode: 'locked-open',
}
)


const Navigationswitch = createSwitchNavigator({
  Deals: { screen: bottomdrawer },
});

const Appcontainer = createAppContainer(Navigationswitch);

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#E22539',
    accent: '#32936F', 
  }
};


class App extends React.Component {

  state = {
    loading: true
  }

  componentDidMount() {
    StatusBar.setHidden(true);
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'HelveticaNeue-Black': require('./assets/fonts/HelveticaNeue-Black.otf'),
      'HelveticaBlkIt': require('./assets/fonts/HelveticaBlkIt.ttf'),
      'HelveticaNeueBold': require('./assets/fonts/HelveticaNeueBold.ttf'),
    });
    this.setState({ loading: false });
  }


  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <PaperProvider theme={theme}>
        <Appcontainer />
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  burgericon: {
    paddingLeft: 15,
    color: "#EEF4ED"
  },
  container: {
    backgroundColor: '#fff'
  },
});

export default App;