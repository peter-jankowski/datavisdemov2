import * as React from 'react';
import Button from 'react-bootstrap/Button';

function DayChooser(props) {
  const {day} = props;
  // const [selectday, setDay] = useState(day);

  const buttonStyle = {
    width: "50px",
    fontSize: "10px"
  }

  return (
    <div>
      <Button
        id = "monday"
        style = {buttonStyle} 
        variant={day === "monday" ? "primary" : "outline-primary"}
        onClick={(e) => props.onChange(e.target.id)}
      > Mon </Button>{' '}
      <Button 
        id = "tuesday"
        style = {buttonStyle} 
        variant={day === "tuesday" ? "primary" : "outline-primary"}
        onClick={(e) => props.onChange(e.target.id)}
      > Tues </Button>{' '}
      <Button 
        id = "wednesday"
        style = {buttonStyle} 
        variant={day === "wednesday" ? "primary" : "outline-primary"}
        onClick={(e) => props.onChange(e.target.id)}
      > Wed </Button>{' '}
      <Button 
        id = "thursday"
        style = {buttonStyle} 
        variant={day === "thursday" ? "primary" : "outline-primary"}
        onClick={(e) => props.onChange(e.target.id)}
      > Thurs </Button>{' '}
      <Button 
        id = "friday"
        style = {buttonStyle} 
        variant={day === "friday" ? "primary" : "outline-primary"}
        onClick={(e) => props.onChange(e.target.id)}
      > Fri </Button>{' '}
    </div>
  );
}

export default React.memo(DayChooser);