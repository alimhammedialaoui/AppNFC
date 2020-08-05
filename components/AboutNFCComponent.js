import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Card} from 'react-native-elements'

class About extends Component {
    render() {
        return (
            <Card title={"About"}>
                <Text>@Copyright Ali</Text>
            </Card>
        );
    }
}

export default About;
