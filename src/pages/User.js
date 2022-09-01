/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import { sentenceCase } from 'change-case';
import React, { useEffect, useState } from "react";

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
import Label from '../components/Label';
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
  boxShadow: 24,
  p: 4,
  borderRadius: '10px'
};
// ----------------------------------------------------------------------
export default function User() {

  //
  const [users, setUsers] = useState('');
  const [user_id, setUserId] = useState('');
  const [name, setName]   = useState('');
  const [role, setRole]   = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword]   = useState('');

  //
  const [open, setOpen]  = useState(false);
  const [openDel, setOpenDel]  = useState(false);

  //
  useEffect(() => {
    axios.get(`http://localhost:8080/api/user`).then((response) => {
      setUsers(response.data);
    });
  }, []);


  //
  const handleOpenModalCreate  = () => setOpen(true);
  const handleCloseModalCreate = () => setOpen(false);
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const data = {
      role, name, email, password
    }
    console.table(data)
    axios.post('http://localhost:8080/api/user', data)
      .then(res => {
        console.log(res);
        console.log(res.data);
      }); 
    setOpen(false)
  }

  //
  const handleOpenModalDelete  = (e) => {
    setUserId(e.target.getAttribute("data-user_id"))
    setName(e.target.getAttribute("data-name"))
    setOpenDel(true);
  }
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    axios.delete(`http://localhost:8080/api/user/${user_id}`)
      .then(res => {
          console.log(res);
          console.log(res.data);
      })
    setOpenDel(false)
  }

  return (
    <Page title="user">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users 
          </Typography>
          <Button variant="contained"  startIcon={<Iconify icon="eva:plus-fill"/>} onClick={handleOpenModalCreate}>
            New User
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>USERNAME</TableCell>
                    <TableCell>ROLE</TableCell>
                    <TableCell>EMAIL</TableCell>
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                  {Array.isArray(users)
                  ? users.map(user => ( 
                  <TableRow
                    hover
                    tabIndex={-1}
                    role="checkbox"
                    key={user.user_id}
                  >
                    <TableCell align="left" component="td" >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {user.name} 
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">
                      <Label variant="ghost" color={(user.role === 'admin' && 'success') || 'warning'}>
                        {sentenceCase(user.role)}
                      </Label>
                    </TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="left">
                      <Button variant="contained" color="error" size="small" margin={2} startIcon={<Iconify icon="eva:trash-fill"/> } 
                        data-name={user.name} 
                        data-user_id={user.user_id}  
                        onClick={handleOpenModalDelete}> 
                        Delete
                      </Button>
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
                Create User
              </Typography>
              <FormControl fullWidth >
                <TextField required id="outlined-required" margin="normal" label="User Name"  name="name" value={name} onChange={(e) => {setName(e.target.value)}} />
                <TextField required id="outlined-required" margin="normal" label="Email"  name="email" type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                <TextField required id="outlined-required" margin="normal" label="Password"  name="pass" type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                <TextField
                  id="demo-simple-select-standard"
                  margin="normal"
                  name="role"
                  value={role} onChange={(e) => {setRole(e.target.value)}}
                  select label="Role"
                >
                  <MenuItem value={role} >Select</MenuItem>
                  <MenuItem value={"admin"} >Admin</MenuItem>
                  <MenuItem value={"nonadmin"}>Non Admin</MenuItem>
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
                Delete {name} ?
              </Typography>
              <FormControl fullWidth >
                <TextField required id="outlined-required" margin="normal" label="User ID" name="user_id" value={user_id} />
                <Button variant="contained" type="submit" onClick={handleSubmitDelete}>Delete</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
      </Container>
    </Page>
  );
}
