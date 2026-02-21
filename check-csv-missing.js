const fs = require('fs');
const db = require('./assets/js/vehicle-database.js');

const csv1 = `Manufacturer,Model,Generation,Years,Engine,Displacement,Fuel,Stock_BHP,Stock_Torque_NM
Ford,Fiesta,Mk6,2002-2008,1.25 Duratec,1.25,Petrol,75,110
Ford,Fiesta,Mk7,2008-2017,1.0 EcoBoost,1.0,Petrol,100,170
Ford,Fiesta,Mk7,2008-2017,1.6 TDCi,1.6,Diesel,95,205
Ford,Fiesta,Mk8,2017-2023,1.0 EcoBoost,1.0,Petrol,125,200
Ford,Focus,Mk2,2004-2011,1.6 Ti-VCT,1.6,Petrol,100,150
Ford,Focus,Mk3,2011-2018,1.5 EcoBoost,1.5,Petrol,150,240
Ford,Focus,Mk3,2011-2018,2.0 TDCi,2.0,Diesel,150,370
Ford,Focus,Mk4,2018-2026,1.0 EcoBoost,1.0,Petrol,155,240
Ford,Transit Custom,Gen1,2012-2018,2.2 TDCi,2.2,Diesel,125,350
Ford,Transit Custom,Gen2,2018-2026,2.0 EcoBlue,2.0,Diesel,170,405
BMW,1 Series,E87,2004-2011,116i,1.6,Petrol,115,150
BMW,1 Series,F20,2011-2019,118d,2.0,Diesel,150,320
BMW,3 Series,E90,2005-2012,320d,2.0,Diesel,163,340
BMW,3 Series,F30,2012-2019,320i,2.0,Petrol,184,270
BMW,3 Series,G20,2019-2026,330i,2.0,Petrol,258,400
BMW,5 Series,F10,2010-2017,520d,2.0,Diesel,190,400
BMW,5 Series,G30,2017-2026,530d,3.0,Diesel,265,620
Audi,A3,8P,2003-2013,1.9 TDI,1.9,Diesel,105,250
Audi,A3,8V,2013-2020,2.0 TDI,2.0,Diesel,150,340
Audi,A3,8Y,2020-2026,1.5 TFSI,1.5,Petrol,150,250
Audi,A4,B7,2004-2008,2.0 TDI,2.0,Diesel,140,320
Audi,A4,B8,2008-2016,2.0 TFSI,2.0,Petrol,211,350
Audi,A4,B9,2016-2026,2.0 TDI,2.0,Diesel,190,400
Audi,A6,C7,2011-2018,3.0 TDI,3.0,Diesel,272,580
Volkswagen,Golf,Mk5,2004-2009,2.0 TDI,2.0,Diesel,140,320
Volkswagen,Golf,Mk6,2009-2013,2.0 TDI,2.0,Diesel,140,320
Volkswagen,Golf,Mk7,2013-2020,2.0 TSI,2.0,Petrol,220,350
Volkswagen,Golf,Mk8,2020-2026,1.5 TSI,1.5,Petrol,150,250
Volkswagen,Passat,B6,2005-2010,2.0 TDI,2.0,Diesel,140,320
Volkswagen,Passat,B8,2014-2026,2.0 TDI,2.0,Diesel,150,340
Vauxhall,Corsa,C,2000-2006,1.2,1.2,Petrol,75,110
Vauxhall,Corsa,D,2006-2014,1.3 CDTi,1.3,Diesel,75,190
Vauxhall,Corsa,E,2014-2019,1.4 Turbo,1.4,Petrol,100,200
Vauxhall,Corsa,F,2019-2026,1.2 Turbo,1.2,Petrol,130,230
Vauxhall,Astra,H,2004-2010,1.9 CDTi,1.9,Diesel,150,320
Vauxhall,Astra,J,2010-2015,2.0 CDTi,2.0,Diesel,165,380
Vauxhall,Astra,K,2015-2022,1.6 CDTi,1.6,Diesel,136,320
Mercedes-Benz,C-Class,W204,2007-2014,C220 CDI,2.1,Diesel,170,400
Mercedes-Benz,C-Class,W205,2014-2021,C300,2.0,Petrol,258,370
Mercedes-Benz,E-Class,W212,2009-2016,E220 CDI,2.1,Diesel,170,400
Mercedes-Benz,E-Class,W213,2016-2026,E350d,3.0,Diesel,286,600
Toyota,Corolla,E120,2001-2007,1.6 VVT-i,1.6,Petrol,110,150
Toyota,Corolla,E210,2019-2026,1.8 Hybrid,1.8,Hybrid,122,142
Nissan,Qashqai,J10,2007-2013,1.5 dCi,1.5,Diesel,110,240
Nissan,Qashqai,J11,2013-2021,1.6 dCi,1.6,Diesel,130,320
Nissan,Qashqai,J12,2021-2026,1.3 DIG-T,1.3,Petrol,158,270
Land Rover,Discovery Sport,L550,2014-2026,2.0 TD4,2.0,Diesel,180,430
Jaguar,XE,X760,2015-2024,2.0 Ingenium,2.0,Diesel,180,430
MINI,Hatch,R56,2006-2013,Cooper S,1.6,Petrol,184,240
MINI,Hatch,F56,2014-2026,Cooper S,2.0,Petrol,192,280
Tesla,Model 3,Gen1,2019-2026,Long Range,Electric,Electric,346,510
Hyundai,i30,GD,2012-2017,1.6 CRDi,1.6,Diesel,110,260
Kia,Ceed,CD,2018-2026,1.6 CRDi,1.6,Diesel,136,320
Skoda,Octavia,Mk3,2013-2020,2.0 TDI,2.0,Diesel,150,340
SEAT,Leon,Mk3,2013-2020,2.0 TSI,2.0,Petrol,220,350
Peugeot,308,T9,2013-2021,1.6 BlueHDi,1.6,Diesel,120,300
Renault,Clio,Mk4,2012-2019,1.5 dCi,1.5,Diesel,90,220
Honda,Civic,Mk8,2006-2011,2.2 i-CTDi,2.2,Diesel,140,340
Mazda,3,BM,2013-2019,2.2 Skyactiv-D,2.2,Diesel,150,380
MG,HS,Gen1,2019-2026,1.5 Turbo,1.5,Petrol,162,250
Porsche,Macan,95B,2014-2026,3.0 V6,3.0,Petrol,354,480`;

