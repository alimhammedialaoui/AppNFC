import 'react-native-gesture-handler';
import React, {Component} from 'react';
import MainComponent from './components/MainComponent';
import {NavigationContainer} from '@react-navigation/native';
import {Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import ReadNfc from './components/ReadNFCComponent';
import WriteNfc from './components/WriteNFCComponent';
import FormatNfc from './components/FormatNFCComponent';
import {createStackNavigator} from '@react-navigation/stack';

function HeaderApp() {

    return (

        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 45,
                marginTop: 0,
                backgroundColor: '#3a954f',
                justifyContent: 'center',
            }}>
            <Text
                style={{
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 18,
                }}>
                NFC app
            </Text>
        </View>
    );
}

const Stack = createStackNavigator();

const options = {
    title: 'Read NFC',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#3a954f',
    },
};


function Header() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Read NFC"
                component={ReadNfc}
                options={options}/>
            <Stack.Screen
                name="Write NFC"
                component={WriteNfc}
                options={{...options, title: 'Write NFC'}}/>
            <Stack.Screen
                name="Format NFC"
                component={FormatNfc}
                options={{...options, title: 'Format NFC'}}/>
        </Stack.Navigator>

    );
}


class App extends Component {
    render() {
        return (
            <View style={{ flex: 1}}>
                <NavigationContainer>
                    <MainComponent/>
                </NavigationContainer>
            </View>
        );
    }
}


export default App;
