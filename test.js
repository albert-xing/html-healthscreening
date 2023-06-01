class UserInput {
  constructor(age, sex, medicalHistory, race, lastScreeningYearsAgo, familyHistory, earliestDiagnosisAge, lastPapSmear, smoker, smokeYears) {
    this.age = age;
    this.sex = sex;
    this.medicalHistory = medicalHistory
    this.race = race;
    this.lastScreeningYearsAgo = lastScreeningYearsAgo;
    this.familyHistory = familyHistory;
    this.earliestDiagnosisAge = earliestDiagnosisAge;
    this.lastPapSmear = lastPapSmear;
    this.smoker = smoker;
    this.smokeYears = smokeYears;
  }
}


/* Show boxes based on age/sex */

function showAgeBox(value) {
  const ageBox = document.getElementById("ageBox");
  ageBox.style.display = (value === "yes") ? "block" : "none";
}

function showSmokeYearsBox(value) {
  const smokeYearsBox = document.getElementById("smokeYearsBox");
  smokeYearsBox.style.display = (value === "yes") ? "block" : "none";
}

function showPapSmearBox(age, sex) {
  const papSmearBox = document.getElementById("papSmear");
  papSmearBox.style.display = (age >= 21 && sex === "Female") ? "block" : "none";
}

function showMammogramBox(age, sex) {
  const mammogramBox = document.getElementById("mammogram");
  mammogramBox.style.display = (age >= 40 && sex === "Female") ? "block" : "none";
}

function showColonoscopyBox(value) {
  const colonoscopyBox = document.getElementById("colonoscopy");
  colonoscopyBox.style.display = (value >= 45) ? "block" : "none";
}

function handleAgeSexChange() {
  const age = parseInt(document.getElementById("age").value);
  const sex = document.getElementById("sex").value;
  showMammogramBox(age, sex);
  showPapSmearBox(age, sex);
}

document.getElementById("age").addEventListener("input", handleAgeSexChange);
document.getElementById("sex").addEventListener("change", handleAgeSexChange);
document.getElementById("age").addEventListener("change", function() {
  showColonoscopyBox(this.value);
});

/* Calculate Screenings */

