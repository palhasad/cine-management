// arquivo editar usuario
import React, {useState, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Form } from '@unform/web';
import "./styles.css"
import api from '../../../services/api';
import Input from '../../Form/input';
import Select from '../../Form/select'
import Functions from '../../../functions';


// define posição do modal
function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
// define estilo do modal
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: '#1e1e1e',
    border: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: 'royalblue'
  },
}));

export default function SimpleModal(item) {
  // define os estilos definidos em useStyles na const cLasses
  const classes = useStyles();
  // propriedade do unform para usar ref no form
  const formRef =useRef(null)
  // states do modal
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [edited, setedited] = useState(false);
  // executa ao enviar o form
  const handleSubmit =async (data) => {
    if(!Functions.nome(data.editNome)){
      
      formRef.current.setFieldError('editNome', "O nome deve conter ao menos 4 caracteres.")
    }
    
    if(! await Functions.editEmail(data.editEmail, item.email)){
      
      formRef.current.setFieldError('editEmail', "Email inválido ou já cadatrado.")
    }
  
    if(await Functions.editEmail(data.editEmail,item.email) && Functions.nome(data.editNome)){
      
      okUpdate(data)
    }
    
  }
  // função executada ao abrir o modal
  const handleOpen = () => {
    setOpen(true);
   
  };
  // função executada ao fechar modal
  const handleClose = () => {
    setOpen(false);
  };

  // função para editar definitivamente
  const okUpdate = async (data) => {
    try{
        data.email=data.editEmail
        delete data['editEmail']
        data.nome=data.editNome
        delete data['editNome']
        const response = await api.put(`/${item.where}/${item.id}`, data)

        
        setedited(true)
    }catch(error){
        alert('Houve um erro ao editar este usuário: '+error)
    }
   
  
  };
  // recarrega pagina
  const reload=()=>{
    window.location.reload()
  }
  // retorna html primeira etapa
  const body = (
      
    <div style={modalStyle } className={classes.paper}>
      <h2 id="simple-modal-title">{item.texto}</h2>
      <br/>
      <Form ref={formRef} onSubmit={handleSubmit}>
      <div className="inputItem"><span className="spanE">Nome:</span> <Input required defaultValue={item.nome} id="editNome" name="editNome" type="text" /></div>
      
      <div className="inputItem"><span className="spanE">Email:</span> <Input required defaultValue={item.email} id="editEmail" name="editEmail" type="email" /></div>
      
      <div className="inputItem"><span className="spanE">Nível:</span> <Select required defaultValue={item.nivel} className="select"  name="nivel"><option value='1'>Gerente</option> <option value='2'>Cliente</option></Select></div>
      <br/>
      <div style={{
          display:'flex',
          justifyContent:'space-between'
      }}>
          
          <button className="btns" onClick={handleClose} style={{backgroundColor:'red'}}>Cancelar</button>
          <button className="btns" style={{backgroundColor:'green'}}>Editar</button>
          
      </div>
      </Form>
    </div>
  );
  // retorna html segunda etapa
  const body2 = (
      
    <div style={ modalStyle } className={classes.paper}>
      <h2 id="simple-modal-title">{item.nome} foi editado com sucesso!</h2>
      <br/>
      <div style={{
          display:'flex',
          justifyContent:'center'
      }}>
          
          <button className="btns" onClick={handleClose, reload} style={{backgroundColor:'royalblue'}}>OK</button>
          
      </div>
    </div>
  );
  // retorna html botao
  return (
    <>
      <button type="button" style={{background:'none', border:'none'}} onClick={handleOpen}>
      <span className="fas fa-edit"/>
      </button>
      <Modal
        open={open}
        onClose={edited ? (handleClose, reload) : handleClose }
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          {edited ? body2 : body }
      </Modal>
    </>
  );
}
