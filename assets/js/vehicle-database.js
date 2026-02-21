/**
 * ============================================
 * CARNAGE REMAPS - CENTRALIZED VEHICLE DATABASE
 * ============================================
 * Single source of truth for all vehicle data
 * Used by: Main upload form, Vehicle search, Embed widget
 * Last Updated: Synced from main.js export (2026-02-21)
 * ============================================
 */

const CarnageVehicleDB = {
  
  /**
   * VEHICLE MODELS DATABASE
   * Maps manufacturer to array of models
   */
    VEHICLE_DATABASE: {
  "audi": [
    "A1",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "Q2",
    "Q3",
    "Q5",
    "Q7",
    "Q8",
    "TT",
    "R8",
    "e-tron",
    "Q4 e-tron",
    "RS3",
    "RS4",
    "RS5",
    "RS6",
    "RS7",
    "RSQ8"
  ],
  "bmw": [
    "1 Series",
    "2 Series",
    "3 Series",
    "4 Series",
    "5 Series",
    "6 Series",
    "7 Series",
    "8 Series",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "Z4",
    "i3",
    "i4",
    "i8",
    "M2",
    "M3",
    "M4",
    "M5",
    "M8",
    "X3 M",
    "X4 M",
    "X5 M",
    "X6 M"
  ],
  "mercedes": [
    "A-Class",
    "B-Class",
    "C-Class",
    "E-Class",
    "S-Class",
    "CLA",
    "CLS",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLS",
    "G-Class",
    "SL",
    "SLC",
    "AMG GT",
    "EQC",
    "EQA",
    "EQB",
    "EQS",
    "EQE",
    "V-Class",
    "Vito",
    "Sprinter",
    "A35 AMG",
    "A45 AMG",
    "C43 AMG",
    "C63 AMG",
    "E43 AMG",
    "E63 AMG",
    "GLC43 AMG",
    "GLC63 AMG",
    "GLE43 AMG",
    "GLE63 AMG"
  ],
  "volkswagen": [
    "Polo",
    "Golf",
    "Jetta",
    "Passat",
    "Arteon",
    "T-Cross",
    "T-Roc",
    "Tiguan",
    "Touareg",
    "Caddy",
    "Transporter",
    "Crafter",
    "ID.3",
    "ID.4",
    "ID.5",
    "ID.Buzz",
    "Golf GTI",
    "Golf R",
    "Scirocco",
    "Beetle",
    "Sharan",
    "up!",
    "Amarok"
  ],
  "ford": [
    "Fiesta",
    "Focus",
    "Mondeo",
    "Mustang",
    "EcoSport",
    "Puma",
    "Kuga",
    "Edge",
    "Explorer",
    "Transit",
    "Transit Custom",
    "Ranger",
    "F-150",
    "S-Max",
    "Galaxy",
    "Tourneo",
    "Fiesta ST",
    "Focus ST",
    "Focus RS",
    "Mustang Mach-E",
    "Bronco"
  ],
  "vauxhall": [
    "Corsa",
    "Astra",
    "Insignia",
    "Mokka",
    "Crossland",
    "Grandland",
    "Combo",
    "Vivaro",
    "Movano",
    "Corsa-e",
    "Mokka-e",
    "Zafira",
    "Ampera",
    "Corsa VXR",
    "Astra VXR"
  ],
  "land-rover": [
    "Defender",
    "Discovery",
    "Discovery Sport",
    "Range Rover",
    "Range Rover Sport",
    "Range Rover Evoque",
    "Range Rover Velar",
    "Freelander",
    "Range Rover Autobiography",
    "Range Rover SVR"
  ],
  "nissan": [
    "Micra",
    "Note",
    "Pulsar",
    "Juke",
    "Qashqai",
    "X-Trail",
    "Leaf",
    "GT-R",
    "Navara",
    "NV200",
    "NV300",
    "NV400",
    "Ariya",
    "370Z",
    "350Z",
    "Patrol",
    "Pathfinder",
    "Primastar",
    "Interstar",
    "Pixo"
  ],
  "toyota": [
    "Aygo",
    "Yaris",
    "Corolla",
    "Prius",
    "Camry",
    "C-HR",
    "RAV4",
    "Highlander",
    "Land Cruiser",
    "Hilux",
    "Proace",
    "Avensis",
    "Auris",
    "Verso",
    "Supra",
    "GT86",
    "bZ4X",
    "Mirai",
    "Yaris GR"
  ],
  "peugeot": [
    "108",
    "208",
    "308",
    "508",
    "2008",
    "3008",
    "5008",
    "Rifter",
    "Partner",
    "Boxer",
    "e-208",
    "e-2008",
    "307",
    "407",
    "4007",
    "Expert",
    "208 GTi",
    "308 GTi",
    "RCZ"
  ],
  "renault": [
    "Twingo",
    "Clio",
    "Captur",
    "Megane",
    "Kadjar",
    "Koleos",
    "Scenic",
    "Kangoo",
    "Trafic",
    "Master",
    "Zoe",
    "Arkana",
    "Espace",
    "Laguna",
    "Fluence",
    "Wind",
    "Twizy",
    "Clio RS",
    "Megane RS"
  ],
  "citroen": [
    "C1",
    "C3",
    "C4",
    "C5",
    "C3 Aircross",
    "C5 Aircross",
    "Berlingo",
    "Dispatch",
    "Relay",
    "C5 X",
    "C4 Cactus",
    "C3 Picasso",
    "C4 Picasso",
    "C4 Grand Picasso",
    "Nemo",
    "Jumpy",
    "e-Berlingo",
    "e-C4"
  ],
  "seat": [
    "Ibiza",
    "Leon",
    "Arona",
    "Ateca",
    "Tarraco",
    "Alhambra",
    "Mii",
    "Toledo",
    "Leon Cupra",
    "Ibiza Cupra",
    "Exeo"
  ],
  "skoda": [
    "Fabia",
    "Scala",
    "Octavia",
    "Superb",
    "Kamiq",
    "Karoq",
    "Kodiaq",
    "Enyaq iV",
    "Citigo",
    "Rapid",
    "Yeti",
    "Roomster",
    "Octavia vRS",
    "Superb Scout"
  ],
  "volvo": [
    "S60",
    "S90",
    "V40",
    "V60",
    "V90",
    "XC40",
    "XC60",
    "XC90",
    "C30",
    "C40",
    "C70",
    "V50",
    "V70",
    "S40",
    "S80",
    "XC70",
    "XC40 Recharge",
    "C40 Recharge"
  ],
  "mazda": [
    "Mazda2",
    "Mazda3",
    "Mazda6",
    "CX-3",
    "CX-30",
    "CX-5",
    "CX-60",
    "MX-5",
    "CX-7",
    "CX-9",
    "RX-8",
    "MX-30",
    "Bongo"
  ],
  "honda": [
    "Jazz",
    "Civic",
    "Accord",
    "CR-V",
    "HR-V",
    "e",
    "Civic Type R",
    "NSX",
    "Insight",
    "Legend",
    "FR-V",
    "Stream",
    "CR-Z",
    "S2000",
    "ZR-V"
  ],
  "hyundai": [
    "i10",
    "i20",
    "i30",
    "i40",
    "Kona",
    "Tucson",
    "Santa Fe",
    "Ioniq",
    "Ioniq 5",
    "Ioniq 6",
    "ix35",
    "ix20",
    "Veloster",
    "Genesis",
    "i30 N",
    "Kona N",
    "Bayon",
    "Palisade",
    "Nexo"
  ],
  "kia": [
    "Picanto",
    "Rio",
    "Ceed",
    "Stonic",
    "Niro",
    "Sportage",
    "Sorento",
    "EV6",
    "XCeed",
    "ProCeed",
    "Venga",
    "Soul",
    "Optima",
    "Stinger",
    "EV9",
    "Carnival",
    "Ceed GT"
  ],
  "fiat": [
    "500",
    "Panda",
    "Tipo",
    "500X",
    "500L",
    "Ducato",
    "Doblo",
    "Punto",
    "Bravo",
    "Qubo",
    "Fiorino",
    "Talento",
    "500e",
    "600e"
  ],
  "alfa-romeo": [
    "Mito",
    "Giulietta",
    "Giulia",
    "Stelvio",
    "Tonale",
    "159",
    "Brera",
    "Spider",
    "GT",
    "147",
    "156",
    "Giulia Quadrifoglio",
    "Stelvio Quadrifoglio"
  ],
  "jeep": [
    "Renegade",
    "Compass",
    "Cherokee",
    "Grand Cherokee",
    "Wrangler",
    "Gladiator",
    "Avenger",
    "Commander",
    "Liberty",
    "Patriot"
  ],
  "mini": [
    "Hatch",
    "Clubman",
    "Countryman",
    "Convertible",
    "Paceman",
    "Coupe",
    "Roadster",
    "JCW",
    "John Cooper Works GP",
    "Cooper S",
    "Electric",
    "Aceman"
  ],
  "porsche": [
    "718 Cayman",
    "718 Boxster",
    "911",
    "Panamera",
    "Macan",
    "Cayenne",
    "Taycan",
    "911 Turbo",
    "911 GT3",
    "Carrera",
    "Cayman GT4",
    "Boxster Spyder"
  ],
  "lexus": [
    "CT",
    "IS",
    "ES",
    "GS",
    "LS",
    "UX",
    "NX",
    "RX",
    "LC",
    "LX",
    "RC",
    "RC F",
    "GS F",
    "IS F",
    "LFA"
  ],
  "jaguar": [
    "XE",
    "XF",
    "XJ",
    "F-Type",
    "E-Pace",
    "F-Pace",
    "I-Pace",
    "X-Type",
    "S-Type",
    "XK",
    "XFR",
    "XKR",
    "F-Type R",
    "F-Pace SVR"
  ],
  "dacia": [
    "Sandero",
    "Logan",
    "Duster",
    "Jogger",
    "Spring",
    "Dokker",
    "Lodgy"
  ],
  "suzuki": [
    "Ignis",
    "Swift",
    "Baleno",
    "Vitara",
    "S-Cross",
    "Jimny",
    "Celerio",
    "SX4",
    "Grand Vitara",
    "Splash",
    "Alto",
    "Swift Sport"
  ],
  "subaru": [
    "Impreza",
    "Legacy",
    "Outback",
    "Forester",
    "XV",
    "BRZ",
    "Levorg",
    "WRX",
    "WRX STI",
    "Tribeca",
    "Solterra"
  ],
  "mitsubishi": [
    "Mirage",
    "Eclipse Cross",
    "Outlander",
    "ASX",
    "L200",
    "Colt",
    "Lancer",
    "Shogun",
    "Pajero",
    "Space Star",
    "Outlander PHEV"
  ],
  "tesla": [
    "Model 3",
    "Model S",
    "Model X",
    "Model Y",
    "Roadster",
    "Cybertruck"
  ],
  "bentley": [
    "Continental GT",
    "Flying Spur",
    "Bentayga",
    "Mulsanne",
    "Continental GTC"
  ],
  "maserati": [
    "Ghibli",
    "Quattroporte",
    "Levante",
    "MC20",
    "GranTurismo",
    "GranCabrio",
    "Grecale"
  ],
  "abarth": [
    "595",
    "695",
    "500e",
    "124 Spider",
    "Grande Punto",
    "Punto Evo"
  ],
  "ds": [
    "DS 3",
    "DS 4",
    "DS 7",
    "DS 9",
    "DS 3 Crossback",
    "DS 5"
  ],
  "smart": [
    "Fortwo",
    "Forfour",
    "EQ",
    "Roadster",
    "#1",
    "#3"
  ],
  "ssangyong": [
    "Tivoli",
    "Korando",
    "Rexton",
    "Musso",
    "Rodius",
    "Kyron",
    "Actyon"
  ],
  "infiniti": [
    "Q30",
    "Q50",
    "Q60",
    "QX30",
    "QX50",
    "QX70",
    "Q70",
    "QX80",
    "FX",
    "G"
  ],
  "iveco": [
    "Daily",
    "Eurocargo",
    "Stralis",
    "S-Way",
    "Trakker",
    "X-Way"
  ],
  "dodge": [
    "Challenger",
    "Charger",
    "Durango",
    "Ram 1500",
    "Ram 2500",
    "Ram 3500",
    "Journey",
    "Grand Caravan",
    "Viper",
    "Nitro"
  ],
  "chevrolet": [
    "Spark",
    "Cruze",
    "Malibu",
    "Camaro",
    "Corvette",
    "Equinox",
    "Traverse",
    "Silverado",
    "Tahoe",
    "Suburban",
    "Colorado",
    "Trax",
    "Blazer",
    "Volt",
    "Bolt"
  ],
  "chrysler": [
    "300",
    "Pacifica",
    "Voyager",
    "Sebring",
    "PT Cruiser",
    "Grand Voyager"
  ],
  "opel": [
    "Corsa",
    "Astra",
    "Insignia",
    "Mokka",
    "Crossland",
    "Grandland",
    "Combo",
    "Vivaro",
    "Movano",
    "Meriva",
    "Antara",
    "Agila",
    "Adam",
    "Karl",
    "Cascada"
  ],
  "mg": [
    "MG3",
    "MG4",
    "MG5",
    "HS",
    "ZS",
    "ZS EV",
    "MG4 EV",
    "Marvel R",
    "MG TF",
    "MG ZT"
  ],
  "cupra": [
    "Formentor",
    "Leon",
    "Ateca",
    "Born",
    "Tavascan"
  ],
  "genesis": [
    "G70",
    "G80",
    "G90",
    "GV60",
    "GV70",
    "GV80"
  ],
  "polestar": [
    "Polestar 1",
    "Polestar 2",
    "Polestar 3",
    "Polestar 4"
  ],
  "lotus": [
    "Elise",
    "Exige",
    "Evora",
    "Emira",
    "Eletre"
  ],
  "aston-martin": [
    "Vantage",
    "DB11",
    "DBS",
    "DBX",
    "Rapide"
  ],
  "mclaren": [
    "540C",
    "570S",
    "720S",
    "765LT",
    "GT",
    "Artura"
  ],
  "ferrari": [
    "488",
    "F8 Tributo",
    "SF90",
    "Roma",
    "Portofino",
    "812 Superfast",
    "Purosangue"
  ],
  "lamborghini": [
    "Huracan",
    "Aventador",
    "Urus"
  ],
  "rolls-royce": [
    "Ghost",
    "Wraith",
    "Dawn",
    "Phantom",
    "Cullinan",
    "Spectre"
  ],
  "bugatti": [
    "Chiron",
    "Veyron",
    "Divo"
  ],
  "gmc": [
    "Sierra",
    "Canyon",
    "Yukon",
    "Terrain",
    "Acadia"
  ],
  "cadillac": [
    "CT4",
    "CT5",
    "CT6",
    "XT4",
    "XT5",
    "XT6",
    "Escalade",
    "Lyriq"
  ],
  "buick": [
    "Encore",
    "Envision",
    "Enclave",
    "Regal"
  ],
  "lincoln": [
    "Corsair",
    "Nautilus",
    "Aviator",
    "Navigator"
  ],
  "ram": [
    "1500",
    "2500",
    "3500",
    "ProMaster"
  ],
  "hummer": [
    "EV",
    "H2",
    "H3"
  ],
  "saab": [
    "9-3",
    "9-5"
  ],
  "lancia": [
    "Ypsilon",
    "Delta",
    "Musa",
    "Thema"
  ],
  "alpine": [
    "A110"
  ],
  "greatwall": [
    "Steed",
    "Voleex C10"
  ],
  "proton": [
    "Persona",
    "Saga",
    "Exora",
    "Preve"
  ],
  "perodua": [
    "Myvi",
    "Axia",
    "Bezza",
    "Aruz"
  ]
},

  /**
   * MANUFACTURER ENGINES DATABASE
   * Generic engines available per manufacturer
   */
    MANUFACTURER_ENGINES: {
  "audi": [
    "1.6 TDI - 90hp",
    "1.6 TDI - 95hp",
    "1.6 TDI - 105hp",
    "1.6 TDI - 116hp",
    "2.0 TDI - 136hp",
    "2.0 TDI - 140hp",
    "2.0 TDI - 143hp",
    "2.0 TDI - 150hp",
    "2.0 TDI - 170hp",
    "2.0 TDI - 190hp",
    "2.0 TDI - 200hp",
    "2.0 TDI - 204hp",
    "3.0 TDI - 204hp",
    "3.0 TDI - 218hp",
    "3.0 TDI - 231hp",
    "3.0 TDI - 272hp",
    "1.0 TFSI - 82hp",
    "1.0 TFSI - 95hp",
    "1.0 TFSI - 110hp",
    "1.0 TFSI - 115hp",
    "1.0 TFSI - 116hp",
    "1.2 TFSI - 86hp",
    "1.4 TFSI - 122hp",
    "1.4 TFSI - 125hp",
    "1.4 TFSI - 140hp",
    "1.4 TFSI - 150hp",
    "1.5 TFSI - 150hp",
    "1.8 T - 150hp",
    "1.8 T - 163hp",
    "1.8 T - 180hp",
    "1.8 TFSI - 160hp",
    "1.8 TFSI - 170hp",
    "1.8 TFSI - 180hp",
    "1.8 TFSI - 192hp",
    "2.0 TFSI - 190hp",
    "2.0 TFSI - 200hp",
    "2.0 TFSI - 245hp",
    "2.0 TFSI - 300hp",
    "2.5 TFSI - 400hp",
    "3.0 TFSI - 340hp",
    "3.0 V6 - 220hp"
  ],
  "volkswagen": [
    "1.6 TDI - 105hp",
    "1.6 TDI - 116hp",
    "2.0 TDI - 136hp",
    "2.0 TDI - 140hp",
    "2.0 TDI - 150hp",
    "2.0 TDI - 184hp",
    "2.0 TDI - 190hp",
    "3.0 TDI - 204hp",
    "3.0 TDI - 286hp",
    "1.0 TSI - 95hp",
    "1.0 TSI - 115hp",
    "1.4 TSI - 125hp",
    "1.4 TSI - 150hp",
    "1.5 TSI - 130hp",
    "1.5 TSI - 150hp",
    "1.8 T - 150hp",
    "1.8 T - 180hp",
    "1.8 TSI - 160hp",
    "1.8 TSI - 180hp",
    "2.0 TSI - 190hp",
    "2.0 TSI - 245hp",
    "2.0 TSI - 300hp"
  ],
  "seat": [
    "1.6 TDI - 105hp",
    "1.6 TDI - 116hp",
    "2.0 TDI - 143hp",
    "2.0 TDI - 150hp",
    "2.0 TDI - 184hp",
    "1.0 TSI - 95hp",
    "1.0 TSI - 115hp",
    "1.4 TSI - 125hp",
    "1.4 TSI - 150hp",
    "1.5 TSI - 130hp",
    "1.5 TSI - 150hp",
    "1.8 T - 150hp",
    "1.8 T - 180hp",
    "1.8 TSI - 160hp",
    "1.8 TSI - 180hp",
    "2.0 TSI - 190hp",
    "2.0 TSI - 245hp",
    "2.0 TSI - 300hp"
  ],
  "skoda": [
    "1.6 TDI - 105hp",
    "1.6 TDI - 116hp",
    "2.0 TDI - 143hp",
    "2.0 TDI - 150hp",
    "2.0 TDI - 200hp",
    "1.0 TSI - 95hp",
    "1.0 TSI - 110hp",
    "1.4 TSI - 125hp",
    "1.4 TSI - 150hp",
    "1.5 TSI - 150hp",
    "1.8 T - 150hp",
    "1.8 T - 180hp",
    "1.8 TSI - 160hp",
    "1.8 TSI - 180hp",
    "2.0 TSI - 190hp",
    "2.0 TSI - 245hp"
  ],
  "fiat": [
    "1.3 MultiJet - 75hp",
    "1.3 MultiJet - 95hp",
    "1.6 MultiJet - 105hp",
    "1.6 MultiJet - 120hp",
    "2.0 MultiJet - 140hp",
    "2.0 MultiJet - 170hp",
    "0.9 TwinAir - 85hp",
    "1.0 FireFly - 70hp",
    "1.0 FireFly - 100hp",
    "1.4 MultiAir - 95hp",
    "1.4 MultiAir - 120hp",
    "1.4 T-Jet - 120hp",
    "1.4 T-Jet - 150hp",
    "1.6 MultiJet II - 120hp",
    "2.0 MultiJet II - 170hp"
  ],
  "alfa-romeo": [
    "1.3 JTDm - 95hp",
    "1.6 JTDm - 105hp",
    "1.6 JTDm - 120hp",
    "2.0 JTDm - 136hp",
    "2.0 JTDm - 150hp",
    "2.0 JTDm - 180hp",
    "2.2 JTD - 136hp",
    "2.2 JTD - 150hp",
    "2.2 JTD - 180hp",
    "1.4 TB MultiAir - 120hp",
    "1.4 TB MultiAir - 140hp",
    "1.4 TB MultiAir - 170hp",
    "1.8 TBi - 200hp",
    "2.0 TB - 200hp",
    "2.0 TB - 280hp",
    "2.9 V6 Bi-Turbo - 510hp"
  ],
  "bmw": [
    "1.6d - 116hp",
    "2.0d - 150hp",
    "2.0d - 163hp",
    "2.0d - 190hp",
    "2.0d - 204hp",
    "3.0d - 218hp",
    "3.0d - 249hp",
    "3.0d - 265hp",
    "3.0d - 286hp",
    "1.5i - 136hp",
    "2.0i - 184hp",
    "2.0i - 252hp",
    "3.0i - 258hp",
    "3.0i - 340hp",
    "3.0i - 374hp",
    "4.4 V8 - 530hp"
  ],
  "mercedes": [
    "1.5 CDI - 116hp",
    "1.6 CDI - 136hp",
    "2.0 CDI - 136hp",
    "2.0 CDI - 163hp",
    "2.0 CDI - 190hp",
    "2.1 CDI - 136hp",
    "2.1 CDI - 170hp",
    "2.2 CDI - 170hp",
    "3.0 CDI - 204hp",
    "3.0 CDI - 231hp",
    "3.0 CDI - 258hp",
    "1.3 - 136hp",
    "1.5 - 156hp",
    "1.6 - 122hp",
    "2.0 - 184hp",
    "2.0 - 211hp",
    "2.0 - 258hp",
    "3.0 V6 - 367hp"
  ],
  "ford": [
    "1.5 TDCi - 95hp",
    "1.5 TDCi - 120hp",
    "1.6 TDCi - 95hp",
    "1.6 TDCi - 115hp",
    "2.0 TDCi - 150hp",
    "2.0 TDCi - 170hp",
    "2.0 TDCi - 185hp",
    "2.0 Bi-Turbo - 213hp",
    "1.0 EcoBoost - 100hp",
    "1.0 EcoBoost - 125hp",
    "1.0 EcoBoost - 140hp",
    "1.5 EcoBoost - 150hp",
    "1.5 EcoBoost - 182hp",
    "2.0 EcoBoost - 245hp",
    "2.3 EcoBoost - 280hp",
    "2.7 EcoBoost V6 - 325hp"
  ],
  "vauxhall": [
    "1.5 Turbo D - 102hp",
    "1.5 Turbo D - 120hp",
    "1.6 CDTI - 110hp",
    "1.6 CDTI - 136hp",
    "2.0 CDTI - 170hp",
    "1.0 Turbo - 105hp",
    "1.2 Turbo - 110hp",
    "1.2 Turbo - 130hp",
    "1.4 Turbo - 125hp",
    "1.4 Turbo - 145hp",
    "1.6 Turbo - 200hp",
    "2.0 Turbo - 230hp"
  ],
  "land-rover": [
    "2.0 D - 163hp",
    "2.0 D - 180hp",
    "2.0 D - 204hp",
    "2.0 D - 240hp",
    "3.0 D - 249hp",
    "3.0 D - 300hp",
    "2.0 P - 200hp",
    "2.0 P - 249hp",
    "2.0 P - 300hp",
    "3.0 P - 360hp",
    "3.0 P - 400hp",
    "5.0 V8 - 525hp"
  ],
  "peugeot": [
    "1.5 BlueHDi - 100hp",
    "1.5 BlueHDi - 130hp",
    "1.6 BlueHDi - 100hp",
    "1.6 BlueHDi - 120hp",
    "2.0 BlueHDi - 150hp",
    "2.0 BlueHDi - 180hp",
    "1.2 PureTech - 100hp",
    "1.2 PureTech - 110hp",
    "1.2 PureTech - 130hp",
    "1.6 PureTech - 165hp",
    "1.6 PureTech - 180hp"
  ],
  "renault": [
    "1.5 dCi - 75hp",
    "1.5 dCi - 85hp",
    "1.5 dCi - 90hp",
    "1.5 dCi - 95hp",
    "1.5 dCi - 110hp",
    "1.5 Blue dCi - 115hp",
    "1.6 dCi - 130hp",
    "1.7 Blue dCi - 150hp",
    "2.0 dCi - 150hp",
    "2.0 dCi - 160hp",
    "0.9 TCe - 90hp",
    "1.0 SCe - 65hp",
    "1.0 SCe - 75hp",
    "1.0 TCe - 90hp",
    "1.0 TCe - 100hp",
    "1.2 - 58hp",
    "1.2 - 75hp",
    "1.2 TCe - 115hp",
    "1.2 TCe - 120hp",
    "1.3 TCe - 130hp",
    "1.3 TCe - 140hp",
    "1.3 TCe - 155hp",
    "1.3 TCe - 160hp",
    "1.6 TCe - 165hp",
    "1.6 TCe - 190hp",
    "1.8 TCe - 280hp"
  ],
  "citroen": [
    "1.5 BlueHDi - 100hp",
    "1.5 BlueHDi - 130hp",
    "1.6 BlueHDi - 100hp",
    "1.6 BlueHDi - 120hp",
    "2.0 BlueHDi - 150hp",
    "2.0 BlueHDi - 180hp",
    "1.2 PureTech - 82hp",
    "1.2 PureTech - 110hp",
    "1.2 PureTech - 130hp",
    "1.6 PureTech - 165hp"
  ],
  "nissan": [
    "1.5 dCi - 90hp",
    "1.5 dCi - 110hp",
    "1.6 dCi - 130hp",
    "2.0 dCi - 150hp",
    "2.0 dCi - 177hp",
    "0.9 IG-T - 90hp",
    "1.0 DIG-T - 100hp",
    "1.2 DIG-T - 115hp",
    "1.3 DIG-T - 140hp",
    "1.3 DIG-T - 160hp",
    "1.6 DIG-T - 163hp",
    "2.0 - 144hp"
  ],
  "toyota": [
    "1.4 D-4D - 90hp",
    "1.6 D-4D - 112hp",
    "2.0 D-4D - 116hp",
    "2.0 D-4D - 143hp",
    "2.2 D-4D - 150hp",
    "2.2 D-4D - 177hp",
    "1.0 VVT-i - 72hp",
    "1.2 Turbo - 116hp",
    "1.5 VVT-i - 111hp",
    "1.8 VVT-i - 140hp",
    "2.0 VVT-i - 152hp",
    "2.5 Hybrid - 184hp",
    "3.5 V6 - 299hp"
  ],
  "honda": [
    "1.6 i-DTEC - 120hp",
    "2.2 i-DTEC - 150hp",
    "2.2 i-DTEC - 160hp",
    "1.0 VTEC Turbo - 129hp",
    "1.5 VTEC Turbo - 182hp",
    "1.5 i-VTEC - 130hp",
    "1.8 i-VTEC - 142hp",
    "2.0 i-VTEC - 158hp",
    "2.0 VTEC Turbo - 320hp"
  ],
  "mazda": [
    "1.5 SKYACTIV-D - 105hp",
    "1.8 SKYACTIV-D - 116hp",
    "2.2 SKYACTIV-D - 150hp",
    "2.2 SKYACTIV-D - 184hp",
    "1.5 SKYACTIV-G - 90hp",
    "1.5 SKYACTIV-G - 120hp",
    "2.0 SKYACTIV-G - 122hp",
    "2.0 SKYACTIV-G - 165hp",
    "2.5 SKYACTIV-G - 194hp"
  ],
  "hyundai": [
    "1.5 CRDi - 110hp",
    "1.6 CRDi - 115hp",
    "1.6 CRDi - 136hp",
    "2.0 CRDi - 185hp",
    "1.0 T-GDi - 100hp",
    "1.0 T-GDi - 120hp",
    "1.4 T-GDi - 140hp",
    "1.6 T-GDi - 177hp",
    "1.6 T-GDi - 204hp",
    "2.0 T-GDi - 245hp"
  ],
  "kia": [
    "1.5 CRDi - 110hp",
    "1.6 CRDi - 115hp",
    "1.6 CRDi - 136hp",
    "2.0 CRDi - 185hp",
    "1.0 T-GDi - 100hp",
    "1.0 T-GDi - 120hp",
    "1.4 T-GDi - 140hp",
    "1.6 T-GDi - 177hp",
    "1.6 T-GDi - 204hp",
    "2.0 T-GDi - 245hp"
  ],
  "porsche": [
    "3.0 Diesel - 245hp",
    "3.0 Diesel - 262hp",
    "4.0 Diesel - 421hp",
    "2.0 - 300hp",
    "2.5 - 365hp",
    "3.0 - 340hp",
    "3.0 - 385hp",
    "3.0 - 450hp",
    "4.0 - 500hp",
    "4.0 - 550hp"
  ],
  "jaguar": [
    "2.0 D - 163hp",
    "2.0 D - 180hp",
    "2.0 D - 204hp",
    "3.0 D - 300hp",
    "2.0 P - 200hp",
    "2.0 P - 250hp",
    "2.0 P - 300hp",
    "3.0 P - 340hp",
    "3.0 P - 380hp",
    "5.0 V8 - 575hp"
  ],
  "volvo": [
    "2.0 D3 - 150hp",
    "2.0 D4 - 190hp",
    "2.0 D5 - 235hp",
    "2.0 T4 - 190hp",
    "2.0 T5 - 250hp",
    "2.0 T6 - 310hp",
    "2.0 T8 Hybrid - 390hp"
  ]
},

  /**
   * GENERIC ENGINES FALLBACK
   * Used when manufacturer-specific engines not available
   */
    GENERIC_ENGINES: [
  "1.0 - 70hp",
  "1.2 - 80hp",
  "1.4 - 90hp",
  "1.5 - 100hp",
  "1.6 - 110hp",
  "1.8 - 140hp",
  "2.0 - 150hp",
  "2.0 - 180hp",
  "2.2 - 150hp",
  "2.5 - 200hp",
  "3.0 - 250hp"
],

  /**
   * YEAR-SPECIFIC ENGINE DATABASE
   * Most detailed data - specific engines per model and year range
   */
    VEHICLE_ENGINE_DATABASE: {
  "audi": {
    "a3": {
      "2003-2005": [
        "1.6 - 102hp",
        "2.0 FSI - 150hp",
        "3.2 V6 - 250hp",
        "1.9 TDI - 105hp",
        "2.0 TDI - 140hp"
      ],
      "2006-2008": [
        "1.6 - 102hp",
        "2.0 FSI - 150hp",
        "2.0 TFSI - 200hp",
        "1.9 TDI - 105hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 170hp"
      ],
      "2009-2012": [
        "1.2 TFSI - 105hp",
        "1.4 TFSI - 125hp",
        "1.8 TFSI - 160hp",
        "2.0 TFSI - 200hp",
        "1.6 TDI - 105hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 170hp"
      ],
      "2013-2016": [
        "1.0 TFSI - 115hp",
        "1.4 TFSI - 125hp",
        "1.4 TFSI - 150hp",
        "1.8 TFSI - 180hp",
        "2.0 TFSI - 190hp",
        "1.6 TDI - 110hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 184hp"
      ],
      "2017-2020": [
        "1.0 TFSI - 116hp",
        "1.5 TFSI - 150hp",
        "2.0 TFSI - 190hp",
        "2.0 TFSI - 310hp",
        "1.6 TDI - 116hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 184hp"
      ],
      "2021-2024": [
        "1.5 TFSI - 150hp",
        "2.0 TFSI - 190hp",
        "2.0 TFSI - 310hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 200hp"
      ],
      "2025-2026": [
        "1.5 TFSI Mild Hybrid - 150hp",
        "2.0 TFSI Mild Hybrid - 204hp",
        "2.0 TFSI - 333hp",
        "2.0 TDI Mild Hybrid - 150hp",
        "2.0 TFSI e PHEV - 272hp"
      ]
    },
    "a4": {
      "1995-2000": [
        "1.6 - 100hp",
        "1.8 - 125hp",
        "1.8 T - 150hp",
        "1.8 T - 180hp",
        "2.4 V6 - 165hp",
        "2.6 V6 - 150hp",
        "2.8 V6 - 193hp",
        "1.9 TDI - 75hp",
        "1.9 TDI - 90hp",
        "1.9 TDI - 110hp",
        "1.9 TDI - 116hp",
        "2.5 TDI - 150hp"
      ],
      "2001-2004": [
        "1.8 T - 163hp",
        "2.0 - 130hp",
        "3.0 V6 - 220hp",
        "1.9 TDI - 130hp",
        "2.5 TDI - 155hp"
      ],
      "2005-2008": [
        "1.8 T - 163hp",
        "2.0 - 130hp",
        "3.0 V6 - 220hp",
        "1.9 TDI - 116hp",
        "2.0 TDI - 140hp",
        "2.7 TDI - 180hp",
        "3.0 TDI - 204hp"
      ],
      "2009-2012": [
        "1.8 TFSI - 120hp",
        "1.8 TFSI - 160hp",
        "2.0 TFSI - 180hp",
        "2.0 TFSI - 211hp",
        "3.2 FSI - 265hp",
        "2.0 TDI - 143hp",
        "2.0 TDI - 170hp",
        "2.7 TDI - 190hp",
        "3.0 TDI - 240hp"
      ],
      "2013-2016": [
        "1.8 TFSI - 170hp",
        "2.0 TFSI - 225hp",
        "2.0 TFSI - 252hp",
        "3.0 TFSI - 272hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 190hp",
        "3.0 TDI - 218hp",
        "3.0 TDI - 272hp"
      ],
      "2017-2019": [
        "1.4 TFSI - 150hp",
        "2.0 TFSI - 190hp",
        "2.0 TFSI - 252hp",
        "3.0 TFSI - 354hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 190hp",
        "3.0 TDI - 218hp",
        "3.0 TDI - 286hp"
      ],
      "2020-2024": [
        "2.0 TFSI - 204hp",
        "2.0 TFSI - 265hp",
        "3.0 TFSI - 340hp",
        "2.0 TDI - 163hp",
        "2.0 TDI - 204hp",
        "3.0 TDI - 231hp"
      ],
      "2025-2026": [
        "2.0 TFSI Mild Hybrid - 204hp",
        "2.0 TFSI Mild Hybrid - 272hp",
        "3.0 TFSI Mild Hybrid - 367hp",
        "2.0 TDI Mild Hybrid - 204hp",
        "2.0 TFSI e PHEV - 299hp"
      ]
    },
    "a6": {
      "1997-2004": [
        "1.8 - 125hp",
        "1.8 T - 150hp",
        "1.8 T - 180hp",
        "2.0 - 130hp",
        "2.4 - 165hp",
        "2.4 - 170hp",
        "2.7 T - 230hp",
        "2.7 T - 250hp",
        "2.8 - 193hp",
        "3.0 - 220hp",
        "4.2 V8 - 300hp",
        "1.9 TDI - 110hp",
        "1.9 TDI - 115hp",
        "1.9 TDI - 130hp",
        "2.5 TDI - 150hp",
        "2.5 TDI - 155hp",
        "2.5 TDI - 180hp"
      ],
      "2004-2008": [
        "2.0 TFSI - 170hp",
        "2.4 - 177hp",
        "3.0 - 218hp",
        "3.0 TFSI - 290hp",
        "3.2 FSI - 255hp",
        "4.2 FSI - 335hp",
        "5.2 FSI V10 - 435hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 170hp",
        "2.7 TDI - 180hp",
        "3.0 TDI - 211hp",
        "3.0 TDI - 225hp",
        "3.0 TDI - 233hp"
      ],
      "2009-2011": [
        "1.8 TFSI - 170hp",
        "2.0 TFSI - 180hp",
        "2.8 FSI - 220hp",
        "3.0 TFSI - 300hp",
        "4.2 FSI - 350hp",
        "2.0 TDI - 136hp",
        "2.0 TDI - 170hp",
        "2.7 TDI - 190hp",
        "3.0 TDI - 240hp",
        "3.0 TDI - 245hp"
      ],
      "2012-2014": [
        "1.8 TFSI - 190hp",
        "2.0 TFSI - 180hp",
        "2.0 TFSI - 211hp",
        "2.0 TFSI - 252hp",
        "3.0 TFSI - 310hp",
        "4.0 TFSI - 420hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 177hp",
        "2.0 TDI - 190hp",
        "3.0 TDI - 204hp",
        "3.0 TDI - 245hp",
        "3.0 TDI - 313hp"
      ],
      "2015-2018": [
        "1.8 TFSI - 190hp",
        "2.0 TFSI - 252hp",
        "3.0 TFSI - 333hp",
        "4.0 TFSI - 450hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 190hp",
        "3.0 TDI - 218hp",
        "3.0 TDI - 272hp",
        "3.0 TDI - 320hp"
      ],
      "2019-2024": [
        "2.0 TFSI - 204hp",
        "2.0 TFSI - 245hp",
        "3.0 TFSI - 340hp",
        "4.0 TFSI - 460hp",
        "2.0 TDI - 163hp",
        "2.0 TDI - 204hp",
        "3.0 TDI - 231hp",
        "3.0 TDI - 286hp"
      ]
    },
    "q3": {
      "2012-2014": [
        "1.4 TFSI - 150hp",
        "2.0 TFSI - 170hp",
        "2.0 TFSI - 211hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 177hp"
      ],
      "2015-2018": [
        "1.4 TFSI - 150hp",
        "2.0 TFSI - 180hp",
        "2.0 TFSI - 220hp",
        "2.5 TFSI RS - 340hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 184hp"
      ],
      "2019-2024": [
        "1.5 TFSI - 150hp",
        "2.0 TFSI - 190hp",
        "2.5 TFSI RS - 400hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 190hp"
      ],
      "2025-2026": [
        "1.5 TFSI Mild Hybrid - 150hp",
        "2.0 TFSI Mild Hybrid - 204hp",
        "2.5 TFSI RS - 400hp",
        "2.0 TDI Mild Hybrid - 150hp",
        "2.0 TFSI e PHEV - 272hp"
      ]
    },
    "q5": {
      "2009-2012": [
        "2.0 TFSI - 211hp",
        "3.0 TFSI - 272hp",
        "3.2 FSI - 270hp",
        "2.0 TDI - 143hp",
        "2.0 TDI - 170hp",
        "3.0 TDI - 240hp"
      ],
      "2013-2016": [
        "2.0 TFSI - 220hp",
        "2.0 TFSI - 230hp",
        "3.0 TFSI - 272hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 190hp",
        "3.0 TDI - 258hp"
      ],
      "2017-2024": [
        "2.0 TFSI - 252hp",
        "3.0 TFSI - 354hp",
        "2.0 TDI - 190hp",
        "3.0 TDI - 286hp"
      ],
      "2025-2026": [
        "2.0 TFSI Mild Hybrid - 204hp",
        "3.0 TFSI Mild Hybrid - 367hp",
        "2.0 TDI Mild Hybrid - 204hp",
        "3.0 TDI Mild Hybrid - 286hp",
        "2.0 TFSI e PHEV - 367hp"
      ]
    },
    "q7": {
      "2006-2015": [
        "3.0 TFSI - 272hp",
        "3.6 FSI - 280hp",
        "4.2 FSI - 350hp",
        "3.0 TDI - 240hp",
        "4.2 TDI - 326hp"
      ],
      "2016-2019": [
        "2.0 TFSI - 252hp",
        "3.0 TFSI - 333hp",
        "3.0 TDI - 218hp",
        "3.0 TDI - 272hp"
      ],
      "2020-2024": [
        "2.0 TFSI - 265hp",
        "3.0 TFSI - 340hp",
        "3.0 TDI - 231hp",
        "3.0 TDI - 286hp"
      ],
      "2025-2026": [
        "3.0 TFSI Mild Hybrid - 367hp",
        "3.0 TDI Mild Hybrid - 286hp",
        "3.0 TFSI e PHEV - 462hp"
      ]
    },
    "a1": {
      "2010-2014": [
        "1.2 TFSI - 86hp",
        "1.4 TFSI - 122hp",
        "1.4 TFSI - 125hp",
        "1.4 TFSI - 140hp",
        "1.6 TDI - 90hp",
        "1.6 TDI - 105hp",
        "2.0 TDI - 143hp"
      ],
      "2015-2018": [
        "1.0 TFSI - 82hp",
        "1.0 TFSI - 95hp",
        "1.4 TFSI - 125hp",
        "1.4 TFSI - 150hp",
        "1.8 TFSI - 192hp",
        "1.6 TDI - 90hp",
        "1.6 TDI - 116hp",
        "2.0 TDI - 143hp"
      ],
      "2019-2024": [
        "1.0 TFSI - 95hp",
        "1.0 TFSI - 110hp",
        "1.0 TFSI - 116hp",
        "1.5 TFSI - 150hp",
        "2.0 TFSI - 200hp",
        "1.6 TDI - 95hp",
        "1.6 TDI - 116hp"
      ]
    },
    "a5": {
      "2007-2016": [
        "1.8 TFSI - 170hp",
        "2.0 TFSI - 211hp",
        "3.0 TFSI - 272hp",
        "3.2 FSI - 265hp",
        "2.0 TDI - 143hp",
        "2.0 TDI - 177hp",
        "2.7 TDI - 190hp",
        "3.0 TDI - 240hp"
      ],
      "2017-2024": [
        "2.0 TFSI - 190hp",
        "2.0 TFSI - 252hp",
        "3.0 TFSI - 354hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 190hp",
        "3.0 TDI - 286hp"
      ]
    },
    "a7": {
      "2011-2017": [
        "2.0 TFSI - 252hp",
        "3.0 TFSI - 300hp",
        "3.0 TDI - 204hp",
        "3.0 TDI - 272hp"
      ],
      "2018-2024": [
        "2.0 TFSI - 245hp",
        "3.0 TFSI - 340hp",
        "2.0 TDI - 204hp",
        "3.0 TDI - 286hp"
      ]
    },
    "a8": {
      "2003-2009": [
        "3.0 - 220hp",
        "3.2 FSI - 260hp",
        "4.2 FSI - 350hp",
        "3.0 TDI - 233hp",
        "4.0 TDI - 275hp"
      ],
      "2010-2017": [
        "2.0 TFSI - 245hp",
        "3.0 TFSI - 310hp",
        "4.0 TFSI - 435hp",
        "3.0 TDI - 250hp",
        "4.2 TDI - 385hp"
      ],
      "2018-2024": [
        "3.0 TFSI - 340hp",
        "4.0 TFSI - 460hp",
        "3.0 TDI - 286hp"
      ]
    },
    "q2": {
      "2017-2024": [
        "1.0 TFSI - 116hp",
        "1.5 TFSI - 150hp",
        "2.0 TFSI - 190hp",
        "1.6 TDI - 116hp",
        "2.0 TDI - 150hp"
      ]
    },
    "q8": {
      "2019-2024": [
        "3.0 TFSI - 340hp",
        "4.0 TFSI - 507hp",
        "3.0 TDI - 231hp",
        "3.0 TDI - 286hp"
      ]
    },
    "q4-e-tron": {
      "2021-2024": [
        "Electric 35 - 170hp",
        "Electric 40 - 204hp",
        "Electric 45 - 299hp",
        "Electric 50 - 299hp"
      ]
    },
    "rs3": {
      "2011-2016": [
        "2.5 TFSI - 340hp",
        "2.5 TFSI - 367hp"
      ],
      "2017-2024": [
        "2.5 TFSI - 400hp"
      ]
    },
    "rs4": {
      "2000-2008": [
        "4.2 V8 - 420hp"
      ],
      "2012-2016": [
        "4.2 FSI - 450hp"
      ],
      "2018-2024": [
        "2.9 TFSI - 450hp"
      ]
    },
    "rs5": {
      "2010-2016": [
        "4.2 FSI - 450hp"
      ],
      "2017-2024": [
        "2.9 TFSI - 450hp"
      ]
    },
    "rs6": {
      "2003-2010": [
        "5.0 V10 - 580hp"
      ],
      "2013-2018": [
        "4.0 TFSI - 560hp"
      ],
      "2020-2024": [
        "4.0 TFSI - 600hp"
      ]
    },
    "rs7": {
      "2014-2018": [
        "4.0 TFSI - 560hp"
      ],
      "2020-2024": [
        "4.0 TFSI - 600hp"
      ]
    },
    "rsq8": {
      "2020-2024": [
        "4.0 TFSI - 600hp"
      ]
    },
    "e-tron": {
      "2021-2024": [
        "Electric 35 - 170hp",
        "Electric 40 - 204hp",
        "Electric 45 - 299hp",
        "Electric 50 - 299hp"
      ]
    },
    "tt": {
      "2007-2014": [
        "1.8 TFSI - 160hp",
        "2.0 TFSI - 200hp",
        "2.0 TDI - 170hp"
      ],
      "2015-2023": [
        "2.0 TFSI - 230hp",
        "2.0 TFSI - 310hp",
        "2.5 TFSI - 400hp"
      ]
    },
    "r8": {
      "2007-2014": [
        "4.2 FSI V8 - 420hp",
        "5.2 FSI V10 - 525hp"
      ],
      "2015-2024": [
        "5.2 FSI V10 - 540hp",
        "5.2 FSI V10 Plus - 610hp",
        "5.2 FSI V10 Performance - 620hp"
      ]
    }
  },
  "volkswagen": {
    "polo": {
      "2002-2009": [
        "1.2 - 55hp",
        "1.2 - 64hp",
        "1.4 - 75hp",
        "1.6 - 105hp",
        "1.4 TDI - 70hp",
        "1.9 TDI - 100hp"
      ],
      "2010-2017": [
        "1.0 - 60hp",
        "1.0 - 75hp",
        "1.2 TSI - 90hp",
        "1.2 TSI - 110hp",
        "1.4 TSI GTI - 180hp",
        "1.2 TDI - 75hp",
        "1.6 TDI - 90hp",
        "1.6 TDI - 105hp"
      ],
      "2018-2024": [
        "1.0 TSI - 80hp",
        "1.0 TSI - 95hp",
        "1.0 TSI - 110hp",
        "2.0 TSI GTI - 207hp",
        "1.6 TDI - 80hp",
        "1.6 TDI - 95hp"
      ]
    },
    "golf": {
      "1992-1997": [
        "1.4 - 60hp",
        "1.6 - 75hp",
        "1.8 - 75hp",
        "1.8 - 90hp",
        "2.0 - 115hp",
        "2.0 GTI - 150hp",
        "2.8 VR6 - 174hp",
        "1.9 D - 64hp",
        "1.9 TDI - 90hp",
        "1.9 TDI - 110hp"
      ],
      "1998-2003": [
        "1.4 - 75hp",
        "1.6 - 100hp",
        "1.8 - 125hp",
        "2.0 - 115hp",
        "1.8T GTI - 180hp",
        "2.3 V5 - 150hp",
        "2.8 VR6 - 204hp",
        "3.2 R32 - 241hp",
        "1.9 SDI - 68hp",
        "1.9 TDI - 90hp",
        "1.9 TDI - 110hp",
        "1.9 TDI - 130hp",
        "1.9 TDI - 150hp"
      ],
      "2004-2008": [
        "1.4 - 75hp",
        "1.6 - 102hp",
        "2.0 FSI - 150hp",
        "2.0 GTI - 200hp",
        "1.9 TDI - 90hp",
        "1.9 TDI - 105hp",
        "2.0 TDI - 140hp",
        "2.0 GTD - 170hp"
      ],
      "2009-2012": [
        "1.2 TSI - 85hp",
        "1.2 TSI - 105hp",
        "1.4 TSI - 122hp",
        "1.4 TSI - 160hp",
        "2.0 TSI GTI - 210hp",
        "1.6 TDI - 90hp",
        "1.6 TDI - 105hp",
        "2.0 TDI - 110hp",
        "2.0 TDI - 140hp",
        "2.0 GTD - 170hp"
      ],
      "2013-2016": [
        "1.0 TSI - 85hp",
        "1.2 TSI - 105hp",
        "1.4 TSI - 125hp",
        "1.4 TSI - 150hp",
        "2.0 TSI GTI - 220hp",
        "2.0 TSI R - 300hp",
        "1.6 TDI - 90hp",
        "1.6 TDI - 110hp",
        "2.0 TDI - 150hp",
        "2.0 GTD - 184hp"
      ],
      "2017-2020": [
        "1.0 TSI - 90hp",
        "1.0 TSI - 115hp",
        "1.5 TSI - 130hp",
        "1.5 TSI - 150hp",
        "2.0 TSI GTI - 245hp",
        "2.0 TSI R - 310hp",
        "1.6 TDI - 115hp",
        "2.0 TDI - 150hp",
        "2.0 GTD - 200hp"
      ],
      "2021-2024": [
        "1.0 eTSI - 110hp",
        "1.5 eTSI - 130hp",
        "1.5 eTSI - 150hp",
        "2.0 TSI GTI - 245hp",
        "2.0 TSI R - 320hp",
        "2.0 TDI - 150hp",
        "2.0 GTD - 200hp"
      ]
    },
    "jetta": {
      "2006-2010": [
        "1.4 TSI - 122hp",
        "1.6 - 102hp",
        "2.0 - 115hp",
        "2.0 FSI - 150hp",
        "1.9 TDI - 105hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 170hp"
      ],
      "2011-2018": [
        "1.2 TSI - 105hp",
        "1.4 TSI - 122hp",
        "1.4 TSI - 150hp",
        "1.8 TSI - 180hp",
        "2.0 TSI - 211hp",
        "1.6 TDI - 105hp",
        "2.0 TDI - 110hp",
        "2.0 TDI - 150hp"
      ],
      "2019-2024": [
        "1.4 TSI - 150hp",
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "1.6 TDI - 115hp",
        "2.0 TDI - 150hp"
      ]
    },
    "passat": {
      "2005-2010": [
        "1.6 - 102hp",
        "1.8 TSI - 160hp",
        "2.0 FSI - 150hp",
        "3.2 V6 - 250hp",
        "1.9 TDI - 105hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 170hp"
      ],
      "2011-2014": [
        "1.4 TSI - 122hp",
        "1.8 TSI - 160hp",
        "2.0 TSI - 210hp",
        "3.6 V6 - 300hp",
        "1.6 TDI - 105hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 170hp",
        "2.0 TDI - 177hp"
      ],
      "2015-2019": [
        "1.4 TSI - 125hp",
        "1.8 TSI - 180hp",
        "2.0 TSI - 220hp",
        "1.6 TDI - 120hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 190hp",
        "2.0 TDI BiTurbo - 240hp"
      ],
      "2020-2024": [
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 200hp"
      ]
    },
    "arteon": {
      "2017-2020": [
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 TSI - 280hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 190hp",
        "2.0 TDI - 240hp"
      ],
      "2021-2024": [
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 TSI R - 320hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 200hp"
      ]
    },
    "t-cross": {
      "2019-2024": [
        "1.0 TSI - 95hp",
        "1.0 TSI - 115hp",
        "1.5 TSI - 150hp"
      ]
    },
    "t-roc": {
      "2018-2024": [
        "1.0 TSI - 110hp",
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 TSI R - 300hp",
        "1.6 TDI - 115hp",
        "2.0 TDI - 150hp"
      ]
    },
    "tiguan": {
      "2008-2011": [
        "1.4 TSI - 150hp",
        "2.0 TSI - 170hp",
        "2.0 TSI - 200hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 170hp"
      ],
      "2012-2016": [
        "1.4 TSI - 125hp",
        "1.4 TSI - 150hp",
        "2.0 TSI - 180hp",
        "2.0 TSI - 220hp",
        "2.0 TDI - 110hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 184hp"
      ],
      "2017-2020": [
        "1.5 TSI - 150hp",
        "2.0 TSI - 180hp",
        "2.0 TSI - 220hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 190hp",
        "2.0 TDI BiTurbo - 240hp"
      ],
      "2021-2024": [
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 TSI - 245hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 200hp"
      ]
    },
    "touareg": {
      "2003-2010": [
        "3.2 V6 - 220hp",
        "3.6 FSI - 280hp",
        "4.2 V8 - 310hp",
        "2.5 TDI - 174hp",
        "3.0 TDI - 225hp",
        "5.0 V10 TDI - 313hp"
      ],
      "2011-2018": [
        "3.0 TSI - 333hp",
        "4.2 FSI - 360hp",
        "3.0 TDI - 204hp",
        "3.0 TDI - 245hp",
        "4.0 TDI - 340hp"
      ],
      "2019-2024": [
        "3.0 TSI - 340hp",
        "4.0 TSI - 462hp",
        "3.0 TDI - 231hp",
        "3.0 TDI - 286hp"
      ]
    },
    "caddy": {
      "2004-2010": [
        "1.4 - 75hp",
        "1.6 - 102hp",
        "2.0 - 115hp",
        "1.9 TDI - 75hp",
        "1.9 TDI - 105hp",
        "2.0 TDI - 110hp",
        "2.0 TDI - 140hp"
      ],
      "2011-2020": [
        "1.2 TSI - 84hp",
        "1.2 TSI - 105hp",
        "1.4 TSI - 125hp",
        "1.6 TDI - 75hp",
        "1.6 TDI - 102hp",
        "2.0 TDI - 110hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 150hp"
      ],
      "2021-2024": [
        "1.0 TSI - 114hp",
        "1.5 TSI - 114hp",
        "2.0 TDI - 75hp",
        "2.0 TDI - 122hp"
      ]
    },
    "transporter": {
      "2004-2009": [
        "1.9 TDI - 84hp",
        "1.9 TDI - 105hp",
        "2.5 TDI - 130hp",
        "2.5 TDI - 174hp"
      ],
      "2010-2015": [
        "2.0 TDI - 84hp",
        "2.0 TDI - 102hp",
        "2.0 TDI - 114hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 180hp"
      ],
      "2016-2019": [
        "2.0 TDI - 84hp",
        "2.0 TDI - 102hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 204hp"
      ],
      "2020-2024": [
        "2.0 TDI - 90hp",
        "2.0 TDI - 110hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 199hp"
      ]
    },
    "crafter": {
      "2007-2016": [
        "2.0 TDI - 109hp",
        "2.0 TDI - 136hp",
        "2.5 TDI - 163hp",
        "2.5 TDI - 109hp"
      ],
      "2017-2024": [
        "2.0 TDI - 102hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 177hp"
      ]
    },
    "id.3": {
      "2020-2024": [
        "Electric - 145hp",
        "Electric - 204hp"
      ]
    },
    "id.4": {
      "2021-2024": [
        "Electric - 174hp",
        "Electric - 204hp",
        "Electric - 299hp"
      ]
    },
    "id.5": {
      "2022-2024": [
        "Electric - 174hp",
        "Electric - 204hp",
        "Electric - 299hp"
      ]
    },
    "id.buzz": {
      "2023-2024": [
        "Electric - 204hp",
        "Electric - 286hp"
      ]
    },
    "id-3": {
      "2020-2024": [
        "Electric - 145hp",
        "Electric - 204hp"
      ],
      "2025-2026": [
        "Electric Pro - 204hp",
        "Electric GTX - 286hp"
      ]
    },
    "id-4": {
      "2021-2024": [
        "Electric - 174hp",
        "Electric - 204hp",
        "Electric - 299hp"
      ],
      "2025-2026": [
        "Electric Pro - 286hp",
        "Electric GTX - 340hp"
      ]
    },
    "id-5": {
      "2022-2024": [
        "Electric - 174hp",
        "Electric - 204hp",
        "Electric - 299hp"
      ],
      "2025-2026": [
        "Electric Pro - 286hp",
        "Electric GTX - 340hp"
      ]
    },
    "id-buzz": {
      "2023-2024": [
        "Electric - 204hp",
        "Electric - 286hp"
      ],
      "2025-2026": [
        "Electric - 286hp",
        "Electric GTX - 340hp"
      ]
    },
    "beetle": {
      "2006-2011": [
        "1.6 - 102hp",
        "2.0 - 115hp",
        "1.9 TDI - 105hp",
        "2.0 TDI - 140hp"
      ],
      "2012-2019": [
        "1.2 TSI - 105hp",
        "1.4 TSI - 150hp",
        "2.0 TSI - 220hp",
        "1.6 TDI - 105hp",
        "2.0 TDI - 150hp"
      ]
    },
    "sharan": {
      "2005-2010": [
        "1.8 Turbo - 150hp",
        "2.0 - 115hp",
        "1.9 TDI - 115hp",
        "2.0 TDI - 140hp"
      ],
      "2011-2022": [
        "1.4 TSI - 150hp",
        "2.0 TSI - 200hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 177hp"
      ]
    },
    "up": {
      "2012-2016": [
        "1.0 - 60hp",
        "1.0 - 75hp"
      ],
      "2017-2023": [
        "1.0 - 65hp",
        "1.0 TSI - 90hp",
        "Electric - 83hp"
      ]
    },
    "amarok": {
      "2010-2016": [
        "2.0 TDI - 122hp",
        "2.0 BiTDI - 180hp"
      ],
      "2017-2022": [
        "3.0 V6 TDI - 204hp",
        "3.0 V6 TDI - 224hp",
        "3.0 V6 TDI - 258hp"
      ],
      "2023-2026": [
        "2.0 TDI - 170hp",
        "2.0 BiTDI - 205hp",
        "3.0 V6 TDI - 240hp"
      ]
    },
    "golf-gti": {
      "1992-1997": [
        "2.0 - 150hp"
      ],
      "1998-2003": [
        "1.8T - 180hp"
      ],
      "2004-2008": [
        "2.0 TFSI - 200hp"
      ],
      "2009-2012": [
        "2.0 TSI - 210hp"
      ],
      "2013-2016": [
        "2.0 TSI - 220hp"
      ],
      "2017-2020": [
        "2.0 TSI - 245hp"
      ],
      "2021-2024": [
        "2.0 TSI - 245hp"
      ]
    },
    "golf-r": {
      "2010-2013": [
        "2.0 TSI - 270hp"
      ],
      "2014-2016": [
        "2.0 TSI - 300hp"
      ],
      "2017-2020": [
        "2.0 TSI - 310hp"
      ],
      "2021-2024": [
        "2.0 TSI - 320hp"
      ]
    },
    "scirocco": {
      "2009-2017": [
        "1.4 TSI - 122hp",
        "1.4 TSI - 160hp",
        "2.0 TSI - 180hp",
        "2.0 TSI - 210hp",
        "2.0 TSI R - 280hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 184hp"
      ]
    },
    "edge": {
      "2016-2024": [
        "2.0 EcoBlue - 150hp",
        "2.0 EcoBlue - 190hp",
        "2.0 EcoBlue - 238hp",
        "2.0 EcoBoost - 245hp",
        "2.7 EcoBoost - 335hp"
      ]
    },
    "explorer": {
      "2011-2019": [
        "2.0 EcoBoost - 240hp",
        "2.3 EcoBoost - 280hp",
        "3.5 V6 - 290hp",
        "3.5 EcoBoost - 365hp"
      ],
      "2020-2024": [
        "2.3 EcoBoost - 300hp",
        "3.0 EcoBoost - 457hp",
        "3.3 Hybrid - 318hp"
      ]
    },
    "transit": {
      "2006-2013": [
        "2.2 TDCi - 85hp",
        "2.2 TDCi - 110hp",
        "2.2 TDCi - 125hp",
        "2.2 TDCi - 155hp",
        "2.4 TDCi - 140hp"
      ],
      "2014-2019": [
        "2.0 EcoBlue - 105hp",
        "2.0 EcoBlue - 130hp",
        "2.0 EcoBlue - 170hp",
        "2.2 TDCi - 125hp",
        "2.2 TDCi - 155hp"
      ],
      "2020-2024": [
        "2.0 EcoBlue - 105hp",
        "2.0 EcoBlue - 130hp",
        "2.0 EcoBlue - 170hp",
        "2.0 EcoBlue - 185hp"
      ]
    },
    "transit-custom": {
      "2013-2024": [
        "2.0 EcoBlue - 105hp",
        "2.0 EcoBlue - 130hp",
        "2.0 EcoBlue - 170hp",
        "2.0 EcoBlue - 185hp"
      ]
    },
    "ranger": {
      "2012-2018": [
        "2.2 TDCi - 125hp",
        "2.2 TDCi - 150hp",
        "3.2 TDCi - 200hp"
      ],
      "2019-2024": [
        "2.0 EcoBlue - 130hp",
        "2.0 EcoBlue - 170hp",
        "2.0 Bi-Turbo - 213hp",
        "3.0 V6 - 250hp"
      ]
    },
    "f-150": {
      "2011-2024": [
        "2.7 EcoBoost V6 - 325hp",
        "3.5 EcoBoost V6 - 400hp",
        "5.0 V8 - 400hp"
      ]
    },
    "s-max": {
      "2006-2014": [
        "1.6 EcoBoost - 160hp",
        "2.0 EcoBoost - 203hp",
        "2.0 TDCi - 140hp",
        "2.0 TDCi - 163hp",
        "2.2 TDCi - 200hp"
      ],
      "2015-2023": [
        "1.5 EcoBoost - 160hp",
        "2.0 EcoBoost - 240hp",
        "2.0 TDCi - 150hp",
        "2.0 TDCi - 180hp",
        "2.0 TDCi - 210hp"
      ]
    },
    "galaxy": {
      "2006-2014": [
        "1.6 EcoBoost - 160hp",
        "2.0 EcoBoost - 203hp",
        "2.0 TDCi - 140hp",
        "2.0 TDCi - 163hp",
        "2.2 TDCi - 200hp"
      ],
      "2015-2023": [
        "1.5 EcoBoost - 160hp",
        "2.0 EcoBoost - 240hp",
        "2.0 TDCi - 150hp",
        "2.0 TDCi - 180hp",
        "2.0 TDCi - 210hp"
      ]
    },
    "tourneo": {
      "2014-2024": [
        "2.0 EcoBlue - 105hp",
        "2.0 EcoBlue - 130hp",
        "2.0 EcoBlue - 170hp",
        "2.0 EcoBlue - 185hp"
      ]
    },
    "fiesta-st": {
      "2013-2017": [
        "1.6 EcoBoost - 182hp"
      ],
      "2018-2023": [
        "1.5 EcoBoost - 200hp"
      ]
    },
    "focus-st": {
      "2005-2010": [
        "2.5 - 225hp"
      ],
      "2012-2014": [
        "2.0 EcoBoost - 250hp"
      ],
      "2015-2018": [
        "2.3 EcoBoost - 280hp"
      ],
      "2019-2024": [
        "2.3 EcoBoost - 280hp"
      ]
    },
    "focus-rs": {
      "2009-2011": [
        "2.5 - 305hp"
      ],
      "2016-2018": [
        "2.3 EcoBoost - 350hp"
      ]
    },
    "mustang-mach-e": {
      "2021-2024": [
        "Electric RWD - 269hp",
        "Electric AWD - 351hp",
        "Electric GT - 487hp"
      ]
    },
    "bronco": {
      "2021-2024": [
        "2.3 EcoBoost - 300hp",
        "2.7 EcoBoost - 330hp"
      ]
    }
  },
  "bmw": {
    "3-series": {
      "1990-1998": [
        "1.6 316i - 102hp",
        "1.8 318i - 113hp",
        "1.8 318is - 140hp",
        "1.9 319i - 140hp",
        "2.0 320i - 150hp",
        "2.5 323i - 170hp",
        "2.5 325i - 192hp",
        "2.8 328i - 193hp",
        "3.0 M3 - 286hp",
        "3.2 M3 - 321hp",
        "1.7 318tds - 90hp",
        "2.5 325td - 115hp",
        "2.5 325tds - 143hp"
      ],
      "1999-2005": [
        "1.8 316i - 105hp",
        "1.9 318i - 118hp",
        "2.0 320i - 150hp",
        "2.2 320i - 170hp",
        "2.5 323i - 170hp",
        "2.5 325i - 192hp",
        "2.8 328i - 193hp",
        "3.0 330i - 231hp",
        "3.2 M3 - 343hp",
        "2.0 318d - 116hp",
        "2.0 320d - 136hp",
        "2.0 320d - 150hp",
        "3.0 330d - 204hp"
      ],
      "2005-2008": [
        "2.0 316i - 122hp",
        "2.0 318i - 129hp",
        "2.0 320i - 150hp",
        "2.5 325i - 218hp",
        "3.0 330i - 258hp",
        "2.0 318d - 122hp",
        "2.0 320d - 163hp",
        "2.0 320d - 177hp",
        "3.0 330d - 231hp"
      ],
      "2009-2011": [
        "2.0 316i - 122hp",
        "2.0 320i - 170hp",
        "3.0 325i - 218hp",
        "3.0 330i - 272hp",
        "3.0 335i - 306hp",
        "2.0 316d - 116hp",
        "2.0 318d - 143hp",
        "2.0 320d - 184hp",
        "3.0 325d - 197hp",
        "3.0 330d - 245hp"
      ],
      "2012-2015": [
        "1.6 316i - 136hp",
        "2.0 320i - 184hp",
        "2.0 328i - 245hp",
        "3.0 335i - 306hp",
        "1.6 316d - 116hp",
        "2.0 318d - 143hp",
        "2.0 320d - 184hp",
        "3.0 325d - 218hp",
        "3.0 330d - 258hp"
      ],
      "2016-2018": [
        "1.5 318i - 136hp",
        "2.0 320i - 184hp",
        "2.0 330i - 252hp",
        "3.0 340i - 326hp",
        "1.5 316d - 116hp",
        "2.0 318d - 150hp",
        "2.0 320d - 190hp",
        "3.0 330d - 265hp"
      ],
      "2019-2024": [
        "2.0 320i - 184hp",
        "2.0 330i - 258hp",
        "3.0 M340i - 374hp",
        "2.0 318d - 150hp",
        "2.0 320d - 190hp",
        "3.0 330d - 286hp"
      ],
      "2025-2026": [
        "2.0 320i Mild Hybrid - 184hp",
        "2.0 330i Mild Hybrid - 272hp",
        "3.0 M340i - 382hp",
        "2.0 320d - 190hp",
        "2.0 320e PHEV - 292hp",
        "3.0 330e PHEV - 313hp"
      ]
    },
    "5-series": {
      "2005-2010": [
        "2.0 520i - 170hp",
        "2.5 523i - 190hp",
        "3.0 525i - 218hp",
        "3.0 530i - 272hp",
        "4.8 550i - 367hp",
        "2.0 520d - 177hp",
        "3.0 525d - 197hp",
        "3.0 530d - 235hp",
        "3.0 535d - 286hp"
      ],
      "2011-2013": [
        "2.0 520i - 184hp",
        "3.0 528i - 245hp",
        "3.0 535i - 306hp",
        "4.4 550i - 449hp",
        "2.0 518d - 143hp",
        "2.0 520d - 184hp",
        "3.0 525d - 218hp",
        "3.0 530d - 258hp",
        "3.0 535d - 313hp"
      ],
      "2014-2016": [
        "2.0 520i - 184hp",
        "2.0 528i - 245hp",
        "3.0 535i - 306hp",
        "4.4 550i - 449hp",
        "2.0 518d - 150hp",
        "2.0 520d - 190hp",
        "3.0 525d - 218hp",
        "3.0 530d - 258hp",
        "3.0 535d - 313hp"
      ],
      "2017-2020": [
        "2.0 520i - 184hp",
        "2.0 530i - 252hp",
        "3.0 540i - 340hp",
        "4.4 M550i - 530hp",
        "2.0 518d - 150hp",
        "2.0 520d - 190hp",
        "3.0 530d - 265hp",
        "3.0 540d - 320hp"
      ],
      "2021-2024": [
        "2.0 520i - 184hp",
        "2.0 530i - 252hp",
        "3.0 540i - 340hp",
        "4.4 M550i - 530hp",
        "2.0 520d - 190hp",
        "3.0 530d - 286hp",
        "3.0 540d - 340hp"
      ],
      "2025-2026": [
        "2.0 520i Mild Hybrid - 197hp",
        "2.0 530i Mild Hybrid - 272hp",
        "3.0 540i - 340hp",
        "2.0 520d Mild Hybrid - 197hp",
        "3.0 530d Mild Hybrid - 286hp",
        "2.0 530e PHEV - 292hp"
      ]
    },
    "1-series": {
      "2005-2011": [
        "1.6 116i - 122hp",
        "2.0 118i - 143hp",
        "2.0 120i - 170hp",
        "3.0 130i - 265hp",
        "2.0 118d - 143hp",
        "2.0 120d - 177hp",
        "2.0 123d - 204hp"
      ],
      "2012-2015": [
        "1.6 116i - 136hp",
        "1.6 118i - 170hp",
        "2.0 120i - 184hp",
        "3.0 M135i - 320hp",
        "1.6 116d - 116hp",
        "2.0 118d - 143hp",
        "2.0 120d - 184hp",
        "2.0 125d - 218hp"
      ],
      "2016-2019": [
        "1.5 118i - 136hp",
        "2.0 120i - 184hp",
        "2.0 M140i - 340hp",
        "1.5 116d - 116hp",
        "2.0 118d - 150hp",
        "2.0 120d - 190hp"
      ],
      "2020-2024": [
        "1.5 118i - 140hp",
        "2.0 120i - 178hp",
        "2.0 M135i - 306hp",
        "2.0 118d - 150hp",
        "2.0 120d - 190hp"
      ],
      "2025-2026": [
        "2.0 120i Mild Hybrid - 170hp",
        "2.0 M135i - 300hp",
        "2.0 120d Mild Hybrid - 163hp"
      ]
    },
    "x1": {
      "2010-2015": [
        "2.0 sDrive18i - 150hp",
        "2.0 xDrive20i - 184hp",
        "3.0 xDrive28i - 245hp",
        "2.0 sDrive18d - 143hp",
        "2.0 xDrive18d - 143hp",
        "2.0 xDrive20d - 184hp",
        "2.0 xDrive25d - 218hp"
      ],
      "2016-2022": [
        "1.5 sDrive18i - 140hp",
        "2.0 sDrive20i - 192hp",
        "2.0 xDrive25i - 231hp",
        "2.0 sDrive18d - 150hp",
        "2.0 xDrive20d - 190hp",
        "2.0 xDrive25d - 231hp"
      ],
      "2023-2024": [
        "1.5 sDrive18i - 136hp",
        "2.0 xDrive23i - 204hp",
        "2.0 sDrive18d - 150hp",
        "2.0 xDrive20d - 163hp",
        "2.0 xDrive23d - 211hp"
      ],
      "2025-2026": [
        "2.0 xDrive20i Mild Hybrid - 197hp",
        "2.0 xDrive23i Mild Hybrid - 218hp",
        "2.0 xDrive20d Mild Hybrid - 163hp",
        "2.0 xDrive20e PHEV - 326hp"
      ]
    },
    "x3": {
      "2005-2010": [
        "2.0 xDrive20i - 150hp",
        "2.5 xDrive25i - 218hp",
        "3.0 xDrive30i - 272hp",
        "2.0 xDrive18d - 143hp",
        "2.0 xDrive20d - 177hp",
        "3.0 xDrive30d - 235hp"
      ],
      "2011-2017": [
        "2.0 xDrive20i - 184hp",
        "2.0 xDrive28i - 245hp",
        "3.0 xDrive35i - 306hp",
        "2.0 xDrive18d - 143hp",
        "2.0 xDrive20d - 184hp",
        "3.0 xDrive30d - 258hp",
        "3.0 xDrive35d - 313hp"
      ],
      "2018-2024": [
        "2.0 xDrive20i - 184hp",
        "2.0 xDrive30i - 252hp",
        "3.0 M40i - 360hp",
        "2.0 xDrive18d - 150hp",
        "2.0 xDrive20d - 190hp",
        "3.0 xDrive30d - 286hp",
        "3.0 M40d - 340hp"
      ],
      "2025-2026": [
        "2.0 xDrive20i Mild Hybrid - 197hp",
        "2.0 xDrive30i Mild Hybrid - 265hp",
        "3.0 M40i - 387hp",
        "2.0 xDrive20d Mild Hybrid - 197hp",
        "3.0 xDrive30d Mild Hybrid - 286hp"
      ]
    },
    "x5": {
      "2000-2006": [
        "3.0 xDrive30i - 231hp",
        "4.4 xDrive44i - 320hp",
        "4.8 xDrive48i - 360hp",
        "3.0 xDrive30d - 218hp",
        "3.0 xDrive35d - 272hp"
      ],
      "2007-2013": [
        "3.0 xDrive30i - 272hp",
        "3.0 xDrive35i - 306hp",
        "4.8 xDrive50i - 407hp",
        "3.0 xDrive30d - 235hp",
        "3.0 xDrive35d - 286hp",
        "3.0 M50d - 381hp"
      ],
      "2014-2018": [
        "2.0 xDrive25d - 231hp",
        "3.0 xDrive30d - 258hp",
        "3.0 xDrive35i - 306hp",
        "3.0 xDrive40d - 313hp",
        "4.4 xDrive50i - 450hp",
        "3.0 M50d - 381hp"
      ],
      "2019-2024": [
        "2.0 xDrive30i - 265hp",
        "3.0 xDrive40i - 340hp",
        "4.4 xDrive50i - 530hp",
        "3.0 xDrive30d - 265hp",
        "3.0 xDrive40d - 340hp",
        "3.0 M50d - 400hp"
      ],
      "2025-2026": [
        "3.0 xDrive40i Mild Hybrid - 381hp",
        "4.4 xDrive50i Mild Hybrid - 530hp",
        "3.0 xDrive40d Mild Hybrid - 340hp",
        "3.0 xDrive50e PHEV - 489hp"
      ]
    },
    "2-series": {
      "2014-2021": [
        "1.5 216i - 109hp",
        "2.0 218i - 136hp",
        "2.0 220i - 192hp",
        "3.0 M240i - 340hp",
        "1.5 216d - 116hp",
        "2.0 218d - 150hp",
        "2.0 220d - 190hp"
      ],
      "2022-2024": [
        "2.0 220i - 170hp",
        "3.0 M240i - 374hp",
        "2.0 218d - 150hp",
        "2.0 220d - 190hp"
      ]
    },
    "4-series": {
      "2014-2020": [
        "2.0 420i - 184hp",
        "2.0 428i - 245hp",
        "3.0 435i - 306hp",
        "3.0 M4 - 431hp",
        "2.0 418d - 150hp",
        "2.0 420d - 190hp",
        "3.0 430d - 258hp"
      ],
      "2021-2024": [
        "2.0 420i - 184hp",
        "3.0 M440i - 374hp",
        "3.0 M4 - 510hp",
        "2.0 420d - 190hp",
        "3.0 430d - 286hp"
      ]
    },
    "x2": {
      "2018-2024": [
        "1.5 sDrive18i - 140hp",
        "2.0 sDrive20i - 192hp",
        "2.0 M35i - 306hp",
        "1.5 sDrive18d - 150hp",
        "2.0 xDrive20d - 190hp"
      ]
    },
    "x4": {
      "2014-2018": [
        "2.0 xDrive20i - 184hp",
        "2.0 xDrive28i - 245hp",
        "3.0 xDrive35i - 306hp",
        "3.0 M40i - 360hp",
        "2.0 xDrive20d - 190hp",
        "3.0 xDrive30d - 258hp",
        "3.0 xDrive35d - 313hp"
      ],
      "2019-2024": [
        "2.0 xDrive20i - 184hp",
        "2.0 xDrive30i - 252hp",
        "3.0 M40i - 387hp",
        "3.0 M Competition - 510hp",
        "2.0 xDrive20d - 190hp",
        "3.0 xDrive30d - 286hp"
      ]
    },
    "x6": {
      "2008-2014": [
        "3.0 xDrive30i - 272hp",
        "3.0 xDrive35i - 306hp",
        "4.4 xDrive50i - 407hp",
        "3.0 xDrive30d - 235hp",
        "3.0 xDrive35d - 286hp",
        "3.0 M50d - 381hp"
      ],
      "2015-2019": [
        "2.0 xDrive28i - 245hp",
        "3.0 xDrive35i - 306hp",
        "4.4 xDrive50i - 450hp",
        "3.0 xDrive30d - 258hp",
        "3.0 xDrive40d - 313hp",
        "3.0 M50d - 381hp"
      ],
      "2020-2024": [
        "3.0 xDrive40i - 340hp",
        "4.4 xDrive50i - 530hp",
        "3.0 xDrive30d - 265hp",
        "3.0 xDrive40d - 340hp",
        "3.0 M50d - 400hp"
      ]
    },
    "x7": {
      "2019-2024": [
        "3.0 xDrive30d - 265hp",
        "3.0 xDrive40i - 340hp",
        "4.4 xDrive50i - 530hp",
        "3.0 M50d - 400hp",
        "4.4 M60i - 530hp"
      ]
    },
    "6-series": {
      "2011-2018": [
        "3.0 640i - 320hp",
        "4.4 650i - 450hp",
        "3.0 640d - 313hp"
      ]
    },
    "7-series": {
      "2009-2015": [
        "3.0 730i - 258hp",
        "3.0 740i - 326hp",
        "4.4 750i - 449hp",
        "6.0 760i - 544hp",
        "3.0 730d - 258hp",
        "3.0 740d - 313hp"
      ],
      "2016-2022": [
        "2.0 730i - 265hp",
        "3.0 740i - 340hp",
        "4.4 750i - 530hp",
        "6.6 M760i - 610hp",
        "3.0 730d - 265hp",
        "3.0 740d - 320hp"
      ],
      "2023-2024": [
        "3.0 740i - 380hp",
        "4.4 760i - 544hp",
        "3.0 740d - 300hp"
      ]
    },
    "8-series": {
      "2019-2024": [
        "3.0 840i - 340hp",
        "4.4 850i - 530hp",
        "4.4 M8 - 625hp",
        "3.0 840d - 340hp"
      ]
    },
    "i3": {
      "2013-2022": [
        "Electric - 170hp",
        "Electric - 184hp"
      ]
    },
    "i4": {
      "2022-2024": [
        "Electric eDrive40 - 340hp",
        "Electric M50 - 544hp"
      ]
    },
    "i8": {
      "2014-2020": [
        "1.5 Hybrid - 374hp"
      ]
    },
    "ix": {
      "2022-2024": [
        "Electric xDrive40 - 326hp",
        "Electric xDrive50 - 523hp",
        "Electric M60 - 619hp"
      ]
    },
    "z4": {
      "2009-2016": [
        "2.0 sDrive20i - 184hp",
        "2.5 sDrive23i - 204hp",
        "3.0 sDrive30i - 258hp",
        "3.0 sDrive35i - 306hp"
      ],
      "2019-2024": [
        "2.0 sDrive20i - 197hp",
        "2.0 sDrive30i - 258hp",
        "3.0 M40i - 340hp"
      ]
    },
    "m2": {
      "2016-2020": [
        "3.0 - 370hp",
        "3.0 Competition - 410hp"
      ],
      "2023-2024": [
        "3.0 - 460hp",
        "3.0 Competition - 485hp"
      ]
    },
    "m3": {
      "2001-2006": [
        "3.2 - 343hp"
      ],
      "2008-2013": [
        "4.0 V8 - 420hp"
      ],
      "2014-2018": [
        "3.0 - 431hp",
        "3.0 Competition - 450hp"
      ],
      "2021-2024": [
        "3.0 - 480hp",
        "3.0 Competition - 510hp"
      ]
    },
    "m4": {
      "2014-2020": [
        "3.0 - 431hp",
        "3.0 Competition - 450hp"
      ],
      "2021-2024": [
        "3.0 - 480hp",
        "3.0 Competition - 510hp"
      ]
    },
    "m5": {
      "2000-2003": [
        "5.0 V8 - 400hp"
      ],
      "2005-2010": [
        "5.0 V10 - 507hp"
      ],
      "2012-2017": [
        "4.4 V8 - 560hp",
        "4.4 Competition - 600hp"
      ],
      "2018-2024": [
        "4.4 V8 - 625hp",
        "4.4 Competition - 635hp"
      ]
    },
    "m8": {
      "2020-2024": [
        "4.4 V8 - 625hp",
        "4.4 Competition - 635hp"
      ]
    },
    "x3-m": {
      "2020-2024": [
        "3.0 - 480hp",
        "3.0 Competition - 510hp"
      ]
    },
    "x4-m": {
      "2020-2024": [
        "3.0 - 480hp",
        "3.0 Competition - 510hp"
      ]
    },
    "x5-m": {
      "2010-2013": [
        "4.4 V8 - 555hp"
      ],
      "2015-2019": [
        "4.4 V8 - 575hp"
      ],
      "2020-2024": [
        "4.4 V8 - 625hp",
        "4.4 Competition - 635hp"
      ]
    },
    "x6-m": {
      "2010-2014": [
        "4.4 V8 - 555hp"
      ],
      "2015-2019": [
        "4.4 V8 - 575hp"
      ],
      "2020-2024": [
        "4.4 V8 - 625hp",
        "4.4 Competition - 635hp"
      ]
    }
  },
  "fiat": {
    "500": {
      "2008-2012": [
        "0.9 TwinAir - 65hp",
        "0.9 TwinAir - 85hp",
        "1.2 - 69hp",
        "1.4 - 100hp",
        "1.3 MultiJet - 75hp",
        "1.3 MultiJet - 95hp"
      ],
      "2013-2015": [
        "0.9 TwinAir - 65hp",
        "0.9 TwinAir - 85hp",
        "1.2 - 69hp",
        "1.4 - 100hp",
        "1.3 MultiJet - 95hp"
      ],
      "2016-2020": [
        "0.9 TwinAir - 65hp",
        "0.9 TwinAir - 85hp",
        "1.0 Hybrid - 70hp",
        "1.2 - 69hp",
        "1.3 MultiJet - 95hp"
      ],
      "2021-2024": [
        "1.0 Hybrid - 70hp",
        "1.0 Hybrid - 70hp (electric)"
      ]
    },
    "500x": {
      "2015-2018": [
        "1.4 T-Jet - 120hp",
        "1.4 T-Jet - 140hp",
        "1.4 MultiAir - 140hp",
        "1.6 MultiJet - 120hp",
        "2.0 MultiJet - 140hp"
      ],
      "2019-2024": [
        "1.0 FireFly - 120hp",
        "1.3 FireFly - 150hp",
        "1.3 MultiJet - 95hp",
        "1.6 MultiJet - 120hp",
        "2.0 MultiJet - 130hp"
      ]
    },
    "tipo": {
      "2016-2020": [
        "1.4 - 95hp",
        "1.4 T-Jet - 120hp",
        "1.6 - 110hp",
        "1.3 MultiJet - 95hp",
        "1.6 MultiJet - 120hp"
      ],
      "2021-2024": [
        "1.0 FireFly - 100hp",
        "1.5 Hybrid - 130hp",
        "1.6 MultiJet - 130hp"
      ]
    },
    "panda": {
      "2003-2011": [
        "1.1 - 54hp",
        "1.2 - 60hp",
        "1.4 - 100hp",
        "1.3 MultiJet - 70hp",
        "1.3 MultiJet - 75hp"
      ],
      "2012-2024": [
        "0.9 TwinAir - 65hp",
        "0.9 TwinAir - 85hp",
        "1.2 - 69hp",
        "1.3 MultiJet - 75hp",
        "1.3 MultiJet - 95hp"
      ]
    },
    "500l": {
      "2013-2022": [
        "0.9 TwinAir - 105hp",
        "1.4 - 95hp",
        "1.4 T-Jet - 120hp",
        "1.6 MultiJet - 105hp",
        "1.6 MultiJet - 120hp"
      ]
    },
    "ducato": {
      "2006-2024": [
        "2.0 MultiJet - 115hp",
        "2.3 MultiJet - 120hp",
        "2.3 MultiJet - 130hp",
        "2.3 MultiJet - 140hp",
        "2.3 MultiJet - 150hp",
        "2.3 MultiJet - 180hp"
      ]
    },
    "doblo": {
      "2010-2022": [
        "1.4 - 95hp",
        "1.6 MultiJet - 90hp",
        "1.6 MultiJet - 105hp",
        "1.6 MultiJet - 120hp",
        "2.0 MultiJet - 135hp"
      ]
    },
    "punto": {
      "1999-2010": [
        "1.2 - 60hp",
        "1.2 - 65hp",
        "1.4 - 77hp",
        "1.4 - 95hp",
        "1.3 MultiJet - 70hp",
        "1.3 MultiJet - 75hp",
        "1.9 MultiJet - 100hp"
      ],
      "2012-2018": [
        "0.9 TwinAir - 85hp",
        "1.2 - 69hp",
        "1.4 - 77hp",
        "1.3 MultiJet - 85hp",
        "1.3 MultiJet - 95hp"
      ]
    },
    "bravo": {
      "2007-2014": [
        "1.4 - 90hp",
        "1.4 T-Jet - 120hp",
        "1.4 T-Jet - 150hp",
        "1.6 MultiJet - 105hp",
        "1.6 MultiJet - 120hp",
        "1.9 MultiJet - 120hp",
        "1.9 MultiJet - 150hp",
        "2.0 MultiJet - 165hp"
      ]
    },
    "qubo": {
      "2008-2021": [
        "1.3 MultiJet - 75hp",
        "1.3 MultiJet - 80hp",
        "1.4 - 73hp",
        "1.4 - 77hp"
      ]
    },
    "fiorino": {
      "2008-2024": [
        "1.3 MultiJet - 75hp",
        "1.3 MultiJet - 80hp",
        "1.3 MultiJet - 95hp",
        "1.4 - 73hp"
      ]
    },
    "talento": {
      "2016-2024": [
        "1.6 MultiJet - 95hp",
        "1.6 MultiJet - 120hp",
        "1.6 MultiJet - 145hp"
      ]
    },
    "600e": {
      "2024": [
        "Electric - 156hp"
      ]
    },
    "500e": {
      "2008-2012": [
        "0.9 TwinAir - 65hp",
        "0.9 TwinAir - 85hp",
        "1.2 - 69hp",
        "1.4 - 100hp",
        "1.3 MultiJet - 75hp",
        "1.3 MultiJet - 95hp"
      ],
      "2013-2015": [
        "0.9 TwinAir - 65hp",
        "0.9 TwinAir - 85hp",
        "1.2 - 69hp",
        "1.4 - 100hp",
        "1.3 MultiJet - 95hp"
      ],
      "2016-2020": [
        "0.9 TwinAir - 65hp",
        "0.9 TwinAir - 85hp",
        "1.0 Hybrid - 70hp",
        "1.2 - 69hp",
        "1.3 MultiJet - 95hp"
      ],
      "2021-2024": [
        "1.0 Hybrid - 70hp",
        "1.0 Hybrid - 70hp (electric)"
      ]
    }
  },
  "mercedes": {
    "a-class": {
      "2005-2012": [
        "1.5 A150 - 95hp",
        "1.7 A160 - 95hp",
        "2.0 A170 - 116hp",
        "2.0 A200 - 136hp",
        "1.5 A150 CDI - 95hp",
        "1.8 A180 CDI - 109hp",
        "2.0 A200 CDI - 140hp"
      ],
      "2013-2018": [
        "1.5 A160 - 102hp",
        "1.6 A180 - 122hp",
        "2.0 A200 - 156hp",
        "2.0 A250 - 211hp",
        "2.0 A45 AMG - 360hp",
        "1.5 A160d - 90hp",
        "1.5 A180d - 109hp",
        "2.1 A200d - 136hp",
        "2.1 A220d - 177hp"
      ],
      "2019-2024": [
        "1.3 A180 - 136hp",
        "2.0 A200 - 163hp",
        "2.0 A250 - 224hp",
        "2.0 A35 AMG - 306hp",
        "2.0 A45 AMG - 421hp",
        "1.5 A180d - 116hp",
        "2.0 A200d - 150hp",
        "2.0 A220d - 190hp"
      ],
      "2025-2026": [
        "2.0 A200 Mild Hybrid - 170hp",
        "2.0 A250 Mild Hybrid - 224hp",
        "2.0 A35 AMG - 306hp",
        "2.0 A200d Mild Hybrid - 150hp",
        "2.0 A250e PHEV - 218hp"
      ]
    },
    "c-class": {
      "1993-2000": [
        "1.8 C180 - 122hp",
        "2.0 C200 - 136hp",
        "2.2 C220 - 150hp",
        "2.3 C230 - 150hp",
        "2.8 C280 - 193hp",
        "3.6 C36 AMG - 280hp",
        "2.0 C200 D - 75hp",
        "2.2 C220 CDI - 95hp",
        "2.5 C250 D - 113hp",
        "2.5 C250 TD - 150hp"
      ],
      "2001-2007": [
        "1.8 C180 - 129hp",
        "2.0 C200 - 163hp",
        "2.6 C240 - 170hp",
        "3.2 C320 - 218hp",
        "5.4 C55 AMG - 367hp",
        "2.1 C200 CDI - 116hp",
        "2.1 C220 CDI - 143hp",
        "2.7 C270 CDI - 170hp",
        "3.2 C320 CDI - 204hp"
      ],
      "2005-2007": [
        "1.8 C180 - 143hp",
        "2.5 C230 - 204hp",
        "3.0 C280 - 231hp",
        "3.5 C350 - 272hp",
        "2.1 C200 CDI - 122hp",
        "2.1 C220 CDI - 150hp",
        "3.0 C320 CDI - 224hp"
      ],
      "2008-2014": [
        "1.8 C180 - 156hp",
        "1.8 C200 - 184hp",
        "3.0 C300 - 231hp",
        "3.5 C350 - 306hp",
        "6.2 C63 AMG - 457hp",
        "2.1 C200 CDI - 136hp",
        "2.1 C220 CDI - 170hp",
        "3.0 C320 CDI - 231hp"
      ],
      "2015-2021": [
        "1.6 C160 - 129hp",
        "2.0 C200 - 184hp",
        "2.0 C250 - 211hp",
        "3.0 C400 - 333hp",
        "4.0 C63 AMG - 476hp",
        "1.6 C200d - 136hp",
        "2.1 C220d - 170hp",
        "2.1 C250d - 204hp",
        "3.0 C350d - 258hp"
      ],
      "2022-2024": [
        "1.5 C180 - 170hp",
        "2.0 C200 - 204hp",
        "2.0 C300 - 258hp",
        "4.0 C63 AMG - 510hp",
        "2.0 C200d - 163hp",
        "2.0 C220d - 200hp",
        "3.0 C300d - 265hp"
      ],
      "2025-2026": [
        "2.0 C200 Mild Hybrid - 204hp",
        "2.0 C300 Mild Hybrid - 258hp",
        "2.0 C300e PHEV - 313hp",
        "2.0 C220d Mild Hybrid - 200hp",
        "4.0 C63 S E-Performance - 680hp"
      ]
    },
    "e-class": {
      "2024": [
        "2.0 E200 - 204hp",
        "2.0 E300 - 258hp",
        "3.0 E450 - 381hp",
        "2.0 E200d - 163hp",
        "2.0 E220d - 197hp",
        "3.0 E300d - 265hp"
      ],
      "1995-2002": [
        "2.0 E200 - 136hp",
        "2.3 E230 - 150hp",
        "2.4 E240 - 170hp",
        "2.8 E280 - 193hp",
        "3.2 E320 - 224hp",
        "4.3 E430 - 279hp",
        "5.5 E55 AMG - 354hp",
        "2.0 E200 D - 102hp",
        "2.5 E250 D - 113hp",
        "2.9 E290 TD - 129hp",
        "3.0 E300 TD - 177hp"
      ],
      "2003-2009": [
        "1.8 E200 - 163hp",
        "2.5 E230 - 204hp",
        "3.0 E280 - 231hp",
        "3.5 E350 - 272hp",
        "2.1 E200 CDI - 136hp",
        "2.1 E220 CDI - 170hp",
        "3.0 E320 CDI - 224hp"
      ],
      "2010-2016": [
        "1.8 E200 - 184hp",
        "2.0 E250 - 211hp",
        "3.0 E300 - 231hp",
        "3.5 E350 - 306hp",
        "5.5 E63 AMG - 557hp",
        "2.1 E200 CDI - 136hp",
        "2.1 E220 CDI - 170hp",
        "3.0 E350 CDI - 265hp"
      ],
      "2017-2023": [
        "2.0 E200 - 184hp",
        "2.0 E250 - 211hp",
        "2.0 E300 - 245hp",
        "3.0 E400 - 333hp",
        "4.0 E63 AMG - 612hp",
        "2.0 E200d - 150hp",
        "2.0 E220d - 194hp",
        "3.0 E350d - 286hp"
      ],
      "2025-2026": [
        "2.0 E200 Mild Hybrid - 204hp",
        "2.0 E300 Mild Hybrid - 258hp",
        "3.0 E450 Mild Hybrid - 381hp",
        "2.0 E220d Mild Hybrid - 197hp",
        "2.0 E300e PHEV - 313hp"
      ]
    },
    "gla": {
      "2014-2019": [
        "1.6 GLA180 - 122hp",
        "2.0 GLA200 - 156hp",
        "2.0 GLA250 - 211hp",
        "2.0 GLA45 AMG - 360hp",
        "1.5 GLA180d - 109hp",
        "2.1 GLA200d - 136hp",
        "2.1 GLA220d - 177hp"
      ],
      "2020-2024": [
        "1.3 GLA180 - 136hp",
        "2.0 GLA200 - 163hp",
        "2.0 GLA250 - 224hp",
        "2.0 GLA35 AMG - 306hp",
        "2.0 GLA45 AMG - 421hp",
        "2.0 GLA200d - 150hp",
        "2.0 GLA220d - 190hp"
      ],
      "2025-2026": [
        "2.0 GLA200 Mild Hybrid - 163hp",
        "2.0 GLA250 Mild Hybrid - 224hp",
        "2.0 GLA35 AMG - 306hp",
        "2.0 GLA200d Mild Hybrid - 150hp",
        "2.0 GLA250e PHEV - 218hp"
      ]
    },
    "glc": {
      "2016-2019": [
        "2.0 GLC200 - 184hp",
        "2.0 GLC250 - 211hp",
        "2.0 GLC300 - 245hp",
        "3.0 GLC43 AMG - 367hp",
        "2.1 GLC220d - 170hp",
        "2.1 GLC250d - 204hp",
        "3.0 GLC350d - 258hp"
      ],
      "2020-2024": [
        "2.0 GLC200 - 197hp",
        "2.0 GLC300 - 258hp",
        "3.0 GLC43 AMG - 390hp",
        "4.0 GLC63 AMG - 476hp",
        "2.0 GLC200d - 163hp",
        "2.0 GLC220d - 194hp",
        "2.0 GLC300d - 245hp"
      ],
      "2025-2026": [
        "2.0 GLC200 Mild Hybrid - 204hp",
        "2.0 GLC300 Mild Hybrid - 258hp",
        "2.0 GLC300e PHEV - 313hp",
        "2.0 GLC220d Mild Hybrid - 200hp",
        "3.0 GLC43 AMG - 421hp"
      ]
    },
    "gle": {
      "2012-2015": [
        "3.0 GLE350 - 306hp",
        "3.5 GLE400 - 333hp",
        "4.7 GLE450 - 435hp",
        "2.1 GLE250d - 204hp",
        "3.0 GLE350d - 258hp"
      ],
      "2016-2019": [
        "2.0 GLE300 - 245hp",
        "3.0 GLE400 - 333hp",
        "3.0 GLE43 AMG - 390hp",
        "2.1 GLE250d - 204hp",
        "3.0 GLE350d - 258hp",
        "3.0 GLE400d - 340hp"
      ],
      "2020-2024": [
        "2.0 GLE300 - 258hp",
        "3.0 GLE450 - 367hp",
        "3.0 GLE53 AMG - 435hp",
        "4.0 GLE63 AMG - 612hp",
        "2.0 GLE300d - 245hp",
        "3.0 GLE350d - 286hp",
        "3.0 GLE400d - 330hp"
      ],
      "2025-2026": [
        "2.0 GLE300 Mild Hybrid - 258hp",
        "3.0 GLE450 Mild Hybrid - 381hp",
        "3.0 GLE350de PHEV - 320hp",
        "3.0 GLE350d Mild Hybrid - 286hp",
        "3.0 GLE53 AMG - 449hp"
      ]
    },
    "b-class": {
      "2005-2011": [
        "1.5 B150 - 95hp",
        "1.7 B170 - 116hp",
        "2.0 B200 - 136hp",
        "2.0 B200 Turbo - 193hp",
        "1.5 B150 CDI - 95hp",
        "1.8 B180 CDI - 109hp",
        "2.0 B200 CDI - 140hp"
      ],
      "2012-2018": [
        "1.6 B180 - 122hp",
        "2.0 B200 - 156hp",
        "2.0 B250 - 211hp",
        "1.5 B160 CDI - 90hp",
        "1.8 B180 CDI - 109hp",
        "2.1 B200 CDI - 136hp",
        "2.1 B220 CDI - 177hp"
      ],
      "2019-2024": [
        "1.3 B180 - 136hp",
        "2.0 B200 - 163hp",
        "2.0 B250 - 224hp",
        "1.5 B180d - 116hp",
        "2.0 B200d - 150hp",
        "2.0 B220d - 190hp"
      ]
    },
    "s-class": {
      "2006-2013": [
        "3.0 S300 - 231hp",
        "3.5 S350 - 272hp",
        "4.7 S450 - 340hp",
        "5.5 S500 - 388hp",
        "6.0 S600 - 517hp",
        "3.0 S320 CDI - 235hp",
        "3.0 S350 CDI - 258hp"
      ],
      "2014-2020": [
        "3.0 S400 - 333hp",
        "4.7 S500 - 455hp",
        "6.0 S600 - 530hp",
        "3.0 S350d - 286hp",
        "3.0 S400d - 340hp"
      ],
      "2021-2024": [
        "3.0 S450 - 367hp",
        "4.0 S500 - 435hp",
        "4.0 S580 - 503hp",
        "3.0 S350d - 286hp",
        "3.0 S400d - 330hp"
      ]
    },
    "cla": {
      "2013-2019": [
        "1.6 CLA180 - 122hp",
        "2.0 CLA200 - 156hp",
        "2.0 CLA250 - 211hp",
        "2.0 CLA45 AMG - 381hp",
        "1.5 CLA180d - 109hp",
        "2.1 CLA200d - 136hp",
        "2.1 CLA220d - 177hp"
      ],
      "2020-2024": [
        "1.3 CLA180 - 136hp",
        "2.0 CLA200 - 163hp",
        "2.0 CLA250 - 224hp",
        "2.0 CLA35 AMG - 306hp",
        "2.0 CLA45 AMG - 421hp",
        "1.5 CLA180d - 116hp",
        "2.0 CLA200d - 150hp",
        "2.0 CLA220d - 190hp"
      ]
    },
    "cls": {
      "2004-2010": [
        "3.0 CLS350 - 272hp",
        "5.0 CLS500 - 388hp",
        "5.5 CLS55 AMG - 476hp",
        "6.3 CLS63 AMG - 514hp",
        "3.0 CLS320 CDI - 224hp"
      ],
      "2011-2018": [
        "3.0 CLS350 - 306hp",
        "4.7 CLS500 - 408hp",
        "5.5 CLS63 AMG - 557hp",
        "2.1 CLS250 CDI - 204hp",
        "3.0 CLS350 CDI - 265hp"
      ],
      "2019-2024": [
        "3.0 CLS450 - 367hp",
        "3.0 CLS53 AMG - 435hp",
        "2.0 CLS300d - 245hp",
        "3.0 CLS350d - 286hp",
        "3.0 CLS400d - 340hp"
      ]
    },
    "glb": {
      "2020-2024": [
        "1.3 GLB200 - 163hp",
        "2.0 GLB250 - 224hp",
        "2.0 GLB35 AMG - 306hp",
        "2.0 GLB200d - 150hp",
        "2.0 GLB220d - 190hp"
      ]
    },
    "gls": {
      "2016-2019": [
        "3.0 GLS350d - 258hp",
        "3.0 GLS400 - 333hp",
        "4.7 GLS500 - 455hp",
        "5.5 GLS63 AMG - 585hp"
      ],
      "2020-2024": [
        "3.0 GLS450 - 367hp",
        "4.0 GLS580 - 489hp",
        "4.0 GLS63 AMG - 612hp",
        "3.0 GLS350d - 286hp",
        "3.0 GLS400d - 330hp"
      ]
    },
    "g-class": {
      "2000-2018": [
        "3.0 G350 - 211hp",
        "5.0 G500 - 388hp",
        "5.5 G55 AMG - 507hp",
        "6.3 G63 AMG - 544hp",
        "3.0 G350d - 245hp"
      ],
      "2019-2024": [
        "3.0 G350 - 286hp",
        "4.0 G500 - 422hp",
        "4.0 G63 AMG - 585hp",
        "3.0 G350d - 286hp",
        "2.9 G400d - 330hp"
      ]
    },
    "sl": {
      "2001-2011": [
        "3.7 SL350 - 245hp",
        "5.0 SL500 - 388hp",
        "5.5 SL55 AMG - 517hp",
        "6.0 SL600 - 517hp",
        "6.3 SL63 AMG - 525hp",
        "6.5 SL65 AMG - 612hp"
      ],
      "2012-2020": [
        "3.0 SL350 - 306hp",
        "3.5 SL400 - 333hp",
        "4.7 SL500 - 435hp",
        "5.5 SL63 AMG - 585hp",
        "6.0 SL65 AMG - 630hp"
      ]
    },
    "slc": {
      "2016-2020": [
        "1.6 SLC180 - 156hp",
        "2.0 SLC200 - 184hp",
        "2.0 SLC300 - 245hp",
        "3.0 SLC43 AMG - 367hp"
      ]
    },
    "amg-gt": {
      "2015-2024": [
        "4.0 AMG GT - 476hp",
        "4.0 AMG GT S - 522hp",
        "4.0 AMG GT C - 557hp",
        "4.0 AMG GT R - 585hp"
      ]
    },
    "eqc": {
      "2019-2024": [
        "Electric EQC400 - 408hp"
      ]
    },
    "eqa": {
      "2021-2024": [
        "Electric EQA250 - 190hp",
        "Electric EQA350 - 292hp"
      ]
    },
    "eqb": {
      "2022-2024": [
        "Electric EQB250 - 190hp",
        "Electric EQB350 - 292hp"
      ]
    },
    "eqs": {
      "2022-2024": [
        "Electric 450+ - 333hp",
        "Electric 500 - 449hp",
        "Electric AMG 53 - 658hp"
      ]
    },
    "eqe": {
      "2022-2024": [
        "Electric 300 - 245hp",
        "Electric 350+ - 292hp",
        "Electric AMG 43 - 476hp",
        "Electric AMG 53 - 687hp"
      ]
    },
    "v-class": {
      "2015-2024": [
        "2.0 V200d - 136hp",
        "2.0 V220d - 163hp",
        "2.0 V250d - 190hp",
        "2.0 V300d - 239hp"
      ]
    },
    "vito": {
      "2015-2024": [
        "1.6 109 CDI - 88hp",
        "1.6 111 CDI - 114hp",
        "2.0 114 CDI - 136hp",
        "2.0 116 CDI - 163hp",
        "2.0 119 CDI - 190hp"
      ]
    },
    "sprinter": {
      "2019-2024": [
        "2.0 314 CDI - 143hp",
        "2.0 316 CDI - 163hp",
        "2.0 319 CDI - 190hp",
        "2.0 324 CDI - 245hp"
      ]
    },
    "a35-amg": {
      "2019-2024": [
        "2.0 - 306hp"
      ]
    },
    "a45-amg": {
      "2014-2019": [
        "2.0 - 381hp"
      ],
      "2020-2024": [
        "2.0 - 421hp"
      ]
    },
    "c43-amg": {
      "2016-2024": [
        "3.0 V6 - 390hp"
      ]
    },
    "c63-amg": {
      "2008-2014": [
        "6.2 V8 - 457hp"
      ],
      "2015-2024": [
        "4.0 V8 - 476hp",
        "4.0 V8 S - 510hp"
      ]
    },
    "e43-amg": {
      "2017-2024": [
        "3.0 V6 - 401hp"
      ]
    },
    "e63-amg": {
      "2010-2016": [
        "5.5 V8 - 557hp"
      ],
      "2017-2024": [
        "4.0 V8 - 612hp"
      ]
    },
    "glc43-amg": {
      "2017-2024": [
        "3.0 V6 - 390hp"
      ]
    },
    "glc63-amg": {
      "2018-2024": [
        "4.0 V8 - 476hp",
        "4.0 V8 S - 510hp"
      ]
    },
    "gle43-amg": {
      "2017-2024": [
        "3.0 V6 - 390hp"
      ]
    },
    "gle63-amg": {
      "2016-2019": [
        "5.5 V8 - 557hp"
      ],
      "2020-2024": [
        "4.0 V8 - 612hp"
      ]
    }
  },
  "vauxhall": {
    "corsa": {
      "2006-2010": [
        "1.0 - 60hp",
        "1.2 - 80hp",
        "1.4 - 90hp",
        "1.6 Turbo - 192hp",
        "1.3 CDTi - 75hp",
        "1.3 CDTi - 90hp",
        "1.7 CDTi - 125hp"
      ],
      "2011-2014": [
        "1.0 - 65hp",
        "1.2 - 85hp",
        "1.4 - 100hp",
        "1.4 Turbo - 120hp",
        "1.6 Turbo VXR - 192hp",
        "1.3 CDTi - 75hp",
        "1.3 CDTi - 95hp"
      ],
      "2015-2019": [
        "1.0 - 90hp",
        "1.2 - 70hp",
        "1.4 - 90hp",
        "1.4 Turbo - 100hp",
        "1.6 Turbo VXR - 202hp",
        "1.3 CDTi - 75hp",
        "1.3 CDTi - 95hp"
      ],
      "2020-2024": [
        "1.2 - 75hp",
        "1.2 Turbo - 100hp",
        "1.2 Turbo - 130hp",
        "1.5 Turbo D - 100hp",
        "1.5 Turbo D - 130hp",
        "Electric - 136hp"
      ],
      "2025-2026": [
        "1.2 Hybrid - 100hp",
        "1.2 Hybrid - 136hp",
        "Electric - 136hp",
        "Electric - 156hp"
      ]
    },
    "astra": {
      "2004-2009": [
        "1.4 - 90hp",
        "1.6 - 105hp",
        "1.8 - 140hp",
        "2.0 Turbo - 200hp",
        "1.3 CDTi - 90hp",
        "1.7 CDTi - 110hp",
        "1.9 CDTi - 120hp",
        "1.9 CDTi - 150hp"
      ],
      "2010-2015": [
        "1.4 - 100hp",
        "1.4 Turbo - 120hp",
        "1.4 Turbo - 140hp",
        "1.6 - 115hp",
        "1.6 Turbo - 180hp",
        "2.0 Turbo VXR - 280hp",
        "1.3 CDTi - 95hp",
        "1.7 CDTi - 110hp",
        "1.7 CDTi - 130hp",
        "2.0 CDTi - 165hp"
      ],
      "2016-2021": [
        "1.0 Turbo - 105hp",
        "1.4 Turbo - 125hp",
        "1.4 Turbo - 145hp",
        "1.6 Turbo - 200hp",
        "1.5 Turbo D - 105hp",
        "1.5 Turbo D - 122hp",
        "1.6 Turbo D - 136hp",
        "2.0 Turbo D - 170hp"
      ],
      "2022-2024": [
        "1.2 Turbo - 110hp",
        "1.2 Turbo - 130hp",
        "1.5 Turbo D - 130hp",
        "1.6 Hybrid - 180hp",
        "Electric - 156hp"
      ],
      "2025-2026": [
        "1.2 Turbo - 130hp",
        "1.2 Hybrid - 136hp",
        "1.6 Hybrid - 180hp",
        "Electric - 156hp"
      ]
    },
    "insignia": {
      "2009-2013": [
        "1.6 - 115hp",
        "1.8 - 140hp",
        "2.0 Turbo - 220hp",
        "2.8 V6 Turbo - 260hp",
        "2.0 CDTi - 130hp",
        "2.0 CDTi - 160hp",
        "2.0 CDTi - 190hp"
      ],
      "2014-2017": [
        "1.4 Turbo - 140hp",
        "1.6 Turbo - 170hp",
        "2.0 Turbo - 250hp",
        "2.8 V6 Turbo VXR - 325hp",
        "1.6 CDTi - 110hp",
        "1.6 CDTi - 136hp",
        "2.0 CDTi - 140hp",
        "2.0 CDTi - 170hp"
      ],
      "2018-2024": [
        "1.5 Turbo - 140hp",
        "1.5 Turbo - 165hp",
        "2.0 Turbo - 230hp",
        "1.5 Turbo D - 122hp",
        "2.0 Turbo D - 170hp"
      ]
    },
    "mokka": {
      "2013-2019": [
        "1.4 - 140hp",
        "1.4 Turbo - 140hp",
        "1.6 - 115hp",
        "1.7 CDTi - 130hp"
      ],
      "2020-2024": [
        "1.2 Turbo - 100hp",
        "1.2 Turbo - 130hp",
        "1.5 Turbo D - 110hp"
      ]
    },
    "crossland": {
      "2017-2024": [
        "1.2 - 83hp",
        "1.2 Turbo - 110hp",
        "1.2 Turbo - 130hp",
        "1.5 Turbo D - 102hp",
        "1.5 Turbo D - 120hp"
      ]
    },
    "grandland": {
      "2018-2024": [
        "1.2 Turbo - 130hp",
        "1.6 Turbo - 180hp",
        "1.6 PHEV - 300hp",
        "1.5 Turbo D - 130hp",
        "2.0 Turbo D - 177hp"
      ]
    },
    "combo": {
      "2012-2018": [
        "1.4 - 95hp",
        "1.6 CDTi - 90hp",
        "1.6 CDTi - 105hp"
      ],
      "2019-2024": [
        "1.2 Turbo - 110hp",
        "1.5 Turbo D - 100hp",
        "1.5 Turbo D - 130hp"
      ]
    },
    "vivaro": {
      "2014-2019": [
        "1.6 CDTi - 90hp",
        "1.6 CDTi - 120hp",
        "1.6 CDTi - 145hp"
      ],
      "2020-2024": [
        "1.5 Turbo D - 100hp",
        "1.5 Turbo D - 120hp",
        "2.0 Turbo D - 120hp",
        "2.0 Turbo D - 150hp",
        "2.0 Turbo D - 180hp"
      ]
    },
    "movano": {
      "2010-2021": [
        "2.3 CDTi - 100hp",
        "2.3 CDTi - 125hp",
        "2.3 CDTi - 145hp",
        "2.3 CDTi - 165hp"
      ]
    },
    "corsa-e": {
      "2020-2024": [
        "Electric - 136hp"
      ]
    },
    "mokka-e": {
      "2021-2024": [
        "Electric - 136hp"
      ]
    },
    "zafira": {
      "2005-2014": [
        "1.6 - 115hp",
        "1.8 - 140hp",
        "2.2 - 150hp",
        "1.7 CDTi - 110hp",
        "1.9 CDTi - 120hp",
        "1.9 CDTi - 150hp",
        "2.0 CDTi - 165hp"
      ],
      "2015-2019": [
        "1.4 Turbo - 120hp",
        "1.4 Turbo - 140hp",
        "1.6 - 115hp",
        "1.6 CDTi - 120hp",
        "2.0 CDTi - 170hp"
      ]
    },
    "ampera": {
      "2012-2015": [
        "1.4 Electric Range Extender - 150hp"
      ]
    },
    "corsa-vxr": {
      "2007-2014": [
        "1.6 Turbo - 192hp"
      ],
      "2015-2019": [
        "1.6 Turbo - 202hp"
      ]
    },
    "astra-vxr": {
      "2005-2010": [
        "2.0 Turbo - 240hp"
      ],
      "2011-2015": [
        "2.0 Turbo - 280hp"
      ]
    }
  },
  "nissan": {
    "micra": {
      "2003-2010": [
        "1.0 - 65hp",
        "1.2 - 80hp",
        "1.4 - 88hp",
        "1.6 - 110hp",
        "1.5 dCi - 65hp",
        "1.5 dCi - 82hp"
      ],
      "2011-2016": [
        "1.2 - 80hp",
        "1.2 DIG-S - 98hp",
        "1.5 dCi - 90hp"
      ],
      "2017-2024": [
        "0.9 IG-T - 90hp",
        "1.0 IG-T - 100hp",
        "1.5 dCi - 90hp"
      ]
    },
    "note": {
      "2006-2012": [
        "1.4 - 88hp",
        "1.6 - 110hp",
        "1.5 dCi - 68hp",
        "1.5 dCi - 86hp",
        "1.5 dCi - 90hp"
      ],
      "2013-2020": [
        "1.2 - 80hp",
        "1.2 DIG-S - 98hp",
        "1.5 dCi - 90hp"
      ],
      "2021-2024": [
        "1.0 IG-T - 100hp",
        "1.3 DIG-T - 140hp"
      ]
    },
    "pulsar": {
      "2014-2018": [
        "1.2 DIG-T - 115hp",
        "1.6 DIG-T - 190hp",
        "1.5 dCi - 110hp"
      ]
    },
    "juke": {
      "2010-2014": [
        "1.2 DIG-T - 115hp",
        "1.6 - 94hp",
        "1.6 - 117hp",
        "1.6 Turbo - 190hp",
        "1.5 dCi - 110hp"
      ],
      "2015-2019": [
        "1.2 DIG-T - 115hp",
        "1.6 - 112hp",
        "1.6 DIG-T - 163hp",
        "1.6 Nismo - 218hp",
        "1.5 dCi - 110hp"
      ],
      "2020-2024": [
        "1.0 DIG-T - 114hp",
        "1.3 DIG-T - 140hp",
        "1.6 Hybrid - 143hp"
      ],
      "2025-2026": [
        "1.0 DIG-T - 114hp",
        "1.3 DIG-T - 140hp",
        "1.6 Hybrid - 143hp"
      ]
    },
    "qashqai": {
      "2007-2013": [
        "1.6 - 114hp",
        "2.0 - 141hp",
        "1.5 dCi - 106hp",
        "1.5 dCi - 110hp",
        "1.6 dCi - 130hp",
        "2.0 dCi - 150hp"
      ],
      "2014-2020": [
        "1.2 DIG-T - 115hp",
        "1.6 DIG-T - 163hp",
        "1.5 dCi - 110hp",
        "1.6 dCi - 130hp",
        "1.7 dCi - 150hp"
      ],
      "2021-2024": [
        "1.3 DIG-T - 140hp",
        "1.3 DIG-T - 158hp",
        "1.5 e-Power - 158hp",
        "1.5 e-Power e-4ORCE - 190hp"
      ],
      "2025-2026": [
        "1.3 DIG-T - 140hp",
        "1.3 DIG-T - 158hp",
        "1.5 e-Power - 190hp",
        "1.5 e-Power e-4ORCE - 213hp"
      ]
    },
    "x-trail": {
      "2007-2013": [
        "2.0 - 141hp",
        "2.5 - 169hp",
        "1.6 dCi - 130hp",
        "2.0 dCi - 150hp",
        "2.0 dCi - 173hp"
      ],
      "2014-2021": [
        "1.6 DIG-T - 163hp",
        "1.7 dCi - 150hp",
        "2.0 dCi - 177hp"
      ],
      "2022-2024": [
        "1.5 e-Power - 204hp",
        "1.5 e-Power e-4ORCE - 213hp"
      ],
      "2025-2026": [
        "1.5 e-Power - 204hp",
        "1.5 e-Power e-4ORCE - 213hp"
      ]
    },
    "leaf": {
      "2011-2017": [
        "Electric - 109hp"
      ],
      "2018-2022": [
        "Electric - 150hp",
        "Electric - 217hp"
      ],
      "2023-2024": [
        "Electric - 150hp",
        "Electric e+ - 217hp"
      ],
      "2025-2026": [
        "Electric - 150hp",
        "Electric e+ - 217hp"
      ]
    },
    "gt-r": {
      "2009-2016": [
        "3.8 V6 Twin Turbo - 550hp"
      ],
      "2017-2024": [
        "3.8 V6 Twin Turbo - 570hp"
      ]
    },
    "navara": {
      "2005-2015": [
        "2.5 dCi - 144hp",
        "2.5 dCi - 174hp",
        "2.5 dCi - 190hp",
        "3.0 dCi - 231hp"
      ],
      "2016-2024": [
        "2.3 dCi - 160hp",
        "2.3 dCi - 190hp"
      ]
    },
    "nv200": {
      "2010-2024": [
        "1.5 dCi - 90hp",
        "1.5 dCi - 110hp",
        "1.6 - 109hp"
      ]
    },
    "nv300": {
      "2016-2024": [
        "1.6 dCi - 95hp",
        "1.6 dCi - 120hp",
        "1.6 dCi - 145hp"
      ]
    },
    "nv400": {
      "2011-2024": [
        "2.3 dCi - 110hp",
        "2.3 dCi - 125hp",
        "2.3 dCi - 145hp",
        "2.3 dCi - 165hp"
      ]
    },
    "ariya": {
      "2022-2024": [
        "Electric 63kWh - 218hp",
        "Electric 87kWh - 242hp",
        "Electric 87kWh e-4ORCE - 306hp"
      ],
      "2025-2026": [
        "Electric 63kWh - 218hp",
        "Electric 87kWh - 242hp",
        "Electric 87kWh e-4ORCE - 306hp",
        "Electric NISMO - 435hp"
      ]
    },
    "370z": {
      "2009-2020": [
        "3.7 V6 - 328hp",
        "3.7 V6 Nismo - 350hp"
      ]
    },
    "350z": {
      "2003-2009": [
        "3.5 V6 - 280hp",
        "3.5 V6 - 300hp",
        "3.5 V6 - 313hp"
      ]
    },
    "patrol": {
      "1998-2010": [
        "2.8 TD - 129hp",
        "3.0 TD - 158hp",
        "4.8 - 248hp"
      ],
      "2011-2024": [
        "5.6 V8 - 400hp"
      ]
    },
    "pathfinder": {
      "2005-2014": [
        "2.5 dCi - 174hp",
        "2.5 dCi - 190hp",
        "3.0 dCi - 231hp",
        "4.0 V6 - 269hp"
      ],
      "2015-2024": [
        "2.3 dCi - 190hp",
        "2.5 - 184hp",
        "3.5 V6 - 284hp"
      ]
    },
    "primastar": {
      "2002-2014": [
        "1.9 dCi - 82hp",
        "1.9 dCi - 100hp",
        "2.0 dCi - 114hp",
        "2.0 dCi - 150hp"
      ],
      "2015-2024": [
        "1.6 dCi - 120hp",
        "1.6 dCi - 145hp",
        "2.0 dCi - 150hp"
      ]
    },
    "interstar": {
      "2004-2024": [
        "2.5 dCi - 115hp",
        "2.5 dCi - 145hp",
        "2.3 dCi - 110hp",
        "2.3 dCi - 150hp",
        "2.3 dCi - 170hp"
      ]
    },
    "pixo": {
      "2009-2013": [
        "1.0 - 68hp"
      ]
    }
  },
  "peugeot": {
    "108": {
      "2014-2021": [
        "1.0 - 68hp",
        "1.2 - 82hp"
      ]
    },
    "208": {
      "2012-2019": [
        "1.0 - 68hp",
        "1.2 - 82hp",
        "1.2 PureTech - 110hp",
        "1.6 THP - 165hp",
        "1.6 GTi - 208hp",
        "1.4 HDi - 68hp",
        "1.6 BlueHDi - 75hp",
        "1.6 BlueHDi - 100hp",
        "1.6 BlueHDi - 120hp"
      ],
      "2020-2024": [
        "1.2 PureTech - 75hp",
        "1.2 PureTech - 100hp",
        "1.2 PureTech - 130hp",
        "1.5 BlueHDi - 100hp",
        "1.5 BlueHDi - 130hp",
        "Electric - 136hp",
        "Electric - 156hp"
      ],
      "2025-2026": [
        "1.2 Hybrid - 100hp",
        "1.2 Hybrid - 136hp",
        "Electric - 136hp",
        "Electric - 156hp"
      ]
    },
    "307": {
      "2001-2008": [
        "1.4 - 90hp",
        "1.6 - 110hp",
        "2.0 - 140hp",
        "1.6 HDi - 90hp",
        "1.6 HDi - 110hp",
        "2.0 HDi - 90hp",
        "2.0 HDi - 110hp",
        "2.0 HDi - 136hp"
      ]
    },
    "308": {
      "2007-2013": [
        "1.4 - 95hp",
        "1.6 - 120hp",
        "1.6 THP - 140hp",
        "1.6 THP - 156hp",
        "1.6 THP - 200hp",
        "1.6 HDi - 90hp",
        "1.6 HDi - 110hp",
        "2.0 HDi - 136hp",
        "2.0 HDi - 163hp"
      ],
      "2014-2021": [
        "1.2 PureTech - 110hp",
        "1.2 PureTech - 130hp",
        "1.6 THP - 125hp",
        "1.6 THP - 165hp",
        "1.6 THP - 270hp",
        "1.5 BlueHDi - 100hp",
        "1.5 BlueHDi - 130hp",
        "1.6 BlueHDi - 120hp",
        "2.0 BlueHDi - 150hp",
        "2.0 BlueHDi - 180hp"
      ],
      "2022-2024": [
        "1.2 PureTech - 110hp",
        "1.2 PureTech - 130hp",
        "1.6 PureTech - 180hp",
        "1.5 BlueHDi - 130hp",
        "1.2 Hybrid - 136hp"
      ],
      "2025-2026": [
        "1.2 Hybrid - 136hp",
        "1.6 Hybrid - 195hp",
        "Electric - 156hp"
      ]
    },
    "407": {
      "2004-2011": [
        "1.8 - 125hp",
        "2.0 - 140hp",
        "2.2 - 158hp",
        "3.0 V6 - 211hp",
        "1.6 HDi - 110hp",
        "2.0 HDi - 136hp",
        "2.0 HDi - 163hp",
        "2.7 HDi - 204hp"
      ]
    },
    "508": {
      "2011-2018": [
        "1.6 THP - 156hp",
        "1.6 THP - 165hp",
        "2.0 - 140hp",
        "2.0 THP - 204hp",
        "1.6 HDi - 115hp",
        "1.6 HDi - 120hp",
        "2.0 HDi - 140hp",
        "2.0 HDi - 163hp",
        "2.0 HDi - 180hp"
      ],
      "2019-2024": [
        "1.5 BlueHDi - 130hp",
        "1.6 PureTech - 180hp",
        "1.6 PureTech - 225hp",
        "2.0 BlueHDi - 163hp",
        "2.0 BlueHDi - 180hp",
        "1.6 Hybrid - 225hp",
        "1.6 Hybrid4 - 360hp"
      ],
      "2025-2026": [
        "1.2 Hybrid - 136hp",
        "1.6 Hybrid - 225hp",
        "1.6 Hybrid4 - 360hp"
      ]
    },
    "2008": {
      "2013-2019": [
        "1.2 - 82hp",
        "1.2 PureTech - 110hp",
        "1.6 THP - 165hp",
        "1.4 HDi - 68hp",
        "1.6 HDi - 92hp",
        "1.6 BlueHDi - 100hp",
        "1.6 BlueHDi - 120hp"
      ],
      "2020-2024": [
        "1.2 PureTech - 100hp",
        "1.2 PureTech - 130hp",
        "1.5 BlueHDi - 110hp",
        "1.5 BlueHDi - 130hp"
      ]
    },
    "3008": {
      "2009-2016": [
        "1.6 - 120hp",
        "1.6 THP - 156hp",
        "1.6 THP - 165hp",
        "1.6 HDi - 112hp",
        "1.6 HDi - 115hp",
        "2.0 HDi - 136hp",
        "2.0 HDi - 150hp",
        "2.0 HDi - 163hp"
      ],
      "2017-2024": [
        "1.2 PureTech - 130hp",
        "1.6 PureTech - 180hp",
        "1.6 PureTech - 300hp",
        "1.5 BlueHDi - 130hp",
        "2.0 BlueHDi - 163hp",
        "2.0 BlueHDi - 180hp"
      ]
    },
    "4007": {
      "2007-2012": [
        "2.2 HDi - 156hp",
        "2.4 - 170hp"
      ]
    },
    "5008": {
      "2009-2016": [
        "1.6 THP - 156hp",
        "1.6 THP - 165hp",
        "1.6 HDi - 112hp",
        "1.6 HDi - 115hp",
        "2.0 HDi - 150hp",
        "2.0 HDi - 163hp"
      ],
      "2017-2024": [
        "1.2 PureTech - 130hp",
        "1.6 PureTech - 180hp",
        "1.5 BlueHDi - 130hp",
        "2.0 BlueHDi - 163hp",
        "2.0 BlueHDi - 180hp"
      ]
    },
    "rifter": {
      "2018-2024": [
        "1.2 PureTech - 110hp",
        "1.5 BlueHDi - 100hp",
        "1.5 BlueHDi - 130hp"
      ]
    },
    "partner": {
      "2008-2018": [
        "1.6 - 98hp",
        "1.6 VTi - 120hp",
        "1.6 HDi - 75hp",
        "1.6 HDi - 90hp",
        "1.6 HDi - 115hp"
      ],
      "2019-2024": [
        "1.2 PureTech - 110hp",
        "1.5 BlueHDi - 100hp",
        "1.5 BlueHDi - 130hp"
      ]
    },
    "boxer": {
      "2006-2014": [
        "2.2 HDi - 100hp",
        "2.2 HDi - 110hp",
        "2.2 HDi - 120hp",
        "2.2 HDi - 130hp",
        "3.0 HDi - 156hp",
        "3.0 HDi - 180hp"
      ],
      "2015-2024": [
        "2.0 BlueHDi - 130hp",
        "2.0 BlueHDi - 140hp",
        "2.0 BlueHDi - 165hp",
        "2.2 BlueHDi - 140hp",
        "2.2 BlueHDi - 165hp"
      ]
    },
    "e-208": {
      "2020-2024": [
        "Electric - 136hp",
        "Electric - 156hp"
      ],
      "2025-2026": [
        "Electric - 156hp"
      ]
    },
    "e-2008": {
      "2020-2024": [
        "Electric - 136hp",
        "Electric - 156hp"
      ],
      "2025-2026": [
        "Electric - 156hp"
      ]
    },
    "expert": {
      "2007-2016": [
        "2.0 HDi - 120hp",
        "2.0 HDi - 136hp",
        "2.0 HDi - 163hp"
      ],
      "2017-2024": [
        "1.5 BlueHDi - 100hp",
        "1.5 BlueHDi - 120hp",
        "2.0 BlueHDi - 120hp",
        "2.0 BlueHDi - 150hp",
        "2.0 BlueHDi - 180hp"
      ]
    },
    "208-gti": {
      "2013-2019": [
        "1.6 THP - 208hp"
      ]
    },
    "308-gti": {
      "2015-2021": [
        "1.6 THP - 270hp"
      ]
    },
    "rcz": {
      "2010-2015": [
        "1.6 THP - 156hp",
        "1.6 THP - 200hp",
        "1.6 THP - 270hp",
        "2.0 HDi - 163hp"
      ]
    }
  },
  "renault": {
    "clio": {
      "2005-2012": [
        "1.2 - 75hp",
        "1.4 - 98hp",
        "1.6 - 110hp",
        "2.0 RS - 197hp",
        "1.5 dCi - 65hp",
        "1.5 dCi - 85hp",
        "1.5 dCi - 106hp"
      ],
      "2013-2019": [
        "0.9 TCe - 90hp",
        "1.2 - 75hp",
        "1.2 TCe - 120hp",
        "1.6 RS - 200hp",
        "1.5 dCi - 75hp",
        "1.5 dCi - 90hp",
        "1.5 dCi - 110hp"
      ],
      "2020-2024": [
        "1.0 TCe - 90hp",
        "1.0 TCe - 100hp",
        "1.3 TCe - 130hp",
        "1.3 TCe - 140hp",
        "1.5 Blue dCi - 85hp",
        "1.5 Blue dCi - 115hp",
        "1.6 E-Tech - 145hp"
      ],
      "2025-2026": [
        "1.0 TCe - 90hp",
        "1.0 TCe - 100hp",
        "1.3 TCe - 140hp",
        "1.6 E-Tech - 145hp"
      ]
    },
    "megane": {
      "2003-2008": [
        "1.4 - 98hp",
        "1.6 - 113hp",
        "2.0 - 136hp",
        "2.0 RS - 225hp",
        "1.5 dCi - 82hp",
        "1.5 dCi - 105hp",
        "1.9 dCi - 120hp"
      ],
      "2009-2015": [
        "1.4 TCe - 130hp",
        "1.6 - 110hp",
        "2.0 - 140hp",
        "2.0 TCe - 180hp",
        "2.0 RS - 265hp",
        "1.5 dCi - 90hp",
        "1.5 dCi - 110hp",
        "1.9 dCi - 130hp"
      ],
      "2016-2022": [
        "1.2 TCe - 115hp",
        "1.2 TCe - 130hp",
        "1.6 TCe - 165hp",
        "1.8 TCe - 280hp",
        "1.5 dCi - 90hp",
        "1.5 dCi - 110hp",
        "1.6 dCi - 130hp",
        "1.7 Blue dCi - 150hp"
      ],
      "2023-2024": [
        "1.2 TCe - 130hp",
        "1.6 E-Tech - 200hp"
      ],
      "2025-2026": [
        "1.2 Mild Hybrid - 130hp",
        "1.6 E-Tech - 160hp",
        "1.6 E-Tech - 200hp"
      ]
    },
    "captur": {
      "2013-2019": [
        "0.9 TCe - 90hp",
        "1.2 TCe - 120hp",
        "1.5 dCi - 90hp",
        "1.5 dCi - 110hp"
      ],
      "2020-2024": [
        "1.0 TCe - 100hp",
        "1.3 TCe - 130hp",
        "1.3 TCe - 155hp",
        "1.5 Blue dCi - 95hp",
        "1.5 Blue dCi - 115hp",
        "1.6 E-Tech - 145hp"
      ]
    },
    "kadjar": {
      "2016-2022": [
        "1.2 TCe - 130hp",
        "1.3 TCe - 140hp",
        "1.3 TCe - 160hp",
        "1.5 dCi - 110hp",
        "1.6 dCi - 130hp",
        "1.7 Blue dCi - 150hp",
        "2.0 Blue dCi - 190hp"
      ]
    },
    "koleos": {
      "2008-2015": [
        "2.0 - 140hp",
        "2.5 - 171hp",
        "2.0 dCi - 150hp",
        "2.0 dCi - 173hp"
      ],
      "2017-2024": [
        "1.7 Blue dCi - 150hp",
        "1.7 Blue dCi - 190hp",
        "2.0 Blue dCi - 190hp"
      ]
    },
    "scenic": {
      "2003-2009": [
        "1.4 - 98hp",
        "1.6 - 113hp",
        "2.0 - 135hp",
        "1.5 dCi - 105hp",
        "1.9 dCi - 120hp",
        "1.9 dCi - 130hp"
      ],
      "2009-2016": [
        "1.4 TCe - 130hp",
        "1.6 - 110hp",
        "2.0 - 140hp",
        "1.5 dCi - 95hp",
        "1.5 dCi - 110hp",
        "1.6 dCi - 130hp",
        "1.9 dCi - 130hp"
      ],
      "2016-2023": [
        "1.2 TCe - 115hp",
        "1.2 TCe - 130hp",
        "1.3 TCe - 140hp",
        "1.5 dCi - 95hp",
        "1.5 dCi - 110hp",
        "1.6 dCi - 130hp",
        "1.7 Blue dCi - 150hp"
      ]
    },
    "trafic": {
      "2001-2014": [
        "1.9 dCi - 100hp",
        "2.0 dCi - 90hp",
        "2.0 dCi - 115hp",
        "2.5 dCi - 145hp"
      ],
      "2014-2024": [
        "1.6 dCi - 95hp",
        "1.6 dCi - 120hp",
        "1.6 dCi - 145hp",
        "2.0 dCi - 120hp",
        "2.0 dCi - 145hp",
        "2.0 dCi - 170hp"
      ]
    },
    "master": {
      "2010-2024": [
        "2.3 dCi - 100hp",
        "2.3 dCi - 125hp",
        "2.3 dCi - 135hp",
        "2.3 dCi - 145hp",
        "2.3 dCi - 165hp"
      ]
    },
    "zoe": {
      "2013-2019": [
        "Electric R90 - 88hp"
      ],
      "2020-2024": [
        "Electric R110 - 108hp",
        "Electric R135 - 135hp"
      ],
      "2025-2026": [
        "Electric R110 - 108hp",
        "Electric R135 - 135hp"
      ]
    },
    "arkana": {
      "2021-2024": [
        "1.3 TCe - 140hp",
        "1.3 TCe - 160hp",
        "1.6 E-Tech - 145hp"
      ],
      "2025-2026": [
        "1.3 TCe Mild Hybrid - 140hp",
        "1.6 E-Tech - 145hp"
      ]
    },
    "kangoo": {
      "2008-2021": [
        "1.2 TCe - 115hp",
        "1.5 dCi - 75hp",
        "1.5 dCi - 90hp",
        "1.5 dCi - 110hp"
      ],
      "2021-2024": [
        "1.3 TCe - 130hp",
        "1.5 Blue dCi - 95hp",
        "1.5 Blue dCi - 115hp"
      ],
      "2025-2026": [
        "1.3 TCe - 130hp",
        "1.5 Blue dCi - 115hp",
        "Electric - 122hp"
      ]
    },
    "twingo": {
      "2007-2014": [
        "1.2 - 58hp",
        "1.2 - 75hp",
        "1.5 dCi - 65hp",
        "1.5 dCi - 75hp"
      ],
      "2014-2024": [
        "0.9 TCe - 90hp",
        "1.0 SCe - 65hp",
        "1.0 SCe - 75hp"
      ]
    },
    "espace": {
      "2003-2014": [
        "2.0 - 170hp",
        "2.0 Turbo - 170hp",
        "3.5 V6 - 245hp",
        "1.9 dCi - 120hp",
        "2.0 dCi - 150hp",
        "2.0 dCi - 175hp"
      ],
      "2015-2024": [
        "1.6 TCe - 200hp",
        "1.8 TCe - 225hp",
        "1.6 dCi - 130hp",
        "1.6 dCi - 160hp",
        "2.0 Blue dCi - 200hp"
      ]
    },
    "laguna": {
      "2007-2015": [
        "2.0 - 140hp",
        "2.0 Turbo - 205hp",
        "3.5 V6 - 240hp",
        "1.5 dCi - 110hp",
        "2.0 dCi - 150hp",
        "2.0 dCi - 175hp"
      ]
    },
    "fluence": {
      "2010-2016": [
        "1.6 - 110hp",
        "2.0 - 140hp",
        "1.5 dCi - 90hp",
        "1.5 dCi - 110hp"
      ]
    },
    "wind": {
      "2010-2013": [
        "1.2 TCe - 100hp",
        "1.6 - 133hp"
      ]
    },
    "twizy": {
      "2012-2024": [
        "Electric - 17hp"
      ]
    },
    "clio-rs": {
      "2013-2022": [
        "1.6 Turbo - 200hp",
        "1.6 Turbo - 220hp"
      ]
    },
    "megane-rs": {
      "2010-2017": [
        "2.0 Turbo - 250hp",
        "2.0 Turbo - 265hp",
        "2.0 Turbo - 275hp"
      ],
      "2018-2024": [
        "1.8 TCe - 280hp",
        "1.8 TCe - 300hp"
      ]
    }
  },
  "seat": {
    "ibiza": {
      "2008-2012": [
        "1.2 - 60hp",
        "1.2 - 70hp",
        "1.4 - 85hp",
        "1.6 - 105hp",
        "1.4 TSI - 150hp",
        "1.9 TDI - 105hp",
        "2.0 TDI - 143hp"
      ],
      "2013-2017": [
        "1.0 - 75hp",
        "1.2 TSI - 90hp",
        "1.2 TSI - 110hp",
        "1.4 TSI - 140hp",
        "1.4 TDI - 80hp",
        "1.4 TDI - 105hp",
        "1.6 TDI - 90hp",
        "1.6 TDI - 105hp"
      ],
      "2018-2024": [
        "1.0 TSI - 95hp",
        "1.0 TSI - 110hp",
        "1.5 TSI - 150hp",
        "1.6 TDI - 80hp",
        "1.6 TDI - 95hp"
      ]
    },
    "leon": {
      "2005-2012": [
        "1.4 - 86hp",
        "1.6 - 102hp",
        "1.8 TSI - 160hp",
        "2.0 TSI - 200hp",
        "2.0 Cupra - 240hp",
        "1.9 TDI - 105hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 170hp"
      ],
      "2013-2020": [
        "1.0 TSI - 115hp",
        "1.2 TSI - 110hp",
        "1.4 TSI - 125hp",
        "1.8 TSI - 180hp",
        "2.0 TSI - 190hp",
        "2.0 Cupra - 300hp",
        "1.6 TDI - 90hp",
        "1.6 TDI - 110hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 184hp"
      ],
      "2021-2024": [
        "1.0 eTSI - 110hp",
        "1.5 eTSI - 130hp",
        "1.5 eTSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 Cupra - 300hp",
        "2.0 TDI - 150hp"
      ]
    },
    "ateca": {
      "2017-2024": [
        "1.0 TSI - 115hp",
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 Cupra - 300hp",
        "1.6 TDI - 115hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 190hp"
      ]
    },
    "arona": {
      "2018-2024": [
        "1.0 TSI - 95hp",
        "1.0 TSI - 110hp",
        "1.5 TSI - 150hp",
        "1.6 TDI - 95hp",
        "1.6 TDI - 115hp"
      ]
    },
    "tarraco": {
      "2019-2024": [
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 TSI - 245hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 200hp"
      ]
    },
    "alhambra": {
      "2010-2020": [
        "1.4 TSI - 150hp",
        "2.0 TSI - 200hp",
        "2.0 TSI - 220hp",
        "2.0 TDI - 115hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 184hp"
      ]
    },
    "mii": {
      "2012-2021": [
        "1.0 - 60hp",
        "1.0 - 75hp"
      ]
    },
    "toledo": {
      "2013-2019": [
        "1.2 TSI - 90hp",
        "1.2 TSI - 110hp",
        "1.4 TSI - 125hp",
        "1.6 TDI - 90hp",
        "1.6 TDI - 105hp",
        "1.6 TDI - 110hp"
      ]
    },
    "leon-cupra": {
      "2014-2020": [
        "2.0 TSI - 280hp",
        "2.0 TSI - 290hp",
        "2.0 TSI - 300hp"
      ]
    },
    "ibiza-cupra": {
      "2012-2015": [
        "1.4 TSI - 180hp"
      ]
    },
    "exeo": {
      "2009-2013": [
        "1.6 - 102hp",
        "1.8 TSI - 160hp",
        "2.0 TSI - 200hp",
        "1.9 TDI - 120hp",
        "2.0 TDI - 143hp",
        "2.0 TDI - 170hp"
      ]
    }
  },
  "skoda": {
    "fabia": {
      "2007-2014": [
        "1.2 - 60hp",
        "1.2 - 70hp",
        "1.4 - 86hp",
        "1.6 - 105hp",
        "1.2 TSI - 105hp",
        "1.4 TSI - 180hp",
        "1.2 TDI - 75hp",
        "1.4 TDI - 80hp",
        "1.6 TDI - 90hp",
        "1.6 TDI - 105hp"
      ],
      "2015-2021": [
        "1.0 - 60hp",
        "1.0 - 75hp",
        "1.2 TSI - 90hp",
        "1.2 TSI - 110hp",
        "1.4 TDI - 90hp",
        "1.4 TDI - 105hp"
      ],
      "2022-2024": [
        "1.0 TSI - 95hp",
        "1.0 TSI - 110hp",
        "1.5 TSI - 150hp"
      ]
    },
    "octavia": {
      "2004-2013": [
        "1.4 - 80hp",
        "1.6 - 102hp",
        "1.8 TSI - 160hp",
        "2.0 TSI - 200hp",
        "2.0 RS - 200hp",
        "1.9 TDI - 105hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 170hp"
      ],
      "2014-2019": [
        "1.0 TSI - 115hp",
        "1.2 TSI - 110hp",
        "1.4 TSI - 125hp",
        "1.4 TSI - 150hp",
        "1.8 TSI - 180hp",
        "2.0 TSI - 220hp",
        "2.0 RS - 245hp",
        "1.6 TDI - 90hp",
        "1.6 TDI - 110hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 184hp"
      ],
      "2020-2024": [
        "1.0 TSI - 110hp",
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 RS - 245hp",
        "2.0 TDI - 115hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 200hp"
      ]
    },
    "kodiaq": {
      "2017-2024": [
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 TSI - 245hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 200hp"
      ]
    },
    "superb": {
      "2008-2015": [
        "1.4 TSI - 125hp",
        "1.8 TSI - 160hp",
        "2.0 TSI - 200hp",
        "3.6 V6 - 260hp",
        "1.6 TDI - 105hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 170hp"
      ],
      "2015-2024": [
        "1.4 TSI - 150hp",
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 TSI - 280hp",
        "1.6 TDI - 120hp",
        "2.0 TDI - 150hp",
        "2.0 TDI - 190hp"
      ]
    },
    "scala": {
      "2019-2024": [
        "1.0 TSI - 95hp",
        "1.0 TSI - 110hp",
        "1.5 TSI - 150hp",
        "1.6 TDI - 115hp"
      ]
    },
    "kamiq": {
      "2020-2024": [
        "1.0 TSI - 95hp",
        "1.0 TSI - 110hp",
        "1.5 TSI - 150hp"
      ]
    },
    "karoq": {
      "2018-2024": [
        "1.0 TSI - 115hp",
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "1.6 TDI - 115hp",
        "2.0 TDI - 150hp"
      ]
    },
    "enyaq": {
      "2021-2024": [
        "Electric 60 - 179hp",
        "Electric 80 - 204hp",
        "Electric 80x - 265hp",
        "Electric RS - 299hp"
      ]
    },
    "enyaq-iv": {
      "2021-2024": [
        "Electric 60 - 179hp",
        "Electric 80 - 204hp",
        "Electric 80x - 265hp",
        "Electric vRS - 299hp"
      ]
    },
    "citigo": {
      "2012-2019": [
        "1.0 - 60hp",
        "1.0 - 75hp"
      ]
    },
    "rapid": {
      "2013-2019": [
        "1.0 TSI - 95hp",
        "1.0 TSI - 110hp",
        "1.2 TSI - 110hp",
        "1.4 TSI - 125hp",
        "1.6 TDI - 90hp",
        "1.6 TDI - 105hp",
        "1.6 TDI - 116hp"
      ]
    },
    "yeti": {
      "2009-2017": [
        "1.2 TSI - 105hp",
        "1.4 TSI - 125hp",
        "1.8 TSI - 160hp",
        "2.0 TSI - 180hp",
        "1.6 TDI - 105hp",
        "2.0 TDI - 110hp",
        "2.0 TDI - 140hp",
        "2.0 TDI - 170hp"
      ]
    },
    "roomster": {
      "2006-2015": [
        "1.2 - 64hp",
        "1.4 - 86hp",
        "1.6 - 105hp",
        "1.2 TDI - 75hp",
        "1.4 TDI - 80hp",
        "1.9 TDI - 105hp"
      ]
    },
    "octavia-vrs": {
      "2001-2005": [
        "1.8 T - 180hp"
      ],
      "2006-2013": [
        "2.0 TSI - 200hp",
        "2.0 TDI - 170hp"
      ],
      "2013-2020": [
        "2.0 TSI - 220hp",
        "2.0 TDI - 184hp"
      ],
      "2021-2024": [
        "2.0 TSI - 245hp",
        "2.0 TDI - 200hp"
      ]
    },
    "superb-scout": {
      "2020-2024": [
        "2.0 TSI - 190hp",
        "2.0 TDI - 200hp"
      ]
    }
  },
  "toyota": {
    "aygo": {
      "2005-2013": [
        "1.0 VVT-i - 68hp",
        "1.4 D-4D - 54hp"
      ],
      "2014-2021": [
        "1.0 VVT-i - 69hp",
        "1.0 VVT-i - 72hp"
      ]
    },
    "yaris": {
      "1999-2005": [
        "1.0 VVT-i - 68hp",
        "1.3 VVT-i - 87hp",
        "1.5 TS - 106hp",
        "1.4 D-4D - 75hp"
      ],
      "2006-2011": [
        "1.0 VVT-i - 69hp",
        "1.3 VVT-i - 87hp",
        "1.5 VVT-i - 106hp",
        "1.4 D-4D - 90hp"
      ],
      "2012-2019": [
        "1.0 VVT-i - 69hp",
        "1.33 VVT-i - 99hp",
        "1.5 VVT-i - 111hp",
        "1.4 D-4D - 90hp"
      ],
      "2020-2024": [
        "1.0 VVT-i - 72hp",
        "1.5 VVT-i Hybrid - 116hp",
        "1.6 GR Turbo - 261hp"
      ],
      "2025-2026": [
        "1.5 Hybrid - 116hp",
        "1.5 Hybrid - 130hp",
        "1.6 GR Turbo - 280hp"
      ]
    },
    "corolla": {
      "1997-2001": [
        "1.4 VVT-i - 97hp",
        "1.6 VVT-i - 110hp",
        "1.8 VVT-i - 125hp",
        "2.0 D-4D - 90hp"
      ],
      "2002-2006": [
        "1.4 VVT-i - 97hp",
        "1.6 VVT-i - 110hp",
        "1.8 VVT-i - 125hp",
        "2.0 D-4D - 90hp",
        "2.0 D-4D - 116hp"
      ],
      "2007-2013": [
        "1.4 VVT-i - 97hp",
        "1.6 VVT-i - 132hp",
        "1.8 VVT-i - 147hp",
        "2.0 D-4D - 126hp",
        "2.2 D-4D - 177hp"
      ],
      "2014-2018": [
        "1.33 VVT-i - 99hp",
        "1.6 VVT-i - 132hp",
        "1.8 VVT-i Hybrid - 136hp",
        "1.4 D-4D - 90hp"
      ],
      "2019-2024": [
        "1.2 Turbo - 116hp",
        "1.8 VVT-i Hybrid - 122hp",
        "2.0 VVT-i Hybrid - 184hp",
        "2.0 GR - 300hp"
      ],
      "2025-2026": [
        "1.8 Hybrid - 140hp",
        "2.0 Hybrid - 196hp",
        "2.0 GR - 300hp"
      ]
    },
    "prius": {
      "1997-2003": [
        "1.5 VVT-i Hybrid - 114hp"
      ],
      "2004-2009": [
        "1.5 VVT-i Hybrid - 77hp"
      ],
      "2010-2015": [
        "1.8 VVT-i Hybrid - 136hp"
      ],
      "2016-2024": [
        "1.8 VVT-i Hybrid - 122hp"
      ],
      "2025-2026": [
        "2.0 Plug-in Hybrid - 223hp"
      ]
    },
    "camry": {
      "1997-2001": [
        "2.0 VVT-i - 128hp",
        "2.2 VVT-i - 136hp",
        "3.0 V6 - 188hp"
      ],
      "2002-2006": [
        "2.0 VVT-i - 147hp",
        "2.4 VVT-i - 152hp",
        "3.0 V6 - 188hp",
        "2.0 D-4D - 116hp"
      ],
      "2007-2011": [
        "2.0 VVT-i - 147hp",
        "2.4 VVT-i - 167hp",
        "3.5 V6 - 277hp",
        "2.2 D-4D - 177hp"
      ],
      "2012-2017": [
        "2.0 VVT-i - 152hp",
        "2.5 VVT-i - 181hp",
        "3.5 V6 - 277hp"
      ],
      "2018-2024": [
        "2.5 VVT-i - 181hp",
        "2.5 VVT-i Hybrid - 218hp",
        "3.5 V6 - 301hp"
      ]
    },
    "c-hr": {
      "2017-2019": [
        "1.2 Turbo - 116hp",
        "1.8 VVT-i Hybrid - 122hp"
      ],
      "2020-2024": [
        "1.2 Turbo - 116hp",
        "1.8 VVT-i Hybrid - 122hp",
        "2.0 VVT-i Hybrid - 184hp"
      ],
      "2025-2026": [
        "1.8 Hybrid - 140hp",
        "2.0 Hybrid - 198hp",
        "2.0 PHEV - 223hp"
      ]
    },
    "rav4": {
      "1994-2000": [
        "2.0 VVT-i - 129hp",
        "2.0 D-4D - 116hp"
      ],
      "2001-2005": [
        "1.8 VVT-i - 125hp",
        "2.0 VVT-i - 152hp",
        "2.0 D-4D - 116hp"
      ],
      "2006-2012": [
        "2.0 VVT-i - 152hp",
        "2.4 VVT-i - 170hp",
        "3.5 V6 - 277hp",
        "2.2 D-4D - 136hp",
        "2.2 D-4D - 177hp"
      ],
      "2013-2018": [
        "2.0 VVT-i - 152hp",
        "2.5 VVT-i Hybrid - 197hp",
        "2.0 D-4D - 124hp",
        "2.2 D-4D - 150hp"
      ],
      "2019-2024": [
        "2.0 VVT-i - 173hp",
        "2.5 VVT-i Hybrid - 218hp",
        "2.5 PHEV - 306hp"
      ],
      "2025-2026": [
        "2.5 Hybrid - 222hp",
        "2.5 Hybrid AWD-i - 222hp",
        "2.5 Plug-in Hybrid - 306hp"
      ]
    },
    "highlander": {
      "2001-2007": [
        "2.4 VVT-i - 160hp",
        "3.0 V6 - 220hp",
        "3.3 V6 - 230hp"
      ],
      "2008-2013": [
        "2.7 VVT-i - 188hp",
        "3.5 V6 - 273hp"
      ],
      "2014-2019": [
        "2.7 VVT-i - 188hp",
        "3.5 V6 - 295hp"
      ],
      "2020-2024": [
        "2.5 Hybrid - 243hp",
        "3.5 V6 - 295hp"
      ]
    },
    "land-cruiser": {
      "1998-2007": [
        "4.0 V6 - 245hp",
        "4.2 TD - 204hp",
        "4.5 V8 - 268hp"
      ],
      "2008-2015": [
        "4.0 V6 - 282hp",
        "4.5 V8 D-4D - 286hp"
      ],
      "2016-2021": [
        "2.8 D-4D - 177hp",
        "4.0 V6 - 282hp",
        "4.5 V8 D-4D - 272hp"
      ],
      "2022-2024": [
        "3.3 Turbo D - 309hp",
        "3.5 V6 - 415hp"
      ]
    },
    "hilux": {
      "1998-2004": [
        "2.4 D - 79hp",
        "2.5 D-4D - 102hp",
        "2.7 VVT-i - 150hp",
        "3.0 D-4D - 163hp"
      ],
      "2005-2015": [
        "2.5 D-4D - 102hp",
        "2.5 D-4D - 144hp",
        "3.0 D-4D - 171hp",
        "4.0 V6 - 236hp"
      ],
      "2016-2024": [
        "2.4 D-4D - 150hp",
        "2.8 D-4D - 177hp",
        "2.8 D-4D - 204hp"
      ]
    },
    "proace": {
      "2013-2016": [
        "1.6 D-4D - 90hp",
        "1.6 D-4D - 115hp",
        "2.0 D-4D - 128hp"
      ],
      "2017-2024": [
        "1.6 D-4D - 95hp",
        "1.6 D-4D - 115hp",
        "2.0 D-4D - 120hp",
        "2.0 D-4D - 150hp",
        "2.0 D-4D - 180hp"
      ]
    },
    "avensis": {
      "2003-2008": [
        "1.6 - 110hp",
        "1.8 - 129hp",
        "2.0 - 147hp",
        "2.4 - 163hp",
        "2.0 D-4D - 116hp",
        "2.2 D-4D - 150hp",
        "2.2 D-4D - 177hp"
      ],
      "2009-2018": [
        "1.6 - 132hp",
        "1.8 - 147hp",
        "2.0 - 152hp",
        "2.0 D-4D - 124hp",
        "2.0 D-4D - 143hp",
        "2.2 D-4D - 150hp"
      ]
    },
    "auris": {
      "2007-2012": [
        "1.4 - 97hp",
        "1.6 - 124hp",
        "1.8 - 147hp",
        "1.4 D-4D - 90hp",
        "2.0 D-4D - 124hp",
        "2.2 D-4D - 177hp"
      ],
      "2013-2018": [
        "1.33 - 99hp",
        "1.6 - 132hp",
        "1.8 Hybrid - 136hp",
        "1.4 D-4D - 90hp",
        "1.6 D-4D - 112hp"
      ]
    },
    "verso": {
      "2009-2018": [
        "1.6 - 132hp",
        "1.8 - 147hp",
        "2.0 D-4D - 124hp",
        "2.0 D-4D - 126hp",
        "2.2 D-4D - 150hp"
      ]
    },
    "supra": {
      "2019-2024": [
        "2.0 - 258hp",
        "3.0 - 340hp",
        "3.0 - 387hp"
      ]
    },
    "gt86": {
      "2012-2021": [
        "2.0 - 200hp"
      ]
    },
    "bz4x": {
      "2023-2024": [
        "Electric FWD - 204hp",
        "Electric AWD - 218hp"
      ],
      "2025-2026": [
        "Electric FWD - 204hp",
        "Electric AWD - 218hp",
        "Electric AWD Performance - 343hp"
      ]
    },
    "mirai": {
      "2015-2024": [
        "Hydrogen Fuel Cell - 154hp",
        "Hydrogen Fuel Cell - 182hp"
      ]
    },
    "yaris-gr": {
      "2020-2024": [
        "1.6 Turbo - 261hp",
        "1.6 Turbo - 280hp"
      ]
    }
  },
  "honda": {
    "jazz": {
      "2001-2007": [
        "1.2 i-DSI - 78hp",
        "1.4 i-DSI - 83hp"
      ],
      "2008-2014": [
        "1.2 i-VTEC - 90hp",
        "1.4 i-VTEC - 100hp"
      ],
      "2015-2019": [
        "1.3 i-VTEC - 102hp"
      ],
      "2020-2024": [
        "1.0 i-VTEC - 109hp",
        "1.5 i-MMD Hybrid - 109hp"
      ]
    },
    "civic": {
      "1996-2000": [
        "1.4 i - 90hp",
        "1.5 i - 114hp",
        "1.6 i VTEC - 125hp"
      ],
      "2001-2005": [
        "1.4 i - 90hp",
        "1.6 i - 110hp",
        "1.7 i-VTEC - 115hp",
        "2.0 i-VTEC Type R - 200hp",
        "1.7 CTDi - 100hp"
      ],
      "2006-2011": [
        "1.4 i-VTEC - 100hp",
        "1.8 i-VTEC - 140hp",
        "2.0 i-VTEC - 201hp",
        "2.2 i-CTDi - 140hp"
      ],
      "2012-2016": [
        "1.4 i-VTEC - 100hp",
        "1.8 i-VTEC - 142hp",
        "2.2 i-DTEc - 150hp"
      ],
      "2017-2021": [
        "1.0 VTEC Turbo - 129hp",
        "1.5 VTEC Turbo - 182hp",
        "2.0 VTEC Turbo - 320hp",
        "1.6 i-DTEC - 120hp"
      ],
      "2022-2024": [
        "1.5 VTEC Turbo - 182hp",
        "2.0 VTEC Turbo - 330hp",
        "1.5 Hybrid - 184hp"
      ]
    },
    "accord": {
      "1998-2002": [
        "1.8 i - 136hp",
        "2.0 i - 147hp",
        "2.3 i - 150hp",
        "3.0 V6 - 200hp"
      ],
      "2003-2007": [
        "2.0 i-VTEC - 155hp",
        "2.4 i-VTEC - 190hp",
        "3.0 i-VTEC - 241hp",
        "2.2 i-CTDi - 140hp"
      ],
      "2008-2015": [
        "2.0 i-VTEC - 156hp",
        "2.4 i-VTEC - 201hp",
        "3.5 i-VTEC - 280hp",
        "2.2 i-DTEC - 150hp",
        "2.2 i-DTEC - 180hp"
      ],
      "2016-2024": [
        "1.5 VTEC Turbo - 192hp",
        "2.0 VTEC Turbo - 252hp",
        "2.0 Hybrid - 215hp"
      ]
    },
    "cr-v": {
      "1997-2001": [
        "2.0 i - 147hp"
      ],
      "2002-2006": [
        "2.0 i-VTEC - 150hp",
        "2.4 i-VTEC - 162hp"
      ],
      "2007-2012": [
        "2.0 i-VTEC - 150hp",
        "2.4 i-VTEC - 190hp",
        "2.2 i-CTDi - 140hp",
        "2.2 i-DTEc - 150hp"
      ],
      "2013-2017": [
        "2.0 i-VTEC - 155hp",
        "2.4 i-VTEC - 190hp",
        "1.6 i-DTEC - 120hp",
        "1.6 i-DTEC - 160hp"
      ],
      "2018-2024": [
        "1.5 VTEC Turbo - 173hp",
        "2.0 VTEC Turbo - 193hp",
        "2.0 Hybrid - 184hp"
      ]
    },
    "hr-v": {
      "1999-2005": [
        "1.6 i - 105hp"
      ],
      "2015-2021": [
        "1.5 i-VTEC - 130hp",
        "1.6 i-DTEC - 120hp"
      ],
      "2022-2024": [
        "1.5 i-VTEC - 131hp",
        "1.5 Hybrid - 131hp"
      ]
    },
    "e": {
      "2020-2024": [
        "Electric - 154hp"
      ],
      "2025-2026": [
        "Electric R110 - 108hp",
        "Electric R135 - 135hp"
      ]
    },
    "civic-type-r": {
      "2001-2005": [
        "2.0 VTEC - 200hp"
      ],
      "2007-2011": [
        "2.0 VTEC - 201hp"
      ],
      "2015-2021": [
        "2.0 VTEC Turbo - 310hp",
        "2.0 VTEC Turbo - 320hp"
      ],
      "2023-2024": [
        "2.0 VTEC Turbo - 330hp"
      ]
    },
    "nsx": {
      "1990-2005": [
        "3.0 V6 - 270hp",
        "3.2 V6 - 280hp"
      ],
      "2016-2022": [
        "3.5 V6 Hybrid - 581hp"
      ]
    },
    "insight": {
      "2009-2014": [
        "1.3 Hybrid - 98hp"
      ],
      "2019-2022": [
        "1.5 Hybrid - 152hp"
      ]
    },
    "legend": {
      "2006-2012": [
        "3.5 V6 - 295hp"
      ],
      "2015-2021": [
        "3.5 V6 Hybrid - 377hp"
      ]
    },
    "fr-v": {
      "2005-2009": [
        "1.7 - 125hp",
        "1.8 - 140hp",
        "2.0 - 155hp",
        "2.2 i-CTDi - 140hp"
      ]
    },
    "stream": {
      "2001-2006": [
        "1.7 - 125hp",
        "2.0 - 156hp"
      ],
      "2007-2014": [
        "1.8 - 140hp",
        "2.0 - 156hp"
      ]
    },
    "cr-z": {
      "2010-2016": [
        "1.5 Hybrid - 114hp",
        "1.5 Hybrid - 135hp"
      ]
    },
    "s2000": {
      "1999-2009": [
        "2.0 VTEC - 240hp",
        "2.2 VTEC - 237hp"
      ]
    },
    "zr-v": {
      "2023-2024": [
        "1.5 Turbo - 180hp",
        "2.0 Hybrid - 184hp"
      ]
    }
  },
  "mazda": {
    "mazda2": {
      "2003-2007": [
        "1.25 - 75hp",
        "1.4 - 80hp",
        "1.6 - 100hp",
        "1.4 MZ-CD - 68hp"
      ],
      "2008-2014": [
        "1.3 - 75hp",
        "1.3 - 84hp",
        "1.5 - 103hp",
        "1.6 MZ-CD - 90hp"
      ],
      "2015-2024": [
        "1.5 Skyactiv-G - 75hp",
        "1.5 Skyactiv-G - 90hp",
        "1.5 Skyactiv-G - 115hp"
      ],
      "2025-2026": [
        "1.5 Skyactiv-G Mild Hybrid - 90hp",
        "1.5 Skyactiv-G Mild Hybrid - 116hp"
      ]
    },
    "mazda3": {
      "2004-2008": [
        "1.4 - 84hp",
        "1.6 - 105hp",
        "2.0 - 150hp",
        "2.3 MPS - 260hp",
        "1.6 MZ-CD - 109hp",
        "2.0 MZ-CD - 143hp"
      ],
      "2009-2013": [
        "1.6 - 105hp",
        "2.0 - 150hp",
        "2.3 - 260hp",
        "1.6 MZR-CD - 109hp",
        "2.0 MZR-CD - 143hp"
      ],
      "2014-2018": [
        "1.5 Skyactiv-G - 100hp",
        "2.0 Skyactiv-G - 120hp",
        "2.0 Skyactiv-G - 165hp",
        "1.5 Skyactiv-D - 105hp",
        "2.2 Skyactiv-D - 150hp"
      ],
      "2019-2024": [
        "2.0 Skyactiv-G - 122hp",
        "2.0 Skyactiv-G - 180hp",
        "2.5 Skyactiv-G - 186hp",
        "1.8 Skyactiv-D - 116hp"
      ],
      "2025-2026": [
        "2.0 Skyactiv-G Mild Hybrid - 122hp",
        "2.5 Skyactiv-G Mild Hybrid - 186hp",
        "2.0 Skyactiv-X - 186hp",
        "1.8 Skyactiv-D Mild Hybrid - 116hp"
      ]
    },
    "mazda6": {
      "2002-2007": [
        "1.8 - 120hp",
        "2.0 - 141hp",
        "2.3 - 166hp",
        "2.0 MZ-CD - 121hp",
        "2.0 MZ-CD - 143hp"
      ],
      "2008-2012": [
        "1.8 - 120hp",
        "2.0 - 147hp",
        "2.5 - 170hp",
        "2.0 MZR-CD - 140hp",
        "2.2 MZR-CD - 185hp"
      ],
      "2013-2018": [
        "2.0 Skyactiv-G - 145hp",
        "2.5 Skyactiv-G - 192hp",
        "2.2 Skyactiv-D - 150hp",
        "2.2 Skyactiv-D - 175hp"
      ],
      "2019-2024": [
        "2.0 Skyactiv-G - 165hp",
        "2.5 Skyactiv-G - 194hp",
        "2.5 Turbo - 231hp",
        "2.2 Skyactiv-D - 184hp"
      ],
      "2025-2026": [
        "2.5 Skyactiv-G Mild Hybrid - 194hp",
        "2.5 Turbo Mild Hybrid - 265hp",
        "2.0 Skyactiv-X - 186hp"
      ]
    },
    "cx-3": {
      "2015-2021": [
        "1.5 Skyactiv-G - 120hp",
        "2.0 Skyactiv-G - 121hp",
        "2.0 Skyactiv-G - 150hp",
        "1.5 Skyactiv-D - 105hp",
        "1.8 Skyactiv-D - 115hp"
      ]
    },
    "cx-30": {
      "2019-2024": [
        "2.0 Skyactiv-G - 122hp",
        "2.0 Skyactiv-G - 150hp",
        "2.0 Skyactiv-X - 186hp",
        "1.8 Skyactiv-D - 116hp"
      ],
      "2025-2026": [
        "2.0 Skyactiv-G Mild Hybrid - 150hp",
        "2.0 Skyactiv-X - 186hp",
        "2.5 Skyactiv-G Mild Hybrid - 186hp"
      ]
    },
    "cx-5": {
      "2012-2016": [
        "2.0 Skyactiv-G - 165hp",
        "2.5 Skyactiv-G - 192hp",
        "2.2 Skyactiv-D - 150hp",
        "2.2 Skyactiv-D - 175hp"
      ],
      "2017-2024": [
        "2.0 Skyactiv-G - 165hp",
        "2.5 Skyactiv-G - 194hp",
        "2.5 Turbo - 231hp",
        "2.2 Skyactiv-D - 184hp"
      ],
      "2025-2026": [
        "2.5 Skyactiv-G Mild Hybrid - 194hp",
        "2.5 Turbo Mild Hybrid - 256hp",
        "2.5 PHEV - 327hp"
      ]
    },
    "cx-60": {
      "2022-2024": [
        "2.5 PHEV - 327hp",
        "3.3 Skyactiv-D - 254hp"
      ],
      "2025-2026": [
        "2.5 PHEV - 327hp",
        "3.3 Skyactiv-D Mild Hybrid - 254hp",
        "3.0 Skyactiv-X Mild Hybrid - 286hp"
      ]
    },
    "mx-5": {
      "1998-2005": [
        "1.6 - 110hp",
        "1.8 - 146hp"
      ],
      "2006-2015": [
        "1.8 - 126hp",
        "2.0 - 160hp"
      ],
      "2016-2024": [
        "1.5 Skyactiv-G - 132hp",
        "2.0 Skyactiv-G - 184hp"
      ],
      "2025-2026": [
        "2.0 Skyactiv-G Mild Hybrid - 184hp"
      ]
    },
    "cx-7": {
      "2007-2012": [
        "2.3 Turbo - 260hp",
        "2.2 Skyactiv-D - 173hp"
      ]
    },
    "cx-9": {
      "2007-2015": [
        "3.7 V6 - 277hp"
      ],
      "2016-2024": [
        "2.5 Turbo - 231hp"
      ]
    },
    "rx-8": {
      "2003-2012": [
        "1.3 Rotary - 192hp",
        "1.3 Rotary - 231hp"
      ]
    },
    "mx-30": {
      "2020-2024": [
        "Electric - 145hp",
        "1.8 Rotary PHEV - 170hp"
      ]
    },
    "bongo": {
      "2004-2024": [
        "2.5 TD - 95hp",
        "2.5 TD - 115hp"
      ]
    }
  },
  "hyundai": {
    "i20": {
      "2009-2014": [
        "1.2 - 78hp",
        "1.4 - 100hp",
        "1.4 CRDi - 90hp"
      ],
      "2015-2020": [
        "1.0 T-GDi - 100hp",
        "1.2 - 84hp",
        "1.4 - 100hp",
        "1.4 CRDi - 90hp"
      ],
      "2021-2024": [
        "1.0 T-GDi - 100hp",
        "1.0 T-GDi - 120hp"
      ]
    },
    "i30": {
      "2007-2012": [
        "1.4 - 109hp",
        "1.6 - 126hp",
        "2.0 - 143hp",
        "1.6 CRDi - 115hp",
        "1.6 CRDi - 128hp",
        "2.0 CRDi - 140hp"
      ],
      "2013-2016": [
        "1.4 - 100hp",
        "1.6 - 135hp",
        "1.6 T-GDi - 186hp",
        "1.4 CRDi - 90hp",
        "1.6 CRDi - 110hp",
        "1.6 CRDi - 128hp"
      ],
      "2017-2024": [
        "1.0 T-GDi - 120hp",
        "1.4 T-GDi - 140hp",
        "1.6 T-GDi - 204hp",
        "2.0 T-GDi N - 280hp",
        "1.6 CRDi - 110hp",
        "1.6 CRDi - 136hp"
      ]
    },
    "tucson": {
      "2010-2015": [
        "1.6 GDi - 135hp",
        "2.0 - 166hp",
        "1.7 CRDi - 115hp",
        "2.0 CRDi - 136hp",
        "2.0 CRDi - 184hp"
      ],
      "2016-2020": [
        "1.6 T-GDi - 177hp",
        "2.0 CRDi - 136hp",
        "2.0 CRDi - 185hp"
      ],
      "2021-2024": [
        "1.6 T-GDi - 150hp",
        "1.6 T-GDi - 180hp",
        "2.0 T-GDi - 230hp",
        "1.6 CRDi - 136hp",
        "2.0 CRDi - 185hp"
      ]
    },
    "genesis": {
      "2009-2014": [
        "3.8 V6 - 290hp",
        "4.6 V8 - 375hp"
      ],
      "2015-2020": [
        "3.8 V6 - 315hp",
        "5.0 V8 - 425hp"
      ],
      "2021-2026": [
        "2.5 T-GDi - 300hp",
        "3.5 T-GDi - 380hp",
        "Electric - 370hp"
      ]
    },
    "i10": {
      "2008-2013": [
        "1.1 - 69hp",
        "1.2 - 78hp",
        "1.0 CRDi - 75hp"
      ],
      "2014-2019": [
        "1.0 - 66hp",
        "1.2 - 87hp"
      ],
      "2020-2024": [
        "1.0 - 67hp",
        "1.2 - 84hp"
      ]
    },
    "i40": {
      "2012-2019": [
        "1.6 GDi - 135hp",
        "2.0 GDi - 177hp",
        "1.7 CRDi - 115hp",
        "1.7 CRDi - 136hp",
        "2.0 CRDi - 136hp"
      ]
    },
    "kona": {
      "2018-2024": [
        "1.0 T-GDi - 120hp",
        "1.6 T-GDi - 177hp",
        "1.6 T-GDi - 198hp",
        "1.6 CRDi - 115hp",
        "1.6 CRDi - 136hp",
        "Electric - 136hp",
        "Electric - 204hp"
      ]
    },
    "santa-fe": {
      "2006-2012": [
        "2.2 - 150hp",
        "2.7 V6 - 189hp",
        "2.0 CRDi - 150hp",
        "2.2 CRDi - 197hp"
      ],
      "2013-2018": [
        "2.0 T-GDi - 245hp",
        "2.2 CRDi - 197hp",
        "2.2 CRDi - 200hp"
      ],
      "2019-2024": [
        "2.0 T-GDi - 235hp",
        "1.6 T-GDi PHEV - 265hp",
        "2.2 CRDi - 200hp"
      ]
    },
    "ioniq": {
      "2017-2022": [
        "1.6 GDi Hybrid - 141hp",
        "Electric - 136hp",
        "1.6 GDi PHEV - 141hp"
      ]
    },
    "ioniq-5": {
      "2021-2024": [
        "Electric RWD - 170hp",
        "Electric RWD - 229hp",
        "Electric AWD - 306hp"
      ]
    },
    "ioniq-6": {
      "2023-2024": [
        "Electric RWD - 153hp",
        "Electric RWD - 229hp",
        "Electric AWD - 325hp"
      ]
    },
    "ix35": {
      "2010-2015": [
        "1.6 GDi - 135hp",
        "2.0 - 166hp",
        "1.7 CRDi - 115hp",
        "2.0 CRDi - 136hp",
        "2.0 CRDi - 184hp"
      ]
    },
    "ix20": {
      "2010-2019": [
        "1.4 - 90hp",
        "1.6 - 125hp",
        "1.4 CRDi - 90hp",
        "1.6 CRDi - 128hp"
      ]
    },
    "veloster": {
      "2011-2018": [
        "1.6 GDi - 140hp",
        "1.6 T-GDi - 186hp",
        "1.6 T-GDi N - 275hp"
      ],
      "2019-2022": [
        "2.0 - 147hp",
        "1.6 T-GDi - 204hp",
        "2.0 T-GDi N - 275hp"
      ]
    },
    "i30-n": {
      "2018-2024": [
        "2.0 T-GDi - 250hp",
        "2.0 T-GDi - 280hp"
      ]
    },
    "kona-n": {
      "2021-2024": [
        "2.0 T-GDi - 280hp"
      ]
    },
    "bayon": {
      "2021-2024": [
        "1.0 T-GDi - 100hp",
        "1.0 T-GDi - 120hp"
      ]
    },
    "palisade": {
      "2019-2024": [
        "3.8 V6 - 295hp",
        "2.2 CRDi - 200hp"
      ]
    },
    "nexo": {
      "2019-2024": [
        "Hydrogen Fuel Cell - 163hp"
      ]
    }
  },
  "kia": {
    "ceed": {
      "2007-2012": [
        "1.4 - 90hp",
        "1.6 - 126hp",
        "2.0 - 143hp",
        "1.6 CRDi - 115hp",
        "1.6 CRDi - 128hp",
        "2.0 CRDi - 140hp"
      ],
      "2013-2018": [
        "1.4 - 100hp",
        "1.6 - 135hp",
        "1.6 T-GDi - 204hp",
        "1.4 CRDi - 90hp",
        "1.6 CRDi - 110hp",
        "1.6 CRDi - 128hp"
      ],
      "2019-2024": [
        "1.0 T-GDi - 120hp",
        "1.4 T-GDi - 140hp",
        "1.6 T-GDi - 204hp",
        "1.6 CRDi - 115hp",
        "1.6 CRDi - 136hp"
      ],
      "2025-2026": [
        "1.0 T-GDi Mild Hybrid - 120hp",
        "1.5 T-GDi Mild Hybrid - 160hp",
        "1.6 Hybrid - 141hp",
        "1.6 PHEV - 180hp"
      ]
    },
    "sportage": {
      "2010-2015": [
        "1.6 GDi - 135hp",
        "2.0 - 163hp",
        "1.7 CRDi - 115hp",
        "2.0 CRDi - 136hp",
        "2.0 CRDi - 184hp"
      ],
      "2016-2021": [
        "1.6 T-GDi - 177hp",
        "2.0 CRDi - 136hp",
        "2.0 CRDi - 185hp"
      ],
      "2022-2024": [
        "1.6 T-GDi - 150hp",
        "1.6 T-GDi - 180hp",
        "2.0 T-GDi - 265hp",
        "1.6 CRDi - 136hp",
        "2.0 CRDi - 186hp"
      ],
      "2025-2026": [
        "1.6 T-GDi Mild Hybrid - 180hp",
        "1.6 PHEV - 265hp",
        "1.6 Hybrid - 230hp"
      ]
    },
    "niro": {
      "2017-2021": [
        "1.6 GDi Hybrid - 141hp",
        "1.6 GDi PHEV - 141hp"
      ],
      "2022-2024": [
        "1.6 GDi Hybrid - 141hp",
        "1.6 T-GDi Hybrid - 183hp"
      ],
      "2025-2026": [
        "1.6 Hybrid - 141hp",
        "1.6 PHEV - 183hp",
        "Electric - 204hp"
      ]
    },
    "picanto": {
      "2004-2011": [
        "1.0 - 61hp",
        "1.1 - 65hp",
        "1.1 CRDi - 75hp"
      ],
      "2011-2017": [
        "1.0 - 69hp",
        "1.2 - 85hp"
      ],
      "2017-2024": [
        "1.0 - 67hp",
        "1.2 - 84hp"
      ],
      "2025-2026": [
        "1.0 Mild Hybrid - 79hp",
        "1.2 Mild Hybrid - 84hp"
      ]
    },
    "rio": {
      "2005-2011": [
        "1.2 - 75hp",
        "1.4 - 97hp",
        "1.6 - 112hp",
        "1.5 CRDi - 110hp"
      ],
      "2012-2017": [
        "1.1 CRDi - 75hp",
        "1.2 - 85hp",
        "1.4 - 100hp",
        "1.4 CRDi - 90hp"
      ],
      "2017-2024": [
        "1.0 T-GDi - 100hp",
        "1.0 T-GDi - 120hp",
        "1.2 - 84hp",
        "1.4 - 100hp",
        "1.4 CRDi - 90hp"
      ]
    },
    "xceed": {
      "2020-2024": [
        "1.0 T-GDi - 120hp",
        "1.4 T-GDi - 140hp",
        "1.6 T-GDi - 204hp",
        "1.6 CRDi - 115hp",
        "1.6 CRDi - 136hp"
      ]
    },
    "stonic": {
      "2018-2024": [
        "1.0 T-GDi - 100hp",
        "1.0 T-GDi - 120hp",
        "1.2 - 84hp",
        "1.4 - 100hp",
        "1.6 CRDi - 115hp"
      ]
    },
    "sorento": {
      "2006-2009": [
        "2.4 - 175hp",
        "3.3 V6 - 242hp",
        "3.8 V6 - 262hp",
        "2.5 CRDi - 170hp"
      ],
      "2010-2014": [
        "2.0 T-GDi - 245hp",
        "2.4 - 178hp",
        "2.0 CRDi - 197hp",
        "2.2 CRDi - 197hp"
      ],
      "2015-2020": [
        "2.0 T-GDi - 245hp",
        "2.2 CRDi - 200hp"
      ],
      "2021-2024": [
        "1.6 T-GDi Hybrid - 230hp",
        "2.2 CRDi - 202hp"
      ],
      "2025-2026": [
        "1.6 T-GDi Hybrid - 230hp",
        "1.6 PHEV - 265hp"
      ]
    },
    "ev6": {
      "2022-2024": [
        "Electric RWD - 229hp",
        "Electric AWD - 325hp",
        "Electric GT - 585hp"
      ],
      "2025-2026": [
        "Electric RWD - 229hp",
        "Electric AWD - 325hp",
        "Electric GT - 585hp"
      ]
    },
    "proceed": {
      "2008-2012": [
        "1.4 - 90hp",
        "1.6 - 126hp",
        "2.0 - 143hp",
        "1.6 CRDi - 115hp",
        "1.6 CRDi - 128hp"
      ],
      "2019-2024": [
        "1.0 T-GDi - 120hp",
        "1.4 T-GDi - 140hp",
        "1.6 T-GDi - 204hp",
        "1.6 CRDi - 115hp",
        "1.6 CRDi - 136hp"
      ]
    },
    "venga": {
      "2010-2019": [
        "1.4 - 90hp",
        "1.6 - 125hp",
        "1.4 CRDi - 90hp",
        "1.6 CRDi - 128hp"
      ]
    },
    "soul": {
      "2009-2013": [
        "1.6 - 126hp",
        "2.0 - 142hp",
        "1.6 CRDi - 128hp"
      ],
      "2014-2019": [
        "1.6 GDi - 130hp",
        "2.0 - 163hp",
        "1.6 CRDi - 128hp"
      ],
      "2020-2024": [
        "1.6 T-GDi - 177hp",
        "Electric - 204hp"
      ]
    },
    "optima": {
      "2012-2015": [
        "1.6 GDi - 135hp",
        "2.0 GDi - 163hp",
        "1.7 CRDi - 141hp"
      ],
      "2016-2020": [
        "1.6 T-GDi - 180hp",
        "2.0 GDi - 163hp",
        "2.0 T-GDi - 245hp",
        "1.7 CRDi - 141hp",
        "2.0 CRDi - 185hp"
      ]
    },
    "stinger": {
      "2018-2024": [
        "2.0 T-GDi - 255hp",
        "2.2 CRDi - 200hp",
        "3.3 V6 - 370hp"
      ]
    },
    "ev9": {
      "2023-2024": [
        "Electric RWD - 204hp",
        "Electric AWD - 385hp"
      ],
      "2025-2026": [
        "Electric RWD - 204hp",
        "Electric AWD - 385hp",
        "Electric GT-Line AWD - 385hp"
      ]
    },
    "carnival": {
      "2006-2014": [
        "2.7 V6 - 189hp",
        "2.9 CRDi - 185hp"
      ],
      "2015-2024": [
        "2.2 CRDi - 200hp",
        "3.5 V6 - 294hp"
      ]
    },
    "ceed-gt": {
      "2019-2024": [
        "1.6 T-GDi - 204hp"
      ]
    }
  },
  "mg": {
    "mg3": {
      "2013-2024": [
        "1.5 VTi-TECH - 106hp"
      ]
    },
    "mg4": {
      "2023-2024": [
        "Electric 51kWh - 170hp",
        "Electric 64kWh - 204hp"
      ]
    },
    "mg5": {
      "2021-2024": [
        "Electric - 156hp",
        "Electric - 177hp"
      ]
    },
    "hs": {
      "2019-2024": [
        "1.5 Turbo - 162hp",
        "PHEV - 258hp"
      ]
    },
    "zs": {
      "2017-2024": [
        "1.0 Turbo - 111hp",
        "1.5 VTi-TECH - 106hp",
        "Electric - 143hp"
      ]
    },
    "mg6": {
      "2018-2024": [
        "1.5 Turbo - 162hp"
      ]
    },
    "tf": {
      "2002-2011": [
        "1.6 - 115hp",
        "1.8 - 135hp",
        "1.8 - 160hp"
      ]
    },
    "gs": {
      "2013-2018": [
        "1.5 Turbo - 166hp"
      ]
    },
    "marvel-r": {
      "2021-2024": [
        "Electric - 288hp"
      ]
    },
    "cyberster": {
      "2024-2024": [
        "Electric - 536hp"
      ]
    },
    "zs-ev": {
      "2019-2024": [
        "Electric - 143hp",
        "Electric - 156hp"
      ]
    },
    "mg4-ev": {
      "2023-2024": [
        "Electric 51kWh - 170hp",
        "Electric 64kWh - 204hp"
      ]
    },
    "mg-tf": {
      "2002-2011": [
        "1.6 - 115hp",
        "1.8 - 135hp",
        "1.8 - 160hp"
      ]
    },
    "mg-zt": {
      "2001-2005": [
        "1.8 - 120hp",
        "2.0 - 131hp",
        "2.5 V6 - 177hp",
        "4.6 V8 - 260hp",
        "2.0 CDTi - 116hp"
      ]
    }
  },
  "cupra": {
    "formentor": {
      "2021-2024": [
        "1.4 e-Hybrid - 245hp",
        "1.5 TSI - 150hp",
        "2.0 TSI - 190hp",
        "2.0 TSI - 310hp"
      ]
    },
    "leon": {
      "2021-2024": [
        "1.4 e-Hybrid - 245hp",
        "1.5 TSI - 150hp",
        "2.0 TSI - 245hp",
        "2.0 TSI - 300hp"
      ]
    },
    "ateca": {
      "2018-2024": [
        "2.0 TSI - 300hp"
      ]
    },
    "born": {
      "2022-2024": [
        "Electric 45kWh - 150hp",
        "Electric 58kWh - 204hp",
        "Electric 77kWh - 231hp"
      ]
    },
    "tavascan": {
      "2024-2024": [
        "Electric - 286hp"
      ]
    }
  },
  "genesis": {
    "g70": {
      "2018-2024": [
        "2.0 Turbo - 252hp",
        "3.3 V6 Turbo - 370hp"
      ]
    },
    "g80": {
      "2021-2024": [
        "2.5 Turbo - 304hp",
        "3.5 V6 Turbo - 380hp",
        "Electric - 370hp"
      ]
    },
    "g90": {
      "2017-2024": [
        "3.3 V6 Turbo - 370hp",
        "5.0 V8 - 425hp"
      ]
    },
    "gv60": {
      "2023-2024": [
        "Electric RWD - 229hp",
        "Electric AWD - 314hp",
        "Electric Sport - 430hp"
      ]
    },
    "gv70": {
      "2022-2024": [
        "2.5 Turbo - 304hp",
        "3.5 V6 Turbo - 380hp",
        "Electric - 490hp"
      ]
    },
    "gv80": {
      "2021-2024": [
        "2.5 Turbo - 304hp",
        "3.5 V6 Turbo - 380hp"
      ]
    }
  },
  "polestar": {
    "polestar-2": {
      "2020-2024": [
        "Electric Single Motor - 231hp",
        "Electric Dual Motor - 408hp",
        "Electric Dual Motor Long Range - 476hp"
      ]
    },
    "polestar-3": {
      "2024": [
        "Electric Dual Motor - 489hp",
        "Electric Dual Motor Long Range - 517hp"
      ]
    },
    "polestar-4": {
      "2024-2024": [
        "Electric Dual Motor - 544hp"
      ]
    },
    "polestar-1": {
      "2019-2021": [
        "2.0 Hybrid - 619hp"
      ]
    }
  },
  "lotus": {
    "elise": {
      "1996-2021": [
        "1.6 - 134hp",
        "1.8 - 190hp"
      ]
    },
    "exige": {
      "2000-2021": [
        "1.8 Supercharged - 240hp",
        "3.5 V6 Supercharged - 350hp",
        "3.5 V6 Supercharged - 430hp"
      ]
    },
    "evora": {
      "2009-2021": [
        "3.5 V6 Supercharged - 400hp",
        "3.5 V6 Supercharged GT - 416hp"
      ]
    },
    "emira": {
      "2022-2024": [
        "2.0 Turbo - 360hp",
        "3.5 V6 Supercharged - 400hp"
      ]
    },
    "eletre": {
      "2023-2024": [
        "Electric Dual Motor - 603hp",
        "Electric R - 905hp"
      ]
    }
  },
  "aston-martin": {
    "vantage": {
      "2005-2024": [
        "4.0 V8 - 510hp",
        "4.0 V8 - 535hp",
        "5.9 V12 - 573hp"
      ]
    },
    "db11": {
      "2016-2024": [
        "4.0 V8 - 528hp",
        "5.2 V12 - 639hp"
      ]
    },
    "dbs": {
      "2019-2024": [
        "5.2 V12 - 725hp"
      ]
    },
    "dbx": {
      "2020-2024": [
        "4.0 V8 - 550hp",
        "4.0 V8 707 - 707hp"
      ]
    },
    "rapide": {
      "2010-2020": [
        "5.9 V12 - 477hp",
        "6.0 V12 - 558hp"
      ]
    }
  },
  "mclaren": {
    "540c": {
      "2015-2019": [
        "3.8 V8 Twin-Turbo - 540hp"
      ]
    },
    "570s": {
      "2015-2021": [
        "3.8 V8 Twin-Turbo - 570hp"
      ]
    },
    "720s": {
      "2017-2024": [
        "4.0 V8 Twin-Turbo - 720hp"
      ]
    },
    "765lt": {
      "2020-2024": [
        "4.0 V8 Twin-Turbo - 765hp"
      ]
    },
    "gt": {
      "2019-2024": [
        "4.0 V8 Twin-Turbo - 620hp"
      ]
    },
    "artura": {
      "2022-2024": [
        "3.0 V6 Hybrid - 680hp"
      ]
    }
  },
  "ferrari": {
    "488": {
      "2015-2019": [
        "3.9 V8 Twin-Turbo - 670hp",
        "3.9 V8 Twin-Turbo Pista - 720hp"
      ]
    },
    "f8-tributo": {
      "2019-2024": [
        "3.9 V8 Twin-Turbo - 720hp"
      ]
    },
    "sf90": {
      "2020-2024": [
        "4.0 V8 PHEV - 1000hp"
      ]
    },
    "roma": {
      "2020-2024": [
        "3.9 V8 Twin-Turbo - 620hp"
      ]
    },
    "812-superfast": {
      "2017-2024": [
        "6.5 V12 - 800hp"
      ]
    },
    "purosangue": {
      "2023-2024": [
        "6.5 V12 - 725hp"
      ]
    },
    "portofino": {
      "2018-2024": [
        "3.9 V8 Twin-Turbo - 600hp",
        "3.9 V8 Twin-Turbo M - 620hp"
      ]
    }
  },
  "lamborghini": {
    "huracan": {
      "2014-2024": [
        "5.2 V10 - 610hp",
        "5.2 V10 Performante - 640hp",
        "5.2 V10 STO - 640hp"
      ]
    },
    "aventador": {
      "2011-2022": [
        "6.5 V12 - 740hp",
        "6.5 V12 SVJ - 770hp"
      ]
    },
    "urus": {
      "2018-2024": [
        "4.0 V8 Twin-Turbo - 650hp"
      ]
    }
  },
  "rolls-royce": {
    "ghost": {
      "2010-2024": [
        "6.6 V12 Twin-Turbo - 571hp",
        "6.75 V12 Twin-Turbo - 571hp"
      ]
    },
    "wraith": {
      "2014-2024": [
        "6.6 V12 Twin-Turbo - 632hp"
      ]
    },
    "phantom": {
      "2003-2024": [
        "6.75 V12 - 460hp",
        "6.75 V12 Twin-Turbo - 571hp"
      ]
    },
    "cullinan": {
      "2018-2024": [
        "6.75 V12 Twin-Turbo - 571hp"
      ]
    },
    "spectre": {
      "2024": [
        "Electric - 585hp"
      ]
    },
    "dawn": {
      "2016-2024": [
        "6.6 V12 Twin-Turbo - 571hp",
        "6.6 V12 Twin-Turbo Black Badge - 632hp"
      ]
    }
  },
  "bugatti": {
    "veyron": {
      "2005-2015": [
        "8.0 W16 Quad-Turbo - 1001hp",
        "8.0 W16 Super Sport - 1200hp"
      ]
    },
    "chiron": {
      "2016-2024": [
        "8.0 W16 Quad-Turbo - 1500hp",
        "8.0 W16 Super Sport - 1600hp"
      ]
    },
    "divo": {
      "2018-2020": [
        "8.0 W16 Quad-Turbo - 1500hp"
      ]
    }
  },
  "gmc": {
    "sierra": {
      "2014-2024": [
        "4.3 V6 - 285hp",
        "5.3 V8 - 355hp",
        "6.2 V8 - 420hp",
        "3.0 Duramax Diesel - 277hp"
      ]
    },
    "canyon": {
      "2015-2024": [
        "2.5 I4 - 200hp",
        "3.6 V6 - 308hp",
        "2.8 Duramax Diesel - 181hp"
      ]
    },
    "yukon": {
      "2015-2024": [
        "5.3 V8 - 355hp",
        "6.2 V8 - 420hp",
        "3.0 Duramax Diesel - 277hp"
      ]
    },
    "terrain": {
      "2018-2024": [
        "1.5 Turbo - 170hp",
        "2.0 Turbo - 252hp"
      ]
    },
    "acadia": {
      "2017-2024": [
        "2.5 I4 - 193hp",
        "3.6 V6 - 310hp"
      ]
    }
  },
  "cadillac": {
    "ct4": {
      "2020-2024": [
        "2.0 Turbo - 237hp",
        "2.7 Turbo - 310hp",
        "3.6 V6 Twin-Turbo V - 472hp"
      ]
    },
    "ct5": {
      "2020-2024": [
        "2.0 Turbo - 237hp",
        "3.0 Twin-Turbo - 360hp",
        "6.2 V8 Supercharged V - 668hp"
      ]
    },
    "xt4": {
      "2019-2024": [
        "2.0 Turbo - 237hp"
      ]
    },
    "xt5": {
      "2017-2024": [
        "2.0 Turbo - 237hp",
        "3.6 V6 - 310hp"
      ]
    },
    "xt6": {
      "2020-2024": [
        "3.6 V6 - 310hp"
      ]
    },
    "escalade": {
      "2015-2024": [
        "6.2 V8 - 420hp",
        "3.0 Duramax Diesel - 277hp"
      ]
    },
    "lyriq": {
      "2023-2024": [
        "Electric RWD - 340hp",
        "Electric AWD - 500hp"
      ]
    },
    "ct6": {
      "2016-2020": [
        "2.0 Turbo - 265hp",
        "3.0 Twin-Turbo - 404hp",
        "3.6 V6 - 335hp",
        "4.2 Twin-Turbo V8 - 500hp"
      ]
    }
  },
  "alpine": {
    "a110": {
      "2017-2024": [
        "1.8 Turbo - 252hp",
        "1.8 Turbo S - 292hp"
      ]
    }
  },
  "volvo": {
    "s60": {
      "2010-2018": [
        "1.6 T3 - 150hp",
        "1.6 T4 - 180hp",
        "2.0 T5 - 245hp",
        "2.0 D3 - 136hp",
        "2.0 D4 - 190hp"
      ],
      "2019-2024": [
        "2.0 T4 - 190hp",
        "2.0 T5 - 250hp",
        "2.0 T8 PHEV - 390hp",
        "2.0 D3 - 150hp",
        "2.0 D4 - 190hp"
      ]
    },
    "xc60": {
      "2009-2017": [
        "2.0 T5 - 245hp",
        "3.0 T6 - 304hp",
        "2.0 D3 - 163hp",
        "2.0 D4 - 190hp",
        "2.4 D5 - 220hp"
      ],
      "2018-2024": [
        "2.0 T4 - 190hp",
        "2.0 T5 - 250hp",
        "2.0 T6 - 310hp",
        "2.0 T8 PHEV - 390hp",
        "2.0 D4 - 190hp",
        "2.0 D5 - 235hp"
      ]
    },
    "xc90": {
      "2015-2024": [
        "2.0 T5 - 250hp",
        "2.0 T6 - 310hp",
        "2.0 T8 PHEV - 390hp",
        "2.0 D4 - 190hp",
        "2.0 D5 - 235hp"
      ]
    },
    "v40": {
      "2013-2019": [
        "1.5 T2 - 122hp",
        "1.6 T3 - 150hp",
        "2.0 T4 - 190hp",
        "2.0 T5 - 245hp",
        "1.6 D2 - 115hp",
        "2.0 D3 - 150hp",
        "2.0 D4 - 190hp"
      ]
    },
    "v60": {
      "2011-2018": [
        "1.6 T3 - 150hp",
        "1.6 T4 - 180hp",
        "2.0 T5 - 245hp",
        "2.0 D3 - 163hp",
        "2.0 D4 - 190hp",
        "2.4 D5 - 215hp"
      ],
      "2019-2024": [
        "2.0 T4 - 190hp",
        "2.0 T5 - 250hp",
        "2.0 T6 - 310hp",
        "2.0 T8 PHEV - 390hp",
        "2.0 D3 - 150hp",
        "2.0 D4 - 190hp"
      ]
    },
    "v90": {
      "2017-2024": [
        "2.0 T4 - 190hp",
        "2.0 T5 - 250hp",
        "2.0 T6 - 310hp",
        "2.0 T8 PHEV - 390hp",
        "2.0 D3 - 150hp",
        "2.0 D4 - 190hp",
        "2.0 D5 - 235hp"
      ]
    },
    "xc40": {
      "2018-2024": [
        "1.5 T2 - 129hp",
        "1.5 T3 - 163hp",
        "2.0 T4 - 190hp",
        "2.0 T5 - 247hp",
        "2.0 D3 - 150hp",
        "2.0 D4 - 190hp",
        "Electric Recharge P8 - 408hp"
      ]
    },
    "s90": {
      "2017-2024": [
        "2.0 T4 - 190hp",
        "2.0 T5 - 250hp",
        "2.0 T6 - 310hp",
        "2.0 T8 PHEV - 390hp",
        "2.0 D4 - 190hp",
        "2.0 D5 - 235hp"
      ]
    },
    "c30": {
      "2007-2013": [
        "1.6 - 100hp",
        "1.6 - 115hp",
        "1.8 - 125hp",
        "2.0 - 145hp",
        "2.4 - 170hp",
        "2.5 T5 - 230hp",
        "1.6 D - 109hp",
        "2.0 D - 136hp"
      ]
    },
    "c40": {
      "2022-2024": [
        "Electric Twin - 408hp"
      ]
    },
    "c70": {
      "2006-2013": [
        "2.0 - 145hp",
        "2.4 - 170hp",
        "2.5 T5 - 230hp",
        "2.0 D - 136hp"
      ]
    },
    "v50": {
      "2004-2012": [
        "1.6 - 100hp",
        "1.8 - 125hp",
        "2.0 - 145hp",
        "2.4 - 170hp",
        "2.5 T5 - 230hp",
        "1.6 D - 109hp",
        "2.0 D - 136hp"
      ]
    },
    "v70": {
      "1997-2007": [
        "2.0 - 140hp",
        "2.3 T5 - 250hp",
        "2.4 - 140hp",
        "2.4 - 170hp",
        "2.4 D5 - 163hp"
      ],
      "2008-2016": [
        "1.6 - 110hp",
        "2.0 - 145hp",
        "2.5 T5 - 231hp",
        "3.0 T6 - 304hp",
        "2.0 D3 - 136hp",
        "2.4 D5 - 205hp"
      ]
    },
    "s40": {
      "2004-2012": [
        "1.6 - 100hp",
        "1.8 - 125hp",
        "2.0 - 145hp",
        "2.4 - 170hp",
        "2.5 T5 - 230hp",
        "1.6 D - 109hp",
        "2.0 D - 136hp"
      ]
    },
    "s80": {
      "1998-2006": [
        "2.0 T - 180hp",
        "2.4 - 140hp",
        "2.5 T - 210hp",
        "2.8 T6 - 272hp",
        "2.4 D - 130hp",
        "2.4 D5 - 163hp"
      ],
      "2007-2016": [
        "2.0 T - 203hp",
        "2.5 T - 231hp",
        "3.0 T6 - 304hp",
        "4.4 V8 - 315hp",
        "2.0 D - 136hp",
        "2.4 D5 - 205hp"
      ]
    },
    "xc70": {
      "2000-2007": [
        "2.4 - 170hp",
        "2.4 T - 200hp",
        "2.5 T - 210hp",
        "2.4 D5 - 163hp",
        "2.4 D5 - 185hp"
      ],
      "2008-2016": [
        "2.0 T - 203hp",
        "2.5 T - 231hp",
        "3.0 T6 - 304hp",
        "2.0 D3 - 163hp",
        "2.4 D5 - 215hp"
      ]
    },
    "xc40-recharge": {
      "2021-2024": [
        "Electric Twin - 408hp"
      ]
    },
    "c40-recharge": {
      "2022-2024": [
        "Electric Twin - 408hp"
      ]
    }
  },
  "alfa-romeo": {
    "147": {
      "2001-2010": [
        "1.6 TS - 105hp",
        "2.0 TS - 150hp",
        "3.2 V6 GTA - 250hp",
        "1.9 JTD - 115hp",
        "1.9 JTD - 140hp"
      ]
    },
    "156": {
      "1997-2005": [
        "1.6 TS - 120hp",
        "1.8 TS - 144hp",
        "2.0 TS - 155hp",
        "2.5 V6 - 190hp",
        "3.2 V6 GTA - 250hp",
        "1.9 JTD - 105hp",
        "1.9 JTD - 115hp",
        "2.4 JTD - 140hp"
      ]
    },
    "159": {
      "2005-2011": [
        "1.8 TBi - 140hp",
        "1.9 JTS - 160hp",
        "2.2 JTS - 185hp",
        "3.2 V6 - 260hp",
        "1.9 JTDm - 120hp",
        "1.9 JTDm - 150hp",
        "2.0 JTDm - 136hp",
        "2.0 JTDm - 170hp",
        "2.4 JTDm - 200hp"
      ]
    },
    "giulietta": {
      "2010-2013": [
        "1.4 TB - 120hp",
        "1.4 TB MultiAir - 170hp",
        "1.8 TBi - 235hp",
        "1.6 JTDm - 105hp",
        "2.0 JTDm - 140hp",
        "2.0 JTDm - 170hp"
      ],
      "2014-2020": [
        "1.4 TB MultiAir - 120hp",
        "1.4 TB MultiAir - 170hp",
        "1.8 TBi QV - 240hp",
        "1.6 JTDm-2 - 120hp",
        "2.0 JTDm-2 - 150hp",
        "2.0 JTDm-2 - 175hp"
      ]
    },
    "giulia": {
      "2016-2024": [
        "2.0 Turbo - 200hp",
        "2.0 Turbo - 280hp",
        "2.9 V6 QV - 510hp",
        "2.2 JTDm - 136hp",
        "2.2 JTDm - 160hp",
        "2.2 JTDm - 190hp",
        "2.2 JTDm - 210hp"
      ]
    },
    "stelvio": {
      "2017-2024": [
        "2.0 Turbo - 200hp",
        "2.0 Turbo - 280hp",
        "2.9 V6 QV - 510hp",
        "2.2 JTDm - 160hp",
        "2.2 JTDm - 190hp",
        "2.2 JTDm - 210hp"
      ]
    },
    "mito": {
      "2008-2018": [
        "0.9 TwinAir - 85hp",
        "1.4 - 78hp",
        "1.4 TB - 120hp",
        "1.4 TB MultiAir - 135hp",
        "1.4 TB MultiAir - 170hp",
        "1.3 JTDm - 85hp",
        "1.3 JTDm - 90hp",
        "1.6 JTDm - 120hp"
      ]
    },
    "tonale": {
      "2022-2024": [
        "1.5 Hybrid - 130hp",
        "1.5 Hybrid - 160hp",
        "1.5 PHEV - 280hp",
        "1.6 Diesel - 130hp"
      ]
    },
    "brera": {
      "2006-2010": [
        "2.2 JTS - 185hp",
        "3.2 V6 - 260hp",
        "2.4 JTDm - 200hp"
      ]
    },
    "spider": {
      "2006-2010": [
        "2.2 JTS - 185hp",
        "3.2 V6 - 260hp",
        "2.4 JTDm - 200hp"
      ]
    },
    "gt": {
      "2004-2010": [
        "1.8 TS - 140hp",
        "2.0 JTS - 165hp",
        "3.2 V6 - 240hp",
        "1.9 JTD - 150hp"
      ]
    },
    "giulia-quadrifoglio": {
      "2016-2024": [
        "2.9 V6 - 510hp"
      ]
    },
    "stelvio-quadrifoglio": {
      "2018-2024": [
        "2.9 V6 - 510hp"
      ]
    }
  },
  "citroen": {
    "c1": {
      "2005-2014": [
        "1.0 - 68hp",
        "1.4 HDi - 54hp"
      ],
      "2015-2021": [
        "1.0 VTi - 68hp",
        "1.2 PureTech - 82hp"
      ]
    },
    "c3": {
      "2010-2016": [
        "1.0 - 68hp",
        "1.2 PureTech - 82hp",
        "1.4 VTi - 95hp",
        "1.6 VTi - 120hp",
        "1.4 HDi - 70hp",
        "1.6 HDi - 92hp"
      ],
      "2017-2024": [
        "1.0 PureTech - 68hp",
        "1.2 PureTech - 83hp",
        "1.2 PureTech - 110hp",
        "1.5 BlueHDi - 100hp"
      ]
    },
    "c4": {
      "2010-2017": [
        "1.4 VTi - 95hp",
        "1.6 VTi - 120hp",
        "1.6 THP - 156hp",
        "1.6 HDi - 92hp",
        "1.6 HDi - 115hp",
        "2.0 HDi - 150hp"
      ],
      "2018-2024": [
        "1.2 PureTech - 100hp",
        "1.2 PureTech - 130hp",
        "1.6 PureTech - 180hp",
        "1.5 BlueHDi - 110hp",
        "1.5 BlueHDi - 130hp"
      ]
    },
    "c5": {
      "2008-2017": [
        "1.6 THP - 156hp",
        "1.6 THP - 165hp",
        "2.0 - 140hp",
        "1.6 HDi - 112hp",
        "1.6 HDi - 115hp",
        "2.0 HDi - 140hp",
        "2.0 HDi - 163hp",
        "2.2 HDi - 204hp"
      ]
    },
    "c3-aircross": {
      "2017-2024": [
        "1.2 PureTech - 110hp",
        "1.2 PureTech - 130hp",
        "1.5 BlueHDi - 100hp",
        "1.5 BlueHDi - 120hp"
      ]
    },
    "c3-picasso": {
      "2009-2017": [
        "1.4 VTi - 95hp",
        "1.6 VTi - 120hp",
        "1.6 HDi - 92hp",
        "1.6 HDi - 110hp"
      ]
    },
    "c4-cactus": {
      "2014-2017": [
        "1.2 PureTech - 82hp",
        "1.2 PureTech - 110hp",
        "1.6 BlueHDi - 100hp"
      ],
      "2018-2024": [
        "1.2 PureTech - 110hp",
        "1.2 PureTech - 130hp",
        "1.5 BlueHDi - 100hp",
        "1.5 BlueHDi - 120hp"
      ]
    },
    "c4-picasso": {
      "2007-2013": [
        "1.6 THP - 156hp",
        "2.0 HDi - 136hp",
        "2.0 HDi - 150hp"
      ],
      "2014-2018": [
        "1.2 PureTech - 130hp",
        "1.6 THP - 165hp",
        "1.6 BlueHDi - 120hp",
        "2.0 BlueHDi - 150hp"
      ]
    },
    "c4-grand-picasso": {
      "2007-2013": [
        "1.6 THP - 156hp",
        "2.0 HDi - 136hp",
        "2.0 HDi - 150hp"
      ],
      "2014-2018": [
        "1.2 PureTech - 130hp",
        "1.6 THP - 165hp",
        "1.6 BlueHDi - 120hp",
        "2.0 BlueHDi - 150hp"
      ]
    },
    "c5-x": {
      "2022-2024": [
        "1.6 PureTech PHEV - 225hp"
      ]
    },
    "c5-aircross": {
      "2019-2024": [
        "1.2 PureTech - 130hp",
        "1.6 PureTech - 180hp",
        "1.6 PHEV - 225hp",
        "1.5 BlueHDi - 130hp",
        "2.0 BlueHDi - 180hp"
      ]
    },
    "nemo": {
      "2008-2021": [
        "1.3 HDi - 75hp",
        "1.4 - 73hp"
      ]
    },
    "jumpy": {
      "2007-2016": [
        "2.0 HDi - 120hp",
        "2.0 HDi - 136hp",
        "2.0 HDi - 163hp"
      ],
      "2017-2024": [
        "1.5 BlueHDi - 100hp",
        "1.5 BlueHDi - 120hp",
        "2.0 BlueHDi - 120hp",
        "2.0 BlueHDi - 150hp",
        "2.0 BlueHDi - 180hp"
      ]
    },
    "e-berlingo": {
      "2021-2024": [
        "Electric - 136hp"
      ]
    },
    "e-c4": {
      "2021-2024": [
        "Electric - 136hp"
      ]
    },
    "berlingo": {
      "2008-2018": [
        "1.6 VTi - 98hp",
        "1.6 VTi - 120hp",
        "1.6 HDi - 75hp",
        "1.6 HDi - 90hp",
        "1.6 HDi - 115hp"
      ],
      "2019-2024": [
        "1.2 PureTech - 110hp",
        "1.2 PureTech - 130hp",
        "1.5 BlueHDi - 100hp",
        "1.5 BlueHDi - 130hp"
      ]
    },
    "dispatch": {
      "2007-2016": [
        "2.0 HDi - 120hp",
        "2.0 HDi - 136hp",
        "2.0 HDi - 163hp"
      ],
      "2017-2024": [
        "1.5 BlueHDi - 100hp",
        "1.5 BlueHDi - 120hp",
        "2.0 BlueHDi - 120hp",
        "2.0 BlueHDi - 150hp",
        "2.0 BlueHDi - 180hp"
      ]
    },
    "relay": {
      "2006-2014": [
        "2.2 HDi - 100hp",
        "2.2 HDi - 110hp",
        "2.2 HDi - 120hp",
        "2.2 HDi - 130hp",
        "3.0 HDi - 156hp",
        "3.0 HDi - 180hp"
      ],
      "2015-2024": [
        "2.0 BlueHDi - 130hp",
        "2.0 BlueHDi - 140hp",
        "2.0 BlueHDi - 165hp",
        "2.2 BlueHDi - 140hp",
        "2.2 BlueHDi - 165hp"
      ]
    }
  },
  "land-rover": {
    "discovery-sport": {
      "2015-2019": [
        "2.0 Si4 - 240hp",
        "2.0 TD4 - 150hp",
        "2.0 TD4 - 180hp"
      ],
      "2020-2024": [
        "2.0 P200 - 200hp",
        "2.0 P250 - 249hp",
        "2.0 P300 - 300hp",
        "2.0 D150 - 150hp",
        "2.0 D180 - 180hp",
        "2.0 D200 - 204hp"
      ]
    },
    "range-rover-evoque": {
      "2011-2018": [
        "2.0 Si4 - 240hp",
        "2.0 TD4 - 150hp",
        "2.0 SD4 - 190hp"
      ],
      "2019-2024": [
        "2.0 P200 - 200hp",
        "2.0 P250 - 249hp",
        "2.0 P300 - 300hp",
        "2.0 D150 - 150hp",
        "2.0 D180 - 180hp",
        "2.0 D200 - 204hp"
      ]
    },
    "defender": {
      "2020-2024": [
        "2.0 P300 - 300hp",
        "3.0 P400 - 400hp",
        "5.0 V8 - 525hp",
        "2.0 D200 - 200hp",
        "2.0 D240 - 240hp",
        "3.0 D300 - 300hp"
      ]
    },
    "discovery": {
      "2004-2009": [
        "2.7 TD V6 - 190hp",
        "4.0 V6 - 215hp",
        "4.4 V8 - 299hp"
      ],
      "2010-2016": [
        "3.0 SDV6 - 256hp",
        "3.0 Si6 - 340hp",
        "5.0 V8 - 375hp"
      ],
      "2017-2024": [
        "2.0 SD4 - 240hp",
        "3.0 SDV6 - 306hp",
        "3.0 Si6 - 340hp"
      ]
    },
    "range-rover": {
      "2002-2012": [
        "3.0 TD6 - 177hp",
        "3.6 TDV8 - 272hp",
        "4.2 V8 - 396hp",
        "4.4 V8 - 299hp",
        "5.0 V8 - 510hp"
      ],
      "2013-2021": [
        "3.0 SDV6 - 292hp",
        "4.4 SDV8 - 340hp",
        "3.0 SC V6 - 340hp",
        "5.0 V8 SC - 510hp",
        "5.0 V8 SC - 575hp"
      ],
      "2022-2024": [
        "3.0 D300 - 300hp",
        "3.0 D350 - 350hp",
        "3.0 P400 - 400hp",
        "4.4 V8 - 530hp"
      ]
    },
    "range-rover-sport": {
      "2005-2013": [
        "2.7 TDV6 - 190hp",
        "3.0 TDV6 - 245hp",
        "3.6 TDV8 - 272hp",
        "4.2 V8 SC - 390hp",
        "5.0 V8 SC - 510hp"
      ],
      "2014-2024": [
        "3.0 SDV6 - 306hp",
        "4.4 SDV8 - 340hp",
        "3.0 SC V6 - 340hp",
        "5.0 V8 SC - 575hp"
      ]
    },
    "range-rover-velar": {
      "2017-2024": [
        "2.0 D180 - 180hp",
        "2.0 D240 - 240hp",
        "3.0 D300 - 300hp",
        "2.0 P250 - 250hp",
        "2.0 P300 - 300hp",
        "3.0 P380 - 380hp",
        "5.0 V8 - 550hp"
      ]
    },
    "freelander": {
      "1998-2006": [
        "1.8 - 120hp",
        "2.0 TD4 - 112hp",
        "2.5 V6 - 177hp"
      ],
      "2007-2015": [
        "2.2 TD4 - 150hp",
        "2.2 TD4 - 160hp",
        "3.2 - 233hp"
      ]
    },
    "range-rover-autobiography": {
      "2010-2024": [
        "3.0 TDV6 - 258hp",
        "4.4 SDV8 - 339hp",
        "5.0 V8 - 525hp",
        "5.0 Supercharged - 565hp"
      ]
    },
    "range-rover-svr": {
      "2015-2024": [
        "5.0 Supercharged V8 - 575hp"
      ]
    }
  },
  "jeep": {
    "renegade": {
      "2015-2018": [
        "1.4 MultiAir - 140hp",
        "1.4 MultiAir - 170hp",
        "1.6 MultiJet - 120hp",
        "2.0 MultiJet - 140hp"
      ],
      "2019-2024": [
        "1.0 T3 - 120hp",
        "1.3 T4 - 150hp",
        "1.3 T4 - 180hp",
        "1.6 MultiJet - 130hp",
        "2.0 MultiJet - 170hp"
      ]
    },
    "compass": {
      "2007-2016": [
        "2.0 - 156hp",
        "2.4 - 170hp",
        "2.0 CRD - 140hp"
      ],
      "2017-2024": [
        "1.4 MultiAir - 140hp",
        "1.4 MultiAir - 170hp",
        "2.0 MultiAir - 270hp",
        "1.6 MultiJet - 120hp",
        "2.0 MultiJet - 170hp"
      ]
    },
    "cherokee": {
      "2002-2007": [
        "2.4 - 147hp",
        "2.5 CRD - 143hp",
        "2.8 CRD - 163hp",
        "3.7 V6 - 210hp"
      ],
      "2008-2013": [
        "2.8 CRD - 177hp",
        "3.7 V6 - 204hp"
      ],
      "2014-2024": [
        "2.0 MultiAir - 272hp",
        "3.2 V6 - 272hp",
        "2.0 MultiJet - 140hp",
        "2.0 MultiJet - 170hp",
        "2.2 MultiJet - 195hp"
      ]
    },
    "grand-cherokee": {
      "1999-2004": [
        "2.7 CRD - 163hp",
        "4.0 - 190hp",
        "4.7 V8 - 235hp"
      ],
      "2005-2010": [
        "3.0 CRD - 218hp",
        "3.7 V6 - 210hp",
        "4.7 V8 - 231hp",
        "5.7 V8 - 326hp",
        "6.1 V8 SRT - 426hp"
      ],
      "2011-2021": [
        "3.0 CRD - 241hp",
        "3.6 V6 - 286hp",
        "5.7 V8 - 352hp",
        "6.4 V8 SRT - 468hp"
      ],
      "2022-2024": [
        "2.0 Turbo - 272hp",
        "3.6 V6 - 293hp",
        "5.7 V8 - 357hp",
        "6.4 V8 - 475hp"
      ]
    },
    "wrangler": {
      "2007-2017": [
        "2.8 CRD - 177hp",
        "2.8 CRD - 200hp",
        "3.6 V6 - 284hp",
        "3.8 V6 - 199hp"
      ],
      "2018-2024": [
        "2.0 Turbo - 272hp",
        "2.2 MultiJet - 200hp",
        "3.0 EcoDiesel - 264hp",
        "3.6 V6 - 285hp"
      ]
    },
    "gladiator": {
      "2020-2024": [
        "3.0 EcoDiesel - 264hp",
        "3.6 V6 - 285hp"
      ]
    },
    "avenger": {
      "2023-2024": [
        "1.2 Turbo - 100hp",
        "Electric - 156hp"
      ]
    },
    "commander": {
      "2006-2010": [
        "3.7 V6 - 210hp",
        "4.7 V8 - 231hp",
        "5.7 V8 - 326hp",
        "2.8 CRD - 177hp"
      ]
    },
    "liberty": {
      "2002-2007": [
        "2.4 - 147hp",
        "3.7 V6 - 210hp",
        "2.5 CRD - 143hp",
        "2.8 CRD - 163hp"
      ],
      "2008-2012": [
        "3.7 V6 - 204hp",
        "2.8 CRD - 177hp"
      ]
    },
    "patriot": {
      "2007-2017": [
        "2.0 - 158hp",
        "2.4 - 172hp",
        "2.0 CRD - 140hp",
        "2.2 CRD - 163hp"
      ]
    }
  },
  "mini": {
    "hatch": {
      "2006-2010": [
        "1.4 One - 95hp",
        "1.6 Cooper - 120hp",
        "1.6 Cooper D - 109hp",
        "1.6 One D - 90hp",
        "1.6 Cooper S - 175hp",
        "1.6 JCW - 211hp"
      ],
      "2011-2013": [
        "1.6 One - 98hp",
        "1.6 Cooper - 122hp",
        "1.6 Cooper D - 112hp",
        "2.0 Cooper SD - 143hp",
        "1.6 Cooper S - 175hp",
        "1.6 JCW - 211hp",
        "1.6 D - 110hp"
      ],
      "2014-2017": [
        "1.2 One - 102hp",
        "1.5 One D - 95hp",
        "1.5 Cooper - 136hp",
        "1.5 Cooper D - 116hp",
        "2.0 Cooper SD - 170hp",
        "2.0 Cooper S - 192hp",
        "2.0 JCW - 231hp"
      ],
      "2018-2021": [
        "1.5 One - 102hp",
        "1.5 Cooper - 136hp",
        "1.5 Cooper D - 116hp",
        "2.0 Cooper S - 192hp",
        "2.0 Cooper SD - 170hp",
        "2.0 JCW - 231hp"
      ],
      "2022-2026": [
        "1.5 Cooper - 136hp",
        "2.0 Cooper S - 178hp",
        "2.0 Cooper S - 204hp",
        "Electric Cooper E - 184hp",
        "Electric Cooper SE - 218hp",
        "2.0 JCW - 231hp"
      ]
    },
    "clubman": {
      "2007-2010": [
        "1.6 One - 98hp",
        "1.6 Cooper - 122hp",
        "1.6 Cooper D - 109hp",
        "1.6 Cooper S - 174hp"
      ],
      "2011-2014": [
        "1.6 Cooper - 122hp",
        "1.6 Cooper S - 184hp",
        "1.6 JCW - 211hp",
        "1.6 D - 112hp",
        "2.0 D - 143hp"
      ],
      "2015-2019": [
        "1.5 One - 102hp",
        "1.5 Cooper - 136hp",
        "1.5 Cooper D - 150hp",
        "2.0 Cooper SD - 190hp",
        "2.0 Cooper S - 192hp",
        "2.0 JCW - 306hp"
      ],
      "2020-2024": [
        "1.5 Cooper - 136hp",
        "2.0 Cooper S - 178hp",
        "2.0 Cooper S - 192hp",
        "2.0 JCW - 306hp"
      ]
    },
    "countryman": {
      "2010-2016": [
        "1.6 Cooper - 122hp",
        "1.6 Cooper S - 184hp",
        "2.0 Cooper SD - 143hp",
        "1.6 JCW - 218hp",
        "1.6 D - 112hp",
        "2.0 D - 143hp"
      ],
      "2017-2020": [
        "1.5 One - 102hp",
        "1.5 Cooper - 136hp",
        "2.0 Cooper SD - 190hp",
        "2.0 Cooper S - 192hp",
        "2.0 Cooper S ALL4 - 192hp",
        "2.0 JCW - 306hp",
        "1.5 D - 116hp"
      ],
      "2021-2024": [
        "1.5 Cooper - 136hp",
        "1.5 Cooper D - 150hp",
        "2.0 Cooper S - 178hp",
        "2.0 Cooper S ALL4 - 178hp",
        "2.0 JCW ALL4 - 306hp"
      ],
      "2025-2026": [
        "1.5 C - 170hp",
        "2.0 S ALL4 - 218hp",
        "Electric Countryman E - 204hp",
        "Electric Countryman SE ALL4 - 313hp",
        "Electric JCW Countryman ALL4 - 313hp"
      ]
    },
    "convertible": {
      "2009-2015": [
        "1.6 One - 98hp",
        "1.6 Cooper - 122hp",
        "1.6 Cooper S - 184hp",
        "1.6 JCW - 211hp"
      ],
      "2016-2020": [
        "1.5 Cooper - 136hp",
        "2.0 Cooper S - 192hp",
        "2.0 JCW - 231hp"
      ],
      "2021-2026": [
        "1.5 Cooper - 136hp",
        "2.0 Cooper S - 178hp",
        "2.0 JCW - 231hp"
      ]
    },
    "paceman": {
      "2013-2016": [
        "1.6 Cooper D - 112hp",
        "1.6 Cooper - 122hp",
        "1.6 Cooper S - 184hp",
        "1.6 JCW - 218hp",
        "2.0 D - 143hp"
      ]
    },
    "coupe": {
      "2011-2015": [
        "1.6 Cooper - 122hp",
        "1.6 Cooper S - 184hp",
        "1.6 JCW - 211hp",
        "2.0 D - 143hp"
      ]
    },
    "roadster": {
      "2012-2015": [
        "2.0 Cooper SD - 143hp",
        "1.6 Cooper - 122hp",
        "1.6 Cooper S - 184hp",
        "1.6 JCW - 211hp"
      ]
    },
    "john-cooper-works-gp": {
      "2006-2008": [
        "1.6 Supercharged - 218hp"
      ],
      "2013-2013": [
        "1.6 Turbo - 218hp"
      ],
      "2020-2021": [
        "2.0 Turbo - 306hp"
      ]
    },
    "cooper-s-works": {
      "2001-2006": [
        "1.6 Supercharged - 200hp",
        "1.6 Supercharged - 210hp"
      ]
    },
    "electric": {
      "2020-2023": [
        "Electric Cooper SE - 184hp"
      ],
      "2024-2026": [
        "Electric Cooper E - 184hp",
        "Electric Cooper SE - 218hp",
        "Electric JCW - 258hp"
      ]
    },
    "jcw": {
      "2008-2014": [
        "1.6 Turbo - 211hp"
      ],
      "2015-2019": [
        "2.0 Turbo - 231hp"
      ],
      "2020-2026": [
        "2.0 Turbo - 231hp",
        "2.0 Turbo - 306hp",
        "Electric JCW - 258hp"
      ]
    },
    "cooper-s": {
      "2006-2013": [
        "1.6 Turbo - 175hp",
        "1.6 Turbo - 184hp"
      ],
      "2014-2020": [
        "2.0 Turbo - 192hp"
      ],
      "2021-2026": [
        "2.0 Turbo - 178hp",
        "1.6 Turbo - 184hp",
        "2.0 Turbo - 192hp"
      ]
    },
    "aceman": {
      "2024-2026": [
        "Electric Aceman E - 184hp",
        "Electric Aceman SE - 218hp",
        "Electric JCW Aceman - 258hp"
      ]
    }
  },
  "porsche": {
    "911": {
      "2005-2011": [
        "3.6 Carrera - 325hp",
        "3.8 Carrera S - 385hp",
        "3.6 Turbo - 480hp",
        "3.8 GT3 - 435hp"
      ],
      "2012-2018": [
        "3.4 Carrera - 350hp",
        "3.8 Carrera S - 400hp",
        "3.8 Turbo - 540hp",
        "4.0 GT3 - 500hp"
      ],
      "2019-2024": [
        "3.0 Carrera - 385hp",
        "3.0 Carrera S - 450hp",
        "3.8 Turbo S - 650hp",
        "4.0 GT3 - 510hp"
      ]
    },
    "718-cayman": {
      "2016-2024": [
        "2.0 - 300hp",
        "2.5 - 365hp",
        "4.0 GTS - 400hp"
      ]
    },
    "718-boxster": {
      "2016-2024": [
        "2.0 - 300hp",
        "2.5 - 365hp",
        "4.0 GTS - 400hp"
      ]
    },
    "panamera": {
      "2010-2016": [
        "3.0 Diesel - 250hp",
        "3.6 V6 - 310hp",
        "4.8 V8 - 400hp",
        "4.8 Turbo - 500hp"
      ],
      "2017-2024": [
        "3.0 V6 - 330hp",
        "2.9 V6 - 440hp",
        "4.0 V8 - 550hp",
        "4.0 Turbo S - 630hp"
      ]
    },
    "macan": {
      "2014-2018": [
        "2.0 - 252hp",
        "3.0 S - 340hp",
        "3.6 Turbo - 400hp",
        "3.0 Diesel - 258hp"
      ],
      "2019-2024": [
        "2.0 - 265hp",
        "2.9 S - 380hp",
        "2.9 GTS - 440hp",
        "3.0 Diesel - 262hp"
      ]
    },
    "cayenne": {
      "2003-2010": [
        "3.2 V6 - 250hp",
        "3.6 V6 - 290hp",
        "4.5 V8 - 340hp",
        "4.8 Turbo - 500hp",
        "3.0 Diesel - 240hp"
      ],
      "2011-2017": [
        "3.0 Diesel - 245hp",
        "3.0 S Hybrid - 416hp",
        "3.6 V6 - 420hp",
        "4.8 Turbo - 520hp"
      ],
      "2018-2024": [
        "3.0 V6 - 340hp",
        "2.9 S - 440hp",
        "4.0 Turbo - 550hp",
        "3.0 Diesel - 340hp"
      ]
    },
    "taycan": {
      "2020-2024": [
        "4S - 530hp",
        "Turbo - 680hp",
        "Turbo S - 761hp"
      ]
    },
    "911-turbo": {
      "2005-2011": [
        "3.6 Turbo - 480hp",
        "3.8 GT2 - 530hp",
        "3.6 Turbo S - 530hp"
      ],
      "2012-2018": [
        "3.8 Turbo - 520hp",
        "3.8 Turbo S - 580hp"
      ],
      "2019-2024": [
        "3.8 Turbo - 580hp",
        "3.8 Turbo S - 650hp"
      ]
    },
    "911-gt3": {
      "2005-2011": [
        "3.6 - 415hp",
        "3.8 - 435hp"
      ],
      "2012-2018": [
        "3.8 - 475hp",
        "4.0 - 500hp"
      ],
      "2019-2024": [
        "4.0 - 510hp",
        "4.0 GT3 RS - 525hp"
      ]
    },
    "carrera-gt": {
      "2004-2007": [
        "5.7 V10 - 612hp"
      ]
    },
    "cayman-gt4": {
      "2015-2019": [
        "3.8 - 385hp"
      ],
      "2020-2024": [
        "4.0 - 420hp"
      ]
    },
    "boxster-spyder": {
      "2010-2011": [
        "3.4 - 320hp"
      ],
      "2015-2019": [
        "3.8 - 375hp"
      ],
      "2020-2024": [
        "4.0 - 420hp"
      ]
    },
    "carrera": {
      "2005-2011": [
        "3.6 - 325hp",
        "3.8 S - 355hp"
      ],
      "2012-2018": [
        "3.4 - 350hp",
        "3.8 S - 400hp"
      ],
      "2019-2024": [
        "3.0 - 385hp",
        "3.0 S - 450hp"
      ]
    }
  },
  "lexus": {
    "ct": {
      "2011-2024": [
        "1.8 Hybrid - 136hp"
      ]
    },
    "is": {
      "2005-2013": [
        "2.2 D - 177hp",
        "2.5 V6 - 208hp",
        "3.5 V8 - 306hp"
      ],
      "2014-2024": [
        "2.0 Turbo - 245hp",
        "2.5 Hybrid - 223hp",
        "3.5 V6 - 318hp"
      ]
    },
    "es": {
      "2012-2018": [
        "2.5 V6 - 208hp",
        "3.5 V6 - 277hp"
      ],
      "2019-2024": [
        "2.5 Hybrid - 218hp"
      ]
    },
    "gs": {
      "2005-2011": [
        "3.0 V6 - 249hp",
        "3.5 V6 - 303hp",
        "4.3 V8 - 283hp",
        "5.0 V8 - 417hp"
      ],
      "2012-2020": [
        "2.5 Hybrid - 223hp",
        "3.5 V6 - 318hp",
        "5.0 V8 - 477hp"
      ]
    },
    "ls": {
      "2006-2017": [
        "4.6 V8 - 385hp",
        "5.0 V8 - 389hp"
      ],
      "2018-2024": [
        "3.5 V6 Hybrid - 359hp"
      ]
    },
    "ux": {
      "2019-2024": [
        "2.0 - 169hp",
        "2.0 Hybrid - 184hp"
      ]
    },
    "nx": {
      "2015-2021": [
        "2.0 Turbo - 238hp",
        "2.5 Hybrid - 197hp"
      ],
      "2022-2024": [
        "2.4 Turbo - 279hp",
        "2.5 Hybrid - 244hp",
        "2.5 PHEV - 309hp"
      ]
    },
    "rx": {
      "2003-2008": [
        "3.3 V6 - 230hp",
        "3.5 V6 Hybrid - 272hp"
      ],
      "2009-2015": [
        "3.5 V6 - 277hp",
        "3.5 V6 Hybrid - 299hp"
      ],
      "2016-2024": [
        "2.0 Turbo - 238hp",
        "3.5 V6 - 300hp",
        "3.5 V6 Hybrid - 313hp"
      ]
    },
    "lc": {
      "2017-2024": [
        "3.5 V6 Hybrid - 359hp",
        "5.0 V8 - 477hp"
      ]
    },
    "lx": {
      "2008-2015": [
        "5.7 V8 - 383hp"
      ],
      "2016-2024": [
        "3.5 V6 - 409hp",
        "3.5 V6 Hybrid - 415hp"
      ]
    },
    "rc": {
      "2015-2024": [
        "2.0 Turbo - 245hp",
        "3.5 V6 - 318hp"
      ]
    },
    "rc-f": {
      "2015-2024": [
        "5.0 V8 - 477hp"
      ]
    },
    "gs-f": {
      "2016-2020": [
        "5.0 V8 - 477hp"
      ]
    },
    "is-f": {
      "2008-2014": [
        "5.0 V8 - 423hp"
      ]
    },
    "lfa": {
      "2010-2012": [
        "4.8 V10 - 560hp"
      ]
    }
  },
  "jaguar": {
    "xe": {
      "2015-2024": [
        "2.0 i4 - 200hp",
        "2.0 i4 - 250hp",
        "3.0 V6 S - 380hp",
        "2.0 D - 163hp",
        "2.0 D - 180hp",
        "2.0 D - 240hp"
      ]
    },
    "xf": {
      "2008-2015": [
        "2.2 D - 190hp",
        "3.0 D - 275hp",
        "3.0 V6 - 240hp",
        "5.0 V8 - 385hp"
      ],
      "2016-2024": [
        "2.0 i4 - 250hp",
        "3.0 V6 S - 380hp",
        "5.0 V8 - 550hp",
        "2.0 D - 163hp",
        "2.0 D - 240hp",
        "3.0 D - 300hp"
      ]
    },
    "xj": {
      "2003-2009": [
        "2.7 D V6 - 207hp",
        "3.0 V6 - 240hp",
        "4.2 V8 - 298hp"
      ],
      "2010-2019": [
        "3.0 D V6 - 275hp",
        "3.0 V6 SC - 340hp",
        "5.0 V8 SC - 510hp"
      ]
    },
    "f-type": {
      "2013-2024": [
        "2.0 i4 - 300hp",
        "3.0 V6 S - 380hp",
        "5.0 V8 R - 575hp"
      ]
    },
    "e-pace": {
      "2018-2024": [
        "1.5 i3 - 160hp",
        "2.0 i4 - 200hp",
        "2.0 i4 - 249hp",
        "2.0 i4 - 300hp",
        "2.0 D - 150hp",
        "2.0 D - 180hp",
        "2.0 D - 204hp"
      ]
    },
    "f-pace": {
      "2016-2024": [
        "2.0 i4 - 250hp",
        "2.0 i4 - 300hp",
        "3.0 V6 S - 380hp",
        "5.0 V8 SVR - 550hp",
        "2.0 D - 163hp",
        "2.0 D - 240hp",
        "3.0 D - 300hp"
      ]
    },
    "i-pace": {
      "2018-2024": [
        "Electric - 400hp"
      ]
    },
    "x-type": {
      "2001-2009": [
        "2.0 V6 - 130hp",
        "2.5 V6 - 194hp",
        "3.0 V6 - 231hp",
        "2.0 D - 130hp",
        "2.2 D - 155hp"
      ]
    },
    "s-type": {
      "1999-2007": [
        "2.5 V6 - 201hp",
        "3.0 V6 - 240hp",
        "4.2 V8 - 300hp",
        "2.7 D V6 - 207hp"
      ]
    },
    "xk": {
      "2006-2014": [
        "4.2 V8 - 300hp",
        "5.0 V8 - 385hp",
        "5.0 V8 R - 510hp"
      ]
    },
    "xfr": {
      "2009-2015": [
        "5.0 V8 SC - 510hp"
      ],
      "2016-2021": [
        "5.0 V8 SC - 550hp"
      ]
    },
    "xkr": {
      "2007-2014": [
        "5.0 V8 SC - 510hp"
      ]
    },
    "f-type-r": {
      "2013-2024": [
        "5.0 V8 SC - 550hp",
        "5.0 V8 SC - 575hp"
      ]
    },
    "f-pace-svr": {
      "2018-2024": [
        "5.0 V8 SC - 550hp"
      ]
    }
  },
  "dacia": {
    "sandero": {
      "2008-2012": [
        "1.2 - 75hp",
        "1.4 - 75hp",
        "1.6 - 90hp",
        "1.5 dCi - 68hp",
        "1.5 dCi - 85hp"
      ],
      "2013-2020": [
        "0.9 TCe - 90hp",
        "1.2 - 75hp",
        "1.5 dCi - 75hp",
        "1.5 dCi - 90hp"
      ],
      "2021-2024": [
        "1.0 TCe - 90hp",
        "1.0 TCe - 100hp"
      ]
    },
    "logan": {
      "2004-2012": [
        "1.4 - 75hp",
        "1.6 - 87hp",
        "1.6 - 105hp",
        "1.5 dCi - 68hp",
        "1.5 dCi - 85hp"
      ],
      "2013-2020": [
        "0.9 TCe - 90hp",
        "1.2 - 75hp",
        "1.0 TCe - 100hp",
        "1.5 dCi - 75hp",
        "1.5 dCi - 90hp"
      ]
    },
    "duster": {
      "2010-2017": [
        "1.6 - 105hp",
        "1.6 - 114hp",
        "1.5 dCi - 90hp",
        "1.5 dCi - 110hp"
      ],
      "2018-2024": [
        "1.0 TCe - 100hp",
        "1.3 TCe - 130hp",
        "1.3 TCe - 150hp",
        "1.5 dCi - 95hp",
        "1.5 Blue dCi - 115hp"
      ]
    },
    "jogger": {
      "2022-2024": [
        "1.0 TCe - 110hp",
        "1.0 TCe Hybrid - 140hp"
      ]
    },
    "spring": {
      "2021-2024": [
        "Electric - 44hp",
        "Electric - 65hp"
      ]
    },
    "dokker": {
      "2012-2021": [
        "1.2 TCe - 115hp",
        "1.5 dCi - 75hp",
        "1.5 dCi - 90hp"
      ]
    },
    "lodgy": {
      "2012-2021": [
        "1.2 TCe - 115hp",
        "1.5 dCi - 90hp",
        "1.5 dCi - 110hp"
      ]
    }
  },
  "suzuki": {
    "ignis": {
      "2017-2024": [
        "1.2 Dualjet - 90hp",
        "1.2 Dualjet Hybrid - 83hp"
      ]
    },
    "swift": {
      "2005-2010": [
        "1.3 - 92hp",
        "1.5 - 102hp",
        "1.6 Sport - 125hp",
        "1.3 DDiS - 75hp"
      ],
      "2011-2017": [
        "1.2 - 94hp",
        "1.6 Sport - 136hp",
        "1.3 DDiS - 75hp"
      ],
      "2018-2024": [
        "1.0 Boosterjet - 111hp",
        "1.2 Dualjet - 90hp",
        "1.4 Boosterjet Sport - 140hp"
      ]
    },
    "baleno": {
      "2016-2022": [
        "1.0 Boosterjet - 111hp",
        "1.2 Dualjet - 90hp"
      ]
    },
    "vitara": {
      "2015-2024": [
        "1.0 Boosterjet - 111hp",
        "1.4 Boosterjet - 140hp",
        "1.6 - 120hp",
        "1.6 DDiS - 120hp"
      ]
    },
    "s-cross": {
      "2014-2024": [
        "1.0 Boosterjet - 111hp",
        "1.4 Boosterjet - 140hp",
        "1.6 DDiS - 120hp"
      ]
    },
    "jimny": {
      "1998-2018": [
        "1.3 - 85hp"
      ],
      "2019-2024": [
        "1.5 - 102hp"
      ]
    },
    "celerio": {
      "2015-2024": [
        "1.0 - 68hp"
      ]
    },
    "sx4": {
      "2006-2014": [
        "1.5 - 99hp",
        "1.6 - 107hp",
        "2.0 - 145hp",
        "1.6 DDiS - 90hp",
        "1.9 DDiS - 120hp"
      ]
    },
    "grand-vitara": {
      "2005-2015": [
        "1.6 - 106hp",
        "2.0 - 140hp",
        "2.4 - 166hp",
        "3.2 V6 - 233hp",
        "1.9 DDiS - 129hp"
      ]
    },
    "splash": {
      "2008-2015": [
        "1.0 - 68hp",
        "1.2 - 86hp",
        "1.3 DDiS - 75hp"
      ]
    },
    "alto": {
      "2009-2014": [
        "1.0 - 68hp"
      ]
    },
    "swift-sport": {
      "2006-2011": [
        "1.6 - 125hp"
      ],
      "2012-2017": [
        "1.6 - 136hp"
      ],
      "2018-2024": [
        "1.4 Boosterjet - 140hp"
      ]
    }
  },
  "subaru": {
    "impreza": {
      "2000-2007": [
        "1.5 - 90hp",
        "1.6 - 105hp",
        "2.0 - 125hp",
        "2.0 Turbo WRX - 218hp",
        "2.5 Turbo STI - 280hp"
      ],
      "2008-2016": [
        "1.5 - 107hp",
        "1.6 - 114hp",
        "2.0 - 150hp",
        "2.5 Turbo WRX - 265hp",
        "2.5 Turbo STI - 300hp"
      ],
      "2017-2024": [
        "1.6 - 114hp",
        "2.0 - 156hp",
        "2.0 Turbo WRX - 268hp"
      ]
    },
    "legacy": {
      "2004-2009": [
        "2.0 - 165hp",
        "2.5 - 167hp",
        "3.0 H6 - 245hp",
        "2.0 D - 150hp"
      ],
      "2010-2024": [
        "2.5 - 175hp",
        "3.6 H6 - 256hp"
      ]
    },
    "outback": {
      "2004-2009": [
        "2.5 - 173hp",
        "3.0 H6 - 245hp",
        "2.0 D - 150hp"
      ],
      "2010-2014": [
        "2.0 D - 150hp",
        "2.5 - 173hp",
        "3.6 H6 - 256hp"
      ],
      "2015-2024": [
        "2.5 - 175hp",
        "2.4 Turbo - 260hp"
      ]
    },
    "forester": {
      "2002-2007": [
        "2.0 - 125hp",
        "2.5 - 165hp",
        "2.5 Turbo - 230hp"
      ],
      "2008-2012": [
        "2.0 - 150hp",
        "2.5 - 171hp",
        "2.5 Turbo - 241hp",
        "2.0 D - 147hp"
      ],
      "2013-2018": [
        "2.0 - 150hp",
        "2.0 Turbo - 241hp",
        "2.0 D - 147hp"
      ],
      "2019-2024": [
        "2.0 - 154hp",
        "1.8 Turbo - 177hp"
      ]
    },
    "xv": {
      "2012-2017": [
        "1.6 - 114hp",
        "2.0 - 150hp",
        "2.0 D - 147hp"
      ],
      "2018-2024": [
        "1.6 - 114hp",
        "2.0 - 156hp"
      ]
    },
    "brz": {
      "2013-2024": [
        "2.0 - 200hp",
        "2.4 - 228hp"
      ]
    },
    "levorg": {
      "2015-2024": [
        "1.6 Turbo - 170hp",
        "2.0 Turbo - 300hp"
      ]
    },
    "wrx": {
      "2001-2007": [
        "2.0 Turbo - 218hp",
        "2.5 Turbo - 265hp"
      ],
      "2008-2014": [
        "2.5 Turbo - 265hp",
        "2.5 Turbo - 305hp"
      ],
      "2015-2024": [
        "2.0 Turbo - 268hp",
        "2.4 Turbo - 271hp"
      ]
    },
    "wrx-sti": {
      "2001-2007": [
        "2.0 Turbo - 280hp"
      ],
      "2008-2014": [
        "2.5 Turbo - 300hp"
      ],
      "2015-2021": [
        "2.5 Turbo - 300hp"
      ]
    },
    "tribeca": {
      "2006-2014": [
        "3.0 H6 - 245hp",
        "3.6 H6 - 256hp"
      ]
    },
    "solterra": {
      "2023-2024": [
        "Electric - 215hp"
      ]
    }
  },
  "mitsubishi": {
    "mirage": {
      "2013-2024": [
        "1.0 - 71hp",
        "1.2 - 80hp"
      ]
    },
    "eclipse-cross": {
      "2018-2024": [
        "1.5 Turbo - 163hp",
        "2.2 Di-D - 150hp"
      ]
    },
    "outlander": {
      "2007-2012": [
        "2.0 - 147hp",
        "2.4 - 170hp",
        "3.0 V6 - 230hp",
        "2.2 Di-D - 156hp"
      ],
      "2013-2021": [
        "2.0 - 150hp",
        "2.2 Di-D - 150hp",
        "2.4 PHEV - 224hp"
      ],
      "2022-2024": [
        "2.5 PHEV - 252hp"
      ]
    },
    "asx": {
      "2010-2024": [
        "1.6 - 117hp",
        "2.0 - 150hp",
        "1.6 Di-D - 114hp",
        "1.8 Di-D - 150hp"
      ]
    },
    "l200": {
      "2006-2015": [
        "2.5 Di-D - 136hp",
        "2.5 Di-D - 178hp"
      ],
      "2016-2024": [
        "2.2 Di-D - 150hp",
        "2.3 Di-D - 181hp"
      ]
    },
    "colt": {
      "2004-2013": [
        "1.1 - 75hp",
        "1.3 - 95hp",
        "1.5 - 109hp",
        "1.5 Turbo - 150hp",
        "1.5 DI-D - 95hp"
      ]
    },
    "lancer": {
      "2008-2017": [
        "1.5 - 109hp",
        "1.8 - 143hp",
        "2.0 - 150hp",
        "2.0 Turbo Evo X - 295hp",
        "1.8 Di-D - 150hp"
      ]
    },
    "shogun": {
      "2007-2021": [
        "3.2 Di-D - 200hp",
        "3.8 V6 - 250hp"
      ]
    },
    "pajero": {
      "2007-2021": [
        "3.0 V6 - 178hp",
        "3.2 Di-D - 200hp",
        "3.8 V6 - 250hp"
      ]
    },
    "space-star": {
      "2013-2024": [
        "1.0 - 71hp",
        "1.2 - 80hp"
      ]
    },
    "outlander-phev": {
      "2014-2020": [
        "2.0 PHEV - 203hp",
        "2.4 PHEV - 224hp"
      ],
      "2021-2024": [
        "2.4 PHEV - 252hp"
      ]
    }
  },
  "tesla": {
    "model-3": {
      "2018-2024": [
        "RWD - 325hp",
        "Long Range AWD - 462hp",
        "Performance - 513hp"
      ]
    },
    "model-s": {
      "2012-2015": [
        "60 - 380hp",
        "85 - 422hp",
        "P85 - 421hp"
      ],
      "2016-2020": [
        "75D - 525hp",
        "100D - 588hp",
        "P100D - 762hp"
      ],
      "2021-2024": [
        "Long Range - 670hp",
        "Plaid - 1020hp"
      ]
    },
    "model-x": {
      "2016-2020": [
        "75D - 525hp",
        "100D - 588hp",
        "P100D - 762hp"
      ],
      "2021-2024": [
        "Long Range - 670hp",
        "Plaid - 1020hp"
      ]
    },
    "model-y": {
      "2020-2024": [
        "RWD - 299hp",
        "Long Range AWD - 462hp",
        "Performance - 513hp"
      ]
    },
    "roadster": {
      "2008-2012": [
        "Electric - 288hp"
      ],
      "2023-2024": [
        "Electric - 1000hp"
      ]
    },
    "cybertruck": {
      "2024-2024": [
        "Single Motor - 340hp",
        "Dual Motor - 600hp",
        "Tri Motor - 845hp"
      ]
    }
  },
  "bentley": {
    "continental-gt": {
      "2003-2010": [
        "6.0 W12 - 552hp",
        "6.0 W12 - 612hp"
      ],
      "2011-2024": [
        "4.0 V8 - 507hp",
        "6.0 W12 - 635hp"
      ]
    },
    "flying-spur": {
      "2006-2013": [
        "6.0 W12 - 552hp",
        "6.0 W12 - 616hp"
      ],
      "2014-2024": [
        "4.0 V8 - 507hp",
        "6.0 W12 - 635hp"
      ]
    },
    "bentayga": {
      "2016-2024": [
        "3.0 Hybrid - 462hp",
        "4.0 V8 - 550hp",
        "6.0 W12 - 635hp"
      ]
    },
    "mulsanne": {
      "2010-2020": [
        "6.75 V8 - 505hp",
        "6.75 V8 - 530hp"
      ]
    },
    "continental-gtc": {
      "2006-2011": [
        "6.0 W12 - 560hp",
        "6.0 W12 - 610hp"
      ],
      "2012-2024": [
        "4.0 V8 - 507hp",
        "6.0 W12 - 635hp"
      ]
    }
  },
  "maserati": {
    "ghibli": {
      "2014-2024": [
        "2.0 Turbo - 330hp",
        "3.0 V6 - 350hp",
        "3.0 V6 S - 430hp",
        "3.0 V6 D - 275hp"
      ]
    },
    "quattroporte": {
      "2004-2012": [
        "4.2 V8 - 400hp",
        "4.7 V8 S - 430hp"
      ],
      "2013-2024": [
        "3.0 V6 - 330hp",
        "3.0 V6 S - 430hp",
        "3.8 V8 GTS - 530hp",
        "3.0 V6 D - 275hp"
      ]
    },
    "levante": {
      "2016-2024": [
        "3.0 V6 - 350hp",
        "3.0 V6 S - 430hp",
        "3.8 V8 Trofeo - 580hp",
        "3.0 V6 D - 275hp"
      ]
    },
    "mc20": {
      "2021-2024": [
        "3.0 V6 Nettuno - 630hp"
      ]
    },
    "granturismo": {
      "2008-2019": [
        "4.2 V8 - 405hp",
        "4.7 V8 S - 440hp"
      ],
      "2023-2024": [
        "3.0 V6 - 490hp"
      ]
    },
    "grancabrio": {
      "2010-2019": [
        "4.7 V8 - 440hp"
      ]
    },
    "grecale": {
      "2022-2024": [
        "2.0 Turbo - 300hp",
        "3.0 V6 - 330hp",
        "3.0 V6 Trofeo - 530hp"
      ]
    }
  },
  "abarth": {
    "595": {
      "2008-2024": [
        "1.4 T-Jet - 145hp",
        "1.4 T-Jet - 165hp",
        "1.4 T-Jet - 180hp"
      ]
    },
    "695": {
      "2008-2024": [
        "1.4 T-Jet - 180hp",
        "1.4 T-Jet Biposto - 190hp"
      ]
    },
    "500e": {
      "2024": [
        "Electric - 155hp"
      ]
    },
    "124-spider": {
      "2016-2024": [
        "1.4 Turbo - 170hp"
      ]
    },
    "grande-punto": {
      "2007-2010": [
        "1.4 T-Jet - 155hp"
      ]
    },
    "punto-evo": {
      "2010-2012": [
        "1.4 Turbo - 165hp"
      ]
    }
  },
  "ds": {
    "ds-3": {
      "2010-2019": [
        "1.2 PureTech - 110hp",
        "1.6 THP - 155hp",
        "1.6 THP - 208hp",
        "1.6 BlueHDi - 100hp",
        "1.6 BlueHDi - 120hp"
      ]
    },
    "ds-4": {
      "2011-2018": [
        "1.6 THP - 165hp",
        "1.6 THP - 210hp",
        "1.6 BlueHDi - 120hp",
        "2.0 BlueHDi - 180hp"
      ],
      "2021-2024": [
        "1.2 PureTech - 130hp",
        "1.6 PureTech - 225hp",
        "1.5 BlueHDi - 130hp"
      ]
    },
    "ds-7": {
      "2018-2024": [
        "1.6 PureTech - 180hp",
        "1.6 PureTech - 225hp",
        "2.0 BlueHDi - 180hp"
      ]
    },
    "ds-9": {
      "2021-2024": [
        "1.6 PureTech - 225hp",
        "2.0 BlueHDi - 180hp"
      ]
    },
    "ds-5": {
      "2012-2018": [
        "1.6 THP - 165hp",
        "1.6 THP - 210hp",
        "1.6 BlueHDi - 120hp",
        "2.0 BlueHDi - 180hp"
      ]
    },
    "ds3-crossback": {
      "2019-2024": [
        "1.2 PureTech - 100hp",
        "1.2 PureTech - 130hp",
        "1.5 BlueHDi - 110hp",
        "Electric - 136hp"
      ]
    },
    "ds-3-crossback": {
      "2019-2024": [
        "1.2 PureTech - 100hp",
        "1.2 PureTech - 130hp",
        "1.5 BlueHDi - 110hp",
        "Electric - 136hp"
      ]
    }
  },
  "smart": {
    "1": {
      "2023-2024": [
        "Electric - 272hp"
      ]
    },
    "3": {
      "2024-2024": [
        "Electric - 272hp"
      ]
    },
    "fortwo": {
      "2007-2014": [
        "1.0 - 61hp",
        "1.0 - 84hp",
        "0.8 CDI - 54hp"
      ],
      "2015-2024": [
        "0.9 Turbo - 90hp",
        "Electric - 82hp"
      ]
    },
    "forfour": {
      "2015-2024": [
        "0.9 Turbo - 90hp",
        "1.0 - 71hp"
      ]
    },
    "eq": {
      "2020-2024": [
        "Electric - 82hp"
      ]
    },
    "roadster": {
      "2003-2007": [
        "0.7 Turbo - 82hp",
        "0.7 Turbo - 101hp"
      ]
    },
    "crossblade": {
      "2002-2003": [
        "0.6 Turbo - 71hp"
      ]
    },
    "forfour-brabus": {
      "2016-2024": [
        "0.9 Turbo - 109hp"
      ]
    },
    "#1": {
      "2023-2024": [
        "Electric - 272hp"
      ]
    },
    "#3": {
      "2024-2024": [
        "Electric - 272hp"
      ]
    }
  },
  "ssangyong": {
    "tivoli": {
      "2015-2024": [
        "1.2 Turbo - 128hp",
        "1.5 Turbo - 163hp",
        "1.6 Diesel - 115hp",
        "1.6 Diesel - 136hp"
      ]
    },
    "korando": {
      "2011-2024": [
        "1.5 Turbo - 163hp",
        "2.0 Diesel - 148hp",
        "2.2 Diesel - 181hp"
      ]
    },
    "rexton": {
      "2017-2024": [
        "2.2 Diesel - 181hp",
        "2.2 Diesel - 202hp"
      ]
    },
    "musso": {
      "2018-2024": [
        "2.2 Diesel - 181hp"
      ]
    },
    "korando-sports": {
      "2004-2012": [
        "2.9 Diesel - 122hp"
      ]
    },
    "actyon": {
      "2006-2013": [
        "2.0 - 141hp",
        "2.3 - 150hp",
        "2.0 Diesel - 141hp"
      ]
    },
    "rodius": {
      "2005-2013": [
        "2.7 Diesel - 165hp",
        "3.2 - 220hp"
      ]
    },
    "kyron": {
      "2005-2014": [
        "2.0 Diesel - 141hp",
        "2.3 - 150hp",
        "2.7 Diesel - 165hp",
        "3.2 - 220hp"
      ]
    }
  },
  "infiniti": {
    "q30": {
      "2016-2019": [
        "1.5 dCi - 109hp",
        "1.6 Turbo - 122hp",
        "2.0 Turbo - 211hp",
        "2.2 dCi - 170hp"
      ]
    },
    "q50": {
      "2014-2024": [
        "2.0 Turbo - 211hp",
        "3.0 Turbo - 300hp",
        "3.5 Hybrid - 364hp",
        "2.2 dCi - 170hp"
      ]
    },
    "q60": {
      "2016-2024": [
        "2.0 Turbo - 211hp",
        "3.0 Turbo - 400hp"
      ]
    },
    "qx30": {
      "2017-2019": [
        "1.6 Turbo - 122hp",
        "2.0 Turbo - 211hp",
        "2.2 dCi - 170hp"
      ]
    },
    "qx50": {
      "2014-2024": [
        "2.0 VC-Turbo - 272hp"
      ]
    },
    "qx70": {
      "2013-2017": [
        "3.0 dCi - 238hp",
        "3.7 V6 - 320hp",
        "5.0 V8 - 390hp"
      ]
    },
    "q70": {
      "2014-2019": [
        "2.0 Turbo - 211hp",
        "3.5 V6 - 320hp",
        "3.7 V6 - 320hp",
        "5.6 V8 - 420hp",
        "2.2 dCi - 170hp"
      ]
    },
    "qx80": {
      "2013-2024": [
        "5.6 V8 - 400hp"
      ]
    },
    "fx": {
      "2003-2008": [
        "3.5 V6 - 280hp",
        "4.5 V8 - 320hp"
      ],
      "2009-2013": [
        "3.7 V6 - 320hp",
        "5.0 V8 - 390hp"
      ]
    },
    "m": {
      "2006-2010": [
        "3.5 V6 - 280hp",
        "4.5 V8 - 325hp",
        "5.6 V8 - 420hp"
      ]
    },
    "g": {
      "2007-2015": [
        "2.5 V6 - 222hp",
        "3.5 V6 - 306hp",
        "3.7 V6 - 328hp",
        "5.0 V8 - 390hp"
      ]
    }
  },
  "dodge": {
    "challenger": {
      "2008-2024": [
        "3.6 V6 - 305hp",
        "5.7 V8 - 372hp",
        "6.4 V8 - 485hp",
        "6.2 V8 Hellcat - 717hp"
      ]
    },
    "charger": {
      "2006-2024": [
        "3.6 V6 - 292hp",
        "5.7 V8 - 370hp",
        "6.4 V8 - 485hp",
        "6.2 V8 Hellcat - 707hp"
      ]
    },
    "durango": {
      "2011-2024": [
        "3.6 V6 - 295hp",
        "5.7 V8 - 360hp",
        "6.4 V8 - 475hp"
      ]
    },
    "ram-1500": {
      "2009-2024": [
        "3.6 V6 - 305hp",
        "5.7 V8 - 395hp",
        "3.0 EcoDiesel - 260hp"
      ]
    },
    "journey": {
      "2008-2020": [
        "2.4 - 173hp",
        "3.6 V6 - 283hp"
      ]
    },
    "nitro": {
      "2007-2012": [
        "3.7 V6 - 210hp",
        "4.0 V6 - 260hp"
      ]
    },
    "caliber": {
      "2006-2012": [
        "1.8 - 148hp",
        "2.0 - 156hp",
        "2.4 - 172hp",
        "2.0 CRD - 140hp"
      ]
    },
    "avenger": {
      "2008-2014": [
        "2.4 - 173hp",
        "3.6 V6 - 283hp"
      ]
    },
    "viper": {
      "2003-2010": [
        "8.3 V10 - 500hp"
      ],
      "2013-2017": [
        "8.4 V10 - 645hp"
      ]
    },
    "dakota": {
      "2005-2011": [
        "3.7 V6 - 210hp",
        "4.7 V8 - 230hp"
      ]
    },
    "ram-2500": {
      "2010-2024": [
        "5.7 V8 - 383hp",
        "6.4 V8 - 410hp",
        "6.7 Cummins Diesel - 370hp"
      ]
    },
    "ram-3500": {
      "2010-2024": [
        "6.4 V8 - 410hp",
        "6.7 Cummins Diesel - 385hp"
      ]
    },
    "grand-caravan": {
      "2008-2020": [
        "3.3 V6 - 180hp",
        "3.6 V6 - 283hp"
      ]
    }
  },
  "chevrolet": {
    "spark": {
      "2010-2022": [
        "1.0 - 68hp",
        "1.2 - 82hp"
      ]
    },
    "cruze": {
      "2009-2019": [
        "1.4 Turbo - 140hp",
        "1.6 - 124hp",
        "1.8 - 141hp",
        "2.0 Diesel - 163hp"
      ]
    },
    "malibu": {
      "2012-2024": [
        "1.5 Turbo - 163hp",
        "2.0 Turbo - 250hp"
      ]
    },
    "camaro": {
      "2010-2024": [
        "2.0 Turbo - 275hp",
        "3.6 V6 - 335hp",
        "6.2 V8 - 455hp",
        "6.2 V8 ZL1 - 650hp"
      ]
    },
    "corvette": {
      "2005-2013": [
        "6.0 V8 - 400hp",
        "6.2 V8 - 430hp",
        "7.0 V8 Z06 - 505hp"
      ],
      "2014-2019": [
        "6.2 V8 - 460hp",
        "6.2 V8 Z06 - 659hp"
      ],
      "2020-2024": [
        "6.2 V8 - 495hp",
        "5.5 V8 Z06 - 670hp"
      ]
    },
    "equinox": {
      "2010-2024": [
        "1.5 Turbo - 170hp",
        "2.0 Turbo - 252hp",
        "1.6 Diesel - 136hp"
      ]
    },
    "traverse": {
      "2009-2024": [
        "2.0 Turbo - 255hp",
        "3.6 V6 - 310hp"
      ]
    },
    "silverado": {
      "2007-2024": [
        "4.3 V6 - 285hp",
        "5.3 V8 - 355hp",
        "6.2 V8 - 420hp",
        "3.0 Diesel - 277hp"
      ]
    },
    "tahoe": {
      "2007-2024": [
        "5.3 V8 - 355hp",
        "6.2 V8 - 420hp"
      ]
    },
    "suburban": {
      "2007-2024": [
        "5.3 V8 - 355hp",
        "6.2 V8 - 420hp"
      ]
    },
    "trax": {
      "2013-2024": [
        "1.4 Turbo - 140hp",
        "1.7 CDTi - 130hp"
      ]
    },
    "trailblazer": {
      "2020-2024": [
        "1.2 Turbo - 137hp",
        "1.3 Turbo - 155hp"
      ]
    },
    "colorado": {
      "2012-2024": [
        "2.5 - 200hp",
        "3.6 V6 - 308hp",
        "2.8 Diesel - 200hp"
      ]
    },
    "blazer": {
      "2019-2024": [
        "2.0 Turbo - 228hp",
        "2.5 - 193hp",
        "3.6 V6 - 308hp"
      ]
    },
    "volt": {
      "2011-2019": [
        "1.4 PHEV - 149hp",
        "1.5 PHEV - 149hp"
      ]
    },
    "bolt": {
      "2017-2024": [
        "Electric - 200hp"
      ]
    }
  },
  "chrysler": {
    "300": {
      "2005-2024": [
        "3.6 V6 - 292hp",
        "5.7 V8 - 363hp",
        "6.4 V8 SRT - 470hp"
      ]
    },
    "pacifica": {
      "2017-2024": [
        "3.6 V6 - 287hp",
        "3.6 V6 Hybrid - 260hp"
      ]
    },
    "voyager": {
      "2020-2024": [
        "3.6 V6 - 287hp"
      ]
    },
    "pt-cruiser": {
      "2000-2010": [
        "2.0 - 141hp",
        "2.4 - 143hp",
        "2.4 Turbo GT - 230hp",
        "2.2 CRD - 121hp"
      ]
    },
    "sebring": {
      "2007-2010": [
        "2.4 - 173hp",
        "2.7 V6 - 189hp",
        "3.5 V6 - 235hp"
      ]
    },
    "crossfire": {
      "2003-2008": [
        "3.2 V6 - 215hp",
        "3.2 V6 SRT-6 - 330hp"
      ]
    },
    "grand-voyager": {
      "2001-2016": [
        "2.4 - 143hp",
        "2.8 CRD - 163hp",
        "3.3 V6 - 174hp",
        "3.6 V6 - 283hp",
        "3.8 V6 - 197hp"
      ]
    }
  },
  "opel": {
    "corsa": {
      "2006-2014": [
        "1.0 - 60hp",
        "1.2 - 80hp",
        "1.4 - 90hp",
        "1.3 CDTi - 75hp",
        "1.7 CDTi - 125hp"
      ],
      "2015-2019": [
        "1.0 - 90hp",
        "1.4 - 90hp",
        "1.3 CDTi - 95hp"
      ],
      "2020-2024": [
        "1.2 - 75hp",
        "1.2 Turbo - 100hp",
        "1.5 Diesel - 100hp"
      ]
    },
    "astra": {
      "2010-2015": [
        "1.4 - 100hp",
        "1.4 Turbo - 140hp",
        "1.6 Turbo - 180hp",
        "1.7 CDTi - 130hp",
        "2.0 CDTi - 165hp"
      ],
      "2016-2021": [
        "1.0 Turbo - 105hp",
        "1.4 Turbo - 145hp",
        "1.6 Turbo - 200hp",
        "1.6 Diesel - 136hp",
        "2.0 Diesel - 170hp"
      ],
      "2022-2024": [
        "1.2 Turbo - 130hp",
        "1.5 Diesel - 130hp"
      ]
    },
    "insignia": {
      "2009-2017": [
        "1.6 Turbo - 170hp",
        "2.0 Turbo - 250hp",
        "2.0 CDTi - 170hp"
      ],
      "2018-2024": [
        "1.5 Turbo - 165hp",
        "2.0 Turbo - 230hp",
        "2.0 Diesel - 170hp"
      ]
    },
    "mokka": {
      "2013-2020": [
        "1.4 Turbo - 140hp",
        "1.6 CDTi - 136hp"
      ],
      "2021-2024": [
        "1.2 Turbo - 100hp",
        "1.2 Turbo - 130hp",
        "1.5 Diesel - 110hp"
      ]
    },
    "crossland": {
      "2017-2024": [
        "1.2 - 83hp",
        "1.2 Turbo - 110hp",
        "1.5 Diesel - 110hp"
      ]
    },
    "grandland": {
      "2018-2024": [
        "1.2 Turbo - 130hp",
        "1.6 Turbo - 180hp",
        "1.5 Diesel - 130hp",
        "2.0 Diesel - 177hp"
      ]
    },
    "combo": {
      "2012-2024": [
        "1.5 Diesel - 100hp",
        "1.5 Diesel - 130hp"
      ]
    },
    "vivaro": {
      "2014-2024": [
        "1.5 Diesel - 120hp",
        "1.6 Diesel - 125hp",
        "2.0 Diesel - 145hp"
      ]
    },
    "movano": {
      "2010-2024": [
        "2.3 Diesel - 110hp",
        "2.3 Diesel - 125hp",
        "2.3 Diesel - 145hp"
      ]
    },
    "meriva": {
      "2010-2017": [
        "1.4 - 100hp",
        "1.4 Turbo - 120hp",
        "1.6 CDTi - 95hp",
        "1.7 CDTi - 130hp"
      ]
    },
    "antara": {
      "2007-2015": [
        "2.4 - 140hp",
        "3.2 V6 - 230hp",
        "2.0 CDTi - 150hp",
        "2.2 CDTi - 184hp"
      ]
    },
    "agila": {
      "2008-2014": [
        "1.0 - 68hp",
        "1.2 - 94hp",
        "1.3 CDTi - 75hp"
      ]
    },
    "adam": {
      "2013-2019": [
        "1.0 Turbo - 90hp",
        "1.2 - 70hp",
        "1.4 - 87hp",
        "1.4 Turbo - 150hp"
      ]
    },
    "karl": {
      "2015-2019": [
        "1.0 - 75hp"
      ]
    },
    "cascada": {
      "2013-2019": [
        "1.4 Turbo - 140hp",
        "1.6 Turbo - 170hp",
        "2.0 CDTi - 165hp"
      ]
    }
  },
  "iveco": {
    "daily": {
      "2014-2024": [
        "2.3 Diesel - 116hp",
        "2.3 Diesel - 136hp",
        "2.3 Diesel - 156hp",
        "3.0 Diesel - 170hp",
        "3.0 Diesel - 205hp"
      ]
    },
    "s-way": {
      "2019-2024": [
        "9.0 Diesel - 420hp",
        "12.9 Diesel - 510hp"
      ]
    },
    "eurocargo": {
      "2015-2024": [
        "5.9 Diesel - 160hp",
        "5.9 Diesel - 210hp",
        "6.7 Diesel - 250hp"
      ]
    },
    "stralis": {
      "2012-2020": [
        "10.3 Diesel - 460hp",
        "12.9 Diesel - 560hp"
      ]
    },
    "massif": {
      "2008-2015": [
        "3.0 Diesel - 176hp"
      ]
    },
    "trakker": {
      "2004-2024": [
        "7.8 Diesel - 310hp",
        "10.3 Diesel - 450hp",
        "12.9 Diesel - 560hp"
      ]
    },
    "x-way": {
      "2019-2024": [
        "9.0 Diesel - 420hp",
        "12.9 Diesel - 510hp"
      ]
    }
  },
  "buick": {
    "encore": {
      "2013-2024": [
        "1.4 Turbo - 138hp",
        "1.4 Turbo - 153hp"
      ]
    },
    "envision": {
      "2016-2024": [
        "2.0 Turbo - 252hp",
        "2.5 - 197hp"
      ]
    },
    "enclave": {
      "2018-2024": [
        "3.6 V6 - 310hp"
      ]
    },
    "regal": {
      "2018-2020": [
        "2.0 Turbo - 250hp",
        "3.6 V6 - 310hp"
      ]
    }
  },
  "lincoln": {
    "corsair": {
      "2020-2024": [
        "2.0 Turbo - 250hp",
        "2.3 Turbo - 295hp"
      ]
    },
    "nautilus": {
      "2019-2024": [
        "2.0 Turbo - 250hp",
        "2.7 V6 Turbo - 335hp"
      ]
    },
    "aviator": {
      "2020-2024": [
        "3.0 V6 Twin-Turbo - 400hp",
        "3.0 V6 PHEV - 494hp"
      ]
    },
    "navigator": {
      "2018-2024": [
        "3.5 V6 Twin-Turbo - 450hp"
      ]
    }
  },
  "ram": {
    "1500": {
      "2019-2024": [
        "3.6 V6 - 305hp",
        "5.7 V8 - 395hp",
        "3.0 EcoDiesel - 260hp"
      ]
    },
    "2500": {
      "2019-2024": [
        "6.4 V8 - 410hp",
        "6.7 Cummins Diesel - 370hp"
      ]
    },
    "3500": {
      "2019-2024": [
        "6.4 V8 - 410hp",
        "6.7 Cummins Diesel - 370hp"
      ]
    },
    "promaster": {
      "2014-2024": [
        "3.6 V6 - 280hp",
        "3.0 EcoDiesel - 174hp"
      ]
    }
  },
  "hummer": {
    "ev": {
      "2022-2024": [
        "Electric - 830hp",
        "Electric - 1000hp"
      ]
    },
    "h2": {
      "2003-2009": [
        "6.0 V8 - 325hp",
        "6.2 V8 - 393hp"
      ]
    },
    "h3": {
      "2006-2010": [
        "3.5 I5 - 220hp",
        "3.7 I5 - 242hp",
        "5.3 V8 - 300hp"
      ]
    }
  },
  "saab": {
    "9-3": {
      "2003-2014": [
        "1.8t - 150hp",
        "2.0t - 175hp",
        "2.0 Turbo - 210hp",
        "2.8 V6 Turbo - 255hp",
        "1.9 TiD - 150hp"
      ]
    },
    "9-5": {
      "2006-2012": [
        "2.0t - 220hp",
        "2.3 Turbo - 260hp",
        "2.8 V6 Turbo - 280hp",
        "1.9 TiD - 150hp",
        "2.0 TiD - 180hp"
      ]
    }
  },
  "lancia": {
    "ypsilon": {
      "2011-2024": [
        "0.9 TwinAir - 85hp",
        "1.2 - 69hp",
        "1.4 - 95hp",
        "1.3 MultiJet - 95hp"
      ]
    },
    "delta": {
      "2008-2014": [
        "1.4 Turbo - 140hp",
        "1.4 Turbo - 150hp",
        "1.6 MultiJet - 105hp",
        "1.9 MultiJet - 190hp"
      ]
    },
    "musa": {
      "2004-2012": [
        "1.4 - 95hp",
        "1.3 MultiJet - 90hp",
        "1.6 MultiJet - 105hp"
      ]
    },
    "thema": {
      "2011-2014": [
        "3.0 V6 - 190hp",
        "3.6 V6 - 286hp",
        "3.0 MultiJet - 239hp"
      ]
    }
  },
  "greatwall": {
    "steed": {
      "2010-2020": [
        "2.0 Diesel - 143hp",
        "2.4 - 136hp"
      ]
    },
    "voleex-c10": {
      "2010-2014": [
        "1.5 - 106hp"
      ]
    }
  },
  "proton": {
    "persona": {
      "2016-2024": [
        "1.6 - 107hp"
      ]
    },
    "saga": {
      "2016-2024": [
        "1.3 - 95hp"
      ]
    },
    "exora": {
      "2009-2019": [
        "1.6 Turbo - 140hp"
      ]
    },
    "preve": {
      "2012-2018": [
        "1.6 Turbo - 140hp"
      ]
    }
  },
  "perodua": {
    "myvi": {
      "2018-2024": [
        "1.3 - 95hp",
        "1.5 - 103hp"
      ]
    },
    "axia": {
      "2014-2024": [
        "1.0 - 68hp"
      ]
    },
    "bezza": {
      "2016-2024": [
        "1.0 - 68hp",
        "1.3 - 95hp"
      ]
    },
    "aruz": {
      "2019-2024": [
        "1.5 - 105hp"
      ]
    }
  },
  "ford": {
    "fiesta": {
      "2008-2012": [
        "1.25 - 82hp",
        "1.4 - 96hp",
        "1.6 Ti-VCT - 120hp",
        "1.4 TDCi - 70hp",
        "1.6 TDCi - 95hp"
      ],
      "2013-2017": [
        "1.0 EcoBoost - 100hp",
        "1.0 EcoBoost - 125hp",
        "1.6 EcoBoost ST - 182hp",
        "1.5 TDCi - 95hp"
      ],
      "2018-2023": [
        "1.0 EcoBoost - 100hp",
        "1.0 EcoBoost - 125hp",
        "1.5 EcoBoost ST - 200hp",
        "1.5 EcoBlue - 85hp",
        "1.5 EcoBlue - 120hp"
      ]
    },
    "focus": {
      "2005-2010": [
        "1.6 - 100hp",
        "1.8 - 125hp",
        "2.0 - 145hp",
        "2.5 ST - 225hp",
        "1.6 TDCi - 109hp",
        "2.0 TDCi - 136hp"
      ],
      "2011-2018": [
        "1.0 EcoBoost - 125hp",
        "1.5 EcoBoost - 150hp",
        "2.0 EcoBoost ST - 250hp",
        "1.5 TDCi - 120hp",
        "2.0 TDCi - 150hp",
        "2.0 TDCi - 185hp"
      ],
      "2019-2026": [
        "1.0 EcoBoost - 125hp",
        "1.5 EcoBoost - 150hp",
        "2.3 EcoBoost ST - 280hp",
        "1.5 EcoBlue - 120hp",
        "2.0 EcoBlue - 150hp",
        "2.0 EcoBlue - 190hp"
      ]
    },
    "mondeo": {
      "2007-2014": [
        "1.6 EcoBoost - 160hp",
        "2.0 EcoBoost - 203hp",
        "2.0 EcoBoost - 240hp",
        "1.8 TDCi - 125hp",
        "2.0 TDCi - 140hp",
        "2.2 TDCi - 200hp"
      ],
      "2015-2022": [
        "1.5 EcoBoost - 160hp",
        "2.0 EcoBoost - 240hp",
        "2.0 Hybrid - 187hp",
        "1.5 TDCi - 120hp",
        "2.0 TDCi - 150hp",
        "2.0 TDCi - 180hp"
      ]
    },
    "mustang": {
      "2015-2017": [
        "2.3 EcoBoost - 317hp",
        "5.0 V8 GT - 421hp"
      ],
      "2018-2023": [
        "2.3 EcoBoost - 290hp",
        "5.0 V8 GT - 450hp"
      ],
      "2024-2026": [
        "2.3 EcoBoost - 315hp",
        "5.0 V8 GT - 446hp"
      ]
    },
    "ecosport": {
      "2014-2017": [
        "1.0 EcoBoost - 125hp",
        "1.5 Ti-VCT - 112hp",
        "1.5 TDCi - 95hp"
      ],
      "2018-2022": [
        "1.0 EcoBoost - 125hp",
        "1.0 EcoBoost - 140hp",
        "1.5 TDCi - 100hp"
      ]
    },
    "puma": {
      "2020-2023": [
        "1.0 EcoBoost Hybrid - 125hp",
        "1.0 EcoBoost Hybrid - 155hp",
        "1.5 EcoBoost ST - 200hp"
      ],
      "2024-2026": [
        "1.0 EcoBoost Hybrid - 125hp",
        "1.0 EcoBoost Hybrid - 155hp",
        "Electric - 168hp"
      ]
    },
    "kuga": {
      "2008-2012": [
        "2.0 TDCi - 136hp",
        "2.0 TDCi - 163hp",
        "2.5 Turbo - 200hp"
      ],
      "2013-2019": [
        "1.5 EcoBoost - 150hp",
        "2.0 EcoBoost - 242hp",
        "1.5 TDCi - 120hp",
        "2.0 TDCi - 150hp",
        "2.0 TDCi - 180hp"
      ],
      "2020-2026": [
        "1.5 EcoBoost - 150hp",
        "2.5 Hybrid - 190hp",
        "2.5 PHEV - 225hp",
        "1.5 EcoBlue - 120hp",
        "2.0 EcoBlue - 150hp"
      ]
    },
    "edge": {
      "2016-2020": [
        "2.0 EcoBlue - 150hp",
        "2.0 EcoBlue - 190hp",
        "2.0 EcoBoost - 245hp"
      ],
      "2021-2024": [
        "2.0 EcoBlue - 190hp",
        "2.0 EcoBlue - 238hp",
        "2.7 EcoBoost - 335hp"
      ]
    },
    "explorer": {
      "2011-2019": [
        "2.3 EcoBoost - 280hp",
        "3.5 V6 - 290hp",
        "3.5 EcoBoost - 365hp"
      ],
      "2020-2026": [
        "2.3 EcoBoost - 300hp",
        "3.0 EcoBoost - 457hp",
        "3.3 Hybrid - 318hp"
      ]
    },
    "transit": {
      "2006-2013": [
        "2.2 TDCi - 85hp",
        "2.2 TDCi - 110hp",
        "2.2 TDCi - 125hp",
        "2.4 TDCi - 140hp"
      ],
      "2014-2019": [
        "2.0 EcoBlue - 105hp",
        "2.0 EcoBlue - 130hp",
        "2.0 EcoBlue - 170hp"
      ],
      "2020-2026": [
        "2.0 EcoBlue - 105hp",
        "2.0 EcoBlue - 130hp",
        "2.0 EcoBlue - 170hp",
        "2.0 EcoBlue - 185hp"
      ]
    },
    "transit-custom": {
      "2013-2019": [
        "2.2 TDCi - 100hp",
        "2.2 TDCi - 125hp",
        "2.2 TDCi - 155hp"
      ],
      "2020-2026": [
        "2.0 EcoBlue - 105hp",
        "2.0 EcoBlue - 130hp",
        "2.0 EcoBlue - 170hp",
        "2.0 EcoBlue - 185hp",
        "Electric - 218hp"
      ]
    },
    "ranger": {
      "2012-2018": [
        "2.2 TDCi - 125hp",
        "2.2 TDCi - 150hp",
        "3.2 TDCi - 200hp"
      ],
      "2019-2022": [
        "2.0 EcoBlue - 130hp",
        "2.0 EcoBlue - 170hp",
        "2.0 Bi-Turbo - 213hp"
      ],
      "2023-2026": [
        "2.0 EcoBlue - 170hp",
        "2.0 Bi-Turbo - 205hp",
        "3.0 V6 Diesel - 240hp",
        "3.0 V6 Petrol Raptor - 292hp"
      ]
    },
    "f-150": {
      "2011-2020": [
        "2.7 EcoBoost V6 - 325hp",
        "3.5 EcoBoost V6 - 375hp",
        "5.0 V8 - 395hp"
      ],
      "2021-2026": [
        "2.7 EcoBoost V6 - 325hp",
        "3.5 EcoBoost V6 - 400hp",
        "3.5 PowerBoost Hybrid - 430hp",
        "5.0 V8 - 400hp"
      ]
    },
    "s-max": {
      "2006-2014": [
        "1.6 EcoBoost - 160hp",
        "2.0 EcoBoost - 203hp",
        "2.0 TDCi - 140hp",
        "2.2 TDCi - 200hp"
      ],
      "2015-2023": [
        "1.5 EcoBoost - 160hp",
        "2.0 EcoBoost - 240hp",
        "2.0 TDCi - 150hp",
        "2.0 TDCi - 180hp",
        "2.0 TDCi - 210hp"
      ]
    },
    "galaxy": {
      "2006-2014": [
        "1.6 EcoBoost - 160hp",
        "2.0 EcoBoost - 203hp",
        "2.0 TDCi - 140hp",
        "2.2 TDCi - 200hp"
      ],
      "2015-2023": [
        "1.5 EcoBoost - 160hp",
        "2.0 EcoBoost - 240hp",
        "2.0 TDCi - 150hp",
        "2.0 TDCi - 180hp",
        "2.0 TDCi - 210hp"
      ]
    },
    "tourneo": {
      "2014-2019": [
        "2.0 EcoBlue - 105hp",
        "2.0 EcoBlue - 130hp",
        "2.0 EcoBlue - 170hp"
      ],
      "2020-2026": [
        "2.0 EcoBlue - 130hp",
        "2.0 EcoBlue - 170hp",
        "2.0 EcoBlue - 185hp",
        "Electric - 218hp"
      ]
    },
    "fiesta-st": {
      "2013-2017": [
        "1.6 EcoBoost - 182hp"
      ],
      "2018-2023": [
        "1.5 EcoBoost - 200hp"
      ]
    },
    "focus-st": {
      "2005-2010": [
        "2.5 Turbo - 225hp"
      ],
      "2012-2018": [
        "2.0 EcoBoost - 250hp",
        "2.0 TDCi - 185hp"
      ],
      "2019-2026": [
        "2.3 EcoBoost - 280hp",
        "2.0 EcoBlue - 190hp"
      ]
    },
    "focus-rs": {
      "2009-2011": [
        "2.5 Turbo - 305hp"
      ],
      "2016-2018": [
        "2.3 EcoBoost - 350hp"
      ]
    },
    "mustang-mach-e": {
      "2021-2024": [
        "Electric RWD - 269hp",
        "Electric AWD - 351hp",
        "Electric GT - 487hp"
      ],
      "2025-2026": [
        "Electric RWD - 269hp",
        "Electric AWD Extended - 370hp",
        "Electric GT Performance - 487hp"
      ]
    },
    "bronco": {
      "2021-2024": [
        "2.3 EcoBoost - 300hp",
        "2.7 EcoBoost - 330hp"
      ],
      "2025-2026": [
        "2.3 EcoBoost - 300hp",
        "2.7 EcoBoost - 335hp",
        "3.0 EcoBoost Raptor - 418hp"
      ]
    }
  }
},

  /**
   * ECU DATABASE - Comprehensive ECU types by manufacturer
   * Source: AutoTuner, K-TAG, KESS3, Alientech Compatibility Lists
   * Enhanced with protocols, read methods, tuning capability, and years
   */
  ECU_DATABASE: {
    // ECU Brands
    brands: ['Bosch', 'Continental', 'Siemens', 'Delphi', 'Marelli', 'Denso', 'Delco', 'Hitachi', 'Kefico', 'Transtron', 'Valeo', 'Visteon', 'Motorola', 'Keihin', 'Mitsubishi', 'Sagem', 'Vitesco', 'ZF', 'Temic', 'Getrag', 'Aisin', 'Hella', 'TRW', 'EVPT', 'Panasonic', 'ZongShen'],
    
    // Bosch ECU Types - ENHANCED with protocols and capabilities
    bosch: {
      // Diesel ECUs (EDC = Electronic Diesel Control)
      diesel: [
        {name: 'EDC15C2', protocol: ['OBD', 'Boot'], years: '1998-2005', capability: 'Full tuning', read: 'BDM100/Kess3', flash: 'Yes'},
        {name: 'EDC15C4', protocol: ['OBD', 'Boot'], years: '1998-2005', capability: 'Full tuning', read: 'BDM100/Kess3', flash: 'Yes'},
        {name: 'EDC15C5', protocol: ['OBD', 'Boot'], years: '1998-2005', capability: 'Full tuning', read: 'BDM100/Kess3', flash: 'Yes'},
        {name: 'EDC15C7', protocol: ['OBD', 'Boot'], years: '2000-2006', capability: 'Full tuning', read: 'BDM100', flash: 'Yes'},
        {name: 'EDC15M', protocol: ['OBD', 'Boot'], years: '2000-2005', capability: 'Full tuning', read: 'BDM100', flash: 'Yes'},
        {name: 'EDC15P+', protocol: ['OBD', 'Boot'], years: '2000-2006', capability: 'Full tuning', read: 'BDM100', flash: 'Yes'},
        {name: 'EDC15VM+', protocol: ['OBD', 'Boot'], years: '2000-2007', capability: 'Full tuning', read: 'BDM100', flash: 'Yes'},
        {name: 'EDC16C1', protocol: ['OBD', 'BDM'], years: '2003-2008', capability: 'Full tuning', read: 'BDM100/Kess3', flash: 'Yes'},
        {name: 'EDC16C2', protocol: ['OBD', 'BDM'], years: '2003-2009', capability: 'Full tuning', read: 'BDM100/Kess3', flash: 'Yes'},
        {name: 'EDC16C3', protocol: ['OBD', 'BDM'], years: '2004-2009', capability: 'Full tuning', read: 'BDM100/Kess3', flash: 'Yes'},
        {name: 'EDC16C4', protocol: ['OBD', 'BDM'], years: '2004-2009', capability: 'Full tuning', read: 'BDM100/Kess3', flash: 'Yes'},
        {name: 'EDC16C7', protocol: ['OBD', 'BDM'], years: '2006-2010', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC16C8', protocol: ['OBD', 'BDM'], years: '2006-2011', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC16C9', protocol: ['OBD', 'Boot'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG/BDM', flash: 'Yes'},
        {name: 'EDC16C31', protocol: ['OBD', 'Boot'], years: '2007-2012', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes'},
        {name: 'EDC16C34', protocol: ['OBD', 'Boot'], years: '2007-2012', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes'},
        {name: 'EDC16C35', protocol: ['OBD', 'Boot'], years: '2008-2013', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes'},
        {name: 'EDC16C36', protocol: ['OBD', 'Boot'], years: '2008-2013', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes'},
        {name: 'EDC16C37', protocol: ['OBD', 'Boot'], years: '2008-2013', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes'},
        {name: 'EDC16C39', protocol: ['OBD', 'Boot'], years: '2008-2014', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes'},
        {name: 'EDC16CP31', protocol: ['OBD', 'Boot'], years: '2009-2014', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes'},
        {name: 'EDC16CP33', protocol: ['OBD', 'Boot'], years: '2009-2014', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes'},
        {name: 'EDC16CP34', protocol: ['OBD', 'Boot'], years: '2010-2015', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes'},
        {name: 'EDC16CP35', protocol: ['OBD', 'Boot'], years: '2010-2015', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes'},
        {name: 'EDC16CP39', protocol: ['OBD', 'Boot'], years: '2010-2015', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes'},
        {name: 'EDC16CP42', protocol: ['OBD', 'Boot'], years: '2011-2016', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes'},
        {name: 'EDC16U1', protocol: ['OBD', 'BDM'], years: '2005-2009', capability: 'Full tuning', read: 'BDM100', flash: 'Yes'},
        {name: 'EDC16U31', protocol: ['OBD', 'BDM'], years: '2006-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes'},
        {name: 'EDC16U34', protocol: ['OBD', 'BDM'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes'},
        {name: 'EDC17C06', protocol: ['OBD', 'Boot'], years: '2010-2014', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17C08', protocol: ['OBD', 'Boot'], years: '2010-2015', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17C10', protocol: ['OBD', 'Boot'], years: '2011-2015', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17C14', protocol: ['OBD', 'Boot'], years: '2011-2016', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C19', protocol: ['OBD', 'Boot'], years: '2011-2016', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C41', protocol: ['OBD', 'Boot'], years: '2012-2016', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17C42', protocol: ['OBD', 'Boot'], years: '2012-2017', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17C46', protocol: ['OBD', 'Boot'], years: '2013-2017', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17C49', protocol: ['OBD', 'Boot'], years: '2013-2018', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17C50', protocol: ['OBD', 'Boot'], years: '2014-2018', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17C53', protocol: ['OBD', 'Boot'], years: '2014-2019', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C54', protocol: ['OBD', 'Boot'], years: '2015-2019', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C56', protocol: ['OBD', 'Boot'], years: '2015-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C57', protocol: ['OBD', 'Boot'], years: '2015-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C58', protocol: ['OBD', 'Boot'], years: '2016-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C59', protocol: ['OBD', 'Boot'], years: '2016-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C60', protocol: ['OBD', 'Boot'], years: '2016-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C63', protocol: ['OBD', 'Boot'], years: '2017-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C64', protocol: ['OBD', 'Boot'], years: '2017-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C69', protocol: ['OBD', 'Boot'], years: '2018-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C70', protocol: ['OBD', 'Boot'], years: '2018-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C72', protocol: ['OBD', 'Boot'], years: '2018-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C74', protocol: ['OBD', 'Boot'], years: '2019-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C76', protocol: ['OBD', 'Boot'], years: '2019-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C79', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C81', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C83', protocol: ['OBD', 'Boot'], years: '2021-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C84', protocol: ['OBD', 'Boot'], years: '2021-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17C87', protocol: ['OBD', 'Boot'], years: '2022-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP02', protocol: ['OBD', 'Boot'], years: '2010-2015', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CP04', protocol: ['OBD', 'Boot'], years: '2010-2015', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CP05', protocol: ['OBD', 'Boot'], years: '2011-2015', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CP06', protocol: ['OBD', 'Boot'], years: '2011-2016', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CP09', protocol: ['OBD', 'Boot'], years: '2011-2016', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CP11', protocol: ['OBD', 'Boot'], years: '2012-2016', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CP14', protocol: ['OBD', 'Boot'], years: '2012-2017', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CP16', protocol: ['OBD', 'Boot'], years: '2013-2017', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CP18', protocol: ['OBD', 'Boot'], years: '2013-2018', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CP20', protocol: ['OBD', 'Boot'], years: '2013-2018', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CP24', protocol: ['OBD', 'Boot'], years: '2014-2019', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP27', protocol: ['OBD', 'Boot'], years: '2014-2019', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP42', protocol: ['OBD', 'Boot'], years: '2015-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP44', protocol: ['OBD', 'Boot'], years: '2015-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP45', protocol: ['OBD', 'Boot'], years: '2016-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP47', protocol: ['OBD', 'Boot'], years: '2016-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP49', protocol: ['OBD', 'Boot'], years: '2017-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP50', protocol: ['OBD', 'Boot'], years: '2017-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP52', protocol: ['OBD', 'Boot'], years: '2018-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP54', protocol: ['OBD', 'Boot'], years: '2018-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP55', protocol: ['OBD', 'Boot'], years: '2019-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP62', protocol: ['OBD', 'Boot'], years: '2019-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP65', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CP74', protocol: ['OBD', 'Boot'], years: '2021-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CV41', protocol: ['OBD', 'Boot'], years: '2013-2018', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CV42', protocol: ['OBD', 'Boot'], years: '2014-2019', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes'},
        {name: 'EDC17CV44', protocol: ['OBD', 'Boot'], years: '2015-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CV45', protocol: ['OBD', 'Boot'], years: '2015-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CV52', protocol: ['OBD', 'Boot'], years: '2017-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CV54', protocol: ['OBD', 'Boot'], years: '2017-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CV56', protocol: ['OBD', 'Boot'], years: '2018-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17CV82', protocol: ['OBD', 'Boot'], years: '2019-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'EDC17U01', protocol: ['OBD', 'Boot'], years: '2006-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes'},
        {name: 'MD1CP002', protocol: ['OBD', 'Boot'], years: '2018-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CP004', protocol: ['OBD', 'Boot'], years: '2018-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CP006', protocol: ['OBD', 'Boot'], years: '2019-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CP007', protocol: ['OBD', 'Boot'], years: '2019-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CP014', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CP017', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CP032', protocol: ['OBD', 'Boot'], years: '2021-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CP061', protocol: ['OBD', 'Boot'], years: '2021-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CP062', protocol: ['OBD', 'Boot'], years: '2022-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS001', protocol: ['OBD', 'Boot'], years: '2016-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS003', protocol: ['OBD', 'Boot'], years: '2017-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS004', protocol: ['OBD', 'Boot'], years: '2017-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS005', protocol: ['OBD', 'Boot'], years: '2018-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS006', protocol: ['OBD', 'Boot'], years: '2018-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS012', protocol: ['OBD', 'Boot'], years: '2019-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS014', protocol: ['OBD', 'Boot'], years: '2019-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS016', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS025', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS027', protocol: ['OBD', 'Boot'], years: '2021-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS069', protocol: ['OBD', 'Boot'], years: '2021-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CS089', protocol: ['OBD', 'Boot'], years: '2022-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CE101', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CE108', protocol: ['OBD', 'Boot'], years: '2021-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'},
        {name: 'MD1CC878', protocol: ['OBD', 'Boot'], years: '2022-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes'}
      ],
      // Petrol ECUs (ME/MED = Motronic) - Legacy but still in use
      petrol: [
        'ME2.8', 'ME2.8.1',
        'ME7.1', 'ME7.1.1', 'ME7.2', 'ME7.4.4', 'ME7.4.5', 'ME7.4.7', 'ME7.5', 'ME7.6.3', 'ME7.9.10',
        'ME9.0C', 'ME9.2', 'ME9.6.1',
        'ME17.0.3', 'ME17.1.6', 'ME17.2.1', 'ME17.3.0', 'ME17.8.31', 'ME17.8.42', 'ME17.8.5', 'ME17.8.10', 'ME17.9.1', 'ME17.9.7', 'ME17.9.11', 'ME17.9.11.1', 'ME17.9.20', 'ME17.9.21', 'ME17.9.21.1', 'ME17.9.32', 'ME17.9.51', 'ME17.9.52', 'ME17.9.53', 'ME17.9.55', 'ME17.9.74',
        'MED7.1.1',
        'MED9.1', 'MED9.1.2', 'MED9.1.x', 'MED9.2.1', 'MED9.5.10', 'MED9.6.1',
        'MED17.0', 'MED17.0.1', 'MED17.0.7', 'MED17.1', 'MED17.1.1', 'MED17.1.6', 'MED17.1.10', 'MED17.1.12', 'MED17.1.21', 'MED17.1.27', 'MED17.1.61', 'MED17.1.62',
        'MED17.3.1', 'MED17.3.3', 'MED17.3.5',
        'MED17.4', 'MED17.4.2', 'MED17.4.4',
        'MED17.5', 'MED17.5.1', 'MED17.5.2', 'MED17.5.5', 'MED17.5.20', 'MED17.5.21', 'MED17.5.25',
        'MED17.7.1', 'MED17.7.2', 'MED17.7.3', 'MED17.7.5',
        'MED17.8.3', 'MED17.8.10', 'MED17.8.31', 'MED17.8.32', 'MED17.810.1',
        'MED17.9.3', 'MED17.9.7', 'MED17.9.8', 'MED17.9.9',
        'MEDC17.9', 'MEDG17.0', 'MEDG17.9.8', 'MEG17.9.8', 'MEG17.9.12', 'MEG17.9.13',
        'MEV17.2.1', 'MEV17.4', 'MEV17.4.2',
        'MEVD17.2', 'MEVD17.2.3', 'MEVD17.2.4', 'MEVD17.2.5', 'MEVD17.2.6', 'MEVD17.2.8', 'MEVD17.2.9', 'MEVD17.2.G', 'MEVD17.2.H',
        'MEVD17.4.2', 'MEVD17.4.4',
        'MG1CS001', 'MG1CS002', 'MG1CS003', 'MG1CS008', 'MG1CS011', 'MG1CS015', 'MG1CS016', 'MG1CS017', 'MG1CS018', 'MG1CS019', 'MG1CS024', 'MG1CS028', 'MG1CS032', 'MG1CS036', 'MG1CS040', 'MG1CS042', 'MG1CS049', 'MG1CS055', 'MG1CS060', 'MG1CS111', 'MG1CS163', 'MG1CS201',
        'MG1UA008', 'MG1UD008', 'MG1US008', 'MG1US708',
        'MG1CA007', 'MG1CA094', 'MG1CA920'
      ],
      // Motorcycle ECUs
      motorcycle: ['MSE6.0', 'MSE8.0', 'US6.0', 'ME17.2', 'ME17.2.4', 'ME9.2.0'],
      // DCU (Diesel Control Unit) variants
      dcu: ['DCU17PC01', 'DCU17PC42', 'DCU17PC43'],
      // Gearbox/Transmission
      gearbox: ['DQ38x', 'DQ500', 'DL501', 'DL800']
    },

    // Continental/Siemens ECU Types - ENHANCED
    continental: {
      // Simos (VW/Audi/Skoda/Seat) - ENHANCED with detailed data
      simos: [
        {name: 'Simos6.2', protocol: ['OBD', 'BDM'], years: '2002-2006', capability: 'Full tuning', read: 'BDM100', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos6.3', protocol: ['OBD', 'BDM'], years: '2002-2007', capability: 'Full tuning', read: 'BDM100', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos8.2', protocol: ['OBD', 'BDM'], years: '2006-2010', capability: 'Full tuning', read: 'K-TAG/BDM', flash: 'Yes', vehicles: 'VW/Audi/Seat/Skoda'},
        {name: 'Simos8.3', protocol: ['OBD', 'BDM'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG/BDM', flash: 'Yes', vehicles: 'VW/Audi/Seat/Skoda'},
        {name: 'Simos8.4', protocol: ['OBD', 'BDM'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG/BDM', flash: 'Yes', vehicles: 'VW/Audi/Seat/Skoda'},
        {name: 'Simos8.5', protocol: ['OBD', 'BDM'], years: '2008-2012', capability: 'Full tuning', read: 'K-TAG/BDM', flash: 'Yes', vehicles: 'VW/Audi/Seat/Skoda'},
        {name: 'Simos8.6', protocol: ['OBD', 'BDM'], years: '2008-2012', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'VW Group'},
        {name: 'Simos10.11', protocol: ['OBD', 'Boot'], years: '2009-2013', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos10.20', protocol: ['OBD', 'Boot'], years: '2009-2013', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos10.22', protocol: ['OBD', 'Boot'], years: '2010-2014', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos10.x', protocol: ['OBD', 'Boot'], years: '2009-2014', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes', vehicles: 'VW Group'},
        {name: 'Simos12.1', protocol: ['OBD', 'Boot'], years: '2012-2016', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos12.2', protocol: ['OBD', 'Boot'], years: '2013-2017', capability: 'Full tuning', read: 'Kess3/K-TAG', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos16.11', protocol: ['OBD', 'Boot'], years: '2012-2016', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi/Seat/Skoda'},
        {name: 'Simos16.21', protocol: ['OBD', 'Boot'], years: '2013-2017', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos18.1', protocol: ['OBD', 'Boot'], years: '2015-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi/Seat/Skoda'},
        {name: 'Simos18.2', protocol: ['OBD', 'Boot'], years: '2016-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos18.3', protocol: ['OBD', 'Boot'], years: '2016-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos18.4', protocol: ['OBD', 'Boot'], years: '2017-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos18.6', protocol: ['OBD', 'Boot'], years: '2018-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos18.10', protocol: ['OBD', 'Boot'], years: '2019-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos19.2', protocol: ['OBD', 'Boot'], years: '2019-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos19.3', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos19.6', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos19.7', protocol: ['OBD', 'Boot'], years: '2021-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'Simos19.8', protocol: ['OBD', 'Boot'], years: '2022-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'}
      ],
      // SID (Diesel) - ENHANCED
      sid: [
        {name: 'SID201', protocol: ['OBD', 'BDM'], years: '2004-2009', capability: 'Full tuning', read: 'BDM100/K-TAG', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID202', protocol: ['OBD', 'BDM'], years: '2005-2010', capability: 'Full tuning', read: 'BDM100/K-TAG', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID203', protocol: ['OBD', 'BDM'], years: '2006-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'PSA/Ford'},
        {name: 'SID204', protocol: ['OBD', 'BDM'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID206', protocol: ['OBD', 'Boot'], years: '2008-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'PSA/Ford/Volvo'},
        {name: 'SID208', protocol: ['OBD', 'Boot'], years: '2009-2013', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'PSA/Ford'},
        {name: 'SID209', protocol: ['OBD', 'Boot'], years: '2010-2014', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID211', protocol: ['OBD', 'Boot'], years: '2011-2015', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID212', protocol: ['OBD', 'Boot'], years: '2012-2016', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID212evo', protocol: ['OBD', 'Boot'], years: '2013-2017', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID213', protocol: ['OBD', 'Boot'], years: '2014-2018', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID301', protocol: ['OBD', 'Boot'], years: '2009-2013', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Renault/Nissan'},
        {name: 'SID305', protocol: ['OBD', 'Boot'], years: '2010-2014', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Renault/Nissan'},
        {name: 'SID306', protocol: ['OBD', 'Boot'], years: '2010-2014', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Renault/Nissan'},
        {name: 'SID307', protocol: ['OBD', 'Boot'], years: '2011-2015', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Renault/Nissan'},
        {name: 'SID309', protocol: ['OBD', 'Boot'], years: '2012-2016', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Renault/Nissan/Dacia'},
        {name: 'SID310', protocol: ['OBD', 'Boot'], years: '2013-2017', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Renault/Nissan'},
        {name: 'SID803', protocol: ['OBD', 'Boot'], years: '2006-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'PSA/Ford'},
        {name: 'SID803A', protocol: ['OBD', 'Boot'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'PSA/Ford'},
        {name: 'SID806', protocol: ['OBD', 'Boot'], years: '2008-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID807', protocol: ['OBD', 'Boot'], years: '2009-2014', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID807evo', protocol: ['OBD', 'Boot'], years: '2010-2015', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID83A', protocol: ['OBD', 'Boot'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'PSA Group'},
        {name: 'SID83M', protocol: ['OBD', 'Boot'], years: '2008-2012', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'PSA Group'}
      ],
      // EMS (Engine Management System) - ENHANCED
      ems: [
        {name: 'EMS2101', protocol: ['OBD', 'Boot'], years: '2004-2009', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS2102', protocol: ['OBD', 'Boot'], years: '2005-2009', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'Ford/Mazda'},
        {name: 'EMS2103', protocol: ['OBD', 'Boot'], years: '2005-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS2106', protocol: ['OBD', 'Boot'], years: '2006-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'Ford/Volvo'},
        {name: 'EMS2204', protocol: ['OBD', 'Boot'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS2205', protocol: ['OBD', 'Boot'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Ford/Volvo'},
        {name: 'EMS2208', protocol: ['OBD', 'Boot'], years: '2008-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS2211', protocol: ['OBD', 'Boot'], years: '2009-2013', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford/Mazda'},
        {name: 'EMS2301', protocol: ['OBD', 'Boot'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS2302', protocol: ['OBD', 'Boot'], years: '2008-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS24xx', protocol: ['OBD', 'Boot'], years: '2009-2013', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS2510', protocol: ['OBD', 'Boot'], years: '2010-2014', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford/Mazda'},
        {name: 'EMS2511', protocol: ['OBD', 'Boot'], years: '2011-2015', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS2512', protocol: ['OBD', 'Boot'], years: '2011-2015', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford/Volvo'},
        {name: 'EMS2513', protocol: ['OBD', 'Boot'], years: '2012-2016', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS2701', protocol: ['OBD', 'Boot'], years: '2012-2017', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford Diesel'},
        {name: 'EMS2910', protocol: ['OBD', 'Boot'], years: '2013-2017', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS2916', protocol: ['OBD', 'Boot'], years: '2014-2018', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS3110', protocol: ['OBD', 'Boot'], years: '2015-2019', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS3125', protocol: ['OBD', 'Boot'], years: '2016-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS3140', protocol: ['OBD', 'Boot'], years: '2017-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS3141', protocol: ['OBD', 'Boot'], years: '2017-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS3142', protocol: ['OBD', 'Boot'], years: '2018-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS3150', protocol: ['OBD', 'Boot'], years: '2018-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS3155', protocol: ['OBD', 'Boot'], years: '2019-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS3160', protocol: ['OBD', 'Boot'], years: '2019-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS3161', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'},
        {name: 'EMS3180', protocol: ['OBD', 'Boot'], years: '2021-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Ford'}
      ],
      // SIM2K (Hyundai/Kia) - ENHANCED
      sim2k: [
        {name: 'SIM2K-141', protocol: ['OBD', 'Boot'], years: '2008-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-142', protocol: ['OBD', 'Boot'], years: '2009-2013', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-240', protocol: ['OBD', 'Boot'], years: '2010-2014', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-240R', protocol: ['OBD', 'Boot'], years: '2010-2014', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-241', protocol: ['OBD', 'Boot'], years: '2011-2015', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-242', protocol: ['OBD', 'Boot'], years: '2012-2016', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-245', protocol: ['OBD', 'Boot'], years: '2013-2017', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-250', protocol: ['OBD', 'Boot'], years: '2014-2018', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-251', protocol: ['OBD', 'Boot'], years: '2015-2019', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-253', protocol: ['OBD', 'Boot'], years: '2016-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-259', protocol: ['OBD', 'Boot'], years: '2017-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-260', protocol: ['OBD', 'Boot'], years: '2018-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-261', protocol: ['OBD', 'Boot'], years: '2019-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'SIM2K-305', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia/Genesis'}
      ],
      // GPEC (GM Powertrain)
      gpec: [
        {name: 'GPEC2', protocol: ['OBD', 'BDM'], years: '2004-2009', capability: 'Full tuning', read: 'BDM100', flash: 'Yes', vehicles: 'Opel/Vauxhall'},
        {name: 'GPEC2A', protocol: ['OBD', 'BDM'], years: '2005-2010', capability: 'Full tuning', read: 'BDM100', flash: 'Yes', vehicles: 'Opel/Vauxhall'},
        {name: 'GPEC3', protocol: ['OBD', 'Boot'], years: '2006-2011', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'Opel/Vauxhall'},
        {name: 'GPEC4', protocol: ['OBD', 'Boot'], years: '2007-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Opel/Vauxhall'},
        {name: 'GPEC4LM', protocol: ['OBD', 'Boot'], years: '2008-2013', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Opel/Vauxhall'}
      ],
      // Gearbox - ENHANCED
      gearbox: [
        {name: 'DL382', protocol: ['OBD', 'Boot'], years: '2009-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi DSG'},
        {name: 'DL500', protocol: ['OBD', 'Boot'], years: '2008-2018', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi'},
        {name: 'DL501gen1', protocol: ['OBD', 'Boot'], years: '2008-2014', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'VW/Audi DSG'},
        {name: 'DL501gen2', protocol: ['OBD', 'Boot'], years: '2014-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi DSG'},
        {name: 'DL800', protocol: ['OBD', 'Boot'], years: '2012-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi/Porsche'},
        {name: 'DQ200', protocol: ['OBD', 'Boot'], years: '2008-2018', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'VW/Seat/Skoda DSG'},
        {name: 'DQ200G2', protocol: ['OBD', 'Boot'], years: '2015-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Seat/Skoda DSG'},
        {name: 'DQ250', protocol: ['OBD', 'Boot'], years: '2003-2015', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'VW/Audi DSG'},
        {name: 'DQ250E', protocol: ['OBD', 'Boot'], years: '2008-2018', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi DSG'},
        {name: 'DQ250F', protocol: ['OBD', 'Boot'], years: '2010-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi DSG'},
        {name: 'DQ400E', protocol: ['OBD', 'Boot'], years: '2012-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi/Seat/Skoda'},
        {name: 'DQ500', protocol: ['OBD', 'Boot'], years: '2009-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'VW/Audi DSG'},
        {name: 'ASG1', protocol: ['OBD', 'Boot'], years: '2005-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'VW Group'}
      ],
      // Valvetronic
      valvetronic: [
        {name: 'V56.12', protocol: ['OBD'], years: '2001-2008', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'BMW'},
        {name: 'VD56.1', protocol: ['OBD'], years: '2005-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'BMW'}
      ]
    },

    // Siemens (BMW specific) - ENHANCED
    siemens: {
      bmw: [
        {name: 'MS43', protocol: ['OBD', 'BDM'], years: '2001-2006', capability: 'Full tuning', read: 'BDM100', flash: 'Yes', vehicles: 'BMW E46/E39'},
        {name: 'MS45', protocol: ['OBD', 'BDM'], years: '2002-2007', capability: 'Full tuning', read: 'BDM100/K-TAG', flash: 'Yes', vehicles: 'BMW E46'},
        {name: 'MSD80', protocol: ['OBD', 'Boot'], years: '2006-2010', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'BMW E90/E60'},
        {name: 'MSD81', protocol: ['OBD', 'Boot'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'BMW E90/E60'},
        {name: 'MSD81.2', protocol: ['OBD', 'Boot'], years: '2008-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'BMW E90/E60'},
        {name: 'MSD85', protocol: ['OBD', 'Boot'], years: '2008-2013', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'BMW E90/E92 M3'},
        {name: 'MSD87', protocol: ['OBD', 'Boot'], years: '2010-2015', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'BMW F-Series'},
        {name: 'MSS52', protocol: ['OBD', 'BDM'], years: '2000-2003', capability: 'Full tuning', read: 'BDM100', flash: 'Yes', vehicles: 'BMW E46 M3'},
        {name: 'MSS54', protocol: ['OBD', 'BDM'], years: '2000-2005', capability: 'Full tuning', read: 'BDM100', flash: 'Yes', vehicles: 'BMW M5/M6'},
        {name: 'MSS54HP', protocol: ['OBD', 'BDM'], years: '2003-2006', capability: 'Full tuning', read: 'BDM100', flash: 'Yes', vehicles: 'BMW M5/M6'},
        {name: 'MSS60', protocol: ['OBD', 'Boot'], years: '2005-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'BMW M5/M6'},
        {name: 'MSS65', protocol: ['OBD', 'Boot'], years: '2005-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'BMW M5/M6'},
        {name: 'MSS70', protocol: ['OBD', 'Boot'], years: '2008-2012', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'BMW X5M/X6M'},
        {name: 'MSV70', protocol: ['OBD', 'Boot'], years: '2010-2013', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'BMW F-Series'},
        {name: 'MSV80', protocol: ['OBD', 'Boot'], years: '2011-2015', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'BMW F-Series'},
        {name: 'MSV90', protocol: ['OBD', 'Boot'], years: '2015-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'BMW G-Series'}
      ],
      ppd: [{name: 'PPD1.x', protocol: ['OBD'], years: '2004-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'BMW Diesel'}],
      pcr: [{name: 'PCR2.1', protocol: ['OBD', 'Boot'], years: '2006-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'BMW/Mini'}],
      simtec: [{name: 'SIMTEC76', protocol: ['OBD'], years: '2005-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'BMW/Mini Diesel'}]
    },

    // Delphi ECU Types - ENHANCED
    delphi: {
      diesel: [
        {name: 'DCM1.2', protocol: ['OBD', 'BDM'], years: '2002-2007', capability: 'Full tuning', read: 'BDM100', flash: 'Yes', vehicles: 'Renault'},
        {name: 'DCM3.2AP', protocol: ['OBD', 'BDM'], years: '2006-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'Renault/Nissan'},
        {name: 'DCM3.4', protocol: ['OBD', 'BDM'], years: '2007-2011', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Renault/Nissan'},
        {name: 'DCM3.4(+)', protocol: ['OBD', 'Boot'], years: '2008-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Renault/Nissan'},
        {name: 'DCM3.5', protocol: ['OBD', 'Boot'], years: '2009-2013', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Renault/Nissan/Dacia'},
        {name: 'DCM3.7AP', protocol: ['OBD', 'Boot'], years: '2010-2014', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Hyundai/Kia'},
        {name: 'DCM6.1', protocol: ['OBD', 'Boot'], years: '2009-2013', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Vauxhall/Opel'},
        {name: 'DCM6.2A', protocol: ['OBD', 'Boot'], years: '2011-2016', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Vauxhall/Opel'},
        {name: 'DCM6.2AP', protocol: ['OBD', 'Boot'], years: '2012-2017', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Vauxhall/Opel/Chevrolet'},
        {name: 'DCM6.2AP-6D', protocol: ['OBD', 'Boot'], years: '2013-2018', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Vauxhall/Opel'},
        {name: 'DCM6.2C', protocol: ['OBD', 'Boot'], years: '2014-2018', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Vauxhall/Opel'},
        {name: 'DCM6.2V', protocol: ['OBD', 'Boot'], years: '2015-2019', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Vauxhall/Opel'},
        {name: 'DCM7.1A', protocol: ['OBD', 'Boot'], years: '2016-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Vauxhall/Opel'},
        {name: 'DCM7.1B', protocol: ['OBD', 'Boot'], years: '2017-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Vauxhall/Opel'},
        {name: 'CRD3.30', protocol: ['OBD', 'Boot'], years: '2006-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Mercedes CDI'},
        {name: 'CRD3.7A', protocol: ['OBD', 'Boot'], years: '2007-2013', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Mercedes CDI'},
        {name: 'CRD3.N5', protocol: ['OBD', 'Boot'], years: '2008-2014', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Mercedes CDI'}
      ],
      motorcycle: [
        {name: 'MT05', protocol: ['OBD'], years: '2002-2008', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'Harley Davidson'},
        {name: 'MT05.2', protocol: ['OBD'], years: '2008-2014', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Harley Davidson'},
        {name: 'MT05.3', protocol: ['OBD'], years: '2014-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Harley Davidson'},
        {name: 'MT21M', protocol: ['OBD'], years: '2016-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Harley Davidson'},
        {name: 'HD1-CAN', protocol: ['OBD', 'CAN'], years: '2002-2007', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'Harley Davidson'},
        {name: 'HD2-CAN', protocol: ['OBD', 'CAN'], years: '2007-2013', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Harley Davidson'},
        {name: 'HD3-CAN', protocol: ['OBD', 'CAN'], years: '2014-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Harley Davidson'}
      ]
    },

    // Marelli ECU Types - ENHANCED
    marelli: {
      diesel: [
        {name: 'MJD6', protocol: ['OBD', 'BDM'], years: '2002-2008', capability: 'Full tuning', read: 'BDM100', flash: 'Yes', vehicles: 'Fiat/Alfa/Lancia'},
        {name: 'MJD8F2', protocol: ['OBD', 'Boot'], years: '2007-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Fiat/Alfa/Lancia'},
        {name: 'MJD8F3', protocol: ['OBD', 'Boot'], years: '2009-2014', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Fiat/Alfa/Lancia'},
        {name: 'MJD9DF', protocol: ['OBD', 'Boot'], years: '2011-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Fiat/Alfa/Jeep/Lancia'}
      ],
      petrol: [
        {name: '8GMC', protocol: ['OBD', 'Boot'], years: '2005-2010', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'Fiat/Alfa'},
        {name: '8GMF', protocol: ['OBD', 'Boot'], years: '2006-2011', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Fiat/Alfa'},
        {name: 'MK', protocol: ['OBD', 'Boot'], years: '2004-2009', capability: 'Full tuning', read: 'K-TAG', flash: 'Yes', vehicles: 'Fiat/Alfa'},
        {name: '8GMK.Fx', protocol: ['OBD', 'Boot'], years: '2007-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Fiat/Alfa'},
        {name: '8GML', protocol: ['OBD', 'Boot'], years: '2008-2013', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Fiat/Alfa/Lancia'},
        {name: '8GMW', protocol: ['OBD', 'Boot'], years: '2009-2015', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Fiat/Alfa'},
        {name: '8GSF', protocol: ['OBD', 'Boot'], years: '2010-2016', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Fiat/Alfa'},
        {name: '8GSW', protocol: ['OBD', 'Boot'], years: '2011-2017', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Fiat/Alfa'},
        {name: '9GF', protocol: ['OBD', 'Boot'], years: '2012-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'Fiat/Alfa/Jeep'},
        {name: 'IAW', protocol: ['OBD', 'BDM'], years: '1998-2008', capability: 'Full tuning', read: 'BDM100/K-TAG', flash: 'Yes', vehicles: 'Fiat/Alfa/Lancia'}
      ],
      motorcycle: [{name: '11MP', protocol: ['OBD'], years: '2008-2020', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'Ducati/Aprilia'}]
    },

    // Delco (GM) ECU Types - ENHANCED
    delco: {
      all: [
        {name: 'E38', protocol: ['OBD', 'Boot'], years: '2005-2012', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'GM LS Engines'},
        {name: 'E39', protocol: ['OBD', 'Boot'], years: '2006-2013', capability: 'Full tuning', read: 'K-TAG/Kess3', flash: 'Yes', vehicles: 'GM Trucks'},
        {name: 'E39A', protocol: ['OBD', 'Boot'], years: '2007-2014', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM Trucks'},
        {name: 'E67', protocol: ['OBD', 'Boot'], years: '2008-2015', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM Diesel'},
        {name: 'E78', protocol: ['OBD', 'Boot'], years: '2009-2016', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM/Vauxhall/Opel'},
        {name: 'E80', protocol: ['OBD', 'Boot'], years: '2010-2017', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM Trucks'},
        {name: 'E81', protocol: ['OBD', 'Boot'], years: '2011-2018', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM Cars'},
        {name: 'E82', protocol: ['OBD', 'Boot'], years: '2012-2019', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM/Vauxhall/Opel'},
        {name: 'E83', protocol: ['OBD', 'Boot'], years: '2013-2020', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM/Vauxhall/Opel'},
        {name: 'E84', protocol: ['OBD', 'Boot'], years: '2014-2021', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM'},
        {name: 'E87', protocol: ['OBD', 'Boot'], years: '2015-2022', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM Cars'},
        {name: 'E92', protocol: ['OBD', 'Boot'], years: '2016-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM/Chevrolet'},
        {name: 'E98', protocol: ['OBD', 'Boot'], years: '2017-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM/Chevrolet'},
        {name: 'T87', protocol: ['OBD', 'Boot'], years: '2016-2023', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM Transmission'},
        {name: 'T87A', protocol: ['OBD', 'Boot'], years: '2017-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM Transmission'},
        {name: 'T93', protocol: ['OBD', 'Boot'], years: '2020-2024', capability: 'Full tuning', read: 'Kess3', flash: 'Yes', vehicles: 'GM 10-Speed Trans'}
      ]
    },

    // Denso ECU Types
    denso: {
      all: ['76F00xx', 'Gen2 D76F01xx', 'Gen3 R7F701202', 'Gen4 R7F702002', 'SH7058', 'SH7059', 'MB275700', 'MB279700', '4N15']
    },

    // Kefico (Hyundai/Kia)
    kefico: {
      all: ['CPEGD2.20.1', 'CPEGD2.20.2', 'CPEGD2.20.3', 'CPEGD2.20.4', 'CPEGD3.20.1', 'CPEGP3.20.2', 'CPGPSH3.24.1', 'CPGPSH3.26.1', 'ME17.9.12', 'MEG17.9.12', 'MEG17.9.13']
    },

    // Hitachi ECU Types
    hitachi: {
      all: ['BED436', 'BED501', 'BEM542', 'BEM549', 'BEM54C', 'BEDxxx/MECxxx']
    },

    // Transtron (Subaru/Japanese)
    transtron: {
      all: ['TTI SH7058', 'TTI SH7059', 'TTI SH72533', 'TTI SH72544', 'Aurix TC265D', 'Aurix TC277T']
    },

    // Valeo ECU Types
    valeo: {
      all: ['J34P', 'V40', 'V42', 'V46.11', 'V46.12', 'V46.13', 'V46.21', 'V50.1', 'VD46.1']
    },

    // Visteon ECU Types
    visteon: {
      all: ['DCU102']
    },

    // Motorola/NGC
    motorola: {
      all: ['NGC4', 'NGC4A']
    },

    // Keihin (Honda/Japanese)
    keihin: {
      all: ['37820-5Ax', 'KTKS', 'KTKZ', 'KTKZ3']
    },

    // Sagem
    sagem: {
      all: ['S2000', 'S3000']
    },

    // ZF Gearbox ECUs
    zf: {
      gearbox: ['6HP', '8HP', '8HP Gen3', '8HP45-845RE', '8HP70', '8HP75', '8HP75H', '8HP90', '8HP95', '8HPxx', '8P75PH', 'AL450', 'AL552', 'ALx51']
    },

    // Temic Gearbox ECUs
    temic: {
      gearbox: ['DKG436 Gen1', 'DKG436 Gen2', 'DL382', 'DL501gen1', 'DL501gen2', 'DQ200', 'DQ200G2', 'DQ250', 'DQ250E', 'DQ250F', 'DQ400E']
    },

    // Getrag Gearbox
    getrag: {
      gearbox: ['7DCT300']
    }
  },

  /**
   * VEHICLE TO ECU MAPPING - Which ECU types are used by which manufacturers
   */
  VEHICLE_ECU_MAP: {
    'audi': {
      petrol: ['Bosch MED17.1', 'Bosch MED17.5', 'Bosch MED9.1', 'Bosch MG1CS', 'Continental Simos8', 'Continental Simos12', 'Continental Simos18', 'Continental Simos19'],
      diesel: ['Bosch EDC17C', 'Bosch EDC17CP', 'Continental Simos8', 'Bosch MD1CS'],
      gearbox: ['Temic DL501', 'Temic DQ200', 'Temic DQ250', 'Temic DQ400E', 'ZF AL552']
    },
    'bmw': {
      petrol: ['Siemens MSD80', 'Siemens MSD81', 'Siemens MSD85', 'Siemens MSV70', 'Siemens MSV80', 'Siemens MSV90', 'Bosch MEVD17.2', 'Bosch MG1CS'],
      diesel: ['Bosch EDC17C', 'Bosch EDC17CP', 'Bosch MD1CP'],
      gearbox: ['ZF 6HP', 'ZF 8HP', 'Getrag 7DCT300']
    },
    'vw': {
      petrol: ['Bosch MED17.5', 'Bosch MED17.1', 'Bosch ME7.5', 'Continental Simos10', 'Continental Simos12', 'Continental Simos18', 'Continental Simos19', 'Bosch MG1CS'],
      diesel: ['Bosch EDC17C', 'Bosch EDC17CP', 'Continental Simos8', 'Bosch MD1CS', 'Delphi DCM6.2'],
      gearbox: ['Temic DQ200', 'Temic DQ250', 'Temic DQ500', 'Bosch DQ500']
    },
    'mercedes': {
      petrol: ['Bosch ME9.7', 'Bosch MED17.7', 'Bosch MG1CS', 'Siemens SIM4'],
      diesel: ['Bosch EDC17C', 'Bosch EDC17CP', 'Delphi CRD3', 'Bosch MD1CP', 'Continental SID'],
      gearbox: ['ZF 7G-DCT', 'ZF 9G-Tronic']
    },
    'ford': {
      petrol: ['Bosch MED17.0', 'Bosch MED17.2', 'Continental EMS', 'Bosch MG1CS'],
      diesel: ['Bosch EDC17C', 'Continental SID', 'Delphi DCM3.5', 'Bosch MD1CS'],
      gearbox: ['Getrag 6DCT', 'Ford 6F']
    },
    'vauxhall': {
      petrol: ['Delco E78', 'Delco E80', 'Delco E83', 'Bosch ME7', 'Bosch MED17'],
      diesel: ['Bosch EDC17C', 'Denso', 'Delphi DCM6.2'],
      gearbox: ['GM 6T']
    },
    'peugeot': {
      petrol: ['Bosch ME7.4', 'Bosch MED17.4', 'Continental EMS3'],
      diesel: ['Bosch EDC17C', 'Continental SID807', 'Delphi DCM3', 'Delphi DCM6'],
      gearbox: ['AL4', 'AM6', 'EAT8']
    },
    'citroen': {
      petrol: ['Bosch ME7.4', 'Bosch MED17.4', 'Continental EMS3'],
      diesel: ['Bosch EDC17C', 'Continental SID807', 'Delphi DCM3', 'Delphi DCM6'],
      gearbox: ['AL4', 'AM6', 'EAT8']
    },
    'renault': {
      petrol: ['Siemens Sirius', 'Continental EMS31', 'Valeo V42', 'Valeo V46'],
      diesel: ['Bosch EDC17C', 'Continental SID30', 'Delphi DCM1.2', 'Delphi DCM3.4'],
      gearbox: ['Renault EDC']
    },
    'fiat': {
      petrol: ['Bosch ME7', 'Marelli 8GM', 'Marelli IAW'],
      diesel: ['Bosch EDC16', 'Bosch EDC17C', 'Marelli MJD'],
      gearbox: ['Marelli TCM']
    },
    'alfa-romeo': {
      petrol: ['Bosch ME7', 'Marelli 8GM', 'Bosch MED17.3'],
      diesel: ['Bosch EDC16', 'Bosch EDC17C', 'Marelli MJD'],
      gearbox: ['ZF 8HP', 'Alfa TCT']
    },
    'land-rover': {
      petrol: ['Bosch MED17.8', 'Bosch MG1CS'],
      diesel: ['Bosch EDC17CP', 'Continental SID', 'Denso'],
      gearbox: ['ZF 8HP', 'ZF 9HP']
    },
    'jaguar': {
      petrol: ['Bosch MED17.8', 'Bosch MG1CS'],
      diesel: ['Bosch EDC17CP', 'Continental SID', 'Denso'],
      gearbox: ['ZF 8HP']
    },
    'porsche': {
      petrol: ['Bosch MED17.1', 'Bosch MG1CS', 'Continental SDI'],
      diesel: ['Bosch EDC17CP'],
      gearbox: ['ZF 8HP', 'Porsche PDK']
    },
    'hyundai': {
      petrol: ['Kefico CPEG', 'Continental SIM2K', 'Bosch MED17.9'],
      diesel: ['Bosch EDC17C', 'Delphi DCM3.7', 'Bosch MD1CS'],
      gearbox: ['Hyundai DCT']
    },
    'kia': {
      petrol: ['Kefico CPEG', 'Continental SIM2K', 'Bosch MED17.9'],
      diesel: ['Bosch EDC17C', 'Delphi DCM3.7', 'Bosch MD1CS'],
      gearbox: ['Hyundai DCT']
    },
    'toyota': {
      petrol: ['Denso', 'Bosch MED17'],
      diesel: ['Denso', 'Bosch EDC17'],
      gearbox: ['Aisin']
    },
    'honda': {
      petrol: ['Keihin', 'Bosch'],
      diesel: ['Bosch EDC17'],
      gearbox: ['Honda']
    },
    'nissan': {
      petrol: ['Hitachi', 'Continental', 'Bosch ME17'],
      diesel: ['Bosch EDC17', 'Denso'],
      gearbox: ['JATCO CVT', 'Nissan']
    },
    'mazda': {
      petrol: ['Denso', 'Hitachi'],
      diesel: ['Denso'],
      gearbox: ['Skyactiv']
    },
    'subaru': {
      petrol: ['Denso', 'Hitachi'],
      diesel: ['Denso'],
      gearbox: ['Lineartronic CVT']
    },
    'mitsubishi': {
      petrol: ['Continental', 'Denso', 'EVPT'],
      diesel: ['Denso 4N15', 'Bosch EDC17'],
      gearbox: ['JATCO CVT']
    },
    'volvo': {
      petrol: ['Bosch ME9', 'Bosch MED17', 'Denso'],
      diesel: ['Bosch EDC17', 'Continental SID', 'Denso'],
      gearbox: ['Aisin', 'Volvo Powershift']
    },
    'seat': {
      petrol: ['Bosch MED17.5', 'Bosch MED17.1', 'Continental Simos', 'Bosch MG1CS'],
      diesel: ['Bosch EDC17C', 'Bosch EDC17CP', 'Bosch MD1CS'],
      gearbox: ['Temic DQ200', 'Temic DQ250', 'Temic DQ500']
    },
    'skoda': {
      petrol: ['Bosch MED17.5', 'Bosch MED17.1', 'Continental Simos', 'Bosch MG1CS'],
      diesel: ['Bosch EDC17C', 'Bosch EDC17CP', 'Bosch MD1CS'],
      gearbox: ['Temic DQ200', 'Temic DQ250', 'Temic DQ500']
    }
  },

  // Strict verified-only mode: disable manufacturer/generic engine pools
  MANUFACTURER_ENGINES: {},
  GENERIC_ENGINES: [],

  /**
   * HELPER METHODS
   */

  canonicalizeEngineName: function(name) {
    if (!name) return '';
    let out = String(name).trim();
    out = out.replace(/\s*[-–—]\s*/g, ' - ');
    out = out.replace(/\s+/g, ' ').trim();

    const substitutions = [
      [/\btdi\b/gi, 'TDI'],
      [/\btsi\b/gi, 'TSI'],
      [/\btfsi\b/gi, 'TFSI'],
      [/\bcdi\b/gi, 'CDI'],
      [/\bcdti\b/gi, 'CDTI'],
      [/\bdci\b/gi, 'dCi'],
      [/\bhdi\b/gi, 'HDi'],
      [/\bbluehdi\b/gi, 'BlueHDi'],
      [/\bcrdi\b/gi, 'CRDi'],
      [/\bjtdm\b/gi, 'JTDm'],
      [/\bd-4d\b/gi, 'D-4D'],
      [/\becoboost\b/gi, 'EcoBoost'],
      [/\becoblue\b/gi, 'EcoBlue'],
      [/\bmultijet\b/gi, 'MultiJet'],
      [/\bpuretech\b/gi, 'PureTech'],
      [/\bskyactiv-d\b/gi, 'SKYACTIV-D'],
      [/\bskyactiv-g\b/gi, 'SKYACTIV-G'],
      [/\bhp\b/gi, 'hp']
    ];

    for (const [pattern, replacement] of substitutions) {
      out = out.replace(pattern, replacement);
    }

    return out.replace(/\s+/g, ' ').trim();
  },

  dedupeAndNormalizeEngines: function(engineList) {
    if (!Array.isArray(engineList)) return [];
    const normalized = [];
    const seen = new Set();

    for (const engine of engineList) {
      const canonical = this.canonicalizeEngineName(engine);
      if (!canonical) continue;
      const key = canonical.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      normalized.push(canonical);
    }

    return normalized;
  },

  buildSanitizedYearEngines: function() {
    const source = this.VEHICLE_ENGINE_DATABASE || {};
    const out = {};

    for (const [make, modelMap] of Object.entries(source)) {
      out[make] = {};
      for (const [modelKey, yearMap] of Object.entries(modelMap || {})) {
        out[make][modelKey] = {};
        for (const [yearRange, engines] of Object.entries(yearMap || {})) {
          out[make][modelKey][yearRange] = this.dedupeAndNormalizeEngines(engines);
        }
      }
    }

    return out;
  },

  buildSanitizedManufacturerEngines: function(yearEngines) {
    const sourcePools = this.MANUFACTURER_ENGINES || {};
    const sanitized = {};

    for (const [make, pool] of Object.entries(sourcePools)) {
      sanitized[make] = this.dedupeAndNormalizeEngines(pool);
    }

    for (const [make, modelMap] of Object.entries(yearEngines || {})) {
      if (sanitized[make] && sanitized[make].length > 0) continue;

      const aggregated = [];
      for (const yearMap of Object.values(modelMap || {})) {
        for (const engines of Object.values(yearMap || {})) {
          aggregated.push(...engines);
        }
      }

      const normalized = this.dedupeAndNormalizeEngines(aggregated);
      if (normalized.length > 0) {
        sanitized[make] = normalized;
      }
    }

    return sanitized;
  },
  
  // Get all manufacturers
  getManufacturers: function() {
    return Object.keys(this.VEHICLE_DATABASE).sort();
  },

  // Get models for a manufacturer
  getModels: function(manufacturer) {
    return this.VEHICLE_DATABASE[manufacturer] || [];
  },

  // Get year ranges for a specific model
  getYearRanges: function(manufacturer, model) {
    const modelKey = model.toLowerCase().replace(/\s+/g, '-');
    const mfrData = this.buildSanitizedYearEngines()[manufacturer];
    
    if (mfrData && mfrData[modelKey]) {
      return Object.keys(mfrData[modelKey]);
    }
    
    // Fallback year ranges
    return ['2021-2026', '2017-2020', '2013-2016', '2009-2012', '2005-2008', '2000-2004'];
  },

  // Get engines for manufacturer, model, and year
  getEngines: function(manufacturer, model, yearRange) {
    const modelKey = model.toLowerCase().replace(/\s+/g, '-');
    const sanitizedYearEngines = this.buildSanitizedYearEngines();
    const mfrData = sanitizedYearEngines[manufacturer];
    
    // Try year-specific engines first
    if (mfrData && mfrData[modelKey] && mfrData[modelKey][yearRange]) {
      return mfrData[modelKey][yearRange];
    }

    // Strict mode: no manufacturer/generic fallback engines
    return [];
  },

  // Export for Node.js API
  getAPIData: function() {
    const yearEngines = this.buildSanitizedYearEngines();
    return {
      models: this.VEHICLE_DATABASE,
      yearEngines: yearEngines
    };
  }
};

// Export for use in Node.js
if (typeof window !== 'undefined') {
  window.CarnageVehicleDB = CarnageVehicleDB;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CarnageVehicleDB;
}
