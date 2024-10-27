import React from 'react';

const Transcription = ({ text }) => {

    return ( <
        div className = "mt-4 bg-gray-700 p-4 rounded-lg" >
        <
        h3 className = "text-lg font-semibold mb-2" > Transcription: < /h3> <
        p className = "bg-gray-800 p-4 rounded-lg" > { text || 'No transcription yet.' } < /p> < /
        div >
    );
};

export default Transcription;