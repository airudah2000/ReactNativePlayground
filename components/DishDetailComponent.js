import React, {Component} from 'react';
import {View, Text, ScrollView, FlatList} from 'react-native';
import {Card, Icon, Rating} from 'react-native-elements';
import {connect} from 'react-redux';
import {baseUrl} from "../shared/baseUrl";
import {postFavorite} from "../redux/ActionCreators";

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
};

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId))
});

function RenderDish(props) {
    const dish = props.dishes;


    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}
            >
                <Text style={{margin: 10}}>{dish.description}</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <Icon
                        raised
                        reverse
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => alert('Modal Popup here.')}
                    />
                </View>
            </Card>
        )
    } else {
        return (<View></View>)
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({item, index}) => {
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating
                    type='star'
                    imageSize={10}
                    readonly
                    startingValue={item.rating}
                    style={{ alignItems: 'flex-start', margin: 5 }}
                />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        )
    };

    return (
        <Card title="Comments">
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    )
}

class DishDetail extends Component {

    markFavorite(dishId) {
        this.props.postFavorite(dishId)
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');

        return (
            <ScrollView>
                <RenderDish
                    // +dishId here makes the dishId a number
                    dishes={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)}/>
            </ScrollView>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
