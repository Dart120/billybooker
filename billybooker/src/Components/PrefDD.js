import React, {useState} from 'react';
import {Select, InputLabel, MenuItem } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import '../index.css';

function PrefDD(props) {
    return (
        <FormControl>
        <InputLabel id={props.prefn}>Preference {props.prefn}</InputLabel>
                <Select value = {props.prefVal} id = {props.prefn} labelId={props.prefn} onChange={(e) => props.handleChoice(e,props.prefn)}>
                    {props.rooms.map(room => <MenuItem value={room}>{room}</MenuItem>)}
                </Select>
                </FormControl>
    )
}
export default PrefDD