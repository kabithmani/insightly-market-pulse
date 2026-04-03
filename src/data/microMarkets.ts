export interface MicroMarket {
  name: string;
  city: string;
  lat: number;
  lng: number;
  avg_psf: number;
  yoy_change: number;
  cmi: number;
  land_deals: string[];
  infra_news: string[];
}

export const microMarkets: MicroMarket[] = [
  // Bangalore (20)
  {"name":"Whitefield","city":"Bangalore","lat":12.9698,"lng":77.7499,"avg_psf":11200,"yoy_change":12,"cmi":8.2,"land_deals":["Prestige 42 acres 380Cr","Century 18 acres 165Cr"],"infra_news":["BIAL T2 2027","Metro Yellow Line"]},
  {"name":"Sarjapur Road","city":"Bangalore","lat":12.8742,"lng":77.7100,"avg_psf":10500,"yoy_change":14,"cmi":8.5,"land_deals":["Brigade mixed-use launch"],"infra_news":["ORR widening","Metro Phase 3"]},
  {"name":"Kanakapura Road","city":"Bangalore","lat":12.8488,"lng":77.5629,"avg_psf":7500,"yoy_change":31,"cmi":9.0,"land_deals":["Shriram Eastern Heights"],"infra_news":["Metro Yellow Line confirmed"]},
  {"name":"Outer Ring Road","city":"Bangalore","lat":12.9698,"lng":77.6800,"avg_psf":9800,"yoy_change":8,"cmi":7.6,"land_deals":[],"infra_news":["GCC expansion"]},
  {"name":"Hebbal","city":"Bangalore","lat":13.0359,"lng":77.5974,"avg_psf":8400,"yoy_change":10,"cmi":7.9,"land_deals":[],"infra_news":["Manyata Tech Park"]},
  {"name":"Yelahanka","city":"Bangalore","lat":13.1007,"lng":77.5963,"avg_psf":7200,"yoy_change":15,"cmi":8.1,"land_deals":["Century 18 acres 165Cr"],"infra_news":["Aerospace Corridor"]},
  {"name":"Devanahalli","city":"Bangalore","lat":13.2471,"lng":77.7091,"avg_psf":5800,"yoy_change":18,"cmi":8.8,"land_deals":["Prestige 42 acres 380Cr"],"infra_news":["BIAL T2","Aerospace SEZ"]},
  {"name":"Electronic City","city":"Bangalore","lat":12.8450,"lng":77.6600,"avg_psf":6900,"yoy_change":5,"cmi":6.5,"land_deals":[],"infra_news":["Tata IT campus expansion"]},
  {"name":"Bannerghatta Road","city":"Bangalore","lat":12.8582,"lng":77.5722,"avg_psf":7800,"yoy_change":16,"cmi":7.8,"land_deals":[],"infra_news":[]},
  {"name":"JP Nagar","city":"Bangalore","lat":12.9067,"lng":77.5849,"avg_psf":8900,"yoy_change":11,"cmi":7.7,"land_deals":[],"infra_news":[]},
  {"name":"Koramangala","city":"Bangalore","lat":12.9279,"lng":77.6225,"avg_psf":13500,"yoy_change":9,"cmi":8.0,"land_deals":[],"infra_news":[]},
  {"name":"Indiranagar","city":"Bangalore","lat":12.9784,"lng":77.6408,"avg_psf":14200,"yoy_change":7,"cmi":7.8,"land_deals":[],"infra_news":[]},
  {"name":"HSR Layout","city":"Bangalore","lat":12.9120,"lng":77.6396,"avg_psf":11800,"yoy_change":11,"cmi":8.1,"land_deals":[],"infra_news":[]},
  {"name":"KR Puram","city":"Bangalore","lat":13.0009,"lng":77.7009,"avg_psf":9500,"yoy_change":10,"cmi":7.6,"land_deals":[],"infra_news":["Metro Phase 2A"]},
  {"name":"Bagalur","city":"Bangalore","lat":13.2291,"lng":77.6920,"avg_psf":4800,"yoy_change":22,"cmi":8.5,"land_deals":[],"infra_news":["Aerospace Corridor"]},
  {"name":"Thanisandra","city":"Bangalore","lat":13.0717,"lng":77.6222,"avg_psf":6800,"yoy_change":14,"cmi":7.9,"land_deals":[],"infra_news":[]},
  {"name":"Hoskote","city":"Bangalore","lat":13.0792,"lng":77.7900,"avg_psf":3800,"yoy_change":28,"cmi":8.2,"land_deals":["Shell entities aggregating 60 acres"],"infra_news":["ITIR Phase 2 under consideration"]},
  {"name":"Yeshwanthpur","city":"Bangalore","lat":13.0290,"lng":77.5523,"avg_psf":8900,"yoy_change":8,"cmi":7.4,"land_deals":[],"infra_news":[]},
  {"name":"Malleshwaram","city":"Bangalore","lat":13.0039,"lng":77.5706,"avg_psf":12500,"yoy_change":5,"cmi":7.2,"land_deals":[],"infra_news":[]},
  {"name":"Jigani","city":"Bangalore","lat":12.7855,"lng":77.6390,"avg_psf":4200,"yoy_change":18,"cmi":7.5,"land_deals":[],"infra_news":[]},
  // Pune (20)
  {"name":"Hinjewadi","city":"Pune","lat":18.5912,"lng":73.7365,"avg_psf":7800,"yoy_change":18,"cmi":8.7,"land_deals":[],"infra_news":["Metro Phase 3","IT Park expansion"]},
  {"name":"Wakad","city":"Pune","lat":18.5882,"lng":73.7638,"avg_psf":7200,"yoy_change":15,"cmi":8.2,"land_deals":[],"infra_news":[]},
  {"name":"Baner","city":"Pune","lat":18.5585,"lng":73.7806,"avg_psf":8500,"yoy_change":12,"cmi":8.0,"land_deals":[],"infra_news":[]},
  {"name":"Kharadi","city":"Pune","lat":18.5574,"lng":73.9394,"avg_psf":7600,"yoy_change":16,"cmi":8.4,"land_deals":[],"infra_news":["EON Free Zone expansion"]},
  {"name":"Viman Nagar","city":"Pune","lat":18.5628,"lng":73.9117,"avg_psf":8800,"yoy_change":10,"cmi":7.9,"land_deals":[],"infra_news":[]},
  {"name":"Kalyani Nagar","city":"Pune","lat":18.5489,"lng":73.8975,"avg_psf":9200,"yoy_change":9,"cmi":7.8,"land_deals":[],"infra_news":[]},
  {"name":"Magarpatta City","city":"Pune","lat":18.5165,"lng":73.9045,"avg_psf":8200,"yoy_change":11,"cmi":8.1,"land_deals":[],"infra_news":[]},
  {"name":"Hadapsar","city":"Pune","lat":18.4997,"lng":73.9327,"avg_psf":6800,"yoy_change":13,"cmi":7.7,"land_deals":[],"infra_news":[]},
  {"name":"Kondhwa","city":"Pune","lat":18.4744,"lng":73.8834,"avg_psf":6200,"yoy_change":10,"cmi":7.3,"land_deals":[],"infra_news":[]},
  {"name":"Bibwewadi","city":"Pune","lat":18.4713,"lng":73.8654,"avg_psf":6500,"yoy_change":8,"cmi":7.0,"land_deals":[],"infra_news":[]},
  {"name":"Kothrud","city":"Pune","lat":18.5051,"lng":73.8137,"avg_psf":8900,"yoy_change":7,"cmi":7.5,"land_deals":[],"infra_news":[]},
  {"name":"Shivaji Nagar","city":"Pune","lat":18.5311,"lng":73.8554,"avg_psf":9500,"yoy_change":6,"cmi":7.4,"land_deals":[],"infra_news":[]},
  {"name":"Pimple Saudagar","city":"Pune","lat":18.5944,"lng":73.8086,"avg_psf":7100,"yoy_change":14,"cmi":8.0,"land_deals":[],"infra_news":[]},
  {"name":"Aundh","city":"Pune","lat":18.5568,"lng":73.8088,"avg_psf":8600,"yoy_change":10,"cmi":7.9,"land_deals":[],"infra_news":[]},
  {"name":"Balewadi","city":"Pune","lat":18.5609,"lng":73.7702,"avg_psf":7900,"yoy_change":17,"cmi":8.5,"land_deals":[],"infra_news":["Sports complex","New expressway"]},
  {"name":"Mahalunge","city":"Pune","lat":18.5675,"lng":73.7532,"avg_psf":6800,"yoy_change":19,"cmi":8.3,"land_deals":[],"infra_news":[]},
  {"name":"Ravet","city":"Pune","lat":18.6399,"lng":73.7402,"avg_psf":5900,"yoy_change":20,"cmi":8.2,"land_deals":[],"infra_news":[]},
  {"name":"Punawale","city":"Pune","lat":18.6073,"lng":73.7484,"avg_psf":6100,"yoy_change":18,"cmi":8.0,"land_deals":[],"infra_news":[]},
  {"name":"Tathawade","city":"Pune","lat":18.6076,"lng":73.7207,"avg_psf":5700,"yoy_change":22,"cmi":8.4,"land_deals":[],"infra_news":[]},
  {"name":"Wagholi","city":"Pune","lat":18.5744,"lng":73.9512,"avg_psf":5400,"yoy_change":24,"cmi":8.6,"land_deals":[],"infra_news":[]},
  // Mumbai (20)
  {"name":"Bandra West","city":"Mumbai","lat":19.0557,"lng":72.8250,"avg_psf":35000,"yoy_change":8,"cmi":7.8,"land_deals":[],"infra_news":["Coastal Road"]},
  {"name":"Juhu","city":"Mumbai","lat":19.0984,"lng":72.8274,"avg_psf":42000,"yoy_change":6,"cmi":7.5,"land_deals":[],"infra_news":[]},
  {"name":"Worli","city":"Mumbai","lat":19.0003,"lng":72.8127,"avg_psf":48000,"yoy_change":9,"cmi":8.0,"land_deals":[],"infra_news":["Coastal Road"]},
  {"name":"Lower Parel","city":"Mumbai","lat":18.9980,"lng":72.8238,"avg_psf":38000,"yoy_change":10,"cmi":8.1,"land_deals":[],"infra_news":[]},
  {"name":"Dadar","city":"Mumbai","lat":19.0180,"lng":72.8414,"avg_psf":28000,"yoy_change":7,"cmi":7.4,"land_deals":[],"infra_news":[]},
  {"name":"Powai","city":"Mumbai","lat":19.1171,"lng":72.9056,"avg_psf":22000,"yoy_change":11,"cmi":8.2,"land_deals":[],"infra_news":[]},
  {"name":"Andheri","city":"Mumbai","lat":19.1192,"lng":72.8425,"avg_psf":18500,"yoy_change":9,"cmi":7.7,"land_deals":[],"infra_news":["Metro Line 1"]},
  {"name":"Ghatkopar","city":"Mumbai","lat":19.0882,"lng":72.9114,"avg_psf":16500,"yoy_change":8,"cmi":7.5,"land_deals":[],"infra_news":[]},
  {"name":"Chembur","city":"Mumbai","lat":19.0534,"lng":72.8991,"avg_psf":15500,"yoy_change":7,"cmi":7.3,"land_deals":[],"infra_news":[]},
  {"name":"Vikhroli","city":"Mumbai","lat":19.1147,"lng":72.9373,"avg_psf":14500,"yoy_change":6,"cmi":7.1,"land_deals":[],"infra_news":[]},
  {"name":"Thane","city":"Mumbai","lat":19.2183,"lng":72.9781,"avg_psf":12000,"yoy_change":12,"cmi":8.0,"land_deals":[],"infra_news":["Metro Line 4"]},
  {"name":"Navi Mumbai","city":"Mumbai","lat":19.0403,"lng":73.0145,"avg_psf":11000,"yoy_change":14,"cmi":8.3,"land_deals":[],"infra_news":["Navi Mumbai Airport"]},
  {"name":"Kharghar","city":"Mumbai","lat":19.0383,"lng":73.0647,"avg_psf":10500,"yoy_change":13,"cmi":8.1,"land_deals":[],"infra_news":[]},
  {"name":"Ulwe","city":"Mumbai","lat":18.9728,"lng":73.0603,"avg_psf":8500,"yoy_change":18,"cmi":8.6,"land_deals":[],"infra_news":["Navi Mumbai Airport"]},
  {"name":"Mira Road","city":"Mumbai","lat":19.2784,"lng":72.8690,"avg_psf":9500,"yoy_change":10,"cmi":7.6,"land_deals":[],"infra_news":[]},
  {"name":"Borivali","city":"Mumbai","lat":19.2311,"lng":72.8571,"avg_psf":13500,"yoy_change":8,"cmi":7.5,"land_deals":[],"infra_news":[]},
  {"name":"Kandivali","city":"Mumbai","lat":19.2019,"lng":72.8663,"avg_psf":12800,"yoy_change":7,"cmi":7.4,"land_deals":[],"infra_news":[]},
  {"name":"Malad","city":"Mumbai","lat":19.1867,"lng":72.8476,"avg_psf":12500,"yoy_change":7,"cmi":7.4,"land_deals":[],"infra_news":[]},
  {"name":"Goregaon","city":"Mumbai","lat":19.1645,"lng":72.8492,"avg_psf":14000,"yoy_change":8,"cmi":7.6,"land_deals":[],"infra_news":[]},
  {"name":"Mulund","city":"Mumbai","lat":19.1704,"lng":72.9562,"avg_psf":15000,"yoy_change":9,"cmi":7.7,"land_deals":[],"infra_news":[]},
];
