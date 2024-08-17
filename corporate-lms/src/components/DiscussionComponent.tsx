import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import '../styles/DiscussionComponent.css';

// Connect to the socket.io server
const socket = io('http://localhost:5000');

interface IMessage {
    _id: string;
    sender: {
        username: string;
    };
    content: string;
}

const DiscussionComponent: React.FC<{ roomId: string }> = ({ roomId }) => {
    const [message, setMessage] = useState<string>('');
    const [chat, setChat] = useState<IMessage[]>([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get<IMessage[]>(`http://localhost:5000/api/messages/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setChat(data);
            } catch (error) {
                console.error('Error fetching messages', error);
            }
        };

        fetchMessages();

        socket.emit('joinRoom', { room: roomId });

        socket.on('receiveMessage', (message: IMessage) => {
            setChat((prev) => [...prev, message]);
        });

        return () => {
            socket.emit('leaveRoom', { room: roomId });
            socket.off('receiveMessage');
        };
    }, [roomId]);

    const sendMessage = async () => {
        if (message.trim()) {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.post<IMessage>(
                    `http://localhost:5000/api/messages/${roomId}`,
                    { content: message },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Emit the message to the room
                socket.emit('sendMessage', { room: roomId, message: data });

                // Immediately update the chat with the new message
                setChat((prev) => [...prev, data]);
                setMessage(''); // Clear the input box
            } catch (error) {
                console.error('Error sending message', error);
            }
        }
    };

    return (
        <div className="discussion-component">
            <h1>Discussion for Course</h1>
            <div className="chat-box">
                {chat.map((msg) => (
                    <div key={msg._id} className="chat-message">
                        <strong>{msg.sender.username}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <div className="input-group">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => (e.key === 'Enter' ? sendMessage() : null)}
                    className="message-input"
                />
                <button onClick={sendMessage} className="send-button">
                    Send
                </button>
            </div>
        </div>
    );
};

export default DiscussionComponent;
