import React, {Component} from 'react';
import {View} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import ReadNfc from './ReadNFCComponent';
import WriteNfc from './WriteNFCComponent';
import FormatNfc from './FormatNFCComponent';
import About from './AboutNFCComponent';
import {createStackNavigator} from '@react-navigation/stack';
import NfcManager from 'react-native-nfc-manager';

const Tab = createMaterialBottomTabNavigator();

const Stack = createStackNavigator();


function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Read"
            shifting={true}
            sceneAnimationEnabled={false}
            barStyle={{backgroundColor: '#3a954f'}}>
            <Tab.Screen
                name="Read"
                component={ReadNfc}
                options={{
                    tabBarIcon: 'nfc',
                }}/>
            <Tab.Screen
                name="Write"
                component={WriteNfc}
                options={{
                    tabBarIcon: 'pencil',
                }}/>
            {/*<Tab.Screen
                name="Format"
                component={FormatNfc}
                options={{
                    tabBarIcon: 'eraser',
                }}/>*/}
            <Tab.Screen
                name="Infos"
                component={About}
                options={{
                    tabBarIcon: 'information',
                }}/>
        </Tab.Navigator>
    );
}


function Header() {

    return (
        <View style={{flex: 1}}>
            <Stack.Navigator>
                <Stack.Screen
                    name="ReadNFC"
                    component={MyTabs}
                    options={{
                        title: 'NFC App',
                        headerTintColor: '#ffffff',
                        headerStyle: {
                            backgroundColor: '#3a954f',
                        },
                        headerTitleStyle: {
                            alignSelf: 'center',
                            justifyContent: 'center',
                        },
                    }}/>
            </Stack.Navigator>
        </View>
    );
}


class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            supported: false,
            enabled: false,
            isTestRunning: false,
            text: 'hi, nfc!',
            parsedText: null,
            tag: null,
        };
    }


    componentDidMount() {
        NfcManager.isSupported()
            .then(supported => {
                this.setState({supported});
                if (supported) {
                    this._startNfc();
                }else{
                    alert("Your device doesn't support NFC")
                }
            });
    }

    componentWillUnmount() {
        if (this._stateChangedSubscription) {
            this._stateChangedSubscription.remove();
        }
    }


    render() {

        return (
            <View style={{flex: 1}}>
                <Header />
            </View>
        );
    }


    _cancelTest = () => {
        NfcManager.cancelTechnologyRequest()
            .catch(err => console.warn(err));
    };


    _startNfc = () => {
        NfcManager.start()
            .then(() => NfcManager.isEnabled())
            .then(enabled => this.setState({enabled}))
            .catch(err => {
                console.warn(err);
                this.setState({enabled: false});
            });
    };

    _clearMessages = () => {
        this.setState({tag: null, parsedText: null});
    };

}


export default Main;
