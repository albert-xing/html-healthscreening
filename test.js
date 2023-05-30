class UserInput {
  constructor(age, sex, medicalHistory, race, lastScreeningYearsAgo, familyHistory, earliestDiagnosisAge, lastPapSmear, smoker, smokeYears) {
    this.age = age;
    this.sex = sex;
    this.medicalHistory = medicalHistory;
    this.race = race;
    this.lastScreeningYearsAgo = lastScreeningYearsAgo;
    this.familyHistory = familyHistory;
    this.earliestDiagnosisAge = earliestDiagnosisAge;
    this.lastPapSmear = lastPapSmear;
    this.smoker = smoker;
    this.smokeYears = smokeYears;
  }
}

function showAgeBox(value) {
  const ageBox = document.getElementById("ageBox");
  ageBox.style.display = (value === "yes") ? "block" : "none";
}

function showSmokeYearsBox(value) {
  const smokeYearsBox = document.getElementById("smokeYearsBox");
  smokeYearsBox.style.display = (value === "yes") ? "block" : "none";
}

function showPapSmearBox(value) {
  const papSmearBox = document.getElementById("papSmear");
  papSmearBox.style.display = (value === "Female") ? "block" : "none";
}

function showMammogramBox(value) {
  const mammogramBox = document.getElementById("mammogram");
  mammogramBox.style.display = (value === "Female") ? "block" : "none";
}

document.getElementById("sex").addEventListener("change", function() {
  showPapSmearBox(this.value);
  showMammogramBox(this.value);
});

function recommendScreenings(userInput) {
  const screeningDescriptors = {
    "Colonoscopy": "Colonoscopy is a procedure that examines the large intestine for abnormalities or signs of colorectal cancer.",
    "Mammogram": "A mammogram is an X-ray image of the breasts used to detect and diagnose breast diseases, including breast cancer.",
    "Lung Cancer Screening (annual)": "Lung cancer screening is a test that is performed annually to detect lung cancer at an early stage in individuals at high risk.",
    "Pap Smear": "A Pap smear is a screening test for cervical cancer that checks for the presence of abnormal cells in the cervix.",
    "Liver Ultrasound": "A liver ultrasound is a diagnostic imaging test that uses sound waves to create pictures of the liver and detect abnormalities.",
    "Colonoscopy starting at age": "Colonoscopy starting at a certain age is recommended for individuals with a family history of colon cancer to detect and prevent colorectal cancer.",
  };

  var screenings = [];

  
    if (userInput.familyHistory === "yes" && userInput.lastScreeningYearsAgo["Colonoscopy"] === "Never") {
      const screeningAge = userInput.earliestDiagnosisAge - 10;
      screenings.push({
        name: `Colonoscopy starting at age ${screeningAge}`,
        descriptor: screeningDescriptors["Colonoscopy starting at age"]
      });
    } else if (userInput.age >= 50 && userInput.age <=75) {
      if (userInput.lastScreeningYearsAgo["Colonoscopy"] === "Never" || userInput.lastScreeningYearsAgo["Colonoscopy"] >= 10) {
      screenings.push({
        name: "Colonoscopy",
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
        name: "Mammogram",
        descriptor: screeningDescriptors["Mammogram"]
      });
    } else if ((userInput.lastScreeningYearsAgo["Mammogram"] ?? 0) > 1) {
      screenings.push({
        name: "Mammogram",
        descriptor: screeningDescriptors["Mammogram"]
      });
    }
  }

  const smokeYears = parseInt(userInput.smokeYears);
  if (userInput.smoker === "yes" && smokeYears >= 20) {
    screenings.push({
      name: "Lung Cancer Screening (annual)",
      descriptor: screeningDescriptors["Lung Cancer Screening (annual)"]
    });
  }

  if (userInput.lastPapSmear >= 3 && userInput.age >= 21 && userInput.age <= 65) {
    screenings.push({
      name: "Pap Smear",
      descriptor: screeningDescriptors["Pap Smear"]
    });
  } else if (userInput.age >= 21 && userInput.age <=65 && userInput.lastPapSmear === "Never") {
    screenings.push({
      name: "Pap Smear",
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

  if (recommendedScreenings.length === 0) {
    recommendedScreeningsContainer.textContent = "No recommended screenings.";
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
  }
});