const csv2 = `Manufacturer,Model,Generation,Years,Engine,Displacement,Fuel,Stock_BHP,Stock_Torque_NM
Ford,Mondeo,Mk4,2007-2014,2.0 TDCi,2.0,Diesel,140,320
Ford,Mondeo,Mk5,2014-2022,2.0 EcoBoost,2.0,Petrol,240,345
Ford,Kuga,Mk1,2008-2012,2.0 TDCi,2.0,Diesel,163,340
Ford,Kuga,Mk2,2012-2019,1.5 EcoBoost,1.5,Petrol,150,240
Ford,Kuga,Mk3,2020-2026,2.0 EcoBlue,2.0,Diesel,190,400
BMW,2 Series,F22,2014-2021,M240i,3.0,Petrol,340,500
BMW,4 Series,F32,2013-2020,420d,2.0,Diesel,190,400
BMW,4 Series,G22,2020-2026,430i,2.0,Petrol,258,400
BMW,X3,F25,2010-2017,20d,2.0,Diesel,190,400
BMW,X3,G01,2017-2026,M40i,3.0,Petrol,360,500
Audi,A1,8X,2010-2018,1.4 TFSI,1.4,Petrol,125,200
Audi,A5,B8,2007-2016,2.0 TDI,2.0,Diesel,177,380
Audi,A5,B9,2016-2026,3.0 TDI,3.0,Diesel,286,620
Audi,Q5,8R,2008-2017,2.0 TDI,2.0,Diesel,170,350
Audi,Q5,FY,2017-2026,45 TFSI,2.0,Petrol,265,370
Volkswagen,Polo,6R,2009-2017,1.2 TSI,1.2,Petrol,105,175
Volkswagen,Polo,AW,2017-2026,1.0 TSI,1.0,Petrol,115,200
Volkswagen,Tiguan,Mk1,2007-2016,2.0 TDI,2.0,Diesel,140,320
Volkswagen,Tiguan,Mk2,2016-2026,2.0 TSI,2.0,Petrol,230,350
Volkswagen,Arteon,Gen1,2017-2026,2.0 BiTDI,2.0,Diesel,240,500
Vauxhall,Insignia,A,2008-2017,2.0 CDTi,2.0,Diesel,160,350
Vauxhall,Insignia,B,2017-2026,2.0 Turbo,2.0,Petrol,200,350
Vauxhall,Mokka,X,2012-2019,1.6 CDTi,1.6,Diesel,136,320
Vauxhall,Mokka,B,2021-2026,1.2 Turbo,1.2,Petrol,130,230
Mercedes-Benz,A-Class,W176,2012-2018,A200 CDI,2.1,Diesel,136,300
Mercedes-Benz,A-Class,W177,2018-2026,A250,2.0,Petrol,224,350
Mercedes-Benz,GLC,X253,2015-2022,220d,2.0,Diesel,170,400
Mercedes-Benz,GLC,X254,2022-2026,300e,2.0,Hybrid,313,550
Toyota,RAV4,XA30,2006-2012,2.2 D-4D,2.2,Diesel,150,340
Toyota,RAV4,XA50,2019-2026,2.5 Hybrid,2.5,Hybrid,222,221
Nissan,Juke,F15,2010-2019,1.6 DIG-T,1.6,Petrol,190,240
Nissan,Juke,F16,2019-2026,1.0 DIG-T,1.0,Petrol,114,200
Land Rover,Range Rover Evoque,L538,2011-2018,2.2 SD4,2.2,Diesel,190,420
Land Rover,Range Rover Evoque,L551,2019-2026,2.0 P300,2.0,Petrol,300,400
Jaguar,XF,X250,2008-2015,3.0d V6,3.0,Diesel,240,500
Jaguar,F-Pace,X761,2016-2026,2.0 D180,2.0,Diesel,180,430
MINI,Countryman,R60,2010-2016,Cooper SD,2.0,Diesel,143,305
MINI,Countryman,F60,2017-2026,John Cooper Works,2.0,Petrol,306,450
Tesla,Model S,Gen1,2014-2021,75D,Electric,Electric,328,525
Tesla,Model Y,Gen1,2021-2026,Long Range,Electric,Electric,384,510
Hyundai,Tucson,TLE,2015-2020,1.7 CRDi,1.7,Diesel,116,280
Hyundai,Tucson,NX4,2021-2026,1.6 T-GDi,1.6,Petrol,180,265
Kia,Sportage,QL,2016-2021,2.0 CRDi,2.0,Diesel,185,400
Kia,Sportage,NQ5,2022-2026,1.6 T-GDi,1.6,Petrol,180,265
Skoda,Superb,Mk3,2015-2023,2.0 TDI,2.0,Diesel,190,400
SEAT,Ateca,Gen1,2016-2026,2.0 TSI,2.0,Petrol,190,320
Peugeot,3008,P84,2017-2026,2.0 BlueHDi,2.0,Diesel,180,400
Renault,Megane,Mk4,2016-2026,1.6 dCi,1.6,Diesel,130,320
Honda,CR-V,Mk4,2012-2018,2.2 i-DTEC,2.2,Diesel,150,350
Mazda,CX-5,KE,2012-2017,2.2 Skyactiv-D,2.2,Diesel,175,420
MG,ZS,Gen1,2018-2026,1.0 Turbo,1.0,Petrol,111,160
Porsche,Cayenne,958,2010-2017,4.2 V8 Diesel,4.2,Diesel,385,850`;

