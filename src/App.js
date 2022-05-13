import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core'
import {Edit, Delete} from '@material-ui/icons'

const basUrl = 'https://users-crud1.herokuapp.com/users/'

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  },
  inputMaterial:{
    width: '100%'
  }
}));

function App() {

  const styles = useStyles();
  const [data, setData] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [userSelect, setUserSelect] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    birthday: ''
  })

  const handleChange = e => {
    const {name, value} = e.target;
    setUserSelect(prevState => ({
      ...prevState,
      [name]: value
    }))
    console.log(userSelect)
  }

  const petGet = async () => {
    await axios.get(basUrl)
    .then(response => {
      setData(response.data);
    })
  }

  const petPost = async () => {
    await axios.post(basUrl, userSelect)
    .then(response =>{
      setData(data.concat(response.data))
      openCloseModalInsert()
    })
  }

  const petPut = async () => {
    await axios.put(basUrl+userSelect.id, userSelect )
    .then(response => {
      var dataNew = data;
      dataNew.map(user=>{
        if(userSelect.id === user.id){
          user.first_name = userSelect.first_name;
          user.last_name = userSelect.last_name;
          user.email = userSelect.email;
          user.password = userSelect.password;
          //user.birthday = userSelect.birthday;
        }
      })
      setData(dataNew);
      openCloseModalEdit();
    })
  }

  const petDelete = async () => {
    await axios.delete(basUrl+userSelect.id)
    .then(response => {
      setData(data.filter(user=>user.id!==userSelect.id));
      openCloseModalDelete();
    })
  }

  const openCloseModalInsert = () => {
    setModalInsert(!modalInsert);
  }

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  }

  const openCloseModalDelete = () => {
    setModalDelete(!modalDelete);
  }

  const selectUser = (user, cass) => {
    setUserSelect(user);
    (cass === 'Edit')?openCloseModalEdit():openCloseModalDelete()
  }

  useEffect(()=>{
     petGet();
  },[])


  const bodyInsert = (
    <div className={styles.modal}>
      <h3>Add User</h3>
      <TextField name="first_name" className={styles.inputMaterial} label="First Name" onChange={handleChange}/>
      <br />
      <TextField name="last_name" className={styles.inputMaterial} label="Last Name" onChange={handleChange}/>
      <br />
      <TextField name="email" className={styles.inputMaterial} label="Email" onChange={handleChange}/>
      <br />
      <TextField name="password" className={styles.inputMaterial} label="Password" onChange={handleChange}/>
      <br />
      {/*<TextField name="birthday" className={styles.inputMaterial} label="Birthday" onChange={handleChange}/>*/}
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>petPost()}>Insert</Button>
        <Button onClick={()=>openCloseModalInsert()}>Cancel</Button>
      </div>
    </div>
  )

  const bodyEdit = (
    <div className={styles.modal}>
      <h3>Edit User</h3>
      <TextField name="first_name" className={styles.inputMaterial} label="First_Name" onChange={handleChange} value={userSelect && userSelect.first_name}/>
      <br />
      <TextField name="last_name" className={styles.inputMaterial} label="Last_Name" onChange={handleChange} value={userSelect && userSelect.last_name}/>
      <br />
      <TextField name="email" className={styles.inputMaterial} label="Email" onChange={handleChange} value={userSelect && userSelect.email}/>
      <br />
      <TextField name="password" className={styles.inputMaterial} label="Password" onChange={handleChange} value={userSelect && userSelect.password}/>
      <br />
      {/*<TextField name="birthday" className={styles.inputMaterial} label="Birthday" onChange={handleChange} value={userSelect && userSelect.birthday}/>*/}
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>petPut()}>Edit</Button>
        <Button onClick={()=>openCloseModalEdit()}>Cancel</Button>
      </div>
    </div>
  )

  const bodyDelete = (
    <div className={styles.modal}>
      <p>Delete User <b>{userSelect && userSelect.name}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>petDelete()}>Yes</Button>
        <Button onClick={()=>openCloseModalDelete()}>No</Button>
      </div>
    </div>
  )

  return (
    <div className="App">
      <br />
    <Button onClick={()=>openCloseModalInsert()}>Insert</Button>
      <br /><br />
     <TableContainer>
       <Table>
         <TableHead>
           <TableRow>
             <TableCell>First Name</TableCell>
             <TableCell>Last Name</TableCell>
             <TableCell>Email</TableCell>
             <TableCell>Password</TableCell>
             {/*<TableCell>Birthday</TableCell>*/}
             <TableCell>Action</TableCell>
           </TableRow>
         </TableHead>

         <TableBody>
           {data.map(user =>(
             <TableRow key={user.id}>
               <TableCell>{user.first_name}</TableCell>
               <TableCell>{user.last_name}</TableCell>
               <TableCell>{user.email}</TableCell>
               <TableCell>{user.password}</TableCell>
               {/*<TableCell>{user.birthday}</TableCell>*/}
               <TableCell>
                 <Edit className={styles.iconos} onClick={()=>selectUser(user, 'Edit')} />
                  &nbsp;&nbsp;&nbsp;
                 <Delete className={styles.iconos} onClick={() =>selectUser(user, 'Delete')} />
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </TableContainer>

     <Modal
      open = {modalInsert}
      onClose = {openCloseModalInsert}>
        {bodyInsert}
     </Modal>

     <Modal
      open = {modalEdit}
      onClose = {openCloseModalEdit}>
        {bodyEdit}
     </Modal>

     <Modal
      open = {modalDelete}
      onClose = {openCloseModalDelete}>
        {bodyDelete}
     </Modal>
    </div>
  );
}

export default App;
