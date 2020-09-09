const mainFunction = () => {
  var id = 15;
  const checkId = () => {
    if (id){
      return Promise.resolve(true);
    }
    else{
      return Promise.resolve(false);
    }
  }

  checkId().then((result) => {
    if(result){
      console.log("Id is there");
    } else{
      console.log("Id is not there");
    }

  });
}

mainFunction();
