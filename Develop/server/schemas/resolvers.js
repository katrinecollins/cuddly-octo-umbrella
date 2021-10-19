const { User } = require('../models');
const { signToken } = require('../utils/auth');
const {AuthenticationError} = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      return await User.findOne({_id: context.user._id});
    },
  },
  Mutation: {
    login: async (parent, args, context) => {
        const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
        if (!user) {
        //   return res.status(400).json({ message: "Can't find this user" });
        // throw an error

        }
    
        const correctPw = await user.isCorrectPassword(args.password);
    
        if (!correctPw) {
        //   return res.status(400).json({ message: 'Wrong password!' });
         // throw an error 
         throw new AuthenticationError('Invalid password!')

        }
        const token = signToken(user);
        // res.json({ token, user });
        return {token, user}
    },
    addUser: async (parent, args, context) => {
        const user = await User.create(args);

        if (!user) {
        // return res.status(400).json({ message: 'Something is wrong!' });
            // throw an error
            throw new AuthenticationError('No user was created!')
        }
        const token = signToken(user);
        // res.json({ token, user });
        return { token, user }
    },
    saveBook: async (parent, args, context) => {
        console.log(context.user);
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args }},
            { new: true, runValidators: true }
          )
          return updatedUser;
        } catch (err) {
          throw new AuthenticationError('Something happened!')
        }
    },
    removeBook: async (parent, args, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: args.bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        return new AuthenticationError('No user was updated')
      }
      return updatedUser;
    }
  }
};

module.exports = resolvers;