import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import Menu from './MenuComponent'
import Home from './HomeComponent'
import Contact from './ContactComponent'
import DishDetail from './DishDetailComponent';
import {createStackNavigator, createDrawerNavigator} from 'react-navigation';


const MenuNavigator = createStackNavigator({
    Menu: {screen: Menu},
    DishDetail: {screen: DishDetail}
}, {
    initialRouteName: 'Menu',
    navigationOptions: {
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        }
    }
});

const ContactNavigator = createStackNavigator({
    Contact: {screen: Contact},
}, {
    initialRouteName: 'Contact',
    navigationOptions: {
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        }
    }
});

const HomeNavigator = createStackNavigator({
    Home: {screen: Home}
}, {
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTitleStyle: {
            color: '#fff'
        },
        headerTintColor: '#fff'
    })
});

const MainNavigator = createDrawerNavigator({
    Home: {
        screen: HomeNavigator,
        navigationOptions: {
            title: 'Home',
            drawerLabel: 'Home'
        }
    },
    Menu: {
        screen: MenuNavigator,
        navigationOptions: {
            title: 'Menu',
            drawerLabel: 'Menu'
        },
    },
    Contact: {
        screen: ContactNavigator,
        navigationOptions: {
            title: 'Contact',
            drawerLabel: 'Contact'
        },
    }
}, {
    drawerBackgroundColor: '#D1C4E9'
});

class Main extends Component {

    render() {
        return(
            <View style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 0}}>
                <MainNavigator/>
            </View>
        );
    }
}

export default Main