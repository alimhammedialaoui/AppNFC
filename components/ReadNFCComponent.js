import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity, Platform, Button, ScrollView} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {Card} from 'react-native-elements';
import Service from './Service';
import {credentials} from './Constants';
import EncryptionService from './EncryptionService';

class ReadNfc extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            buttonPressed: false,
            nom: null,
            prenom: null,
            tagId: null,
            date: null,
            liste: [],
        };
    }


    componentDidMount = async () => {
        this.setState({
            nom: null,
            prenom: null,
        });
        NfcManager.start();
        await Service.authenticate(credentials.username, credentials.password).then(r => {
            global.token = r.data.jwt;
        });
    };

    componentWillUnmount() {
        this._cleanUp();
    }

    readTagButton = async () => {

        if (!this.state.buttonPressed) {
            this.setState({buttonPressed: true});
            await this._test();

        } else {
            await this._cleanUp();
            this.setState({buttonPressed: false});
        }
    };

    readRegisterInformation = (response) => {

        response.data.map(register => {
            var infos = {
                tagId: register.uid,
                date: register.registerDate,
            };
            var infoliste = this.state.liste;
            infoliste.push(infos);
            this.setState({liste: infoliste});
        });
    };

    render() {
        if (this.state.data === null) {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image style={{width: 150, height: 150}} source={require('./images/nfc-sign.png')}/>

                    {!this.state.buttonPressed && <Button title="Read Tag" onPress={this.readTagButton}/>}
                    {this.state.buttonPressed && <Button title="Cancel" onPress={this.readTagButton}/>}
                    <Text>{'\n'}Tap here to read </Text>
                </View>
            );
        } else {
            if (this.state.liste != null) {
                return (
                    <ScrollView style={{flex: 1}}>
                        {this.state.liste.map((infos,key) => {
                            return (
                                <Card title={'Register '+(key+1)} titleStyle={{fontSize: 20}}>
                                    <Text>UID : {infos.tagId} </Text>
                                    <Text>Date : {infos.date} </Text>
                                </Card>

                            );
                        })}
                        <View style={{marginTop: 10, position: 'relative'}}>
                            <Button style={{padding: 170}} title="Read another tag"
                                    onPress={() => this.setState({data: null, buttonPressed: false})}/>
                        </View>
                    </ScrollView>
                );
            } else {
                return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text>No data available</Text>
                    <View style={{marginTop: 170}}>
                        <Button style={{padding: 170}} title="Read another tag"
                                onPress={() => this.setState({data: null, buttonPressed: false})}/>
                    </View>
                </View>;
            }
        }


    }

    bin2String(array) {
        return String.fromCharCode.apply(String, array);
    }

    stringtoJSON(string) {
        return JSON.parse(string);
    }

    _cleanUp = () => {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
    };

    _test = async () => {
        try {
            let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
            let resp = await NfcManager.requestTechnology(tech, {
                alertMessage: 'Ready to do some custom Mifare cmde!',
            });
            let tag = await NfcManager.getTag();
            let tagId = tag.id;
            let data = tag.ndefMessage[0].payload.slice(3);

            this.setState({data: this.bin2String(data)});
            var decryptedText = EncryptionService.decrypt(this.state.data);
            var outputJson = JSON.parse(decryptedText);
            await Service.TagRegister(outputJson).then((r) => {
                    this._cleanUp();
                    this.readRegisterInformation(r);
                },
            ).catch(() => alert('No network connection'));
        } catch (ex) {
            NfcManager.unregisterTagEvent().catch(() => 0);
        }

    };
}

export default ReadNfc;
