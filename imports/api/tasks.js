import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
export const Tasks = new Mongo.Collection('tasks');
// import { HTTP } from 'meteor/http';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [{
        private: {
          $ne: true
        }
      }, {
        owner: this.userId
      }, ],
    });
  });
}

 
Meteor.methods({
  'tasks.insert' (text) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
      //no allowed to run Taks.inert()??
    }
    // debugger;
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  // Remove task 
  'tasks.remove' (taskId) {
//viec chek o day xem co gia tri hay khong ma thoi ko line quan gi den van de inter tca 
    check(taskId, String);
    // get tassk before
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },
  // Edit Task 
  'tasks.setChecked' (taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, {
      $set: {
        checked: setChecked
      }
    });
  },

// Add them phan public / private 
  'tasks.setPrivate' (taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
 
    const task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, {
      $set: {
        private: setToPrivate
      }
    });
  },
  // test method 

  'tasks.test' (testMethod) {
    check(taskId, String);
    this.unblock();
    try {
      var result = 'here is method';
      console.log(result);
      return true;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      return false;
    }
  },
  // for add new method here

});