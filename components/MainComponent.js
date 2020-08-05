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
            <Tab.Screen
                name="Format"
                component={FormatNfc}
                options={{
                    tabBarIcon: 'eraser',
                }}/>
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

        let {supported, enabled, tag, text, parsedText, isTestRunning} = this.state;
        return (
            <View style={{flex: 1}}>
                <Header />
            </View>
            // <ScrollView style={{flex: 1}}>
            //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
            //         <Text>{`Is NFC supported ? ${supported}`}</Text>
            //         <Text>{`Is NFC enabled (Android only)? ${enabled}`}</Text>
            //
            //         {
            //             <View style={{padding: 20, marginTop: 20, backgroundColor: '#f0f0f0'}}>
            //                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
            //                     <Text>Text to write:</Text>
            //                     <TextInput
            //                         value={text}
            //                         style={{marginLeft: 10, flex: 1}}
            //                         onChangeText={text => this.setState({text})}
            //                     />
            //                 </View>
            //
            //                 {!isTestRunning && (
            //                     <TouchableOpacity
            //                         style={{margin: 10}}
            //                         onPress={() => this._runTest(text)}
            //                     >
            //                         <Text style={{color: 'blue', textAlign: 'center', fontSize: 20}}>CLICK TO RUN
            //                             TEST</Text>
            //                     </TouchableOpacity>
            //                 )}
            //
            //                 {isTestRunning && (
            //                     <TouchableOpacity
            //                         style={{margin: 10}}
            //                         onPress={() => this._cancelTest()}
            //                     >
            //                         <Text style={{color: 'red', textAlign: 'center', fontSize: 20}}>CLICK TO CANCEL
            //                             TEST</Text>
            //                     </TouchableOpacity>
            //                 )}
            //
            //                 <Text style={{color: 'grey', textAlign: 'center'}}>
            //                     {`When the tag is available, this demo will:\n1. read original NdefMessage from the tag\n2. write a NdefMessage contains a RTD_TEXT into it `}
            //                 </Text>
            //             </View>
            //         }
            //
            //         <View style={{alignItems: 'center', justifyContent: 'center', padding: 20, marginTop: 20}}>
            //             <Text>{`Original tag content:`}</Text>
            //             <Text style={{marginTop: 5, color: 'grey'}}>{`${tag ? JSON.stringify(tag) : '---'}`}</Text>
            //             {parsedText && <Text style={{marginTop: 5}}>{`(Parsed Text: ${parsedText})`}</Text>}
            //         </View>
            //
            //         <TouchableOpacity style={{marginTop: 20, alignItems: 'center'}} onPress={this._clearMessages}>
            //             <Text style={{color: 'blue'}}>Clear above message</Text>
            //         </TouchableOpacity>
            //     </View>
            // </ScrollView>
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
