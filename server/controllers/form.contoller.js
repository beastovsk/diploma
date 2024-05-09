const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'coctencoflez@gmail.com',
    pass: 'izjn njvi cxap muvc'
  }
});

const formController = { 
  sendUserData: async (req, res) => {
    try {
      const { name, phone } = req.body;
      console.log(phone);
      
      const mailOptions = {
        from: 'coctencoflez@gmail.com',
        to: 'coctencoflez@gmail.com',
        subject: 'Тема письма',
        text: `Имя: ${name}\nТелефон: ${phone}`, 
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).json({ error: "Ошибка отправки электронной почты" });
        } else {
          res.json({ message: "Данные успешно отправлены на почту" });
        }
      });
    } catch (error) {
      console.error('Ошибка при отправке данных на почту:', error);
      res.status(500).json({ error: "Ошибка при отправке данных на почту" });
    }
  }
};

module.exports = formController;
