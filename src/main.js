var React = require('react');
var ReactDOM = require('react-dom');


function Greetings(props){
  return(
      <h1> Hello {props.Name}, This is react app component !</h1>
    );
}

ReactDOM.render(
  <Greetings Name="Viewer" />,
  document.getElementById('app')
  );