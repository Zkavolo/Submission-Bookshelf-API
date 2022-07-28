const { saveBook, getAllBooks, getBookbyId, UpdateBook, DeleteBook } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: saveBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookbyId,
  },  
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: UpdateBook,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: DeleteBook,
  },
];
 
module.exports = routes;