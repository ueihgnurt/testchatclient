import React from 'react';
import Cable from 'actioncable'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentChatMessage: '',
      chatLogs: [],
      
    };
  }
  
  componentWillMount() {
    this.createSocket();
  }

  handleChatInputKeyPress(event) {
    if(event.key === 'Enter') {
      this.handleSendEvent(event);
    }//end if
  }

  createSocket() {
    let cable = Cable.createConsumer('ws://localhost:3001/cable');
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => {},
      received: (data) => {
        let chatLogs = this.state.chatLogs;
        chatLogs.push(data);
        this.setState({ chatLogs: chatLogs });
      },
      create: function(chatContent) {
        this.perform('create', {
          content: chatContent
        });
      }
    });
  }

  renderChatLog() {
    return this.state.chatLogs.map((el) => {
      return (
        <li key={`chat_${el.id}`}>
          <span className='chat-message'>{ el.content }</span>
          <span className='chat-created-at'>{ el.created_at }</span>
        </li>
      );
    });
  }

  handleSendEvent(event) {
    event.preventDefault();
    this.chats.create(this.state.currentChatMessage);
    this.setState({
      currentChatMessage: ''
    });
  }

  updateCurrentChatMessage(event) {
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  render() {
    return (
      <div className='App'>
        <div className='stage'>
          <h1>Chat</h1>
          <ul className='chat-logs'>
            { this.renderChatLog() }
          </ul>
          </div>
                    <input
                    onKeyPress={ (e) => this.handleChatInputKeyPress(e) }
                    value={ this.state.currentChatMessage }
                    onChange={ (e) => this.updateCurrentChatMessage(e) }
                    type='text'
                    placeholder='Enter your message...'
                    className='chat-input' 
                    />

                    <button
                    onClick={ (e) => this.handleSendEvent(e) }
                    className='send'>
                    Send
                    </button>
        </div>
    );
  }
}

export default App;
