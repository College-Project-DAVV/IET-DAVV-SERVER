function DataFetch(users) {
  const data = [];
  for (const i in users) {
    const user = users[i];
    const email = user.primaryEmail;
    const name = user.name.fullName;
    const designation = user.orgUnitPath;
    if (typeof email != "string") {
    return;
   }
  const lowercaseInput = email.toLowerCase();
  const fieldOfStudyMap = {
    bcs: "Computer Engineering",
    bit: "Information Technology",
    bmc: "Mechenical Engineering",
    bcv: "Civil Engineering",
    btc: "Electronics & Telecommunication Engineering",
    bei: "Electronics & Instrumentation Engineering",
  };
  // Check if the lowercaseInput is a key in the hashmap
  if (designation==="/Student" && /^\d/.test(lowercaseInput)){
    const year = lowercaseInput.substring(0, 2);
    const branch = lowercaseInput.substring(2, 5);
    const rollNumber = lowercaseInput.substring(5, 8);
    let degree = lowercaseInput.substring(2,5);
    if(lowercaseInput.substring(2,3)==="b"){
      degree="BE";
    }
    let section = "A";
    if (rollNumber[0] == "1") section = "B";
    const department = fieldOfStudyMap[branch];
    data.push({designation:"Student",name,email,branch,rollNumber,degree,department,section,phone:user.recoveryPhone,secondaryEmail:user.recoveryEmail,year});
  }
  else {
    data.push({designation:designation.substring(1),name,email,phone:user.recoveryPhone,secondaryEmail:user.recoveryEmail});
  }

  }
  return data;
}
module.exports = DataFetch;