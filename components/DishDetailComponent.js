import React, {Component} from 'react';
import {View, Text, ScrollView, FlatList, Modal, Button, StyleSheet, Picker, Switch} from 'react-native';
import {Card, Icon, Rating, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import {baseUrl} from "../shared/baseUrl";
import {postFavorite} from "../redux/ActionCreators";
import {postComment} from "../redux/ActionCreators";

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
};

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (comment) => dispatch(postComment(comment))
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
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onFavouriteButtonPress()}
                    />
                    <Icon
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => props.onCommentButtonPress()}
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
                    style={{alignItems: 'flex-start', margin: 5}}
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

function RenderModal(props) {

    return (
        <Modal
            animationType={'slide'}
            transparent={false}
            visible={props.showModal}
            onDismiss={() => {
                props.toggle();
                props.reset()
            }}
            onRequestClose={() => {
                props.toggle();
                props.reset()
            }}
        >
            <View style={styles.formRow}>
                <Rating
                    type='star'
                    imageSize={30}
                    showRating
                    fractions={0}
                    startingValue={0}
                    style={{alignItems: 'center', margin: 5}}
                    onFinishRating={(rating) => props.setRating(rating)}
                />
            </View>

            <View style={styles.formRow}>
                <Input
                    value={props.author}
                    placeholder='Author'
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                />
            </View>

            <View style={styles.formRow}>
                <Input
                    value={props.comment}
                    placeholder='Comment'
                    leftIcon={{type: 'font-awesome', name: 'comment-o'}}
                />
            </View>

            <View style={styles.formButton}>
                <Button
                    title='Submit'
                    color='#512DA8'
                    onPress={() => props.submitRating()}
                />
            </View>
            <View style={styles.formButton}>
                <Button
                    title='Cancel'
                    color='grey'
                    onPress={() => {
                        props.reset();
                        props.toggle()
                    }}
                />
            </View>

        </Modal>
    )
}

class DishDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            author: '',
            comment: '',
            showModal: false
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId)
    }

    // addComment(comment) {
    //     this.props.postComment(comment)
    // }

    static navigationOptions = {
        title: 'Dish Details'
    };

    setRating(rating) {
        console.log("Set rating as: " + JSON.stringify(rating));
        this.setState({rating: +rating})
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    submitRating() {
        console.log(JSON.stringify(this.state));

        // addComment();

        this.resetForm();
        this.setState({showModal: false})
    }

    resetForm() {
        this.setState({
            rating: 0,
            author: '',
            comment: ''
        });
    }


    render() {
        const dishId = this.props.navigation.getParam('dishId', '');

        return (
            <ScrollView>
                <RenderDish
                    // +dishId here makes the dishId a number
                    dishes={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onFavouriteButtonPress={() => this.markFavorite(dishId)}
                    onCommentButtonPress={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)}/>
                <RenderModal
                    showModal={this.state.showModal}
                    toggle={() => this.toggleModal()}
                    submitRating={() => this.submitRating()}
                    reset={() => this.resetForm()}
                    setRating={(rating) => this.setRating(rating)}
                />
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'stretch',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    formButton: {
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
