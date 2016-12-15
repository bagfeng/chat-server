import React from "react";
import { socketConnect } from 'socket.io-react';

import Room from "./Room";
import RoomStore from '../stores/RoomStore';
import * as RoomActions from '../actions/RoomActions';

const roomsStyle =  {
    width: '100%',
    margin: '20px auto',
    padding: '20px',
    listStyle: 'none'
};

@socketConnect
export default class Rooms extends React.Component {
    constructor() {
        super();
        this.state = {
            rooms: RoomStore.getAll()
        };
    }

    componentWillMount() {
        RoomStore.on('addNewRoom', (data) => {
            this.setState({
                rooms: RoomStore.getAll()
            });
            console.log('1 room and 2 users have been comfirmed. Now join them into the room.');
            this.props.socket.emit('join_private_room', data);
        });

        this.props.socket.on('invite_match_user', (data) => {
            RoomActions.matchUser(data);
            console.log('Let\'s go and see if the username belongs to the room!');
        });
    }

    render() {
        const {rooms} = this.state;
        const roomComponents = rooms.map((data) => {
            return <Room key={data.room} info={data} />;
        });

        return(
            <div>
                <ul class="rooms" style={roomsStyle}>
                    {roomComponents}
                </ul>
            </div>
        );
    }
}
