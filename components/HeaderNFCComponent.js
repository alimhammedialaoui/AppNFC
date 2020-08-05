import React, {Component} from 'react';
import {Text, View} from 'react-native';

class HeaderNFCComponent extends Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>NFc App</Text>
            </View>
        );
    }
}

export default HeaderNFCComponent;
