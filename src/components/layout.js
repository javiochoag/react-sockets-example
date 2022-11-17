import { Container, Grid} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { socket } from "../socket";
import Chat from "./chat";
import Trucks from "./trucks";


const useStyles = makeStyles((theme) => ({
  grid: {
    height: '100%',
  },
  gridItem: {
    height: '100%',
    flexDirection: 'column',
    padding: '2vh',
  },
  container: {
    paddingTop: "5vh",
    width: "100vw",
    height: "100vh",
    display: "flex",
  }
}));

export default function Layout() {
  const classes = useStyles();
  
  if (!socket) return <p>Connecting server ...</p>

  socket.on("connect", () => {
    console.log("Is socket connected:", socket.connected);
  });
  console.log(socket)
  return(
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={2} className={classes.grid}>
        <Grid item xs={8} className={classes.gridItem}>
          <Trucks/>
        </Grid>
        <Grid item xs={4} className={classes.gridItem}>
          <Chat/>
        </Grid>
      </Grid>
    </Container>
    
  )
}