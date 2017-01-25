import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';
import { Tasks } from '../../api/tasks.js';
import { Meteor } from 'meteor/meteor';

class Task {
  constructor($scope) {
    $scope.viewModel(this);

    this.subscribe('tasks');
    // cai nay duoc su dung trong view?
    this.hideCompleted = false;

    this.helpers({
      tasks() {
        const selector = {};

        // If hide completed is checked, filter tasks
        if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          };
        }

        // Show newest tasks at the top
        // here is default for get list tasks?
        return Tasks.find(selector, {
          sort: {
            createdAt: -1
          }
        });
      },
      // thang nay van nam trong list full task
      // tao them thang nay de lam gi 
      // phai cong nhan la thang design kinh khung thiet 

      incompleteCount() {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }).count();
      },
      //  Get current user 
      currentUser() {
        return Meteor.user();
      },

      // i see nothing is simple but y need to try 
      // no way 

      test(){
        return 'just string';
      }


    })
  }
  
// add new method to here 
  testMethod(testMethod){

    Meteor.call('task.test', testMethod);

  }

  addTask(newTask) {
    // Insert a task into the collection
    // in here we call method to call to api-> to server 
    // khong the xoa truc tiep duoc 
    // con o server thi ro rang la duoc phep delete 
    Meteor.call('tasks.insert', newTask);
    // Clear form
    this.newTask = '';
  }
// update new task which is add checkbox?
  setChecked(task) {
      // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

// delete the task 
  removeTask(task) {
    Meteor.call('tasks.remove', task._id);
  }

  setPrivate(task) {
    Meteor.call('tasks.setPrivate', task._id, !task.private);
  }

}
 // export to template which is used on main html 
export default angular.module('todos', [
  angularMeteor
])
  .component('todos', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', Task]
  });
  // o day no add Abc vao todos 
  // con no lam gi minh van chua ro 
