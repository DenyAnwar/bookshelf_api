const { nanoid } = require('nanoid');
const books = require('./books');

/* handler function to add book */
const addBookHandler = (request, h) => {
  // get data from user
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // get data but auto input, not from user
  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // all data save in one variable
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // validation, if name book is not input by user error will be appear
  const isNoBookName = name === undefined;

  if (isNoBookName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // validation, if readPage is more than pageCount error will be appear
  const isNoValidReadPage = readPage > pageCount;

  if (isNoValidReadPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // if validation is success, all data will be put in into array
  books.push(newBook);

  // confirmation if data is successful saved
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // confirmation, if there is generic error
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// /* handler function to get all of book data, without optional task */
// const getAllBooksHandler = () => ({
//   status: 'success',
//   data: {
//     // using reusable function (map) to get certain data
//     books: books.map((book) => ({
//       id: book.id,
//       name: book.name,
//       publisher: book.publisher,
//     })),
//   },
// });

/* handler function to get all of book data, with optional task */
const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;

  // check of reading variable is not undefinded.
  // if yes check again, if reading variable is 1 (true)
  // it will show data with reading status is true (book is being read).
  if (reading !== undefined) {
    if (reading === 1) {
      return {
        status: 'success',
        data: {
          books: books.filter((bookFilter) => bookFilter.reading === true)
            .map((bookMap) => ({
              id: bookMap.id,
              name: bookMap.name,
              publisher: bookMap.publisher,
            })),
        },
      };
    }

    // if reading variable is 0 (false)
    // it will show data with reading status is false (book is not being read)
    if (reading === 0) {
      return {
        status: 'success',
        data: {
          books: books.filter((bookFilter) => bookFilter.reading === false)
            .map((bookMap) => ({
              id: bookMap.id,
              name: bookMap.name,
              publisher: bookMap.publisher,
            })),
        },
      };
    }
  }

  // check of finished variable is not undefinded.
  // if yes check again, if finished variable is 1 (true)
  // it will show data with finsihed status is true (book is not finished read).
  if (finished !== undefined) {
    if (finished === 1) {
      return {
        status: 'success',
        data: {
          books: books.filter((bookFilter) => bookFilter.finished === true)
            .map((bookMap) => ({
              id: bookMap.id,
              name: bookMap.name,
              publisher: bookMap.publisher,
            })),
        },
      };
    }

    // if finished variable is 0 (false)
    // it will show data with finished status is false (book is finished read)
    if (finished === 0) {
      return {
        status: 'success',
        data: {
          books: books.filter((bookFilter) => bookFilter.finished === false)
            .map((bookMap) => ({
              id: bookMap.id,
              name: bookMap.name,
              publisher: bookMap.publisher,
            })),
        },
      };
    }
  }

  // check of name variable is not undefinded.
  // if yes, it will be filter name of book refer value get from query (name query).
  if (name !== undefined) {
    return {
      status: 'success',
      data: {
        // toLowerCase is returns the value of the string converted to lower case
        books: books.filter((bookF) => bookF.name.toLowerCase().includes(name.toLowerCase()))
          .map((bookMap) => ({
            id: bookMap.id,
            name: bookMap.name,
            publisher: bookMap.publisher,
          })),
      },
    };
  }

  // show all of book data
  const response = h.response({
    status: 'success',
    data: {
      // using reusable function (map) to get certain data
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

/* handler function to get book data based on bookId */
const getBookByCorrectIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

/* handler function to edit book data based on bookId */
const editBookByCorrectIdHandler = (request, h) => {
  const { id } = request.params;

  // get data from user
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // get data but auto input, not from user
  const updateAt = new Date().toDateString();

  // check if book id from database is same as book id from input by user
  const index = books.findIndex((book) => book.id === id);

  // validation if book id is valid
  if (index !== -1) {
    // validation, if name book is not input by user error will be appear
    const isNoBookName = name === undefined;

    if (isNoBookName) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    // validation, if readPage is more than pageCount error will be appear
    const isNoValidReadPage = readPage > pageCount;

    if (isNoValidReadPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    // update data
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updateAt,
    };

    // confirmation if data is successful saved
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // confirmation, if cannot find bookId error will be appear
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

/* handler function to delete book data based on bookId */
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    // delete array start from index and delet just 1 data
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // confirmation, if cannot find bookId error will be appear
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByCorrectIdHandler,
  editBookByCorrectIdHandler,
  deleteBookByIdHandler,
};
