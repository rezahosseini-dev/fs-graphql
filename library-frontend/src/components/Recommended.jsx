import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries";

const Recommended = ({ show }) => {
  const userResult = useQuery(ME);
  const booksResult = useQuery(ALL_BOOKS);

  if (!show) {
    return null;
  }

  if (userResult.loading || booksResult.loading) {
    return <div>loading...</div>;
  }

  const user = userResult.data?.me;
  const books = booksResult.data?.allBooks || [];
  const favoriteGenre =
    user && user.favoriteGenre
      ? user.favoriteGenre.toLowerCase()
      : "refactoring";

  const filteredBooks = favoriteGenre
    ? books.filter((book) =>
        book.genres.some((g) => g.toLowerCase() === favoriteGenre),
      )
    : books;

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
