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

Step 112
In your fightSlime function, set fighting equal to 0 - the index of slime in the monsters array. Remember that you already declared fighting earlier in your code, so you do not need let or const here.
function fightSlime() {
  fighting = 0;
  goFight();
}
Step 117
Below your update call, set the monsterHealth to be the health of the current monster. You can get this value by accessing the health property of monsters[fighting] with dot notation.

monsterHealth = monsters[fighting].health;

Step 118
By default, the HTML element that shows the monster's stats has been hidden with CSS. When the player clicks the "Fight dragon" button, the monster's stats should be displayed. You can accomplish this by using the style and display properties on the monsterStats element.

The style property is used to access the inline style of an element and the display property is used to set the visibility of an element.

Here is an example of how to update the display for a paragraph element:
Display the monsterStats element by updating the display property of the style property to block.

 const monsterStats = document.querySelector('monsterStats');
  monsterStats.style.display = 'block';

  Step 119
Now, you will need to update the text for the current monster's name and health.

Start by assigning monsters[fighting].name to the innerText property of monsterName. Then, assign monsterHealth to the innerText property of monsterHealthText.
monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;

  Step 120
Now you can build the attack function. First, update the text message to say "The <monster name> attacks.", replacing <monster name> with the name of the monster. Remember you can use the concatenation operator for this.
function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
}

Step 121
On a new line, use the addition assignment operator(+=), to add the string " You attack it with your <weapon>." to the text value, replacing <weapon> with the player's current weapon. Additionally, remember that this line of text starts with a space so it will properly display.
text.innerText += " You attack it with your " + weapons[currentWeaponIndex].name + ".";

Step 122
Next, set health to equal health minus the monster's level. Remember you can get this from the monsters[fighting].level property.
health -= monsters[fighting].level;

Step 124
The Math object in JavaScript contains static properties and methods for mathematical constants and functions. One of those is Math.random(), which generates a random number from 0 (inclusive) to 1 (exclusive). Another is Math.floor(), which rounds a given number down to the nearest integer.

Using these, you can generate a random number within a range. For example, this generates a random number between 1 and 5: Math.floor(Math.random() * 5) + 1;.

Following this pattern, use the addition operator (+) to add a random number between 1 and the value of xp to your monsterHealth -= weapons[currentWeaponIndex].power.

monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;

Step 130
In your defeatMonster function, set gold equal to gold plus the monster's level times 6.7. Remember you can get the monster's level by using monsters[fighting].level.

Here is an example of setting num to num plus 5 * 8: num += 5 * 8. Use Math.floor() to round the result down.
gold += Math.floor(monsters[fighting].level * 6.7);

Step 132
Now update goldText and xpText to display the updated values.
function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
}

Step 134
Your locations array doesn't have a fifth element, so locations[4] doesn't work.

Add a new object at the end of the locations array, following the same structure as the other objects. Set name to "kill monster", set "button text" to an array with three "Go to town square" strings, set "button functions" to an array with three goTown variables, and set text to "The monster screams Arg! as it dies. You gain experience points and find gold.".

{
    name:"kill monster",
    "button text":["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, goTown],
    text:"The monster screams Arg! as it dies. You gain experience points and find gold."
  }

  Step 136
After a monster is defeated, the monster's stat box should no longer display.

On the first line of the update function, use monsterStats.style.display to change the display value to none.
 monsterStats.style.display = "none";

 Step 138
At the end of your code, create a restart function. Inside this function, set xp to 0, health to 100, gold to 50, currentWeaponIndex to 0, and set inventory to an array with the string stick.

Also update the innerText properties of goldText, healthText, and xpText to their current values.

Finally, call the goTown() function.
function restart(){
  xp = 0;
  health = 100;
  gold = 50;
  currentWeaponIndex = 0;
  inventory = ["stick"];
  goldText.innerText = goldText;
  healthText.innerText = healthText;
  xpText.innerText = xpText;
  goTown();
}

Step 140
Back to your attack function - inside the else if block, create another if and else statement. If the player is fighting the dragon (fighting would be 2), call the winGame function. Move the defeatMonster() call to the else block.

For this step, you will need to use the strict equality (===) operator to check if fighting is equal to 2.
 monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    defeatMonster();
    if (fighting === 2){
    winGame();
  } else{
    defeatMonster();
  }


Step 141
In order for the &#x2620; emoticon text to properly display on the page, you will need to use the innerHTML property.

The innerHTML property allows you to access or modify the content inside an HTML element using JavaScript.

Here is an example of updating the content for this paragraph element using the innerHTML property.
  In the update function, change text.innerText to text.innerHTML.

  text.innerHTML = location.text;

  Step 149
If you play the game in its current state you might notice a bug. If your xp is high enough, the getMonsterAttackValue function will return a negative number, which will actually add to your total health when fighting a monster! You can fix this issue by using a ternary operator to ensure negative values are not returned.

The ternary operator is a conditional operator and can be used as a one-line if-else statement. The syntax is: condition ? expressionIfTrue : expressionIfFalse.
// if-else statement
if (score > 0) {
  return score
} else {
  return default_score
}

// ternary operator
return score > 0 ? score : default_score
In getMonsterAttackValue, change return hit to a ternary operator that returns hit if hit is greater than 0, or returns 0 if it is not.
return hit > 0? hit : 0;

Step 150
In your attack function, find the line of code that updates the monsterHealth variable and place it within an if block with a condition that calls the isMonsterHit function.

if (isMonsterHit()){
    monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;
  };

  Step 152
Now create the isMonsterHit function. This will return a boolean value (true or false) to be used in your if statement. Return the result of the comparison Math.random() > .2.
function isMonsterHit(){
  return Math.random() > .2;
}

Step 153
The player should hit if either Math.random() > .2 or if the player's health is less than 20.

At the end of your return statement, use the logical OR operator || and check if health is less than 20.

The logical OR operator will use the first value if it is truthy – that is, anything apart from NaN, null, undefined, 0, -0, 0n, "", and false. Otherwise, it will use the second value.

For example: num < 10 || num > 20.
function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}


Step 155
Use the += operator to add " Your <weapon> breaks.", with a space in front of Your, to the end of text.innerText. Replace <weapon> with the last item in the inventory array using inventory.pop(), which will remove the last item in the array AND return it so it appears in your string.
if (Math.random() <= .1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
  }

Step 157
We don't want a player's only weapon to break. The logical AND operator checks if two statements are true.

Use the logical AND operator && to add a second condition to your if statement. The player's weapon should only break if inventory.length does not equal (!==) one.

Here is an example of an if statement with two conditions:
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeaponIndex--;
  }

  Step 164
Inside your while loop, push a random number between 0 and 10 to the end of the numbers array. You can create this random number with Math.floor(Math.random() * 11).
function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
}

Step 166
At the end of the string, before the final quote, insert the new line escape character \n. This will cause the next part you add to text.innerText to appear on a new line.
function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
}

Step 168
Now you can write the logic to run in the loop. Inside your for loop, use the += operator to add to the end of text.innerText. Add the number at index i of the numbers array, using numbers[i]. Then add a new line, using the escape sequence you used earlier.
text.innerText += numbers[i] + "\n";

Step 169
The .includes() method determines if an array contains an element and will return either true or false.

Here is an example of the .includes() syntax:

示例代码
const numbersArray = [1, 2, 3, 4, 5]
const number = 3

