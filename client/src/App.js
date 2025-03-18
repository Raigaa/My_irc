import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./index.css";

import NickComponents from "./components/Forms/NickComponents";
import MessagerieButton from "./components/Buttons/MessagerieButton";
import ChannelButton from "./components/Buttons/ChannelButton";
import ChatForm from "./components/Forms/ChatForm";
import Messages from "./components/Messages/Messages";
import ChannelsList from "./components/Lists/ChannelsList";
import TabsChannels from "./components/Tabs/TabsChannels";
import HelpButton from "./components/Buttons/HelpButton";
import HelpModal from "./components/Modals/HelpModal";
import ChannelCreateButton from "./components/Buttons/ChannelCreateButton";
import ChannelCreateModal from "./components/Modals/ChannelCreateModal";
import UsersList from "./components/Lists/UsersList";
import ChannelsModal from "./components/Modals/ChannelsModal";
import TabsMessagerie from "./components/Tabs/TabsMessagerie";
import PrivateMessages from "./components/Messages/PrivateMessages";
import UsersModal from "./components/Modals/UsersModal";
import ErrorModal from "./components/Modals/ErrorModal";
import Alerte from "./components/Alertes/ErrorAlerte";
import GlobalNotifications from "./components/Messages/GlobalNotification";

const socket = io("http://localhost:3001");

