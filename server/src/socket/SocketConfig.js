const { Server } = require("socket.io");

const configureSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.channels = {};
  io.users = {};

  // const inactiveTime = 2 * 24 * 60 * 60 * 1000; // 2 jours en millisecondes
  const inactiveTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  const checkInterval = 60 * 1000; // 1 minute in milliseconds

  function checkInactiveChannels(io) {
    if (!io || !io.channels) {
      console.error("`io` or `io.channels` is undefined.");
      return;
    }

    const now = Date.now();

    Object.keys(io.channels).forEach((channelName) => {
      const channel = io.channels[channelName];
      if (channel && now - channel.lastActive > inactiveTime) {
        delete io.channels[channelName];
        io.emit(
          "channelDeleted",
          `Channel ${channelName} was deleted due to inactivity`
        );
      }
    });
  }

  setInterval(() => {
    checkInactiveChannels(io);
  }, checkInterval);

  io.on("connect", (socket) => {
    
    socket.on("setUser", (nickname) => {
      if (io.users[nickname] && io.users[nickname] !== socket.id) {
        socket.emit("error", {
          message: "Nickname already exists. Please choose another one."
        });
       

      } else {
        io.users[nickname] = socket.id;
        socket.nickname = nickname;
      }
    });

    socket.on("changeNickname", (newNickname) => {
      const oldNickname = socket.nickname;
    
      if (io.users[newNickname] && io.users[newNickname] !== socket.id) {
        socket.emit("error", {
          message: "Nickname already exists. Please choose another one with command /nick",
        });

      } else if (io.users[oldNickname]) {
      
        delete io.users[oldNickname];
        io.users[newNickname] = socket.id;
        socket.nickname = newNickname;
        io.emit("message", {
          message: `${oldNickname} changed nickname to ${newNickname}`,
          sender: "",
          global: true,
        });
    
        Object.keys(io.channels).forEach((channelName) => {
          if (io.channels[channelName].members.has(socket.id)) {
            io.channels[channelName].members.set(socket.id, newNickname);
            const members = Array.from(io.channels[channelName].members.values());
            io.to(channelName).emit("channelMembers", { channelName, members });
            io.to(channelName).emit("message", {
              message: `${oldNickname} changed nickname to ${newNickname}`,
              sender: "",
              channelName,
            });

          } 
        });
      } else {
        socket.emit("error", { message: `User ${oldNickname} not found` });
      }
    });

    socket.on("createChannel", ({ channelName, nickname }) => {

      if (!io.channels[channelName]) {
        io.channels[channelName] = {
          name: channelName,
          creator: nickname,
          members: new Map([[socket.id, nickname]]),
          lastActive: Date.now(),
        };
        io.users[socket.id] = nickname;
        socket.join(channelName);
        io.emit("message", {
          message: `${nickname} created the channel ${channelName}`,
          sender: "",
          global: true,
        });
        io.to(channelName).emit("message", {
          message: `${nickname} join the channel`,
          sender: "",
          channelName,
        });
        io.emit("newChannel", { channelName, nickname });
        const members = Array.from(io.channels[channelName].members.values());
        io.to(channelName).emit("channelMembers", { channelName, members });
      } else {
        socket.emit("error", { message: `Channel ${channelName} already exists` });
      }
    });

    socket.on("getChannels", () => {
      const channelNames = Object.keys(io.channels);
      socket.emit("channelList", channelNames);
   
    });

    socket.on("joinChannel", ({ channelName, nickname }) => {
      if (io.channels[channelName]) {
        if (!io.channels[channelName].members.has(socket.id)) {
          io.channels[channelName].members.set(socket.id, nickname);
          io.users[socket.id] = nickname;
          socket.join(channelName);
          const members = Array.from(io.channels[channelName].members.values());
          io.to(channelName).emit("channelMembers", { channelName, members });
          io.to(channelName).emit("message", {
            message: `${nickname} join the channel`,
            sender: "",
            channelName,
          });
        } else {
          socket.emit("error", {
            message: `You are already in the ${channelName} channel`,
          });
          socket.emit("error", { message: `You are already in channel ${channelName}.` });
        }
      } else {
        socket.emit("error", { message: `Channel ${channelName} does not exist.` });
      }
    });

    socket.on("leaveChannel", (channelName) => {
      if (io.channels[channelName]) {
        const nickname = io.users[socket.id];
        if (io.channels[channelName].members.has(socket.id)) {
          io.channels[channelName].members.delete(socket.id);
          socket.leave(channelName);
       
          const members = Array.from(io.channels[channelName].members.values());
          io.to(channelName).emit("channelMembers", { channelName, members });
          io.to(channelName).emit("message", {
            message: `${nickname} left the channel`,
            sender: "",
            channelName,
          });

          if (io.channels[channelName].members.size === 0) {
            delete io.channels[channelName];
            io.emit("message", {
              message: `Channel ${channelName} has been deleted`,
              sender: "",
              global: true,
            });

          }
        } else {
          socket.emit("error", {
            message: `You are not in the ${channelName} channel`,
          });

         
        }
      }
    });

    socket.on("getUsers", () => {
      const users = Object.keys(io.users);
      socket.emit("getUsers", users);
    });

    socket.on("sendMessageToChannel", ({ channelName, message, sender }) => {
      if (io.channels[channelName]) {
        io.channels[channelName].lastActive = Date.now();
        io.to(channelName).emit("message", { message, channelName, sender });
      } else {
        socket.emit("error", {
          message: `Channel ${channelName} not exist`,
        });

      }
    });

    socket.on("deleteChannel", ({ channelName, nickname }) => {
      if (io.channels[channelName]) {
        if (io.channels[channelName].creator === nickname) {
          delete io.channels[channelName];
          io.to(channelName).emit("channelDeleted", channelName);
          socket.leave(channelName);
          io.emit("message", {
            message: `Channel ${channelName} has been deleted by ${nickname}`,
            sender: "",
            global: true,
          });
         
        } else {
          
          socket.emit("error", { message: "You do not have permission to delete this channel." });

        }
      } else {
        socket.emit("error", { message: "Channel does not exist." });

      }
    });

    socket.on("renameChannel", ({ oldChannelName, newChannelName, nickname }) => {
  if (io.channels[oldChannelName]) {
    if (io.channels[oldChannelName].creator === nickname) {
      if (io.channels[newChannelName]) {
        socket.emit("error", { message: "The new channel name already exists." });
      } else {
     
        io.channels[newChannelName] = {
          name: newChannelName, 
          creator: io.channels[oldChannelName].creator,
          members: new Map(io.channels[oldChannelName].members), 
          messages: [],
        };

        delete io.channels[oldChannelName];

        io.emit("channelRenamed", { oldChannelName, newChannelName });

     
        io.emit("message", {
          message: `Channel ${oldChannelName} renamed to ${newChannelName} by ${nickname}`,
          sender: "",
          global: true,
        });

        io.channels[newChannelName].members.forEach((memberNickname, memberSocketId) => {
          const memberSocket = io.sockets.sockets.get(memberSocketId);
          if (memberSocket) {
            memberSocket.join(newChannelName);
            console.log(memberNickname);
          }
        });

        console.log(`Channel ${oldChannelName} renamed to ${newChannelName}`);
      }
    } else {
      socket.emit("error", { message: "You do not have permission to rename this channel." });
    }
  } else {
    socket.emit("error", { message: "The channel does not exist." });
  }
});


    socket.on("sendPrivateMessage", ({ recipient, message, sender }) => {

      const recipientSocketId = io.users[recipient];
      const senderSocketId = io.users[sender];
      if (recipientSocketId && senderSocketId) {
        const roomID = [recipient, sender].sort().join("-");
        socket.join(roomID);
        io.to(recipientSocketId).socketsJoin(roomID);
        io.to(roomID).emit("privateMessage", { sender, message, recipient });
       
      } else {
        socket.emit("error", {message: `User ${recipient} not found`});
        
      }
    });

    socket.on("disconnect", () => {
    
      Object.keys(io.channels).forEach(channelName => {
        if (io.channels[channelName].members.delete(socket.id)) {
          const members = Array.from(io.channels[channelName].members.values());
          io.to(channelName).emit("channelMembers", { channelName, members });
          if (io.channels[channelName].members.size === 0) {
            delete io.channels[channelName];
            io.emit("message", {
              message: `Channel ${channelName} deleted because it has no members`,
              sender: "",
              global: true,
            });

          }
        }
        const nickname = socket.nickname;
        if (nickname) {
          delete io.users[nickname];
        
        }
      
      });
    });
  });

  return io;
};

module.exports = configureSockets;