const csv3 = `Manufacturer,Model,Generation,Years,Engine,Displacement,Fuel,Stock_BHP,Stock_Torque_NM
Ford,S-Max,Mk1,2006-2014,2.0 TDCi,2.0,Diesel,140,320
Ford,S-Max,Mk2,2015-2023,2.0 EcoBlue,2.0,Diesel,190,400
Ford,Galaxy,Mk3,2006-2015,1.8 TDCi,1.8,Diesel,125,285
Ford,Ranger,T6,2012-2019,3.2 TDCi,3.2,Diesel,200,470
Ford,Ranger,T6.2,2019-2026,2.0 BiTurbo,2.0,Diesel,213,500
BMW,X1,E84,2009-2015,20d,2.0,Diesel,177,350
BMW,X1,F48,2015-2022,25i,2.0,Petrol,231,350
BMW,X5,E70,2007-2013,30d,3.0,Diesel,245,540
BMW,X5,F15,2013-2018,40d,3.0,Diesel,313,630
BMW,X5,G05,2019-2026,45e,3.0,Hybrid,394,600
Audi,Q3,8U,2011-2018,2.0 TDI,2.0,Diesel,177,380
Audi,Q3,F3,2018-2026,45 TFSI,2.0,Petrol,230,350
Audi,Q7,4L,2006-2015,3.0 TDI,3.0,Diesel,245,550
Audi,Q7,4M,2015-2026,50 TDI,3.0,Diesel,286,600
Volkswagen,Touran,Mk2,2015-2026,1.6 TDI,1.6,Diesel,115,250
Volkswagen,Scirocco,Gen3,2008-2017,2.0 TSI,2.0,Petrol,220,350
Volkswagen,Amarok,Gen1,2011-2022,3.0 V6 TDI,3.0,Diesel,258,580
Vauxhall,Vivaro,B,2014-2019,1.6 CDTi,1.6,Diesel,125,320
Vauxhall,Vivaro,C,2019-2026,2.0 Diesel,2.0,Diesel,150,370
Mercedes-Benz,CLA,C117,2013-2019,220d,2.1,Diesel,177,350
Mercedes-Benz,CLA,C118,2019-2026,35 AMG,2.0,Petrol,306,400
Mercedes-Benz,GLA,X156,2014-2020,200d,2.1,Diesel,136,300
Mercedes-Benz,GLA,H247,2020-2026,250,2.0,Petrol,224,350
Toyota,Avensis,T27,2009-2018,2.0 D-4D,2.0,Diesel,143,320
Toyota,Hilux,AN120,2016-2026,2.4 D-4D,2.4,Diesel,150,400
Nissan,X-Trail,T31,2007-2014,2.0 dCi,2.0,Diesel,173,360
Nissan,X-Trail,T33,2022-2026,1.5 VC-T ePower,1.5,Hybrid,213,330
Land Rover,Discovery,4,2009-2016,3.0 SDV6,3.0,Diesel,255,600
Land Rover,Discovery,5,2017-2026,3.0 D300,3.0,Diesel,300,650
Jaguar,XJ,X351,2010-2019,3.0d V6,3.0,Diesel,275,600
Jaguar,E-Pace,X540,2017-2026,2.0 P250,2.0,Petrol,250,365
MINI,Clubman,F54,2015-2026,Cooper SD,2.0,Diesel,190,400
Tesla,Model X,Gen1,2016-2023,100D,Electric,Electric,417,660
Hyundai,Santa Fe,TM,2018-2026,2.2 CRDi,2.2,Diesel,200,440
Kia,Sorento,UM,2015-2020,2.2 CRDi,2.2,Diesel,200,441
Kia,Sorento,MQ4,2020-2026,1.6 T-GDi Hybrid,1.6,Hybrid,230,350
Skoda,Kodiaq,NS7,2017-2026,2.0 TDI,2.0,Diesel,200,400
SEAT,Ibiza,6J,2008-2017,1.4 TDI,1.4,Diesel,105,250
Peugeot,508,R8,2018-2026,1.5 BlueHDi,1.5,Diesel,130,300
Renault,Kadjar,Gen1,2015-2022,1.5 dCi,1.5,Diesel,110,260
Honda,Accord,Mk7,2003-2008,2.2 i-CTDi,2.2,Diesel,140,340
Mazda,6,GJ,2013-2023,2.2 Skyactiv-D,2.2,Diesel,184,445
MG,MG5,Gen1,2020-2026,61kWh,Electric,Electric,156,260
Porsche,Panamera,971,2016-2026,4.0 V8 Turbo,4.0,Petrol,550,770
Volvo,S60,P3,2010-2018,D4,2.0,Diesel,190,400
Volvo,XC60,SPA,2017-2026,B5,2.0,Hybrid,250,350
Subaru,Impreza,GE/GH,2007-2011,2.5 WRX,2.5,Petrol,230,320
Mitsubishi,L200,Series5,2015-2026,2.4 DI-D,2.4,Diesel,181,430
Alfa Romeo,Giulia,952,2016-2026,2.2 JTDm,2.2,Diesel,190,450
Citroen,C5 Aircross,Gen1,2018-2026,2.0 BlueHDi,2.0,Diesel,180,400
DS,DS7 Crossback,Gen1,2018-2026,1.6 PureTech,1.6,Petrol,225,300
Cupra,Formentor,Gen1,2020-2026,2.0 TSI,2.0,Petrol,310,400`;

