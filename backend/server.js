const express = require('express');
const cors = require('cors');
const adminRouter = require('./router/adminRouter');
const userRouter = require('./router/userRouter.');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.listen(1111, () => {
    console.log("Server running on port 1111");
});