if (numbersArray.includes(number)) {
  console.log("The number is in the array.")
}
After your for loop, add an if statement to check if the guess is in the numbers array. You can use the .includes() method to check if the array contains the guess.
if (numbers.includes(guess)){
    
  }

  Step 170
Inside the if statement, add the string "Right! You win 20 gold!" to the end of text.innerText. Also, add 20 to the value of gold and update the goldText.innerText.
function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  }
}

Step 6
CamperBot has now created a function called changeBackgroundColor that changes the background color of the page to a random color from the darkColorsArr array. The function also displays the hex code for that new color.

When they try to test out this function, they notice that the background color is not changing and the text shows the following:

示例代码
Hex Code: undefined
undefined is showing up here because the color variable is not being set correctly.

Fix the error in the darkColorsArr[getRandomIndex] line so that the color variable is set to a random color from the darkColorsArr array.
function changeBackgroundColor() {
  const color = darkColorsArr[getRandomIndex()];

  bgHexCodeSpanElement.innerText = color;
  body.style.backgroundColor = color;
}
changeBackgroundColor();

Step 8
CamperBot has finished building out their random background color changer. However, when they click the button, the background color does not change.

It looks like they are trying to use the onclick property but they are using it incorrectly. The onclick property should be assigned a function reference.

Fix the error in the btn.onclick = changeBackgroundColor(); line.

Remember that you worked with the onclick property in the Role playing game project. Look back at the final solution to see how onclick was properly used.

Once you fix that final bug, the random background color changer will be complete!
btn.onclick = changeBackgroundColor;

Step 11
Create another div element. Within it, nest a button to submit the form. This button should have the text Calculate Remaining Calories.

Then add a button with the id set to clear to clear the form (don't forget to give it a type attribute that prevents it from submitting the form). This button needs the text Clear.

<div>
    <button type="submit">Calculate Remaining Calories</button>
    <button id ="clear" type="button">Clear</button>
  </div>

  <script src="./script.js"></script>

  Begin by getting the form element (using the id) and storing it in a variable called calorieCounter.
  const calorieCounter = document.getElementById("calorie-counter");

  Step 19
To match specific characters in a string, you can use Regular Expressions or "regex" for short.

Regex in JavaScript is indicated by a pattern wrapped in forward slashes. The following example will match the string literal "hello":
const regex = /hello/;
Declare a regex variable and assign it the value from the example above. In future steps, you will update this regex pattern to match specific characters needed for the calorie counter.
function cleanInputString(str) {
  const regex = /hello/;
}

Step 20
The current pattern will match the exact text "hello", which is not the desired behavior. Instead, you want to search for +, -, or spaces. Replace the pattern in your regex variable with \+- to match plus and minus characters.

Note that you need to use the backslash \ character to escape the + symbol because it has a special meaning in regular expressions.

function cleanInputString(str) {
  const regex = /\+-/;
}

Step 22
Your current pattern won't work just yet. /+-\s/ looks for +, -, and a space in order. This would match +- hello but would not match +hello.

To tell the pattern to match each of these characters individually, you need to turn them into a character class. This is done by wrapping the characters you want to match in brackets. For example, this pattern will match the characters h, e, l, or o:
const regex = /[helo]/;
Turn your +-\s pattern into a character class. Note that you no longer need to escape the + character, because you are using a character class.
function cleanInputString(str) {
  const regex = /[+-\s]/;
}

Step 23
Regex can also take specific flags to alter the pattern matching behavior. Flags are added after the closing /. The g flag, which stands for "global", will tell the pattern to continue looking after it has found a match. Here is an example:
function cleanInputString(str) {
  const regex = /[+-\s]/g;
}

Step 24
JavaScript provides a .replace() method that enables you to replace characters in a string with another string. This method accepts two arguments. The first argument is the character sequence to be replaced, which can be either a string or a regex pattern. The second argument is the string that replaces the matched sequence.

Since strings are immutable, the replace method returns a new string with the replaced characters.

In this example, the replace method is used to replace all instances of the letter l with the number 1 in the string hello.
"hello".replace(/l/g, "1");
Use your regex to replace all instances of +, -, and a space in str with an empty string. Return this value.
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, "");

}

function cleanInputString(str) {
  console.log("original string: ", str);
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

console.log(cleanInputString("+-99"));

Step 30
The e in a number input can also be an uppercase E. Regex has a flag for this, however – the i flag, which stands for "insensitive".
/Hello/i
The following regex would match hello, Hello, HELLO, and even hElLo because of the i flag. This flag makes your pattern case-insensitive.

Add the i flag to your regex pattern.

Step 31
Number inputs only allow the e to occur between two digits. To match any number, you can use the character class [0-9]. This will match any digit between 0 and 9.

Add this character class before and after e in your pattern.

function isInvalidInput(str) {
  const regex = /[0-9]e[0-9]/i;
}
Step 32
The + modifier in a regex allows you to match a pattern that occurs one or more times. To match your digit pattern one or more times, add a plus after each of the digit character classes. For example: [0-9]+.
function isInvalidInput(str) {
  const regex = /[0-9]+e[0-9]+/i;
}
Step 33
There is a shorthand character class to match any digit: \d. Replace your [0-9] character classes with this shorthand.
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
}

Step 34
Strings have a .match() method, which takes a regex argument. .match() will return an array of match results – containing either the first match, or all matches if the global flag is used.

示例代码
const str = 'example string';
const regex = /example/;
const result = str.match(regex); // Returns ['example']

Return the result of calling the .match() method on str and passing your regex variable as the argument. You'll use this match result later on.

function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);

}

Step 40
You'll need to know which category the entry goes in. Thankfully, you added a dropdown for the user to select a category.

Remember that you queried that dropdown earlier in your JavaScript and assigned it to the entryDropdown button. You can use the value property to get the value of the selected option.

Use concatenation to add a # to the beginning of the value property of entryDropdown, and assign that result to a targetId variable.

function addEntry() {
  targetId = "#" + entryDropdown.value;
}

Step 41
Now you need to target the .input-container element within the element that has your targetId. Declare a new targetInputContainer variable, and assign it the value of document.querySelector(). Use concatenation to separate targetId and '.input-container' with a space, and pass that string to querySelector().
function addEntry() {
  const targetId = '#' + entryDropdown.value;
  const targetInputContainer = document.querySelector(targetId + ' .input-container')
}

function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const targetInputContainer = document.querySelector('#${entryDropdown.value} .input-container');
const entryNumber = targetInputContainer.querySelectorAll(input[type="text"]).length;

}

Step 42
JavaScript has a feature called template literals, which allow you to interpolate variables directly within a string. Template literals are denoted with backticks ``, as opposed to single or double quotes. Variables can be passed in to a template literal by surrounding the variable with ${} – the value of the variable will be inserted into the string.

const name = "Naomi";
const templateLiteral = `Hello, my name is ${name}~!`;
console.log(templateLiteral);

Replace your concatenated string in the querySelector with a template literal – be sure to keep the space between your targetId variable and .input-container.

function addEntry() {
  const targetId = '#' + entryDropdown.value;
  const targetInputContainer = document.querySelector(`${targetId} .input-container`);
}

use `` not '' 注意这个符号 反引号不是单引号

Step 43
Thanks to template literals, you actually don't need the targetId variable at all. Remove that variable, and update your template literal to replace targetId with entryDropdown.value – remember to add # before that, in the string.
function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
}

Step 44
You will want to number the entries a user adds. To get all of the number inputs, you can use the querySelectorAll() method.

The querySelectorAll() method returns a NodeList of all the elements that match the selector. A NodeList is an array-like object, so you can access the elements using bracket notation.

