import { Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import { socket } from "../socket";

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: '50%',
    margin: '2px'
  },
  map: {
    height: '46vh',
    width: '105vh',
    maxWidth: '100%',
    maxHeight: '100%'
  }
}));

export default function Map({ trucks }) {
  const classes = useStyles();
  const [recentPositions, setRecentPositions] = useState({});

  useEffect(()=> {
    const updatePosition = (newPosition) => {
      let auxPositions = {...recentPositions}
      auxPositions[newPosition.code] = newPosition.position
      setRecentPositions(auxPositions)
    }
    const getPosition = (position) => {
      updatePosition(position);
    };
    socket.on('POSITION', getPosition);
    return () => {
      socket.off('POSITION', getPosition);
    };
  }, [recentPositions]);

  return (
  <Paper className={classes.card}>
    <MapContainer center={[-22.0, -68.826737]} zoom={10} scrollWheelZoom={false} className={classes.map}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trucks.map((truck) => {
        return(
        <>
        <Polyline pathOptions= {{color: 'lime'}} positions = {[truck.origin, truck.destination]}/>
        { (truck.code in recentPositions) ?
        <Marker position={recentPositions[truck.code]}>
          <Tooltip>{truck.code}</Tooltip>
        </Marker>
        :
        <Marker position={truck.origin}>
          <Tooltip>{truck.code}</Tooltip>
        </Marker>
        }
      </>
        )
      })}
      {/* {[...Object.values(recentPositions)].map((position) => {
        return(
          <Marker position={position}>
            <Tooltip>{position}</Tooltip>
          </Marker>
        )
      })} */}
    </MapContainer>
  </Paper>
  )
}