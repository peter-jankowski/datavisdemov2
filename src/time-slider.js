import React, { useState } from 'react';
// import "./Control-Panel.css";

function TimeSlider(props) {
  const {time} = props;

  return (
    <div>
      <h6>Harvard College - Building Capacity</h6>

      <div>
        <div>Time: {(((time / 100) % 13) + (time / 100 % 13 < 9 ? 1 : 0) * 1)}:00 {((time / 100) % 12) < 9 ? "pm" : "am"}
        </div>
        <div key={'time'} className="input">
          <input
            type="range"
            value={time}
            min={900}
            max={1800}
            step={100}
            onChange={e => props.onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(TimeSlider);