Declare an entryNumber variable and give it the value of targetInputContainer.querySelectorAll(). You do not need to pass an argument to the query selector yet.

function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll();
}
Step 45
Each entry will have a text input for the entry's name, and a number input for the calories. To get a count of the number of entries, you can query by text inputs. Note that you cannot query by number inputs, as you have an extra number input for the user's calorie budget.

Pass the string input[type="text"] to the querySelectorAll() method. Remember that you will need to use single quotes for your string, so that you can use double quotes within.

This will return a NodeList of all the text inputs in the form. You can then access the length property of the NodeList to get the number of entries. Do this on the same line.

function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length;
}

Step 46
Now you need to build your dynamic HTML string to add to the webpage. Declare a new HTMLString variable, and assign it an empty template literal string.
function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length;
  const HTMLString = ``;
  
}
Step 47
Inside your template literal, create a label element and give it the text Entry # Name. Using your template literal syntax, replace # with the value of entryNumber.

  <label>Entry ${entryNumber} Name</label>

  Step 48
Give your label element a for attribute with the value X-#-name, where X is the value of the entryDropdown element and # is the value of entryNumber. Remember that HTML attributes should be wrapped in double quotes.
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>`;

  Step 49
After your label element, and on a new line in your template string, create an input element. Give it a type attribute set to text, a placeholder attribute set to Name, and an id attribute that matches the for attribute of your label element.
function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length;
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name">`;

}

