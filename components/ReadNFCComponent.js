import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity, Platform, Button} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {Card} from 'react-native-elements';
import Service from './Service';

class ReadNfc extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            buttonPressed: false,
            nom: null,
            prenom: null,
            tagId: null,
        };
    }

    componentDidMount=()=> {
        this.setState({
            nom:null,
            prenom:null
        })
        NfcManager.start();
    }

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
            if(this.state.nom!==null && this.state.prenom!==null) {
                return (

                    <View style={{flex: 1}}>
                        <Card title={"Informations"} titleStyle={{fontSize: 20}}>
                            <Text>Nom : {this.state.nom} </Text>
                            <Text>Prenom : {this.state.prenom} </Text>
                            <View style={{marginTop: 170}}>
                                <Button style={{padding: 170}} title="Read another tag"
                                        onPress={() => this.setState({data: null, buttonPressed: false})}/>
                            </View>
                        </Card>
                    </View>
                );
            }else{
                return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                    <Text>No data available</Text>
                    <View style={{marginTop: 170}}>
                        <Button style={{padding: 170}} title="Read another tag"
                                onPress={() => this.setState({data: null, buttonPressed: false})}/>
                    </View>
                </View>
            }
        }

        // <View style={{padding: 20}}>
        //     <Text>NFC Demo</Text>
        //     <TouchableOpacity
        //         style={{padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black'}}
        //         onPress={this._test}>
        //         <Text>Test</Text>
        //     </TouchableOpacity>
        //
        // </View>

    }

    bin2String(array) {
        return String.fromCharCode.apply(String, array);
    }

    stringtoJSON(string){
        return JSON.parse(string)
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
            let tagId = tag.id
            let data = tag.ndefMessage[0].payload.slice(3);
            this.setState({data: this.bin2String(data)});
            this.setState({
                tagId:tagId,
                nom:this.stringtoJSON(this.state.data).nom,
                prenom:this.stringtoJSON(this.state.data).prenom
            })
            const string = this.state.tagId+","+this.state.nom+","+this.state.prenom
            let jsonrequest = {
                m:string
            }
            await Service.sendData(jsonrequest).then(this._cleanUp()).catch(()=>alert("No network connection"))

        } catch (ex) {
            NfcManager.unregisterTagEvent().catch(() => 0);
        }

    };
}

export default ReadNfc;
