let data = {
  "All Students": {
    count: 0,
    Students: {
      BE: {
        count: 0,
        Branches: {
            bcs: [],
            bit: [],
            bmc: [],
            bcb: [],
            etc: [],
            bei: [],
        },
      },
    },
  },
};
const struct = {
  "All Students": {
    count: 0,
    Students: {
      BE: {
        count: 0,
        Branches: {
            bcs: [],
            bit: [],
            bmc: [],
            bcb: [],
            etc: [],
            bei: [],
        },
      },
    },
  },
};
function determineFieldOfStudy(user) {
    const email = user.primaryEmail;
    const name = user.name.fullName;
   // console.log(inputString+ " "+ name);
  if (typeof email != "string") {
    return;
  }
  const lowercaseInput = email.toLowerCase();
  const fieldOfStudyMap = {
    bcs: "Computer Engineering",
    bit: "Information Technology",
    bmc: "Mechenical Engineering",
    bcb: "Civil Engineering",
    etc: "Electronics & Telecommunication Engineering",
    bei: "Electronics & Instrumentation Engineering",
  };
  // Check if the lowercaseInput is a key in the hashmap
  const branch = lowercaseInput.substring(2, 5);
  if (fieldOfStudyMap[branch]) {
    const year = lowercaseInput.substring(0, 2);
    const rollNumber = lowercaseInput.substring(5, 8);
    const degree = "BE";
    let section = "A";
    if (rollNumber[0] == "1") section = "B";
    const department = fieldOfStudyMap[branch];
    data["All Students"]["count"]++;
    data["All Students"]["Students"][degree]["count"]++;
    data["All Students"]["Students"][degree]["Branches"][branch].push({
      email,
      year,
      degree,
      department,
      section,
      rollNumber,
      name
    });
  } else {
    return "Field of study not recognized";
  }
}
function DataFetch(users) {
   // console.log(users);
  for (const user in users) {
    determineFieldOfStudy(users[user]);
  }
  const data2 = data;
  data  = struct;
  return data2;
}
module.exports = DataFetch;