/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import Moment from 'moment';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Modal,
  FormControl,
  TextField,
  MenuItem,
  Box
} from '@mui/material';

// components
import axios from 'axios';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';

// Style box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
// ----------------------------------------------------------------------
export default function Booking() {

  const [bookings, setBookings]= useState('');
  const [room_id, setRoomId]= useState('');
  const [room_code, setRoomCode]= useState('');
  const [room_name, setRoomName]= useState('');
  const [meeting_category, setMeetingCategory]= useState('');
  
  const [open, setOpen]  = useState(false);
  const [openDel, setOpenDel]  = useState(false);
  const [openUpd, setOpenUpd]  = useState(false);

  //----
  const handleOpenModalCreate  = () => setOpen(true);
  const handleCloseModalCreate = () => setOpen(false);
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const data = {
      room_code,room_name,meeting_category
    }
    axios.post('http://localhost:8080/api/room', data)
      .then(res => {
        console.log(res);
        console.log(res.data);
      }); 
  }

  //
  const handleOpenModalDelete  = (e) => {
    setRoomId(e.target.getAttribute("data-room_id"))
    setRoomName(e.target.getAttribute("data-room_name"))
    setOpenDel(true);
    console.log(room_id)
  }
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    axios.delete(`http://localhost:8080/api/room/${room_id}`)
      .then(res => {
          console.log(res);
          console.log(res.data);
      })
    setOpenDel(false)
  }

  //
  useEffect(() => {
    axios.get(`http://localhost:8080/api/booking`).then((res) => {
      setBookings(res.data);
    });
  }, []);

  console.table(bookings)

  return (
    <Page title="Room">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Bookings
          </Typography>
          <Button variant="contained"  startIcon={<Iconify icon="eva:plus-fill"/>} onClick={handleOpenModalCreate}>
            New Booking
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ROOM</TableCell>
                    <TableCell>BOOKED BY</TableCell>
                    <TableCell>EVENT NAME</TableCell>
                    <TableCell>TIME START</TableCell>
                    <TableCell>TIME END</TableCell>
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                  {Array.isArray(bookings.data)
                  ? bookings.data.map(booking => ( 
                  <TableRow
                    hover
                    tabIndex={-1}
                    role="checkbox"
                    key={booking.booking_id}
                  >
                    <TableCell align="left" component="td" >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {bookings.room_name} 
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">{bookings.user_name} </TableCell>
                    <TableCell align="left">{booking.meeting_name} </TableCell>
                    <TableCell align="left">{Moment(booking.time_start).format("LLLL")}</TableCell>
                    <TableCell align="left">{Moment(booking.time_end).format("H:mm:ss a, dddd DD-MM-YYYY")}</TableCell>
                    <TableCell align="left">
                      Later  
                    </TableCell>
                  </TableRow>
                  )) : null} 
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
        <div>
          <Modal
            open={open}
            onClose={handleCloseModalCreate}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create Room
              </Typography>
              <FormControl fullWidth >
                <TextField required id="outlined-required" margin="normal" label="Room Code"  name="room_code" value={room_code} onChange={(e) => {setRoomCode(e.target.value)}} />
                <TextField required id="outlined-required" margin="normal" label="Room Name"  name="room_name" value={room_name} onChange={(e) => {setRoomName(e.target.value)}} />
                <TextField
                  id="demo-simple-select-standard"
                  margin="normal"
                  name="meeting_category"
                  value={meeting_category} onChange={(e) => {setMeetingCategory(e.target.value)}}
                  select label="Meeting Category"
                >
                  <MenuItem value={"Select"} >Select</MenuItem>
                  <MenuItem value={"Privat"} >Privat</MenuItem>
                  <MenuItem value={"Reguler"}>Reguler</MenuItem>
                </TextField>
                <Button variant="contained" type="submit" onClick={handleSubmitCreate}>Save</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
        <div>
          <Modal
            open={openDel}
            onClose={handleCloseModalDelete}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Delete {room_name}
              </Typography>
              <FormControl fullWidth >
                <TextField required id="outlined-required" margin="normal" label="Room ID" name="room_id" value={room_id} />
                <Button variant="contained" type="submit" onClick={handleSubmitDelete}>Delete</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
      </Container>
    </Page>
  );
}
