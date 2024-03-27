import axios from 'axios';
import { useEffect, useState } from 'react';

const useBookSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
    if (query === '') setLoading(false);
  }, [query]);

  useEffect(() => {
    let cancel = () => {};

    if (query) {
      setLoading(true);
      setError('');

      axios({
        method: 'GET',
        url: 'https://openlibrary.org/search.json', // https://openlibrary.org/dev/docs/api/search
        params: { title: query, page: pageNumber },
        cancelToken: new axios.CancelToken((c) => (cancel = c)), // optional property to use the debounce pattern when calling the search query
      })
        .then((res) => {
          setBooks((prevBooks) => [
            ...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)]),
          ]); // keeps the book titles from previous pages when loading new books, and filters the repeated titles
          setHasMore(res.data.docs.length > 0);
          setLoading(false);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
          setError('An error occured');
          setLoading(false);
        });
    }

    return () => cancel();
  }, [query, pageNumber]);

  return { books, hasMore, loading, error };
};

export default useBookSearch;
