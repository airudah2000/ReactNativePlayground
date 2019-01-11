import React, {Component} from 'react';
import {View, Text, ScrollView, FlatList, Modal, Button, StyleSheet, Picker, Switch} from 'react-native';
import {Card, Icon, Rating, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import {baseUrl} from "../shared/baseUrl";
import {postFavorite} from "../redux/ActionCreators";
import {postComment} from "../redux/ActionCreators";

let commentIndex=100; //Setting an index for comments to an arbitrary value as we don't really have a db yet

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
                    onChangeText={(text) => props.setAuthor(text)}
                />
            </View>

            <View style={styles.formRow}>
                <Input
                    value={props.comment}
                    placeholder='Comment'
                    leftIcon={{type: 'font-awesome', name: 'comment-o'}}
                    onChangeText={(text) => props.setComment(text)}

                />
            </View>

            <View style={styles.formButton}>
                <Button
                    title='Submit'
                    color='#512DA8'
                    onPress={() => props.saveComment()}
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
            author: '',
            comment: '',
            rating: 0,
            date: new Date().toISOString(),
            showModal: false //Should really move this somewhere else as it gets included in the comment json
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId)
    }

    saveComment() {

        // delete this.state.showModal; //This might not be necessary at all
        // this.setState(this.state);   //Did this while debugging

        this.props.postComment({
            ...this.state,
            dishId: this.props.navigation.getParam('dishId', ''),
            id: ++commentIndex});

        setTimeout(() => this.toggleModal(), 500);
        this.resetForm();
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    setRating(rating) {
        // console.log("Set rating as: " + JSON.stringify(rating));
        this.setState({rating: +rating})
    }

    setAuthor(author) {
        this.setState({author: author})
    }

    setComment(comment) {
        this.setState({comment: comment})
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
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
                    reset={() => this.resetForm()}
                    setRating={(rating) => this.setRating(rating)}
                    setAuthor={(author) => this.setAuthor(author)}
                    setComment={(comment) => this.setComment(comment)}
                    saveComment={() => this.saveComment()}
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
