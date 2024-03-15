const responseData = (res, message, status, content)=>{
  res.json({
    message,
    status,
    data : content,
    date: new Date(),
});
};
export default responseData;