Step 50
Create another label element (on a new line) at the end of your HTMLString. This label should have the text Entry # Calories, using your template literal syntax to replace # with the value of entryNumber, and the for attribute set to X-#-calories, where X is the value of entryDropdown and # is the value of entryNumber.
function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length;
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  `;
}

If you want to add another label and input element inside the form, then you can use the innerHTML property as shown below:

targetInputContainer.innerHTML += HTMLString;
Step 53
In the Role Playing Game project, you learned how to set a button's behavior by editing its onclick property. You can also edit an element's behavior by adding an event listener.

The following example uses the addEventListener method to add a click event to a button. When the button is clicked, the printName function is called.

<button class="btn">Print name</button>
示例代码
const button = document.querySelector('.btn');
function printName() {
  console.log("Jessica");
}
button.addEventListener('click', printName);
The addEventListener method takes two arguments. The first is the event to listen to. (Ex. 'click') The second is the callback function, or the function that runs when the event is triggered.

Call the .addEventListener() method on the addEntryButton. Pass in the string "click" for the first argument and the addEntry function for the second argument.

Note that you should not call addEntry, but pass the variable (or function reference) directly.
addEntryButton.addEventListener('click', addEntry);

Step 54
Try adding a couple of entries to the Breakfast category, and you may notice some bugs! The first thing we need to fix is the entry counts – the first entry should have a count of 1, not 0.

This bug occurs because you are querying for input[type="text"] elements before adding the new entry to the page. To fix this, update your entryNumber variable to be the value of the length of the query plus 1. Add this on your declaration line, not in your template strings.
const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

Step 55
Your other bug occurs if you add a Breakfast entry, fill it in, then add a second Breakfast entry. You'll see that the values you added disappeared.

This is because you are updating innerHTML directly, which does not preserve your input content. Change your innerHTML assignment to use the insertAdjacentHTML() method of targetInputContainer instead. Do not pass any arguments yet.
targetInputContainer.insertAdjacentHTML();

Step 56
The insertAdjacentHtml method takes two arguments. The first argument is a string that specifies the position of the inserted element. The second argument is a string containing the HTML to be inserted.

For the first argument, pass the string "beforeend" to insert the new element as the last child of targetInputContainer.

For the second argument, pass your HTMLString variable.
targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);

Step 59
The list parameter is going to be the result of a query selector, which will return a NodeList. A NodeList is a list of elements like an array. It contains the elements that match the query selector. You will need to loop through these elements in the list.

In previous steps, you learned how to loop through an array using a for loop. You can also use a for...of loop to loop through an array and a NodeList.

A for...of loop is used to iterate over elements in an iterable object like an array. The variable declared in the loop represents the current element being iterated over.

function getCaloriesFromInputs(list) {
  let calories = 0;
  for (const item of list){
    
  }

}

Step 60
The NodeList values you will pass to list will consist of input elements. So you will want to look at the value attribute of each element.

Assign item.value to a const variable called currVal.
for (const item of list) {
    const currVal = item.value;
}

Step 61
Remember that you wrote a function earlier to clean the user's input? You'll need to use that function here.

Update your currVal declaration to be the result of calling cleanInputString with item.value.
const currVal = cleanInputString(item.value);

Step 62
You also need to confirm the input is valid. Declare an invalidInputMatch variable, and assign it the result of calling your isInvalidInput function with currVal as the argument.

function getCaloriesFromInputs(list) {
  let calories = 0;
  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);
  };
}

Step 63
Remember that your isInvalidInput function returns String.match, which is an array of matches or null if no matches are found.

In JavaScript, values can either be truthy or falsy. A value is truthy if it evaluates to true when converted to a Boolean. A value is falsy if it evaluates to false when converted to a Boolean. null is an example of a falsy value.

You need to check if invalidInputMatch is truthy – you can do this by passing the variable directly to your if condition (without a comparison operator). Here's an example of checking the truthiness of  Add an if statement that checks if invalidInputMatch is truthy.
 if (invalidInputMatch){
      
    }

    Step 64
Browsers have a built in alert() function, which you can use to display a pop-up message to the user. The message to display is passed as the argument to the alert() function.

Using a template literal, in your if block, call the alert() function to tell the user "Invalid Input: ", followed by the first value in the invalidInputMatch array.

 if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
    }
  }

  Step 65
In programming, null is meant to represent the absence of a value. In this case, if the user enters an invalid input, you want to alert them and then return null to indicate that the function has failed.

Still within your if block, set isError to true and return null.
if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
  }


  Step 66
Remember that return ends the execution of a function. After your if block, you need to handle the logic for when the input is valid. Because your if statement returns a value, you do not need an else statement.

Use the addition assignment operator to add currVal to your calories total. You'll need to use the Number constructor to convert currVal to a number.

The Number constructor is a function that converts a value to a number. If the value cannot be converted, it returns NaN which stands for "Not a Number".

Here is an example:

示例代码
Number('10'); // returns the number 10
Number('abc'); // returns NaN

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
}

Step 69
You will be attaching this function to the submit event of the form. The submit event is triggered when the form is submitted. The default action of the submit event is to reload the page. You need to prevent this default action using the preventDefault() method of your e parameter.

Add a line to your calculateCalories function that calls the preventDefault() method on the e parameter. Then, reset your global error flag to false.

function calculateCalories(e) {
  e.preventDefault();
  isError = false;
}

Step 70
Your function needs to get the values from the entries the user has added.

Declare a breakfastNumberInputs variable, and give it the value of calling document.querySelectorAll() with the selector #breakfast input[type='number']. This will return any number inputs that are in the #breakfast element.
function calculateCalories(e) {
  e.preventDefault();
  isError = false;
  let breakfastNumberInputs = document.querySelectorAll('#breakfast input[type="number"]');

}
Step 71
Using that same syntax, query your number inputs in the #lunch element and assign them to lunchNumberInputs.
const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");

Step 73
Now that you have your lists of elements, you can pass them to your getCaloriesFromInputs function to extract the calorie total.

Declare a breakfastCalories variable, and assign it the result of calling getCaloriesFromInputs with breakfastNumberInputs as the argument.
const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);

Step 76
You also need to get the value of your #budget input. You already queried this at the top of your code, and set it to the budgetNumberInput variable. However, you used getElementById, which returns an Element, not a NodeList.

A NodeList is an array-like object, which means you can iterate through it and it shares some common methods with an array. For your getCaloriesFromInputs function, an array will work for the argument just as well as a NodeList does.

Declare a budgetCalories variable and set it to the result of calling getCaloriesFromInputs – pass an array containing your budgetNumberInput as the argument.

const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

Step 77
Your getCaloriesFromInputs function will set the global error flag to true if an invalid input is detected. Add an if statement to your calculateCalories function that checks the truthiness of your global error flag, and if it is truthy then use return to end the function execution.
if (isError){
    return
  }

  Step 80
You need to know if the user is in a caloric surplus or deficit. A caloric surplus is when you consume more calories than you burn, and a caloric deficit is when you burn more calories than you consume. Burning as many calories as you consume is called maintenance, and can be thought of as a surplus or deficit of 0, depending on your goals.

Declare a surplusOrDeficit variable. Then use a ternary operator to set surplusOrDeficit to the string "Surplus" or "Deficit" depending on whether remainingCalories is less than 0. If it is less than 0, then surplusOrDeficit should be "Surplus". Otherwise, it should be "Deficit".

const surplusOrDeficit = remainingCalories < 0? "Surplus" : "Deficit";

Step 81
You need to construct the HTML string that will be displayed in the output element. Start by assigning an empty template literal to the innerHTML property of the output element on a new line at the end of the function.
Your output.innerHTML string will need a span element. Create that, and give it a class attribute set to the surplusOrDeficit variable. Your surplusOrDeficit variable should be converted to lower case using the toLowerCase() method.

Do not give your span any text yet.
output.innerHTML = `<span class="${surplusOrDeficit.toLowerCase()}"></span>`;
Step 86
Now create a p element with the text budgetCalories Calories Budgeted, using interpolation to replace budgetCalories with the appropriate variable.

This should come after your hr element.

Step 88
Finally, you need to make the #output element visible so the user can see your text. Your output variable is an Element, which has a classList property. This property has a .remove() method, which accepts a string representing the class to remove from the element.
Use the .remove() method of the output variable's classList property to remove the hide class. Don't forget to place the word hide inside quotes.
output.classList.remove('hide');
Step 89
If you click on your Calculate Remaining Calories button, you'll see that nothing happens. You still need to mount the event listener.

Add an event listener to your calorieCounter element. The event type should be submit, and the callback function should be calculateCalories.
calorieCounter.addEventListener("submit", calculateCalories);
Step 91
You need to get all of the input containers. Declare an inputContainers variable, and assign it to the value of querying the document for all elements with the class input-container.
function clearForm() {
  const inputContainers = document.querySelectorAll(".input-container")
}

Step 92
Remember that document.querySelectorAll returns a NodeList, which is array-like but is not an array. However, the Array object has a .from() method that accepts an array-like and returns an array. This is helpful when you want access to more robust array methods, which you will learn about in a future project.Wrap your inputContainers query selector in Array.from(). Do this on the same line as your declaration.

function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));
}

Step 93
It is time for another loop. Create a for...of loop with a variable called container to iterate through the inputContainers array.

Inside the loop, set the innerHTML property of the container to an empty string. This will clear all of the contents of that input container.

for (const container of inputContainers){
    container.innerHTML = "";
  }

  Step 94
After your loop completes, you need to clear the budgetNumberInput. Set the value property of budgetNumberInput to an empty string.
 budgetNumberInput.value = "";

 Step 95
You also need to clear the output element's text. You can do this by setting the innerText property to an empty string.

The difference between innerText and innerHTML is that innerText will not render HTML elements, but will display the tags and content as raw text.
output.innerText = "";
Step 96
To finish off this function, you need to restore the hide class to the output element. The classList property has an .add() method which is the opposite of the .remove() method. It accepts a string representing the class to add to the element.

Add the hide class to your output.
output.classList.add('hide');
clearButton.addEventListener("click", clearForm);

Step 1
The first step is to build out the function that will generate a random choice for the computer.

The getRandomComputerResult function will be used to get the computer's choice. Inside that function, you should see an options array with "Rock", "Paper", and "Scissors".

Your task is to complete the getRandomComputerResult function so that it returns a random option from the options array.

Tips

You can use Math.random() and Math.floor() to help you get a random whole number. This will represent the index number for the options array.
You can use the random index to access the option from the options array.

function getRandomComputerResult() {
  const options = ["Rock", "Paper", "Scissors"];
  return options[Math.floor(Math.random() * 3)];
}
console.log(getRandomComputerResult());

Step 2
In the game, there will be multiple rounds. The first to reach three points wins the game.

In this step, you will focus on determining if the player has won the round.

Complete the hasPlayerWonTheRound function. This function has two parameters: player and computer. The function should return true if the player has won the round, and false if the player has lost or tied the round.

Here are the criteria for the player to win a round:

If the player chooses "Rock" and the computer chooses "Scissors"
If the player chooses "Scissors" and the computer chooses "Paper"
If the player chooses "Paper" and the computer chooses "Rock"
A few function calls have been provided for you to test your function.

function hasPlayerWonTheRound(player, computer) {
  if (player == "Rock" && computer == "Scissors"){
    return true;
  } else if (player == "Scissors" && computer == "Paper"){
    return true;
  } else if (player == "Paper" && computer == "Rock"){
    return true;
  } else if (player === computer){
    return false;
  } else {
    return false;
  }
}

console.log(hasPlayerWonTheRound("Rock", "Scissors")); 
console.log(hasPlayerWonTheRound("Scissors", "Rock"));  

Step 3
Now it is time to get the results of the round. Complete the getRoundResults function.

If the player wins the round, update the playerScore by 1 and return the message "Player wins! [player's choice] beats [computer's choice]".

If the computer and player choose the same option, return the message "It's a tie! Both chose [player's choice]".

If the computer wins the round, update the computerScore by 1 and return the message "Computer wins! [computer's choice] beats [player's choice]".

[computer's choice] should be replaced with computerResult while [player's choice] should be replaced with the userOption.

Tips

Remember you can use the hasPlayerWonTheRound function to check if the player wins the round.
You can use template literals or regular string concatenation to build the message.

function getRoundResults(userOption) {
  const computerResult = getRandomComputerResult();
  if (computerResult == true) {
    playerScore++;
    return `"Player wins! ${userOption} beats ${computerResult}"`;
  } else if (userOption === computerResult){
    return `"It's a tie! Both chose ${userOption}`;
  } else {
    computerScore++;
    return `"Computer wins! ${computerResult} beats ${userOption}"`;
  }
}

console.log(getRoundResults("Rock"));
console.log("Player Score: ", playerScore, "Computer Score: ", computerScore);

Step 4
Now it is time to update the scores and the round results message.

Complete the showResults function. The playerScoreSpanElement and computerScoreSpanElement should be updated to show the updated scores of the player and computer.

The roundResultsMsg should also be updated with the result of the round.

Tips

Remember that you learned how to work with the innerText property to update the text content of an element.
You can use the getRoundResults function to get the result of the round.

function showResults(userOption) {
  roundResultsMsg.innerText = getRoundResults(userOption);
  playerScoreSpanElement.innerText = playerScore;
  computerScoreSpanElement.innerText = computerScore;
};

