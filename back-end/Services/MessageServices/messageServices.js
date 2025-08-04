const Message = require('../../models/MessageModel');

const sendMessage = async(sender,reciever,content)=>{
  const message = new Message({sender,reciever,content});
  return message.save();
}

const getMessagesBetweenUsers = async(user1,user2)=>{
    return Message.find({
        $or :[
            {sender:user1,reciever:user2},
            {sender:user2,reciever:user1}
        ]
    }).sort({createdAt:1});
};

module.exports = {getMessagesBetweenUsers,sendMessage}