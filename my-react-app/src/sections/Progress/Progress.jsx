// src/sections/Progress/Progress.jsx
import { useState } from 'react'
import ProgressTree from '../../components/ProgressTree/ProgressTree'
import './Progress.css'

const Progress = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null)

  const challenges = [
    {
      id: 'winter-arc',
      name: 'Winter Arch',
      description: 'Cold weather development challenges',
      progress: 10,
      milestones: [
        { id: 1, name: 'Setup Development Environment', completed: true },
        { id: 2, name: 'Learn Advanced React', completed: true },
        { id: 3, name: 'Build Portfolio Website', completed: true },
        { id: 4, name: 'Master Node.js', completed: false },
        { id: 5, name: 'Deploy Major Project', completed: false }
      ]
    },
    {
      id: 'spring-quest',
      name: 'Spring Quest',
      description: 'New beginnings and growth',
      progress: 40,
      milestones: [
        { id: 1, name: 'Learn TypeScript', completed: true },
        { id: 2, name: 'Build API Project', completed: true },
        { id: 3, name: 'Open Source Contribution', completed: false },
        { id: 4, name: 'Learn DevOps Basics', completed: false }
      ]
    },
    {
      id: 'summer-saga',
      name: 'Summer Saga',
      description: 'Hot coding sessions',
      progress: 20,
      milestones: [
        { id: 1, name: 'Advanced CSS Mastery', completed: false },
        { id: 2, name: 'Build E-commerce Site', completed: false },
        { id: 3, name: 'Learn Web Security', completed: false }
      ]
    }
  ]

  return (
    <section className="progress-section">
      <h1 className="section-title">Progress Tree</h1>
      <p className="section-subtitle">My development journey and achievements</p>
      
      <div className="progress-container">
        <div className="challenges-list">
          <h2>Challenges</h2>
          {challenges.map(challenge => (
            <div
              key={challenge.id}
              className={`challenge-card ${selectedChallenge?.id === challenge.id ? 'active' : ''}`}
              onClick={() => setSelectedChallenge(challenge)}
            >
              <h3>{challenge.name}</h3>
              <p>{challenge.description}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${challenge.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{challenge.progress}% Complete</span>
            </div>
          ))}
        </div>
        
        <div className="tree-view">
          {selectedChallenge ? (
            <ProgressTree challenge={selectedChallenge} />
          ) : (
            <div className="no-selection">
              <p>Select a challenge to view its progress tree</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Progress