import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
export const Tasks = new Mongo.Collection('tasks');
// import { HTTP } from 'meteor/http'
 
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
    Tasks.remove(taskId);
  },
  // Edit Task 
  'tasks.setChecked' (taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
 
    Tasks.update(taskId, {
      $set: {
        checked: setChecked
      }
    });
  },
  // test method 
});