const csv4 = `Manufacturer,Model,Generation,Years,Engine,Displacement,Fuel,Stock_BHP,Stock_Torque_NM
Ford,Edge,Gen1,2016-2021,2.0 TDCi BiTurbo,2.0,Diesel,238,500
Ford,Mustang,S550,2015-2023,5.0 V8,5.0,Petrol,450,529
Ford,Mustang,S650,2024-2026,2.3 EcoBoost,2.3,Petrol,315,475
BMW,6 Series,F13,2011-2018,640d,3.0,Diesel,313,630
BMW,7 Series,G11,2015-2022,730d,3.0,Diesel,265,620
BMW,M3,F80,2014-2018,3.0 Twin Turbo,3.0,Petrol,431,550
Audi,TT,8J,2006-2014,2.0 TFSI,2.0,Petrol,211,350
Audi,TT,8S,2014-2023,TTS 2.0,2.0,Petrol,310,380
Audi,RS3,8V,2015-2020,2.5 TFSI,2.5,Petrol,400,480
Volkswagen,Sharan,Gen2,2010-2022,2.0 TDI,2.0,Diesel,184,380
Volkswagen,Caddy,2K,2004-2015,1.9 TDI,1.9,Diesel,105,250
Volkswagen,Caddy,SB,2021-2026,2.0 TDI,2.0,Diesel,122,320
Vauxhall,Zafira,B,2005-2014,1.9 CDTi,1.9,Diesel,150,320
Vauxhall,Grandland,X,2017-2024,1.6 Turbo,1.6,Petrol,180,250
Mercedes-Benz,S-Class,W221,2006-2013,S350 CDI,3.0,Diesel,235,540
Mercedes-Benz,S-Class,W223,2021-2026,S500,3.0,Petrol,435,520
Mercedes-Benz,C63 AMG,W204,2008-2015,6.2 V8,6.2,Petrol,457,600
Toyota,Land Cruiser,J150,2010-2026,2.8 D-4D,2.8,Diesel,204,500
Toyota,GT86,ZN6,2012-2021,2.0 Boxer,2.0,Petrol,200,205
Nissan,370Z,Z34,2009-2021,3.7 V6,3.7,Petrol,328,363
Nissan,Navara,D40,2005-2015,2.5 dCi,2.5,Diesel,190,450
Land Rover,Range Rover,L405,2012-2021,4.4 SDV8,4.4,Diesel,339,740
Land Rover,Defender,L663,2020-2026,3.0 D300,3.0,Diesel,300,650
Jaguar,F-Type,X152,2013-2024,3.0 Supercharged,3.0,Petrol,380,460
Jaguar,I-Pace,X590,2018-2026,EV400,Electric,Electric,394,696
MINI,Paceman,R61,2013-2016,Cooper S,1.6,Petrol,184,240
Tesla,Model 3,Performance,2019-2026,Performance,Electric,Electric,460,640
Hyundai,i20,N,BC3,2021-2026,1.6 T-GDi,1.6,Petrol,204,275
Kia,Stinger,CK,2017-2023,3.3 V6 Twin Turbo,3.3,Petrol,366,510
Skoda,Fabia,Mk3,2014-2021,1.0 TSI,1.0,Petrol,110,200
Skoda,Fabia,Mk4,2021-2026,1.5 TSI,1.5,Petrol,150,250
SEAT,Tarraco,Gen1,2019-2026,2.0 TDI,2.0,Diesel,200,400
Peugeot,208,P21,2019-2026,1.2 PureTech,1.2,Petrol,130,230
Renault,Captur,Mk2,2020-2026,1.3 TCe,1.3,Petrol,155,270
Honda,Civic,FK8,2017-2022,Type R 2.0 VTEC Turbo,2.0,Petrol,320,400
Mazda,MX-5,ND,2015-2026,2.0 Skyactiv-G,2.0,Petrol,184,205
MG,HS Plug-in,Gen1,2021-2026,1.5 Turbo Hybrid,1.5,Hybrid,258,370
Porsche,911,991.2,2016-2019,3.0 Twin Turbo,3.0,Petrol,420,500
Volvo,V90,SPA,2017-2026,D5 AWD,2.0,Diesel,235,480
Subaru,Forester,SK,2019-2026,2.0 e-Boxer,2.0,Hybrid,150,194
Mitsubishi,Outlander,PHEV,2014-2026,2.4 Hybrid,2.4,Hybrid,221,300
Alfa Romeo,Stelvio,949,2017-2026,2.0 Turbo,2.0,Petrol,280,400
Citroen,Berlingo,K9,2018-2026,1.5 BlueHDi,1.5,Diesel,130,300
DS,DS3 Crossback,Gen1,2019-2026,1.2 PureTech,1.2,Petrol,130,230
Cupra,Leon,KL,2021-2026,2.0 TSI,2.0,Petrol,300,400`;

