import React from 'react';
import {CryptoJS} from './Constants';

class EncryptionService{

    encrypt = text => {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
    };

    decrypt = data => {
        return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
    };
}

export default new EncryptionService();
