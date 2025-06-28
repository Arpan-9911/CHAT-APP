import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const {socket, axios} = useContext(AuthContext)

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/message/users");
      if(data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/message/${userId}`);
      if(data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(`/message/send/${selectedUser._id}`, messageData);
      if(data.success) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
        setUnseenMessages(data.unseenMessages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const subscribeToMessages = async () => {
    if(!socket) return;
    socket.on("newMessage", (message) => {
      if(selectedUser && selectedUser._id === message.senderId) {
        message.seen = true;
        setMessages((prevMessages) => [...prevMessages, message]);
        axios.put(`/message/mark/${message._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [message.senderId]: (prevUnseenMessages[message.senderId] || 0) + 1
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if(!socket) return;
    socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    setSelectedUser,
    sendMessage,
    unseenMessages,
    setUnseenMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};