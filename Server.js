const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
// const PRAGMA foreign_keys = ON;
const app = express();

var corOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.post("/profile", (request, response) => {
  const newProfile = request.body;

  console.log("Profile creation: " + JSON.stringify(newProfile));

  let db = new sqlite3.Database("db/events");

  const insertQuery = "INSERT INTO profile (id, name, email) VALUES (?, ?, ?)";

  const values = [newProfile.id, newProfile.name, newProfile.email];
  console.log("newProfile.id :" + newProfile.id);
  db.run(insertQuery, values, (err) => {
    console.log("values: " + values);
    console.log("error: " + err);
    if (err) {
      response.json({
        message: err.message,
      });
      db.close();
    } else {
      response.json({
        message: "Successfully inserted Profile ",
      });
      db.close();
    }
  });
});

// app.post("/profile", (request, response) => {
//   const newProfile = request.body;

//   console.log("Profile creation: " + JSON.stringify(newProfile));

//   let db = new sqlite3.Database("db/events");

//   const insertQuery =
//     "INSERT INTO profile (id, name, age, gender, address, city, mobile, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

//   let updatedAge = "";
//   let updatedAddress = "";
//   let updatedCity = "";
//   let updatedGender = "";
//   let updatedMobile = "";
//   console.log("newProfile.age : " + newProfile.age);
//   if (newProfile.age) {
//     console.log("newProfile.age in if condition: " + newProfile.age);
//     updatedAge = newProfile.age;
//   }
//   if (newProfile.gender) {
//     updatedGender = newProfile.gender;
//   }
//   if (newProfile.address) {
//     updatedAddress = newProfile.address;
//   }
//   if (newProfile.city) {
//     updatedCity = newProfile.city;
//   }
//   if (newProfile.mobile) {
//     updatedMobile = newProfile.mobile;
//   }

//   const values = [
//     newProfile.id,
//     newProfile.name,
//     updatedAge,
//     updatedGender,
//     updatedAddress,
//     updatedCity,
//     updatedMobile,
//     newProfile.email,
//   ];

//   db.run(insertQuery, values, (err) => {
//     if (err) {
//       response.json({
//         message: err.message,
//       });
//     } else {
//       response.json({
//         message: "Successfully inserted Profile ",
//       });
//     }
//   });

//   db.close();
// });

app.get("/profile", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const selectQuery =
    "SELECT id, name, age, gender, address, city, mobile, email from profile";

  db.all(selectQuery, [], (err, profileList) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const profileInputs = profileList.map((singleProfile) => {
        console.log(singleProfile);
        return {
          id: singleProfile.id,
          name: singleProfile.name,
          age: singleProfile.age,
          gender: singleProfile.gender,
          address: singleProfile.address,
          city: singleProfile.city,
          mobile: singleProfile.mobile,
          email: singleProfile.email,
        };
      });
      response.json(profileInputs);
    }
  });
  db.close();
});

app.get("/profile/:id", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const selectQuery =
    "SELECT id, name, age, gender, address, city, mobile, email from profile WHERE id=?";

  db.all(selectQuery, [parseInt(request.params.id)], (err, profileList) => {
    console.log("profile - ID:" + parseInt(request.params.id));
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const profileInputs = profileList.map((singleProfile) => {
        console.log("singleProfile :" + singleProfile);
        return {
          id: singleProfile.id,
          name: singleProfile.name,
          age: singleProfile.age,
          gender: singleProfile.gender,
          address: singleProfile.address,
          city: singleProfile.city,
          mobile: singleProfile.mobile,
          email: singleProfile.email,
        };
      });
      console.log("profileInputs[0]: " + profileInputs[0]);
      response.json(profileInputs[0]);
    }
  });
  db.close();
});

app.put("/profile", (request, response) => {
  const updatedProfile = request.body;

  let db = new sqlite3.Database("db/events");

  const updatedName = updatedProfile.name;
  const updatedAge = updatedProfile.age;
  const updatedGender = updatedProfile.gender;
  const updatedAddress = updatedProfile.address;
  const updatedCity = updatedProfile.city;
  const updatedMobile = updatedProfile.mobile;
  const updatedEmail = updatedProfile.email;
  const id = updatedProfile.id;

  const updateQuery =
    "UPDATE profile SET name=?, age=?, gender=?, address=?, city=?, mobile=?, email=? WHERE id = ?";

  const values = [
    updatedName,
    updatedAge,
    updatedGender,
    updatedAddress,
    updatedCity,
    updatedMobile,
    updatedEmail,
    id,
  ];

  db.run(updateQuery, values, (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully updated Profile ",
      });
    }
  });

  db.close();
});

