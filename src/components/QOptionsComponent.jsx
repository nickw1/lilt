import { useState } from 'react';

export default function QOptionsComponent({options, onOptionsChanged}) {
    return <div>
        List the options. Begin each option with a star.<br />
        <textarea value={options} style={{width: "40%", height: "100px"}}
        onChange={e => {
            onOptionsChanged(e.target.value)
        }}></textarea>
        </div>;
}