Step 5
If you try to play the game, you will see that you can play for an infinite amount of rounds. But the rules state that the first one to three points wins.

Inside your showResults function, you will need to check if the player or computer has reached three points. If either has reached three points, you should display a message indicating the winner.

For example, if the player has won the game, then the winnerMsgElement should be updated to "Player has won the game!". If the computer has won the game, then the winnerMsgElement should be updated to "Computer has won the game!".

If there is a winner, you will want to show the resetGameBtn button and hide the optionsContainer so the player can play again.

Tips

Use the style.display property on an element, with the value "block" or "none", to show or hide the element.

function showResults(userOption) {
  roundResultsMsg.innerText = getRoundResults(userOption);
  computerScoreSpanElement.innerText = computerScore;
  playerScoreSpanElement.innerText = playerScore;
  if (playerScore = 3){
    winnerMsgElement.innerText = "Player has won the game!";
    optionsContainer.style.display = "none";
  } else if (computerScore = 3){
    winnerMsgElement.innerText = "Computer has won the game!";
    
  };
  resetGameBtn.style.display = "block";
  

};

Step 6
If the player or computer has won the game, there should be an option to reset the game and play again.

Complete the resetGame function that accomplishes the following:

Resets the player and computer scores to 0.
Updates the playerScoreSpanElement and computerScoreSpanElement to display the new scores.
Hides the resetGameBtn button.
Shows the optionsContainer so the player can play again.
Clears the content for the winnerMsgElement and roundResultsMsg elements.
Tips

You can use the innerText property to update the content of an element. To clear the content of an element, you can set the innerText to an empty string.
Once you apply those changes, you will have completed the Rock, Paper, Scissors game!

function resetGame() {
  playerScore = 0;
  computerScore = 0;

  playerScoreSpanElement.innerText = playerScore;
  computerScoreSpanElement.innerText = computerScore;
  resetGameBtn.style.display = "none";
  optionsContainer.style.display = "block";
  winnerMsgElement.innerText = "";
  roundResultsMsg.innerText = "";
};

步骤 1
在这个项目中，你将通过构建音乐播放器应用程序学习基本的字符串和数组方法。 你将能够播放、暂停、跳过和随机播放歌曲。

该项目的 HTML 和 CSS 已为你提供，因此你可以专注于 JavaScript。

首先使用 getElementById() 方法访问 #playlist-songs、#play 和 #pause 元素。 将它们分别分配给变量 playlistSongs、playButton 和 pauseButton。

const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");

步骤2
从 HTML 文件访问 #next、#previous 和 #shuffle 元素。

将它们分别分配给名为 nextButton、previousButton 和 shuffleButton 的变量。
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

步骤 3
接下来，创建一个数组来存储所有歌曲。

创建一个空的 allSongs 数组。
const allSongs = [];
步骤4
在 allSongs 数组内，创建一个具有以下属性和值的对象：
const allSongs = [
  {
  id: 0,
title: "Scratching The Surface",
artist: "Quincy Larson",
duration: "4:25",
src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
}];
步骤7
我们已将其余歌曲添加到 allSongs 数组中。

接下来，你将了解 Web Audio API 以及如何使用它来播放歌曲。 所有现代浏览器都支持 Web Audio API，它允许你在 Web 应用程序中生成和处理音频。

使用 const 创建一个名为 audio 的变量，并将其设置为等于 new Audio()。 这将创建一个新的 HTML5 audio 元素。


const audio = new Audio();

步骤 8
你的音乐播放器应该跟踪歌曲、当前播放的歌曲以及当前歌曲的时间。 为此，你需要创建一个对象来存储此信息。

首先使用 let 关键字声明一个名为 userData 的新变量，并为其分配一个空对象。

let userData = {};
{}就是空对象

步骤 9
由于用户可以随机播放和删除播放列表中的歌曲，因此你需要创建 allSongs 数组的副本而不改变原始数组。 这时 spread 操作符就派上用场了。

扩展运算符（...）允许你将一个数组中的所有元素复制到另一个数组中。 它还可用于将多个数组连接成一个。 在下面的例子中，arr1 和 arr2 都已扩展到 combinedArr：
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const combinedArr = [...arr1, ...arr2];
console.log(combinedArr); // Output: [1, 2, 3, 4, 5, 6]
在 userData 对象内部创建 songs 属性。 对于值，将 allSongs 展开到数组中。
let userData = {
  songs : [...allSongs],
};

步骤 10
为了处理当前歌曲的信息并跟踪其播放时间，创建 currentSong 和 songCurrentTime 属性。 将值分别设置为 null 和 0。

let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0
};
步骤11
在以前的项目中，你使用了常规函数。 但在其余的项目中，你将使用箭头函数。 接下来的几个步骤将重点教你箭头函数的基础知识。

箭头函数是一种匿名函数表达式，是一种更简短的函数编写方式。 匿名是指函数没有名字。 箭头函数始终是匿名的。

基本语法如下：

示例代码
() => {}
要创建命名箭头函数，可以将该函数分配给变量：
const exampleFunction = () => {
  // code goes here
}
创建一个名为 printGreeting 的新命名箭头函数。 在该函数主体内使用 console.log() 方法打印字符串 "Hello there!"。
const printGreeting = () => {
  console.log("Hello there!");
}
步骤 12
要调用命名箭头函数表达式，可以通过其名称引用该函数。

示例代码
exampleArrowFunction();
在 printGreeting 函数定义下方，调用该函数。 打开控制台查看输出。
const printGreeting = () => {
  console.log('Hello there!'); 
}
printGreeting();
步骤 13
与常规函数一样，箭头函数可以接受多个参数。

下面是具有一个参数的命名箭头函数的示例：

示例代码
const greet = (name) => {
  console.log(`Hello, ${name}!`);
};
如果函数只有一个参数，则可以省略参数列表周围的括号，如下所示：

示例代码
const greet = name => {
  console.log(`Hello, ${name}!`);
};
创建一个名为 printMessage 的新箭头函数，该函数有一个名为 org 的参数。 在该函数主体内，添加一个控制台语句。 在该控制台语句中，添加模板文字 ${org} is awesome!。

在 printMessage 函数下方，调用该函数并传入字符串 "freeCodeCamp" 作为参数。

打开控制台查看结果。
const printMessage = (org) => {
  console.log(`${org} is awesome!`);
}
printMessage("freeCodeCamp");
第 14 步
与常规函数一样，箭头函数可以返回值。

以下是箭头函数返回两个数字相乘的结果的示例：

示例代码
const multiplyTwoNumbers = (num1, num2) => {
  return num1 * num2;
}

// Output: 12
console.log(multiplyTwoNumbers(3, 4)); 
创建一个名为 addTwoNumbers 的新变量并为其分配一个箭头函数。 这个箭头函数应该采用两个参数，分别称为 num1 和 num2。 在函数主体内部，返回 num1 与 num2 相加的表达式。

在 addTwoNumbers 函数下方，添加一个控制台语句。 在该控制台语句中，调用 addTwoNumbers 函数并传入数字 3 和 4 作为参数。

打开控制台查看输出。
const addTwoNumbers = (num1, num2) => {
  return num1 + num2;
}

console.log(addTwoNumbers(3, 4));
步骤15
如果箭头函数返回一个简单的表达式，则可以省略 return 关键字和花括号 {}。 这被称为隐式返回。

示例代码
const multiplyTwoNumbers = (num1, num2) => num1 * num2;
如果你的箭头函数在函数体中有多行代码，那么你需要使用 return 关键字和花括号 {}。

