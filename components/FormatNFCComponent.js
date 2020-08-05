import React, {Component} from 'react';
import {Image, Modal, Text, TouchableOpacity, View, Linking, Platform} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import Service from './Service';
import NFCService from './NFCService';

class FormatNfc extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonFormatPressed: false,
            tagId: null,
        };
    }

    componentDidMount() {
        NfcManager.start();
    }

    componentWillUnmount() {
        NfcManager.closeTechnology();
        NfcManager.unregisterTagEvent();
        this._cleanUp();
    }


    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Format NFC</Text>
                <TouchableOpacity
                    onPress={this._requestFormat}
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
                    <Text style={{flex: 1, color: 'white'}}>Format</Text>
                </TouchableOpacity>
                <Modal transparent={true} visible={this.state.buttonFormatPressed}>
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
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize: 20}}>Are you sure?</Text>
                                <Text style={{fontSize: 15}}>All data will be removed</Text>
                            </View>
                            <Image style={{width: 75, height: 75, justifyContent: 'center', marginTop: 30}}
                                   source={require('./images/nfc-sign.png')}/>
                            <Text>Tap here to read the tag</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({buttonFormatPressed: false});
                                    NfcManager.closeTechnology();
                                    NfcManager.unregisterTagEvent();
                                }}
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
                                <Text style={{flex: 1, color: 'white'}}>Cancel</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    _requestFormat = async () => {

        try {
            const cleanUp = () => {
                NfcManager.closeTechnology();
                NfcManager.unregisterTagEvent();
            };

            this.setState({buttonFormatPressed: true});
            let tech = Platform.OS === 'ios' ? NfcTech.MifareIOS : NfcTech.NfcA;
            let resp = await NfcManager.requestTechnology(tech, {
                alertMessage: 'Ready to do some custom Mifare cmd!',
            });
            let tag = await NfcManager.getTag();
            let tagId = tag.id;

            this.setState({tagId: tagId});


            Service.deleteTag(this.state.tagId).then(() => this.setState({buttonFormatPressed: false})).catch(() => console.warn('not deleted'));
            // NfcManager.requestNdefWrite(null, {format: true})
            //     .then(() => console.warn('format completed'))
            //     .then(() => this.setState({buttonFormatPressed: false}))
            //     .catch((e) => console.warn(e))
            //     .then(()=>cleanUp())
            NfcManager.registerTagEvent()
                .then(() => NfcManager.requestTechnology(NfcTech.Ndef))
                .then(() => NfcManager.getTag())
                .then(() => NfcManager.getNdefMessage())
                .then(() => NfcManager.writeNdefMessage(NFCService.buildTextPayload("")))
                .then(() => {
                    console.warn('done');
                    cleanUp();
                })
                .catch(err => {
                    console.warn(err);
                    cleanUp();
                });


            cleanUp()
        } catch (ex) {
            NfcManager.unregisterTagEvent().catch(() => 0);
        }
    };

    _cleanUp = () => {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
    };


}

export default FormatNfc;
