import React, { Component } from 'react';
import _ from 'underscore';

import './App.scss';
import Board from './../components/Board';

import bottom_cards from './../data/bottom_cards.json';
import left_cards from './../data/left_cards.json';
import top_cards from './../data/top_cards.json';
import right_cards from './../data/right_cards.json';

class App extends Component {
  constructor(){
    super();

    this.state = {
      userLoc: 0,
      compLoc: 0,
      userGo: true,
      rolled: false,
      action: "default",
      currentCard: {},
      userStats: {
        money: 1500
      },
      compStats: {
        money: 1500
      },
      userCards: [],
      compCards: [],
      cardList: _.indexBy(bottom_cards.concat(left_cards, top_cards, right_cards), 'cardNo'),
      gameLog: ['Game Started', 'Users Turn']
    };

    this.payMoney = this.payMoney.bind(this);
    this.addLog = this.addLog.bind(this);
    this.roll = this.roll.bind(this);
    this.compsTurn = this.compsTurn.bind(this);
    this.buyProp = this.buyProp.bind(this);
    this.endGo = this.endGo.bind(this);
  }

  roll(player){
    // roll two six sided dice
    let dice1 = Math.floor(Math.random() * 6) + 1;
    let dice2 = Math.floor(Math.random() * 6) + 1;
    // if user is rolling
    if(player==='user'){
      // gets the new position based on the current location plus the die
      let newPos = this.state.userLoc+dice1+dice2;
      // if user passes go, pay the user 200
      if(newPos > 39){
        newPos -= 39;
        this.payMoney('user', 200);
        this.addLog('User passed go, User collected £200');
      }
      // set new user position
      this.setState({userLoc: newPos});
      // set rolled state to true
      this.setState({rolled: true});
      // if card is property or rail, let the user have the option to purchase
      if(this.state.cardList[newPos].cat==='property' || this.state.cardList[newPos].cat==='rail'){
        // if card is already owned by user, end go
        if(_.contains(this.state.userCards, newPos)){
          this.addLog('User Landed on '+this.state.cardList[newPos].text);
          this.addLog('User Owns '+this.state.cardList[newPos].text);
          this.endGo('user');
        } else if(_.contains(this.state.compCards, newPos)){
          // if card is owned by comp, tax user and pay comp
          this.addLog('User Landed on '+this.state.cardList[newPos].text);
          this.addLog('Comp Owns '+this.state.cardList[newPos].text+', User has paid £'+this.state.cardList[newPos].tax+' to Comp');
          this.payMoney('user', -this.state.cardList[newPos].tax);
          this.payMoney('comp', this.state.cardList[newPos].tax);
          this.endGo('user');
        } else {
          // if the user can afford property, allow them to buy it
          if(this.state.cardList[newPos].value < this.state.userStats.money){
            this.setState({action: "buy"});
            this.addLog('User Landed on '+this.state.cardList[newPos].text);
          }
          this.setState({currentCard: this.state.cardList[newPos]});
        }
      } else if(this.state.cardList[newPos].cat==='tax'){
        // automatically tax the player for the cards value
        this.payMoney('user', -this.state.cardList[newPos].value);
        this.addLog('User has been taxed £'+this.state.cardList[newPos].value);
        this.endGo('user');
      } else if(this.state.cardList[newPos].cat==='chest'){
        // Add random community chest draw here
        this.addLog('User has landed on Community Chest');
        this.endGo('user');
      } else if(this.state.cardList[newPos].cat==='chance'){
        // Add random chance draw here
        this.addLog('User has landed on Chance');
        this.endGo('user');
      } else if(this.state.cardList[newPos].cat==='go' || this.state.cardList[newPos].cat==='prison' || this.state.cardList[newPos].cat==='parking' || this.state.cardList[newPos].cat==='gotojail'){
        // This just covers the not yet coded outcomes for landing on go/prison/parkin/goto jail
        // The process of paying when go is passed is already coded above
        this.addLog('User has landed on Go/prison/parkin/gotojail');
        this.endGo('user');
      } else {
        // This just covers the not yet coded outcomes for landing on go/prison/parkin/goto jail
        // The process of paying when go is passed is already coded above
        this.addLog('User has landed unknown');
        this.endGo('user');
      }
    } else if(player === 'comp'){
      // new comp position
      let newPos = this.state.compLoc+dice1+dice2;
      // if pass go, pay 200
      if(newPos>39){
        newPos -= 39;
        this.payMoney('comp', 200);
        this.addLog('Comp passed go, Comp collected £200');
      }
      this.setState({compLoc: newPos});
      if(this.state.cardList[newPos].cat==='property' || this.state.cardList[newPos].cat==='rail'){

        if(_.contains(this.state.compCards, newPos)){
          this.addLog('Comp Landed on '+this.state.cardList[newPos].text);
          this.addLog('Comp Owns '+this.state.cardList[newPos].text);
          this.endGo('comp');
        } else if(_.contains(this.state.userCards, newPos)){
          this.addLog('Comp Landed on '+this.state.cardList[newPos].text);
          this.addLog('User Owns '+this.state.cardList[newPos].text+', Comp has paid £'+this.state.cardList[newPos].tax+' to User');
          this.payMoney('comp', -this.state.cardList[newPos].tax);
          this.payMoney('user', this.state.cardList[newPos].tax);
          this.endGo('comp');
        } else {
          if(this.state.cardList[newPos].value < this.state.compStats.money){
            this.addLog('Comp Landed on '+this.state.cardList[newPos].text);
            this.setState({currentCard: this.state.cardList[newPos]}, function(){
              this.buyProp('comp', newPos);
            });
          }
        }

      } else if(this.state.cardList[newPos].cat==='tax'){
        // if comp lands on tax, tax comp based on card value
        this.payMoney('comp', -this.state.cardList[newPos].value);
        this.addLog('Comp has been taxed £'+this.state.cardList[newPos].value);
        this.endGo('comp');
      } else if(this.state.cardList[newPos].cat==='chest'){
        // Add random community chest draw here
        this.addLog('Comp has landed on Community Chest');
        this.endGo('comp');
      } else if(this.state.cardList[newPos].cat==='chance'){
        // Add random chance draw here
        this.addLog('Comp has landed on Chance');
        this.endGo('comp');
      } else if(this.state.cardList[newPos].cat==='go' || this.state.cardList[newPos].cat==='prison' || this.state.cardList[newPos].cat==='parking' || this.state.cardList[newPos].cat==='gotojail'){
        // This just covers the not yet coded outcomes for landing on go/prison/parkin/goto jail
        // The process of paying when go is passed is already coded above
        this.addLog('Comp has landed on Go/prison/parkin/gotojail');
        this.endGo('comp');
      } else {
        // This just covers the not yet coded outcomes for landing on go/prison/parkin/goto jail
        // The process of paying when go is passed is already coded above
        this.addLog('Comp has landed unknown');
        this.endGo('comp');
      }
    }
  }

