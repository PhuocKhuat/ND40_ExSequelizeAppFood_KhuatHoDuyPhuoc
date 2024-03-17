const responseData = (res, status,message,  content)=>{
  res.status(status).json({
    status,
    message,
    data : content,
    date: new Date(),
});
};
export default responseData;