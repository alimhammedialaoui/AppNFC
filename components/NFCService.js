import NfcManager, {Ndef,NdefParser, NfcTech} from 'react-native-nfc-manager';
import React, {Component} from 'react';
import NativeNfcManager from 'react-native-nfc-manager';


class NFCService {

    strToBytes=(str)=> {
        let result = [];
        for (let i = 0; i < str.length; i++) {
            result.push(str.charCodeAt(i));
        }
        return result;
    }

    closeTechnology() {
        if (Platform.OS === 'ios') {
            return Promise.reject('not implemented');
        }

        return new Promise((resolve, reject) => {
            NativeNfcManager.closeTechnology((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }


    buildTextPayload=(valueToWrite)=> {
        const textBytes = this.strToBytes(valueToWrite);
        // in this example. we always use `en`
        const headerBytes = [0xD1, 0x01, (textBytes.length + 3), 0x54, 0x02, 0x65, 0x6e];
        return [...headerBytes, ...textBytes];
    }

    buildEmptyPayload=()=>{
        // in this example. we always use `en`
        const headerBytes = [0xD1, 0x01, null, 0x54, 0x02, 0x65, 0x6e];
        return [...headerBytes, null];
    }

    buildUrlPayload=(valueToWrite)=> {
        return Ndef.encodeMessage([
            Ndef.uriRecord(valueToWrite),
        ]);
    }

}

export default new NFCService();