  compsTurn(){
    // simple function to call the roll,  function can be used for more complex functions later on
    this.roll('comp');
  }

  addLog(log){
    // function to set game logs
    let currentLog = this.state.gameLog;
    currentLog.push(log);
    this.setState({gameLog: currentLog});
  }

  payMoney(player, amount){
    // get type of player and amount and pay/tax player accordingly
    if(player==='user'){
      if(Math.sign(amount)===-1){
        // if is a negative number, remove the negative and subtract the clean value from the money
        this.setState({userStats: {money: this.state.userStats.money-Math.abs(amount)}});
      } else {
        // if is a positive number just add to value
        this.setState({userStats: {money: this.state.userStats.money+amount}});
      }
    } else if(player==='comp'){
      if(Math.sign(amount)===-1){
        // if is a negative number, remove the negative and subtract the clean value from the money
        this.setState({compStats: {money: this.state.compStats.money-Math.abs(amount)}});
      } else {
        // if is a positive number just add to value
        this.setState({compStats: {money: this.state.compStats.money+amount}});
      }
    }
  }

  endGo(player){
    // end go based on player, resets states and runs the computers go
    if(player==='user'){
      this.setState({action: "default", currentCard: {}});
      this.setState({userGo: false});
      this.addLog('Users go Ended');
      this.addLog('Its Comps Turn');
      this.compsTurn();
    } else if(player==='comp'){
      this.setState({action: "default", currentCard: {}});
      this.setState({rolled: false});
      this.setState({userGo: true});
      this.addLog('Comps go Ended');
      this.addLog('Its Users Turn');
    }
  }

  buyProp(player, cardNo){
    // allows players to buy based on the cardnumber and player type
    if(player==='user'){
      this.setState({userCards: this.state.userCards.concat([cardNo])}, function(){
        this.payMoney('user', -this.state.currentCard.value);
        this.addLog('User bought '+this.state.currentCard.text);
        this.endGo('user');
      });
    } else if(player==='comp'){
      this.setState({compCards: this.state.compCards.concat([cardNo])}, function(){
        this.payMoney('comp', -this.state.currentCard.value);
        this.addLog('Comp bought '+this.state.currentCard.text);
        this.endGo('comp');
      });
    }
  }

  render() {
    const {userLoc, compLoc, userStats, compStats, userGo, rolled} = this.state;
    const userCards = this.state.userCards;
    const compCards = this.state.compCards;
    const cardList = this.state.cardList;
    const gameLog = this.state.gameLog;

    return (
      <div className="App">
        <Board userLoc={userLoc} compLoc={compLoc} gameLog={gameLog} />
        <div className="game_panel">
          <div className="actions">
            {userGo && !rolled ?
              <button onClick={this.roll.bind(this, 'user')} className="action">Roll Dice</button>
              :
              null
            }
            {this.state.action==="buy" ?
              <button onClick={this.buyProp.bind(this, 'user', this.state.currentCard.cardNo)} className="action">Buy Property for £{this.state.currentCard.value}</button>
            : null
            }
          </div>
          <div className="user_info">
            <h2>User {userGo ? "(Your Go)" : null}</h2>
            <table>
              <tbody>
                <tr>
                  <td>Money:</td><td>£{userStats.money}</td>
                </tr>
                {userCards.length>0 ?
                  <tr>
                    <td colSpan="2"><h4>Property:</h4></td>
                  </tr>
                : null}
                {userCards.map((card)=>{
                  return(
                    <tr key={card}>
                      <td>{cardList[card].text}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="comp_info">
            <h2>Comp {!userGo ? "(Comps Go)" : null}</h2>
              <table>
                <tbody>
                  <tr>
                    <td>Money:</td><td>£{compStats.money}</td>
                  </tr>
                  {compCards.length>0 ?
                    <tr>
                      <td colSpan="2"><h4>Property:</h4></td>
                    </tr>
                  : null}
                  {compCards.map((card)=>{
                    return(
                      <tr key={card}>
                        <td>{cardList[card].text}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
