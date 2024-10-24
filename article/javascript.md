You are going to start with a basic for loop. for loops use the following syntax: 

for ("iterator"; "condition"; "iteration") {
} step33;

for (const value of iterable) {

}
Note that you can use const because the variable only exists for a single iteration, not during the entire loop.

Create a for...of loop to iterate through your rows array, assigning each value to a row variable.

for (const row of rows){
  
} step41

In your for...of loop, use the addition operator to concatenate the row value to the result value.
for (const row of rows) {
  result = row + result;
} step42

for (let i = 0; i < count; i = i + 1) {
  rows.push(character.repeat(i + 1))
} step43 repeat()

To see the result of calling your padRow function, declare a call variable and assign your existing padRow call to that variable. 
padRow();
const call = padRow(); step49

function sayName(firstName, lastName) {
  return "John Doe";
}

sayName("Camper", "Cat");
This function would return "John Doe" regardless of the arguments passed to the parameters firstName, and lastName, so "John Doe" is considered a hard-coded value.

Declare a sum variable and assign it the value of calling your addTwoNumbers function with 5 and 10 as the arguments. Log the sum variable to the console.
let sum;
function addTwoNumbers(a, b){
  return a + b;
}
sum = addTwoNumbers(5, 10);
console.log(sum); step55

This example would return "Professor Naomi". Update your padRow function to return the value of concatenating your character variable to the beginning of the name parameter.
function padRow(name) {
  return character + name;
} step57

To use your "Testing" value, return it out of the padRow function by updating your return statement to return only the test variable.
function padRow(name) {
  const test = "Testing";  
  return test;
}


Copy the console log and paste it above the return statement. Now, the string "This works!" should appear in the console.

An important thing to know about the return keyword is that it does not just define a value to be returned from your function, it also stops the execution of your code inside a function or a block statement. This means any code after a return statement will not run.

function padRow(name) {
  const test = "Testing";
  console.log("This works!");
  return test;
  console.log("This works!");
}
step60

Replace the character.repeat(i + 1) in your .push() call with a function call for your padRow function.
for (let i = 0; i < count; i = i + 1) {
  return .push(padRow());
} step66

Use the addition operator to concatenate a single space " " to the beginning and end of your repeated character string. 
function padRow(rowNumber, rowCount) {
  return  " " + character.repeat(rowNumber) + " ";
} step 68

Update your loop condition to run while i is less than or equal to count. 
for (let i = 1; i <= count; i++) {
  rows.push(padRow(i, count));
} step75

A falsy value is the opposite - a value considered false when evaluated as a boolean. JavaScript has a defined list of falsy values. Some of them include false, 0, "", null, undefined, and NaN.

Step 86
Right now, if you change continueLoop to true, your while loop will run forever. This is called an infinite loop, and you should be careful to avoid these. An infinite loop can lock up your system, requiring a full restart to escape.

To avoid this, start by using the increment operator to increase the value of the done variable inside your loop.
while (continueLoop) {
  done++;
}

Step 88
The equality operator can lead to some strange behavior in JavaScript. For example, "0" == 0 is true, even though one is a string and one is a number.

The strict equality operator === is used to check if two values are equal and share the same type. As a general rule, this is the equality operator you should always use. With the strict equality operator, "0" === 0 becomes false, because while they might have the same value of zero, they are not of the same type.

Step 90
To make your pyramid generate again, push the result of calling padRow with done and count as the arguments to your rows array, similar to what you did in your first loop.
 rows.push(padRow(done, count));

 The strict inequality operator !== allows you to check if two values are not equal, or do not have the same type. The syntax is similar to the equality operator: value !== 4.

Update your while loop condition to check if done is not equal to count.
while (done !== count) {
  done++;
  rows.push(padRow(done, count));
  if (done === count) {
    continueLoop = false;
  } 
}

Step 99
What if you made your pyramid upside-down, or inverted? Time to try it out!

Start by creating a new for loop. Declare your iterator i and assign it the value of count, then use the boolean false for your condition and iteration statements.
for (let i = count; false; false) 
use ;;;;;;;;!!!!!!!!

Step 102
Again, push the result of calling padRow with your i and count variables to your rows array.

Open up the console to see the upside-down pyramid.

for (let i = count; i > 0; i = i - 1) {
  rows.push(padRow(i, count))
}

Step 111
Your pyramid is no longer inverted. This is because you are adding new rows to the end of the array.

Update your loop body to add new rows to the beginning of the array.
for (let i = 1; i <= count; i++) {
  rows.push(padRow(i, count));
  rows.unshift(padRow(i, count));
}

Step 113
Use an if statement to check if inverted is true. Remember that you do not need to use an equality operator here.
for (let i = 1; i <= count; i++) {
  if (inverted){}
  rows.unshift(padRow(i, count));
}

const character = "!";
const count = 10;
const rows = [];
let inverted = false;

function padRow(rowNumber, rowCount) {
  return " ".repeat(rowCount - rowNumber) + character.repeat(2 * rowNumber - 1) + " ".repeat(rowCount - rowNumber);
}

