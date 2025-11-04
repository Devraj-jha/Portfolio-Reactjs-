// src/components/ProgressTree/ProgressTree.jsx
import './ProgressTree.css'

const ProgressTree = ({ challenge }) => {
  return (
    <div className="progress-tree">
      <div className="tree-header">
        <h2>{challenge.name} - Progress Tree</h2>
        <div className="overall-progress">
          <span>Overall: {challenge.progress}%</span>
        </div>
      </div>
      
      <div className="milestones-container">
        {challenge.milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`milestone ${milestone.completed ? 'completed' : 'pending'}`}
          >
            <div className="milestone-icon">
              {milestone.completed ? '✅' : '⏳'}
            </div>
            <div className="milestone-content">
              <h3>{milestone.name}</h3>
              <span className="milestone-status">
                {milestone.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
            {index < challenge.milestones.length - 1 && (
              <div className="connection-line"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressTree