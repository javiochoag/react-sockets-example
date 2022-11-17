import { makeStyles } from "@mui/styles";
import Dashboard from "./dashboard";
import Map from "./map";
import { socket } from "../socket";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: '100%',
  },
}));

export default function Trucks() {
  const classes = useStyles();

  const [trucks, setTrucks] = useState([]);

  useEffect(()=> {
    const getTrucks = (listTrucks) => {
      console.log("camiones recibidos", listTrucks)
      setTrucks(listTrucks)
    };
    socket.emit('TRUCKS');
    socket.on('TRUCKS', getTrucks);
    return () => {
      socket.off('TRUCKS', getTrucks);
    };
  }, [setTrucks]);


  return (
    <div className = {classes.card}>
      <Map trucks={trucks}/>
      <Dashboard trucks={trucks}/> 
    </div>
  )
}