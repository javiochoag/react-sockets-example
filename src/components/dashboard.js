import { Button, Card, CardActions, CardContent, Paper} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { socket } from "../socket";

const useStyles = makeStyles((theme) => ({
  dashboard: {
    minHeight: '50%',
  },
  card: {
    minWidth: '37vh',
    margin: '1px',
    fontSize: '2vh',
  },
  cardContainer: {
    overflowX: "scroll",
    display: 'flex',
    padding: '2px'
  }
}));

export default function Dashboard({ trucks }) {
  const classes = useStyles();
  const [status, setStatus] = useState({});

  useEffect(()=> {
    const getFix = (newStatus) => {
      console.log('nuevo fix', newStatus)
      let auxStatus = {...status}
      auxStatus[newStatus.code] = {'status': 'Ok', 'source': ''}
      setStatus(auxStatus)
    };
    const getFailure = (newStatus) => {
      console.log('nuevo failure', newStatus)
      let auxStatus = {...status}
      auxStatus[newStatus.code] = {'status': 'Falla', 'source': newStatus.source}
      setStatus(auxStatus)
    };
    socket.on("FIX", getFix);
    socket.on("FAILURE", getFailure);
    return () => {
      socket.off('FIX', getFix);
      socket.off('FAILURE', getFailure);
    };
  }, [status]);

  const handleClick = (code) => {
    let response = {
      'code': code
    }
    socket.emit('FIX', response)
  }

  return (
  <Paper className={classes.dashboard}>
    <Box className={classes.cardContainer}>
      {trucks.map((truck) => {
          return(
            <Card id={truck.code} className={classes.card}>
              <CardContent>
                <div><h3>Camión {truck.code}</h3></div>
                <div>Motor: {truck.engine}</div>
                <div><b>Origen:</b> {truck.origin}</div>
                <div><b>Destino:</b> {truck.destination}</div>
                <div><b>Modelo:</b> {truck.truck}</div>
                <div><b>Staff:</b> {truck.staff.map((operator) => {
                  return(
                    <span>{operator.name} ({operator.age} años), </span>
                  )
                })}
                </div>
                { (truck.code in status) ?
                  <div>Estado: {status[truck.code].status}</div>
                  :
                  <div>Estado: Ok</div>
                }
              </CardContent>
              { (truck.code in status && status[truck.code].status !== 'Ok') ?
              <CardActions>
                <Button size="small" onClick={() => handleClick(truck.code)}>
                  Arreglar
                </Button>
            </CardActions>
              :
              <></>
              }
            </Card>
          )
        })}
      </Box>
  </Paper>
  )
}