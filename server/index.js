const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const authRoutes=require('./routes/auth.js');


const mongoose=require('mongoose');    

const eventRoutes=require('./routes/events.js');
const bookingRoutes=require('./routes/booking.js');

dotenv.config();




const app=express();


app.use(cors());

app.use(express.json());

//routes
app.use('/api/auth',authRoutes);

app.use('/api/events',eventRoutes);

app.use('/api/bookings',bookingRoutes);


//connect to mongoose
mongoose.connect(process.env.MONGO_URI,{
   
}).then(()=>{
    console.log('Connected to MongoDB');
}).catch((error)=>{
    console.error('Error connecting to MongoDB',err); 
});

const PORT=process.env.PORT || 5000;
 
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

