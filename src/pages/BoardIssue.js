import React from 'react';
import Board from './Board';

const BoardIssue = (props) => {
    return (
        <div>
            <Board projectId={props.projectId}/>
        </div>
    );
};

export default BoardIssue;