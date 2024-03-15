const responseData = (res, status,message,  content)=>{
  res.json({
    status,
    message,
    data : content,
    date: new Date(),
});
};
export default responseData;