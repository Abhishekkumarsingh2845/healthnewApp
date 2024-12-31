// import { Realm } from "realm";

// // Define the Datesch class to store the startDate and endDate
// class Datesch extends Realm.Object {
//   startDate!: string; // Field to store the selected start date
//   endDate!: string;   // Field to store the selected end date

//   // Static schema for the Datesch object
//   static schema: Realm.ObjectSchema = {
//     name: "Datesch",
//     properties: {
//       startDate: { type: "string" }, // Define startDate as a string
//       endDate: { type: "string" },   // Define endDate as a string
//     },
//   };

//   // Method to store startDate and endDate in Realm
  
// }

// export default Datesch;


import { Realm } from "realm";

// Define the Datesch class to store the startDate, endDate, and button press state
class Datesch extends Realm.Object {
  startDate!: string; // Field to store the selected start date
  endDate!: string;   // Field to store the selected end date
  isButtonPressed!: boolean; // Field to track button press state

  // Static schema for the Datesch object
  static schema: Realm.ObjectSchema = {
    name: "Datesch",
    properties: {
      startDate: { type: "string" }, // Define startDate as a string
      endDate: { type: "string" },   // Define endDate as a string
      isButtonPressed: { type: "bool" ,optional:true}, // Define isButtonPressed as a boolean
    },
  };
}

export default Datesch;
