import React from 'react'
import { v4 as uuidV4 } from 'uuid'

export default function Leaderboard ({ topPlayers }) {
  topPlayers.sort((a, b) => b.score - a.score);
  if (!topPlayers.length) return
  return (
    <div className='leaderboard-area'>
      <h3 style={{ margin: '0' }}>Leaderboard</h3>
      <table>
        <th>Rank</th>
        <th>Nickname</th>
        <th>Score</th>
        {topPlayers
          .slice(0, 10)
          .filter(player => player.score != 0)
          .map((player, i) => {
            return (
              <tr key={uuidV4()}>
                <td>{i + 1}</td>
                <td>{player.name}</td>
                <td>
                  <div>{player.score}</div>
                </td>
              </tr>
            )
          })}
      </table>
    </div>
  )
}
