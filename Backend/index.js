const express = require('express');
const superagent = require('superagent');
const server = express();
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const config = require('./configs');

const cors = require('cors')
server.use(cors()); // เปิดใช้ CORS สำหรับทุก origin

// ตั้งค่า Session สำหรับระบบ
server.use(expressSession({
    secret: 'Jaroon',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

// ตั้งค่าการ Parse ตัวแปรเมื่อ Client ส่งข้อมูลเข้ามา
server.use(bodyParser.urlencoded({ extended: false, limit: '500MB' }));
server.use(bodyParser.json({ limit: '500MB' }));

// Allow content
server.use('/api/uploads', express.static(`${__dirname}/uploads/news`));
server.use('/api/uploads', express.static(`${__dirname}/uploads/profile`));
server.use('/api/uploads', express.static(`${__dirname}/uploads/farmer`));
server.use('/api/uploads', express.static(`${__dirname}/uploads/buying`));
server.use('/api/uploads', express.static(`${__dirname}/uploads/retail`));
server.use('/api/uploads', express.static(`${__dirname}/uploads/whole`));
server.use('/api/uploads', express.static(`${__dirname}/uploads/qrcode`));
server.use('/api/uploads', express.static(`${__dirname}/uploads/card`));

// production build  แล้ว
if (config.isProduction) server.use(express.static(`${__dirname}/front`));

// สร้าง Custom function
server.use(require('./configs/middleware'));
// เรียกใช้งาน routes
server.use('/api', require('./routes'));

server.get('*', (req, res) => {
    //ทำการเลือกเข้าระบบระหว่าง admin หรือ user
    if (config.isProduction)
        return res.sendFile(`${__dirname}/front/index.html`);

    res.end(`<h1>Backend server is started : USER.</h1>`);
});

// api ติดตามพัสดุ
server.post('/api/tracking', async (req, res) => {
    try {
      const response = await superagent
        .post('https://api.etrackings.com/api/v3/tracks/find')
        .send(req.body)
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'th')
        .set('Etrackings-Key-Secret', 'ef454771722a9a281ebe5a88c616e07bf20756c5693cdadbc0929151e1d0b514af0c1fb0d4590d323a979662b32ef75f102e99e98bd8780166e6c8edf3e35b16b5c7b46eed52cd1178416c')
        .set('Etrackings-Api-Key', '48723e871dcbae86ef1771ce91df293d963a3345')
  
        console.log('res', response.body)
        res.json( response.body );
        
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error fetching data');
    }
  });

// console.log มาแสดงดู
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is started, Port ${PORT}.`));
