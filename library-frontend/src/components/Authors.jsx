import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from "../queries";
import { useState } from "react";
const Authors = ({ show, setError, token }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const result = useQuery(ALL_AUTHORS);

  const [changeBirthYear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.message);
    },
  });

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading...</div>;
  }
  const authors = result.data ? result.data.allAuthors : [];

  const selectedName = name || (authors.length > 0 ? authors[0].name : "");

  const submit = async (event) => {
    event.preventDefault();

    if (born.trim() === "") {
      if (setError) setError("Please enter a birth year");
      return;
    }

    await changeBirthYear({
      variables: {
        name: selectedName,
        setBornTo: Number(born),
      },
    });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
            <div>
              name
              <select
                name="name"
                value={selectedName}
                onChange={({ target }) => setName(target.value)}
              >
                {authors.map((a) => (
                  <option key={a.id || a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>
                born
                <input
                  type="number"
                  value={born}
                  onChange={({ target }) => setBorn(target.value)}
                />
              </label>
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Authors;
