let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting, monsterHealth;
let inventory = ["stick"];



const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

goldText.innerText = gold;
healthText.innerText = health;
xpText.innerText = xp;

const weapons = [
    {
        name: "stick",
        power: 5

    },

    {
        name: "dagger",
        power: 15

    },
    
    {
        name: "sword",
        power: 30

    },

    {
        name: "legendary sword",
        power: 50

    }
];

const locations = [
  {
    name: "Town Square",
    buttonText: ["Go to Store", "Go to Cave", "Fight Dragon"],
    buttonFunctions: [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "store"'
  },

  {
    name: "Store",
    buttonText: ["Buy 10 health(10 gold)", "Buy Weapon (30 gold)", "Go to Town Square"],
    buttonFunctions: [buyHealth, buyWeapon, goTown],
    text: 'You entered a store named "Town Square store"'
  },

  {
    name: "Cave",
    buttonText: ["Fight Slime", "Fight Beast", "Go to Town Square"],
    buttonFunctions: [fightSlime, fightBeast, goTown],
    text: 'You entered the cave and you see two monsters, one is visibly stronger than the other. You also have to option to leave the cave to avoid danger'
  },

  {
    name: "Fight",
    buttonText: ["Attack", "Dodge", "Run"],
    buttonFunctions: [attack, dodge, goTown],
    text: 'You are Fighting a monster.'
  },

  {
    name: "Kill monster",
    buttonText: ["Go to town square", "Go to town square", "Go to town square"],
    buttonFunctions: [goTown, goTown, goTown],
    text: 'The monster screams "argh"! \n As it dies, you gain experience nad find gold'
  },
  {
    name: "lose",
    buttonText: ["Restart??", "Restart??", "Restart??"],
    buttonFunctions: [restart, restart, restart],
    text: 'You died. ya suck'
    
  },

  {
    name: "win",
    buttonText: ["Restart?", "Restart?", "Restart??"],
    buttonFunctions: [restart, restart, restart],
    text: 'The dragon was vanquished, and the town is saved\nYou have finished the game, would you like to restart ?'
  }


];

const monsters = [
  {
    name: "Slime",
    level: 2,
    health: 15
  },

  {
    name: "Fanged beast",
    level: 8,
    health: 60
  },

  {
    name: "Dragon",
    level: 20,
    health: 300
  }

]

// initializing buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location.buttonText[0];
  button2.innerText = location.buttonText[1];
  button3.innerText = location.buttonText[2];
  button1.onclick = location.buttonFunctions[0];
  button2.onclick = location.buttonFunctions[1];
  button3.onclick = location.buttonFunctions[2];
  text.innerText = location.text;

}
// START OF TOWN FUNCTION
function goTown() {
  update(locations[0]);
}
// END OF TOWN FUNCTION

// STORE FUNCTION
function goStore() {
  update(locations[1])
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You have insufficient gold";
    }

}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
        
            gold -= 30;
            goldText.innerText = gold;
            currentWeapon++;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = newWeapon + " is now in your invertory.";
            inventory.push(newWeapon);
            text.innerText += "\nYou have : " + inventory;
        } else {
            text.innerText = "You have insufficient gold";
    
        }
    }
    else { 
        text.innerText = "You already have the most powerful weapon";
        button2.innerText = "Sell weapon (15 gold)";
        button2.onclick = sellWeapon;
    }
    
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon;
        text.innerText += "\nIn your inventory, you have: " + inventory;
      } else {
          text.innerText = "Don't sell your only weapon!";
      }
}
// END OF STORE FUNCTION 


// START OF CAVE FUNCTION

function goCave() {
  update(locations[2]);
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}
// END OF CAVE FUNCTION


// START OF FIGHTING SECTION ------------------------------------------------------------

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsters[fighting].health;
  
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += "\n You attack it with your " + weapons[currentWeapon].name + ".";
  if (isMonsterHit()) {
    health -= getMonsterAttackValue(monsters[fighting].level);
  } else {
    text.innerText += " You Miss";
  }
  monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0){
    lose();
  } else if (monsterHealth <= 0) { 
    fighting === 2 ? winGame() : defeatMonster()
  }
  if (Math.random() <= .1 && inventory.length !== 1) { // Miss Function
    text.innerText +=` Your ${inventory.pop()} Broke`; // testing out template literals
  currentWeapon--;
  }
}
function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the " + monsters[fighting].name + " attacks.";
}


function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function getMonsterAttackValue(level) {
  let hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit;
}



// END OF FIGHTING SECTION ------------------------------------------------------------



function lose() {
  update(locations[5]);
}
function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goTown();
}

// TESTING CODES ------------------------------------------------------------


// NEED TO PLACE THIS IF STATEMENT SOMEWHERE SUTIABLE
if (parseInt(healthText.innerText) <= '10') {
  healthText.style.color = "red"
  console.log("Hellos")
} else if (parseInt(healthText.innerText) <= '30') {
  healthText.style.color = 'orange'
} else if (parseInt(healthText.innerText) < '50') {
  healthText.style.color = 'yellow'
}

function yad(){
  console.log(parseInt(healthText.innerText))
}
 setInterval(yad, 1000);

