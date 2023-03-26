const selectBox = document.getElementById("librarySelect");
const graphqlFetchQuery = function (query) {
  return fetch("http://localhost:5000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query
    })
  }).then((res) => res.json());
};
const getAllAuthors = function () {
  graphqlFetchQuery(`query{
    authors {
     id 
     name
    }
  }`).then((res) => {
    res.data.authors.forEach((author) => {
      const option = document.createElement("option");
      option.value = author.id;
      option.label = author.name;
      selectBox.append(option);
    });
  });
};
const getBooksByAuthor = function (id) {
  graphqlFetchQuery(`query{
    author(id:${id}){
      name
      books{
        name
      }
    }
  }`).then((res) => {
    document.getElementById("books-container").innerHTML = ``;
    res.data.author.books.forEach((book) => {
      document.getElementById("books-container").innerHTML += ` <div class="bg-white rounded-lg shadow-lg">
      <img
        class="w-full h-48 object-cover rounded-t-lg"
        src="https://img.freepik.com/free-photo/book-composition-with-open-book_23-2147690555.jpg"
        alt="Image 1"
      />
      <div class="p-4">
        <h3 class="text-lg font-medium mb-2">${book.name}</h3>
        <p class="text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus urna eu lorem tincidunt, id malesuada
          lacus commodo. Nunc bibendum sapien eu tortor posuere, ac tincidunt ipsum consectetur.
        </p>
      </div>
    </div>`;
    });
  });
};

getAllAuthors();
getBooksByAuthor(1);
selectBox.onchange = function (event) {
  getBooksByAuthor(event.target.value);
};