app.post("/events", (request, response) => {
  const newEvent = request.body;

  console.log("Event Creation : " + newEvent);

  let db = new sqlite3.Database("db/events");

  const insertQuery =
    "INSERT INTO events (eventType, name, place, date, profileId) VALUES (?, ?, ?, ?, ?)";

  const values = [
    newEvent.eventType,
    newEvent.name,
    newEvent.place,
    newEvent.date,
    newEvent.profileId,
  ];

  db.run(insertQuery, values, (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully inserted Events ",
      });
    }
  });

  db.close();
});

app.get("/events", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const selectQuery =
    "SELECT id, eventType, name, place, date, profileId from events ";

  db.all(selectQuery, [], (err, eventslist) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const eventInputs = eventslist.map((singleevent) => {
        console.log(singleevent);
        return {
          id: singleevent.id,
          eventType: singleevent.eventType,
          name: singleevent.name,
          place: singleevent.place,
          date: singleevent.date,
          profileId: singleevent.profileId,
        };
      });
      response.json(eventInputs);
    }
  });
  db.close();
});

app.get("/events/:id", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const selectQuery =
    "SELECT id, eventType, name, place, date, profileId from events WHERE id=? ";

  db.all(selectQuery, [parseInt(request.params.id)], (err, eventslist) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const eventInputs = eventslist.map((singleevent) => {
        console.log(singleevent);
        return {
          id: singleevent.id,
          eventType: singleevent.eventType,
          name: singleevent.name,
          place: singleevent.place,
          date: singleevent.date,
          profileId: singleevent.profileId,
        };
      });
      console.log(eventInputs);
      response.json(eventInputs[0]);
    }
  });
  db.close();
});

app.get("/events/all/:profileId", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const selectQuery =
    "SELECT id, eventType, name, place, date, profileId from events WHERE profileId = ?";

  db.all(selectQuery, [request.params.profileId], (err, eventslist) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const eventInputs = eventslist.map((singleevent) => {
        console.log(singleevent);
        return {
          id: singleevent.id,
          eventType: singleevent.eventType,
          name: singleevent.name,
          place: singleevent.place,
          date: singleevent.date,
          profileId: singleevent.profileId,
        };
      });
      response.json(eventInputs);
      console.log(eventInputs);
    }
  });

  db.close();
});

app.get("/events/profileId", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const selectQuery = "SELECT profileId from events WHERE id = ?";

  db.all(selectQuery, [request.query.eventId], (err, results) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      console.log(results);

      response.json(results[0]);
    }
  });

  db.close();
});

app.get("/entries/eventId", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const selectQuery = "SELECT eventId from entries WHERE id = ?";

  db.all(selectQuery, [request.query.entryId], (err, results) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      console.log(results[0]);

      response.json(results[0]);
    }
  });

  db.close();
});
app.put("/events", (request, response) => {
  const updatedEvents = request.body;

  let db = new sqlite3.Database("db/events");
  const updatedEventType = updatedEventType.eventType;
  const updatedName = updatedEvents.name;
  const updatedPlace = updatedEvents.place;
  const updatedDate = updatedEvents.date;
  const id = updatedEvents.id;

  const updateQuery = "UPDATE events SET name=?, place=?, date=? WHERE id = ?";

  const values = [updatedEventType, updatedName, updatedPlace, updatedDate, id];

  db.run(updateQuery, values, (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully updated Events ",
      });
    }
  });

  db.close();
});

app.delete("/entries/all/:eventId", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const deleteQuery = "DELETE from entries WHERE eventId = ?";

  db.run(deleteQuery, [request.params.eventId], (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully deleted Event ",
      });
    }
  });

  db.close();
});

app.delete("/events/:id", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const deleteQuery = "DELETE from events WHERE id = ?";

  db.run(deleteQuery, [parseInt(request.params.id)], (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully deleted Event ",
      });
    }
  });

  db.close();
});

app.post("/entries", (request, response) => {
  const newEntry = request.body;

  console.log(newEntry);

  let db = new sqlite3.Database("db/events");

  const insertQuery =
    "INSERT INTO entries (personName, city, selected, amount, gift, eventId) VALUES (?, ?, ?, ?, ?, ?)";

  const values = [
    newEntry.personName,
    newEntry.city,
    newEntry.selected,
    newEntry.amount,
    newEntry.gift,
    newEntry.eventId,
  ];

  db.run(insertQuery, values, (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully inserted Entries ",
      });
    }
  });

  db.close();
});

