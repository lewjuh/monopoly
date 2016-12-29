# Quick Monopoly Example in react

Created with Create React App for speed

## Decision Making

- First off, I chose react for its virtual dom and reactiveness. It allowed me to quickly prototype the games simple functions without much setup.
- I chose to use create-react-app over using a custom boilerplate due to its speed and pre made build scripts.
- I added Sass to the app to allow for easier styling with variables and such.
- I kept the app structure fairly simple, ideally with more time, I would have moved a few more things into stateless components, but due to time constraints most of the state and dom is create in the main app container.
- I went with a game log to show what was happening
- I skipped certain features, such as houses/hotels, due to time constraints.
- General functionality is as follows:
  - User can roll on their turn, randoms 2 numbers up to 6 and moves the user
  - If user lands on a property, the user can buy it if its not owned by anyone. If its owned by them, the turn ends, if its owned by the computer, the player is taxed and the computer is paid.
  - When the user/comp passes go they are paid 200
  - When the user/comp lands on a tax, they are taxed the value of the card
  - When the users go is ended, the computers turn is automatically started
  - The computer will always buy the property if they can afford it
  - Everything that works on the user works on the computer
  - Chance and community chest do not currently work, that would be very easy to add through
  - All cards are stored in json files, based on the side they are on
- **Currently there is no way for the game to end, once the user has run out of money and cannot afford a property, the game will just freeze**

## Things to improve

- Ideally the state management would be handed off to something like mobx or redux as the game got more complex
- The structure of the json files is fairly simple, but could be improved upon
- Currently there are no tax increases based on the amount of properties you own, this could be fairly simply added by creating a scaled tax object in the json and parsing that to the taxing
- Showing the die rolls would also be helpful.
- Responsive (?)
- Add ability to place hotels and such
- Add an ability to end the game
- Animation
