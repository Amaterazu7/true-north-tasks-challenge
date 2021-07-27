import React, {useState, useEffect} from "react";
import {
  FilledInput,
  InputLabel,
  createStyles,
  Backdrop,
  CircularProgress,
  FormControl,
  Typography,
  IconButton,
  Theme,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from '@material-ui/core/styles';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckBox from '@material-ui/icons/CheckBox';
import DialogContentText from "@material-ui/core/DialogContentText";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import "./App.css";
import ITask from './types/task';
import taskServices from './services/tasks.services';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
}));
const backdropStyles = makeStyles((theme: Theme) =>
    createStyles({
      backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
    }),
);

let theme = createTheme();
theme = responsiveFontSizes(theme);
const App = (): JSX.Element => {
  const [newTittle, setTittle] = useState<string>("");
  const [newDescription, setDescription] = useState<string>("");
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [statusTask, setStatusTask] = useState<ITask>({
    tittle: "", description: "", done: false
  });
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  const classes = useStyles();
  const backdropClasses = backdropStyles();

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(true);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleActionClose = () => {
    handleToggle();
    statusTask.done = !statusTask.done;
    taskServices.update(statusTask, statusTask._id).then(() => {
      retrieveAllTasks();
      handleCloseDialog();
    });
  };

  useEffect(() => {
    retrieveAllTasks();
  }, []);

  const retrieveAllTasks = (): any => {
    taskServices.getAll().then(res => {
      setTasks(res);
      setInterval( ()=>{handleClose()}, 3000);
    })
  }

  const handleSubmit = (): void => {
    handleToggle();
    addTask(newTittle, newDescription);
    setTittle("");
    setDescription("");
  };
  const handleTittleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTittle(event.target.value);
  };
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const addTask = (tittle: string, description: string): void => {
    taskServices.create({ tittle, description, done: false }).then(retrieveAllTasks());
  };

  const toggleDoneTask = (task: ITask): void => {
    setStatusTask(task);
    handleClickOpen();
  };

  const removeTask = (_id: string): void => {
    handleToggle();
    taskServices.delete(_id).then(retrieveAllTasks());
  };

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">

            <div className="card-header">
              <h1 className="text-center">My Tasks</h1>
            </div>
            <div className="card-body">
              <form>
                <FormControl fullWidth className={classes.margin} variant="filled">
                  <InputLabel htmlFor="component-filled">Tittle</InputLabel>
                  <FilledInput required={true} id="component-filled" value={newTittle} onChange={handleTittleChange} />
                </FormControl>
                <FormControl fullWidth className={classes.margin} variant="filled">
                  <InputLabel htmlFor="component-filled">Description</InputLabel>
                  <FilledInput required={true} id="component-filled" value={newDescription} onChange={handleDescriptionChange} />
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.button}
                    onClick={handleSubmit}
                    startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </form>

              {
                tasks.map((t: ITask, i: number) => (
                  <div key={i} className="card card-body mt-2">
                    <ThemeProvider theme={theme}>
                      <Typography variant="h3" style={{ textDecoration: t.done ? "line-through" : "" }}>{t.tittle}</Typography>
                      <Typography  className={classes.margin} variant="h5">{t.description}</Typography>
                    </ThemeProvider>
                    <div>
                      <IconButton hidden={t.done} aria-label="checkBoxOutlineBlank" className={classes.margin} color="primary">
                        <CheckBoxOutlineBlankIcon fontSize="large" onClick={() => toggleDoneTask(t)}/>
                      </IconButton>
                      <IconButton hidden={!t.done} aria-label="checkBox" className={classes.margin} color="primary">
                        <CheckBox fontSize="large" onClick={() => toggleDoneTask(t)}/>
                      </IconButton>
                      <IconButton aria-label="delete" className={classes.margin} color="secondary">
                        <DeleteIcon fontSize="large" onClick={() => removeTask(t._id)}/>
                      </IconButton>
                    </div>
                  </div>
                ))
              }

              <Backdrop className={backdropClasses.backdrop} open={open} onClick={handleClose}>
                <CircularProgress color="inherit"/>
              </Backdrop>

              <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Status Task</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to change the status of the task?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button hidden={statusTask.done} onClick={handleActionClose} color="primary">
                    Complete
                  </Button>
                  <Button hidden={!statusTask.done} onClick={handleActionClose} color="primary">
                    Undo Complete
                  </Button>
                  <Button onClick={handleCloseDialog} color="primary">
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
