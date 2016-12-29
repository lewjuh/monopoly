import React, { PropTypes } from 'react';
import _ from 'underscore';

import './Board.scss';
import Positions from './Positions';

import bottom_cards from './../data/bottom_cards.json';
import left_cards from './../data/left_cards.json';
import top_cards from './../data/top_cards.json';
import right_cards from './../data/right_cards.json';

const Board = ({userLoc, compLoc, gameLog}) => {

  // makes sure latest logs are at top of scroll
  gameLog.reverse();

  return(
    <div className="board_wrap">
      <div className="board">
        <div className="board_bottom">
          {_.map(bottom_cards, function(card, i) {
            return (
              <div key={i} className={card.type==='corner' ? "corner_card "+card.style+" "+card.group : "card "+card.style+" "+card.group}>
                {card.text}
                <Positions cardNo={card.cardNo} userLoc={userLoc} compLoc={compLoc} />
              </div>
            );
          })}
        </div>

        <div className="board_left">
          {_.map(left_cards, function(card, i) {
            return (
              <div key={i} className={card.type==='corner' ? "corner_card "+card.style+" "+card.group : "card "+card.style+" "+card.group}>
                <span>{card.text}</span>
                <Positions cardNo={card.cardNo} userLoc={userLoc} compLoc={compLoc} />
              </div>
            );
          })}
        </div>

        <div className="board_top">
          {_.map(top_cards, function(card, i) {
            return (
              <div key={i} className={card.type==='corner' ? "corner_card "+card.style+" "+card.group : "card "+card.style+" "+card.group}>
                {card.text}
                <Positions cardNo={card.cardNo} userLoc={userLoc} compLoc={compLoc} />
              </div>
            );
          })}
        </div>

        <div className="board_right">
          <div className="corner_card small">
          </div>
          {_.map(right_cards, function(card, i) {
            return (
              <div key={i} className={card.type==='corner' ? "corner_card "+card.style+" "+card.group : "card "+card.style+" "+card.group}>
                {card.text}
                <Positions cardNo={card.cardNo} userLoc={userLoc} compLoc={compLoc} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="game_log">
        {gameLog.map((log, i)=>{
          return(
            <span key={"log_"+i}>{log}</span>
          )
        })}
      </div>
    </div>
  )
}

// make sure all props are required before rendering
Board.propTypes = {
  userLoc: PropTypes.number.isRequired,
  compLoc: PropTypes.number.isRequired,
  gameLog: PropTypes.array.isRequired
};

export default Board;
