/* 
    we will be encapsulation i.e. data-hiding using IFFE and Closures

    IFFE creates a new scope that is not visible from outside scope
    Cloures : It is the pocess by which inner function can access the variables and parameters of the outer function even after the function has returned
*/
// Creating the Module Patterns Using IFFE and CLosures
// creaing IFFE Function that return objects
var budgetController = (function () {
    var x = 23;
    var add = function (a) {
        // this is private function and we cannot access this function from outside
        return x + a;
    }
    // here Module pattern returns the objects containing all the function that we want to be public i.e function that we want of the scope access to
    return {
        // here we are using clsures to return the value
        // after everything run budgetControlling variables consists of only this object publicTest
        publicTest: function (b) {
            return add(b);
        }
    }
})();
// to access the above add function 
var a = budgetController.publicTest(5);
console.log(a);

// Similar to the budgetController Module
var UIController = (function () {
    // Function Body
})();

// Function to interact between the UIController and BudgetController
var controller = (function (budgetCtrl, UICtrl) {
    // Function Body
    /* 
        we can also use the function like this as
        budgetController.publicTest();
        but this will make the controller less independent i.e. if we wand to change the names of the other 2 controllersthen we would have to change the name all over inside this program so we chaged the parameters names even
    */
   var z=budgetCtrl.publicTest(5);/* here again we can access the things of Bcntroller */
   return {
       publicTestB:function(){
           console.log(z);
       }
   }
   
})( budgetController,UIController);   
