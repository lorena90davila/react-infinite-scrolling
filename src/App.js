import { useRef, useState, useCallback } from 'react';
import './App.css';
import useBookSearch from './useBookSearch';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        // IntersectionObserver allows to determine whether some elements are currently on the viewport
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <label for={'title'}>Search for a book title </label>
      < br/>
      <input
        id={'title'}
        type={'text'}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPageNumber(1);
        }}
      />
      {books.map((book, index) => {
        return books.length === index + 1 ? (
          <div ref={lastBookElementRef} key={book}>
            {book}
          </div>
        ) : (
          <div key={book}>{book}</div>
        );
      })}
      {loading && <div>{'Loading...'}</div>}
      {error && <div>{error}</div>}
    </div>
  );
}

export default App;