// get all entries of all events

app.get("/entries", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const selectQuery =
    "SELECT id, personName, city, selected, amount, gift, eventId from entries ";

  db.all(selectQuery, [], (err, entrieslist) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const entryInputs = entrieslist.map((singleentry) => {
        console.log(singleentry);
        return {
          id: singleentry.id,
          personName: singleentry.personName,
          city: singleentry.city,
          selected: singleentry.selected,
          amount: singleentry.amount,
          gift: singleentry.gift,
          eventId: singleentry.eventId,
        };
      });
      response.json(entryInputs);
    }
  });
  db.close();
});

// get all entries in one single event
app.get("/entries/all/:eventId", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const selectQuery =
    "SELECT id, personName, city, selected, amount, gift, eventId from entries WHERE eventId=?";

  db.all(
    selectQuery,
    [parseInt(request.params.eventId)],
    (err, entrieslist) => {
      if (err) {
        response.json({
          message: err.message,
        });
      } else {
        const entryInputs = entrieslist.map((singleentry) => {
          console.log(singleentry);
          return {
            id: singleentry.id,
            personName: singleentry.personName,
            city: singleentry.city,
            selected: singleentry.selected,
            amount: singleentry.amount,
            gift: singleentry.gift,
            eventId: singleentry.eventId,
          };
        });
        response.json(entryInputs);
      }
    }
  );
  db.close();
});

// get singleentry
app.get("/entries/:id", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const selectQuery =
    "SELECT id, personName, city, selected, amount, gift, eventId from entries WHERE id=?";

  db.all(selectQuery, [parseInt(request.params.id)], (err, entrieslist) => {
    console.log(parseInt(request.params.id));
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const entryInputs = entrieslist.map((singleentry) => {
        console.log(singleentry);
        return {
          id: singleentry.id,
          personName: singleentry.personName,
          city: singleentry.city,
          selected: singleentry.selected,
          amount: singleentry.amount,
          gift: singleentry.gift,
          eventId: singleentry.eventId,
        };
      });
      console.log(entryInputs);
      response.json(entryInputs[0]);
    }
  });
  db.close();
});

// get total amount , total no. of gifts for entries

app.get("/entries/total/:eventId", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const selectQuery =
    "SELECT eventId , SUM(amount) AS totalAmount FROM entries WHERE eventId=?";

  // "SELECT eventId , SUM(amount) AS totalAmount, COUNT(gift) AS totalGift FROM entries WHERE eventId=?";

  db.all(selectQuery, [parseInt(request.params.eventId)], (err, totalList) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      const getTotals = totalList.map((singleTotal) => {
        console.log(singleTotal);
        return {
          totalAmount: singleTotal.totalAmount,
          // totalGift: singleentry.totalGift,
        };
      });
      response.json(getTotals[0]);
    }
  });
  db.close();
});

app.put("/entries", (request, response) => {
  const updatedEntries = request.body;

  let db = new sqlite3.Database("db/events");

  const updatedpersonName = updatedEntries.personName;
  const updatedCity = updatedEntries.city;
  const updatedSelected = updatedEntries.selected;
  const updatedAmount = updatedEntries.amount;
  const updatedGift = updatedEntries.gift;
  // const updatedEventId = updatedEntries.eventId;
  const id = updatedEntries.id;

  const updateQuery =
    "UPDATE entries SET personName=?, city=?, selected=?, amount=?, gift=? WHERE id = ?";

  const values = [
    updatedpersonName,
    updatedCity,
    updatedSelected,
    updatedAmount,
    updatedGift,
    // updatedEventId,
    id,
  ];

  db.run(updateQuery, values, (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully updated Entries ",
      });
    }
  });

  db.close();
});

app.delete("/entries/:id", (request, response) => {
  let db = new sqlite3.Database("db/events");

  const deleteQuery = "DELETE from entries WHERE id = ?";

  db.run(deleteQuery, [parseInt(request.params.id)], (err) => {
    if (err) {
      response.json({
        message: err.message,
      });
    } else {
      response.json({
        message: "Successfully deleted Entry ",
      });
    }
  });

  db.close();
});

app.listen(2023, () => {
  console.log("Listening successfully - use 2023");
});
