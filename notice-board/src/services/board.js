import BoardModel from '../models/Board.js';

export const createBoard = (board) => {
  const boardModel = new BoardModel(board);
  return boardModel.save();
};

/**
 * POST /board/post
 * 글쓰기 등록
 */
export const postRegist = async (req, res) => {
  console.log('postRegist req >> ',  req);
  
};