const csv5 = `Manufacturer,Model,Generation,Years,Engine,Displacement,Fuel,Stock_BHP,Stock_Torque_NM
Dacia,Duster,Gen2,2018-2026,1.3 TCe,1.3,Petrol,150,250
Dacia,Sandero,Gen3,2021-2026,1.0 TCe,1.0,Petrol,90,160
Dacia,Jogger,Gen1,2022-2026,1.6 Hybrid,1.6,Hybrid,140,148
Suzuki,Swift,Mk4,2017-2026,1.2 Dualjet Hybrid,1.2,Hybrid,83,107
Suzuki,Vitara,LY,2015-2026,1.4 Boosterjet Hybrid,1.4,Hybrid,129,235
Suzuki,S-Cross,Mk2,2021-2026,1.4 Boosterjet Hybrid,1.4,Hybrid,129,235
Suzuki,Jimny,Mk4,2018-2026,1.5 Dualjet,1.5,Petrol,102,130
Lexus,NX,AZ20,2021-2026,350h,2.5,Hybrid,244,239
Lexus,RX,AL20,2022-2026,500h,2.4,Hybrid,371,460
Lexus,IS,XE30,2013-2020,300h,2.5,Hybrid,223,221
Jeep,Renegade,BV,2014-2026,1.3 Turbo,1.3,Petrol,150,270
Jeep,Compass,M6,2017-2026,1.5 e-Hybrid,1.5,Hybrid,130,240
Jeep,Wrangler,JL,2018-2026,2.0 Turbo,2.0,Petrol,272,400
Fiat,500,312,2008-2026,1.0 Hybrid,1.0,Hybrid,70,92
Fiat,Tipo,356,2016-2026,1.5 Hybrid,1.5,Hybrid,130,240
Fiat,Panda,319,2012-2026,1.0 Hybrid,1.0,Hybrid,70,92
Fiat,Ducato,X290,2014-2026,2.2 MultiJet,2.2,Diesel,140,350
Volvo,XC40,536,2018-2026,B4,2.0,Hybrid,197,300
Volvo,V60,225,2018-2026,B5,2.0,Hybrid,250,350
Volvo,XC90,256,2015-2026,T8,2.0,Hybrid,455,709
Skoda,Kamiq,NW4,2019-2026,1.5 TSI,1.5,Petrol,150,250
Skoda,Scala,NW1,2019-2026,1.5 TSI,1.5,Petrol,150,250
SEAT,Arona,KJ7,2017-2026,1.0 TSI,1.0,Petrol,115,200
SEAT,Tarraco,Gen1,2019-2026,2.0 TSI,2.0,Petrol,245,370
Cupra,Born,K1,2022-2026,e-Boost 77kWh,Electric,Electric,231,310
Citroen,C3,SX,2016-2026,1.2 PureTech,1.2,Petrol,110,205
Citroen,C4,C41,2020-2026,1.2 PureTech,1.2,Petrol,130,230
Citroen,C3 Aircross,A88,2017-2026,1.2 PureTech,1.2,Petrol,130,230
DS,DS4,D41,2021-2026,1.6 E-Tense,1.6,Hybrid,225,360
Mitsubishi,ASX,GA,2010-2022,2.2 DI-D,2.2,Diesel,150,360
Mitsubishi,Eclipse Cross,GK,2018-2026,2.4 PHEV,2.4,Hybrid,188,320
Subaru,Crosstrek,GU,2024-2026,2.0 e-Boxer,2.0,Hybrid,136,182
Subaru,Outback,BT,2021-2026,2.5 Boxer,2.5,Petrol,169,252
MG,MG4,EH32,2022-2026,64kWh,Electric,Electric,203,250
MG,MG3,Hybrid+,2024-2026,1.5 Hybrid,1.5,Hybrid,194,250
MG,Cyberster,Gen1,2024-2026,77kWh AWD,Electric,Electric,536,725
Opel,Corsa,F,2019-2026,1.2 Turbo,1.2,Petrol,130,230
Opel,Astra,L,2022-2026,1.6 Hybrid,1.6,Hybrid,180,360
Iveco,Daily,6th Gen,2014-2026,3.0 HPI,3.0,Diesel,180,430
Smart,#1,Gen1,2023-2026,Brabus AWD,Electric,Electric,422,543`;