function recommendScreenings(userInput) {
  const screeningDescriptors = {
    "Colonoscopy": "A colonoscopy or a CT colonography is recommended in individuals between 45 and 75, every 10 years",
    "Mammogram": "A mammogram is recommended in women between ages 40 and 74, every 2 years.",
    "Lung Cancer Screening (annual)": "An annual low-dose CT is recommended in adults 50 to 80 years old, who currently smoke or have quit within the past 15 years, and have a 20 pack year smoking history.",
    "Pap Smear": "A Pap smear is recommended for women older than 21, every 3 years. Women older than 30 may also require additional HPV testing.",
    "Liver Ultrasound": "For Asian-Americans with chronic hepatitis B, the AASLD recommends liver ultrasounds for Asian-American men older than 40, and Asian-American women older than 50.",
    "Colonoscopy starting at age": "Colon cancer screenings with a colonoscopy or CT colonography are recommended in individuals 10 years prior to the age of diagnosis of their first-degree relative.",
  };

  var screenings = [];

  
    if (userInput.familyHistory === "yes" && userInput.age <45) {
      const screeningAge = userInput.earliestDiagnosisAge - 10;
      if (screeningAge > 10) {
      screenings.push({
        name: `Colon Cancer screening starting at age ${screeningAge}`,
        descriptor: screeningDescriptors["Colonoscopy starting at age"]
      });
    }
    } else if (userInput.age >= 45 && userInput.age <=75) {
      if (userInput.lastScreeningYearsAgo["Colonoscopy"] === "Never" || userInput.lastScreeningYearsAgo["Colonoscopy"] >= 10) {
      screenings.push({
        name: "Colon Cancer Screening",
        descriptor: screeningDescriptors["Colonoscopy"]
      });
    } else if (userInput.familyHistory === "yes" && userInput.lastScreeningYearsAgo["Colonoscopy"] === "11") {
      const screeningAge = userInput.earliestDiagnosisAge;
      screenings.push({
        name: `Colonoscopy starting at age ${screeningAge}`,
        descriptor: screeningDescriptors["Colonoscopy starting at age"]
      });
    }
  }
  

  if (userInput.age >= 40 && userInput.age <=74 && userInput.sex === "Female") {
    if (userInput.lastScreeningYearsAgo["Mammogram"] === "Never") {
      screenings.push({
        name: "Breast Cancer Screening",
        descriptor: screeningDescriptors["Mammogram"]
      });
    } else if ((userInput.lastScreeningYearsAgo["Mammogram"] ?? 0) > 1) {
      screenings.push({
        name: "Breast Cancer Screening",
        descriptor: screeningDescriptors["Mammogram"]
      });
    }
  }

  const smokeYears = parseInt(userInput.smokeYears);
  if (userInput.smoker === "yes" && smokeYears >= 20 && userInput.age >=50 && userInput.age <=80) {
    screenings.push({
      name: "Lung Cancer Screening (annual)",
      descriptor: screeningDescriptors["Lung Cancer Screening (annual)"]
    });
  }

  if (userInput.lastPapSmear >= 3 && userInput.age >= 21 && userInput.age <= 65) {
    screenings.push({
      name: "Cervical Cancer Screen",
      descriptor: screeningDescriptors["Pap Smear"]
    });
  } else if (userInput.age >= 21 && userInput.age <=65 && userInput.lastPapSmear === "Never") {
    screenings.push({
      name: "Cervical Cancer Screen",
      descriptor: screeningDescriptors["Pap Smear"]
    });
  }


  if (userInput.medicalHistory.toLowerCase().includes("hepatitis b") && userInput.race === "Asian") {
    if (userInput.sex === "Male" && userInput.age >= 40) {
      screenings.push({
        name: "Liver Ultrasound",
        descriptor: screeningDescriptors["Liver Ultrasound"]
      });
    } else if (userInput.sex === "Female" && userInput.age >= 50) {
      screenings.push({
        name: "Liver Ultrasound",
        descriptor: screeningDescriptors["Liver Ultrasound"]
      });
    }
  }

  return screenings;
}

/* input constructor*/ 

document.getElementById("userInputForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const age = document.getElementById("age").value;
  const sex = document.getElementById("sex").value;
  const medicalHistory = document.getElementById("medicalHistory").value;
  const race = document.getElementById("race").value;
  const lastScreeningYearsAgo = {
    "Colonoscopy": document.getElementById("lastScreeningYearsAgoColonoscopy").value,
    "Mammogram": document.getElementById("lastScreeningYearsAgoMammogram").value,
  };
  const familyHistory = document.getElementById("familyHistory").value;
  const lastPapSmear = document.getElementById("lastPapSmear").value;
  const earliestDiagnosisAge = parseInt(document.getElementById("earliestDiagnosisAge").value);
  const smoker = document.getElementById("smoker").value;
  const smokeYears = document.getElementById("smokeYears").value;

  const userInput = new UserInput(age, sex, medicalHistory, race, lastScreeningYearsAgo, familyHistory, earliestDiagnosisAge, lastPapSmear, smoker, smokeYears);

  const recommendedScreenings = recommendScreenings(userInput);

  const recommendedScreeningsContainer = document.getElementById("recommendedScreenings");

  /* outputs recommended screening*/ 

  if (recommendedScreenings.length === 0) {
    recommendedScreeningsContainer.textContent = "No recommended screenings.";
    document.getElementById("badgecount").textContent = "0";
  } else {
    let screeningsHTML = "<ul>";
    for (const screeningObj of recommendedScreenings) {
      screeningsHTML += `<li class="list-group-item d-flex justify-content-between 1h-sm">
        <div><h6 class="my-0"><strong>${screeningObj.name}</strong><h6><br>
        <small class="text-body-secondary">${screeningObj.descriptor}</small><div>
        </li><br>`;
    }
    screeningsHTML += "</ul>";
    recommendedScreeningsContainer.innerHTML = screeningsHTML;

    const badge = document.querySelector(".badge.bg-primary.rounded-pill");
    badge.textContent = recommendedScreenings.length.toString(); 
  }

   window.scrollTo({ top: 0, behavior: 'smooth' });
});