function App() {
  const [nick, setNick] = useState(sessionStorage.getItem("nickname") || "");
  const [messages, setMessages] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [joinedChannels, setJoinedChannels] = useState([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [activeChannelMembers, setActiveChannelMembers] = useState({});
  const [leavedChannel, setLeavedChannel] = useState(null);
  const [showChannelsModal, setShowChannelsModal] = useState(false);
  const [channelsList, setChannelsList] = useState([]);
  const [showMessagerieButton, setShowMessagerieButton] = useState(true);
  const [privateMessage, setPrivateMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {

    if (nick) {
      socket.emit("setUser", nick);
    }
  }, [nick]);

  useEffect(() => {

    socket.on("channelList", (channelNames) => {
      setChannels(channelNames);
    });

    socket.on("newChannel", ({ channelName, nickname }) => {
      socket.emit("getChannels");
      if (nickname === nick) {
        joinChannel(channelName);
      }
    });

    socket.on("joinedChannel", (channelName) => {
      setJoinedChannels((prev) => [...prev, channelName]);
    });

    socket.on("leaveChannel", (channelName) => {
      setJoinedChannels((prev) => prev.filter((c) => c !== channelName));
      if (currentChannel === channelName) {
        setCurrentChannel(null);
      }
      setLeavedChannel(channelName);
    });

    socket.on("message", ({ message, sender, channelName }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message, sender, channelName },
      ]);
    });

    socket.on("channelMembers", ({ channelName, members }) => {
      setActiveChannelMembers((prevMembers) => ({
        ...prevMembers,
        [channelName]: members,
      }));
    });

    socket.on("privateMessage", ({ sender, message, recipient }) => {

      setPrivateMessages((prevMessages) => [
        ...prevMessages,
        { sender, message, recipient },
      ]);

      const otherPerson = sender === nick ? recipient : sender;

      if (sender !== recipient) {
        setConversations((prevConversations) => {
          if (!prevConversations.includes(otherPerson)) {
            return [...prevConversations, otherPerson];
          }
          return prevConversations;
        });

        if (sender !== nick) {
          setCurrentConversation(sender);
        }
      }
    });

    socket.on("channelRenamed", ({ oldChannelName, newChannelName }) => {
      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel === oldChannelName ? newChannelName : channel
        )
      );

      setJoinedChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel === oldChannelName ? newChannelName : channel
        )
      );
      
      socket.emit("getChannels");

    });

    socket.on("channelDeleted", (channelName) => {
      setJoinedChannels((prevChannels) =>
        prevChannels.filter((channel) => channel !== channelName)
      );
      setChannels((prevChannels) =>
        prevChannels.filter((channel) => channel !== channelName)
      );
    
      if (currentChannel === channelName) {
        setCurrentChannel(null);
      }
    
      socket.emit("getChannels");
    });
    

    socket.on("error", ({ message }) => {
      setAlertMessage(message);
    });

    socket.on("disconnect", () => {
      setNick("");
    });

    socket.emit("getChannels");

    return () => {
      socket.off("channelList");
      socket.off("newChannel");
      socket.off("joinedChannel");
      socket.off("leaveChannel");
      socket.off("message");
      socket.off("channelMembers");
      socket.off("privateMessage");
      socket.off("channelDeleted");
      socket.off("channelRenamed");
    };
  }, [currentChannel, nick, conversations]);

  const handleCommand = (command) => {
    if (!command.startsWith("/")) {
      if (command.length > 200) {
        setErrorMessage("Messages cannot be more than 200 characters.");
        setShowErrorModal(true);
        return;
      }
      sendMessageToChannel(currentChannel, command, nick);
      return;
    }
    const parts = command.split(" ");
    const cmd = parts[0];
    const args = parts.slice(1);

    try {
      switch (cmd) {
        case "/nick":
          const newNick = args[0];
          if (!/^[a-zA-Z0-9]{1,12}$/.test(newNick)) {
            setErrorMessage(
              "Nickname must be alphanumeric and no more than 12 characters."
            );
            setShowErrorModal(true);
            break;
          }
          setNick(newNick);
          sessionStorage.setItem("nickname", newNick);

          socket.emit("changeNickname", newNick);
          break;
        case "/list":
          const searchTerm = args[0];

          if (searchTerm) {
            setChannelsList(
              channels.filter((channel) => channel.includes(searchTerm))
            );
          } else {
            setChannelsList(channels);
          }

          setShowChannelsModal(true);
          break;
        case "/create":
          const newChannel = args[0];
          if (!/^[a-zA-Z0-9]{1,16}$/.test(newChannel)) {
            setErrorMessage(
              "Channel name must be alphanumeric and no more than 16 characters."
            );
            setShowErrorModal(true);
            break;
          }
          createChannel(newChannel);
          break;
        case "/delete":
          deleteChannel(args[0]);
          break;
        case "/join":
          if (joinedChannels.length < 10) {
            joinChannel(args[0]);
          } else {
            setErrorMessage("You can only join up to 10 channels at once.");
            setShowErrorModal(true);
          }
          break;
        case "/leave":
          leaveChannel(args[0]);
          break;
        case "/rename":
          const oldChannelName = args[0];
          const newChannelName = args[1];
          renameChannel(oldChannelName, newChannelName);
          break
        case "/users":
          setShowUsersModal(true);
          break;
        case "/msg":
          const nickname = args[0];
          const message = args.slice(1).join(" ");
          sendMessageToUser(nickname, message);
          break;
        case "/help":
          setShowHelpModal(true);
          break;
        default:
          setErrorMessage(`Unknown command: ${cmd}`);
          setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
      setShowErrorModal(true);
    }
  };

  const handleNickSet = (nickname) => {
    setNick(nickname);
  };

  function createChannel(channelName) {
    socket.emit("createChannel", { channelName, nickname: nick });
  }

  function deleteChannel(channelName) {
    socket.emit("deleteChannel", { channelName, nickname: nick });
    socket.emit("getChannels");
    leaveChannel(channelName);
  }

  function joinChannel(channelName) {
    socket.emit("joinChannel", { channelName, nickname: nick });
    setCurrentChannel(channelName);
    setJoinedChannels((prev) => [...new Set([...prev, channelName])]);
    socket.emit("getChannelMembers", channelName);
  }

  function leaveChannel(channelName) {
    socket.emit("leaveChannel", channelName);
    setCurrentChannel(null);
    setLeavedChannel(channelName);
  }

  function getUsers(channelName) {
    socket.emit("getChannelMembers", channelName);
  }

  function sendMessageToUser(nickname, message) {
    setShowUsersModal(false);
    socket.emit("sendPrivateMessage", {
      recipient: nickname,
      message,
      sender: nick,
    });
  }

  const socketLeave = (channelName) => {
    socket.emit("leaveChannel", channelName);
  };

  function sendMessageToChannel(channelName, message, sender) {
    if (channelName) {
      socket.emit("sendMessageToChannel", { channelName, message, sender });
    } else {
      setErrorMessage("No channel selected to send message to.");
      setShowErrorModal(true);
    }
  }

  function renameChannel(oldChannelName, newChannelName) {
    socket.emit("renameChannel", { oldChannelName, newChannelName, nickname: nick});
  }

  useEffect(() => {
    if (currentChannel && !joinedChannels.includes(currentChannel)) {
      setCurrentChannel(null);
    }
  }, [joinedChannels]);

  socket.on("channelDeleted", (channelName) => {
    if (currentChannel === channelName) {
      console.log("Channel deleted coté client", channelName);
      setCurrentChannel(null);
    }
  });


  return (
    <div className="App h-screen flex flex-col">
      <GlobalNotifications />

      {nick ? (
        <div className="flex-1 flex">
          <div className="w-1/4 border-r border-gray-200">
            <Alerte message={alertMessage} onClose={() => setAlertMessage("")} />

            {showMessagerieButton ? (
              <MessagerieButton onClick={() => setShowMessagerieButton(false)} />
            ) : (
              <ChannelButton onClick={() => setShowMessagerieButton(true)} />
            )}

            <ChannelsList
              channels={channels}
              onSelectChannel={(channelName) => joinChannel(channelName)}
            />
            <ChannelCreateButton onClick={() => setShowCreateChannelModal(true)} />
            <HelpButton onClick={() => setShowHelpModal(true)} />
          </div>

          <div className="flex-1 flex flex-col relative">
            <div className="p-4 border-b border-gray-200">
              {currentChannel
                ? `Current Channel: ${currentChannel}`
                : "No channel selected"}
            </div>

            {showMessagerieButton ? (
              <TabsChannels
                channels={joinedChannels}
                currentChannel={currentChannel}
                onSelectChannel={(channelName) => {
                  setCurrentChannel(channelName);
                  socket.emit("getChannelMembers", channelName);
                }}
                onCloseChannel={(channel) => {
                  setJoinedChannels((prev) => prev.filter((c) => c !== channel));
                  if (currentChannel === channel) {
                    setCurrentChannel(null);
                  }
                }}
                socketLeave={socketLeave}
                leavedChannel={leavedChannel}
              />
            ) : (
              <TabsMessagerie
                conversations={conversations}
                currentConversation={currentConversation}
                onSelectConversation={setCurrentConversation}
              />
            )}

            <div className="flex-1 overflow-y-auto">
              {showMessagerieButton ? (
                <Messages messages={messages} currentChannel={currentChannel} />
              ) : (
                <PrivateMessages messages={privateMessage} currentConversation={currentConversation} />
              )}
            </div>

            {nick && (
              <div className="absolute bottom-0 left-0 w-full">
                <ChatForm onMessageSend={handleCommand} />
              </div>
            )}

          </div>

          {showMessagerieButton && (
            <div className="w-1/4 border-l border-gray-200">
              <UsersList
                members={activeChannelMembers[currentChannel] || []}
                onSendPrivateMessage={sendMessageToUser}
              />
            </div>
          )}
        </div>
      ) : (
        <NickComponents onNickSet={handleNickSet} />
      )}

      {/* Modals */}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      <ChannelCreateModal
        isOpen={showCreateChannelModal}
        onClose={() => setShowCreateChannelModal(false)}
        onCreateChannel={createChannel}
      />
      <ChannelsModal
        isOpen={showChannelsModal}
        onClose={() => setShowChannelsModal(false)}
        channels={channelsList}
        onSelectChannel={(channelName) => joinChannel(channelName)}
      />
      <UsersModal
        isOpen={showUsersModal}
        onClose={() => setShowUsersModal(false)}
        users={activeChannelMembers[currentChannel] || []}
        onSendPrivateMessage={sendMessageToUser}
      />
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
    </div>
  );
}

export default App;