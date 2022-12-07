import { useEffect, useState } from 'react';

const mapToDivs = (articles) => articles.map(a => <div key={a.id}>{a.body}</div>);

function App() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    async function getArticles() {
      return await (await fetch('http://localhost:8080/api/articles', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })).json()
    }
    getArticles().then(data => { if (data?.articles) setArticles(data.articles) })
  }, [articles]);

  return (
    <div> {mapToDivs(articles)} </div>
  );
}

export default App;
