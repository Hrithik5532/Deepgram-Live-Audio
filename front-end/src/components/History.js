import React from 'react';

const History = ({ history }) => {
    return ( <
        div className = "mt-4 bg-gray-700 p-4 rounded-lg max-h-48 overflow-y-scroll no-scrollbar" >
        <
        h3 className = "text-lg font-semibold mb-2" > Transcription History: < /h3> <
        ul className = "list-disc list-inside pr-2" > {
            history.map((item, index) => ( <
                li key = { index }
                className = "bg-gray-800 p-2 rounded-lg my-2" >
                <
                span > { item.text } < /span> <
                span className = "text-sm text-gray-400 block mt-1" > Time: { item.time } < /span> <
                /li>
            ))
        } <
        /ul> <
        /div>
    );
};

export default History;