for (let i = 1; i <= count; i++) {
  if (inverted) {
    rows.unshift(padRow(i, count));
  } else {
    rows.push(padRow(i, count));
  }
}

let result = ""

for (const row of rows) {
  result = result + "\n" + row;
}

console.log(result);

Step 1 

A teacher has finished grading their students' tests and needs your help to calculate the average score for the class.

Complete the getAverage function which takes in an array of test scores and returns the average score.

The average is calculated by adding up all the scores and dividing by the total number of scores.

示例代码
average = sum of all scores / total number of scores
A couple of function calls have been provided for you so you can test out your code.

Tips

You can use a loop to iterate over the scores array and add up all the scores.
You can use the length property to get the total number of scores.
function getAverage(scores) {
  let sum = 0;
  for (let i = 0; i < scores.length; i++) {
    sum += scores[i];
  }
  return sum / scores.length;
}

console.log(getAverage([92, 88, 12, 77, 57, 100, 67, 38, 97, 89]));
console.log(getAverage([45, 87, 98, 100, 86, 94, 67, 88, 94, 95]));
console.log(getAverage([38, 99, 87, 100, 100, 100, 100, 100, 100, 100]));

这里i 和 sum 定义的变量都应该在函数内，不能使用全局变量。

function getGrade(score) {
  if (score == 100) {
    return "A++";
  } else if (score >= 90) {
    return "A";
  } else if (score >= 80) {
    return "B";
  } else if (score >= 70) {
    return "C";
  } else if (score >= 60) {
    return "D";
  } else {
    return "F";
  }
}

console.log(getGrade(96));
console.log(getGrade(82));
console.log(getGrade(56));


function hasPassingGrade(score) {
  if (getGrade(score) == "F") {
    return false;
  } else {
    return true;
  }
}




function getAverage(scores) {
  let sum = 0;

  for (const score of scores) {
    sum += score;
  }

  return sum / scores.length;
}

function getGrade(score) {
  if (score === 100) {
    return "A++";
  } else if (score >= 90) {
    return "A";
  } else if (score >= 80) {
    return "B";
  } else if (score >= 70) {
    return "C";
  } else if (score >= 60) {
    return "D";
  } else {
    return "F";
  }
}

function hasPassingGrade(score) {
  return getGrade(score) !== "F";
}

function studentMsg(totalScores, studentScore) {
  if (hasPassingGrade(studentScore)){
      return "Class average: " + getAverage(totalScores) + ". Your grade: " + getGrade(studentScore) + ". You passed the course.";
  } else {
      return "Class average: " + getAverage(totalScores) + ". Your grade: " + getGrade(studentScore) + ". You failed the course.";
  }
}
console.log(studentMsg([92, 88, 12, 77, 57, 100, 67, 38, 97, 89], 37));
console.log(studentMsg([56, 23, 89, 42, 75, 11, 68, 34, 91, 19], 100));


let button1 = document.querySelector("#button1");

Step 30
Finally, use querySelector() to get the #monsterHealth element. Because you have already declared a monsterHealth variable earlier, you need to use a different variable name for this element.

Declare a new variable with the const keyword and name it  
const monsterHealthText = document.querySelector("#monsterHealth");

In this example, button is the button element, and myFunction is a reference to a function. When the button is clicked, myFunction will be called.

Use dot notation to set the onclick property of your button1 to the function reference of goStore. Note that button1 is already declared, so you don't need to use let or const.
button1.onclick = goStore;

When a player clicks your Go to store button, you want to change the buttons and text. Remove the code inside the goStore function and add a line that updates the text of button1 to say "Buy 10 health (10 gold)".

function goStore() {
  button1.innerText = "Buy 10 health (10 gold)";
}

Step 40
You will also need to update the functions that run when the buttons are clicked again.

In your goStore() function, update the onclick property for each button to run buyHealth, buyWeapon, and goTown, respectively.
function goStore() {
  button1.innerText = "Buy 10 health (10 gold)";
  button2.innerText = "Buy weapon (30 gold)";
  button3.innerText = "Go to town square";
  button1.onclick = buyHealth;
  button2.onclick = buyWeapon;
  button3.onclick = goTown;
}

Step 45
You need to wrap the text Store in double quotes. Because your string is already wrapped in double quotes, you'll need to escape the quotes around Store. You can escape them with a backslash \. Here is an example:  text.innerText = "You are in the town square. You see a sign that says \"Store\".";

The second way to access the properties of an object is bracket notation ([]). If the property of the object you are trying to access has a space in its name, you will need to use bracket notation.
Update your console statement to use bracket notation to access the property "Number of legs" of the cat object.  console.log(cat["Number of legs"]);

Step 54
Your locations array will hold different locations like the store, the cave, and the town square. Each location will be represented as an object.

Inside your locations array, add an object. Inside that object add a key called name with a value of "town square".

const locations = [
  {name:"town square"}
];

Step 57
Create another property in your object called button functions. Give this property an array containing the three functions assigned to the onclick properties in the goTown function. Remember that these functions are variables, not strings, and should not be wrapped in quotes.

