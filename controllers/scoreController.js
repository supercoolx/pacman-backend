const User = require('../models/User'); 

module.exports.SaveScore = async (req, res) => {
  console.log("requestData:::", req.body);

  const {username, wins, scores} = req.body;

  const user = await User.findOne({ username: username });

  if(!user) {
    const newUser = new User({ 
      username: username,
      winds: wins?1:0,
      losses: wins? 0:1,
      scores: scores
    });
    await newUser.save().then(user => {
      return res.status(200).send({user});
    }).catch(error=> {
      return res.status(401).send({
        msg: "can't save user",
        error: error
      })
    })
  } else {
    if(wins === true)  user.wins++;
    if(wins === false)   user.losses++;
    user.scores += scores;
    
      user.updatedAt = new Date();
      await user.save().then(data=> {
        return res.status(200).send({data});
      }).catch(error => {
        return res.status(403).send({
          msg: "can't update user data",
          error: error
        })
      })
  }
  
}

module.exports.GetScore = async (req, res) => {
  const username = req.params.username;

  const user = await User.findOne({username: username});

  if(!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
}

module.exports.FetchAllScore = async (req, res) => {
  const users = await User.find().sort({scores: -1}).limit(10);
  if(!users) {
    return res.status(404).json({ message: 'Users not found' });
  }

  res.json({
    msg:"success",
    users
  });

}