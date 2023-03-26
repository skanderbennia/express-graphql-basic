const express = require("express");
const ExpressGraphql = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require("graphql");
const cors = require("cors");
const app = express();
const { authors, books } = require("./data");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(cors());
app.use("/views", express.static(__dirname + "/views"));

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "this represents a author of a book",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: { type: new GraphQLList(BookType), resolve: (author) => books.filter((book) => book.authorId === author.id) }
  })
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author: { type: AuthorType, resolve: (book) => authors.find((author) => book.authorId === author.id) }
  })
});
const rootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "Get a single book",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (_, args) => books.find((book) => book.id === args.id)
    },
    books: {
      type: GraphQLList(BookType),
      description: "list of books",
      resolve: () => books
    },
    authors: {
      type: GraphQLList(AuthorType),
      description: "list of authors",
      resolve: () => authors
    },
    author: {
      type: AuthorType,
      description: "A single Author",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (_, args) => authors.find((author) => author.id === args.id)
    }
  })
});
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = { id: books.length + 1, name: args.name, authorId: args.authorId };
        books.push(book);
        return book;
      }
    },
    addAuthor: {
      type: AuthorType,
      description: "Add a author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name };
        authors.push(author);
        return author;
      }
    }
  })
});
const schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: RootMutationType
});
app.use("/graphql", ExpressGraphql.graphqlHTTP({ graphiql: true, schema: schema }));
app.get("/html", (req, res) => {
  res.render("index");
});
app.listen(5000, () => {
  console.log("server is running on port " + 5000);
});
