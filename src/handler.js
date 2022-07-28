const { nanoid } = require('nanoid');
const books = require('./books');

//handler simpan buku
const saveBook = (request, h) => {
 const {
 	name, year, author, summary, publisher, pageCount, readPage, reading,
 } = request.payload;

 const id = nanoid(16);
 const finished = pageCount === readPage;
 const insertedAt = new Date().toISOString();
 const updatedAt = insertedAt;

 const newBook = {
   id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
 };

  if(name === undefined){
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if(readPage > pageCount){
  	const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if(isSuccess){
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

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

//handler mengambil buku
const getAllBooks = (request, h) => {
  const { name, finished, reading } = request.query;

  if(name) {
    const filter = books.filter(( book,) => book.name.toUpperCase().includes(name.toUpperCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: filter.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  //getBooks optional

  //jika ada buku kondisi finished
  if(finished === '0'){
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.finished === false).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else if (finished === '1'){
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.finished === true).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  //jika ada buku kondisi reading
  if(reading) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.reading === true).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
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
 
//handler mengambil buku dari id
const getBookbyId = (request, h) => {
  const { bookId } = request.params;
 
  const book = books.filter((n) => n.id === bookId)[0];
 
  if (book !== undefined) {
 	const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
 	response.code(200);
	return response;
  }
 
  const response = h.response({
	status: 'fail',
	message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

//handler edit buku
const UpdateBook = (request, h) => {
  const { bookId } = request.params;

  const {
 	name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
 
  const index = books.findIndex((book) => book.id === bookId);
 
  if (index !== -1) {
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
      updatedAt,
    };
    if(!name){
     const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
     });
    response.code(400);
    return response;
    } else if (readPage > pageCount){
    	const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
      response.code(400);
      return response;
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

//handler delete buku
const DeleteBook = (request, h) => {
  const { bookId } = request.params;
 
  const index = books.findIndex((book) => book.id === bookId);
 
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
 
 const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
}

module.exports = { saveBook, getAllBooks, getBookbyId, UpdateBook, DeleteBook };