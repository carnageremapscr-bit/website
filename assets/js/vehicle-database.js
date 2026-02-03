/**
 * ============================================
 * CARNAGE REMAPS - CENTRALIZED VEHICLE DATABASE
 * ============================================
 * Single source of truth for all vehicle data
 * Used by: Main upload form, Vehicle search, Embed widget
 * Last Updated: January 9, 2026
 * ============================================
 */

const CarnageVehicleDB = {
  
  /**
   * VEHICLE MODELS DATABASE
   * Maps manufacturer to array of models
   */
  VEHICLE_DATABASE: {
    'audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'SQ5', 'SQ7', 'SQ8'],
    'bmw': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'iX', 'iX3', 'M2', 'M3', 'M4', 'M5', 'M8', 'X3 M', 'X4 M', 'X5 M', 'X6 M'],
    'mercedes': ['A-Class', 'B-Class', 'C-Class', 'CLA', 'CLS', 'E-Class', 'S-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'V-Class', 'Sprinter', 'Vito', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'AMG GT', 'SL', 'SLC'],
    'volkswagen': ['Polo', 'Golf', 'Jetta', 'Passat', 'Arteon', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Caddy', 'Transporter', 'Crafter', 'ID.3', 'ID.4', 'ID.5', 'ID.Buzz', 'Golf GTI', 'Golf R', 'Scirocco', 'Beetle', 'Sharan', 'up!', 'Amarok'],
    'ford': ['Fiesta', 'Focus', 'Mondeo', 'Mustang', 'EcoSport', 'Puma', 'Kuga', 'Edge', 'Explorer', 'Transit', 'Transit Custom', 'Ranger', 'F-150', 'S-Max', 'Galaxy', 'Tourneo', 'Fiesta ST', 'Focus ST', 'Focus RS', 'Mustang Mach-E', 'Bronco'],
    'vauxhall': ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Combo', 'Vivaro', 'Movano', 'Corsa-e', 'Mokka-e', 'Zafira', 'Ampera', 'Corsa VXR', 'Astra VXR'],
    'land-rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar', 'Freelander', 'Range Rover Autobiography', 'Range Rover SVR'],
    'nissan': ['Micra', 'Note', 'Pulsar', 'Juke', 'Qashqai', 'X-Trail', 'Leaf', 'GT-R', 'Navara', 'NV200', 'NV300', 'NV400', 'Ariya', '370Z', '350Z', 'Patrol', 'Pathfinder', 'Primastar', 'Interstar', 'Pixo'],
    'toyota': ['Aygo', 'Yaris', 'Corolla', 'Prius', 'Camry', 'C-HR', 'RAV4', 'Highlander', 'Land Cruiser', 'Hilux', 'Proace', 'Avensis', 'Auris', 'Verso', 'Supra', 'GT86', 'bZ4X', 'Mirai', 'Yaris GR'],
    'peugeot': ['108', '208', '308', '508', '2008', '3008', '5008', 'Rifter', 'Partner', 'Boxer', 'e-208', 'e-2008', '307', '407', '4007', 'Expert', '208 GTi', '308 GTi', 'RCZ'],
    'renault': ['Twingo', 'Clio', 'Captur', 'Megane', 'Kadjar', 'Koleos', 'Scenic', 'Kangoo', 'Trafic', 'Master', 'Zoe', 'Arkana', 'Espace', 'Laguna', 'Fluence', 'Wind', 'Twizy', 'Clio RS', 'Megane RS'],
    'citroen': ['C1', 'C3', 'C4', 'C5', 'C3 Aircross', 'C5 Aircross', 'Berlingo', 'Dispatch', 'Relay', 'C5 X', 'C4 Cactus', 'C3 Picasso', 'C4 Picasso', 'C4 Grand Picasso', 'Nemo', 'Jumpy', 'e-Berlingo', 'e-C4'],
    'seat': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Alhambra', 'Mii', 'Toledo', 'Leon Cupra', 'Ibiza Cupra', 'Exeo'],
    'skoda': ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq iV', 'Citigo', 'Rapid', 'Yeti', 'Roomster', 'Octavia vRS', 'Superb Scout'],
    'volvo': ['S60', 'S90', 'V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C30', 'C40', 'C70', 'V50', 'V70', 'S40', 'S80', 'XC70', 'XC40 Recharge', 'C40 Recharge'],
    'mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'MX-5', 'CX-7', 'CX-9', 'RX-8', 'MX-30', 'Bongo'],
    'honda': ['Jazz', 'Civic', 'Accord', 'CR-V', 'HR-V', 'e', 'Civic Type R', 'NSX', 'Insight', 'Legend', 'FR-V', 'Stream', 'CR-Z', 'S2000', 'ZR-V'],
    'hyundai': ['i10', 'i20', 'i30', 'i40', 'Kona', 'Tucson', 'Santa Fe', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'ix35', 'ix20', 'Veloster', 'Genesis', 'i30 N', 'Kona N', 'Bayon', 'Palisade', 'Nexo'],
    'kia': ['Picanto', 'Rio', 'Ceed', 'Stonic', 'Niro', 'Sportage', 'Sorento', 'EV6', 'XCeed', 'ProCeed', 'Venga', 'Soul', 'Optima', 'Stinger', 'EV9', 'Carnival', 'Ceed GT'],
    'fiat': ['500', 'Panda', 'Tipo', '500X', '500L', 'Ducato', 'Doblo', 'Punto', 'Bravo', 'Qubo', 'Fiorino', 'Talento', '500e', '600e'],
    'alfa-romeo': ['Mito', 'Giulietta', 'Giulia', 'Stelvio', 'Tonale', '159', 'Brera', 'Spider', 'GT', '147', '156', 'Giulia Quadrifoglio', 'Stelvio Quadrifoglio'],
    'jeep': ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Gladiator', 'Avenger', 'Commander', 'Liberty', 'Patriot'],
    'mini': ['Hatch', 'Clubman', 'Countryman', 'Convertible', 'Paceman', 'Coupe', 'Roadster', 'JCW', 'Cooper S', 'Electric'],
    'porsche': ['718 Cayman', '718 Boxster', '911', 'Panamera', 'Macan', 'Cayenne', 'Taycan', '911 Turbo', '911 GT3', 'Carrera', 'Cayman GT4', 'Boxster Spyder'],
    'lexus': ['CT', 'IS', 'ES', 'GS', 'LS', 'UX', 'NX', 'RX', 'LC', 'LX', 'RC', 'RC F', 'GS F', 'IS F', 'LFA'],
    'jaguar': ['XE', 'XF', 'XJ', 'F-Type', 'E-Pace', 'F-Pace', 'I-Pace', 'X-Type', 'S-Type', 'XK', 'XFR', 'XKR', 'F-Type R', 'F-Pace SVR'],
    'dacia': ['Sandero', 'Logan', 'Duster', 'Jogger', 'Spring', 'Dokker', 'Lodgy'],
    'suzuki': ['Ignis', 'Swift', 'Baleno', 'Vitara', 'S-Cross', 'Jimny', 'Celerio', 'SX4', 'Grand Vitara', 'Splash', 'Alto', 'Swift Sport'],
    'subaru': ['Impreza', 'Legacy', 'Outback', 'Forester', 'XV', 'BRZ', 'Levorg', 'WRX', 'WRX STI', 'Tribeca', 'Solterra'],
    'mitsubishi': ['Mirage', 'Eclipse Cross', 'Outlander', 'ASX', 'L200', 'Colt', 'Lancer', 'Shogun', 'Pajero', 'Space Star', 'Outlander PHEV'],
    'tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Roadster', 'Cybertruck'],
    'bentley': ['Continental GT', 'Flying Spur', 'Bentayga', 'Mulsanne', 'Continental GTC'],
    'maserati': ['Ghibli', 'Quattroporte', 'Levante', 'MC20', 'GranTurismo', 'GranCabrio', 'Grecale'],
    'abarth': ['595', '695', '500e', '124 Spider', 'Grande Punto', 'Punto Evo'],
    'ds': ['DS 3', 'DS 4', 'DS 7', 'DS 9', 'DS 3 Crossback', 'DS 5'],
    'smart': ['Fortwo', 'Forfour', 'EQ', 'Roadster', '#1', '#3'],
    'ssangyong': ['Tivoli', 'Korando', 'Rexton', 'Musso', 'Rodius', 'Kyron', 'Actyon'],
    'infiniti': ['Q30', 'Q50', 'Q60', 'QX30', 'QX50', 'QX70', 'Q70', 'QX80', 'FX', 'G'],
    'iveco': ['Daily', 'Eurocargo', 'Stralis', 'S-Way', 'Trakker', 'X-Way'],
    'dodge': ['Challenger', 'Charger', 'Durango', 'Ram 1500', 'Ram 2500', 'Ram 3500', 'Journey', 'Grand Caravan', 'Viper', 'Nitro'],
    'chevrolet': ['Spark', 'Cruze', 'Malibu', 'Camaro', 'Corvette', 'Equinox', 'Traverse', 'Silverado', 'Tahoe', 'Suburban', 'Colorado', 'Trax', 'Blazer', 'Volt', 'Bolt'],
    'chrysler': ['300', 'Pacifica', 'Voyager', 'Sebring', 'PT Cruiser', 'Grand Voyager'],
    'opel': ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Combo', 'Vivaro', 'Movano', 'Meriva', 'Antara', 'Agila', 'Adam', 'Karl', 'Cascada'],
    'mg': ['MG3', 'MG4', 'MG5', 'HS', 'ZS', 'ZS EV', 'MG4 EV', 'Marvel R', 'MG TF', 'MG ZT'],
    'cupra': ['Formentor', 'Leon', 'Ateca', 'Born', 'Tavascan'],
    'genesis': ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80'],
    'polestar': ['Polestar 1', 'Polestar 2', 'Polestar 3', 'Polestar 4'],
    'lotus': ['Elise', 'Exige', 'Evora', 'Emira', 'Eletre'],
    'aston-martin': ['Vantage', 'DB11', 'DBS', 'DBX', 'Rapide'],
    'mclaren': ['540C', '570S', '720S', '765LT', 'GT', 'Artura'],
    'ferrari': ['488', 'F8 Tributo', 'SF90', 'Roma', 'Portofino', '812 Superfast', 'Purosangue'],
    'lamborghini': ['Huracan', 'Aventador', 'Urus'],
    'rolls-royce': ['Ghost', 'Wraith', 'Dawn', 'Phantom', 'Cullinan', 'Spectre'],
    'bugatti': ['Chiron', 'Veyron', 'Divo'],
    'gmc': ['Sierra', 'Canyon', 'Yukon', 'Terrain', 'Acadia'],
    'cadillac': ['CT4', 'CT5', 'CT6', 'XT4', 'XT5', 'XT6', 'Escalade', 'Lyriq'],
    'buick': ['Encore', 'Envision', 'Enclave', 'Regal'],
    'lincoln': ['Corsair', 'Nautilus', 'Aviator', 'Navigator'],
    'ram': ['1500', '2500', '3500', 'ProMaster'],
    'hummer': ['EV', 'H2', 'H3'],
    'saab': ['9-3', '9-5'],
    'lancia': ['Ypsilon', 'Delta', 'Musa', 'Thema'],
    'alpine': ['A110'],
    'greatwall': ['Steed', 'Voleex C10'],
    'proton': ['Persona', 'Saga', 'Exora', 'Preve'],
    'perodua': ['Myvi', 'Axia', 'Bezza', 'Aruz']
  },

  /**
   * MANUFACTURER ENGINES DATABASE
   * Generic engines available per manufacturer
   */
  MANUFACTURER_ENGINES: {
    'audi': ['1.6 TDI - 90hp', '1.6 TDI - 95hp', '1.6 TDI - 105hp', '1.6 TDI - 116hp', '2.0 TDI - 136hp', '2.0 TDI - 140hp', '2.0 TDI - 143hp', '2.0 TDI - 150hp', '2.0 TDI - 170hp', '2.0 TDI - 190hp', '2.0 TDI - 200hp', '2.0 TDI - 204hp', '3.0 TDI - 204hp', '3.0 TDI - 218hp', '3.0 TDI - 231hp', '3.0 TDI - 272hp', '1.0 TFSI - 82hp', '1.0 TFSI - 95hp', '1.0 TFSI - 110hp', '1.0 TFSI - 115hp', '1.0 TFSI - 116hp', '1.2 TFSI - 86hp', '1.4 TFSI - 122hp', '1.4 TFSI - 125hp', '1.4 TFSI - 140hp', '1.4 TFSI - 150hp', '1.5 TFSI - 150hp', '1.8 T - 150hp', '1.8 T - 163hp', '1.8 T - 180hp', '1.8 TFSI - 160hp', '1.8 TFSI - 170hp', '1.8 TFSI - 180hp', '1.8 TFSI - 192hp', '2.0 TFSI - 190hp', '2.0 TFSI - 200hp', '2.0 TFSI - 245hp', '2.0 TFSI - 300hp', '2.5 TFSI - 400hp', '3.0 TFSI - 340hp', '3.0 V6 - 220hp'],
    'volkswagen': ['1.6 TDI - 105hp', '1.6 TDI - 116hp', '2.0 TDI - 136hp', '2.0 TDI - 140hp', '2.0 TDI - 150hp', '2.0 TDI - 184hp', '2.0 TDI - 190hp', '3.0 TDI - 204hp', '3.0 TDI - 286hp', '1.0 TSI - 95hp', '1.0 TSI - 115hp', '1.4 TSI - 125hp', '1.4 TSI - 150hp', '1.5 TSI - 130hp', '1.5 TSI - 150hp', '1.8 T - 150hp', '1.8 T - 180hp', '1.8 TSI - 160hp', '1.8 TSI - 180hp', '2.0 TSI - 190hp', '2.0 TSI - 245hp', '2.0 TSI - 300hp'],
    'seat': ['1.6 TDI - 105hp', '1.6 TDI - 116hp', '2.0 TDI - 143hp', '2.0 TDI - 150hp', '2.0 TDI - 184hp', '1.0 TSI - 95hp', '1.0 TSI - 115hp', '1.4 TSI - 125hp', '1.4 TSI - 150hp', '1.5 TSI - 130hp', '1.5 TSI - 150hp', '1.8 T - 150hp', '1.8 T - 180hp', '1.8 TSI - 160hp', '1.8 TSI - 180hp', '2.0 TSI - 190hp', '2.0 TSI - 245hp', '2.0 TSI - 300hp'],
    'skoda': ['1.6 TDI - 105hp', '1.6 TDI - 116hp', '2.0 TDI - 143hp', '2.0 TDI - 150hp', '2.0 TDI - 200hp', '1.0 TSI - 95hp', '1.0 TSI - 110hp', '1.4 TSI - 125hp', '1.4 TSI - 150hp', '1.5 TSI - 150hp', '1.8 T - 150hp', '1.8 T - 180hp', '1.8 TSI - 160hp', '1.8 TSI - 180hp', '2.0 TSI - 190hp', '2.0 TSI - 245hp'],
    'fiat': ['1.3 MultiJet - 75hp', '1.3 MultiJet - 95hp', '1.6 MultiJet - 105hp', '1.6 MultiJet - 120hp', '2.0 MultiJet - 140hp', '2.0 MultiJet - 170hp', '0.9 TwinAir - 85hp', '1.0 FireFly - 70hp', '1.0 FireFly - 100hp', '1.4 MultiAir - 95hp', '1.4 MultiAir - 120hp', '1.4 T-Jet - 120hp', '1.4 T-Jet - 150hp', '1.6 MultiJet II - 120hp', '2.0 MultiJet II - 170hp'],
    'alfa-romeo': ['1.3 JTDm - 95hp', '1.6 JTDm - 105hp', '1.6 JTDm - 120hp', '2.0 JTDm - 136hp', '2.0 JTDm - 150hp', '2.0 JTDm - 180hp', '2.2 JTD - 136hp', '2.2 JTD - 150hp', '2.2 JTD - 180hp', '1.4 TB MultiAir - 120hp', '1.4 TB MultiAir - 140hp', '1.4 TB MultiAir - 170hp', '1.8 TBi - 200hp', '2.0 TB - 200hp', '2.0 TB - 280hp', '2.9 V6 Bi-Turbo - 510hp'],
    'bmw': ['1.6d - 116hp', '2.0d - 150hp', '2.0d - 163hp', '2.0d - 190hp', '2.0d - 204hp', '3.0d - 218hp', '3.0d - 249hp', '3.0d - 265hp', '3.0d - 286hp', '1.5i - 136hp', '2.0i - 184hp', '2.0i - 252hp', '3.0i - 258hp', '3.0i - 340hp', '3.0i - 374hp', '4.4 V8 - 530hp'],
    'mercedes': ['1.5 CDI - 116hp', '1.6 CDI - 136hp', '2.0 CDI - 136hp', '2.0 CDI - 163hp', '2.0 CDI - 190hp', '2.1 CDI - 136hp', '2.1 CDI - 170hp', '2.2 CDI - 170hp', '3.0 CDI - 204hp', '3.0 CDI - 231hp', '3.0 CDI - 258hp', '1.3 - 136hp', '1.5 - 156hp', '1.6 - 122hp', '2.0 - 184hp', '2.0 - 211hp', '2.0 - 258hp', '3.0 V6 - 367hp'],
    'ford': ['1.5 TDCi - 95hp', '1.5 TDCi - 120hp', '1.6 TDCi - 95hp', '1.6 TDCi - 115hp', '2.0 TDCi - 150hp', '2.0 TDCi - 170hp', '2.0 TDCi - 185hp', '2.0 Bi-Turbo - 213hp', '1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.0 EcoBoost - 140hp', '1.5 EcoBoost - 150hp', '1.5 EcoBoost - 182hp', '2.0 EcoBoost - 245hp', '2.3 EcoBoost - 280hp', '2.7 EcoBoost V6 - 325hp'],
    'vauxhall': ['1.5 Turbo D - 102hp', '1.5 Turbo D - 120hp', '1.6 CDTI - 110hp', '1.6 CDTI - 136hp', '2.0 CDTI - 170hp', '1.0 Turbo - 105hp', '1.2 Turbo - 110hp', '1.2 Turbo - 130hp', '1.4 Turbo - 125hp', '1.4 Turbo - 145hp', '1.6 Turbo - 200hp', '2.0 Turbo - 230hp'],
    'land-rover': ['2.0 D - 163hp', '2.0 D - 180hp', '2.0 D - 204hp', '2.0 D - 240hp', '3.0 D - 249hp', '3.0 D - 300hp', '2.0 P - 200hp', '2.0 P - 249hp', '2.0 P - 300hp', '3.0 P - 360hp', '3.0 P - 400hp', '5.0 V8 - 525hp'],
    'peugeot': ['1.5 BlueHDi - 100hp', '1.5 BlueHDi - 130hp', '1.6 BlueHDi - 100hp', '1.6 BlueHDi - 120hp', '2.0 BlueHDi - 150hp', '2.0 BlueHDi - 180hp', '1.2 PureTech - 100hp', '1.2 PureTech - 110hp', '1.2 PureTech - 130hp', '1.6 PureTech - 165hp', '1.6 PureTech - 180hp'],
    'renault': ['1.5 dCi - 75hp', '1.5 dCi - 85hp', '1.5 dCi - 90hp', '1.5 dCi - 95hp', '1.5 dCi - 110hp', '1.5 Blue dCi - 115hp', '1.6 dCi - 130hp', '1.7 Blue dCi - 150hp', '2.0 dCi - 150hp', '2.0 dCi - 160hp', '0.9 TCe - 90hp', '1.0 SCe - 65hp', '1.0 SCe - 75hp', '1.0 TCe - 90hp', '1.0 TCe - 100hp', '1.2 TCe - 115hp', '1.2 TCe - 120hp', '1.3 TCe - 130hp', '1.3 TCe - 140hp', '1.3 TCe - 155hp', '1.3 TCe - 160hp', '1.6 TCe - 165hp', '1.6 TCe - 190hp', '1.8 TCe - 280hp'],
    'citroen': ['1.5 BlueHDi - 100hp', '1.5 BlueHDi - 130hp', '1.6 BlueHDi - 100hp', '1.6 BlueHDi - 120hp', '2.0 BlueHDi - 150hp', '2.0 BlueHDi - 180hp', '1.2 PureTech - 82hp', '1.2 PureTech - 110hp', '1.2 PureTech - 130hp', '1.6 PureTech - 165hp'],
    'nissan': ['1.5 dCi - 90hp', '1.5 dCi - 110hp', '1.6 dCi - 130hp', '2.0 dCi - 150hp', '2.0 dCi - 177hp', '0.9 IG-T - 90hp', '1.0 DIG-T - 100hp', '1.2 DIG-T - 115hp', '1.3 DIG-T - 140hp', '1.3 DIG-T - 160hp', '1.6 DIG-T - 163hp', '2.0 - 144hp'],
    'toyota': ['1.4 D-4D - 90hp', '1.6 D-4D - 112hp', '2.0 D-4D - 116hp', '2.0 D-4D - 143hp', '2.2 D-4D - 150hp', '2.2 D-4D - 177hp', '1.0 VVT-i - 72hp', '1.2 Turbo - 116hp', '1.5 VVT-i - 111hp', '1.8 VVT-i - 140hp', '2.0 VVT-i - 152hp', '2.5 Hybrid - 184hp', '3.5 V6 - 299hp'],
    'honda': ['1.6 i-DTEC - 120hp', '2.2 i-DTEC - 150hp', '2.2 i-DTEC - 160hp', '1.0 VTEC Turbo - 129hp', '1.5 VTEC Turbo - 182hp', '1.5 i-VTEC - 130hp', '1.8 i-VTEC - 142hp', '2.0 i-VTEC - 158hp', '2.0 VTEC Turbo - 320hp'],
    'mazda': ['1.5 SKYACTIV-D - 105hp', '1.8 SKYACTIV-D - 116hp', '2.2 SKYACTIV-D - 150hp', '2.2 SKYACTIV-D - 184hp', '1.5 SKYACTIV-G - 90hp', '1.5 SKYACTIV-G - 120hp', '2.0 SKYACTIV-G - 122hp', '2.0 SKYACTIV-G - 165hp', '2.5 SKYACTIV-G - 194hp'],
    'hyundai': ['1.5 CRDi - 110hp', '1.6 CRDi - 115hp', '1.6 CRDi - 136hp', '2.0 CRDi - 185hp', '1.0 T-GDi - 100hp', '1.0 T-GDi - 120hp', '1.4 T-GDi - 140hp', '1.6 T-GDi - 177hp', '1.6 T-GDi - 204hp', '2.0 T-GDi - 245hp'],
    'kia': ['1.5 CRDi - 110hp', '1.6 CRDi - 115hp', '1.6 CRDi - 136hp', '2.0 CRDi - 185hp', '1.0 T-GDi - 100hp', '1.0 T-GDi - 120hp', '1.4 T-GDi - 140hp', '1.6 T-GDi - 177hp', '1.6 T-GDi - 204hp', '2.0 T-GDi - 245hp'],
    'porsche': ['3.0 Diesel - 245hp', '3.0 Diesel - 262hp', '4.0 Diesel - 421hp', '2.0 - 300hp', '2.5 - 365hp', '3.0 - 340hp', '3.0 - 385hp', '3.0 - 450hp', '4.0 - 500hp', '4.0 - 550hp'],
    'jaguar': ['2.0 D - 163hp', '2.0 D - 180hp', '2.0 D - 204hp', '3.0 D - 300hp', '2.0 P - 200hp', '2.0 P - 250hp', '2.0 P - 300hp', '3.0 P - 340hp', '3.0 P - 380hp', '5.0 V8 - 575hp'],
    'volvo': ['2.0 D3 - 150hp', '2.0 D4 - 190hp', '2.0 D5 - 235hp', '2.0 T4 - 190hp', '2.0 T5 - 250hp', '2.0 T6 - 310hp', '2.0 T8 Hybrid - 390hp']
  },

  /**
   * GENERIC ENGINES FALLBACK
   * Used when manufacturer-specific engines not available
   */
  GENERIC_ENGINES: [
    '1.0 - 70hp', '1.2 - 80hp', '1.4 - 90hp', '1.5 - 100hp', 
    '1.6 - 110hp', '1.8 - 140hp', '2.0 - 150hp', '2.0 - 180hp', 
    '2.2 - 150hp', '2.5 - 200hp', '3.0 - 250hp'
  ],

  /**
   * YEAR-SPECIFIC ENGINE DATABASE
   * Most detailed data - specific engines per model and year range
   */
  VEHICLE_ENGINE_DATABASE: {
    'audi': {
      'a1': {
        '2010-2014': ['1.2 TFSI - 86hp', '1.4 TFSI - 122hp', '1.4 TFSI - 185hp', '1.6 TDI - 90hp', '1.6 TDI - 105hp', '2.0 TDI - 143hp'],
        '2015-2018': ['1.0 TFSI - 82hp', '1.0 TFSI - 95hp', '1.4 TFSI - 125hp', '1.4 TFSI - 150hp', '1.6 TDI - 90hp', '1.6 TDI - 116hp'],
        '2019-2024': ['1.0 TFSI - 95hp', '1.0 TFSI - 110hp', '1.5 TFSI - 150hp', '1.6 TDI - 95hp', '1.6 TDI - 116hp']
      },
      'a3': {
        '2003-2005': ['1.6 - 102hp', '2.0 FSI - 150hp', '3.2 V6 - 250hp', '1.9 TDI - 105hp', '2.0 TDI - 140hp'],
        '2006-2008': ['1.6 - 102hp', '2.0 FSI - 150hp', '2.0 TFSI - 200hp', '1.9 TDI - 105hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp'],
        '2009-2012': ['1.2 TFSI - 105hp', '1.4 TFSI - 125hp', '1.8 TFSI - 160hp', '2.0 TFSI - 200hp', '1.6 TDI - 105hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp'],
        '2013-2016': ['1.0 TFSI - 115hp', '1.4 TFSI - 125hp', '1.4 TFSI - 150hp', '1.8 TFSI - 180hp', '2.0 TFSI - 190hp', '1.6 TDI - 110hp', '2.0 TDI - 150hp', '2.0 TDI - 184hp'],
        '2017-2020': ['1.0 TFSI - 116hp', '1.5 TFSI - 150hp', '2.0 TFSI - 190hp', '2.0 TFSI - 310hp', '1.6 TDI - 116hp', '2.0 TDI - 150hp', '2.0 TDI - 184hp'],
        '2021-2024': ['1.5 TFSI - 150hp', '2.0 TFSI - 190hp', '2.0 TFSI - 310hp', '2.0 TDI - 150hp', '2.0 TDI - 200hp']
      },
      'a4': {
        '1995-2000': ['1.6 - 100hp', '1.8 - 125hp', '1.8 T - 150hp', '1.8 T - 180hp', '2.4 V6 - 165hp', '1.9 TDI - 90hp', '1.9 TDI - 110hp', '2.5 TDI - 150hp'],
        '2001-2004': ['1.8 T - 163hp', '2.0 - 130hp', '3.0 V6 - 220hp', '1.9 TDI - 130hp', '2.5 TDI - 155hp'],
        '2005-2008': ['1.8 T - 163hp', '2.0 - 130hp', '3.0 V6 - 220hp', '1.9 TDI - 116hp', '2.0 TDI - 140hp', '2.7 TDI - 180hp', '3.0 TDI - 204hp'],
        '2009-2012': ['1.8 TFSI - 120hp', '1.8 TFSI - 160hp', '2.0 TFSI - 180hp', '2.0 TFSI - 211hp', '2.0 TDI - 143hp', '2.0 TDI - 170hp', '3.0 TDI - 240hp'],
        '2013-2016': ['1.8 TFSI - 170hp', '2.0 TFSI - 225hp', '2.0 TFSI - 252hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '3.0 TDI - 218hp', '3.0 TDI - 272hp'],
        '2017-2019': ['1.4 TFSI - 150hp', '2.0 TFSI - 190hp', '2.0 TFSI - 252hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '3.0 TDI - 218hp', '3.0 TDI - 286hp'],
        '2020-2024': ['2.0 TFSI - 204hp', '2.0 TFSI - 265hp', '2.0 TDI - 163hp', '2.0 TDI - 204hp', '3.0 TDI - 231hp']
      },
      'a5': {
        '2007-2011': ['1.8 TFSI - 170hp', '2.0 TFSI - 180hp', '2.0 TFSI - 211hp', '3.0 TFSI - 272hp', '2.0 TDI - 143hp', '2.0 TDI - 170hp', '2.7 TDI - 190hp', '3.0 TDI - 240hp'],
        '2012-2016': ['1.8 TFSI - 170hp', '2.0 TFSI - 225hp', '3.0 TFSI - 272hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '3.0 TDI - 218hp', '3.0 TDI - 245hp'],
        '2017-2024': ['2.0 TFSI - 190hp', '2.0 TFSI - 252hp', '3.0 TFSI - 354hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '3.0 TDI - 286hp']
      },
      'a6': {
        '2005-2010': ['2.0 TFSI - 170hp', '2.8 FSI - 220hp', '3.0 TFSI - 290hp', '4.2 V8 - 350hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp', '2.7 TDI - 180hp', '3.0 TDI - 225hp', '3.0 TDI - 240hp'],
        '2011-2014': ['2.0 TFSI - 180hp', '2.0 TFSI - 211hp', '2.8 FSI - 220hp', '3.0 TFSI - 300hp', '2.0 TDI - 177hp', '3.0 TDI - 204hp', '3.0 TDI - 245hp', '3.0 TDI - 313hp'],
        '2015-2018': ['1.8 TFSI - 190hp', '2.0 TFSI - 252hp', '3.0 TFSI - 333hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '3.0 TDI - 218hp', '3.0 TDI - 272hp', '3.0 TDI - 320hp'],
        '2019-2024': ['2.0 TFSI - 204hp', '3.0 TFSI - 340hp', '2.0 TDI - 163hp', '2.0 TDI - 204hp', '3.0 TDI - 231hp', '3.0 TDI - 286hp']
      },
      'q2': {
        '2016-2024': ['1.0 TFSI - 116hp', '1.4 TFSI - 150hp', '2.0 TFSI - 190hp', '1.6 TDI - 116hp', '2.0 TDI - 150hp']
      },
      'q3': {
        '2011-2014': ['1.4 TFSI - 150hp', '2.0 TFSI - 170hp', '2.0 TFSI - 211hp', '2.0 TDI - 140hp', '2.0 TDI - 177hp'],
        '2015-2018': ['1.4 TFSI - 125hp', '1.4 TFSI - 150hp', '2.0 TFSI - 180hp', '2.0 TFSI - 230hp', '1.6 TDI - 116hp', '2.0 TDI - 150hp', '2.0 TDI - 184hp'],
        '2019-2024': ['1.5 TFSI - 150hp', '2.0 TFSI - 190hp', '2.0 TFSI - 230hp', '2.0 TDI - 150hp', '2.0 TDI - 200hp']
      },
      'q5': {
        '2009-2012': ['2.0 TFSI - 211hp', '3.0 TFSI - 272hp', '2.0 TDI - 143hp', '2.0 TDI - 170hp', '3.0 TDI - 240hp'],
        '2013-2016': ['2.0 TFSI - 220hp', '2.0 TFSI - 230hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '3.0 TDI - 258hp'],
        '2017-2024': ['2.0 TFSI - 252hp', '3.0 TFSI - 354hp', '2.0 TDI - 190hp', '3.0 TDI - 286hp']
      },
      'q7': {
        '2006-2009': ['3.0 TFSI - 272hp', '3.6 FSI - 280hp', '4.2 FSI - 350hp', '3.0 TDI - 233hp', '4.2 TDI - 326hp', '6.0 TDI - 500hp'],
        '2010-2015': ['3.0 TFSI - 272hp', '3.0 TFSI - 333hp', '3.0 TDI - 204hp', '3.0 TDI - 245hp', '4.2 TDI - 340hp'],
        '2016-2019': ['2.0 TFSI - 252hp', '3.0 TFSI - 333hp', '3.0 TDI - 218hp', '3.0 TDI - 272hp'],
        '2020-2024': ['3.0 TFSI - 340hp', '3.0 TDI - 231hp', '3.0 TDI - 286hp', '4.0 TDI - 435hp']
      },
      'q8': {
        '2019-2024': ['3.0 TFSI - 340hp', '4.0 TFSI SQ8 - 507hp', '3.0 TDI - 231hp', '3.0 TDI - 286hp', '4.0 TDI - 435hp']
      },
      'tt': {
        '1999-2005': ['1.8 T - 180hp', '1.8 T - 225hp', '3.2 V6 - 250hp'],
        '2006-2014': ['1.8 TFSI - 160hp', '2.0 TFSI - 200hp', '2.0 TFSI - 211hp', '3.2 V6 - 250hp', '2.0 TDI - 170hp'],
        '2015-2024': ['2.0 TFSI - 230hp', '2.0 TFSI - 306hp', '2.5 TFSI - 400hp']
      }
    },
    'volkswagen': {
      'polo': {
        '2002-2009': ['1.2 - 55hp', '1.2 - 64hp', '1.4 - 75hp', '1.6 - 105hp', '1.4 TDI - 70hp', '1.4 TDI - 80hp', '1.9 TDI - 100hp', '1.9 TDI - 130hp'],
        '2010-2017': ['1.0 - 60hp', '1.0 - 75hp', '1.2 - 60hp', '1.2 - 70hp', '1.2 TSI - 90hp', '1.2 TSI - 110hp', '1.4 TSI GTI - 180hp', '1.2 TDI - 75hp', '1.6 TDI - 90hp', '1.6 TDI - 105hp'],
        '2018-2024': ['1.0 - 65hp', '1.0 - 80hp', '1.0 TSI - 95hp', '1.0 TSI - 110hp', '1.5 TSI - 150hp', '2.0 TSI GTI - 207hp', '1.6 TDI - 80hp', '1.6 TDI - 95hp']
      },
      'golf': {
        '1998-2003': ['1.4 - 75hp', '1.6 - 100hp', '1.6 - 105hp', '1.8 - 125hp', '1.8 T GTI - 150hp', '1.8 T GTI - 180hp', '2.0 - 115hp', '2.3 V5 - 150hp', '2.8 VR6 - 204hp', '3.2 R32 - 241hp', '1.9 SDI - 68hp', '1.9 TDI - 90hp', '1.9 TDI - 110hp', '1.9 TDI - 115hp', '1.9 TDI - 130hp', '1.9 TDI - 150hp'],
        '2004-2008': ['1.4 - 75hp', '1.4 - 80hp', '1.6 - 102hp', '1.6 FSI - 115hp', '2.0 FSI - 150hp', '2.0 GTI - 200hp', '3.2 R32 - 250hp', '1.9 TDI - 90hp', '1.9 TDI - 105hp', '2.0 TDI - 140hp', '2.0 GTD - 170hp'],
        '2009-2012': ['1.2 TSI - 85hp', '1.2 TSI - 105hp', '1.4 - 80hp', '1.4 TSI - 122hp', '1.4 TSI - 160hp', '1.6 - 102hp', '2.0 TSI GTI - 210hp', '2.5 R - 270hp', '1.6 TDI - 90hp', '1.6 TDI - 105hp', '2.0 TDI - 110hp', '2.0 TDI - 140hp', '2.0 GTD - 170hp'],
        '2013-2016': ['1.0 TSI - 85hp', '1.2 TSI - 85hp', '1.2 TSI - 105hp', '1.2 TSI - 110hp', '1.4 TSI - 125hp', '1.4 TSI - 140hp', '1.4 TSI - 150hp', '1.6 - 110hp', '2.0 TSI GTI - 220hp', '2.0 TSI GTI Performance - 230hp', '2.0 TSI R - 300hp', '1.6 TDI - 90hp', '1.6 TDI - 105hp', '1.6 TDI - 110hp', '2.0 TDI - 110hp', '2.0 TDI - 150hp', '2.0 GTD - 184hp'],
        '2017-2020': ['1.0 TSI - 85hp', '1.0 TSI - 90hp', '1.0 TSI - 110hp', '1.0 TSI - 115hp', '1.4 TSI - 125hp', '1.5 TSI - 130hp', '1.5 TSI - 150hp', '1.6 - 110hp', '2.0 TSI GTI - 230hp', '2.0 TSI GTI Performance - 245hp', '2.0 TSI R - 310hp', '1.6 TDI - 115hp', '2.0 TDI - 115hp', '2.0 TDI - 150hp', '2.0 GTD - 200hp'],
        '2021-2024': ['1.0 eTSI - 110hp', '1.5 eTSI - 130hp', '1.5 eTSI - 150hp', '2.0 TSI GTI - 245hp', '2.0 TSI R - 320hp', '2.0 TDI - 115hp', '2.0 TDI - 150hp', '2.0 GTD - 200hp']
      },
      'jetta': {
        '2006-2010': ['1.4 TSI - 122hp', '1.6 - 102hp', '2.0 FSI - 150hp', '2.0 TSI - 200hp', '1.9 TDI - 105hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp'],
        '2011-2018': ['1.2 TSI - 105hp', '1.4 TSI - 122hp', '1.4 TSI - 150hp', '1.6 - 110hp', '1.8 TSI - 170hp', '2.0 TSI - 200hp', '1.6 TDI - 105hp', '2.0 TDI - 140hp', '2.0 TDI - 150hp'],
        '2019-2024': ['1.0 TSI - 110hp', '1.4 TSI - 150hp', '1.5 TSI - 150hp', '2.0 TSI GLI - 228hp', '1.6 TDI - 115hp', '2.0 TDI - 150hp']
      },
      'passat': {
        '1997-2005': ['1.6 - 102hp', '1.8 - 125hp', '1.8 T - 150hp', '1.8 T - 170hp', '2.0 - 115hp', '2.3 V5 - 150hp', '2.8 V6 - 193hp', '4.0 W8 - 275hp', '1.9 TDI - 90hp', '1.9 TDI - 101hp', '1.9 TDI - 110hp', '1.9 TDI - 130hp', '2.0 TDI - 136hp', '2.5 TDI - 150hp', '2.5 TDI V6 - 163hp'],
        '2005-2010': ['1.4 TSI - 122hp', '1.6 - 102hp', '1.8 TSI - 160hp', '2.0 FSI - 150hp', '2.0 TSI - 200hp', '3.2 V6 - 250hp', '3.6 V6 - 300hp', '1.6 TDI - 105hp', '1.9 TDI - 105hp', '2.0 TDI - 110hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp'],
        '2011-2014': ['1.4 TSI - 122hp', '1.8 TSI - 152hp', '1.8 TSI - 160hp', '2.0 TSI - 210hp', '3.6 V6 - 300hp', '1.6 TDI - 105hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp', '2.0 TDI - 177hp'],
        '2015-2019': ['1.4 TSI - 125hp', '1.8 TSI - 180hp', '2.0 TSI - 220hp', '2.0 TSI - 280hp', '1.6 TDI - 120hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '2.0 TDI BiTurbo - 240hp'],
        '2020-2024': ['1.5 TSI - 150hp', '2.0 TSI - 190hp', '2.0 TDI - 122hp', '2.0 TDI - 150hp', '2.0 TDI - 200hp']
      },
      'tiguan': {
        '2008-2011': ['1.4 TSI - 150hp', '2.0 TSI - 170hp', '2.0 TSI - 200hp', '2.0 TDI - 140hp', '2.0 TDI - 170hp'],
        '2012-2016': ['1.4 TSI - 122hp', '1.4 TSI - 125hp', '1.4 TSI - 150hp', '2.0 TSI - 180hp', '2.0 TSI - 220hp', '2.0 TDI - 110hp', '2.0 TDI - 140hp', '2.0 TDI - 150hp', '2.0 TDI - 177hp', '2.0 TDI - 184hp'],
        '2017-2020': ['1.4 TSI - 125hp', '1.4 TSI - 150hp', '1.5 TSI - 150hp', '2.0 TSI - 180hp', '2.0 TSI - 220hp', '2.0 TDI - 115hp', '2.0 TDI - 150hp', '2.0 TDI - 190hp', '2.0 TDI BiTurbo - 240hp'],
        '2021-2024': ['1.5 TSI - 130hp', '1.5 TSI - 150hp', '2.0 TSI - 190hp', '2.0 TSI - 245hp', '2.0 TDI - 122hp', '2.0 TDI - 150hp', '2.0 TDI - 200hp']
      },
      't-roc': {
        '2018-2024': ['1.0 TSI - 110hp', '1.0 TSI - 115hp', '1.5 TSI - 150hp', '2.0 TSI - 190hp', '1.6 TDI - 115hp', '2.0 TDI - 150hp']
      },
      't-cross': {
        '2019-2024': ['1.0 TSI - 95hp', '1.0 TSI - 110hp', '1.5 TSI - 150hp']
      },
      'touareg': {
        '2003-2010': ['3.2 V6 - 241hp', '3.6 V6 - 280hp', '4.2 V8 - 310hp', '6.0 W12 - 450hp', '2.5 TDI - 174hp', '3.0 TDI - 225hp', '5.0 V10 TDI - 313hp'],
        '2011-2018': ['3.0 TFSI - 333hp', '4.2 V8 TDI - 340hp', '3.0 TDI - 204hp', '3.0 TDI - 245hp', '4.2 TDI - 340hp'],
        '2019-2024': ['3.0 TFSI - 340hp', '4.0 TFSI - 462hp', '3.0 TDI - 231hp', '3.0 TDI - 286hp', '4.0 TDI - 421hp']
      },
      'caddy': {
        '2004-2010': ['1.4 - 75hp', '1.6 - 102hp', '2.0 - 115hp', '1.9 TDI - 75hp', '1.9 TDI - 105hp', '2.0 TDI - 140hp'],
        '2011-2015': ['1.2 TSI - 85hp', '1.6 - 102hp', '1.6 TDI - 75hp', '1.6 TDI - 102hp', '2.0 TDI - 110hp', '2.0 TDI - 140hp'],
        '2016-2020': ['1.0 TSI - 102hp', '1.4 TSI - 125hp', '1.6 TDI - 75hp', '1.6 TDI - 102hp', '2.0 TDI - 122hp', '2.0 TDI - 150hp'],
        '2021-2024': ['1.5 TSI - 114hp', '2.0 TDI - 75hp', '2.0 TDI - 102hp', '2.0 TDI - 122hp']
      },
      'transporter': {
        '2004-2009': ['1.9 TDI - 84hp', '1.9 TDI - 102hp', '2.0 - 115hp', '2.5 TDI - 130hp', '2.5 TDI - 174hp'],
        '2010-2015': ['2.0 - 115hp', '2.0 TSI - 204hp', '2.0 TDI - 84hp', '2.0 TDI - 102hp', '2.0 TDI - 114hp', '2.0 TDI - 140hp', '2.0 TDI - 180hp'],
        '2016-2019': ['2.0 TSI - 150hp', '2.0 TSI - 204hp', '2.0 TDI - 84hp', '2.0 TDI - 102hp', '2.0 TDI - 150hp', '2.0 TDI - 204hp'],
        '2020-2024': ['2.0 TSI - 204hp', '2.0 TDI - 90hp', '2.0 TDI - 110hp', '2.0 TDI - 150hp', '2.0 TDI - 199hp']
      }
    },
    'bmw': {
      '1-series': {
        '2004-2007': ['1.6 116i - 115hp', '2.0 118i - 129hp', '2.0 120i - 150hp', '3.0 130i - 265hp', '2.0 118d - 122hp', '2.0 120d - 163hp'],
        '2008-2011': ['2.0 116i - 122hp', '2.0 118i - 143hp', '2.0 120i - 170hp', '3.0 130i - 265hp', '2.0 116d - 115hp', '2.0 118d - 143hp', '2.0 120d - 177hp'],
        '2012-2019': ['1.5 116i - 136hp', '2.0 118i - 136hp', '2.0 120i - 184hp', '3.0 M140i - 340hp', '1.5 116d - 116hp', '2.0 118d - 150hp', '2.0 120d - 190hp'],
        '2020-2024': ['1.5 118i - 140hp', '2.0 120i - 178hp', '2.0 M135i - 306hp', '2.0 118d - 150hp', '2.0 120d - 190hp']
      },
      '2-series': {
        '2014-2021': ['1.5 218i - 136hp', '2.0 220i - 192hp', '3.0 M240i - 340hp', '1.5 216d - 116hp', '2.0 218d - 150hp', '2.0 220d - 190hp'],
        '2022-2024': ['2.0 220i - 184hp', '3.0 M240i - 374hp', '2.0 220d - 190hp']
      },
      '3-series': {
        '1999-2005': ['1.8 316i - 105hp', '1.9 318i - 118hp', '2.0 320i - 150hp', '2.2 320i - 170hp', '2.5 323i - 170hp', '2.5 325i - 192hp', '2.8 328i - 193hp', '3.0 330i - 231hp', '2.0 318d - 116hp', '2.0 320d - 136hp', '2.0 320d - 150hp', '3.0 330d - 184hp', '3.0 330d - 204hp'],
        '2006-2011': ['2.0 316i - 122hp', '2.0 318i - 129hp', '2.0 318i - 143hp', '2.0 320i - 150hp', '2.0 320i - 170hp', '2.5 325i - 218hp', '3.0 330i - 258hp', '3.0 330i - 272hp', '2.0 318d - 122hp', '2.0 318d - 143hp', '2.0 320d - 163hp', '2.0 320d - 177hp', '2.0 320d - 184hp', '3.0 325d - 197hp', '3.0 330d - 231hp', '3.0 330d - 245hp'],
        '2012-2018': ['1.6 316i - 136hp', '2.0 318i - 136hp', '2.0 320i - 184hp', '2.0 328i - 245hp', '3.0 335i - 306hp', '2.0 316d - 116hp', '2.0 318d - 143hp', '2.0 318d - 150hp', '2.0 320d - 163hp', '2.0 320d - 184hp', '2.0 320d - 190hp', '3.0 325d - 218hp', '3.0 330d - 258hp', '3.0 335d - 313hp'],
        '2019-2024': ['2.0 318i - 156hp', '2.0 320i - 184hp', '2.0 330i - 258hp', '3.0 M340i - 374hp', '2.0 318d - 150hp', '2.0 320d - 190hp', '3.0 330d - 286hp', '3.0 M340d - 340hp']
      },
      '4-series': {
        '2014-2020': ['2.0 418i - 136hp', '2.0 420i - 184hp', '2.0 428i - 245hp', '3.0 435i - 306hp', '2.0 418d - 150hp', '2.0 420d - 190hp', '3.0 430d - 258hp', '3.0 435d - 313hp'],
        '2021-2024': ['2.0 420i - 184hp', '2.0 430i - 258hp', '3.0 M440i - 374hp', '2.0 420d - 190hp', '3.0 430d - 286hp']
      },
      '5-series': {
        '1997-2003': ['2.0 520i - 150hp', '2.2 520i - 170hp', '2.5 523i - 170hp', '2.5 525i - 192hp', '2.8 528i - 193hp', '3.0 530i - 231hp', '4.4 540i - 286hp', '2.5 525d - 163hp', '3.0 530d - 184hp', '3.0 530d - 193hp'],
        '2004-2010': ['2.0 520i - 170hp', '2.5 523i - 190hp', '3.0 525i - 218hp', '3.0 530i - 258hp', '3.0 530i - 272hp', '4.8 550i - 367hp', '2.0 520d - 163hp', '2.0 520d - 177hp', '3.0 525d - 197hp', '3.0 530d - 218hp', '3.0 530d - 235hp', '3.0 535d - 286hp'],
        '2011-2016': ['2.0 520i - 184hp', '2.0 528i - 245hp', '3.0 530i - 258hp', '3.0 535i - 306hp', '4.4 550i - 449hp', '2.0 518d - 150hp', '2.0 520d - 184hp', '2.0 520d - 190hp', '3.0 525d - 218hp', '3.0 530d - 258hp', '3.0 535d - 313hp'],
        '2017-2023': ['2.0 520i - 184hp', '2.0 530i - 252hp', '3.0 540i - 340hp', '4.4 M550i - 530hp', '2.0 520d - 190hp', '3.0 530d - 265hp', '3.0 540d - 320hp', '3.0 M550d - 400hp'],
        '2024': ['2.0 520i - 184hp', '2.0 530i - 252hp', '3.0 540i - 340hp', '2.0 520d - 190hp', '3.0 530d - 286hp']
      },
      '7-series': {
        '2002-2008': ['3.0 730i - 231hp', '3.6 735i - 272hp', '4.4 745i - 333hp', '6.0 760i - 445hp', '3.0 730d - 218hp', '3.0 730d - 231hp', '4.0 740d - 258hp'],
        '2009-2015': ['3.0 730i - 258hp', '3.0 740i - 326hp', '4.4 750i - 407hp', '6.0 760i - 544hp', '3.0 730d - 245hp', '3.0 740d - 306hp', '3.0 750d - 381hp'],
        '2016-2022': ['2.0 730i - 258hp', '3.0 740i - 326hp', '4.4 750i - 450hp', '6.6 M760i - 585hp', '3.0 730d - 265hp', '3.0 740d - 320hp', '3.0 750d - 400hp'],
        '2023-2024': ['3.0 740i - 380hp', '4.4 760i - 544hp', '3.0 740d - 300hp']
      },
      'x1': {
        '2009-2015': ['2.0 18i - 150hp', '2.0 20i - 184hp', '3.0 28i - 245hp', '2.0 18d - 143hp', '2.0 20d - 177hp', '2.0 20d - 184hp', '2.0 23d - 204hp'],
        '2016-2022': ['1.5 18i - 140hp', '2.0 20i - 192hp', '2.0 25i - 231hp', '1.5 18d - 150hp', '2.0 20d - 190hp', '2.0 25d - 231hp'],
        '2023-2024': ['1.5 18i - 136hp', '2.0 20i - 204hp', '2.0 18d - 150hp', '2.0 20d - 163hp']
      },
      'x3': {
        '2004-2010': ['2.0 xDrive20i - 150hp', '2.5 xDrive25i - 218hp', '3.0 xDrive30i - 258hp', '3.0 xDrive30i - 272hp', '2.0 xDrive18d - 143hp', '2.0 xDrive20d - 177hp', '3.0 xDrive30d - 218hp', '3.0 xDrive30d - 235hp'],
        '2011-2017': ['2.0 xDrive20i - 184hp', '2.0 xDrive28i - 245hp', '3.0 xDrive35i - 306hp', '2.0 xDrive18d - 143hp', '2.0 xDrive18d - 150hp', '2.0 xDrive20d - 184hp', '2.0 xDrive20d - 190hp', '3.0 xDrive30d - 258hp', '3.0 xDrive35d - 313hp'],
        '2018-2024': ['2.0 xDrive20i - 184hp', '2.0 xDrive30i - 252hp', '3.0 M40i - 360hp', '2.0 xDrive18d - 150hp', '2.0 xDrive20d - 190hp', '3.0 xDrive30d - 286hp', '3.0 M40d - 340hp']
      },
      'x5': {
        '2000-2006': ['3.0 3.0i - 231hp', '4.4 4.4i - 286hp', '4.6 4.6is - 347hp', '4.8 4.8is - 360hp', '3.0 3.0d - 184hp', '3.0 3.0d - 218hp'],
        '2007-2013': ['3.0 xDrive30i - 272hp', '4.8 xDrive48i - 355hp', '3.0 xDrive30d - 235hp', '3.0 xDrive30d - 245hp', '3.0 xDrive35d - 286hp'],
        '2014-2018': ['2.0 xDrive25d - 218hp', '3.0 xDrive30d - 258hp', '3.0 xDrive40d - 313hp', '3.0 M50d - 381hp', '2.0 xDrive35i - 306hp', '3.0 xDrive40e - 313hp', '4.4 xDrive50i - 450hp'],
        '2019-2024': ['3.0 xDrive40i - 340hp', '4.4 xDrive50i - 530hp', '3.0 xDrive30d - 265hp', '3.0 xDrive30d - 286hp', '3.0 xDrive40d - 340hp', '3.0 M50d - 400hp']
      }
    },
    'ford': {
      'fiesta': {
        '2002-2008': ['1.25 - 75hp', '1.3 - 60hp', '1.3 - 70hp', '1.4 - 80hp', '1.6 - 100hp', '2.0 ST - 150hp', '1.4 TDCi - 68hp', '1.6 TDCi - 90hp', '1.6 TDCi - 110hp'],
        '2009-2012': ['1.25 - 60hp', '1.25 - 82hp', '1.4 - 96hp', '1.6 - 120hp', '1.6 ST - 120hp', '1.6 ST - 182hp', '1.4 TDCi - 68hp', '1.4 TDCi - 70hp', '1.6 TDCi - 75hp', '1.6 TDCi - 90hp', '1.6 TDCi - 95hp'],
        '2013-2017': ['1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.0 EcoBoost - 140hp', '1.25 - 60hp', '1.25 - 82hp', '1.6 ST - 182hp', '1.5 TDCi - 75hp', '1.5 TDCi - 95hp', '1.6 TDCi - 95hp'],
        '2018-2023': ['1.0 EcoBoost - 85hp', '1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.0 EcoBoost - 140hp', '1.5 EcoBoost ST - 200hp', '1.5 TDCi - 85hp', '1.5 TDCi - 120hp']
      },
      'focus': {
        '1999-2004': ['1.4 - 75hp', '1.6 - 100hp', '1.8 - 115hp', '2.0 - 130hp', '1.8 TDCi - 100hp', '1.8 TDCi - 115hp'],
        '2005-2010': ['1.4 - 80hp', '1.6 - 100hp', '1.8 - 125hp', '2.0 - 145hp', '2.5 ST - 225hp', '1.6 TDCi - 90hp', '1.6 TDCi - 109hp', '1.8 TDCi - 115hp', '2.0 TDCi - 136hp'],
        '2011-2014': ['1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.6 - 85hp', '1.6 - 105hp', '1.6 - 125hp', '2.0 - 150hp', '2.0 ST - 250hp', '1.6 TDCi - 95hp', '1.6 TDCi - 105hp', '1.6 TDCi - 115hp', '2.0 TDCi - 140hp', '2.0 TDCi - 163hp'],
        '2015-2018': ['1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.5 EcoBoost - 150hp', '1.5 EcoBoost - 182hp', '2.0 - 150hp', '2.3 EcoBoost RS - 350hp', '1.5 TDCi - 95hp', '1.5 TDCi - 105hp', '1.5 TDCi - 120hp', '1.6 TDCi - 115hp', '2.0 TDCi - 150hp', '2.0 TDCi - 185hp'],
        '2019-2024': ['1.0 EcoBoost - 85hp', '1.0 EcoBoost - 100hp', '1.0 EcoBoost - 125hp', '1.5 EcoBoost - 150hp', '1.5 EcoBoost - 182hp', '2.3 EcoBoost ST - 280hp', '1.5 EcoBlue - 95hp', '1.5 EcoBlue - 120hp', '2.0 EcoBlue - 150hp', '2.0 EcoBlue ST - 190hp']
      },
      'mondeo': {
        '2001-2007': ['1.8 - 125hp', '2.0 - 145hp', '2.5 V6 - 170hp', '3.0 V6 ST220 - 226hp', '2.0 TDCi - 115hp', '2.0 TDCi - 130hp', '2.2 TDCi - 155hp'],
        '2008-2014': ['1.6 - 110hp', '1.6 - 125hp', '1.6 EcoBoost - 160hp', '2.0 - 145hp', '2.0 EcoBoost - 203hp', '2.5 - 220hp', '1.6 TDCi - 115hp', '2.0 TDCi - 115hp', '2.0 TDCi - 140hp', '2.0 TDCi - 163hp', '2.2 TDCi - 175hp', '2.2 TDCi - 200hp'],
        '2015-2022': ['1.0 EcoBoost - 125hp', '1.5 EcoBoost - 160hp', '1.5 EcoBoost - 165hp', '2.0 EcoBoost - 240hp', '1.5 TDCi - 120hp', '2.0 TDCi - 150hp', '2.0 TDCi - 180hp', '2.0 TDCi - 190hp']
      },
      'kuga': {
        '2008-2012': ['1.6 EcoBoost - 150hp', '2.0 - 145hp', '2.5 - 200hp', '2.0 TDCi - 136hp', '2.0 TDCi - 140hp', '2.0 TDCi - 163hp'],
        '2013-2019': ['1.5 EcoBoost - 120hp', '1.5 EcoBoost - 150hp', '1.5 EcoBoost - 182hp', '2.0 EcoBoost - 240hp', '1.5 TDCi - 88hp', '1.5 TDCi - 95hp', '1.5 TDCi - 120hp', '2.0 TDCi - 120hp', '2.0 TDCi - 150hp', '2.0 TDCi - 163hp', '2.0 TDCi - 180hp'],
        '2020-2024': ['1.5 EcoBoost - 120hp', '1.5 EcoBoost - 150hp', '2.0 EcoBoost - 190hp', '2.5 PHEV - 225hp', '1.5 EcoBlue - 120hp', '2.0 EcoBlue - 120hp', '2.0 EcoBlue - 150hp', '2.0 EcoBlue - 190hp']
      },
      'mustang': {
        '2015-2017': ['2.3 EcoBoost - 317hp', '5.0 GT V8 - 421hp'],
        '2018-2023': ['2.3 EcoBoost - 290hp', '5.0 GT V8 - 450hp', '5.2 Shelby GT500 - 760hp'],
        '2024': ['2.3 EcoBoost - 315hp', '5.0 GT V8 - 486hp']
      },
      'ranger': {
        '2007-2011': ['2.5 TDCi - 143hp', '3.0 TDCi - 156hp'],
        '2012-2015': ['2.2 TDCi - 125hp', '2.2 TDCi - 150hp', '3.2 TDCi - 200hp'],
        '2016-2022': ['2.0 EcoBlue - 130hp', '2.0 EcoBlue - 170hp', '2.0 EcoBlue - 213hp', '3.2 TDCi - 200hp'],
        '2023-2024': ['2.0 EcoBlue - 170hp', '3.0 EcoBoost V6 - 288hp']
      },
      'transit-custom': {
        '2013-2018': ['2.2 TDCi - 100hp', '2.2 TDCi - 125hp', '2.2 TDCi - 155hp'],
        '2019-2024': ['2.0 EcoBlue - 105hp', '2.0 EcoBlue - 130hp', '2.0 EcoBlue - 170hp', '2.0 EcoBlue - 185hp']
      },
      'transit': {
        '2006-2013': ['2.2 TDCi - 110hp', '2.2 TDCi - 125hp', '2.2 TDCi - 140hp', '2.4 TDCi - 115hp', '2.4 TDCi - 140hp', '3.2 TDCi - 200hp'],
        '2014-2019': ['2.0 EcoBlue - 105hp', '2.0 EcoBlue - 130hp', '2.0 EcoBlue - 170hp', '2.2 TDCi - 125hp', '2.2 TDCi - 155hp'],
        '2020-2024': ['2.0 EcoBlue - 105hp', '2.0 EcoBlue - 130hp', '2.0 EcoBlue - 170hp', '2.0 EcoBlue - 185hp']
      },
      'puma': {
        '2020-2024': ['1.0 EcoBoost - 125hp', '1.0 EcoBoost - 155hp', '1.5 EcoBoost ST - 200hp']
      }
    },
    'mercedes': {
      'a-class': {
        '2013-2018': ['1.6 A180 - 122hp', '2.0 A200 - 156hp', '2.0 A250 - 211hp', '2.0 A45 AMG - 360hp', '1.5 A180d - 109hp', '2.1 A200d - 136hp', '2.1 A220d - 177hp'],
        '2019-2024': ['1.3 A180 - 136hp', '2.0 A200 - 163hp', '2.0 A250 - 224hp', '2.0 A35 AMG - 306hp', '2.0 A45 AMG - 421hp', '1.5 A180d - 116hp', '2.0 A200d - 150hp', '2.0 A220d - 190hp']
      },
      'c-class': {
        '2008-2014': ['1.8 C180 - 156hp', '1.8 C200 - 184hp', '3.5 C350 - 306hp', '6.2 C63 AMG - 457hp', '2.1 C200 CDI - 136hp', '2.1 C220 CDI - 170hp', '3.0 C320 CDI - 231hp'],
        '2015-2021': ['1.6 C160 - 129hp', '2.0 C200 - 184hp', '2.0 C300 - 245hp', '4.0 C63 AMG - 476hp', '1.6 C200d - 136hp', '2.1 C220d - 170hp', '2.1 C300d - 204hp'],
        '2022-2024': ['1.5 C180 - 170hp', '2.0 C200 - 204hp', '2.0 C300 - 258hp', '2.0 C200d - 163hp', '2.0 C220d - 200hp', '3.0 C300d - 265hp']
      },
      'glc': {
        '2016-2019': ['2.0 GLC200 - 184hp', '2.0 GLC250 - 211hp', '2.0 GLC300 - 245hp', '3.0 GLC43 AMG - 367hp', '2.1 GLC220d - 170hp', '2.1 GLC250d - 204hp', '3.0 GLC350d - 258hp'],
        '2020-2024': ['2.0 GLC200 - 197hp', '2.0 GLC300 - 258hp', '3.0 GLC43 AMG - 390hp', '4.0 GLC63 AMG - 476hp', '2.0 GLC200d - 163hp', '2.0 GLC220d - 194hp', '2.0 GLC300d - 245hp']
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

    // Continental/Siemens ECU Types
    continental: {
      // Simos (VW/Audi/Skoda/Seat)
      simos: [
        'Simos6.2', 'Simos6.3',
        'Simos8.2', 'Simos8.3', 'Simos8.4', 'Simos8.5',
        'Simos10.11', 'Simos10.20', 'Simos10.22', 'Simos10.x',
        'Simos12.1', 'Simos12.2',
        'Simos16.11', 'Simos16.21',
        'Simos18.1', 'Simos18.2', 'Simos18.3', 'Simos18.4', 'Simos18.6', 'Simos18.10',
        'Simos19.2', 'Simos19.3', 'Simos19.6', 'Simos19.7', 'Simos19.8'
      ],
      // SID (Diesel)
      sid: ['SID201', 'SID202', 'SID203', 'SID204', 'SID206', 'SID208', 'SID209', 'SID211', 'SID212', 'SID212evo', 'SID213', 'SID301', 'SID305/6', 'SID307', 'SID309', 'SID310', 'SID803', 'SID803A', 'SID806', 'SID807', 'SID807evo', 'SID83A', 'SID83M'],
      // EMS (Engine Management System)
      ems: ['EMS2101', 'EMS2102', 'EMS2103', 'EMS2106', 'EMS2204', 'EMS2205', 'EMS2208', 'EMS2211', 'EMS2301', 'EMS2302', 'EMS24xx', 'EMS2510', 'EMS2511', 'EMS2512', 'EMS2513', 'EMS2701', 'EMS2910', 'EMS2916', 'EMS3110', 'EMS3125', 'EMS3140', 'EMS3141', 'EMS3142', 'EMS3150', 'EMS3155', 'EMS3160', 'EMS3161', 'EMS3180'],
      // SIM2K (Hyundai/Kia)
      sim2k: ['SIM2K-141', 'SIM2K-142', 'SIM2K-240', 'SIM2K-240R', 'SIM2K-241', 'SIM2K-242', 'SIM2K-245', 'SIM2K-250', 'SIM2K-251', 'SIM2K-253', 'SIM2K-259', 'SIM2K-260', 'SIM2K-261', 'SIM2K-305'],
      // GPEC (GM Powertrain)
      gpec: ['GPEC2', 'GPEC2A', 'GPEC3', 'GPEC4', 'GPEC4LM'],
      // Gearbox
      gearbox: ['DL382', 'DL500', 'DL501gen1', 'DL501gen2', 'DL800', 'DQ200', 'DQ200G2', 'DQ250', 'DQ250E', 'DQ250F', 'DQ400E', 'DQ500', 'ASG1'],
      // Valvetronic
      valvetronic: ['V56.12', 'VD56.1']
    },

    // Siemens (BMW specific)
    siemens: {
      bmw: ['MS43', 'MS45', 'MSD80', 'MSD81', 'MSD81.2', 'MSD85', 'MSD87', 'MSS52', 'MSS54', 'MSS54HP', 'MSS60', 'MSS65', 'MSS70', 'MSV70', 'MSV80', 'MSV90'],
      ppd: ['PPD1.x'],
      pcr: ['PCR2.1'],
      simtec: ['SIMTEC76']
    },

    // Delphi ECU Types
    delphi: {
      diesel: ['DCM1.2', 'DCM3.2AP', 'DCM3.4', 'DCM3.4(+)', 'DCM3.5', 'DCM3.7AP', 'DCM6.1', 'DCM6.2A', 'DCM6.2AP', 'DCM6.2AP-6D', 'DCM6.2C', 'DCM6.2V', 'DCM7.1A', 'DCM7.1B', 'CRD3.30', 'CRD3.7A', 'CRD3.N5'],
      motorcycle: ['MT05', 'MT05.2', 'MT05.3', 'MT21M', 'HD1-CAN', 'HD2-CAN', 'HD3-CAN']
    },

    // Marelli ECU Types
    marelli: {
      diesel: ['MJD6', 'MJD8F2', 'MJD8F3', 'MJD9DF'],
      petrol: ['8GMC', '8GMF', 'MK', '8GMK.Fx', '8GML', '8GMW', '8GSF', '8GSW', '9GF', 'IAW'],
      motorcycle: ['11MP']
    },

    // Delco (GM) ECU Types
    delco: {
      all: ['E38', 'E39', 'E39A', 'E67', 'E78', 'E80', 'E81', 'E82', 'E83', 'E84', 'E87', 'E92', 'E98', 'T87', 'T87A', 'T93']
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

  /**
   * HELPER METHODS
   */
  
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
    const mfrData = this.VEHICLE_ENGINE_DATABASE[manufacturer];
    
    if (mfrData && mfrData[modelKey]) {
      return Object.keys(mfrData[modelKey]);
    }
    
    // Fallback year ranges
    return ['2021-2024', '2017-2020', '2013-2016', '2009-2012', '2005-2008', '2000-2004'];
  },

  // Get engines for manufacturer, model, and year
  getEngines: function(manufacturer, model, yearRange) {
    const modelKey = model.toLowerCase().replace(/\s+/g, '-');
    const mfrData = this.VEHICLE_ENGINE_DATABASE[manufacturer];
    
    // Try year-specific engines first
    if (mfrData && mfrData[modelKey] && mfrData[modelKey][yearRange]) {
      return mfrData[modelKey][yearRange];
    }
    
    // Fall back to manufacturer engines
    if (this.MANUFACTURER_ENGINES[manufacturer]) {
      return this.MANUFACTURER_ENGINES[manufacturer];
    }
    
    // Last resort: generic engines
    return this.GENERIC_ENGINES;
  },

  // Export for Node.js API
  getAPIData: function() {
    return {
      models: this.VEHICLE_DATABASE,
      engines: this.MANUFACTURER_ENGINES,
      genericEngines: this.GENERIC_ENGINES,
      yearEngines: this.VEHICLE_ENGINE_DATABASE
    };
  }
};

// Export for use in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CarnageVehicleDB;
}
