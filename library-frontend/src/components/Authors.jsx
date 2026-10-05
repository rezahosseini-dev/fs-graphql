import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from "../queries";
import { useState } from "react";
const Authors = ({ show, setError }) => {
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
      <form onSubmit={submit}>
        <div>
          name
          <select
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
          born
          <input
            type="number"
            value={born}
            placeholder="enter birth year as number"
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
