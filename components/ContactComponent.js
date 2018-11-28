import React, {Component} from 'react';
import {Text} from 'react-native';
import {Card} from 'react-native-elements';

class Contact extends Component {

    render() {
        return(
            <Card
                title='Contact Information'
            >
                <Text>
                    121 Clearwater bay road
                </Text>
                <Text>
                    Clear Water Bay, Cowloon
                </Text>
                <Text>
                    HONG KONG
                </Text>
                <Text>
                    Tel: +85212345678
                </Text>
                <Text>
                    Fax: +85287654321
                </Text>
                <Text>
                    Email: confusion@food.net
                </Text>
            </Card>
        )
    }
}

export default Contact;
