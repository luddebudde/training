import { bankAccount, modifiers } from "./bank";
import { selectEvent } from "./events";

let dayCounter = 0;
let monthCounter = 0;
let yearCounter = 0;

const dayCounterElement = document.createElement("dayCounter");
const monthCounterElement = document.createElement("monthCounter");
const yearCounterElement = document.createElement("yearCounter");

document.body.appendChild(dayCounterElement);
document.body.appendChild(monthCounterElement);
document.body.appendChild(yearCounterElement);

const landLordResponsesWin = [
  "Well, you've paid... for now. Let's hope you don't fall behind next time.",
  "$$$$",
  "Until next time",
];
const landLordResponsesLose = [
  "No payment... and no second chances. This is where it ends.",
  "You couldn’t pay, and now you’ll pay the ultimate price.",
  "No money, no future. You’re done.",
  "That was your last mistake. It’s over.",
  "You failed to pay. Now there’s nothing left for you.",
  "Empty pockets, empty promises. Game over.",
  "You didn’t pay, and now it’s all gone. You’re finished.",
  "No rent, no hope. This is the end of your road.",
  "You’ve fallen too far behind. There’s no coming back from this.",
  "It’s over. No payment, no escape.",
];
const landLordResponsesIncrease = [
  "The rent’s gone up—blame the new ‘luxury’ tax. Not that you’ll notice the luxury.",
  "Due to rising demand in the area, your rent is now 5(00)% higher. Lucky you, living in such a popular spot.",
  "The landlord union just voted for a rate hike. Nothing personal, just business.",
  "Repairs to the building cost money, and guess who’s footing the bill? That’s right—you.",
  "New government regulations require higher rents to ‘maintain standards.’ Standards for what, I’ll never say.",
  "I’ve added a ‘late payment buffer’ to your rent. Consider it motivation to pay on time.",
  "The neighborhood’s improving, and so is your rent. Progress isn’t free.",
  "You see that new paint in the hallway? Yeah, that wasn’t cheap. Your share is included in the new rent.",
  "Inflation is hitting everyone hard, especially me. So your rent just went up.",
  "I heard you got a raise. Congratulations! Your rent has been adjusted accordingly.",
  "You see, I got money, and so do you...",
];

export function updateDayCounter() {
  dayCounter += 0.25;
  // dayCounter += 3;
  // dayCounter += 30;
  if (dayCounter - Math.floor(dayCounter) === 0) {
    dayCounterElement.textContent = `D: ${dayCounter % 30} M:${
      monthCounter % 12
    } Y: ${yearCounter}`;
  }
  if (dayCounter !== 0 && dayCounter % 30 === 0) {
    monthCounter++;

    console.log("Rent is due. Pay up!");
    bankAccount.value -= modifiers.rent;
    if (bankAccount.value > 0) {
      console.log(
        landLordResponsesWin[
          Math.floor(Math.random() * landLordResponsesWin.length)
        ]
      );

      selectEvent();
    } else {
      console.log(
        landLordResponsesLose[
          Math.floor(Math.random() * landLordResponsesWin.length)
        ]
      );
    }
  }
  if (monthCounter !== 0 && monthCounter % 12 === 0) {
    yearCounter++;
  }

  if (monthCounter !== 0 && monthCounter % 3 === 0 && dayCounter % 30 === 0) {
    modifiers.rent *= 5;
    console.log(
      landLordResponsesIncrease[
        Math.floor(Math.random() * landLordResponsesIncrease.length)
      ]
    );
  }
  console.log("");
}
