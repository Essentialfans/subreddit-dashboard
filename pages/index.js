import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [data, setData] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [search, setSearch] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetch("https://subreddit-backend.onrender.com/api/subreddits")
        .then(res => res.json())
        .then(setData);

      fetch("https://subreddit-backend.onrender.com/api/subreddit-growth")
        .then(res => res.json())
        .then(setGrowth);
    }
  }, [authenticated]);

  const filtered = data.filter(item => item.Subreddit?.toLowerCase().includes(search.toLowerCase()));

  if (!authenticated) {
    return (
      <main style={{ padding: 40, textAlign: 'center' }}>
        <h2>Enter Password</h2>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
        <br /><br />
        <button onClick={() => setAuthenticated(password === "Bomboclat1")}>Submit</button>
      </main>
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>📊 Subreddit Dashboard</h1>
      <input
        style={{ padding: 8, marginBottom: 16, width: '100%' }}
        placeholder="Search subreddits..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table border="1" cellPadding="6" cellSpacing="0" style={{ width: '100%', marginBottom: 40 }}>
        <thead>
          <tr>
            {Object.keys(filtered[0] || {}).map((key, i) => <th key={i}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((val, i) => <td key={i}>{val}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Top Subreddits by Posts/Day</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filtered.slice(0, 10).map(d => ({ name: d.Subreddit, posts: parseFloat(d["Posts/Day"]) || 0 }))}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="posts" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h3 style={{ marginTop: 50 }}>Subscriber Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={growth}>
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Subscribers" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <h3 style={{ marginTop: 50 }}>Posts/Day Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={growth}>
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Posts/Day" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </main>
  );
}
