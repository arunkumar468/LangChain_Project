import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          story: query,
          vectorWeight: 0.7,
          bm25Weight: 0.3
        })
      })
      
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Analysis failed')
      }
      
      const data = await response.json()
      setResults(data.relatedStories || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Healthcare User Story Retrieval</h1>
        <p>Hybrid search powered by LangChain and MongoDB</p>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter your search query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="results">
        {results.length > 0 ? (
          <div className="results-list">
            <h2>Results ({results.length})</h2>
            {results.map((result, idx) => (
              <div key={idx} className="result-card">
                <h3>{result.title || result.storyId}</h3>
                {result.hybridScore && (
                  <p className="score">Match Score: {(result.hybridScore * 100).toFixed(1)}%</p>
                )}
                {result.role && <p><strong>Role:</strong> {result.role}</p>}
                {result.goal && <p><strong>Goal:</strong> {result.goal}</p>}
                <p className="story">{result.normalizedStory}</p>
                {result.rationale && (
                  <p className="rationale"><strong>Relevance:</strong> {result.rationale}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && query && <p className="no-results">No results found</p>
        )}
      </div>
    </div>
  )
}

export default App
