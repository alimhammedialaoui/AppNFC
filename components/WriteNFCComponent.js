import React, {Component, useState} from 'react';
import {Text, View, TextInput, Image, Button, Modal, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-elements';
import NfcManager, {NdefParser, NfcTech} from 'react-native-nfc-manager';
import NFCService from './NFCService';
import {Root, Popup, Toast} from 'popup-ui';

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
            writeError:false
        };


    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this._cleanUp();
    }

    handleChangeNom = (text) => {
        this.setState(
            {textInputNom: text},
        );
    };

    handleChangePrenom = (text) => {
        this.setState(
            {textInputPrenom: text},
        );
    };

    writeButton = () => {
        this.setState({buttonPressed: true});
        const json = {
            nom: this.state.textInputNom,
            prenom: this.state.textInputPrenom,
        };
        const string = JSON.stringify(json);
        this._runTest(string);
    };

    cancelButton = () => {
        this.setState({buttonPressed: false});
        this._cleanUp();
    };

    render() {
        let {supported, enabled, tag, text, parsedText, isTestRunning} = this.state;

        const style = {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 4,
            width: 250,
            marginBottom: 20,
        };

        const theme = {
            colors: {
                primary: '#006aff',
            },
        };

        return (
            <Root>
                <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
                    <Card title={'Informations'} titleStyle={{fontSize: 20}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{marginBottom: 10, marginRight: 35, fontSize: 20}}>Nom </Text>
                            <TextInput style={style}
                                       placeholder={'Nom'}
                                       onChangeText={this.handleChangeNom}
                                       value={this.state.textInputNom}
                                       theme={theme}
                            />
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{marginBottom: 10, marginRight: 5, fontSize: 20}}>Prénom </Text>
                            <TextInput style={style}
                                       placeholder={'Prenom'}
                                       onChangeText={this.handleChangePrenom}
                                       value={this.state.textInputPrenom}
                            />
                        </View>
                        <View>
                            {!this.state.buttonPressed && <Button title="Write" onPress={this.writeButton}/>}
                            {/*{this.state.buttonPressed && <Button title="Cancel" onPress={this.writeButton}/>}*/}
                            <Modal transparent={true} visible={this.state.buttonPressed}>
                                <View style={{backgroundColor: '#000000aa', flex: 1}}>
                                    <View style={{
                                        backgroundColor: '#ffffff',
                                        marginTop: 150,
                                        marginBottom: 150,
                                        marginRight: 50,
                                        marginLeft: 50,
                                        padding: 35,
                                        borderRadius: 10,
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Text style={{fontSize: 24}}>Write in the Tag</Text>
                                        <Image style={{width: 150, height: 150, justifyContent: 'center'}}
                                               source={require('./images/nfc-sign.png')}/>
                                        <Text style={{marginBottom: 30}}>Tap here read the
                                            tag {this.state.textInput}</Text>
                                        <Button title={'Cancel'} onPress={this.cancelButton}
                                                style={{borderRadius: 30}}/>
                                    </View>
                                </View>
                            </Modal>
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
                                        <Image style={{width: 75, height: 75, justifyContent: 'center',marginTop:30}}
                                               source={require('./images/unnamed.png')}/>
                                        <TouchableOpacity
                                            onPress={()=>this.setState({dataWritten:false})}
                                            style={{borderRadius:30,backgroundColor:"#56d246",width:100,height:40,elevation: 8,paddingVertical: 10,
                                                paddingHorizontal: 12,alignItems:"center",justifyContent:"center",marginTop:30}}>
                                            <Text style={{flex:1,color:"white"}}>Ok</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </Card>

                    <View style={{alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: 51}}>


                    </View>
                </View>
            </Root>
        );
    }

    _cleanUp = () => {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
    };

    _runTest = textToWrite => {
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
            .then(tag => {
                console.log(JSON.stringify(tag));
            })
            .then(() => NfcManager.getNdefMessage())
            .then(tag => {

                let parsedText = parseText(tag);
                this.setState({tag, parsedText});
            })
            .then(() => NfcManager.writeNdefMessage(NFCService.buildTextPayload(textToWrite)))
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
