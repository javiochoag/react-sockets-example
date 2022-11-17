import { Button, InputBase, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { socket } from "../socket";


const useStyles = makeStyles((theme) => ({
  chat: {
    minHeight: '100%',
  },
  button: {
    padding: 10,
  },
  inputName: {
    flex: 1,
    width: '25%',
    margin: '1px',
  },
  inputMessage: {
    flex: 1,
    width: '72%',
    margin: '1px'
  },
  messageBox: {
    overflowY: "scroll",
    maxHeight: "75vh",
    minHeight: "75vh",
    padding: '3vh',
  },

  message: {
    backgroundColor: '#b2ebf2',
    margin: '5px',
    padding: '6px',
    maxWidth: '70%',
    fontSize: '2vh',
    textAlign: 'left',
  }
}));

export default function Chat() {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [nickName, setNickName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    let response = {
      'message': newMessage,
      'name': nickName 
    }
    socket.emit('CHAT', response)
    setNewMessage('');
  }

  useEffect(()=> {
    const addMessage = (newMessage) => {
      setMessages(messages.concat([newMessage]))
    }
    const getMessage = (message) => {
      addMessage(message);
    };
    socket.on("CHAT", getMessage);
    return () => {
      socket.off('CHAT', getMessage);
    };
  }, [messages]);

  return (
  <Paper className={classes.chat}>
    <Box className={classes.messageBox}>
      {messages.map((message) => {
        return(
          <Box className={classes.message} id={message.date + message.name}>
            <b>{message.name} </b>
              {message.message}
          </Box>
        )
      })}
    </Box>
    <Paper component="form">
      <InputBase
        value={nickName}
        onChange={(event) => setNickName(event.target.value)}
        placeholder = 'nickname'
        className={classes.inputName}
      />
      <InputBase
        value={newMessage}
        onChange={(event) => setNewMessage(event.target.value)}
        placeholder = 'message'
        className={classes.inputMessage}
      />
      <Button className={classes.button} onClick={handleSubmit}>
        Enviar
      </Button>
    </Paper>
  </Paper>
  )
}