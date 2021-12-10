import * as React from 'react';
import {useState, useEffect, useMemo, useCallback} from 'react';
import {render} from 'react-dom';
import MapGL, {Source, Layer, FlyToInterpolator} from 'react-map-gl';
import TimeSlider from './time-slider';
import DayChooser from './day-chooser';

import {dataLayer} from './map-style.js';
import {updatePercentiles} from './utils';
import Button from 'react-bootstrap/Button';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicGV0ZXJqYW5rIiwiYSI6ImNrdjl5Zmlzb2E3c2gyd256ZXVicmZ6YWoifQ.uQ0pujB7vKdTIntjIx7q9g'; // Set your mapbox token here

export default function App() {
  const [viewport, setViewport] = useState({
    latitude: 42.3767,
    longitude: -71.1150,
    zoom: 15.5,
    bearing: 0,
    pitch: 0
  });
  const [time, setTime] = useState(900);
  const [day, setDay] = useState("monday");
  const [allData, setAllData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    /* global fetch */
    fetch(
      'https://raw.githubusercontent.com/peter-jankowski/datavisdemo1/master/harvardbuildings.geojson'
    )
      .then(resp => resp.json())
      .then(json => setAllData(json));
  }, []);

  const onHover = useCallback(event => {
    const {
      features,
      srcEvent: {offsetX, offsetY}
    } = event;
    const hoveredFeature = features && features[0];
    const day = day;
    const time = time;

    setHoverInfo(
      hoveredFeature
        ? {
            feature: hoveredFeature,
            x: offsetX,
            y: offsetY
          }
        : null
    );
  }, []);

  function rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    map.rotateTo((timestamp / 100) % 360, { duration: 0 });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
  }

  const goToSouthCampus = () => {
    setViewport({
      ...viewport,
      latitude: 42.3630,
      longitude: -71.1252,
      zoom: 16.22,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const goToNorthCampus = () => {
    setViewport({
      ...viewport,
      latitude: 42.3767,
      longitude: -71.1150,
      zoom: 15.5,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const goToFullView = () => {
    setViewport({
      ...viewport,
      latitude: 42.3713,
      longitude: -71.1200,
      zoom: 14.2,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const onSelectCity = useCallback(({longitude, latitude}) => {
    setViewport({
      longitude,
      latitude,
      zoom: 11,
      transitionInterpolator: new FlyToInterpolator({speed: 1.2}),
      transitionDuration: 'auto'
    });
  }, []);

  const data = useMemo(() => {
    return allData && updatePercentiles(allData, f => f.properties[day][time]);
  }, [allData, time, day]);

  const buttonStyle = {
    margin: "4px",
    width: "75px",
    height: "30px",
    fontSize: "8px",
    padding: "0px"
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        // mapStyle="mapbox://styles/peterjank/ckvb1vk1u3gap14pcti77y0oo"
        mapStyle= "mapbox://styles/peterjank/ckx0v9hvc2lua14mu3zl1uwau"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['data']}
        onHover={onHover}
      >
        <Source type="geojson" data={data}>
          <Layer {...dataLayer} />
        </Source>
        {hoverInfo && (
          <div className="hover" style={{left: hoverInfo.x, top: hoverInfo.y}}>
            <div>Building: {hoverInfo.feature.properties.name}</div>
            <div># of Students: {hoverInfo.feature.properties.value}</div>
            <div>Day: {capitalizeFirstLetter(day)}</div>
            <div>Time: {(((time / 100) % 13) + (time / 100 % 13 < 9 ? 1 : 0) * 1)}:00 {((time / 100) % 12) < 9 ? "pm" : "am"}</div>
          </div>
        )}
      </MapGL>
      <div className = "control-panel">
        <div >
          <TimeSlider time={time} onChange={value => setTime(value)} />
        </div>
        <div >
          <DayChooser day={day} onChange={value => setDay(value)} />
        </div>
        <div className = "navigationbuttons">
          <div style = {{width: "30px"}}>Go to: </div> {' '}
          <Button
            id = "South Campus"
            style = {buttonStyle} 
            variant={"outline-info"}
            onClick={goToSouthCampus}
          > South Campus </Button>{' '}
          <Button
            id = "North Campus"
            style = {buttonStyle} 
            variant={"outline-info"}
            onClick={goToNorthCampus}
          > North Campus </Button>{' '}
          <Button
            id = "Full View"
            style = {buttonStyle} 
            variant={"outline-info"}
            onClick={goToFullView}
          > Full View </Button>{' '}
        </div>
      </div>
    </>
  );
}

export function renderToDom(container) {
  render(<App />, container);
}
