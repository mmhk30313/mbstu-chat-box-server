const router = require("express").Router();
const Conversation = require("../models/Conversation");

// new conversation
const addConversation = async(senderId, receiverId, res) => {
  const newConversation = new Conversation({
    members: [senderId, receiverId],
  });
  // console.log({newConversation});
  // res.send(newConversation);
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
}

// router.post("/", async (req, res) => {
//   const newConversation = new Conversation({
//     members: [req.body.senderId, req.body.receiverId],
//   });

//   try {
//     const savedConversation = await newConversation.save();
//     res.status(200).json(savedConversation);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// get conversation of a user
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conversation includes two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    if(conversation){
      res.status(200).json(conversation);
    }
    else {
      addConversation(req.params.firstUserId, req.params.secondUserId, res);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
