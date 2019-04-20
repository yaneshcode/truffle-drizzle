import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReadString from './ReadString';
import SetString from './SetString';

class App extends Component {
  state = { loading: true,
    response: '',
    post: '',
    responseToPost: '',
    drizzleState: null };

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };

  componentDidMount() {
    const { drizzle } = this.props;

    // Server call
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) return "Loading Drizzle...";
    return <div className="App">Drizzle is ready

    <ReadString
    drizzle={this.props.drizzle}
    drizzleState={this.state.drizzleState}
    />
    <SetString
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />

        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
</div>;
  }
}

export default App;
