import React, {useState} from 'react';
import { Button, Select, InputLabel, MenuItem } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';

import '../index.css';
import PrefDD from './PrefDD';

function DisplayBox() {
    const [time, setTime] = useState('13:00')
    const [pref1, setPref1] = useState('')
    const [pref2, setPref2] = useState('')
    const [pref3, setPref3] = useState('')
    const [running, setRunning] = useState(false)
    let rooms = [
        'Bill Bryson Library: Overnight Stay and Study',
        'Bill Bryson Library: Stay and Study',
        'Dunelm House: Individual Study',
        'Elvet Riverside: Individual Study',
        'Hotel Indigo: Individual Study',
        'Leazes Road: Individual Study',
        'Mathematical Sciences & Computer Science Building: Individual Study',
        'Teaching and Learning Centre: High Bar Table',
        'Teaching and Learning Centre: Individual Study - long stay',
        'Teaching and Learning Centre: Individual Study Space',
        'Teaching and Learning Centre: Low Soft Seating',
        'Teaching and Learning Centre: Media Table',
        'Teaching and Learning Centre: Study Table'
    ]
    function handleTime(e){
        setTime(e.target.value)
    }
    function handleChoice(e,prefn){
        if (prefn === 'pref1'){
            setPref1(e.target.value)
        }
        else if (prefn === 'pref2'){
            setPref2(e.target.value)
        }
        else if (prefn === 'pref3'){
            setPref3(e.target.value)
        }
        else{
            console.log('yikes')
        }
    }
    function startServer(){
        fetch('/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pref1,
                pref2,
                pref3,
                time
        }),
}).then((res) => res.json())
.then((data) => {
    setRunning(data.running)
})
    }

    function stopServer(){
        fetch('/stoprun')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    setRunning(data.running)
  });

    }
   
    return (
         <div class="formcontainer">
             <div class="timecontainer">
             <InputLabel id="time">Time</InputLabel>
             <FormControl>
                <Select id='time' onChange={(e) => handleTime(e)}>
                <MenuItem value="13:00">1pm</MenuItem>
                <MenuItem value="18:00">6pm</MenuItem>
                </Select>
                </FormControl>
             </div>
             <div class="prefcontainer">
                 {[1,2,3].map(n => <PrefDD prefn = {n} handleChoice = {handleChoice} rooms = {rooms}></PrefDD>)}
             </div>
             <div class="btncontainer">
             {running ? <Button onClick={() => stopServer()} color="primary"> Stop Running</Button> : <Button onClick={() => startServer()} color="primary"> Run</Button>}

             </div>
         </div>
         )

    }

    export default DisplayBox;