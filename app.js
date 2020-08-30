//
// Creating the Module Patterns Using IFFE and CLosures
var budgetController = (function () {
  // creating Function Constructor
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage=-1;
  };
  Expense.prototype.calcPercentage = function(totalIncome){
      if (totalIncome>0) {
        this.percentage=Math.round((this.value/totalIncome)*100);
      }else{
          this.percentage=-1;
      }
  };
  Expense.prototype.getPercentage = function(){
    return this.percentage;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      inc: [],
      exp: [],
    },
    totals: {
      // we could have directly done all the calculation directly here instead of using the method CalcuateTotal
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;
      // Create a new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Create a newItem based on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      // Push it into data structure
      data.allItems[type].push(newItem);
      // returning it to COntroller

      return newItem;
    },
    deleteItem: function (type, id) {
      var ids, index;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function () {
      //calculate total income and expense
      calculateTotal("exp");
      calculateTotal("inc");

      //calculate the Budget = income-expense
      data.budget = data.totals.inc - data.totals.exp;

      //calcuating the percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentage : function(){
        data.allItems.exp.forEach(function (current) {
          current.calcPercentage(data.totals.inc);
        })
    },
    getPercentages : function(){
      // will write the code here to calculate percentage
      var allPercentages = data.allItems.exp.map(function(current){
        return current.getPercentage();
      });
      return allPercentages;
    },
    getBudget: function () {
      return {
        totalBudget: data.budget,
        totalIncome: data.totals.inc,
        totalExpense: data.totals.exp,
        totalPercentage: data.percentage,
      };
    },
  };
})();

// Similar to the budgetController
var UIController = (function () {
  // Creating DOM selector Strings so that when ever we change the UI in HTML then we don hav to chage here
  var DomStr = {
    inputType: "select",
    inputDescription: ".selector-detail",
    inputValue: ".input-value",
    inputBtn: ".btn",
    incomeContainer: ".income-list",
    expenseContainer: ".expense-list",
    budgetLabel: ".total-budget",
    incomeLabel: ".total-income-amt",
    expenseLabel: ".total-expense-amt",
    percentageLabel: ".total-expense-percentage",
    bottomSection: "#bottom-section",
    expensesPercentageLabel: ".expense-percentage"
  };
    var formatNumbers = function(num,type){
      var numSplit,int,dec;
      num= Math.abs(num);
      num = num.toFixed(2);//method of Number Prototype.. It always put 2 decimals on the numbers
      numSplit = num.split('.');
      int = numSplit[0];
      if(int.length > 3){
        int = int.substr(0,int.length-3)+","+int.substr(int.length-3,int.length);
      }
      dec = numSplit[1];
      return (type == "exp" ? "-" : "+")+ " " +int+"."+dec;
    };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DomStr.inputType).value, //will be either inc or exp
        description: document.querySelector(DomStr.inputDescription).value, //Input Description Field Selector
        value: parseFloat(document.querySelector(DomStr.inputValue).value), //value Selector
      };
    },
    addItemList: function (obj, type) {
      var html, element;
      //create HTML String with placeholders
      if (type === "inc") {
        element = DomStr.incomeContainer;

        html ='<li id="inc-' +obj.id+'"><span class="income-description">' +obj.description +'</span><span class="income-value"><span class="income-amt" >' + formatNumbers(obj.value,type) +'</span><i class="bx bx-x-circle delete-btn"></i></span></li>';
      } else if (type === "exp") {
        element = DomStr.expenseContainer;
        html ='<li id="exp-' +obj.id +'"><span class="expense-description">' +obj.description +'</span><span class="expense-value"><span class="expense-amt">' +formatNumbers(obj.value,type) +'</span><span class="expense-percentage">45%</span><i class="bx bx-x-circle delete-btn"></i></span></li>';
      }

      // inserting the element using insert JSON method
      document.querySelector(element).insertAdjacentHTML("beforeend", html);
      /* Every Li element will be after last element in the container before Closing tag of container  */
    },
    clearFields: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DomStr.inputDescription + "," + DomStr.inputValue);
      /* this will return an node-list now to convert this in to an array we use */
      /* here we will use slice method as slice method is to return an array and array should be passed in to it */
      fieldsArr = Array.prototype.slice.call(fields);
      /* here we  tricked the slice method that we are passing array into it so that we can use the node-list as array : by calling Array prototype which has method slice which will be called using the call method and then we passed the node-list into it */
      fieldsArr.forEach(function (current) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function (obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DomStr.budgetLabel).textContent = formatNumbers(obj.totalBudget,type);
      document.querySelector(DomStr.incomeLabel).innerHTML ="+ " + obj.totalIncome;
      document.querySelector(DomStr.expenseLabel).innerHTML ="- " + obj.totalExpense;
      if (obj.totalPercentage > 0) {
        document.querySelector(DomStr.percentageLabel).innerHTML =
          obj.totalPercentage + "%";
      } else {
        document.querySelector(DomStr.percentageLabel).innerHTML = "----";
      }
    },
    displayPercentages : function(percentages){
      var fields = document.querySelectorAll(DomStr.expensesPercentageLabel);//this will return a node-list
      fields.forEach(function (current,index) {
        if (percentages[index]>0) {
          current.innerHTML = percentages[index]+"%";
        } else {
          current.innerHTML ="---";
        }
      });
    },

    getDomStrings: function () {
      return DomStr;
    },
  };
})();

// Function to Connet  UIController and BudgetController
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventisteners = function () {
    var DOM = UICtrl.getDomStrings();

    // EventListener for Button
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    //listening for the Enter Key
    document.addEventListener("keypress", function (event) {
      // since the keyprees events happens only on the global event so adding event listenr to the document
      if (event.keyCode === 13) {
        ctrlAddItem();
      }
    });
    //Listening for the click upon the delete button in the UI
    document.querySelector(DOM.bottomSection).addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function () {
    //calculate budget
    budgetCtrl.calculateBudget();
    //get Budget
    var budget = budgetCtrl.getBudget();
    //display budget in UI
    UICtrl.displayBudget(budget);
  };
  var updatePercentages = function () {
    //calculate Percentages
    budgetCtrl.calculatePercentage();
    //Read percentages from the budget controller
    var percentages =  budgetCtrl.getPercentages();
    //update UI with percentages
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function () {
    // Get the Input Field Values
    var input = UICtrl.getInput();

    // NaN is an abbreviation for Not a Number so we have used the method isNaN(value) and it return true/false
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //add item to budget Controller
      var newItem = budgetCtrl.addItem(
        input.type,
        input.description,
        input.value
      );

      //add item to UI
      UICtrl.addItemList(newItem, input.type);

      //clear the fields
      UICtrl.clearFields();

      //calculate budget and update budget
      updateBudget();

      //calculate and Update the percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function (event) {
    if (event.target.classList.contains("delete-btn")) {
      //getting the parent Element
      var itemID = event.target.parentElement.parentElement;
      var splitID = itemID.id.split("-");
      var type = splitID[0];
      var ID = parseInt(splitID[1]);
      //Delete the Item from the datastructure
      budgetCtrl.deleteItem(type, ID);
      //Delete the Item from UI
      itemID.remove();

      //Recalculate budget
      updateBudget();
      //Recalculate Expense Percentage
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("Application has started");
      setupEventisteners();
      UICtrl.displayBudget({
        totalBudget: 0,
        totalIncome: 0,
        totalExpense: 0,
        totalPercentage: -1,
      });
    },
  };
})(budgetController, UIController);

controller.init();
