const express = require('express');
const path = require('path');
const fs = require('fs');
const {v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(express.static('public'));

app.get('/notes', (req, res) => {
    // return the notes.html file
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});


app.get('/api/notes', (req, res) => {
    // return the db.json file and return all saved notes as JSON
    res.sendFile(path.join(__dirname, 'db/db.json'));
});

app.post('/api/notes', (req, res) => {
    // receive a new note to save on the request body, add it to the db.json file and then return the new note to the client
    // you'll find a way to give each note a unique id when it's saved (look into npm packages that could do this for you)
    fs.readFile(path.join(__dirname, 'db/db.json'), (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes.push({...req.body, id: uuidv4()});
        fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(notes));
        res.status(200).send(notes);
    });
});

app.delete('/api/notes/:id', (req, res) => {
    // should receive a query parameter that contains the id of a new to delete. to delete a note, you'll need to read all notes form db.json file, 
    // remove the note with the given id property, and then rewrite the notes to the db.json file.
    fs.readFile(path.join(__dirname, 'db/db.json'), (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== req.params.id);
        fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(notes));
        res.status(200).send(notes);
    });
});

app.get('*', (req, res) => {
    // return the index.html file
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
