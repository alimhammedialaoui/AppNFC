import React, {Component} from 'react';
import {Button, Image, Modal, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Card} from 'react-native-elements';
import NfcManager, {NdefParser, NfcTech} from 'react-native-nfc-manager';
import NFCService from './NFCService';
import {Root} from 'popup-ui';
import Service from './Service';
import {credentials} from './Constants';
import EncryptionService from './EncryptionService';

class WriteNfc extends Component {

    constructor(props) {
        super(props);
        this.state = {
            placeholder: 'Type here your message',
            textInputNom: '',
            textInputPrenom: '',
            supported: false,
            enabled: false,
            isTestRunning: false,
            parsedText: null,
            tag: null,
            buttonPressed: false,
            dataWritten: false,
            writeError: false,
            textToSend: null,
            listTagUsers: null,
            listUsers: null,
            listToWrite: [],
            Date: null,
        };
    }

    componentDidMount = async () => {
        await Service.authenticate(credentials.username, credentials.password).then(r => {
            global.token = r.data.jwt;
        });
        await Service.GetAllTagUser().then(response => this.setState({listTagUsers: (response.data)}));
        global.users = [];
        global.personnes = [];
        if (this.state.listTagUsers != null) {
            this.state.listTagUsers.map(async taguser => {
                await Service.GetUserById(taguser.personne_id).then(response => {
                    personnes.push(
                        {
                            TAG: taguser.uid,
                            nom: response.data.nom,
                            prenom: response.data.prenom,
                        },
                    );
                });
                this.setState({listUsers: personnes});
            });
        }
        global.liste = [];

    };

    componentWillUnmount() {
        this._cleanUp();
    }


    writeButton = () => {
        this.setState({buttonPressed: true});
        this._runTest(this.state.listToWrite);
    };


    addElement = (user, key) => {
        var myList = liste;
        var register =
            {
                m: user.TAG + ',' + this.getDateNow(),
            };
        myList.push(register);
        liste = myList;
        this.setState({listToWrite: liste});
        this.remove(personnes, personnes[key]);
    };

    remove = (array, element) => {
        const index = array.indexOf(element);
        array.splice(index, 1);
    };

    getDateNow = () => {
        var date = new Date().getDate();
        if (date < 10) {
            date = '0' + date;
        }
        var month = new Date().getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var year = new Date().getFullYear();
        var hour = new Date().getHours();
        if (hour < 10) {
            hour = '0' + hour;
        }
        var minutes = new Date().getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        var seconds = new Date().getSeconds();
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return '' + date + '/' + month + '/' + year + ' ' + hour + ':' + minutes + ':' + seconds + '';
    };

    render() {

        return (
            <Root>
                <ScrollView style={{flex: 1, marginTop: 0}} contentContainerStyle={{alignItems: 'center'}}>
                    {this.state.listUsers && this.state.listUsers.map((user, key) => {
                        return (
                            <Card title={'Personne ' + (key + 1)} titleStyle={{fontSize: 20}}
                                  wrapperStyle={{width: 300}}>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{flexDirection: 'column'}}>
                                        <Text style={{marginBottom: 20, marginRight: 35, fontSize: 15}}>Tag
                                            : {user.TAG}  </Text>
                                        <Text style={{marginBottom: 20, marginRight: 35, fontSize: 15}}>Nom
                                            : {user.nom} </Text>
                                        <Text style={{marginBottom: 30, marginRight: 35, fontSize: 15}}>Prenom
                                            : {user.prenom} </Text>

                                    </View>
                                    <View style={{marginTop: 40, marginLeft: 200, width: 100, position: 'absolute'}}>
                                        <Button title={'Add'} onPress={() => this.addElement(user, key)}/>
                                    </View>
                                </View>
                            </Card>
                        );
                    })}
                    <View style={{marginTop: 10, width: 100, marginBottom: 10}}>
                        <Button title={'Write'} onPress={this.writeButton}/>
                    </View>
                </ScrollView>
                <Modal transparent={true} visible={this.state.dataWritten}>
                    <View style={{backgroundColor: '#000000aa', flex: 1}}>
                        <View style={{
                            backgroundColor: '#ffffff',
                            marginTop: 150,
                            marginBottom: 150,
                            marginRight: 50,
                            marginLeft: 50,
                            padding: 30,
                            borderRadius: 10,
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{fontSize: 20}}>Written successfully</Text>
                            <Image style={{width: 75, height: 75, justifyContent: 'center', marginTop: 30}}
                                   source={require('./images/unnamed.png')}/>
                            <TouchableOpacity
                                onPress={() => this.setState({dataWritten: false})}
                                style={{
                                    borderRadius: 30,
                                    backgroundColor: '#56d246',
                                    width: 100,
                                    height: 40,
                                    elevation: 8,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 30,
                                }}>
                                <Text style={{flex: 1, color: 'white'}}>Ok</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            </Root>
        );

    }

    _cleanUp = () => {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
    };

    _runTest = (textToWrite) => {
        var message = JSON.stringify(textToWrite)
        var encryptedText = EncryptionService.encrypt(message)
        const cleanUp = () => {
            this.setState({isTestRunning: false});
            NfcManager.closeTechnology();
            NfcManager.unregisterTagEvent();
        };

        const parseText = (tag) => {
            if (tag.ndefMessage) {
                return NdefParser.parseText(tag.ndefMessage[0]);
            }
            return null;
        };


        this.setState({isTestRunning: true});
        NfcManager.registerTagEvent(tag => console.log(tag), '', {})
            .then(() => NfcManager.requestTechnology(NfcTech.Ndef))
            .then(() => NfcManager.getTag())
            .then(() => NfcManager.getNdefMessage())
            .then(tag => {
                let parsedText = parseText(tag);
                this.setState({tag, parsedText});
            })
            .then(() => NfcManager.writeNdefMessage(NFCService.buildTextPayload(encryptedText)))
            .then(() => {
                this.setState({buttonPressed: false, dataWritten: true});
                cleanUp();
            })
            .catch(err => {
                cleanUp();
            });


    };


}

export default WriteNfc;