示例代码
const getTax = (price) => {
  const taxRate = 0.08;
  const tax = price * taxRate;
  return tax;
};
重构或更新你的 addTwoNumbers 函数以删除 return 关键字和花括号 {}。 你的 addTwoNumbers 函数应该使用隐式返回。

打开控制台以确保你仍然获得正确的输出。
const addTwoNumbers = (num1, num2) => num1 + num2;

Step 17
要在 UI（用户界面）中显示歌曲，你需要创建一个函数。

使用箭头函数语法创建一个 renderSongs 函数，该函数以 array 作为其参数。
const renderSongs = (array) =>{
  
}
步骤 19
map() 方法用于遍历数组并返回一个新数组。 当你想根据现有数组的值创建新数组时，它很有用。 举个例子：

示例代码
const numbers = [1, 2, 3];
const doubledNumbers = numbers.map((number) => number * 2); // doubledNumbers will be [2, 4, 6]
请注意，map() 方法接受函数作为参数。 这被称为回调函数，它是作为参数传递给另一个函数的函数。 在上面的例子中，回调函数是 (number) => number * 2，它在 numbers 数组中的每个元素上运行。 然后，map() 方法返回一个包含结果的新数组。

将回调函数传递给 map() 方法。 回调函数应该以 song 作为参数，使用箭头函数语法，并且具有空函数体。
  const songsHTML = array.map((song) => {});

  骤 20
在 map() 中，添加一个带有反引号的 return 语句，你将在其中插入负责显示歌曲详细信息的所有元素。

在反引号内，创建一个 li 元素，其 id 属性为 song-${song.id}，class 属性为 playlist-song。

return `<li id = "song-${song.id}" class = "playlist-song"></li>`;

步骤21
创建一个带有类 playlist-song-info 的 button 元素。 在 button 内部，添加一个带有 playlist-song-title 类的 span 元素，然后插入 song.title 作为文本。
 <button class="playlist-song-info"><span class="playlist-song-title">${song.title}</span></button>
步骤-23
创建另一个 button 元素，其类名为 playlist-song-delete，并将 aria-label 属性设置为 Delete，并用 song.title 进行插值。 对于删除图标的内容，粘贴以下 SVG：
 <button class = "playlist-song-delete" aria-label="Delete ${song.title}"><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg></button>


 步骤 24
现在 songsHTML 是一个数组。 如果你尝试按原样显示，你将看到用逗号分隔的歌曲。 这不是期望的结果，因为你想以列表形式显示歌曲。 要解决这个问题，你需要使用 join() 方法将数组连接成一个字符串。

join() 方法用于将数组的所有元素连接成一个字符串。 它采用一个可选参数 separator，用于分隔数组的每个元素。 例如：

示例代码
const exampleArr = ["This", "is", "a", "sentence"];
const sentence = exampleArr.join(" "); // Separator takes a space character
console.log(sentence); // Output: "This is a sentence"
将 join() 方法链接到 map() 方法，并传入一个空字符串作为分隔符。

要将多个方法链接在一起，你可以在 map() 方法的结果上调用 join() 方法。 例如：</button>
      </li>
      `;
    }).join("")

Step 26
Now you need to call the renderSongs function and pass in userData?.songs in order to finally display the songs in the UI.

Optional chaining (?.) helps prevent errors when accessing nested properties that might be null or undefined. For example:

Example Code
const user = {
  name: "Quincy",
  address: {
    city: "San Francisco",
    state: "CA",
    country: "USA",
  },
};

// Accessing nested properties without optional chaining
const state = user.address.state; // CA

// Accessing a non-existent nested property with optional chaining
const zipCode = user.address?.zipCode; // Returns undefined instead of throwing an error
Call the renderSongs function with the songs property of userData. This will render the songs in the playlist.

renderSongs(userData?.songs);

Step 34
Right now the song order has not changed. That is because the updates you made using the sort method will not happen until the sortSongs function is called.

Change your renderSongs function to call the sortSongs function.

Now you should see the songs in alphabetical order.

const sortSongs = () => {
  userData?.songs.sort((a,b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return userData?.songs;
};
renderSongs(sortSongs());

Step 35
It's time to begin implementing the functionality for playing the displayed songs.

Define a playSong function using const. The function should take an id parameter which will represent the unique identifier of the song you want to play.
const playSong = (id) =>{} const来定义函数 就是用箭头函数；
Step 36
The find() method retrieves the first element within an array that fulfills the conditions specified in the provided callback function. If no element satisfies the condition, the method returns undefined.

In the example below, the find() method is used to find the first number greater than 25:
const numbers = [10, 20, 30, 40, 50];

// Find the first number greater than 25
const foundNumber = numbers.find((number) => number > 25);
console.log(foundNumber); // Output: 30
Use const to create a variable named song and assign it result of the find() method call on the userData?.songs array. Use song as the parameter of the find() callback and check if song.id is strictly equal to id.

This will iterate through the userData?.songs array, searching for a song that corresponds to the id passed into the playSong function

const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
};

Step 37
Inside the playSong function, set the audio.src property equal to song.src. This tells the audio element where to find the audio data for the selected song.

Also, set the audio.title property equal to song.title. This tells the audio element what to display as the title of the song.
const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
   audio.src = song.src ;
  audio.title = song.title;
};

步骤 38
在播放歌曲之前，你需要确保它从头开始播放。 这可以通过使用 audio 对象上的 currentTime 属性来实现。

添加 if 语句来检查 userData?.currentSong 是否为假 或者 userData?.currentSong.id 严格不等于 song.id。 此条件将检查当前是否没有播放歌曲或当前歌曲是否与即将播放的歌曲不同。

在 if 块内，将 audio 对象的 currentTime 属性设置为 0。
你应该创建一个带有条件 userData?.currentSong === null || userData?.currentSong.id !== song.id 的 if 语句。 不要忘记包含可选链接。
 if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
      audio.currentTime = 0;
    }

    步骤 39
添加 else 块来处理歌曲的当前播放时间。 这使你可以从暂停点继续播放当前歌曲。

在 else 块内，将 audio 对象的 currentTime 属性设置为存储在 userData?.songCurrentTime 中的值。
 if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0; 
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }

  步骤 40
你需要更新当前正在播放的歌曲以及 playButton 元素的外观。

将 song 分配给 userData 对象上的 currentSong 属性。

注意：在此步骤中，你不应使用可选链接运算符 ?.，因为此时 userData.currentSong 将不会是 null 或 undefined。
    userData.currentSong = song;

步骤 41
接下来，使用 classList 属性和 add() 方法将 "playing" 类添加到 playButton 元素。 这将在 CSS 文件中查找类 "playing" 并将其添加到 playButton 元素。

要最终播放歌曲，请对 audio 变量使用 play() 方法。 play() 是来自网络音频 API 的用于播放 mp3 文件的方法。
playButton.classList.add("playing");
audio.play();
步骤 42
在前面的步骤中，你构建了播放歌曲的功能。 现在你需要为播放按钮添加功能，以便单击该按钮时播放当前歌曲。

使用 addEventListener() 方法并传入 "click" 事件作为第一个参数，并传入一个带有箭头语法的空回调函数作为第二个参数，例如 () => {}。
playButton.addEventListener("click", () => {});

第 43 步
在事件监听器的箭头函数中，添加 if 来检查 userData?.currentSong 是否是 null。

在 if 块内，使用 userData?.songs 数组中第一首歌曲的 id 调用 playSong() 函数。 这将确保播放列表中的第一首歌曲首先播放。
你应该在 if 块内使用 userData?.songs[0].id 调用 playSong 函数。
 if (userData?.currentSong === null) {
      playSong(userData?.songs[0].id);
    }

步骤 44
添加 else 块。 在 else 块内，使用当前播放歌曲的 id 作为参数调用 playSong 函数。

这确保了当点击播放按钮时当前播放的歌曲将继续播放。
 if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }

  步骤 45
为了让用户点击时播放歌曲，请向第一个按钮元素添加 onclick 属性。 在 onclick 内部，使用 song.id 调用 playSong 函数。

不要忘记这里需要用美元符号进行插值。你应该向 button 元素添加一个值为 playSong(${song.id}) 的 onclick 属性。
<button class="playlist-song-info" onclick="playSong(${song.id})">

步骤 48
使用 classList 和 remove() 方法从 playButton 中删除 .playing 类，因为歌曲将在此时暂停。

要最终暂停歌曲，请对 audio 变量使用 pause() 方法。 pause() 是 Web Audio API 用于暂停音乐文件的方法。

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();
};

步骤 49
现在是时候测试暂停按钮了。

向 pauseButton 元素添加 "click" 事件监听器，然后传入 pauseSong 作为事件监听器的第二个参数。 这是事件监听器将运行的函数。
pauseButton.addEventListener("click", pauseSong);

步骤 51
要获取当前歌曲的索引，可以使用 indexOf() 方法。 indexOf() 数组方法返回在数组中找到给定元素的第一个索引，如果元素不存在，则返回 -1。

示例代码
const animals = ["dog", "cat", "horse"];
animals.indexOf("cat") // 1
在你的 getCurrentSongIndex 函数中，返回 userData?.songs.indexOf()。 对于 indexOf() 参数，将其设置为 userData?.currentSong。
const getCurrentSongIndex = () => {
  return userData?.songs.indexOf(userData?.currentSong);
}
步骤 53
在 playNextSong 函数内部，创建一个 if 语句来检查 userData 的 currentSong 是否严格等于 null。 这将检查 userData 对象中是否没有正在播放的歌曲。

如果条件为真，则使用 userData?.songs 数组中第一首歌曲的 id 作为参数调用 playSong 函数。

const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  }
}

Step 54
Add an else block to the if statement. Inside the else block, call the getCurrentSongIndex() function and assign it to a constant named currentSongIndex.
 if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
  }

  Step 55
Next, you will need to retrieve the next song in the playlist. For that, you will need to get the index of the current song and then add 1 to it.

Create a constant called nextSong and assign userData?.songs[currentSongIndex + 1] to it.

Lastly, call the playSong function and pass in nextSong.id as the argument.

if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];
    playSong(nextSong.id);
  }
  Step 56
Now it is time to test out the playNextSong function.

Add a "click" event listener to the nextButton element, then pass in playNextSong as the second argument of your event listener. This is the function the event listener will run.

Test out your app by first clicking on the play button followed by the next button. You should see that everything is working as expected.
nextButton.addEventListener("click", playNextSong);

Step 58
Within the playPreviousSong function, add an if statement with a condition of userData?.currentSong === null. This will check if there is currently no song playing. If there isn't any, exit the function using a return.

Inside the else block, create a constant named currentSongIndex and assign it getCurrentSongIndex()
const playPreviousSong = () => {
  if (userData?.currentSong === null){
    return;
  } else {
    const currentSongIndex = getCurrentSongIndex();
  }
};

Step 59
To get the previous song, subtract 1 from the currentSongIndex of userData?.songs and assign it to the constant previousSong. After that, call the playSong function and pass previousSong.id as an argument.
if (userData?.currentSong === null) return;
  else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
  }

  Step 61
If you check closely, you'd see the currently playing song is not highlighted in the playlist, so you don't really know which song is playing. You can fix this by creating a function to highlight any song that is being played.

Using an arrow syntax, create a highlightCurrentSong function. Inside the function, use querySelectorAll to get the .playlist-song element and assign to a playlistSongElements constant.

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
}

Step 62
You need to get the id of the currently playing song. For this, you can use userData?.currentSong?.id.

Use getElementById() to get the id of the currently playing song, then use template literals to prefix it with song-. Assign it to the constant songToHighlight.

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  
  const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`);
};

