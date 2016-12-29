import React, { PropTypes } from 'react';

import './Board.scss';

const Board = ({userLoc, compLoc, cardNo}) => {
  return(
    <div className="positions">
      {userLoc===cardNo ? <div className="user_position"><i className="fa fa-user" aria-hidden="true"></i></div> : null }
      {compLoc===cardNo ? <div className="comp_position"><i className="fa fa-laptop" aria-hidden="true"></i></div> : null }
    </div>
  )
}

Board.propTypes = {
  userLoc: PropTypes.number.isRequired,
  compLoc: PropTypes.number.isRequired,
  cardNo: PropTypes.number.isRequired
};

export default Board;
