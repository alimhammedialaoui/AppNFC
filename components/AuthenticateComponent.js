import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';
import {Card} from 'react-native-elements';

class AuthenticateComponent extends Component {


    handleChangeUser = (text) => {
        this.setState(
            {textInputNom: text},
        );
    };

    handleChangePassword = (text) => {
        this.setState(
            {textInputPrenom: text},
        );
    };

    render() {
        return (
            <View>
                <Card>
                    <View>
                        <Text>Utilisateur</Text>
                        <TextInput style={style}
                                   placeholder={'Nom'}
                                   onChangeText={this.handleChangeUser}
                                   value={this.state.textInputNom}
                                   theme={theme}
                        />
                    </View>
                </Card>
            </View>
        );
    }
}

export default AuthenticateComponent;