Step 63
Loop through the playlistSongElements with a forEach method.

The forEach method is used to loop through an array and perform a function on each element of the array. For example, suppose you have an array of numbers and you want to log each number to the console.

Example Code
const numbers = [1, 2, 3, 4, 5];

// Using forEach to iterate through the array
numbers.forEach((number) => {
  console.log(number); // 1, 2, 3, 4, 5
});
Use the forEach method on playlistSongElements. Pass in songEl as the parameter and use arrow syntax to add in an empty callback.
playlistSongElements.forEach((songEl) => {});
Step 64
Within the callback function, use the removeAttribute() method to remove the "aria-current" attribute. This will remove the attribute for each of the songs.
 playlistSongElements.forEach((songEl) => {
      songEl.removeAttribute("aria-current");
  });
  Step 65
Now you need to add the attribute back to the currently playing song.

Create an if statement with the condition songToHighlight. For the statement, use setAttribute on songToHighlight to pass in "aria-current" and "true" as the first and second arguments.
if (songToHighlight) {
  songToHighlight.setAttribute("aria-current", "true");
}
Step 66
Inside the playSong function, call the highlightCurrentSong function.

After that, play around with the control buttons to see how the highlightCurrentSong function works.
 highlightCurrentSong();
 Step 68
Inside the function, obtain references to the HTML elements responsible for displaying the song title and artist.

Access the #player-song-title and #player-song-artist elements with the getElementById() method. Assign them to variables playingSong and songArtist respectively.

const setPlayerDisplay = () => {
    const playingSong = document.getElementById("player-song-title");
    const songArtist = document.getElementById("player-song-artist");

};

Step 69
Access the userData?.currentSong?.title and userData?.currentSong?.artist properties and assign them to a currentTitle and currentArtist variables respectively.
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  const currentTitle = () => {
    if (currentTitle){
      currentTitle = playingSong.textContent;
    } else {
      currentTitle = {};
    }
  };

    const currentArtist = () => {
    if (currentArtist){
      currentArtist = songArtist.textContent;
    } else {
      currentArtist = {};
    }
  };


const playingSong.textContent = true ? currentTitle : "";
const songArtist.textContent = true ? currentArtist : "";

Step 70
textContent sets the text of a node and allows you to set or retrieve the text content of an HTML element.

Example Code
<div id="example">This is some text content</div>
Example Code
const element = document.getElementById('example');
console.log(element.textContent); // Output: This is some text content
You can use a ternary operator to conditionally set the text content value. Here is an example of assigning the result of a ternary operator to a variable:

Example Code
const example = condition ? "I'm true" : "I'm false";
Use a ternary operator to check if currentTitle evaluates to a truthy value. If it does, set playingSong.textContent to currentTitle. Otherwise, set it to an empty string.

Then below that, use a ternary operator to check if currentArtist is truthy. If so, set songArtist.textContent to currentArtist. Otherwise, set it to empty string.

playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";

Step 73
You need to get the currently playing song or the first song in the playlist. To do that, create a song constant and use the OR operator (||) to set it to the current song of userData, or the first song in the userData?.songs array.
const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];
};

Step 74
The setPlayButtonAccessibleText function will set the aria-label attribute to the current song, or to the first song in the playlist. And if the playlist is empty, it sets the aria-label to "Play".