"button functions": [goStore, goCave, fightDragon]

Step 58
Add one final property to the object named text. Give this property the same string value as the one assigned to text.innerText in the goTown function.
"text":"You are in the town square. You see a sign that says \"Store\"."

function goTown() {
  button1.innerText = "Go to store";
  button2.innerText = "Go to cave";
  button3.innerText = "Fight dragon";
  button1.onclick = goStore;
  button2.onclick = goCave;
  button3.onclick = fightDragon;
  text.innerText = "You are in the town square. You see a sign that says \"Store\".";
}

function goStore() {
  button1.innerText = "Buy 10 health (10 gold)";
  button2.innerText = "Buy weapon (30 gold)";
  button3.innerText = "Go to town square";
  button1.onclick = buyHealth;
  button2.onclick = buyWeapon;
  button3.onclick = goTown;
  text.innerText = "You enter the store.";
}

Step 61
Instead of assigning the innerText and onclick properties to specific strings and functions, the update function will use data from the location that is passed into it. First, that data needs to be passed.

Inside the goTown function, call the update function. Here is an example of calling a function named myFunction:
function goTown() {
  update();
}

Step 68
Finally, update the text.innerText assignment to equal the text from the location object. However, instead of using bracket notation, use dot notation.

Here is an example of accessing the name property of an object called person:
text.innerText = location.text;

Step 76
Now that you are updating the gold and health variables, you need to display those new values on the game screen. You have retrieved the healthText and goldText elements in a prior step.

After your assignment lines, assign the innerText property of goldText to be the variable gold. Use the same pattern to update healthText with the health variable.

You can test this by clicking your "Go to store" button, followed by your "Buy Health" button.

Note: Your answer should only be two lines of code.
goldText.innerText = gold;
  healthText.innerText = health;
gold -= 10;
  health += 10;
  goldText.innerText = gold;
  healthText.innerText = health;

  Step 77
What if the player doesn't have enough gold to buy health? You should use an if statement to check if the player has enough gold to buy health.

In the previous project, you learned how to work with if statements like this: 
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  }
}


Step 81
Just like your locations array, your weapons array will hold objects. Add four objects to the weapons array, each with two properties: name and power. The first should have the name set to "stick" and the power set to 5. The second should be "dagger" and 30. The third, "claw hammer" and 50. The fourth, "sword" and 100.
const weapons = [
  {
    name:"stick",
    power:5
  },
  {
    name:"dagger",
    power:30
  },
  {
    name:"claw hammer",
    power:50
  },
  {
    name:"sword",
    power:100
  }
];

Step 83
Similar to your buyHealth function, set gold equal to 30 less than its current value. Make sure this is inside your if statement. function buyWeapon() {
  if (gold >= 30) {
    gold -= 30;
  }
}

Step 84
The value of the currentWeaponIndex variable corresponds to an index in the weapons array. The player starts with a "stick", since currentWeaponIndex starts at 0 and weapons[0] is the "stick" weapon.

In the buyWeapon function, use compound assignment to add 1 to currentWeaponIndex - the user is buying the next weapon in the weapons array.
function buyWeapon() {
  if (gold >= 30) {
    gold -= 30;
    currentWeaponIndex += 1;
  }
}

Step 88
Use bracket notation to access an object within the weapons array and assign it to your newWeapon variable. Place the variable currentWeaponIndex within the brackets.

When you use a variable in bracket notation, you are accessing the property or index by the value of that variable.

For example, this code uses the index variable to access a value of array.
function buyWeapon() {
  if (gold >= 30) {
    gold -= 30;
    currentWeaponIndex++;
    goldText.innerText = gold;
    let newWeapon = weapons[currentWeaponIndex];
    text.innerText = "You now have a new weapon.";
  }
}

weapons[currentWeaponIndex] is an object. Use dot notation to get the name property of that object.  let newWeapon = weapons[currentWeaponIndex].name;

Step 91
Back at the beginning of this project, you created the inventory array. Add the newWeapon to the end of the inventory array using the push() method.

In the previous project, you learned how to work with the push method like this:
inventory.push(newWeapon);
Step 92
Up until now, any time text.innerText was updated, the old text was erased. This time, use the += operator to add text to the end of text.innerText.

Add the string " In your inventory you have: " - include the spaces at the beginning and the end.

text.innerText += " In your inventory you have: ";

Step 93
At the end of the second text.innerText string you just added, use the concatenation operator to add the contents of inventory to the string.

text.innerText += " In your inventory you have: " + inventory;

Step 101
Once a player has the most powerful weapon, you can give them the ability to sell their old weapons.

In the outer else statement, set button2.innerText to "Sell weapon for 15 gold". Also set button2.onclick to the function name sellWeapon.
} else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }

  Step 104
Inside the if statement, set gold equal to 15 more than its current value. Also update goldText.innerText to the new value.

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
  }
}

Use the shift() method to take the first element from the inventory array and assign it to your currentWeapon variable.
currentWeapon = inventory.shift();