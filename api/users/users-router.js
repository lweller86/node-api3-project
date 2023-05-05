const express = require('express');
const {
validateUser, 
validateUserId,
validatePost,

} = require('../middleware/middleware')
 
const User = require('./users-model')
const Post = require('../posts/posts-model')

const router = express.Router();

router.get('/', (req, res, next) => {
  User.get()
  .then(users => {
    res.json(users)
  })
  .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
 res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
 User.insert({ name: req.name})
 .then(newUser => {
  res.status(201).json(newUser)
 })
 .catch(next)

 })


router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  User.update(req.params.id, { name: req.name})
  .then(() =>  {
return User.getById(req.params.id)
  })
  .then(user => {
    res.json(user)
  })
  .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
try{
  await User.remove(req.params.id)
  res.json(req.user)
} catch (err) {
  next(err)
}
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try{
    const result = await User.getUserPosts(req.params.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
  

});

router.post(
  '/:id/posts', 
  validateUserId, 
  validatePost,
  async (req, res, next) => {
    try{
      const newPost = await Post.insert(
        {
        user_id: req.params.id,
        text: req.text,
      })
       res.status(201).json(newPost)
      } catch (err) {
        next(err)
      }

});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: 'Something Bad Happened',
    message: err.message,
    stack: err.stack
  })
})

// do not forget to export the router
module.exports = router