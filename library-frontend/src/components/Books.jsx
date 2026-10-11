import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    fetchPolicy: "cache-and-network",
  });

  const allBooksResult = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }
  if (result.loading || allBooksResult.loading) {
    return <div>loading...</div>;
  }

  const books = result.data ? result.data.allBooks : [];
  const allBooks = allBooksResult.data ? allBooksResult.data.allBooks : [];

  const genres = [...new Set(allBooks.flatMap((book) => book.genres))];

  return (
    <div>
      <h2>books</h2>

      {selectedGenre ? (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      ) : (
        <p>all genres</p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