Use the setAttribute method on the playButton element to set an attribute named "aria-label". Using a ternary, set the attribute value to Play ${song.title} or "Play" if song?.title is not available.

Don't forget you need string interpolation here, so you need to use backticks.

const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];
  playButton.setAttribute("aria-label", song?.title ? `Play ${song.title}` : "Play");
  
};

步骤 77
在前面的步骤中，你学习了如何使用 sort() 方法按字母顺序对歌曲进行排序。 回调函数的另一个用例是随机化数组。

随机化项目数组的一种方法是从 Math.random() 中减去 0.5，这会产生正数或负数的随机值。 这使得比较结果成为正值和负值的混合，从而导致元素的随机排序。

示例代码
const names = ["Tom", "Jessica", "Quincy", "Naomi"];
names.sort(() => Math.random() - 0.5);
在 userData?.songs 数组上使用 sort() 方法。 将回调传递给方法，并返回 Math.random() - 0.5 的结果。

const shuffle = () => {
    userData?.songs.sort(() => Math.random() - 0.5);
};

步骤 79
你还应该重新渲染歌曲，暂停当前播放的歌曲，设置播放器显示，并再次设置播放按钮可访问文本。

调用 renderSongs 函数并传入 userData?.songs 作为参数。 另外，调用 pauseSong、setPlayerDisplay 和 setPlayButtonAccessibleText 函数。
const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;
  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();

};

步骤 80
向 shuffleButton 元素添加 "click" 事件监听器。 要运行该函数，请传入 shuffle 函数。

注意：你不需要在此特定事件监听器内进行回调。 你也不需要调用 shuffle 函数，只需传入其标识符。
shuffleButton.addEventListener("click", shuffle);

步骤 82
使用 filter() 方法从 userData?.songs 数组中删除与 id 参数匹配的歌曲对象。

filter 方法仅保留满足传递给它的回调函数的数组元素：

示例代码
const numArr = [1, 10, 8, 3, 4, 5]
const numsGreaterThanThree = numArr.filter((num) => num > 3);

console.log(numsGreaterThanThree) // Output: [10, 8, 4, 5]
对 userData?.songs 使用 filter() 方法。 传入 song 作为箭头函数回调的参数，并使用隐式返回来检查 song.id 是否严格不等于 id。 将所有这些分配给 userData.songs。

注意：将 userData?.songs.filter 的结果分配给 userData.songs 时，不应使用可选链接，因为此时 allSongs 数组将不再是 undefined 或 null。

const deleteSong = (id) => {
  userData.songs = userData?.songs.filter((song) => song.id !== id);
};

步骤 83
你需要重新渲染歌曲，突出显示它并设置播放按钮的可访问文本，因为歌曲列表将会改变。

调用 renderSongs 函数并传入 userData?.songs 数组作为参数，这将显示修改后的播放列表。

之后，调用 highlightCurrentSong 函数突出显示当前歌曲（如果有），并调用 setPlayButtonAccessibleText 函数更新播放按钮的可访问文本。
const deleteSong = (id) => {
  userData.songs = userData?.songs.filter((song) => song.id !== id);
  renderSongs(userData?.songs);
  highlightCurrentSong();
  setPlayButtonAccessibleText();
};

步骤 84
在删除歌曲之前，你需要检查该歌曲是否正在播放。 如果是，你需要暂停该歌曲并播放播放列表中的下一首歌曲。

使用 if 语句检查 userData?.currentSong?.id 是否等于要删除的歌曲的 id。
if (userData?.currentSong?.id === id){};

步骤 86
在 renderSongs 函数中的按钮元素内，添加 onclick 属性。 对于该值，调用 deleteSong 函数并插入 song.id。
<button class="playlist-song-delete" aria-label="Delete ${song.title}" onclick = "deleteSong(${song.id})">

步骤 87
接下来，你需要检查播放列表是否为空。 如果是，你应该将 userData 对象重置为其原始状态。

使用 if 语句检查 userData?.songs 的长度是否为 0。
if (userData?.songs.length === 0){};

Step 88
If the playlist is empty, you need to create a resetButton element and a text for it. This button will only show up if the playlist is empty.

createElement() is a DOM method you can use to dynamically create an element using JavaScript. To use createElement(), you call it, then pass in the tag name as a string:

Example Code
// syntax
document.createElement(tagName)

// example
document.createElement('div')
You can also assign it to a variable:

Example Code
const divElement = document.createElement('div')
Inside your if statement, declare a resetButton constant, then use createElement() to create a "button".
if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
  };

  Step 90
Now that you've created the resetButton, you need to assign it an id and aria-label attributes. JavaScript provides the id and ariaLabel properties you need to use for this.

For example, element.id would set an id attribute, and element.ariaLabel would set an aria-label attribute. Both of them accept their values as a string.

Set the id attribute of the resetButton element to "reset" and its aria-label attribute to "Reset playlist".
if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");
    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";

  }
  Step 91
You need to add the resetText to the resetButton element as a child, and also the resetButton to the playlistSongs element as a child. For this, there is an appendChild() method to use.

appendChild() lets you add a node or an element as the child of another element. In the example below, the text "Click me" would be attached to the button:

Example Code
const parentElement = document.createElement("button")
const parentElementText = document.createTextNode("Click me")

// attach the text "Click me" to the button
parentElement.appendChild(parentElementText)
Use appendChild() to attach resetText to resetButton element, and resetButton to the playlistSongs element.

 resetButton.appendChild(resetText);
  playlistSongs.appendChild(resetButton);
  Step 93
To reset the playlist to its original state, spread allSongs into an array and assign it to userData.songs.

Note: You should not use optional chaining for the userData.songs because the song will not be null or undefined at this point.
resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];
    });

    Step 94
Finally, you should render the songs again, update the play button's accessible text, and remove the reset button from the playlist. You also need to remove the resetButton from the DOM.

Call the renderSongs() function with sortSongs() as an argument to render the songs again in alphabetical order.

Call the setPlayButtonAccessibleText() function to update the play button's accessible text.

Remove the reset button from the playlist by calling the remove() method on the resetButton variable.

Note: Now you can try removing all the songs to see what happens.
 resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];
      renderSongs(sortSongs());
      setPlayButtonAccessibleText();
      resetButton.remove();
    });

    Step 95
All the core functionalities are now in place. The only issue now is that the next song does not automatically play when the currently playing song ends.

To fix that, you can set up an event listener which will detect when the currently playing song ends. The "ended" event listener is appropriate for this. It is fired when the playback of a media reaches the end.

Add an event listener to the audio element which listens for the "ended" event. Pass in a callback using arrow syntax with empty curly braces.
audio.addEventListener("ended", () => {});

Step 96
Notice that the album art in the HTML and songs in the userData.songs array have changed. We've swapped out the original songs for shorter ones that you can use to test your app in the upcoming steps.

Next, you need to check if there is a next song to play. Retrieve the current song index by calling the getCurrentSongIndex() function, and save it in a currentSongIndex constant.

After that, create a nextSongExists constant that contains the boolean value true or false depending on if the next song exists.

audio.addEventListener("ended", () => {
    const currentSongIndex = getCurrentSongIndex();
    const nextSongExists = currentSongIndex < userData.songs.length - 1? true : false;
});

Step 98
If there is no next song in the playlist, use the else block to reset the currentSong key of userData to null, and its songCurrentTime property to 0.
if (nextSongExists) {
    playNextSong();
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
  }