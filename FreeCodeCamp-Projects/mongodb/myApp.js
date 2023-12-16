require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });



const schema = mongoose.Schema;
const PersonSchema = new schema ({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
}) ;

const Person = mongoose.model("Person", PersonSchema);



const createAndSavePerson = (done) => {
  const person =  new Person ({name: 'jain', age: 23, favoriteFoods: ['Briyani']});

  person.save((err, data) => {
    if (err) return console.error(err);
    done(null , data);
  });
};


var arrayOfPeople = [
  {name: "Frankie", age: 74, favoriteFoods: ["Del Taco"]},
  {name: "Sol", age: 76, favoriteFoods: ["roast chicken"]},
  {name: "Robert", age: 78, favoriteFoods: ["wine"]}
];

const createManyPeople = (arrayOfPeople, done) => {
Person.create(arrayOfPeople, (err, data) => {
  if (err) return console.error(err);
  done(null , data);
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, data)=> {
    if (err) return console.error(err);
    done(null , data);
    })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, data) => {
    if (err) return console.error(err);
    done(null , data);
    })
};

const findPersonById = (personId, done) => {
  Person.findById({ _id: personId }, (err, data) => {
    if (err) return console.error(err);
    done(null , data);
    })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById({ _id: personId }, (err, person) => {
    if (err) return console.error(err);

    person.favoriteFoods.push(foodToAdd);

    person.save((err, updatedPerson) => {
      if (err) return console.error(err);
      done(null , updatedPerson);
    });
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, { new: true}, (err,updatedDoc)=> {
    if (err) return console.error(err);
      done(null , updatedDoc);
    });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove({_id : personId},  (err, removedDoc) => {
    if(err) return console.log(err);
    done(null, removedDoc);
  }
); 
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name : nameToRemove}, (err, data) => {
    if (err) return console.error(err);
    done(null , data);
    })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({favoriteFoods: foodToSearch})
  .sort({name: 1})
  .limit(2)
  .select({age : 0})
  .exec((err, people) => {
    if (err) return console.error(err);
    done(null , people);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
