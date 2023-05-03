const User = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(
    `[${new Date().toISOString()}] 
    ${req.method} 
    to ${req.url} 
    from ${req.get('Origin')}`
  );
  next();
}

async function validateUserId(req, res, next) {
  try {
    const user = await User.getById(req.params.id)
    if (!user) {
      res.status(404).json({
        message: 'No such user'
      })
    } else {
      req.user = user
      next()
    }
  } catch (err) {
    res.status(500).json({
      message: 'Problem finding user'
    })
  }
}



function validateUser(req, res, next) {
  const { name } = req.body
  if (!name || !name.trim()) {
    res.status(400).json({
      message: 'Missing required name field'
    })
  } else {
    req.name = name.trim()
    next()
  }
}

function validatePost(req, res, next) {
  const { text } = req.body
  if (!text || !text.trim()) {
    res.status(400).json({
      message: 'Missing required name field'
    })
  } else {
    req.name = name.trim()
    next()
  }
}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
}