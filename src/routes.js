const {
  addBookHandler,
  getAllBooksHandler,
  getBookByCorrectIdHandler,
  editBookByCorrectIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByCorrectIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByCorrectIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