const csv = [csv1, csv2, csv3, csv4, csv5].join('\n');

const normalize = (s) => (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const makeAlias = {
  'mercedes-benz': 'mercedes',
  'land-rover': 'land-rover',
  'mini': 'mini',
  'seat': 'seat'
};

const modelAlias = {
  mazda: {
    '3': 'mazda3',
    '6': 'mazda6'
  },
  ds: {
    'ds7-crossback': 'ds-7'
  },
  mg: {
    'hs-plug-in': 'hs'
  },
  hyundai: {
    'i20-n': 'i20'
  }
};

const rows = csv
  .split('\n')
  .map((x) => x.trim())
  .filter((x) => x && !x.startsWith('Manufacturer,'))
  .map((line) => {
  const parts = line.split(',');
  const Stock_Torque_NM = parts[parts.length - 1];
  const Stock_BHP = parts[parts.length - 2];
  const Fuel = parts[parts.length - 3];
  const Displacement = parts[parts.length - 4];
  const Engine = parts[parts.length - 5];
  const Years = parts[parts.length - 6];
  const Generation = parts[parts.length - 7];
  const Manufacturer = parts[0];
  const Model = parts.slice(1, parts.length - 7).join(',');
  return { Manufacturer, Model, Generation, Years, Engine, Displacement, Fuel, Stock_BHP, Stock_Torque_NM };
});

const missingMake = [];
const missingModel = [];
const missingYearCoverage = [];
const missingEngine = [];

for (const row of rows) {
  const makeKey = makeAlias[normalize(row.Manufacturer)] || normalize(row.Manufacturer);
  const rawModelKey = normalize(row.Model);
  const modelKey = modelAlias[makeKey]?.[rawModelKey] || rawModelKey;

  const makeDb = db.VEHICLE_ENGINE_DATABASE[makeKey];
  if (!makeDb) {
    missingMake.push(row);
    continue;
  }

  const modelDb = makeDb[modelKey];
  if (!modelDb) {
    missingModel.push({ ...row, makeKey, modelKey });
    continue;
  }

  const [rowStart, rowEnd] = row.Years.split('-').map(Number);
  const ranges = Object.keys(modelDb).map((r) => {
    const [start, end] = r.split('-').map(Number);
    return { start, end, key: r };
  });

  const overlap = ranges.some((r) => !(rowEnd < r.start || rowStart > r.end));
  if (!overlap) {
    missingYearCoverage.push({ ...row, makeKey, modelKey, ranges: ranges.map((r) => r.key) });
    continue;
  }

  const overlappingRanges = ranges.filter((r) => !(rowEnd < r.start || rowStart > r.end));
  const engineNeedle = normalize(row.Engine);
  const hasEngine = overlappingRanges.some((r) => {
    const engineList = modelDb[r.key] || [];
    return engineList.some((engine) => normalize(engine).includes(engineNeedle));
  });

  if (!hasEngine) {
    missingEngine.push({ ...row, makeKey, modelKey, ranges: overlappingRanges.map((r) => r.key) });
  }
}

console.log('Rows checked:', rows.length);
console.log('Missing make:', missingMake.length);
console.log('Missing model:', missingModel.length);
console.log('Missing year coverage:', missingYearCoverage.length);
console.log('Missing engine match:', missingEngine.length);

if (missingModel.length) {
  console.log('\nMissing model rows:');
  missingModel.forEach((x) => console.log(`- ${x.Manufacturer} / ${x.Model} (${x.modelKey}) years ${x.Years}`));
}

if (missingYearCoverage.length) {
  console.log('\nMissing year coverage rows:');
  missingYearCoverage.forEach((x) => console.log(`- ${x.Manufacturer} / ${x.Model} years ${x.Years}; DB ranges: ${x.ranges.join(', ')}`));
}

if (missingEngine.length) {
  console.log('\nMissing engine rows:');
  missingEngine.forEach((x) => console.log(`- ${x.Manufacturer} / ${x.Model} years ${x.Years}; engine ${x.Engine}; DB ranges: ${x.ranges.join(', ')}`));
}

const groupedRaw = {};
const groupedNormalized = {};

for (const row of rows) {
  const makeRaw = row.Manufacturer.trim();
  const modelRaw = row.Model.trim();
  const years = row.Years.trim();
  const engineLabel = `${row.Engine.trim()} - ${row.Stock_BHP}hp`;

  if (!groupedRaw[makeRaw]) groupedRaw[makeRaw] = {};
  if (!groupedRaw[makeRaw][modelRaw]) groupedRaw[makeRaw][modelRaw] = {};
  if (!groupedRaw[makeRaw][modelRaw][years]) groupedRaw[makeRaw][modelRaw][years] = [];
  if (!groupedRaw[makeRaw][modelRaw][years].includes(engineLabel)) {
    groupedRaw[makeRaw][modelRaw][years].push(engineLabel);
  }

  const makeKey = makeAlias[normalize(row.Manufacturer)] || normalize(row.Manufacturer);
  const modelBaseKey = normalize(row.Model);
  const modelKey = modelAlias[makeKey]?.[modelBaseKey] || modelBaseKey;

  if (!groupedNormalized[makeKey]) groupedNormalized[makeKey] = {};
  if (!groupedNormalized[makeKey][modelKey]) groupedNormalized[makeKey][modelKey] = {};
  if (!groupedNormalized[makeKey][modelKey][years]) groupedNormalized[makeKey][modelKey][years] = [];
  if (!groupedNormalized[makeKey][modelKey][years].includes(engineLabel)) {
    groupedNormalized[makeKey][modelKey][years].push(engineLabel);
  }
}

for (const make of Object.keys(groupedRaw)) {
  for (const model of Object.keys(groupedRaw[make])) {
    for (const yearRange of Object.keys(groupedRaw[make][model])) {
      groupedRaw[make][model][yearRange].sort();
    }
  }
}

for (const make of Object.keys(groupedNormalized)) {
  for (const model of Object.keys(groupedNormalized[make])) {
    for (const yearRange of Object.keys(groupedNormalized[make][model])) {
      groupedNormalized[make][model][yearRange].sort();
    }
  }
}

fs.writeFileSync('./uk-vehicles-grouped.json', JSON.stringify(groupedRaw, null, 2), 'utf8');
fs.writeFileSync('./uk-vehicles-grouped-normalized.json', JSON.stringify(groupedNormalized, null, 2), 'utf8');

console.log('\nGrouped JSON written:');
console.log('- ./uk-vehicles-grouped.json (human-readable make/model names)');
console.log('- ./uk-vehicles-grouped-normalized.json (keys match vehicle database format)');
